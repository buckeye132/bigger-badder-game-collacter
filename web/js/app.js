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