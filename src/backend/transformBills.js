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

// Function to fetch and process XML data
const processXMLData = async (url) => {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    const parsedXML = await xml2js.parseStringPromise(xml);
    const textToProcess = JSON.stringify(parsedXML);
    return textToProcess;
  } catch (error) {
    console.error("Error fetching or processing XML data:", error);
    return null;
  }
};

const simplifyBill = async () => {
  try {
    const billIdsToUpdate = ['hr5894-118']; 

    for (const billId of billIdsToUpdate) {
      const docRef = firestore.collection('bills').doc(billId);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        if (data.bill_url && !data.bill_simplified) {
          const textToProcess = await processXMLData(data.bill_url);
          if (textToProcess) {
            // Split the text into chunks
            const MAX_CHAR = 4096 * 3.8; 
            const chunks = splitIntoChunks(textToProcess, MAX_CHAR);
            // Array to hold simplified text chunks
            const simplifiedTextChunks = [];

            for (const chunk of chunks) {
              const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                  {
                    role: 'system',
                    content: 'Simplify this bill and remove jargon. Make it very digestible.'
                  },
                  {
                    role: 'user',
                    content: chunk,
                  },
                ],
              });
              simplifiedTextChunks.push(response.choices[0].message.content);
            }

            // Combine the simplified text chunks back into a single string
            const simplifiedText = simplifiedTextChunks.join(' ');

            const response = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'Simplify this bill and remove jargon. Make it very digestible.'
                },
                {
                  role: 'user',
                  content: simplifiedText,
                },
              ],
            });

            // Update the bill document with the new simplified text
            console.log(response.choices[0].message.content);
            await docRef.update({
              bill_simplified: response.choices[0].message.content
            });

            console.log(`Bill ${billId} updated with simplified text.`);
          }
        } else {
          console.log(`Bill ${billId} already has simplified text or does not need updating.`);
        }
      } else {
        console.log(`Bill ${billId} does not exist in the database.`);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Helper function to split text into chunks with a maximum size
function splitIntoChunks(text, maxChars) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  words.forEach(word => {
    if ((currentChunk + ' ' + word).length > maxChars) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += ' ' + word;
    }
  });

  // Push the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

simplifyBill();