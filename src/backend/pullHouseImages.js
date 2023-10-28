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

// Retrieve the API key for Congress.gov from an environment variable
const apiKey = process.env['CONGRESS_API_KEY'];
const apiUrl = 'https://api.congress.gov/v3/member';

// Define an asynchronous function to fetch and push image data to Firestore
async function fetchAndPushImage() {
  try {
    // Get a reference to the "house" collection in Firestore
    const houseCollection = db.collection('house');

    // Get all documents from the "house" collection
    const houseSnapshot = await houseCollection.get();

    // Iterate through the documents in the collection
    for (const doc of houseSnapshot.docs) {
      const memberId = doc.id; // Document ID is the member ID
      const response = await axios.get(`${apiUrl}/${memberId}?api_key=${apiKey}`);
      const congressData = response.data;
      if (congressData.member) {
        const imageUrl = congressData.member.depiction.imageUrl;

        // Update the Firestore document with the image URL
        await doc.ref.update({
          imageUrl: imageUrl
        });
      }
    }

    console.log('Image fetching and updating completed.');
  } catch (error) {
    console.error('Error fetching and updating images:', error.message);
  }
}

fetchAndPushImage();