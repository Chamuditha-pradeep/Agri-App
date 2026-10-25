// Admin: crops with a Word-like editor. Everything is saved to Firestore (no export needed).
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const LANGS = ['si', 'ta', 'en'];
const ed = $('#ed');
let cur = 'si', pages = { si: '', ta: '', en: '' }, bgData = '', thumbData = '', editId = null, lastRange = null;
const F = () => window.AgriFB.crops;

function shrink(file, max, q) {
  return new Promise((res, rej) => {
    const img = new Image(), fr = new FileReader();
    fr.onload = () => { img.src = fr.result; };
    img.onerror = rej;
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', q));
    };
    fr.readAsDataURL(file);
  });
}

/* ----- editor toolbar ----- */
document.execCommand('styleWithCSS', false, true);
document.addEventListener('selectionchange', () => {
  const s = getSelection();
  if (s.rangeCount && ed.contains(s.anchorNode)) lastRange = s.getRangeAt(0).cloneRange();
});
const restore = () => { ed.focus(); if (lastRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(lastRange); } };
$('#tb').onmousedown = (e) => { if (!e.target.closest('label')) e.preventDefault(); };
$('#tb').onclick = (e) => {
  const b = e.target.closest('[data-cmd]');
  if (b) { restore(); document.execCommand(b.dataset.cmd, false, b.dataset.arg || null); }
};
$('#tcolor').oninput = (e) => { restore(); document.execCommand('foreColor', false, e.target.value); };
$('#timg').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  try { const url = await shrink(f, 900, 0.72); restore(); document.execCommand('insertImage', false, url); } catch (x) { alert('Image failed.'); }
  e.target.value = '';
};
ed.onclick = (e) => {
  if (e.target.tagName === 'IMG') { const sizes = ['30%', '60%', '100%']; e.target.style.width = sizes[(sizes.indexOf(e.target.style.width) + 1) % 3]; }
};
$('#crtabs').onclick = (e) => {
  const l = e.target.dataset.l; if (!l || l === cur) return;
  pages[cur] = ed.innerHTML; cur = l; ed.innerHTML = pages[cur];
  [...$('#crtabs').children].forEach((b) => b.classList.toggle('on', b.dataset.l === cur));
};

/* ----- list / form ----- */
async function refresh() {
  const list = await F().list();
  $('#crlist').innerHTML = list.length ? list.map((c) => `<div class="item"><span class="row">${c.thumb ? `<img class="thumb" src="${c.thumb}" alt="">` : esc(c.icon || '🌱')}
    <b>${esc(c.name[2])}</b> / ${esc(c.name[0] || '')}</span><span class="row"><button class="btn small" data-e="${esc(c.id)}">Edit</button>
    <button class="btn small danger" data-d="${esc(c.id)}">Delete</button></span></div>`).join('') : '<p class="note">තවම බෝග නෑ.</p>';
}
function resetForm() {
  editId = null; pages = { si: '', ta: '', en: '' }; bgData = thumbData = ''; cur = 'si';
  $('#crform').reset(); ed.innerHTML = ''; $('#crprev').hidden = true; $('#crtitle').textContent = 'අලුත් බෝගයක්';
  [...$('#crtabs').children].forEach((b) => b.classList.toggle('on', b.dataset.l === 'si'));
}
$('#crnew').onclick = () => { resetForm(); $('#crform').hidden = false; $('#crform').scrollIntoView({ behavior: 'smooth' }); };
$('#crcancel').onclick = () => { $('#crform').hidden = true; };
$('#crphoto').onchange = async (e) => {
  const f = e.target.files[0]; if (!f) return;
  bgData = await shrink(f, 1280, 0.7); thumbData = await shrink(f, 260, 0.7);
  $('#crprev').src = thumbData; $('#crprev').hidden = false;
};
async function edit(id) {
  const c = (await F().list()).find((x) => x.id === id); if (!c) return;
  resetForm(); editId = id; $('#crform').hidden = false; $('#crtitle').textContent = 'සංස්කරණය: ' + c.name[2];
  $('#cricon').value = c.icon || '';
  [0, 1, 2].forEach((i) => { $('#crn' + i).value = c.name[i] || ''; $('#crs' + i).value = (c.season || [])[i] || ''; });
  document.querySelectorAll('.zchk').forEach((z) => { z.checked = (c.zones || []).includes(z.value); });
  thumbData = c.thumb || ''; if (thumbData) { $('#crprev').src = thumbData; $('#crprev').hidden = false; }
  bgData = (await F().page(id, 'bg')) || '';
  for (const l of LANGS) pages[l] = (await F().page(id, l)) || '';
  ed.innerHTML = pages[cur];
  $('#crform').scrollIntoView({ behavior: 'smooth' });
}
$('#crlist').onclick = async (e) => {
  if (e.target.dataset.e) edit(e.target.dataset.e);
  if (e.target.dataset.d && confirm('Delete this crop and its pages?')) { await F().remove(e.target.dataset.d); refresh(); }
};
$('#crform').onsubmit = async (e) => {
  e.preventDefault();
  pages[cur] = ed.innerHTML;
  const name = [0, 1, 2].map((i) => $('#crn' + i).value.trim());
  if (!name[2]) { alert('English name is required.'); return; }
  const id = editId || slug(name[2]);
  const meta = { id, icon: $('#cricon').value.trim() || '🌱', name, season: [0, 1, 2].map((i) => $('#crs' + i).value.trim()),
    zones: [...document.querySelectorAll('.zchk:checked')].map((z) => z.value), thumb: thumbData };
  try {
    for (const l of LANGS) {
      const html = window.AgriSheet.clean(pages[l]);
      if (html.length > 950000) { alert(`The ${l} page is too large (too many/big photos). Remove a photo.`); return; }
      await F().setPage(id, l, html);
    }
    if (bgData) await F().setPage(id, 'bg', bgData);
    await F().save(meta);
    $('#crform').hidden = true; refresh();
  } catch (ex) { alert('Save failed: ' + (ex.code || ex.message) + '\n(Admin role + new Firestore rules published?)'); }
};

