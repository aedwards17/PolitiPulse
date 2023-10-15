const axios = require('axios');
const admin = require('firebase-admin');
const fbKey = process.env['FB_KEY'];
const serviceAccount = fbKey;

const apiKey = process.env['API_KEY'];
const apiUrl = 'https://api.propublica.org/congress/v1';

const congress = 117; // 105-117
const chamber = 'both'; // house, senate, or both
const type = 'active'; // introduced, updated, active, passed, enacted, or vetoed


axios.get(`${apiUrl}/${congress}/${chamber}/bills/${type}.json`, { // an offset can be placed here for expanding the database
  headers: {
    'X-API-Key': apiKey,
  },
})
  .then(response => {
    // Handle the API data here
    const data = response.data;
    displayData(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error.message);
  });

function getBill(bill_id, url) {
  axios.get(`${url}`, {
    headers: {
      'X-API-Key': apiKey,
    },
  })
    .then(response => {
      // Handle the API data here
      const data = response.data.results[0].versions[0].url;
      console.log(bill_id + " URL=" + data); //bill url will have to be inserted into firebase at this point
    })
    .catch(error => {
      console.error('Error fetching data:', error.message);
    });
}

function displayData(data) {
  if (data.results) {
    const bills = data.results[0].bills;

    bills.forEach(bill => {
      console.log("bill ID: " + bill.bill_id);
      console.log("bill number: " + bill.number);
      console.log("bill title: " + bill.short_title);
      console.log("bill description: " + bill.title);
      console.log("bill date: " + bill.introduced_date);
      console.log("bill status: " + (bill.active ? "Active" : "Not Active"));
      console.log("latest major action: " + bill.latest_major_action);
      console.log("latest major action date: " + bill.latest_major_action_date);
      console.log("bill summary: " + bill.summary);
      console.log("bill short summary: " + bill.short_summary); //this can be improved with gpt4all in future
      console.log(getBill(bill.bill_id, bill.bill_uri)) //this function will have to update firebase directly for the URL
      console.log('--------------------------------------');
    });
  } else {
    console.log('No results found for the query.');
  }
}