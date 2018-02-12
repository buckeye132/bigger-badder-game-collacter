const entypo = require('entypo');
const remote = require('electron').remote;
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

    if (obj.games !== null) {
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
  var gameList;
  var gameLibrary = new GameLibrary();

  $(function onDocReady() {
    gameList = new GameList("game-list");

    $('#add-game-form').submit(addGameSubmit);
    $('#game-list').on('click', function(game) {
      //var name = event.target.platform;
      var name = GameList.getJqueryListItem(game.platform);
      $(".card-header").remove();
      $("#cardInfo").append(
        '<div class="card-header">' + name + '</div>' +
        '<div class="card-block">' +
        '<img class="cover_art" src="http://thegamesdb.net/banners/boxart/original/front/7481-1.jpg" alt="Cover Art">' +
        '<h4 class="card-title game1">' + name + '</h4>' +
        '<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>' +
        '<a href="#" class="btn btn-danger">Delete Title</a>' +
        '</div>'
      );
    });
  });

  function getGameInSet(){
    for (let game of gameLibrary._gameSet.values()){
      return game;
    }
  }

  function importGamesDBInfo(){

  }

  function addGameSubmit(event) {
    event.preventDefault();

    gameLibrary.addGame(resetAddGameModal());
    gameList.displayLibrarySortByName(gameLibrary);

    return false;
  }

  function resetAddGameModal() {
    // grab values
    var nameOfGame = $('#gameNameInput')[0].value;
    var gamePlatform = $('#gamePlatformInput')[0].value;
    var acquiredOnDate = $('#acquiredDate')[0].value;
    var startedOnDate = $('#startedDate')[0].value;
    var completedOnDate = $('#completedDate')[0].value;
    var gameCompleteness = $('#gameCompleteness')[0].value;
    var gameCondition = $('#conditionInput')[0].value;
    var gameInCollection = $('#gameOwned')[0].checked;

    // reset UI
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
