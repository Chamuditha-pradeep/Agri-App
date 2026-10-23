(() => {
  const KEY = 'agriCustomCrops';
  const LN = ['සිංහල', 'தமிழ்', 'English'];
  const SECTIONS = [['grow', 'වගා කරන ආකාරය / How to grow'], ['fertChem', 'රසායනික පොහොර / Chemical fertilizer'],
    ['fertOrg', 'කාබනික පොහොර / Organic fertilizer'], ['pestChem', 'පලිබෝධ - රසායනික / Pests - chemical'],
    ['pestOrg', 'පලිබෝධ - දේශීය / Pests - natural'], ['care', 'නඩත්තුව / Maintenance'], ['harvest', 'අස්වනු නෙලීම / Harvesting']];
  const $ = (s, r = document) => r.querySelector(s);
  let editingId = null, cropPhoto = '';

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const store = (list) => {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; }
    catch (e) { alert('Storage full. Export, then delete some crops or use smaller photos.'); return false; }
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const tri = (f, label, area) => `<fieldset><legend>${label}</legend>${LN.map((n, i) => area
    ? `<textarea rows="3" data-f="${f}" data-l="${i}" placeholder="${n}"></textarea>`
    : `<input type="text" data-f="${f}" data-l="${i}" placeholder="${n}">`).join('')}</fieldset>`;
  const readTri = (root, f) => LN.map((_, i) => $(`[data-f="${f}"][data-l="${i}"]`, root).value.trim());
  const writeTri = (root, f, v = []) => LN.forEach((_, i) => { $(`[data-f="${f}"][data-l="${i}"]`, root).value = v[i] || ''; });

  /* Resize photo to max 800px JPEG so it stays small */
  function readPhoto(file) {
    return new Promise((res) => {
      if (!file) return res('');
      const img = new Image(), fr = new FileReader();
      fr.onload = () => { img.src = fr.result; };
      img.onload = () => {
        const k = Math.min(1, 800 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.75));
      };
      fr.readAsDataURL(file);
    });
  }
  function photoPicker(box, current, onChange) {
    box.innerHTML = `<img class="thumb" ${current ? `src="${current}"` : 'hidden'}><input type="file" accept="image/*">`;
    $('input', box).onchange = async (e) => { const d = await readPhoto(e.target.files[0]); onChange(d); const im = $('img', box); im.src = d; im.hidden = !d; };
  }

  /* ----- form ----- */
  $('#fields').innerHTML = tri('name', 'නම / Name', false) + tri('season', 'කන්නය / Season', false) +
    SECTIONS.map(([k, l]) => tri(k, l, true)).join('');
  photoPicker($('#photoBox'), '', (d) => { cropPhoto = d; });

  function addMed(m = {}) {
    const el = document.createElement('div');
    el.className = 'med';
    el.innerHTML = `<div class="row"><select data-f="type"><option value="chemical">රසායනික / Chemical</option>
      <option value="organic">දේශීය / Natural</option><option value="fertilizer">පොහොර / Fertilizer</option></select>
      <span class="ph row"></span><button type="button" class="btn small danger">✕</button></div>
      ${tri('mname', 'නම / Name', false)}${tri('muse', 'භාවිතය / How to use', true)}`;
    el.photo = m.photo || '';
    if (m.type) $('[data-f="type"]', el).value = m.type;
    writeTri(el, 'mname', m.name); writeTri(el, 'muse', m.use);
    photoPicker($('.ph', el), el.photo, (d) => { el.photo = d; });
    $('.danger', el).onclick = () => el.remove();
    $('#meds').appendChild(el);
  }
  $('#addMed').onclick = () => addMed();

  function clearForm() {
    editingId = null; cropPhoto = '';
    $('#form').reset(); $('#meds').innerHTML = '';
    photoPicker($('#photoBox'), '', (d) => { cropPhoto = d; });
    $('#formTitle').textContent = 'අලුත් බෝගයක් (New crop)';
  }
  $('#reset').onclick = clearForm;

  function fillForm(c) {
    clearForm(); editingId = c.id; cropPhoto = c.photo || '';
    $('#formTitle').textContent = 'සංස්කරණය (Edit): ' + c.name[2];
    $('#icon').value = c.icon || '';
    writeTri($('#fields'), 'name', c.name); writeTri($('#fields'), 'season', c.season);
    SECTIONS.forEach(([k]) => writeTri($('#fields'), k, c[k]));
    $$('.zones input').forEach((cb) => { cb.checked = (c.zones || []).includes(cb.value); });
    photoPicker($('#photoBox'), cropPhoto, (d) => { cropPhoto = d; });
    (c.medicines || []).forEach(addMed);
    window.scrollTo({ top: $('#form').offsetTop, behavior: 'smooth' });
  }
  const $$ = (s) => [...document.querySelectorAll(s)];

  $('#form').onsubmit = (e) => {
    e.preventDefault();
    const root = $('#fields');
    const name = readTri(root, 'name');
    if (!name[2]) { alert('English name is required (used for the crop ID).'); return; }
    const crop = {
      id: editingId || name[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36),
      icon: $('#icon').value.trim() || '🌱', name, season: readTri(root, 'season'),
      zones: $$('.zones input:checked').map((c) => c.value), photo: cropPhoto,
      medicines: $$('#meds .med').map((m) => ({
        type: $('[data-f="type"]', m).value, name: readTri(m, 'mname'), use: readTri(m, 'muse'), photo: m.photo
      })).filter((m) => m.name.some(Boolean))
    };
    SECTIONS.forEach(([k]) => { crop[k] = readTri(root, k); });
    const list = load(), i = list.findIndex((x) => x.id === crop.id);
    if (i >= 0) list[i] = crop; else list.push(crop);
    if (store(list)) { clearForm(); renderList(); }
  };

  /* ----- list / export / import ----- */
  function renderList() {
    const list = load();
    $('#list').innerHTML = list.length ? list.map((c) => `<div class="item"><span>${esc(c.icon)} <b>${esc(c.name[2])}</b> / ${esc(c.name[0])}
      <small>(${(c.medicines || []).length} 💊)</small></span><span class="row"><button class="btn small" data-e="${esc(c.id)}">Edit</button>
      <button class="btn small danger" data-d="${esc(c.id)}">Delete</button></span></div>`).join('') : '<p class="note">තවම බෝග නෑ.</p>';
  }
  $('#list').onclick = (e) => {
    const list = load();
    if (e.target.dataset.e) fillForm(list.find((c) => c.id === e.target.dataset.e));
    if (e.target.dataset.d && confirm('Delete this crop?')) { store(list.filter((c) => c.id !== e.target.dataset.d)); renderList(); }
  };
  $('#export').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(load(), null, 1)], { type: 'application/json' }));
    a.download = 'crops.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  $('#import').onchange = async (e) => {
    try {
      const incoming = JSON.parse(await e.target.files[0].text());
      const list = load();
      incoming.forEach((c) => { const i = list.findIndex((x) => x.id === c.id); if (i >= 0) list[i] = c; else list.push(c); });
      if (store(list)) renderList();
    } catch (err) { alert('Invalid crops.json file.'); }
    e.target.value = '';
  };
  renderList();
})();