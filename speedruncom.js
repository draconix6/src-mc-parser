import { GLITCHLESS_CUTOFFS, COOP_LABELS, SHEET_NAMES, GLITCHED_TYPES } from './consts.js';
import axios from 'axios';

export class SRCCategory {
  constructor(category) {
    this.name = category.name;
    this.id = category.id;
    this.sheetName = category.sheetName;
    this.longTimes = category.longTimes;
    this.runs = [];

    this.versionId = category.versionId;
    this.versions = [];
    this.versionFilter = null;
    if (category.versionFilter) this.versionFilter = category.versionFilter;

    this.seedTypeId = category.seedTypeId;
    this.seedTypes = [];
    this.seedTypeFilter = null;
    if (category.seedTypeFilter) this.seedTypeFilter = category.seedTypeFilter;

    this.playerCountId = category.playerCountId;
    this.playerCounts = [];

    this.glitchedTypeId = category.glitchedType;
    this.glitchedTypes = [];

    this.cutoffs = category.cutoffs;
  }

  getSheetsFormat(run) {
    switch (this.sheetName) {
      case SHEET_NAMES.RSG:
      case SHEET_NAMES.RSG_116:
        if (run.version == "1.16-1.19" || run.seedType == "Random Seed") {
          return [
            `open`,
            `${run.runner}`,
            `${run.inGameTime}`,
            `${run.submittedDate}`,
            `${run.link}`,
            `${run.requiresLogs ? "" : "not applicable"}`,
            // TODO: put n/a and stuff when logs aren't required
            ``,
          ];
        }
      case SHEET_NAMES.SSG:
        return [
          `open`,
          `${run.runner}`,
          `${run.inGameTime}`,
          `${run.version}`,
          `${run.submittedDate}`,
          `${run.link}`
        ];
      case SHEET_NAMES.AA:
      case SHEET_NAMES.COOP:
        return [
          `open`,
          `${run.runner}${run.playerCount > 1 ? ` +${run.playerCount-1}` : ""}`,
          `${run.inGameTime}`,
          `${run.version}`,
          `${run.seedType}${run.coop}`,
          `${run.submittedDate}`,
          `${run.link}`
        ];
      case SHEET_NAMES.GLITCHED_PEACEFUL:
        return [
          `open`,
          `${run.runner}`,
          `${run.inGameTime}`,
          `${run.version} ${run.seedType}`,
          `${run.glitchedType}`,
          `${run.submittedDate}`,
          `${run.link}`
        ];
      default:
        return [];
    }
  }
}

export class SRCSubmission {
  constructor(runner, submittedDate, category, inGameTime, version, seedType, playerCount = 1, coop = null, glitchedType = null, link = "", requiresLogs = false) {
    this.runner = runner;
    this.submittedDate = submittedDate;
    this.category = category;
    this.inGameTime = inGameTime;
    this.version = version;
    this.seedType = seedType;
    this.playerCount = playerCount;
    this.coop = coop; // TODO: remove
    this.glitchedType = glitchedType;
    this.link = link;
    this.requiresLogs = requiresLogs;
  }
}

