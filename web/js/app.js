const entypo = require('entypo');
const remote = require('electron').remote;
const igdb = require('igdb-api-node').default;
const client = igdb('274ec68ab7ad96b0249611e4d3461007');
//const fs = require('fs');

document.body.insertBefore(entypo.getNode(), document.body.firstChild);

/* Class Definitions */
class Game {
  static SortByName(a, b) {
    return a.name.localeCompare(b.name);
  }

  constructor(name,platform,acquiredOn,startedOn,completedOn,completeness,condition,inCollection) {
    this._name = name;
    this._platform = platform;
    this._acquiredOn = acquiredOn;
    this._startedOn = startedOn
    this._completedOn = completedOn;
    this._completeness = completeness;
    this._condition = condition;
    this._inCollection = inCollection;
    this._platformID;
    this._gameID;
    this._summary;
    this._category;
    this._gameModes;
    this._themes;
    this._genres;
    this._coverArt;
    this._esrbRating;
    this._timeToBeat;
  }

  get name() {
    return this._name;
  }

}

class GameLibrary {
  constructor(libraryFilePath) {
    //this._libraryFilePath = libraryFilePath;
    this._gameSet = new Set();
    //updateFromFile();
  }

  updateFromFile() {
    /*var obj = JSON.parse(fs.readFileSync(this._libraryFilePath, 'utf8'));
    this._gameSet.clear();

    if (obj.games !=== null) {
      obj.games.forEach(function(game) {
        this._gameSet.add(game)
      }, this);
    }*/
  }

  saveToFile() {

  }

  addGame(game) {
    this._gameSet.add(game);
    console.log(game);
    console.log(this._gameSet);
  }

  get gameSet() {
    return this._gameSet;
  }
}

class GameList {
  static getJqueryListItem(value) {
    return $('<a>', {
      "class": "list-group-item list-group-item-action",
      "href": "#",
      "id": value,
      "html": value
    });
  }

  static getPlaceholderItem() {
    var $placeholder = GameList.getJqueryListItem("No Games Added.");
    $placeholder.addClass("disabled");
    return $placeholder;
  }

  constructor(list_id) {
    this.listJquery = $('#game-list');

    // start with an empty list
    this.clearList();
  }

  displayLibrarySortByName(library) {
    this.clearList();

    var sortedArray = Array.from(library.gameSet).sort(Game.SortByName);
    sortedArray.forEach(function(game) {
      this.addListItem( GameList.getJqueryListItem(game.name) );
    }, this);
  }

  addListItem(item) {
    if (this.listSize > 0)
      this.listJquery.append(item);
    else
      this.listJquery.html(item);

    this.listSize++;
  }

  clearList() {
    this.listJquery.html(GameList.getPlaceholderItem());
    this.listSize = 0;
  }
}

