const electron = require('electron')
const electronStore = require('electron-store')
const { sockets, setMainWindow } = require('./server')

setMainWindow(electron.remote.getCurrentWindow())

electron.ipcRenderer.on('socketResponse', (event, data) =>
  window.wallet.socketResponse(data)
)

window.sockets = sockets
window.wallet = {
  socketResponse: () => {
    console.log('哈哈哈哈哈哈')
  }
}

window.store = function(...args) {
  return new electronStore(...args)
}
