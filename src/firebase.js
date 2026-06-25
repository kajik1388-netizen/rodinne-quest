import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection } from "firebase/firestore";

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

// ── Pomocné funkcie ────────────────────────────────────

// Ulož dáta do Firebase
export const fbSave = async (key, value) => {
  try {
    await setDoc(doc(db, "rodinne-quest", key), { data: JSON.stringify(value) });
  } catch (e) {
    console.error("Firebase save error:", e);
  }
};

// Načítaj dáta z Firebase (raz)
export const fbLoad = async (key, defaultValue) => {
  try {
    const snap = await getDoc(doc(db, "rodinne-quest", key));
    if (snap.exists()) {
      return JSON.parse(snap.data().data);
    }
    return defaultValue;
  } catch (e) {
    console.error("Firebase load error:", e);
    return defaultValue;
  }
};

// Počúvaj zmeny v reálnom čase
export const fbListen = (key, callback) => {
  return onSnapshot(doc(db, "rodinne-quest", key), (snap) => {
    if (snap.exists()) {
      try {
        callback(JSON.parse(snap.data().data));
      } catch (e) {
        console.error("Firebase parse error:", e);
      }
    }
  });
};
