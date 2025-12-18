import {GoogleAuth} from 'google-auth-library';
import {google} from 'googleapis';

var service;

export async function auth() {
  // Authenticate with Google and get an authorized client.
  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  // Create a new Sheets API client.
  service = google.sheets({version: 'v4', auth});
}

/**
 * Appends values to a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet to update.
 * @param {string} range The range of cells to append to.
 * @param {string} valueInputOption How the input data should be interpreted.
 * @param {(string[])[]} values A 2D array of values to append.
 * @return {Promise<object>} The response from the append request.
 */
export async function appendValues(spreadsheetId, range, valueInputOption, values) {
  if (values.length == 0) return 0;

  if (!service) await auth();

  // Create the request body.
  const resource = {
    values,
  };

  // Append the values to the spreadsheet.
  const result = await service.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption,
    resource,
  });

  // console.log(`${result.data.updates.updatedCells} cells appended.`);
  return result;
}

/**
 * Gets cell values from a spreadsheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} range The range of cells to retrieve.
 * @return {Promise<object>} The response from the get request.
 */
export async function getValues(spreadsheetId, range) {
  if (!service) await auth();

  // Get the values from the specified range.
  const result = await service.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const numRows = result.data.values ? result.data.values.length : 0;
  // console.log(`${numRows} rows retrieved.`);
  return result;
}