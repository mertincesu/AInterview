// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzNrWgXRjqyk9LiKuFlUcsdQAshAyciHs",
  authDomain: "ainterview-a840e.firebaseapp.com",
  projectId: "ainterview-a840e",
  storageBucket: "ainterview-a840e.appspot.com",
  messagingSenderId: "734795043911",
  appId: "1:734795043911:web:b2fcd98c7f7723e0374d62",
  measurementId: "G-QX1TBZWNZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };