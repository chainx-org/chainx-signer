const electron = require('electron')
const sockets = require('./server')

sockets.setMainWindow(electron.remote.getCurrentWindow())

electron.ipcRenderer.on('socketResponse', (event, data) =>
  window.wallet.socketResponse(data)
)

window.sockets = sockets
window.wallet = {
  socketResponse: () => {
    console.log('哈哈哈哈哈哈')
  }
}
