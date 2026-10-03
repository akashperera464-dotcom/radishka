import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, doc, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAQqF00Y6mtmc7OZS7U0geOk2sapzzI_-s',
  authDomain: 'institute-web-9170d.firebaseapp.com',
  projectId: 'institute-web-9170d',
  storageBucket: 'institute-web-9170d.firebasestorage.app',
  messagingSenderId: '906405894972',
  appId: '1:906405894972:web:a2f8be95bab92e05c11c39',
  measurementId: 'G-233LRQJLYZ',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const SITE_DOC = doc(db, 'site', 'content');
export const REQUESTS_COL = collection(db, 'requests');
