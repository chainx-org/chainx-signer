const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const semver = require('semver')

const path = require('path')
const isDev = require('electron-is-dev')
const https = require('https')
const { dialog, shell } = electron

const updateJsonLink =
  'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/update.json'

let mainWindow

async function updateIfNewVersion() {
  const currentVersion = app.getVersion()
  const latestInfo = await new Promise((resolve, reject) => {
    https
      .get(updateJsonLink, res => {
        let body = ''
        res.on('data', d => {
          body += d
        })
        res.on('end', function() {
          try {
            const parsed = JSON.parse(body)
            resolve(parsed)
          } catch (err) {
            reject(err)
          }
        })
      })
      .on('error', e => {
        reject(e)
      })
  })

  if (semver.lte(latestInfo.version, currentVersion)) {
    return
  }

  if (latestInfo.forceUpdate) {
    dialog.showMessageBoxSync({
      title: 'New Version',
      message: `Please update to version ${latestInfo.version}`,
      buttons: ['OK'],
      defaultId: 0
    })

    await shell.openExternal(latestInfo.path)
    app.quit()
  } else {
    const buttonIndex = await dialog.showMessageBoxSync({
      title: 'New Version',
      message: `New version detected. Check the OK button to update.`,
      buttons: ['OK', 'Cancel'],
      defaultId: 0
    })

    if (buttonIndex === 0) {
      await shell.openExternal(latestInfo.path)
    }
  }
}

function isWin() {
  return process.platform === 'win32'
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: isWin() ? 380 : 358,
    height: isWin() ? 665 : 600,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  })
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3001'
      : `file://${path.join(__dirname, './build/index.html')}`
  )

  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools()
  }
  mainWindow.on('closed', () => (mainWindow = null))
}

const restoreInstance = () => {
  mainWindow.show()
  if (mainWindow.isMinimized()) mainWindow.restore()
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
  if (!isDev) {
    await updateIfNewVersion()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', activateInstance)
