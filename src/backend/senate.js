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
const congress = 117;
const chamber = 'senate'; // senate or house

// Define an asynchronous function to fetch and push data to Firestore

async function fetchAndPushData() {
  try {
    // Make an HTTP request to the ProPublica API to fetch bill data
    // ?offset=value can be added to the end of the URL to page through the results
    const response = await axios.get(`${apiUrl}/${congress}/${chamber}/members.json`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    const data = response.data;
    if (data.results) {
      const members = data.results[0].members;

      // Loop through the fetched bills and store them in Firestore
      for (const member of members) {
        // Get a reference to the Firestore document and set its data
        const docRef = db.collection('senate').doc(member.id);
        await docRef.set({
          last_name: member.last_name,
          first_name: member.first_name,
          title: member.title,
          state: member.state,
          party: member.party,
          dob: member.date_of_birth,
          gender: member.gender,
          twitter_account: member.twitter_account,
          facebook_account: member.facebook_account,
          youtube_account: member.youtube_account,
          website: member.url,
          contact: member.contact_form,

        });
      }
    } else {
      console.log('No results found for the query.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

fetchAndPushData();