const CATEGORIES = [
  {
    "name": "All Advancements",
    "id": "xk9gz16d",
    "sheetName": SHEET_NAMES.AA,
    "longTimes": true,
    "cutoffs": null,
    "versionId": "789je4qn",
    "seedTypeId": "p853vv0n",
    "playerCountId": "",
    "glitchedTypeId": "",
  },
  {
    "name": "All Advancements Co-op",
    "id": "xd114pzd",
    "sheetName": SHEET_NAMES.AA,
    "longTimes": true,
    "cutoffs": null,
    "versionId": "wl314d98",
    "seedTypeId": "2lg3x13n",
    "playerCountId": "789xmd68",
    "glitchedTypeId": "",
  },
  {
    "name": "All Achievements",
    "id": "wk63eek1",
    "sheetName": SHEET_NAMES.AA,
    "longTimes": true,
    "cutoffs": null,
    "versionId": "0nw2y7xn",
    "seedTypeId": "38do09zl",
    "playerCountId": "",
    "glitchedTypeId": "",
  },
  {
    "name": "Any% Glitchless",
    "id": "mkeyl926",
    "sheetName": SHEET_NAMES.RSG,
    "longTimes": false,
    "cutoffs": GLITCHLESS_CUTOFFS,
    "versionId": "wl33kewl",
    "seedTypeId": "r8rg67rn",
    "playerCountId": "",
    "glitchedTypeId": "",
  },
  {
    "name": "Any% Glitchless",
    "id": "mkeyl926",
    "sheetName": SHEET_NAMES.RSG_116,
    "longTimes": false,
    "cutoffs": GLITCHLESS_CUTOFFS,
    "versionId": "wl33kewl",
    "versionFilter": "4qye4731", // 1.16-1.19
    "seedTypeId": "r8rg67rn",
    "seedTypeFilter": "21d4zvp1", // Random Seed
    "playerCountId": "",
    "glitchedTypeId": "",
  },
  {
    "name": "Any% Glitchless Co-op", // x=zd301qed-rn1p34dn.5lm7wvjl-68kd9yql.rqvojn6l-68k5jz82.jqz6vmm1
    "id": "zd301qed",
    "sheetName": SHEET_NAMES.COOP,
    "longTimes": false,
    "cutoffs": GLITCHLESS_CUTOFFS,
    "versionId": "68kd9yql",
    "seedTypeId": "rn1p34dn",
    "playerCountId": "68k5jz82",
    "glitchedTypeId": "",
  },
  {
    "name": "Any%",
    "id": "wkpn0vdr",
    "sheetName": SHEET_NAMES.GLITCHED_PEACEFUL,
    "longTimes": false,
    "cutoffs": null,
    "versionId": "wlexoyr8",
    "seedTypeId": "2lgzk1o8",
    "playerCountId": "",
    "glitchedTypeId": "68k15rkl",
  },
  {
    "name": "Any% Glitchless (Peaceful)",
    "id": "9d86nz62",
    "sheetName": SHEET_NAMES.GLITCHED_PEACEFUL,
    "longTimes": false,
    "cutoffs": null,
    "versionId": "ylqmmrvn",
    "seedTypeId": "wle63kx8",
    "playerCountId": "",
    "glitchedTypeId": "",
  },
  {
    "name": "Any% (Peaceful)",
    "id": "xd1qp728",
    "sheetName": SHEET_NAMES.GLITCHED_PEACEFUL,
    "longTimes": false,
    "cutoffs": null,
    "versionId": "gnxvv7gl",
    "seedTypeId": "wl36vd6l",
    "playerCountId": "",
    "glitchedTypeId": "",
  }
]

var runs = [];
var submissions;
export async function getSrcData(url) {
	console.log("Getting speedrun.com data...");
  await axios.get(url)
  .then(async function (response) {
    var resp = response.data;
    runs = runs.concat(resp.data);
    
    var links = resp.pagination.links;
    var nextRequest = "";
    for (var i = 0; i < links.length; i++) {
      if (links[i].rel == "next") {
        nextRequest = links[i].uri;
      }
    }
    
    if (nextRequest) {
      await getSrcData(nextRequest);
    } else{
      console.log("Retrieved pending submissions from speedrun.com.");
      filterRuns();
      submissions = await getCategoryData();
    }
  });
  return submissions;
}

var filteredRuns = []
function filterRuns() {
  for (var i = 0; i < runs.length; i++) {
    var run = runs[i];
    for (let i in CATEGORIES) {
      var cat = CATEGORIES[i];
      if (cat.id == run.category.data.id) {
        filteredRuns.push(run);
        break;
      }
    }
  }
  console.log("Filtered pending submissions.");
}

