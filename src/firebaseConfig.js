import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCQC24eDWd5x-E8l-7YP9JfOocmQYz6d0",
  authDomain: "wedding-9a85f.firebaseapp.com",
  projectId: "wedding-9a85f",
  storageBucket: "wedding-9a85f.firebasestorage.app",
  messagingSenderId: "533664248675",
  appId: "1:533664248675:web:805497be4334ba1fac5956",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
