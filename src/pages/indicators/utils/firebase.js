import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore/lite";

const config = {
  apiKey: window._env_?.VITE_API_KEY || import.meta.env.VITE_API_KEY,
  authDomain: window._env_?.VITE_DOMAIN || import.meta.env.VITE_DOMAIN,
  projectId: window._env_?.VITE_PROJECT_ID || import.meta.env.VITE_PROJECT_ID,
  storageBucket:
    window._env_?.VITE_STORAGE_BUCKET || import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId:
    window._env_?.VITE_SENDER_ID || import.meta.env.VITE_SENDER_ID,
  appId: window._env_?.VITE_APP_ID || import.meta.env.VITE_APP_ID,
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
  const list = await getDocs(collection(db, "indicators"));
  return list.docs.map((indicatorDoc) => ({
    id: indicatorDoc.id,
    ...indicatorDoc.data(),
  }));
};

const getTags = async () => {
  const tags = new Map();
  const db = getDB();
  const list = await getDocs(collection(db, "tags"));

  list.docs.forEach((tagDoc) => {
    const tagInfo = tagDoc.data();
    const group = tags.has(tagInfo.category_id)
      ? tags.get(tagInfo.category_id)
      : [];

    group.push(tagInfo.tag);
    tags.set(tagInfo.category_id, group);
  });

  const tagsArray = Array.from(tags);
  const catNames = await Promise.all(
    tagsArray.map(([cat]) => getDoc(doc(db, "tag_categories", cat))),
  );

  return new Map(
    catNames.map((cat, idx) => [cat.data().category, tagsArray[idx][1]]),
  );
};

export { getIndicators, getTags };
