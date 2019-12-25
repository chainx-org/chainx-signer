import { searchPortStep, startPort } from './constants'

const net = require('net')

export const isPortAvailable = (port = 0) => {
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

export const findPort = async () => {
  let port = startPort
  while (!(await isPortAvailable(port))) {
    port += searchPortStep
  }
  return port
}
