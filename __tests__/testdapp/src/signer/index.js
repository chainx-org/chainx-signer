import getRandomValues from 'get-random-values'
import WebSocket from 'isomorphic-ws'

const suffix = '/socket.io/?EIO=3&transport=websocket'

const random = () => {
  const array = new Uint8Array(24)
  getRandomValues(array)
  return array.join('')
}

export default class SocketService {
  constructor(_plugin) {
    this.plugin = _plugin

    this.uuid = null
    this.socket = null
    this.connected = false
    this.paired = false
    this.openRequests = []
    this.pairingPromise = null
    this.eventHandlers = {}
  }

  addEventHandler(handler, key) {
    if (!key) key = 'app'
    this.eventHandlers[key] = handler
  }

  removeEventHandler(key) {
    if (!key) key = 'app'
    delete this.eventHandlers[key]
  }

  link(_uuid = null, socketHost = null) {
    this.uuid = _uuid

    return new Promise(async resolve => {
      const setupSocket = () => {
        this.socket.onmessage = msg => {
          // Handshaking/Upgrading
          if (msg.data.indexOf('42/chainx') === -1) return false

          // Real message
          const [type, data] = JSON.parse(msg.data.replace('42/chainx,', ''))

          if (type === 'pong') return
          if (type === 'ping') return this.socket.send(`42/chainx,["pong"]`)

          switch (type) {
            case 'paired':
              return msgPaired(data)
            case 'api':
              return msgApi(data)
            case 'event':
              return eventApi(data)
            default:
              break
          }
        }

        const msgPaired = result => {
          this.paired = result
          this.pairingPromise.resolve(result)
        }

        const msgApi = response => {
          const openRequest = this.openRequests.find(x => x.id === response.id)
          if (!openRequest) return

          this.openRequests = this.openRequests.filter(
            x => x.id !== response.id
          )

          const isErrorResponse =
            typeof response.result === 'object' &&
            response.result !== null &&
            response.result.hasOwnProperty('isError')

          if (isErrorResponse) openRequest.reject(response.result)
          else openRequest.resolve(response.result)
        }

        const eventApi = ({ event, payload }) => {
          if (Object.keys(this.eventHandlers).length) {
            for (const key of Object.keys(this.eventHandlers)) {
              this.eventHandlers[key](event, payload)
            }
          }
        }
      }

      const getHostname = port => {
        if (socketHost) return socketHost
        return `127.0.0.1:${port}`
      }

      const ports = await new Promise(async portResolver => {
        if (socketHost) return portResolver([60005])

        const checkPort = (host, cb) =>
          fetch(host)
            .then(r => r.text())
            .then(r => cb(r === 'chainx'))
            .catch(() => cb(false))

        let startingPort = 60005
        let availablePorts = []

        const preparePorts = () =>
          (!availablePorts.length
            ? /* BACKWARDS COMPAT */ [60005]
            : availablePorts
          ).filter(x => {
            return true
          })

        let returned = false
        const resolveAndPushPort = (port = null) => {
          if (returned) return
          returned = true
          if (port !== null) availablePorts.push(port)
          portResolver(preparePorts())
        }

        for (const i of [...new Array(5).keys()]) {
          if (returned) return
          const _port = startingPort + i * 1500
          await checkPort(`http://` + getHostname(_port), x => {
            return x ? resolveAndPushPort(_port) : null
          })
        }

        resolveAndPushPort()
      })

      const trySocket = port =>
        new Promise(socketResolver => {
          const hostname = getHostname(port)
          const protocol = 'ws://'
          const s = new WebSocket(`${protocol}${hostname}${suffix}`)

          s.onerror = () => socketResolver(false)
          s.onopen = () => socketResolver(s)
        })

      let connected = false
      for (let i = 0; i < ports.length; i++) {
        if (connected) continue
        const s = await trySocket(ports[i])
        if (s) {
          connected = true
          this.socket = s
          this.send()
          this.connected = true
          setupSocket()
          this.pairingPromise = null
          this.pair(true).then(() => resolve(true))
          break
        }
      }
    })
  }

  isConnected() {
    return this.connected
  }

  isPaired() {
    return this.paired
  }

  disconnect() {
    if (this.socket) this.socket.close()
    return true
  }

  sendApiRequest(request) {
    return new Promise((resolve, reject) => {
      if (request.type === 'identityFromPermissions' && !this.paired)
        return resolve(false)

      this.pair().then(() => {
        if (!this.paired)
          return reject({
            code: 'not_paired',
            message:
              'The user did not allow this app to connect to their Chainx'
          })

        // Request ID used for resolving promises
        request.id = random()

        if (
          request.hasOwnProperty('payload') &&
          !request.payload.hasOwnProperty('origin')
        )
          request.payload.origin = this.getOrigin()

        this.openRequests.push(Object.assign(request, { resolve, reject }))
        this.send('api', { data: request, plugin: this.plugin })
      })
    })
  }

  pair(passthrough = false) {
    return new Promise((resolve, reject) => {
      this.pairingPromise = { resolve, reject }
      this.send('pair', {
        data: { origin: this.getOrigin(), passthrough },
        plugin: this.plugin
      })
    })
  }

  send(type = null, data = null) {
    if (type === null && data === null) this.socket.send('40/chainx')
    else
      this.socket.send(
        '42/chainx,' +
          JSON.stringify([type, Object.assign(data, { uuid: this.uuid })])
      )
  }

  getOrigin() {
    return SocketService.getOriginOrPlugin(this.plugin)
  }

  static getOriginOrPlugin(plugin) {
    let origin
    if (typeof window.location !== 'undefined')
      if (
        window.location.hasOwnProperty('hostname') &&
        window.location.hostname.length &&
        window.location.hostname !== 'localhost'
      )
        origin = window.location.hostname
      else origin = plugin
    else origin = plugin
    if (origin.substr(0, 4) === 'www.') origin = origin.replace('www.', '')
    return origin
  }
}
