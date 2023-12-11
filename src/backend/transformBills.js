const OpenAI = require('openai').OpenAI;
const admin = require('firebase-admin');
const xml2js = require('xml2js');
const axios = require('axios'); 

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const serviceAccount = process.env['FB_KEY'];

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: "https://politipulse-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore(); 

// Function to fetch and process XML data from a given URL
const processXMLData = async (url) => {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    const parsedXML = await xml2js.parseStringPromise(xml);
    return JSON.stringify(parsedXML);
  } catch (error) {
    console.error("Error fetching or processing XML data:", error);
    return null;
  }
};

// Function to simplify bill text using OpenAI
const simplifyBill = async () => {
  try {
    const billIdsToUpdate = ['hr5894-118']; // List of bill IDs to update

    for (const billId of billIdsToUpdate) {
      const docRef = firestore.collection('bills').doc(billId);
      const doc = await docRef.get();

      if (doc.exists && !doc.data().bill_simplified) {
        const data = doc.data();
        if (data.bill_url) {
          const textToProcess = await processXMLData(data.bill_url);

          if (textToProcess && textToProcess.length <= 15000) { // Check if text length is within limit
            const response = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'Simplify this bill and remove jargon. Make it very digestible.'
                },
                {
                  role: 'user',
                  content: textToProcess,
                },
              ],
            });

            // Update the Firestore document with the simplified text
            await docRef.update({ bill_simplified: response.choices[0].message.content });
            console.log(`Bill ${billId} updated with simplified text.`);
          } else {
            console.log(`Bill ${billId} text is too long for simplification.`);
          }
        } else {
          console.log(`Bill ${billId} has no URL to process.`);
        }
      } else {
        console.log(`Bill ${billId} does not exist or already has simplified text.`);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Main function to orchestrate the bill simplification process
const main = async () => {
  await simplifyBill();
};

// Start the script
main();
