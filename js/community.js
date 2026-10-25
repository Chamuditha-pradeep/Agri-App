// Community: Facebook-like feed (photos, disease reports) + comments on posts and crops
const IDX = { si: 0, ta: 1, en: 2 };
const T = {
  login: ['මුලින් ඇතුල් වන්න.', 'முதலில் உள்நுழையவும்.', 'Please log in first.'],
  ph: ['ඔබේ බෝගය ගැන කියන්න…', 'உங்கள் பயிரைப் பற்றி கூறுங்கள்…', 'Share something about your crop…'],
  photo: ['📷 ඡායාරූපය', '📷 புகைப்படம்', '📷 Photo'], post: ['පළ කරන්න', 'பகிர்', 'Post'],
  general: ['සාමාන්‍ය', 'பொது', 'General'], disease: ['🦠 ලෙඩ රෝග', '🦠 நோய்', '🦠 Disease'], question: ['❓ ප්‍රශ්නයක්', '❓ கேள்வி', '❓ Question'],
  anyCrop: ['බෝගය (විකල්ප)', 'பயிர் (விருப்பம்)', 'Crop (optional)'], comments: ['💬 අදහස්', '💬 கருத்துகள்', '💬 Comments'],
  write: ['අදහසක් ලියන්න…', 'கருத்தை எழுதுங்கள்…', 'Write a comment…'], send: ['යවන්න', 'அனுப்பு', 'Send'],
  del: ['මකන්න', 'நீக்கு', 'Delete'], empty: ['තවම පළ කිරීම් නෑ. පළමුවැන්නා ඔයා වෙන්න!', 'இன்னும் பதிவுகள் இல்லை. முதலில் நீங்கள் பகிருங்கள்!', 'No posts yet. Be the first!'],
  farmer: ['ගොවියා', 'விவசாயி', 'Farmer'], trader: ['වෙළෙන්දා', 'வியாபாரி', 'Trader'], admin: ['Admin', 'Admin', 'Admin'], err: ['අසාර්ථකයි', 'தோல்வி', 'Failed']
};
const li = () => IDX[document.documentElement.lang] ?? 2;
const t = (k) => T[k][li()];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COL = { disease: '#a4573a', question: '#2f6f73', general: '#4f7a43' };
const AV = ['#4f7a43', '#a97c50', '#2f6f73', '#8a6a2f', '#9b5f3f', '#6b7a3a'];
const C = () => window.AgriFB.community;
const me = () => window.AgriFB.user;
const when = (ts) => { try { return new Intl.DateTimeFormat(document.documentElement.lang + '-LK', { dateStyle: 'medium', timeStyle: 'short' }).format(ts.toDate()); } catch (e) { return ''; } };
const needLogin = () => `<p class="note">${t('login')} <button class="linkbtn" data-login>→</button></p>`;
const av = (name) => `<span class="av" style="background:${AV[[...String(name)].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length]}">${esc(String(name).charAt(0).toUpperCase())}</span>`;

function shrink(file) {
  return new Promise((res, rej) => {
    const img = new Image(), fr = new FileReader();
    fr.onload = () => { img.src = fr.result; }; img.onerror = rej;
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.7));
    };
    fr.readAsDataURL(file);
  });
}
document.addEventListener('click', (e) => { if (e.target.closest('[data-login]')) { const b = document.getElementById('acct-in'); if (b) b.click(); } });

/* ----- comments (posts and crops) ----- */
async function mountComments(el, target) {
  if (!el) return;
  const draw = async () => {
    if (!me()) { el.innerHTML = needLogin(); return; }
    let list = [];
    try { list = await C().comments(target); } catch (x) { el.innerHTML = `<p class="note">${t('err')}</p>`; return; }
    el.innerHTML = `<h3>${t('comments')} (${list.length})</h3>` + list.map((c) => `<div class="cmt"><b>${esc(c.name)}</b>${esc(c.text)}
      ${(me().uid === c.uid || me().role === 'admin') ? `<button data-cd="${esc(c.id)}">✕</button>` : ''}</div>`).join('') +
      `<form class="cform"><input type="text" maxlength="900" placeholder="${t('write')}" required><button class="btn small">${t('send')}</button></form>`;
    el.querySelector('form').onsubmit = async (e) => {
      e.preventDefault();
      const i = e.target.querySelector('input'), v = i.value.trim(); if (!v) return;
      i.disabled = true;
      try { await C().addComment(target, v); } catch (x) { alert(t('err') + ': ' + (x.code || x.message)); }
      draw();
    };
    el.onclick = async (e) => { if (e.target.dataset.cd) { await C().removeComment(e.target.dataset.cd); draw(); } };
  };
  draw();
  window.addEventListener('agri-auth', () => { if (document.body.contains(el)) draw(); }, { once: true });
}

