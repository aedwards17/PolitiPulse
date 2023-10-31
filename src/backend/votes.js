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
db.settings({ ignoreUndefinedProperties: true });=

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
    const response = await axios.get(`https://api.propublica.org/congress/v1/${chamber}/votes/recent.json?offset=${offset}`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    const data = response.data;

    if (data.results) {
      const votes = data.results.votes;
      const batch = db.batch();

      for (const vote of votes) {
        const docRef = db.collection('votes').doc(vote.roll_call.toString());

        // Check if vote.bill is defined, and set the field accordingly
        const billId = vote.bill ? vote.bill.bill_id : null;

        await docRef.set({
          bill_id: billId,
        });
      }
    } else {
      console.log('No results found for the query.');
    }
  } catch (error) {
    console.error('Error fetching and pushing data:', error.message);
  }
}

// Define an asynchronous function to fetch and push member information to Firestore
async function getMemberInfo(roll_call_number) {
  try {
    const response = await axios.get(`https://api.propublica.org/congress/v1/${congress}/${chamber}/sessions/${session}/votes/${roll_call_number}.json`, {
      headers: {
        'X-API-Key': apiKey,
      },
    });
    const data = response.data;

    if (data.results) {
      const positions = data.results.votes.vote.positions;
      const batch = db.batch();
      const memberRef = db.collection('votes').doc(roll_call_number);

      positions.forEach((position) => {
        const memberId = position.member_id;
        const memberPosition = position.vote_position;

        // Check if memberId is defined, and set the field accordingly
        const memberData = { vote_position: memberPosition };
        if (memberId) {
          const positionRef = memberRef.collection('positions').doc(memberId);
          batch.set(positionRef, memberData);
        } else {
          // If memberId is missing, set null to avoid overwriting existing data
          batch.set(memberRef, { missing_member_id: null }, { merge: true });
        }
      });

      // Commit the batch write
      await batch.commit();
    } else {
      console.error('Error fetching data:', data.error.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}

// Define the main function for orchestration
async function main() {
  const offset = 100; // Set your desired offset
  const batchSize = 20; // Set the batch size

  const promises = [];

  // Fetch and push data in batches
  for (let i = 0; i < offset; i += batchSize) {
    promises.push(fetchAndPushData(i));
  }

  await Promise.all(promises);

  // Retrieve the documents from Firestore and fetch member information
  const collectionRef = db.collection('votes');

  collectionRef.get()
    .then((querySnapshot) => {
      const memberPromises = [];

      querySnapshot.forEach((doc) => {
        console.log(`Document ID: ${doc.id}`, doc.data());
        memberPromises.push(getMemberInfo(doc.id));
      });

      return Promise.all(memberPromises);
    })
    .catch((error) => {
      console.error('Error getting documents', error);
    });
}

// Call the main function to start the process
main();
