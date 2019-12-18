import React from 'react'

import {
  handleApiResponse,
  handlePairedResponse,
  setService
} from './services/socketService'

window.wallet.socketResponse = data => {
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

setService(window.sockets)

window.sockets.initialize().then(() => console.log('sockets initialized'))

function App() {
  return <div className="App">hello world, 123</div>
}

export default App
