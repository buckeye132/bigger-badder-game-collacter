function grabDB() {
  const fs = require('fs');
  // var databaseJSONFile = "./json/databaseTest.json";
  // var file = new File(databaseJSONFile, "Write");

  var gameIDString = "";
  var gameDataJSON = [];

  for (var i = 1; i <= 1501; i++){
    IDValString = i.toString();
    gameIDString += IDValString;

    if (i % 150 === 0){
      fetch('https://api-2445582011268.apicast.io/games/'+gameIDString+'?fields=name,id,cover,platforms,first_release_date,summary,storyline,total_rating,category,time_to_beat,game_modes,themes,genres,esrb,slug,version_parent', {
        headers: {
          'user-key': '274ec68ab7ad96b0249611e4d3461007', // API key for IGDB.com
          'Accept': 'application/json'
        } // The API reponds with a promise (the info) that then needs to be sent to a JSON parser
      }).then(response => response.json())
      .then((data) => { // The code below here is then itterating through the JSON object looking for a match for the game
        for (let i = 0; i < data.length; i++){
          gameDataJSON.push(data[i]);
        }
      })
      gameIDString = "";
    }else if (i % 150 != 0 & i != 1501){
      gameIDString += ",";
    }else if (i === 1501){
      fs.writeFileSync('/json/database.json', JSON.stringify(gameDataJSON));
      // var dataToWrite = JSON.stringify(gameDataJSON);
      // console.log("opening file...");
      // file.open();
      // console.log("writing file..");
      // file.writeline(dataToWrite);
      // file.close();
    }
  }
}
