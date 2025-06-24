import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAe4ZDUJKZYq7badfWxOe5qqPBK6k4eX98",
  authDomain: "ease-to-cure.firebaseapp.com",
  projectId: "ease-to-cure",
  storageBucket: "ease-to-cure.appspot.com",
  messagingSenderId: "76396678816",
  appId: "1:76396678816:web:e39fd82bf59d97da8b83c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getFirestore(app);
const db = getFirestore(app);

export { auth, db };
