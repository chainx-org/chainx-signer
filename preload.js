const electron = require('electron')
const sockets = require('./server')

sockets.setMainWindow(electron.remote.getCurrentWindow())

window.sockets = sockets
