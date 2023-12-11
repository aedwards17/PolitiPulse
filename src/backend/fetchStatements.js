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

// Define an asynchronous function to fetch and push data to Firestore
async function fetchAndPushData(offset) {
  try {
    // Make an HTTP request to the ProPublica API to fetch latest statements
    const response = await axios.get(`${apiUrl}/statements/latest.json?offset=${offset}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    const data = response.data;
    if (data.results) {
      // Loop through the fetched statements and store them in Firestore
      for (const statement of data.results) {
        // Add the document to Firestore, letting Firestore automatically assign an ID
        await db.collection('statements').add({
          url: statement.url,
          date: statement.date,
          title: statement.title,
          statement_type: statement.statement_type,
          member_id: statement.member_id,
          congress: statement.congress,
          member_uri: statement.member_uri,
          name: statement.name,
          chamber: statement.chamber,
          state: statement.state,
          party: statement.party,
          subjects: statement.subjects
        });
      }
    } else {
      console.log('No results found for the query.');
    }
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
  }
}

// Define the main function to orchestrate the data fetching and storing process
async function main() {
  const offsetLimit = 400;
  const offsetStep = 20;

  for (let i = 0; i < offsetLimit; i += offsetStep) {
    console.log('Fetching data for offset:', i);
    await fetchAndPushData(i);
  }

  // Retrieve and log the size of the statements collection
  db.collection("statements").get().then(function(querySnapshot) {      
    console.log('Number of statements in the collection:', querySnapshot.size); 
  }).catch((error) => {
    console.error('Error getting documents:', error);
  });
}

// Call the main function to start the process
main();
