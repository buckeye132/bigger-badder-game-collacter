const entypo = require('entypo');
const remote = require('electron').remote;
//const fs = require('fs');

document.body.insertBefore(entypo.getNode(), document.body.firstChild);

/* Class Definitions */
class Game {
  static SortByName(a, b) {
    return a.name.localeCompare(b.name);
  }

  constructor(name) {
    this._name = name;
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
    $('#acquiredDate').datepicker({
      todayBtn: "linked",
      autoclose: true,
      todayHighlight: true
    });
    $('#startedDate').datepicker({
      todayBtn: "linked",
      autoclose: true,
      todayHighlight: true
    });
    $('#completedDate').datepicker({
      todayBtn: "linked",
      autoclose: true,
      todayHighlight: true
    });
  });

  function addGameSubmit(event) {
    event.preventDefault();

    gameLibrary.addGame(resetAddGameModal());
    gameList.displayLibrarySortByName(gameLibrary);

    return false;
  }

  function resetAddGameModal() {
    // grab values
    var nameOfGame = $('#gameNameInput')[0].value;

    // reset UI
    $('#new-game-modal').modal('hide');
    $('#gameNameInput')[0].value = null;

    // return new game data
    return new Game(nameOfGame);
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
