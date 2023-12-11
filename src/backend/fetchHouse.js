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
const congress = 118;
const chamber = 'house'; // 'senate' or 'house'

// Define an asynchronous function to fetch and push data to Firestore

async function fetchAndPushData() {
  try {
    // Make an HTTP request to the ProPublica API to fetch member data
    const response = await axios.get(`${apiUrl}/${congress}/${chamber}/members.json`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    const data = response.data;

    if (data.results) {
      const members = data.results[0].members;

      // Loop through the fetched members and store them in Firestore
      for (const member of members) {
        // Get a reference to the Firestore document and set its data
        const docRef = db.collection(chamber).doc(member.id);
        await docRef.set({
          last_name: member.last_name,
          first_name: member.first_name,
          title: member.title,
          congress: data.results[0].congress,
          state: member.state,
          district: member.district,
          party: member.party,
          dob: member.date_of_birth,
          gender: member.gender,
          twitter_account: member.twitter_account,
          facebook_account: member.facebook_account,
          youtube_account: member.youtube_account,
          website: member.url,
          next_election: member.next_election
        }, {merge: true});
      }
    } else {
      console.log('No results found for the query.');
    }
  } catch (error) {
    console.error('Error fetching and pushing data:', error.message);
  }
}

// Define the main function to orchestrate the data fetching and storing process
async function main() {
  try {
    await fetchAndPushData();
    console.log('Data fetching and pushing complete.');
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
}

// Call the main function to start the process
main();
