import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDR1itA_UvLTsQHG_sm3Vuxsdqyp_gUjMk",
  authDomain: "checklist-ffa39.firebaseapp.com",
  projectId: "checklist-ffa39",
  storageBucket: "checklist-ffa39.appspot.com",
  messagingSenderId: "900820103096",
  appId: "1:900820103096:web:ba707d2845fef795d2a94d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };