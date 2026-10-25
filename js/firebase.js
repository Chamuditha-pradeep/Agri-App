// Firebase setup (browser ES module via CDN). Exposes window.AgriFB for the rest of the app.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile }
  from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, getDocs, deleteDoc, collection, serverTimestamp }
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
window.dispatchEvent(new Event('agri-ready'));

onAuthStateChanged(auth, async (u) => {
  let profile = null;
  if (u) {
    try { const s = await getDoc(doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : null; } catch (e) { /* rules not set yet */ }
    window.AgriFB.user = { uid: u.uid, email: u.email, name: (profile && profile.name) || u.displayName || u.email, role: (profile && profile.role) || 'farmer' };
  } else window.AgriFB.user = null;
  window.dispatchEvent(new CustomEvent('agri-auth', { detail: window.AgriFB.user }));
});
