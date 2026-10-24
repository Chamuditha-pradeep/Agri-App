// AI crop assistant (Firebase AI Logic -> Gemini Developer API). No API key in this code.
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-ai.js';

// If you get "model not found", replace with a model name listed in Firebase console > AI Logic.
const MODEL = 'gemini-2.5-flash';
const LANGNAME = { si: 'Sinhala', ta: 'Tamil', en: 'English' };
const SECTIONS = ['grow', 'fertChem', 'fertOrg', 'pestChem', 'pestOrg', 'care', 'harvest'];
const TXT = {
  title: ['AI කෘෂි සහායක', 'AI வேளாண் உதவியாளர்', 'AI farming assistant'],
  hello: ['ආයුබෝවන්! ගැන ඕන දේ අහන්න, නැත්නම් ශාකයේ ඡායාරූපයක් එවන්න.', 'வணக்கம்! பற்றி எதுவும் கேளுங்கள், அல்லது செடியின் புகைப்படத்தை அனுப்புங்கள்.', 'Hello! Ask anything about, or send a photo of the plant.'],
  ask: ['ප්‍රශ්නයක් අහන්න…', 'கேள்வி கேளுங்கள்…', 'Ask a question…'],
  send: ['යවන්න', 'அனுப்பு', 'Send'], photo: ['📷 ඡායාරූපය', '📷 புகைப்படம்', '📷 Photo'],
  login: ['AI එක්ක chat කරන්න මුලින් ඇතුල් වන්න.', 'AI உடன் அரட்டையடிக்க முதலில் உள்நுழையவும்.', 'Please log in first to chat with the AI.'],
  think: ['සිතමින්…', 'சிந்திக்கிறது…', 'Thinking…'],
  err: ['AI සේවාව දැන් ලබාගත නොහැක. පසුව උත්සාහ කරන්න.', 'AI சேவை இப்போது கிடைக்கவில்லை. பிறகு முயற்சிக்கவும்.', 'The AI service is unavailable. Try again later.'],
  note: ['AI පිළිතුරු මගපෙන්වීමක් පමණයි; රසායන ද්‍රව්‍ය භාවිතයට පෙර කෘෂිකර්ම දෙපාර්තමේන්තුවේ නිර්දේශ බලන්න.', 'AI பதில்கள் வழிகாட்டுதல் மட்டுமே; இரசாயனங்களுக்கு முன் விவசாயத் திணைக்கள பரிந்துரைகளைப் பாருங்கள்.', 'AI answers are guidance only; check Department of Agriculture advice before using chemicals.'],
  close: ['වසන්න', 'மூடு', 'Close'],
  defQ: ['මේ ඡායාරූපයේ තියෙන ගැටලුව මොකක්ද?', 'இந்த புகைப்படத்தில் உள்ள பிரச்சனை என்ன?', 'What is the problem in this photo?']
};
const lang = () => (['si', 'ta', 'en'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en');
const li = () => ({ si: 0, ta: 1, en: 2 }[lang()]);
const T = (k) => TXT[k][li()];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

let ai = null;
function getModel(system) {
  if (!ai) ai = getAI(window.AgriFB.app, { backend: new GoogleAIBackend() });
  return getGenerativeModel(ai, { model: MODEL, systemInstruction: system });
}

function pickText(arr) { const i = li(); return (arr && (arr[i] || arr[2] || arr[0])) || ''; }

function buildSystem(crop) {
  let where = '';
  try { const r = JSON.parse(localStorage.getItem('agriSetup')); if (r) where = `${r.ds.en}, ${r.district.en}, ${r.province.en}`; } catch (e) { /* none */ }
  const info = SECTIONS.map((k) => pickText(crop[k])).filter(Boolean).join('\n').slice(0, 2500);
  const meds = (crop.medicines || []).map((m) => pickText(m.name)).filter(Boolean).join(', ');
  return `You are a friendly agricultural assistant for Sri Lankan farmers. The farmer is asking about the crop: ${crop.name.filter(Boolean).join(' / ')}. ` +
    `Farmer's area: ${where || 'Sri Lanka'}. Always reply in ${LANGNAME[lang()]}, in short, practical steps. ` +
    `If a photo is given: describe what you see, list the most likely problems (disease, pest or nutrient deficiency) and how sure you are, then give natural/local control first and chemical options second. ` +
    `Never invent doses. For pesticides, tell the farmer to use only products registered by the Department of Agriculture (Sri Lanka), follow the label and wear protective gear. ` +
    `If unsure, say so and advise visiting the nearest agriculture extension officer. Reference info from our database:\n${info}\nProducts listed: ${meds}`;
}

function shrink(file) {
  return new Promise((res, rej) => {
    const img = new Image(), fr = new FileReader();
    fr.onload = () => { img.src = fr.result; };
    fr.onerror = rej;
    img.onerror = rej;
    img.onload = () => {
      const k = Math.min(1, 1024 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', 0.8);
      res({ url, data: url.split(',')[1] });
    };
    fr.readAsDataURL(file);
  });
}

function openChat(id) {
  if (!window.AgriFB.user) { const b = document.getElementById('acct-in'); if (b) b.click(); return; }
  const crop = window.AgriGetCrop && window.AgriGetCrop(id);
  if (!crop) return;
  const chat = getModel(buildSystem(crop)).startChat();
  const name = pickText(crop.name);
  const box = document.createElement('div');
  box.className = 'modal aimodal';
  box.innerHTML = `<div class="mbox chatbox"><div class="row"><h2>🤖 ${esc(name)} · ${T('title')}</h2><button class="btn small ghost" id="aic">${T('close')}</button></div>
    <div class="msgs" id="aim"><div class="bub bot">${esc(T('hello').replace('!', `! ${name}`))}</div></div>
    <p class="note">${T('note')}</p>
    <div class="row"><label class="btn small ghost" style="cursor:pointer">${T('photo')}<input type="file" id="aif" accept="image/*" hidden></label>
    <span id="aip" class="note"></span></div>
    <form class="row" id="aiform"><input id="aiq" type="text" placeholder="${T('ask')}" autocomplete="off" style="flex:1"><button class="btn small" id="ais">${T('send')}</button></form></div>`;
  document.body.appendChild(box);
  const msgs = box.querySelector('#aim');
  let photo = null;
  const add = (cls, html) => { const d = document.createElement('div'); d.className = 'bub ' + cls; d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; };
  box.querySelector('#aic').onclick = () => box.remove();
  box.querySelector('#aif').onchange = async (e) => {
    if (!e.target.files[0]) return;
    try { photo = await shrink(e.target.files[0]); box.querySelector('#aip').textContent = '✅ ' + e.target.files[0].name; } catch (x) { photo = null; }
    e.target.value = '';
  };
  box.querySelector('#aiform').onsubmit = async (e) => {
    e.preventDefault();
    const q = box.querySelector('#aiq'), btn = box.querySelector('#ais');
    const text = q.value.trim() || (photo ? T('defQ') : '');
    if (!text) return;
    const sent = photo;
    add('me', `${sent ? `<img src="${sent.url}" alt=""><br>` : ''}${fmt(text)}`);
    q.value = ''; photo = null; box.querySelector('#aip').textContent = '';
    btn.disabled = true;
    const wait = add('bot', T('think'));
    try {
      const parts = [text];
      if (sent) parts.push({ inlineData: { mimeType: 'image/jpeg', data: sent.data } });
      const r = await chat.sendMessage(parts);
      wait.innerHTML = fmt(r.response.text());
    } catch (ex) {
      wait.innerHTML = `${esc(T('err'))}<br><small>${esc(ex.code || ex.message || '')}</small>`;
    }
    btn.disabled = false; msgs.scrollTop = msgs.scrollHeight;
  };
}
document.addEventListener('click', (e) => { const b = e.target.closest('.ai-open'); if (b) openChat(b.dataset.id); });