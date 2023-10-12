// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwcXOaJFYF8ISoP4OmIs15xfHkTwitrsQ",
  authDomain: "simple-todo-1a6c7.firebaseapp.com",
  projectId: "simple-todo-1a6c7",
  storageBucket: "simple-todo-1a6c7.appspot.com",
  messagingSenderId: "369222179955",
  appId: "1:369222179955:web:b5591f5075628118e91e06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };