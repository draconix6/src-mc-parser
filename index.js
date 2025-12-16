// import path from 'node:path';
import process from 'node:process';
// import {authenticate} from '@google-cloud/local-auth';
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';
// import {readFile} from 'fs';

// The scope for reading spreadsheets.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
async function listMajors() {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: SCOPES,
  });

    const keys = JSON.parse(data)
    const authClient = JWT.fromJSON(keys);

    // Create a new Sheets API client.
    const sheets = google.sheets({version: 'v4', auth});
    // Get the values from the spreadsheet.
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E',
    });
    const rows = result.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    console.log('Name, Major:');
    // Print the name and major of each student.
    rows.forEach((row) => {
      // Print columns A and E, which correspond to indices 0 and 4.
      console.log(`${row[0]}, ${row[4]}`);
    });
  // });
}

await listMajors();

import express from 'express';
const app = express()

app.use(express.static('public'));
app.get('/', async (req, res) => {
  appendToSheet();
  res.send('Hello World')}
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});
