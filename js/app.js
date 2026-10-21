(() => {
  const STORAGE_KEY = 'agriSetup';
  const LANG_NAME = { si: 'Sinhala', ta: 'Tamil', en: 'English' };
  const TRAIL_STEP = { 'step-language': 0, 'step-province': 1, 'step-district': 2, 'step-ds': 3 };

  const UI = {
    si: {
      provinceTitle: 'ඔබේ පළාත තෝරන්න', districtTitle: 'ඔබේ දිස්ත්‍රික්කය තෝරන්න',
      dsTitle: 'ඔබේ පළාත් පාලන ආයතනය තෝරන්න', dsNote: 'මෙම දිස්ත්‍රික්කයේ ආයතන ඉක්මනින් එකතු කෙරේ.',
      typeMC: 'මහ නගර සභා', typeUC: 'නගර සභා', typePS: 'ප්‍රාදේශීය සභා', choose: 'තෝරන්න…',
      next: 'ඉදිරියට', back: 'ආපසු', save: 'සුරකින්න',
      summaryTitle: 'ඔබේ ස්ථානය සකසා ඇත', openDash: 'මුල් පිටුවට යන්න',
      language: 'භාෂාව', province: 'පළාත', district: 'දිස්ත්‍රික්කය', ds: 'පළාත් පාලන ආයතනය',
      dashTitle: 'මුල් පිටුව', dashSub: 'ඔබේ කෘෂිකාර්මික මෙවලම් මෙහි දිස්වේ.', change: 'ස්ථානය වෙනස් කරන්න'
    },
    ta: {
      provinceTitle: 'உங்கள் மாகாணத்தைத் தேர்ந்தெடுக்கவும்', districtTitle: 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
      dsTitle: 'உங்கள் உள்ளூராட்சி மன்றத்தைத் தேர்ந்தெடுக்கவும்', dsNote: 'இந்த மாவட்டத்தின் மன்றங்கள் விரைவில் சேர்க்கப்படும்.',
      typeMC: 'மாநகர சபைகள்', typeUC: 'நகர சபைகள்', typePS: 'பிரதேச சபைகள்', choose: 'தேர்ந்தெடுக்கவும்…',
      next: 'தொடரவும்', back: 'பின்செல்', save: 'சேமிக்கவும்',
      summaryTitle: 'உங்கள் இடம் அமைக்கப்பட்டது', openDash: 'முகப்புப் பக்கத்தைத் திறக்கவும்',
      language: 'மொழி', province: 'மாகாணம்', district: 'மாவட்டம்', ds: 'உள்ளூராட்சி மன்றம்',
      dashTitle: 'முகப்புப் பக்கம்', dashSub: 'உங்கள் விவசாயக் கருவிகள் இங்கே தோன்றும்.', change: 'இடத்தை மாற்றவும்'
    },
    en: {
      provinceTitle: 'Select your province', districtTitle: 'Select your district',
      dsTitle: 'Select your local authority', dsNote: 'Local authorities for this district are being added soon.',
      typeMC: 'Municipal Councils', typeUC: 'Urban Councils', typePS: 'Pradeshiya Sabhas', choose: 'Choose…',
      next: 'Continue', back: 'Back', save: 'Save',
      summaryTitle: 'Your location is set', openDash: 'Open dashboard',
      language: 'Language', province: 'Province', district: 'District', ds: 'Local authority',
      dashTitle: 'Home Dashboard', dashSub: 'Your farming tools will appear here.', change: 'Change location'
    }
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const rows = typeof sriLankaData !== 'undefined' ? sriLankaData : [];
  if (!rows.length) console.error('sriLankaData is missing or empty. Check js/data.js.');

  const state = { lang: 'en', province: '', district: '', ds: '' }; // province/district/ds hold English names
  const label = (row, level, lang) => row[`${level}_${LANG_NAME[lang]}`];
  const t = (key) => UI[state.lang][key];

  /* ---------- Reusable background ---------- */
  let activeBg = 'bgA';
  function setBackground(url) {
    if (!url) return;
    const next = $(activeBg === 'bgA' ? '#bgB' : '#bgA');
    const prev = $('#' + activeBg);
    next.style.setProperty('--bg', `url("${url}")`);
    next.classList.add('visible');
    prev.classList.remove('visible');
    activeBg = next.id;
  }
  window.setBackground = setBackground; // call from the console or your own code if needed

  /* ---------- Language ---------- */
  function applyLanguage(lang) {
    state.lang = lang;
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    fillSelect('#sel-province', 'Province', rows, state.province);
    fillSelect('#sel-district', 'District', districtRows(), state.district);
    refreshDs();
  }

  /* ---------- Data helpers ---------- */
  const districtRows = () => rows.filter((r) => r.Province_English === state.province);
  const dsRows = () => districtRows().filter((r) => r.District_English === state.district);

  function fillSelect(sel, level, source, selected) {
    const el = $(sel);
    const seen = new Map();
    source.forEach((r) => { const k = r[`${level}_English`]; if (k && !seen.has(k)) seen.set(k, r); });
    const sortFn = (x, y) => label(x, level, state.lang).localeCompare(label(y, level, state.lang), state.lang);
    const opt = (r) => {
      const val = r[`${level}_English`];
      return `<option value="${val.replace(/"/g, '&quot;')}" ${val === selected ? 'selected' : ''}>${label(r, level, state.lang)}</option>`;
    };
    const items = [...seen.values()];
    let html = `<option value="" disabled ${selected ? '' : 'selected'}>${t('choose')}</option>`;
    if (level === 'DS') {   // group: Municipal / Urban / Pradeshiya Sabha
      ['MC', 'UC', 'PS'].forEach((ty) => {
        const g = items.filter((r) => r.DS_Type === ty).sort(sortFn);
        if (g.length) html += `<optgroup label="${t('type' + ty)}">${g.map(opt).join('')}</optgroup>`;
      });
    } else html += items.sort(sortFn).map(opt).join('');
    el.innerHTML = html;
  }
  function refreshDs() {
    fillSelect('#sel-ds', 'DS', dsRows(), state.ds);
    $('#ds-note').hidden = !state.district || dsRows().some((r) => r.DS_English);
  }

  /* ---------- Step navigation ---------- */
  function show(id) {
    $$('.screen').forEach((s) => s.classList.remove('active'));
    const screen = document.getElementById(id);
    setBackground(screen.dataset.bg);
    screen.classList.add('active');
    screen.querySelector('h1, h2')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);

    const trail = $('#trail');
    const idx = TRAIL_STEP[id];
    trail.classList.toggle('show', idx !== undefined);
    [...trail.children].forEach((dot, i) => {
      dot.className = idx === undefined ? '' : i < idx ? 'done' : i === idx ? 'now' : '';
    });
  }

  /* ---------- Saving ---------- */
  function findRow() {
    return rows.find((r) => r.Province_English === state.province &&
      r.District_English === state.district && r.DS_English === state.ds);
  }
  function names(row, level) {
    return { si: label(row, level, 'si'), ta: label(row, level, 'ta'), en: label(row, level, 'en') };
  }
  function save() {
    const row = findRow();
    if (!row) return null;
    const record = {
      language: state.lang,
      province: names(row, 'Province'),
      district: names(row, 'District'),
      ds: names(row, 'DS'),
      savedAt: new Date().toISOString()
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch (e) { console.warn('Could not save', e); }
    return record;
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
  }

  function renderSummary(rec) {
    const lang = rec.language;
    const items = [
      [UI[lang].language, { si: 'සිංහල', ta: 'தமிழ்', en: 'English' }[lang]],
      [UI[lang].province, rec.province[lang]],
      [UI[lang].district, rec.district[lang]],
      [UI[lang].ds, rec.ds[lang]]
    ];
    $('#summary').innerHTML = items.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  }
  function showDashboard(rec) {
    $('#dash-location').textContent = `${rec.ds[rec.language]}, ${rec.district[rec.language]}`;
    show('dashboard');
    if (window.renderDashboard) window.renderDashboard(rec);
  }

  /* ---------- Events ---------- */
  $$('.lang-card').forEach((btn) => btn.addEventListener('click', () => {
    applyLanguage(btn.dataset.lang);
    show('step-province');
  }));

  $$('[data-back]').forEach((btn) => btn.addEventListener('click', () => show(btn.dataset.back)));

  $('#sel-province').addEventListener('change', (e) => {
    state.province = e.target.value; state.district = ''; state.ds = '';
    fillSelect('#sel-district', 'District', districtRows(), '');
    $('#next-district').disabled = true; $('#next-ds').disabled = true;
    $('#next-province').disabled = false;
  });
  $('#next-province').addEventListener('click', () => show('step-district'));

  $('#sel-district').addEventListener('change', (e) => {
    state.district = e.target.value; state.ds = '';
    refreshDs();
    $('#next-ds').disabled = true;
    $('#next-district').disabled = false;
  });
  $('#next-district').addEventListener('click', () => show('step-ds'));

  $('#sel-ds').addEventListener('change', (e) => {
    state.ds = e.target.value;
    $('#next-ds').disabled = !state.ds;
  });
  $('#next-ds').addEventListener('click', () => {
    const rec = save();
    if (!rec) return;
    renderSummary(rec);
    show('step-summary');
  });

  $('#open-dashboard').addEventListener('click', () => { const rec = load(); if (rec) showDashboard(rec); });

  $('#reset').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state, { province: '', district: '', ds: '' });
    ['province', 'district', 'ds'].forEach((k) => { $('#next-' + k).disabled = true; });
    applyLanguage(state.lang);
    show('step-language');
  });

  /* ---------- Start ---------- */
  applyLanguage('en');
  const saved = load();
  if (saved) {
    applyLanguage(saved.language);
    showDashboard(saved);
  } else {
    show('step-language');
  }
})();