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
const congress = 118; // 105-118
const chamber = 'both'; // house, senate, or both
const type = 'active'; // introduced, updated, active, passed, enacted or vetoed

// Define an asynchronous function to fetch and push data to Firestore

async function fetchAndPushData(offset) {
  try {
    // Make an HTTP request to the ProPublica API to fetch bill data
    // ?offset=value can be added to the end of the URL to page through the results
    const response = await axios.get(`${apiUrl}/${congress}/${chamber}/bills/${type}.json?offset=${offset}`, {
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
          bill_number: bill.number !== undefined ? bill.number : null,
          bill_title: bill.short_title !== undefined ? bill.short_title : null,
          bill_description: bill.title !== undefined ? bill.title : null,
          bill_date: bill.introduced_date !== undefined ? bill.introduced_date : null,
          bill_status: bill.active !== undefined ? (bill.active ? "Active" : "Not Active") : null,
          latest_major_action: bill.latest_major_action !== undefined ? bill.latest_major_action : null,
          latest_major_action_date: bill.latest_major_action_date !== undefined ? bill.latest_major_action_date : null,
          bill_summary: bill.summary !== undefined ? bill.summary : null,
          bill_short_summary: bill.summary_short !== undefined ? bill.summary_short : null,
          bill_url: bill_url !== undefined ? bill_url : null,
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
for (var i = 0; i < 100; i += 20) {
  console.log(i);
  fetchAndPushData(i);
}
db.collection("bills").get().then(function(querySnapshot) {      
    console.log(querySnapshot.size); 
});