/* insertion point */
(function scopeWrapper($) {
  // Setting up variables that can be compiled before the page is loaded
  var gameList;
  var platformIDs = require('./json/platforms.json');
  //var grabDB = require('./js/grabDB.js');
  var gameLibrary = new GameLibrary();

  $(function onDocReady() {
    gameList = new GameList("game-list");

    $('#add-game-form').submit(addGameSubmit);
    $('#game-list').on('click', function(game) {
      grabDB();
      var name = event.target.id; // <-- grabs the ID for the game from the field off the gamelist HTML item
      var platformID = getGamePlatform(name);

      importGameInformation(name,platformID)
      $(".card-block").remove();
      $("#cardInfo").append(
        '<div class="card-block">' +
        '<img class="cover_art" src="" alt="Cover Art">' +
        '<h4 class="card-title game1">' + name + '</h4>' +
        '<p class="card-text">'+ getGameInSet(name) +'</p>' +
        '<a href="#" class="btn btn-danger">Delete Title</a>' +
        '</div>'
      );
    });
  });

  // This fucntion grabs the platformID by itterating through the _gameSet for the game you clicked on in the list.
  // The code then finds the platorm for that item and looks up the platform ID from the Platforms.JSON object to be
  //   used in the API lookup for the game info
  function getGamePlatform(nameOfGame){
    for (let game of gameLibrary._gameSet.values()){
      if (game._name === nameOfGame){
        var platform  = game._platform;

        for (let i = 0; i < platformIDs.length; i++){
          if (platformIDs[i].name === platform){
            var platformID = platformIDs[i].id;
            return platformID;
          }
        }
      }
    }
  }

  // This code is itterating through the _gameSet to find the game info from the item you clicked in the list.
  // It then takes that info and returns out HTML to display in the body card to display to the user
  function getGameInSet(nameOfGame){
    for (let game of gameLibrary._gameSet.values()){
      if (game._name === nameOfGame){
        platform  = game._platform
        acquiredOn = game._acquiredOn
        startedOn = game._startedOn
        completedOn = game._completedOn
        completeness = game._completeness
        condition = game._condition
        inCollection = game._inCollection

        return 'Platform: ' + platform + '<br />Acquired On: ' + acquiredOn + '<br />Started On: ' + startedOn + '<br />Completed On: ' + completedOn + '<br />Completeness: ' + completeness + '<br />Condition: ' + condition + '<br />In Collection: ' + inCollection;
      }
    }
  }

  // *This entire function grabs the cover art for the game through an API call.
  // TODO: REFACTOR THIS TO LIMIT THE AMOUNT OF API CALLS; HAVE IT GRAB ALL RELIVANT DATA AND ADD IT TO THE GAME OBJECT -- //
  function importGameInformation(nameOfGame,platform){
    var igdbGameId;
    var gameInfoObject = [];
    // This is all formatting for searching of the SLUG field below
    var nameTrimed = nameOfGame.trim();
    var nameNoSpecial = nameTrimed.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    var nameNoSpaces = nameNoSpecial.replace(/[^a-zA-Z0-9]/g, '-');
    var nameSlug = nameNoSpaces.toLowerCase();
    // Formatting of the name for SlUG ends

    // The fetch below is sending a GET request to the IGDB API
    fetch('https://api-2445582011268.apicast.io/games/?search='+nameOfGame+'&fields=name,id,cover,platforms,first_release_date,summary,storyline,total_rating,category,time_to_beat,game_modes,themes,genres,esrb,slug,version_parent&filter[platforms][eq]='+platform+'&filter[category][any]=0,3,4&limit=50', {
      headers: {
        'user-key': '274ec68ab7ad96b0249611e4d3461007', // API key for IGDB.com
        'Accept': 'application/json'
      } // The API reponds with a promise (the info) that then needs to be sent to a JSON parser
    }).then(response => response.json())
    .then((data) => { // The code below here is then itterating through the JSON object looking for a match for the game
      for (let i = 0; i < data.length; i++){
        if (data[i].category === 0 & data[i].slug === nameSlug){
           // When a match is found it returns the coverArtID and displays it
          var coverArtID = 'https://images.igdb.com/igdb/image/upload/t_cover_big/'+data[i].cover.cloudinary_id+'.jpg';
          var coverArtCID = data[i].cover.cloudinary_id;

          for (let game of gameLibrary._gameSet.values()){
            if (game._name === nameOfGame){
              game._coverArt = coverArtID;
            }
          }

          $('.cover_art').attr('src', 'https://images.igdb.com/igdb/image/upload/t_cover_big/'+coverArtCID+'.jpg');
        }
      }
    })
  }

  // Code for the Sumbit button on the Add Game Modal
  function addGameSubmit(event) {
    event.preventDefault();

    gameLibrary.addGame(resetAddGameModal()); //This is adding the game info to the Library then it resets the form
    gameList.displayLibrarySortByName(gameLibrary);// This is then telling the game list to display the info in the Library

    return false;
  }

  function resetAddGameModal() {
    // grab values from the form
    var nameOfGame = $('#gameNameInput')[0].value;
    var gamePlatform = $('#gamePlatformInput')[0].value;
    var acquiredOnDate = $('#acquiredDate')[0].value;
    var startedOnDate = $('#startedDate')[0].value;
    var completedOnDate = $('#completedDate')[0].value;
    var gameCompleteness = $('#gameCompleteness')[0].value;
    var gameCondition = $('#conditionInput')[0].value;
    var gameInCollection = $('#gameOwned')[0].checked;

    // reset UI for the next game to have a clean slate
    $('#new-game-modal').modal('hide');
    $('#gameNameInput')[0].value = null;
    $('#gamePlatformInput')[0].value = null;
    $('#acquiredDate')[0].value = null;
    $('#startedDate')[0].value = null;
    $('#completedDate')[0].value = null;
    $('#gameCompleteness')[0].value = null;
    $('#conditionInput')[0].value = null;
    $('#gameOwned')[0].checked = null;

    // return new game data
    return new Game(nameOfGame,gamePlatform,acquiredOnDate,startedOnDate,completedOnDate,gameCompleteness,gameCondition,gameInCollection);
  }
}(jQuery));

/* function defintions */
function minimize() {
  remote.getCurrentWindow().minimize();
}

function maximize() {
  remote.getCurrentWindow().maximize();
}

function closeWindow() {
  remote.getCurrentWindow().close();
}
