// src/firebase.js

import firebase from 'firebase/app';
import 'firebase/firestore';

const serviceAccount = process.env('FB_API_KEY')
const firebaseConfig = {serviceAccount};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
// test 4
export { db };
