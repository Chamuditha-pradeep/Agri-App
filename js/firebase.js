// Firebase setup (browser ES module via CDN). Exposes window.AgriFB for the rest of the app.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app-check.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile }
  from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, addDoc, query, orderBy, limit, where, collection, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCb62OjEALx12D-NVL8HI_KeykUt28Zr10',
  authDomain: 'agri-app-af26f.firebaseapp.com',
  projectId: 'agri-app-af26f',
  storageBucket: 'agri-app-af26f.firebasestorage.app',
  messagingSenderId: '134101704188',
  appId: '1:134101704188:web:e91d24f15ec89f938a6679'
};

const app = initializeApp(firebaseConfig);

// App Check (required by Firebase AI Logic). On localhost a debug token is printed in the browser console
// (F12 > Console): register it in Firebase console > App Check > your web app > Manage debug tokens.
// For the real website, paste your reCAPTCHA Enterprise site key below.
const RECAPTCHA_SITE_KEY = '';
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
if (isLocal) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
if (isLocal || RECAPTCHA_SITE_KEY) {
  try { initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY || 'debug-only'), isTokenAutoRefreshEnabled: true }); }
  catch (e) { console.warn('App Check init failed', e); }
}
const auth = getAuth(app);
const db = getFirestore(app);

window.AgriFB = {
  app, auth, db,
  user: null,      // { uid, email, name, role } or null
  async register(name, role, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), { name, role, email, createdAt: serverTimestamp() });
  },
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth)
};

const slug = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Background photos: Firestore collection `backgrounds` (admin writes, everyone reads)
window.AgriFB.bg = {
  cache: new Map(),
  id: (level, ...parts) => level + '--' + parts.map(slug).join('--'),
  async get(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    let u = null;
    try { const d = await getDoc(doc(db, 'backgrounds', id)); u = d.exists() ? d.data().url : null; } catch (e) { /* offline or no rules */ }
    this.cache.set(id, u); return u;
  },
  async set(id, data) { await setDoc(doc(db, 'backgrounds', id), { ...data, updatedAt: serverTimestamp() }); this.cache.set(id, data.url); },
  async remove(id) { await deleteDoc(doc(db, 'backgrounds', id)); this.cache.delete(id); },
  async list() { const q = await getDocs(collection(db, 'backgrounds')); return q.docs.map((d) => ({ id: d.id, ...d.data() })); },
  async resolve(chain) {   // chain = [[level, ...names], ...] most specific first
    for (const [level, ...names] of chain) { const u = await this.get(this.id(level, ...names)); if (u) return u; }
    return null;
  }
};

// Crops: meta in `crops`, big content (background photo, Word-like pages) in `cropPages`
window.AgriFB.crops = {
  async list() { const q = await getDocs(collection(db, 'crops')); return q.docs.map((d) => d.data()); },
  save: (c) => setDoc(doc(db, 'crops', c.id), c),
  async remove(id) {
    await deleteDoc(doc(db, 'crops', id));
    for (const k of ['bg', 'si', 'ta', 'en']) { try { await deleteDoc(doc(db, 'cropPages', id + '__' + k)); } catch (e) { /* ignore */ } }
  },
  async page(id, k) { try { const d = await getDoc(doc(db, 'cropPages', id + '__' + k)); return d.exists() ? d.data().data : null; } catch (e) { return null; } },
  setPage: (id, k, data) => setDoc(doc(db, 'cropPages', id + '__' + k), { data })
};
window.dispatchEvent(new Event('agri-ready'));

// Community: posts (feed) and comments (on posts and on crops, target = 'post:<id>' | 'crop:<id>')
window.AgriFB.community = {
  addPost(p) { const u = window.AgriFB.user; return addDoc(collection(db, 'posts'), { uid: u.uid, name: u.name, role: u.role, text: p.text, photo: p.photo || '', kind: p.kind || 'general', crop: p.crop || '', createdAt: serverTimestamp() }); },
  async posts() { const q = await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(30))); return q.docs.map((d) => ({ id: d.id, ...d.data() })); },
  removePost: (id) => deleteDoc(doc(db, 'posts', id)),
  addComment(target, text) { const u = window.AgriFB.user; return addDoc(collection(db, 'comments'), { target, uid: u.uid, name: u.name, text, createdAt: serverTimestamp() }); },
  async comments(target) {
    const q = await getDocs(query(collection(db, 'comments'), where('target', '==', target), limit(100)));
    return q.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => ((a.createdAt && a.createdAt.seconds) || 0) - ((b.createdAt && b.createdAt.seconds) || 0));
  },
  removeComment: (id) => deleteDoc(doc(db, 'comments', id))
};

onAuthStateChanged(auth, async (u) => {
  let profile = null;
  if (u) {
    try { const s = await getDoc(doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : null; } catch (e) { /* rules not set yet */ }
    window.AgriFB.user = { uid: u.uid, email: u.email, name: (profile && profile.name) || u.displayName || u.email, role: (profile && profile.role) || 'farmer' };
  } else window.AgriFB.user = null;
  window.dispatchEvent(new CustomEvent('agri-auth', { detail: window.AgriFB.user }));
});
