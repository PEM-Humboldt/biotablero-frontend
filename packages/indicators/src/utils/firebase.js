import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const {
  REACT_APP_API_KEY: apiKey,
  REACT_APP_DOMAIN: authDomain,
  REACT_APP_PROJECT_ID: projectId,
  REACT_APP_STORAGE_BUCKET: storageBucket,
  REACT_APP_SENDER_ID: messagingSenderId,
  REACT_APP_APP_ID: appId,
} = process.env;

const config = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

let firestore = null;

const getDB = () => {
  if (firestore !== null) return firestore;
  const app = initializeApp(config);
  firestore = getFirestore(app);
  return firestore;
};

const getIndicators = async () => {
  const db = getDB();
  const list = await getDocs(collection(db, 'indicadores'));
  return list.docs.map((doc) => doc.data());
};

export default getIndicators;
