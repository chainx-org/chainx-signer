import React from 'react'
import './App.css'
import Signer from './signer'

function App() {
  const signer = new Signer('dapp')

  signer.link()
  return (
    <div className="App">
      <header className="App-header">
        <button>连接 chainx</button>
      </header>
    </div>
  )
}

export default App
