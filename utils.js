const https = require('https')
const semver = require('semver')

const updateJsonLink =
  'https://chainx-signer-release.oss-cn-hangzhou.aliyuncs.com/update.json'

async function fetchLatestVersion() {
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

function versionLte(v1, v2) {
  return semver.lte(v1, v2)
}

module.exports = {
  fetchLatestVersion,
  versionLte
}
