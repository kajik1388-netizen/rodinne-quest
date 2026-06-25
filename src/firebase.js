import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCbwCY3-U4tvj43EbdyKaZim9R4NAn3XXk",
  authDomain: "rodinne-quest.firebaseapp.com",
  projectId: "rodinne-quest",
  storageBucket: "rodinne-quest.firebasestorage.app",
  messagingSenderId: "401802255212",
  appId: "1:401802255212:web:6341a334429af79a2af149"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Ulož dáta do Firebase
export const fbSave = async (key, value) => {
  try {
    await setDoc(doc(db, "rq", key), { d: JSON.stringify(value) });
  } catch (e) {
    console.error("fbSave error:", key, e);
  }
};

// Načítaj dáta z Firebase (raz)
export const fbLoad = async (key) => {
  try {
    const snap = await getDoc(doc(db, "rq", key));
    if (snap.exists()) return JSON.parse(snap.data().d);
    return null;
  } catch (e) {
    console.error("fbLoad error:", key, e);
    return null;
  }
};

// Počúvaj zmeny v reálnom čase
export const fbListen = (key, callback) => {
  return onSnapshot(doc(db, "rq", key), (snap) => {
    if (snap.exists()) {
      try { callback(JSON.parse(snap.data().d)); }
      catch (e) { console.error("fbListen parse error:", key, e); }
    }
  }, (e) => console.error("fbListen error:", key, e));
};
