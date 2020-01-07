const { searchPortStep, startPort } = require('./constants')

const net = require('net')

const isPortAvailable = (port = 0) => {
  return new Promise(async resolve => {
    const server = net.createServer()

    server.once('error', err => resolve(err.code !== 'EADDRINUSE'))

    server.once('listening', () => {
      server.close()
      resolve(true)
    })

    server.listen(port)
  })
}

const findPort = async () => {
  let port = startPort
  while (!(await isPortAvailable(port))) {
    port += searchPortStep
  }
  return port
}

module.exports = {
  findPort
}
