import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyC_ybMcHhZzv_56o0CLDv339dl1WNErCG4",
  authDomain: "welly-df3f6.firebaseapp.com",
  projectId: "welly-df3f6",
  storageBucket: "welly-df3f6.firebasestorage.app",
  messagingSenderId: "1011771889165",
  appId: "1:1011771889165:web:9eb6cac8514df0af276744",
  measurementId: "G-29BWFXR6M4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.languageCode = 'en';


const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { app, auth, googleProvider };