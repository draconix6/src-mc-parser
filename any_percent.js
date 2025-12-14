const axios = require('axios');

var runs = [];
function getData(url){
	console.log("Getting data from " + url + "...");
  axios.get(url)
  .then(function (response) {
    // console.log(response);
    var resp = response.data;
    runs = runs.concat(resp.data);
    
    var links = resp.pagination.links;
    var nextRequest = "";
    for(var i = 0; i < links.length; i++){
      if(links[i].rel == "next"){
        nextRequest = links[i].uri;
      }
    }
    
    if(nextRequest){
      getData(nextRequest);
    } else{
      console.log("All data recieved");
      
      filterRuns();  

      displayData()
    }
  });
}

/** version val (wl33kewl)
//pre 1.9 - gq7zo9p1
//1.13-1.15 - 21go6e6q
//1.16+ - 4qye4731

// RS/SS Vals - r8rg67rn
// SS - klrzpjo1 
// RS - 21d4zvp1
**/
var filteredRuns = []
function filterRuns(){
  for(var i = 0; i < runs.length; i++){
    var run = runs[i];
    if(
    		run.category.data.id == "mkeyl926" 
      	&& run.values["wl33kewl"] == "4qye4731" //Version
      	&& run.values["r8rg67rn"] == "21d4zvp1" //SeedType
        && run.times.ingame_t < 780 //Ingame time < 17 minutes
    ){ 
      filteredRuns.push(run);
    }
  }
}

getData("https://www.speedrun.com/api/v1/runs?game=j1npme6p&status=new&embed=category,level,players&orderby=submitted&max=200");
// displayData();

function displayData(){
	var outputHtml = "";
  
  
	for(var i = 0; i < filteredRuns.length; i++){
  	var run = filteredRuns[i];
    
    var inGameTime = new Date(run.times.ingame_t * 1000).toISOString().substr(14, 8);
    var submittedDate = run.submitted.substr(0, 10);
    var isTopLevelRun = run.times.ingame_t < 780;    // Change here to reduce time for random check in seconds
    var spotCheckRand = Math.floor(Math.random() * 5);
    var checkFiles = spotCheckRand != 4 && run.times.ingame_t > 720 ? "not applicable" : "";
    
  	outputHtml += `<style>
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table, th, td {
      border: 1px solid black;
    }
    </style>
    <table>
    <tr><td>Any% Glitchless - Random Seed, 1.16+</td>
    <td></td>
    <td>${run.players.data[0].names.international}</td>
    <td></td>
    <td>${inGameTime}</td>
    <td></td>    
    <td>${submittedDate}</td>
    <td></td>    
    <td></td>
    <td>${run.weblink}</td>
    <td>FALSE</td>    
    <td>FALSE</td>
    <td>${spotCheckRand}</td>
    <td>${checkFiles}</td>
    <td>${checkFiles == "not applicable" ? "TRUE" : "FALSE"}</td>
    <td>${!isTopLevelRun ? "not applicable" : ""}</td>
    <td>${!isTopLevelRun ? "TRUE" : "FALSE"}</td>
    <td>${!isTopLevelRun ? "not applicable" : ""}</td>
    <td>${!isTopLevelRun ? "TRUE" : "FALSE"}</td>
    <td></td>
    <td></td>
    <td>FALSE</td></tr>
    </table>
    `;
  }
  
  // outputHtml = `</tr><td>FALSE</td></tr>`;
  // console.log(outputHtml);
  // $("#main").append(outputHtml);
  const { createServer } = require('node:http');

  const hostname = '127.0.0.1';
  const port = 3000;

  const server = createServer((req, res) => {
    res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/html');
    res.end(Buffer.from(outputHtml));
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}