const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  return
}

app.on('second-instance', () => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

function isWin() {
  return process.platform === 'win32'
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: isWin() ? 380 : 358,
    height: isWin() ? 665 : 610,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  })
  mainWindow.removeMenu()
  if (isDev) {
    mainWindow
      .loadURL('http://localhost:3001')
      .then(() => console.log('url loaded'))
  } else {
    mainWindow
      .loadFile(path.join(__dirname, './build/index.html'))
      .then(() => console.log('index.html loaded'))
  }

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools()
  }
  mainWindow.on('closed', () => (mainWindow = null))

  electron.globalShortcut.register('CommandOrControl+O', () => {
    mainWindow.openDevTools()
  })
  electron.globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.openDevTools()
  })
}

const restoreInstance = () => {
  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }
  mainWindow.show()
}

const activateInstance = e => {
  if (e) e.preventDefault()
  if (!mainWindow) {
    createWindow()
    return
  }
  restoreInstance()
}

app.on('ready', async () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', activateInstance)
