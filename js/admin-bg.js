// Admin: upload background photos per province / district / local authority (stored in Firestore)
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rows = typeof sriLankaData !== 'undefined' ? sriLankaData : [];

function places(level) {
  const seen = new Map();
  rows.forEach((r) => {
    if (level === 'province') seen.set(r.Province_English, [r.Province_English]);
    else if (level === 'district') seen.set(r.District_English, [r.District_English]);
    else if (r.DS_English) seen.set(r.District_English + '|' + r.DS_English, [r.District_English, r.DS_English]);
  });
  return [...seen.entries()].map(([k, parts]) => ({ k, parts, label: parts.join(' – ') }));
}
function fillPlaces() {
  $('#bgplace').innerHTML = places($('#bglevel').value).map((p) => `<option value="${esc(p.k)}">${esc(p.label)}</option>`).join('');
}
function shrink(file) {
  return new Promise((res, rej) => {
    const img = new Image(), fr = new FileReader();
    fr.onload = () => { img.src = fr.result; };
    img.onerror = rej;
    img.onload = () => {
      const k = Math.min(1, 1280 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.65));
    };
    fr.readAsDataURL(file);
  });
}
async function renderList() {
  const list = await window.AgriFB.bg.list();
  $('#bglist').innerHTML = list.length ? list.map((b) => `<div class="item"><span class="row"><img class="thumb" src="${b.url}" alt=""> ${esc(b.level)}: <b>${esc(b.name)}</b></span>
    <button class="btn small danger" data-del="${esc(b.id)}">Delete</button></div>`).join('') : '<p class="note">තවම පසුබිම් නෑ.</p>';
}
$('#bglevel').onchange = fillPlaces;
$('#bgsave').onclick = async () => {
  const f = $('#bgfile').files[0];
  if (!f) { alert('පින්තූරයක් තෝරන්න.'); return; }
  const level = $('#bglevel').value, p = places(level).find((x) => x.k === $('#bgplace').value);
  try {
    const url = await shrink(f);
    if (url.length > 900000) { alert('Photo too large, use a smaller one.'); return; }
    await window.AgriFB.bg.set(window.AgriFB.bg.id(level, ...p.parts), { url, level, name: p.label });
    $('#bgfile').value = ''; renderList();
  } catch (e) { alert('Upload failed: ' + (e.code || e.message) + '\n(Are you logged in as admin and are the new Firestore rules published?)'); }
};
$('#bglist').onclick = async (e) => {
  if (e.target.dataset.del && confirm('Delete this background?')) { await window.AgriFB.bg.remove(e.target.dataset.del); renderList(); }
};
window.addEventListener('agri-auth', (e) => {
  const ok = e.detail && e.detail.role === 'admin';
  $('#bgtools').hidden = !ok;
  $('#bgmsg').hidden = ok;
  if (ok) { fillPlaces(); renderList(); }
});
fillPlaces();
