import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDrUt0geRjup3_vzcOQk-3yIfvO2YNzZCk",
  authDomain: "battleground-26-dhanu.firebaseapp.com",
  projectId: "battleground-26-dhanu",
  storageBucket: "battleground-26-dhanu.firebasestorage.app",
  messagingSenderId: "814205757977",
  appId: "1:814205757977:web:d82232c11311d171595888"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
