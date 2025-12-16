import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

/**
 * Updates values in a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet to update.
 * @param {string} range The range of cells to update.
 * @param {string} valueInputOption How the input data should be interpreted.
 * @param {(string[])[]} _values A 2D array of values to update.
 * @return {Promise<object>} The response from the update request.
 */
async function updateValues(spreadsheetId, range, valueInputOption, _values) {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  const service = google.sheets({version: 'v4', auth});

  // The values to update in the spreadsheet.
  let values = [
    [
      "hi"
    ],
    // Additional rows ...
  ];

  // Create the request body.
  const resource = {
    values,
  };

  // Update the values in the spreadsheet.
  const result = await service.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption,
    resource,
  });

  // Log the number of updated cells.
  console.log('%d cells updated.', result.data.updatedCells);
  return result;
}

updateValues("1qsPHFXee0SB0Pc8KYxLWa-u18xjFoAymzu4ALyI17gs", "Sheet1!B2", "USER_ENTERED");

// import express from 'express';
// const app = express()

// app.use(express.static('public'));
// app.get('/', async (req, res) => {
//   // appendToSheet();
//   res.send(await getValues("1qsPHFXee0SB0Pc8KYxLWa-u18xjFoAymzu4ALyI17gs", "Sheet1"))}
// );

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(
//     `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
//   );
// });
