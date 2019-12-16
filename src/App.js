import React from 'react'

import {
  handlePairedResponse,
  handleApiResponse,
  SocketService
} from './services/socketService'

const wallet = window.wallet

wallet.socketResponse = data => {
  if (typeof data === 'string') data = JSON.parse(data)
  switch (data.type) {
    case 'api':
      return handleApiResponse(data.request, data.id)
    case 'pair':
      return handlePairedResponse(data.request, data.id)
    default:
      return
  }
}

SocketService.init(window.sockets)

SocketService.initialize()

function App() {
  console.log(wallet)
  return <div className="App">hello world, 123</div>
}

export default App
