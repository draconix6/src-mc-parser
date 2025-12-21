import {SRC_API_URL, SHEET_NAMES} from './consts.js';
// import {SHEET_ID} from './sheet_id.js';
import {getSrcData} from './speedruncom.js';
import {getValues, appendValues} from './sheets.js';

const SHEET_ID = process.env.SHEET_ID;

async function getSubmissionsFromSheet(category) {
  if (!category) return [];
  console.log(`Getting existing submissions for ${category.name}...`);
  var headers = await getValues(SHEET_ID, `${category.sheetName}!1:1`);
  var linkColumn = String.fromCharCode(headers.data.values[0].indexOf("Link") + 65); // A = 65
  var res = await getValues(SHEET_ID, `${category.sheetName}!${linkColumn}:${linkColumn}`);
  return res.data.values;
}

async function appendSubmissionsToSheet() {
  var categories = await getSrcData(SRC_API_URL);
  for (let i in categories) {
    var cat = categories[i];
    var rows = [];
    var runsOnSheet = await getSubmissionsFromSheet(cat);
    for (let j in cat.runs) {
      var run = cat.runs[j];
      // do not add runs that exist on the sheet already
      var runExists = false;
      for (let y in runsOnSheet) {
        var row = runsOnSheet[y];
        if (row == run.link) {
          runExists = true;
          break;
        }
      }
      if (runExists) continue;

      rows.push(cat.getSheetsFormat(run));
    }
    if (rows.length == 0) {
      console.log(`${cat.name} has no new submissions`);
      continue;
    }
    appendValues(SHEET_ID, `${cat.sheetName}`, "USER_ENTERED", rows)
    .then(res => {
      console.log(`Added ${res.data.updates.updatedRows} new submissions to ${res.data.updates.updatedRange}`)
    });
  }
}

appendSubmissionsToSheet();