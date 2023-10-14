/*
const axios = require('axios');

const apiKey = process.env['API_KEY'];
const apiUrl = 'https://api.propublica.org/congress/v1/118/bills/hr680.json';

axios.get(`${apiUrl}`, {
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

function displayData(data) {
    try {
        if (data.results) {
            const bill = data.results[0];
            if (bill) {
                console.log(bill)
                console.log('--------------------------------------');
            } else {
                console.log('No bill found for this query.');
            }
        } else {
            console.log('No results found for the query.');
        }
    } catch (error) {
        console.error('Error displaying bill data:', error.message);
    }
}
*/
const axios = require('axios');
const admin = require('firebase-admin');
const fbKey = process.env['FB_KEY'];
const serviceAccount = fbKey;

const apiKey = process.env['API_KEY'];
const apiUrl = 'https://api.propublica.org/congress/v1';

const congress = 117; // 105-117
const chamber = 'both'; // house, senate, or both
const type = 'active'; // introduced, updated, active, passed, enacted, or vetoed

axios.get(`${apiUrl}/${congress}/${chamber}/bills/${type}.json`, {
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

function getBill(url){
  axios.get(`${url}`, {
    headers: {
        'X-API-Key': apiKey,
    },
  })
  .then(response => {
      // Handle the API data here
      const data = response.data.results[0].versions[0].url;
      console.log('Full Bill:', data);
  })
  .catch(error => {
      console.error('Error fetching data:', error.message);
  });
}
function displayData(data) {
    if (data.results) {
        const bills = data.results[0].bills;

        bills.forEach(bill => {
            console.log(bill);
            getBill(bill.bill_uri);
      console.log('--------------------------------------');
        });
    } else {
        console.log('No results found for the query.');
    }
}