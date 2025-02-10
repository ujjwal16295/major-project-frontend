// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUsTswJaJZiZGEWBDRgayv92U4ju20ULw",
  authDomain: "major-project-b3f8c.firebaseapp.com",
  projectId: "major-project-b3f8c",
  storageBucket: "major-project-b3f8c.firebasestorage.app",
  messagingSenderId: "340549359923",
  appId: "1:340549359923:web:5c1fd0eeccd07ce9648646"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };