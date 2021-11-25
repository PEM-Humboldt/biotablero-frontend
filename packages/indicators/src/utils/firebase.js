import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore/lite';

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
  const list = await getDocs(collection(db, 'indicators'));
  return list.docs.map((indicatorDoc) => ({ id: indicatorDoc.id, ...indicatorDoc.data() }));
};

const filterIndicators = async (filters) => {
  const db = getDB();
  const ref = collection(db, 'indicators');
  const q = query(ref, where('tags', 'array-contains-any', filters));
  const list = await getDocs(q);
  return list.docs.map((indicatorDoc) => ({ id: indicatorDoc.id, ...indicatorDoc.data() }));
};

const getTags = async () => {
  const tags = new Map();
  const db = getDB();
  const list = await getDocs(collection(db, 'tags'));

  list.docs.forEach((tagDoc) => {
    const tagInfo = tagDoc.data();
    const group = tags.has(tagInfo.category_id) ? tags.get(tagInfo.category_id) : [];

    group.push(tagInfo.tag);
    tags.set(tagInfo.category_id, group);
  });

  const tagsArray = Array.from(tags);
  const catNames = await Promise.all(
    tagsArray.map(([cat]) => getDoc(doc(db, 'tag_categories', cat)))
  );

  return new Map(catNames.map((cat, idx) => [cat.data().category, tagsArray[idx][1]]));
};

export { getIndicators, getTags, filterIndicators };
