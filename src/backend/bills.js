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
const chamber = 'both';
const type = 'active';

// Define an asynchronous function to fetch and push data to Firestore
async function fetchAndPushData() {
  try {
    // Make an HTTP request to the ProPublica API to fetch bill data
    // "?offset=value" can be added to the end of the URL to page through the results
    const response = await axios.get(`${apiUrl}/${congress}/${chamber}/bills/${type}.json`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    const data = response.data;
    if (data.results) {
      const bills = data.results[0].bills;

      // Loop through the fetched bills and store them in Firestore
      for (const bill of bills) {
        // Fetch the bill URL using another function
        const bill_url = await getBillUrl(bill.bill_id, bill.bill_uri);

        // Get a reference to the Firestore document and set its data
        const docRef = db.collection('bills').doc(bill.bill_id);
        await docRef.set({
          bill_number: bill.number,
          bill_title: bill.short_title,
          bill_description: bill.title,
          bill_date: bill.introduced_date,
          bill_status: bill.active ? "Active" : "Not Active",
          latest_major_action: bill.latest_major_action,
          latest_major_action_date: bill.latest_major_action_date,
          bill_summary: bill.summary,
          bill_short_summary: bill.short_summary,
          bill_url: bill_url,
        });
      }
    } else {
      console.log('No results found for the query.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Define an asynchronous function to fetch the bill URL
async function getBillUrl(bill_id, url) {
  try {
    // Make an HTTP request to the ProPublica API to get the bill URL
    const response = await axios.get(url, {
      headers: {
        'X-API-Key': apiKey,
      },
    });

    // Extract the URL from the response data and log it
    const data = response.data.results[0].versions[0].url;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

// Call the main function to start the data fetching and storing process
fetchAndPushData();