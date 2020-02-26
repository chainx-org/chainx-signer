const electron = require('electron')
const electronStore = require('electron-store')
const { sockets, setMainWindow } = require('./server')
const { shell } = require('electron')
const https = require('https')
const semver = require('semver')

const updateJsonLink =
  'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/update.json'

setMainWindow(electron.remote.getCurrentWindow())

electron.ipcRenderer.on('socketResponse', (event, data) =>
  window.wallet.socketResponse(data)
)

window.sockets = sockets
window.wallet = {
  // Placeholder function. Will be rewrite in page script.
  socketResponse: () => {
    console.log('哈哈哈哈哈哈')
  }
}

window.require = require

window.ElectronStore = function(...args) {
  return new electronStore(...args)
}

window.accountStore = new window.ElectronStore({
  name: 'accounts',
  defaults: {}
})
window.nodeStore = new window.ElectronStore({ name: 'nodes', defaults: {} })
window.settingStore = new window.ElectronStore({
  name: 'settings',
  default: {}
})
window.fetchLatestVersion = async function fetchLatestVersion() {
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

  return latestInfo
}

window.versionLte = function versionLte(v1, v2) {
  return semver.lte(v1, v2)
}

window.openExternal = url => shell.openExternal(url)
