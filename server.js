const http = require('http')
const port = 8080

class SocketService {
  constructor() {
    this.openConnections = {}
    this.ws = null
  }

  // TODO: 在electron.js调用此方法，初始化ws server，与页面进行通信
  async initialize() {
    const requestHandler = (_, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Request-Method', '*')
      res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
      res.setHeader('Access-Control-Allow-Headers', '*')
      res.setHeader('Content-Type', 'application/json')
      res.end('scatter')
    }

    const server = http.createServer(requestHandler)
    this.ws = new WebSocket.Server({ server })
    this.ws.on('connection', this.connectionHandler)

    server.listen(port)
  }

  connectionHandler(conn) {
    // TODO: 保存connection，程序退出的时候要close掉这些connection
    conn.on('close', () => {})
    conn.on('disconnect', () => {})
    conn.on('message', msg => {
      // TODO: 主要的处理逻辑，与页面按照协议进行交互
    })
  }
}
