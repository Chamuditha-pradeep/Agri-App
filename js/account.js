// Account button + login/register modal (works on every screen)
const TXT = {
  login: ['ඇතුල් වන්න', 'உள்நுழை', 'Log in'], register: ['ලියාපදිංචි වන්න', 'பதிவு செய்', 'Register'],
  logout: ['ඉවත් වන්න', 'வெளியேறு', 'Log out'], name: ['නම', 'பெயர்', 'Name'],
  email: ['ඊමේල්', 'மின்னஞ்சல்', 'Email'], pass: ['මුරපදය (අවම අකුරු 6)', 'கடவுச்சொல் (குறைந்தது 6)', 'Password (min 6)'],
  iam: ['මම', 'நான்', 'I am'], farmer: ['ගොවියෙක්', 'விவசாயி', 'a Farmer'], trader: ['වෙළෙන්දෙක්', 'வியாபாரி', 'a Trader'],
  toReg: ['ගිණුමක් නැද්ද? ලියාපදිංචි වන්න', 'கணக்கு இல்லையா? பதிவு செய்யவும்', 'No account? Register'],
  toLogin: ['දැනටමත් ගිණුමක් තියෙනවාද? ඇතුල් වන්න', 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழையவும்', 'Have an account? Log in'],
  close: ['වසන්න', 'மூடு', 'Close'], wait: ['රැඳී සිටින්න…', 'காத்திருக்கவும்…', 'Please wait…'],
  bad: ['ඊමේල් හෝ මුරපදය වැරදියි.', 'மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு.', 'Wrong email or password.'],
  used: ['මේ ඊමේල් එකෙන් දැනටමත් ගිණුමක් තියෙනවා.', 'இந்த மின்னஞ்சலில் ஏற்கனவே கணக்கு உள்ளது.', 'This email is already registered.'],
  weak: ['මුරපදය දුර්වලයි (අවම අකුරු 6).', 'கடவுச்சொல் பலவீனம் (குறைந்தது 6).', 'Password too weak (min 6).'],
  needName: ['නම ඇතුළත් කරන්න.', 'பெயரை உள்ளிடவும்.', 'Enter your name.']
};
const idx = () => ({ si: 0, ta: 1, en: 2 }[document.documentElement.lang] ?? 2);
const T = (k) => TXT[k][idx()];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const bar = document.createElement('div');
bar.className = 'acct';
document.body.appendChild(bar);
const modal = document.createElement('div');
modal.className = 'modal';
modal.hidden = true;
document.body.appendChild(modal);

function renderBar() {
  const u = window.AgriFB.user;
  bar.innerHTML = u
    ? `<span>${u.role === 'trader' ? '🛒' : '🌱'} ${esc(u.name)}</span><button class="btn small" id="acct-out">${T('logout')}</button>`
    : `<button class="btn small" id="acct-in">${T('login')}</button>`;
}
function openModal(mode) {
  const reg = mode === 'register';
  modal.hidden = false;
  modal.innerHTML = `<form class="mbox" autocomplete="on"><h2>${T(reg ? 'register' : 'login')}</h2>
    ${reg ? `<input name="name" type="text" placeholder="${T('name')}" required>
    <select name="role"><option value="farmer">${T('iam')} ${T('farmer')}</option><option value="trader">${T('iam')} ${T('trader')}</option></select>` : ''}
    <input name="email" type="email" placeholder="${T('email')}" required>
    <input name="pass" type="password" placeholder="${T('pass')}" minlength="6" required>
    <p class="note" id="merr"></p>
    <div class="actions"><button type="button" class="btn ghost" id="mclose">${T('close')}</button><button class="btn" type="submit">${T(reg ? 'register' : 'login')}</button></div>
    <a href="#" id="mswitch">${T(reg ? 'toLogin' : 'toReg')}</a></form>`;
  modal.querySelector('#mclose').onclick = () => { modal.hidden = true; };
  modal.querySelector('#mswitch').onclick = (e) => { e.preventDefault(); openModal(reg ? 'login' : 'register'); };
  modal.querySelector('form').onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target), err = modal.querySelector('#merr');
    err.textContent = T('wait');
    try {
      if (reg) {
        if (!f.get('name').trim()) { err.textContent = T('needName'); return; }
        await window.AgriFB.register(f.get('name').trim(), f.get('role'), f.get('email').trim(), f.get('pass'));
      } else await window.AgriFB.login(f.get('email').trim(), f.get('pass'));
      modal.hidden = true;
    } catch (ex) {
      const m = { 'auth/invalid-credential': 'bad', 'auth/wrong-password': 'bad', 'auth/user-not-found': 'bad',
        'auth/email-already-in-use': 'used', 'auth/weak-password': 'weak' }[ex.code];
      err.textContent = m ? T(m) : (ex.code || ex.message);
    }
  };
}
bar.onclick = (e) => {
  if (e.target.id === 'acct-in') openModal('login');
  if (e.target.id === 'acct-out') window.AgriFB.logout();
};
window.addEventListener('agri-auth', renderBar);
renderBar();
