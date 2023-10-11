const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

const apiKey = process.env['API_KEY'];
const apiUrl = 'https://api.propublica.org/congress/v1';

axios.get(`${apiUrl}/bills/search.json?query=2023`, {
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
    if (data.results) {
        const bills = data.results[0].bills;

        bills.forEach(bill => {
            console.log('Bill ID:', bill.bill_id);
            console.log('Bill Title:', bill.title);
            console.log('Description:', bill.summary_short);
            console.log('URL:', bill.bill_uri);
            console.log('Date:', bill.introduced_date);
            console.log('Active:', bill.active);
            console.log('House Passage:', bill.house_passage);
            console.log('Senate Passage:', bill.senate_passage);
            console.log('Enacted:', bill.enacted);
            console.log('Vetoed:', bill.vetoed);
            console.log('--------------------------------------');
        });
    } else {
        console.log('No results found for the query.');
    }
}