/* ----- import the ready-made coconut crop (data/coconut.json) ----- */
const TITLES = {
  grow: ['වගා කරන ආකාරය', 'பயிரிடும் முறை', 'How to grow'], fertChem: ['රසායනික පොහොර', 'இரசாயன உரம்', 'Chemical fertilizer'],
  fertOrg: ['කාබනික පොහොර', 'சேதன உரம்', 'Organic fertilizer'], pestChem: ['පලිබෝධ - රසායනික ක්‍රම', 'பீடை கட்டுப்பாடு - இரசாயன', 'Pests - chemical control'],
  pestOrg: ['පලිබෝධ - දේශීය ක්‍රම', 'பீடை கட்டுப்பாடு - இயற்கை', 'Pests - natural methods'], care: ['නඩත්තුව', 'பராமரிப்பு', 'Maintenance'],
  harvest: ['අස්වනු නෙලීම', 'அறுவடை', 'Harvesting'], meds: ['බෙහෙත් සහ ද්‍රව්‍ය', 'மருந்துகள் & பொருட்கள்', 'Medicines & products']
};
$('#crimport').onclick = async () => {
  try {
    const c = (await (await fetch('data/coconut.json')).json())[0];
    for (let i = 0; i < 3; i++) {
      let h = ['grow', 'fertChem', 'fertOrg', 'pestChem', 'pestOrg', 'care', 'harvest'].map((k) => `<h2>${TITLES[k][i]}</h2><p>${esc(c[k][i])}</p>`).join('');
      h += `<h2>💊 ${TITLES.meds[i]}</h2><ul>${c.medicines.map((m) => `<li><b>${esc(m.name[i])}</b> – ${esc(m.use[i])}</li>`).join('')}</ul>`;
      await F().setPage(c.id, LANGS[i], h);
    }
    await F().save({ id: c.id, icon: c.icon, name: c.name, season: c.season, zones: c.zones, thumb: '' });
    refresh(); alert('Coconut imported. Click Edit to add its photo and pictures.');
  } catch (e) { alert('Import failed: ' + (e.code || e.message)); }
};

function gate(user) {
  const ok = !!user && user.role === 'admin';
  $('#cropcard').hidden = !ok;
  if (!ok) $('#crform').hidden = true; else refresh();
}
window.addEventListener('agri-auth', (e) => gate(e.detail));
if (window.AgriFB && window.AgriFB.user) gate(window.AgriFB.user);
