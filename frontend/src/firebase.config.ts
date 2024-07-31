import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDir-zvhrzJZgWElnUfjFTzL4Zo0zuH_pk",
  authDomain: "edu-system2.firebaseapp.com",
  projectId: "edu-system2",
  storageBucket: "edu-system2.appspot.com",
  messagingSenderId: "855741339000",
  appId: "1:855741339000:web:132230c985fa0b848c648d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