/* ----- feed ----- */
async function mount(el) {
  if (!el) return;
  let photo = '', crops = [];
  const render = async () => {
    if (!me()) { el.innerHTML = needLogin(); return; }
    try { crops = await window.AgriFB.crops.list(); } catch (x) { crops = []; }
    el.innerHTML = `<form class="comp"><textarea rows="3" maxlength="1900" placeholder="${t('ph')}"></textarea>
      <div class="row"><label class="btn small ghost" style="cursor:pointer">${t('photo')}<input type="file" id="pf" accept="image/*" hidden></label>
      <select id="pk"><option value="general">${t('general')}</option><option value="disease">${t('disease')}</option><option value="question">${t('question')}</option></select>
      <select id="pc"><option value="">${t('anyCrop')}</option>${crops.map((c) => `<option>${esc(c.name[li()] || c.name[2])}</option>`).join('')}</select>
      <span id="pp" class="note"></span><button class="btn small" style="margin-left:auto">${t('post')}</button></div></form><div id="plist"></div>`;
    el.querySelector('#pf').onchange = async (e) => {
      if (!e.target.files[0]) return;
      try { photo = await shrink(e.target.files[0]); el.querySelector('#pp').textContent = '✅'; } catch (x) { photo = ''; }
    };
    el.querySelector('.comp').onsubmit = async (e) => {
      e.preventDefault();
      const text = el.querySelector('textarea').value.trim();
      if (!text && !photo) return;
      try { await C().addPost({ text, photo, kind: el.querySelector('#pk').value, crop: el.querySelector('#pc').value }); photo = ''; render(); }
      catch (x) { alert(t('err') + ': ' + (x.code || x.message)); }
    };
    list();
  };
  const list = async () => {
    const box = el.querySelector('#plist');
    let posts = [];
    try { posts = await C().posts(); } catch (x) { box.innerHTML = `<p class="note">${t('err')} ${esc(x.code || '')}</p>`; return; }
    box.innerHTML = posts.length ? posts.map((p) => `<article class="post"><div class="who">${av(p.name)}<div><b>${esc(p.name)}</b> <small>· ${t(p.role) || ''} · ${when(p.createdAt)}</small><br>
      <span class="kind" style="background:${COL[p.kind] || COL.general}">${t(p.kind) || ''}</span> ${p.crop ? `<small>🌱 ${esc(p.crop)}</small>` : ''}</div>
      ${(me().uid === p.uid || me().role === 'admin') ? `<button class="linkbtn" style="margin-left:auto" data-pd="${esc(p.id)}">${t('del')}</button>` : ''}</div>
      ${p.text ? `<p class="ptext">${esc(p.text)}</p>` : ''}${/^data:image\//.test(p.photo || '') ? `<img class="pimg" src="${p.photo}" alt="">` : ''}
      <div class="row"><button class="linkbtn" data-pc="${esc(p.id)}">${t('comments')}</button></div><div id="pcm-${esc(p.id)}"></div></article>`).join('') : `<p class="note">${t('empty')}</p>`;
    box.onclick = async (e) => {
      if (e.target.dataset.pd && confirm(t('del') + '?')) { await C().removePost(e.target.dataset.pd); list(); }
      if (e.target.dataset.pc) mountComments(document.getElementById('pcm-' + e.target.dataset.pc), 'post:' + e.target.dataset.pc);
    };
  };
  render();
  window.addEventListener('agri-auth', () => { if (document.body.contains(el)) render(); }, { once: true });
}
window.AgriCommunity = { mount, mountComments };
