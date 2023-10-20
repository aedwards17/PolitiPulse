// Import necessary modules
const axios = require('axios');
const admin = require('firebase-admin');

// Retrieve the Firebase service account key from an environment variable
const serviceAccount = process.env['FB_KEY'];

// Initialize the Firebase Admin SDK with the service account key and a database URL
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: "https://politipulse-default-rtdb.firebaseio.com"
});

// Set up a connection to the Firestore database and configure Firestore settings
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// Retrieve the API key for ProPublica from an environment variable
const apiKey = process.env['API_KEY'];
const apiUrl = 'https://api.propublica.org/congress/v1';

// Define parameters for the ProPublica API request
const congress = 118; // 105-117
const chamber = 'house'; // 'senate' or 'house'
const session = 1; // 1 is for odd-numbered year, and 2 is for even-numbered years

// Define an asynchronous function to fetch and push data to Firestore
// This function will fetch the roll_call number and bill id
async function fetchAndPushData(offset) {
  try {
    // Make an HTTP request to the ProPublica API to fetch member data
    const response = await axios.get(`https://api.propublica.org/congress/v1/${chamber}/votes/recent.json?offset=${offset}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    const data = response.data;

    if (data.results) {
      const votes = data.results.votes;
      for (const vote of votes){
        const docRef = db.collection('votes').doc(vote.roll_call.toString());
        await docRef.set({
          bill_id: vote.bill.bill_id,
        });        
      }
    } else {
      console.log('No results found for the query.');
    }
  } catch (error) {
    console.error('Error fetching and pushing data:', error.message);
  }
}

/*
async function getMemberInfo(roll_call_number){
  try {
    const response = await axios.get(`https://api.propublica.org/congress/v1/${congress}/${chamber}/sessions/${session}/votes/R${roll_call_number}.json`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    const data = response.data;

    if (data.results) {
      const positions = data.results.votes.vote.positions;
      for (const position of positions){
        const docRef = db.collection("votes").doc(roll_call_number));
        await docRef.set({
          member_id: position.member_id,
          vote_position: position.vote_position);
        });
      }
    } else {
      console.error('Error fetching and pushing data1:', error.message);
    }

  } catch(error) {
    console.error('Error fetching and pushing data2:', error.message);
  }
}
*/
//
/*
var offset = 100;
for (var i = 0; i < offset; i += 20) {
  fetchAndPushData(i);
}
*/
fetchAndPushData(2);
// results -> votes -> vote ->
// roll_call
// bill -> bill_id
// positions -> member_id
// vote_position