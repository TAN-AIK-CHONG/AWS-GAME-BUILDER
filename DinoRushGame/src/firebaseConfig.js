import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDaqgpvhYNs80XnfnPCQ3W0ewvQUhLzP80",
    authDomain: "dinorush-leaderboard.firebaseapp.com",
    projectId: "dinorush-leaderboard",
    storageBucket: "dinorush-leaderboard.firebasestorage.app",
    messagingSenderId: "542672143936",
    appId: "1:542672143936:web:4934a18a823ed2858901a5",
    measurementId: "G-TET1KYMK2K"
  };

export const getFirebaseApp = () => initializeApp(firebaseConfig);