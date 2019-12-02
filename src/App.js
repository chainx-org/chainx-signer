import React from 'react'

const wallet = window.wallet
const sockets = window.sockets

sockets.initialize().then(() => {
  wallet.socketResponse = ({ id, request, type }) => {
    if (type === 'pair') {
      console.log(id, request, type)
      sockets.emit(request.plugin, id, 'paired', true)
    }
  }
})

function App() {
  console.log(wallet)
  return <div className="App">hello world, 123</div>
}

export default App
