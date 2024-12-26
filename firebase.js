// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "process.env.FIREBASE_API_KEY",
  authDomain: "inventory-management-dc87f.firebaseapp.com",
  projectId: "inventory-management-dc87f",
  storageBucket: "inventory-management-dc87f.firebasestorage.app",
  messagingSenderId: "798126681814",
  appId: "1:798126681814:web:710ad97816ea53b1256377",
  measurementId: "G-0TKTTCYGL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
