const axios = require('axios');

const CATEGORIES = [
  {
    "name": "All Advancements",
    "id": "xk9gz16d",
    "versionId": "789je4qn",
    "seedTypeId": "p853vv0n",
    "playerCountId": ""
  },
  {
    "name": "All Advancements Co-op",
    "id": "xd114pzd",
    "versionId": "wl314d98",
    "seedTypeId": "2lg3x13n",
    "playerCountId": "789xmd68"
  },
  {
    "name": "All Achievements",
    "id": "wk63eek1",
    "versionId": "0nw2y7xn",
    "seedTypeId": "38do09zl",
    "playerCountId": ""
  }
]

const COOP_LABELS = {
  "2 Players": " Duos",
  "3 Players": " Trios",
  "4 Players": " Quads",
  "5-9 Players": " 5-9",
  "10+ Players": " 10+",
}

var runs = [];
function getData(url) {
	console.log("Getting data...");
  axios.get(url)
  .then(function (response) {
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
      getData(nextRequest);
    } else{
      console.log("All data recieved");
      filterRuns();
      getVariables();
    }
  });
}

var filteredRuns = []
function filterRuns() {
  for (var i = 0; i < runs.length; i++) {
    var run = runs[i];
    // console.log(run.category.data.id);
    for (let i in CATEGORIES) {
      var cat = CATEGORIES[i];
      if (cat.id == run.category.data.id) {
        filteredRuns.push(run);
        break;
      }
    }
  }
}

getData("https://www.speedrun.com/api/v1/runs?game=j1npme6p&status=new&embed=category,level,players&orderby=submitted&max=200");

class SRCCategory {
  constructor(category) {
    this.name = category.name;
    this.id = category.id;
    this.versionId = category.versionId;
    this.seedTypeId = category.seedTypeId;
    this.playerCountId = category.playerCountId;

    this.versions = [];
    this.seedTypes = [];
    this.playerCounts = [];
  }
}

var versions = [];
var seedTypes = [];
var playerCounts = [];
function getVariables() {
  var categoriesToCheck = CATEGORIES.length;
  var cats = [];
  for (let cat in CATEGORIES) {
    axios.get(`https://www.speedrun.com/api/v1/categories/${CATEGORIES[cat].id}/variables`)
    .then(function (response) {
      var newCat = new SRCCategory(CATEGORIES[cat]);
      var resp = response.data;
      for (i in resp.data) {
        var variable = resp.data[i];
        if (variable.id == newCat.versionId) newCat.versions = variable.values.values;
        if (variable.id == newCat.seedTypeId) newCat.seedTypes = variable.values.values;
        if (variable.id == newCat.playerCountId) newCat.playerCounts = variable.values.values;
      }
      cats.push(newCat);

      if (categoriesToCheck-- == 1) displayData(cats);
    });
  }
}

function displayData(cats){
	var outputHtml = "";

  for(var i = 0; i < filteredRuns.length; i++){
    var run = filteredRuns[i];
    
    var inGameTime = new Date(run.times.ingame_t * 1000).toISOString().substr(11, 8);
    var submittedDate = run.submitted.substr(0, 10);
    var playerCount = run.players.data.length;

    var version = "";
    var seedType = "";
    var coop = "";
    // console.log(run);
    // console.log(run.values);
    for (let i in cats) {
      var cat = cats[i];
      
      var versionId = cat.versionId;
      var runVersionId = run.values[versionId];
      if (runVersionId) version = cat.versions[runVersionId].label;

      var seedTypeId = cat.seedTypeId;
      var runSeedTypeId = run.values[seedTypeId];
      if (runSeedTypeId) {
        seedType = cat.seedTypes[runSeedTypeId].label;
      }

      var playerCountId = cat.playerCountId;
      var runPlayerCountId = run.values[playerCountId];
      if (runPlayerCountId) {
        var coopLabel = cat.playerCounts[runPlayerCountId].label;
        coop = COOP_LABELS[coopLabel];
      }
    }
    // console.log(version);

    outputHtml += `
    <tr><td>${run.players.data[0].names.international}${playerCount > 1 ? ` +${playerCount-1}` : ""}</td>
    <td>${inGameTime}</td>
    <td>${version}</td>
    <td>${seedType}${coop}</td>
    <td>${submittedDate}</td>
    `;
  }
  
  const { createServer } = require('node:http');

  const hostname = '127.0.0.1';
  const port = 3000;

  const server = createServer((req, res) => {
      res.statusCode = 200;
      // res.setHeader('Content-Type', 'text/html');
      res.end(Buffer.from(`
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          table, th, td {
            border: 1px solid black;
          }
        </style>
        <table>${outputHtml}</table>`
      ));
  });

  server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
  });
}