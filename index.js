// import path from 'node:path';
import process from 'node:process';
import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Gets cell values from a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} range The range of cells to retrieve.
 * @return {Promise<object>} The response from the get request.
 */
async function getValues(spreadsheetId, range) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});
  // Get the values from the specified range.
  const result = await service.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const numRows = result.data.values ? result.data.values.length : 0;
  console.log(`${numRows} rows retrieved.`);
  return result;
}

import express from 'express';
const app = express()

app.use(express.static('public'));
app.get('/', async (req, res) => {
  // appendToSheet();
  res.send(await getValues("1qsPHFXee0SB0Pc8KYxLWa-u18xjFoAymzu4ALyI17gs", "Sheet1"))}
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});
