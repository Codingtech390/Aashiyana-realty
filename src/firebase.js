// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABtAvrsWKKG3tJT4bmsrcJfuXQzZKbgeo",
  authDomain: "aashiyana-realty-252ad.firebaseapp.com",
  projectId: "aashiyana-realty-252ad",
  storageBucket: "aashiyana-realty-252ad.appspot.com",
  messagingSenderId: "411125586228",
  appId: "1:411125586228:web:56b75962460ce6439e6d61"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();