// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb5yTKse9eSiHK4-lEec0ljkLfYhjbmGs",
  authDomain: "xed-institute.firebaseapp.com",
  projectId: "xed-institute",
  storageBucket: "xed-institute.firebasestorage.app",
  messagingSenderId: "890982441704",
  appId: "1:890982441704:web:568e662e39749c76f75f5d",
  measurementId: "G-2M8J16VFDH",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, auth };