async function getCategoryData() {
  var categoriesToCheck = CATEGORIES.length;
  var cats = [];
  console.log("Getting category data from speedrun.com...");
  for (let cat in CATEGORIES) {
    var data;
    await axios.get(`https://www.speedrun.com/api/v1/categories/${CATEGORIES[cat].id}/variables`)
    .then(async function (response) {
      var newCat = new SRCCategory(CATEGORIES[cat]);
      var resp = response.data;
      for (let i in resp.data) {
        var variable = resp.data[i];
        if (variable.id == newCat.versionId) newCat.versions = variable.values.values;
        if (variable.id == newCat.seedTypeId) newCat.seedTypes = variable.values.values;
        if (variable.id == newCat.playerCountId) newCat.playerCounts = variable.values.values;
        if (variable.id == newCat.glitchedTypeId) newCat.glitchedTypes = variable.values.values;
      }
      cats.push(newCat);

      if (categoriesToCheck-- == 1) data = await getRunData(cats);
    });
  }
  return data;
}

async function getRunData(cats){
  for (var i = 0; i < filteredRuns.length; i++) {
    var run = filteredRuns[i];
    
    var submittedDate = run.submitted.substr(0, 10);
    var playerCount = run.players.data.length;

    var inGameTime;
    var category;
    var version = "";
    var seedType = "";
    var coop = "";
    var glitchedType = "";
    var requiresLogs = false;
    // console.log(run);
    // console.log(run.values);
    // TODO: improve
    for (let i in cats) {
      var cat = cats[i];
      
      var versionId = cat.versionId;
      var runVersionId = run.values[versionId];
      // console.log(run.values);
      if (runVersionId) {
        if (cat.versionFilter != null && cat.versionFilter != runVersionId) continue;
        category = cat;
        version = cat.versions[runVersionId].label;
      }

      var seedTypeId = cat.seedTypeId;
      var runSeedTypeId = run.values[seedTypeId];
      if (runSeedTypeId) {
        if (cat.seedTypeFilter != null && cat.seedTypeFilter != runSeedTypeId) continue;
        seedType = cat.seedTypes[runSeedTypeId].label;
        
        if (cat.cutoffs) {
          requiresLogs = run.times.ingame_t < cat.cutoffs[seedType][version][1];
        }

        // find ingame time here as it is category dependent
        // TODO: use sheets formatting for this instead? if not then at least just dynamically change it if the run is >1 hour?
        var substrStart = cat.longTimes ? 11 : 14;
        inGameTime = new Date(run.times.ingame_t * 1000).toISOString().substring(substrStart, substrStart + 8);
      }

      var playerCountId = cat.playerCountId;
      var runPlayerCountId = run.values[playerCountId];
      if (runPlayerCountId) {
        var coopLabel = cat.playerCounts[runPlayerCountId].label;
        coop = COOP_LABELS[coopLabel];
      }

      var glitchedTypeId = cat.glitchedTypeId;
      var runGlitchedTypeId = run.values[glitchedTypeId];
      if (runGlitchedTypeId) {
        var glitchedLabel = cat.glitchedTypes[runGlitchedTypeId].label;
        glitchedType = GLITCHED_TYPES[glitchedLabel];
      }
    }

    // if (category.name == "Any% Glitchless") console.log(category);
    // if (category.cutoffs) console.log(`${run.times.ingame_t} > ${category.cutoffs[seedType][version][0]}`);
    if (category.cutoffs && run.times.ingame_t > category.cutoffs[seedType][version][0]) continue;
    if (run.times.ingame_t == 0) continue; // if submitter did not include ingame time (likely a slowrun)
    var submission = new SRCSubmission(
      run.players.data[0].names.international,
      submittedDate,
      category,
      inGameTime,
      version,
      seedType,
      playerCount,
      coop,
      glitchedType,
      run.weblink,
      requiresLogs
    );
    category.runs.push(submission);
  }

  return cats;
}