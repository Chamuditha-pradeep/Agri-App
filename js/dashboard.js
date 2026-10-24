(() => {
  const IDX = { si: 0, ta: 1, en: 2 };
  const LOC = { si: 'si-LK', ta: 'ta-LK', en: 'en-LK' };
  const D = {
    tabClimate: ['කාලගුණය සහ පස', 'வானிலை & மண்', 'Weather & soil'],
    tabCrops: ['බෝග', 'பயிர்கள்', 'Crops'],
    loading: ['දත්ත ලබාගනිමින්…', 'தரவு பெறப்படுகிறது…', 'Loading data…'],
    failed: ['කාලගුණ දත්ත ලබාගත නොහැකි විය. අන්තර්ජාලය පරීක්ෂා කරන්න.', 'வானிலை தரவைப் பெற முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்.', "Couldn't load weather. Check your connection."],
    temp: ['උෂ්ණත්වය', 'வெப்பநிலை', 'Temperature'],
    hum: ['ආර්ද්‍රතාව', 'ஈரப்பதம்', 'Humidity'],
    rain: ['වර්ෂාපතනය', 'மழை', 'Rainfall'],
    wind: ['සුළං වේගය', 'காற்றின் வேகம்', 'Wind'],
    sMoist: ['පසේ තෙතමනය', 'மண் ஈரப்பதம்', 'Soil moisture'],
    sTemp: ['පසේ උෂ්ණත්වය', 'மண் வெப்பநிலை', 'Soil temperature'],
    forecast: ['දින 5 අනාවැකිය', '5 நாள் முன்னறிவிப்பு', '5-day forecast'],
    soilTitle: ['පසේ ස්වභාවය', 'மண்ணின் தன்மை', 'Soil profile'],
    soilType: ['පස් වර්ගය', 'மண் வகை', 'Soil type'],
    color: ['වර්ණය', 'நிறம்', 'Colour'],
    ph: ['pH අගය', 'pH மதிப்பு', 'pH'],
    zone: ['දේශගුණික කලාපය', 'காலநிலை வலயம்', 'Climate zone'],
    soilNote: ['දිස්ත්‍රික්ක මට්ටමේ සාමාන්‍ය මගපෙන්වීමක් පමණි. නිවැරදි pH අගය සඳහා ඔබේ ඉඩමේ පස පරීක්ෂා කරන්න (කෘෂිකර්ම දෙපාර්තමේන්තුව).', 'இது மாவட்ட அளவிலான பொது வழிகாட்டி மட்டுமே. துல்லியமான pH க்கு உங்கள் நிலத்தின் மண்ணைப் பரிசோதிக்கவும் (விவசாயத் திணைக்களம்).', "A district-level general guide only. Test your own field's soil for an accurate pH (Department of Agriculture)."],
    live: ['සජීවී දත්ත: Open-Meteo', 'நேரடி தரவு: Open-Meteo', 'Live data: Open-Meteo'],
    suited: ['ඔබේ කලාපයට සුදුසුයි', 'உங்கள் வலயத்திற்கு ஏற்றது', 'Suited to your zone'],
    lessSuited: ['ඔබේ කලාපයට අඩුවෙන් සුදුසුයි', 'உங்கள் வலயத்திற்கு குறைவான பொருத்தம்', 'Less suited to your zone'],
    more: ['තවත් බෝග ඉක්මනින් එකතු කෙරේ.', 'மேலும் பயிர்கள் விரைவில் சேர்க்கப்படும்.', 'More crops are being added.'],
    caution: ['රසායන ද්‍රව්‍ය භාවිතයේදී කෘෂිකර්ම දෙපාර්තමේන්තුවේ නිර්දේශ සහ ලේබලයේ උපදෙස් අනුගමනය කරන්න.', 'இரசாயனங்களைப் பயன்படுத்தும்போது விவசாயத் திணைக்கள பரிந்துரைகளையும் லேபிள் அறிவுறுத்தல்களையும் பின்பற்றவும்.', 'For chemicals, follow Department of Agriculture recommendations and the product label.'],
    search: ['බෝගය සොයන්න…', 'பயிரைத் தேடுங்கள்…', 'Search a crop…'],
    noCrops: ['තවම බෝග එකතු කර නැත.', 'இன்னும் பயிர்கள் சேர்க்கப்படவில்லை.', 'No crops added yet.'],
    noResults: ['ප්‍රතිඵල නැත.', 'முடிவுகள் இல்லை.', 'No results.'],
    back: ['← ආපසු', '← பின்செல்', '← Back'],
    mTitle: ['බෙහෙත් සහ ද්‍රව්‍ය', 'மருந்துகள் & பொருட்கள்', 'Medicines & products'],
    tchemical: ['රසායනික', 'இரசாயன', 'Chemical'],
    torganic: ['දේශීය / කාබනික', 'இயற்கை / சேதன', 'Natural / organic'],
    tfertilizer: ['පොහොර', 'உரம்', 'Fertilizer'],
    grow: ['වගා කරන ආකාරය', 'பயிரிடும் முறை', 'How to grow'],
    fertChem: ['රසායනික පොහොර', 'இரசாயன உரம்', 'Chemical fertilizer'],
    fertOrg: ['කාබනික පොහොර', 'சேதன உரம்', 'Organic fertilizer'],
    pestChem: ['පලිබෝධ - රසායනික ක්‍රම', 'பீடை கட்டுப்பாடு - இரசாயன', 'Pests - chemical control'],
    pestOrg: ['පලිබෝධ - දේශීය ක්‍රම', 'பீடை கட்டுப்பாடு - இயற்கை', 'Pests - natural methods'],
    care: ['නඩත්තුව', 'பராமரிப்பு', 'Maintenance'],
    harvest: ['අස්වනු නෙලීම', 'அறுவடை', 'Harvesting'],
    sky: {
      clear: ['පැහැදිලි', 'தெளிவு', 'Clear'], cloud: ['වලාකුළු සහිත', 'மேகமூட்டம்', 'Cloudy'],
      fog: ['මීදුම', 'மூடுபனி', 'Fog'], rain: ['වැසි', 'மழை', 'Rain'],
      storm: ['ගිගුරුම් සහිත වැසි', 'இடியுடன் மழை', 'Thunderstorm']
    }
  };
  const SECTIONS = ['grow', 'fertChem', 'fertOrg', 'pestChem', 'pestOrg', 'care', 'harvest'];

  function sky(code) {
    if (code === 0) return ['☀️', 'clear'];
    if (code <= 3) return ['⛅', 'cloud'];
    if (code <= 48) return ['🌫️', 'fog'];
    if (code >= 95) return ['⛈️', 'storm'];
    return ['🌧️', 'rain'];
  }

  const esc = (x) => String(x == null ? '' : x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const okImg = (u) => typeof u === 'string' && (u.startsWith('data:image/') || u.startsWith('assets/') || u.startsWith('data/'));
  let remote = [];
  fetch('data/crops.json').then((r) => (r.ok ? r.json() : [])).then((j) => {
    remote = Array.isArray(j) ? j : [];
    if (window.__redrawCrops) window.__redrawCrops();
  }).catch(() => {});
  function allCrops() {   // built-in + data/crops.json + this browser's admin drafts (later ones override by id)
    let local = [];
    try { local = JSON.parse(localStorage.getItem('agriCustomCrops')) || []; } catch (e) { /* ignore */ }
    const map = new Map();
    [...AGRI_CROPS, ...remote, ...local].forEach((c) => c && c.id && map.set(c.id, c));
    return [...map.values()];
  }

  window.renderDashboard = (rec) => {
    const i = IDX[rec.language];
    const t = (k) => D[k][i];
    const dist = rec.district.en;
    const [lat, lon, zoneKey] = AGRI_DISTRICTS[dist] || [7.8, 80.7, 'INT'];
    const zone = AGRI_ZONES[zoneKey];
    const body = document.getElementById('dash-body');
    const tabs = document.getElementById('dash-tabs');
    let weatherHtml = null;

    const stat = (icon, label, value) => `<div class="stat"><span class="ic">${icon}</span><span class="v">${value}</span><span class="l">${label}</span></div>`;

    function climateView() {
      const soil = `<h3>${t('soilTitle')}</h3><dl class="summary">
        <div><dt>${t('zone')}</dt><dd>${zone.name[i]}</dd></div>
        <div><dt>${t('soilType')}</dt><dd>${zone.soil[i]}</dd></div>
        <div><dt>${t('color')}</dt><dd>${zone.color[i]}</dd></div>
        <div><dt>${t('ph')}</dt><dd>${zone.ph}</dd></div></dl><p class="note">${t('soilNote')}</p>`;
      return `<div id="wx">${weatherHtml || `<p class="lead">${t('loading')}</p>`}</div>${soil}`;
    }

    let openId = null, query = '';
    const pick = (arr) => (arr && (arr[i] || arr[2] || arr[0])) || '';

    function cropCard(c) {
      const ok = (c.zones || []).includes(zoneKey);
      const secs = SECTIONS.filter((k) => pick(c[k])).map((k) => `<details><summary>${t(k)}</summary><p>${esc(pick(c[k]))}</p></details>`).join('');
      const meds = (c.medicines || []).map((m) => `<div class="mrow">${okImg(m.photo) ? `<img src="${m.photo}" alt="">` : ''}
        <div><b>${esc(pick(m.name))}</b> <small>· ${t('t' + (m.type || 'chemical'))}</small><p>${esc(pick(m.use))}</p></div></div>`).join('');
      const pic = okImg(c.photo) ? `<img class="cphoto" src="${c.photo}" alt="">` : '';
      return `<article class="crop">${pic}<header><span class="ic">${esc(c.icon || '🌱')}</span><div><h3>${esc(pick(c.name))}</h3>
        <small>${esc(pick(c.season))} · ${ok ? '✅ ' + t('suited') : '⚠️ ' + t('lessSuited')}</small></div></header>${secs}
        ${meds ? `<details><summary>💊 ${t('mTitle')}</summary>${meds}</details>` : ''}</article>`;
    }
    function listHtml() {
      const crops = allCrops();
      if (!crops.length) return `<p class="note">${t('noCrops')}</p>`;
      const q = query.trim().toLowerCase();
      const hit = crops.filter((c) => !q || (c.name || []).some((n) => String(n).toLowerCase().includes(q)));
      if (!hit.length) return `<p class="note">${t('noResults')}</p>`;
      return `<div class="cgrid">${hit.map((c) => `<button class="cbtn" data-id="${esc(c.id)}">${okImg(c.photo)
        ? `<img src="${c.photo}" alt="">` : `<span class="ic">${esc(c.icon || '🌱')}</span>`}<span>${esc(pick(c.name))}</span></button>`).join('')}</div>`;
    }
    function cropsView() {
      if (openId) {
        const c = allCrops().find((x) => x.id === openId);
        if (c) return `<button class="btn ghost small cback">${t('back')}</button>${cropCard(c)}<p class="note">${t('caution')}</p>`;
        openId = null;
      }
      return `<input type="search" class="csearch" placeholder="${t('search')}" value="${esc(query)}"><div id="clist">${listHtml()}</div>`;
    }

    let tabNow = 'climate';
    window.__redrawCrops = () => { if (tabNow === 'crops') draw('crops'); };
    function draw(tab) {
      tabNow = tab;
      [...tabs.children].forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
      body.innerHTML = tab === 'climate' ? climateView() : cropsView();
    }
    tabs.innerHTML = `<button data-tab="climate">${t('tabClimate')}</button><button data-tab="crops">${t('tabCrops')}</button>`;
    tabs.onclick = (e) => { if (e.target.dataset.tab) draw(e.target.dataset.tab); };
    body.oninput = (e) => {
      if (e.target.classList.contains('csearch')) { query = e.target.value; document.getElementById('clist').innerHTML = listHtml(); }
    };
    body.onclick = (e) => {
      const b = e.target.closest('.cbtn');
      if (b) { openId = b.dataset.id; draw('crops'); window.scrollTo(0, 0); }
      if (e.target.closest('.cback')) { openId = null; draw('crops'); }
    };
    draw('climate');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code` +
      `&hourly=soil_moisture_0_to_1cm,soil_temperature_0cm` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=5&timezone=Asia%2FColombo`;
    fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).then((w) => {
      const c = w.current;
      let k = w.hourly.time.length - 1;
      while (k > 0 && w.hourly.time[k] > c.time) k--;
      const [emoji, key] = sky(c.weather_code);
      const sm = w.hourly.soil_moisture_0_to_1cm[k];
      const st = w.hourly.soil_temperature_0cm[k];
      const days = w.daily.time.map((d, n) => `<div class="day"><b>${new Intl.DateTimeFormat(LOC[rec.language], { weekday: 'short' }).format(new Date(d))}</b>
        <span>${Math.round(w.daily.temperature_2m_max[n])}° / ${Math.round(w.daily.temperature_2m_min[n])}°</span>
        <small>💧 ${w.daily.precipitation_sum[n]} mm</small></div>`).join('');
      weatherHtml = `<div class="now">${emoji} <b>${Math.round(c.temperature_2m)}°C</b> <span>${D.sky[key][i]}</span></div>
        <div class="stats">${stat('💧', t('hum'), c.relative_humidity_2m + '%')}${stat('🌧️', t('rain'), c.precipitation + ' mm')}
        ${stat('💨', t('wind'), c.wind_speed_10m + ' km/h')}${stat('🌱', t('sMoist'), sm == null ? '–' : (sm * 100).toFixed(0) + '%')}
        ${stat('🌡️', t('sTemp'), st == null ? '–' : Math.round(st) + '°C')}</div>
        <h3>${t('forecast')}</h3><div class="forecast">${days}</div><p class="note">${t('live')}</p>`;
      const el = document.getElementById('wx');
      if (el) el.innerHTML = weatherHtml;
    }).catch(() => {
      const el = document.getElementById('wx');
      if (el) el.innerHTML = `<p class="note">${t('failed')}</p>`;
    });
  };
})();