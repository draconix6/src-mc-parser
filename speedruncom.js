import { COOP_LABELS, SHEET_NAMES, SEED_TYPES, GLITCHED_TYPES } from './consts.js';
import { CATEGORIES } from './categories.js';
import axios from 'axios';

export class SRCCategory {
  constructor(category) {
    this.name = category.name;
    this.id = category.id;
    this.sheetName = category.sheetName;
    this.longTimes = category.longTimes;
    this.runJsons = [];
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

    this.glitchedTypeId = category.glitchedTypeId;
    this.glitchedTypes = [];

    this.cutoffs = category.cutoffs;
  }

  getSheetsFormat(run) {
    switch (this.sheetName) {
      case SHEET_NAMES.RSG_116:
        return [
          `open`,
          `${run.runner}`,
          `${run.inGameTime}`,
          `${run.submittedDate}`,
          `${run.link}`,
          ``, //`${run.requiresLogs ? "" : "not applicable"}`,
          ``,
          ``,
          ``,
          `n/a`,
        ];
      case SHEET_NAMES.RSG:
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
          `${run.glitchedType ? run.glitchedType : "Glitchless"}`,
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

var finalCategories;
var runs = [];
export async function getSrcData(url) {
	console.log("Getting pending submissions from speedrun.com...");
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
      return await getSrcData(nextRequest);
    } else {
      console.log("Retrieved pending submissions from speedrun.com.");
      finalCategories = await getRunData(await getCategoryData());
    }
  });
  return finalCategories;
}

async function filterRuns(cats) {
  for (var i = 0; i < runs.length; i++) {
    var run = runs[i];
    for (let i in cats) {
      var cat = cats[i];
      if (cat.id == run.category.data.id) {
        // TODO: filtering relies on duplicate categories with filters coming first in the categories.js list
        var runVersionId = run.values[cat.versionId];
        var runSeedTypeId = run.values[cat.seedTypeId];
        if (cat.versionFilter != null && cat.versionFilter != runVersionId) continue;
        if (cat.seedTypeFilter != null && cat.seedTypeFilter != runSeedTypeId) continue;

        cat.runJsons.push(run);
        break;
      }
    }
  }
  console.log("Filtered pending submissions.");
  return cats;
}

async function getCategoryData() {
  var data;
  var categoriesToCheck = CATEGORIES.length;
  var cats = [];
  console.log("Getting category data from speedrun.com...");
  for (let cat in CATEGORIES) {
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

      if (categoriesToCheck-- == 1) data = await filterRuns(cats);
    });
  }
  return data;
}

async function getRunData(cats) {
  for (let i in cats) {
    var cat = cats[i];
    for (let j in cat.runJsons) {
      var run = cat.runJsons[j];
  
      var submittedDate = run.submitted.substr(0, 10);
      var playerCount = run.players.data.length;

      var inGameTime;
      var version = "";
      var seedType = "";
      var coop = "";
      var glitchedType = "";
      var requiresLogs = false;
      
      var versionId = cat.versionId;
      var runVersionId = run.values[versionId];
      if (runVersionId) {
        version = cat.versions[runVersionId].label;
      }

      var seedTypeId = cat.seedTypeId;
      var runSeedTypeId = run.values[seedTypeId];
      if (runSeedTypeId) {
        seedType = cat.seedTypes[runSeedTypeId].label;
        
        // convert "Random Seed" to "RS", etc.
        // add the G for Glitchless if category is not glitched
        if (SEED_TYPES[seedType]) seedType = `${SEED_TYPES[seedType]}${cat.glitchedTypeId ? "" : "G"}`;

        if (cat.cutoffs) {
          requiresLogs = run.times.ingame_t < cat.cutoffs[seedType][version][1];
        }

        // find ingame time here, show hours if necessary - AA always shows hours even if some runs are <1 hour, but not milliseconds
        // TODO: doesn't work so well, rethink sheets formatting
        var longRun = run.times.ingame_t > 60 * 60;
        var substrStart = cat.longTimes || longRun ? 11 : 14;
        inGameTime = new Date(run.times.ingame_t * 1000).toISOString().substring(substrStart, substrStart + ((!cat.longTimes && longRun) ? 12 : 8));
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
        glitchedType = cat.glitchedTypes[runGlitchedTypeId].label;
      }

      // if run is slower than the top run cutoff for this category
      if (cat.cutoffs && run.times.ingame_t > cat.cutoffs[seedType][version][0]) continue;
      // if submitter did not include ingame time (likely a slowrun)
      if (run.times.ingame_t == 0) continue;
      
      var submission = new SRCSubmission(
        run.players.data[0].names.international,
        submittedDate,
        cat,
        inGameTime,
        version,
        seedType,
        playerCount,
        coop,
        glitchedType,
        run.weblink,
        requiresLogs
      );
      // console.log(`Pushed run by ${submission.runner} in category ${cat.name}.`);
      cat.runs.push(submission);
    }
  }

  return cats;
}