const { findPort } = require('./utils')
const http = require('http')
const WebSocket = require('ws')

let mainWindow

function setMainWindow(w) {
  mainWindow = w
}

const sendToEmbed = payload =>
  mainWindow.webContents.send('socketResponse', payload)

class LowLevelSocketService {
  constructor() {
    this.rekeyPromise = null
    this.openConnections = {}
    this.websocket = null
    this.port = null
  }

  async getNewKey(origin, id) {
    return new Promise((resolve, reject) => {
      this.rekeyPromise = { resolve, reject }
      this.emit(origin, id, 'rekey')
      return this.rekeyPromise
    })
  }

  async emit(origin, id, path, data) {
    const socket = this.openConnections[origin + id]
    return this.emitSocket(socket, path, data)
  }

  async emitSocket(socket, path, data) {
    if (!socket) return console.error('No socket found')
    socket.send('42/chainx,' + JSON.stringify([path, data ? data : false]))
  }

  async initialize() {
    const socketHandler = socket => {
      let origin = null

      socket.send('40')
      socket.send('40/chainx')
      socket.send(`42/chainx,["connected"]`)

      const id = Math.round(Math.random() * 999999999).toString()

      // Different clients send different message types for disconnect (ws vs socket.io)
      socket.on('close', () => delete this.openConnections[origin + id])
      socket.on('disconnect', () => delete this.openConnections[origin + id])

      socket.on('message', msg => {
        if (msg.indexOf('42/chainx') === -1) return false
        const [type, request] = JSON.parse(msg.replace('42/chainx,', ''))

        const killRequest = () =>
          this.emitSocket(socket, 'api', { id: request.data.id, result: null })

        if (!request.plugin || request.plugin.length > 100) {
          return killRequest()
        }
        request.plugin = request.plugin.replace(/\s/g, '').trim()

        if (request.plugin.toLowerCase() === 'chainx') {
          return killRequest()
        }

        let requestOrigin
        if (request.data.hasOwnProperty('payload')) {
          request.data.payload.origin = request.data.payload.origin
            .replace(/\s/g, '')
            .trim()
          if (request.data.payload.origin.toLowerCase() === 'chainx') {
            return killRequest()
          }
          requestOrigin = request.data.payload.origin
        } else {
          requestOrigin = request.data.origin.replace(/\s/g, '').trim()
        }

        if (!origin) {
          origin = requestOrigin
        } else if (origin && requestOrigin !== origin) {
          return killRequest()
        }

        if (!this.openConnections.hasOwnProperty(origin + id)) {
          this.openConnections[origin + id] = socket
        }

        switch (type) {
          case 'pair':
            return sendToEmbed({ type: 'pair', request, id })
          case 'rekeyed':
            return this.rekeyPromise.resolve(request)
          case 'api':
            return sendToEmbed({ type: 'api', request, id })
          default:
            console.error(`Unknown type ${type}`)
        }
      })
    }

    if (this.websocket) {
      return this.websocket
    }

    this.port = await findPort()

    const requestHandler = (_, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Request-Method', '*')
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Content-Type', 'application/json')
      res.end('chainx')
    }

    const server = http.createServer(requestHandler)
    this.websocket = new WebSocket.Server({ server })
    server.listen(this.port)

    this.websocket.on('connection', socketHandler)
    return this.websocket
  }

  async close() {
    if (typeof this.websocket.clients.map === 'function') {
      this.websocket.clients.map(client => client.terminate())
    }

    return true
  }

  sendEvent(event, payload, origin) {
    const sockets = Object.keys(this.openConnections)
      .filter(x => x.indexOf(origin) === 0)
      .map(x => this.openConnections[x])
    sockets.map(x => this.emitSocket(x, 'event', { event, payload }))
    return true
  }

  broadcastEvent(event, payload) {
    Object.keys(this.openConnections).map(origin =>
      this.sendEvent(event, payload, origin)
    )
    return true
  }
}

let sockets = new LowLevelSocketService()

module.exports = { sockets, setMainWindow }
