import StorageService from './StorageService'
import getRandomValues from 'get-random-values'
import createHash from 'create-hash'
import { findTargetPort, trySocket } from './utils'

const sha256 = data =>
  createHash('sha256')
    .update(data)
    .digest('hex')

const random = () => {
  const array = new Uint8Array(24)
  getRandomValues(array)
  return array.join('')
}

export default class SocketService {
  constructor(name) {
    this.plugin = name

    this.socket = null
    this.connected = false
    this.paired = false
    this.openRequests = []
    this.pairingPromise = null
    this.eventHandlers = {}

    this.appkey = StorageService.getAppKey()
    if (!this.appkey) this.appkey = 'appkey:' + random()
  }

  addEventHandler(handler, key) {
    if (!key) key = 'app'
    this.eventHandlers[key] = handler
  }

  removeEventHandler(key) {
    if (!key) key = 'app'
    delete this.eventHandlers[key]
  }

  onMsgPaired(result) {
    this.paired = result

    if (this.paired) {
      const savedKey = StorageService.getAppKey()
      const hashed =
        this.appkey.indexOf('appkey:') > -1 ? sha256(this.appkey) : this.appkey

      if (!savedKey || savedKey !== hashed) {
        StorageService.setAppKey(hashed)
        this.appkey = StorageService.getAppKey()
      }
    }

    this.pairingPromise.resolve(result)
  }

  onMsgRekey() {
    this.appkey = 'appkey:' + random()
    this.send('rekeyed', {
      data: { appkey: this.appkey, origin: this.getOrigin() },
      plugin: this.plugin
    })
  }

  onMsgApi(response) {
    if (typeof response === 'string') {
      try {
        response = JSON.parse(response)
      } catch (e) {
        console.error('Error parsing json for response: ', response)
      }
    }

    const openRequest = this.openRequests.find(
      x => x.payload.id === response.id
    )
    if (!openRequest) return

    this.openRequests = this.openRequests.filter(
      x => x.payload.id !== response.id
    )

    const isErrorResponse =
      response.error !== null && response.error !== undefined

    if (isErrorResponse) {
      openRequest.reject(response.error)
    } else {
      openRequest.resolve(response.result)
    }
  }

  onMsgEvent({ event, payload }) {
    console.log('event', event)
    console.log('payload', payload)
    if (Object.keys(this.eventHandlers).length) {
      Object.keys(this.eventHandlers).map(key =>
        this.eventHandlers[key](event, payload)
      )
    }
  }

  socketMsgHandler(msg) {
    // Handshaking/Upgrading
    if (msg.data.indexOf('42/chainx') === -1) return false

    // Real message
    const [type, data] = JSON.parse(msg.data.replace('42/chainx,', ''))

    if (type === 'pong') return
    if (type === 'ping') return this.socket.send(`42/chainx,["pong"]`)

    switch (type) {
      case 'paired':
        return this.onMsgPaired(data)
      case 'rekey':
        return this.onMsgRekey()
      case 'api':
        return this.onMsgApi(data)
      case 'event':
        return this.onMsgEvent(data)
      default:
        console.log(`Unknown type message ${type}`)
    }
  }

  link() {
    return new Promise(async (resolve, reject) => {
      const targetPort = await findTargetPort()
      if (!targetPort) {
        reject()
      }

      const s = await trySocket(targetPort)
      if (s) {
        this.socket = s
        this.send()
        this.connected = true
        this.socket.onmessage = this.socketMsgHandler.bind(this)
        this.pairingPromise = null
        this.pair(true).then(() => resolve(true))
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

  sendApiRequest(payload = {}) {
    const normalizedPayload = {
      ...payload,
      id: random()
    }

    return new Promise(async (resolve, reject) => {
      await this.pair()
      if (!this.paired) {
        return reject({
          code: 'not_paired',
          message: 'The user did not allow this app to connect to their chainx'
        })
      }

      const data = {
        appkey: this.appkey, // Set Application Key
        payload: normalizedPayload,
        origin: this.getOrigin()
      }
      this.openRequests.push(Object.assign(data, { resolve, reject }))

      this.send('api', { data, plugin: this.plugin })
    })
  }

  pair(passthrough = false) {
    return new Promise((resolve, reject) => {
      this.pairingPromise = { resolve, reject }
      this.send('pair', {
        data: { appkey: this.appkey, origin: this.getOrigin(), passthrough },
        plugin: this.plugin
      })
    })
  }

  send(type = null, data = null) {
    if (type === null && data === null) {
      this.socket.send('40/chainx')
    } else {
      this.socket.send('42/chainx,' + JSON.stringify([type, data]))
    }
  }

  getOrigin() {
    return SocketService.getOriginOrPlugin(this.plugin)
  }

  static getOriginOrPlugin(plugin) {
    let origin
    if (typeof window.location !== 'undefined') {
      if (
        window.location.hasOwnProperty('hostname') &&
        window.location.hostname.length &&
        window.location.hostname !== 'localhost'
      ) {
        origin = window.location.hostname
      } else {
        origin = plugin
      }
    } else {
      origin = plugin
    }
    if (origin.substr(0, 4) === 'www.') {
      origin = origin.replace('www.', '')
    }
    return origin
  }
}
