const entypo = require('entypo')
const remote = require('electron').remote
 
document.body.insertBefore(entypo.getNode(), document.body.firstChild)

function minimize() {
  remote.getCurrentWindow().minimize();
}

function maximize() {
  remote.getCurrentWindow().maximize();
}

function closeWindow() {
  remote.getCurrentWindow().close();
}

function addGame() {
  var nameOfGame = $('#gameNameInput')[0].value

  var $a = $("<a>", {
    "class": "list-group-item list-group-item-action",
    "href": "#"
  })
  $a.html(nameOfGame)
  $('#game-list').append($a)

  $('#new-game-modal').modal('hide')
  $('#gameNameInput')[0].value = null

  return false;
}