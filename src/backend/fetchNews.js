// Import necessary modules
const axios = require('axios');
const admin = require('firebase-admin');

// Retrieve the Firebase service account key and other necessary keys from environment variables
const serviceAccount = process.env['FB_KEY'];
const newsApiKey = process.env['NEWS_API_KEY'];
const newsApiUrl = 'https://us-congress-top-news.p.rapidapi.com/top_congressional_news.json'; 

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: "https://politipulse-default-rtdb.firebaseio.com"
});

// Firestore database connection
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

// Define an asynchronous function to fetch and push news data to Firestore
async function fetchAndPushNews() {
  try {
    // Define the Firestore collection where news data will be stored
    const newsCollection = db.collection('news');

    // Fetch news data from the external API
    const response = await axios.get(newsApiUrl, {
      params: {
        limit: 20
      },
      headers: {
        'X-RapidAPI-Key': newsApiKey,
        'X-RapidAPI-Host': 'us-congress-top-news.p.rapidapi.com'
      }
    });
    const newsData = response.data; // Adjust this according to the actual structure of your news data

    // Verify if newsData contains the expected array of news items
    if (!Array.isArray(newsData)) {
      throw new Error("Unexpected data format received from news API");
    }

    // Push each news item to the Firestore collection
    newsData.forEach(async (newsItem) => {
      const docRef = newsCollection.doc(); // Creates a new document with a unique ID
      await docRef.set(newsItem); // Adjust this if you need to transform the news item structure
    });

    console.log('News fetching and updating completed.');
  } catch (error) {
    console.error('Error fetching and updating news:', error.message);
  }
}

// Define the main function to orchestrate the data fetching and storing process
async function main() {
  try {
    await fetchAndPushNews();
    console.log('News data fetched and stored successfully.');
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
}

// Call the main function to start the process
main();
