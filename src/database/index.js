var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://politipulse.firebaseio.com"
});

const db = admin.firestore();
async function foo() {
const docRef = db.collection('users').doc('alovelace');
await docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});
}
foo();