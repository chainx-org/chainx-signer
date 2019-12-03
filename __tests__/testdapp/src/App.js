import React from 'react'
import './App.css'
import Signer from './signer'

const signer = new Signer('dapp')

signer.link().then(() => {
  console.log('喔喔喔喔')
  signer
    .sendApiRequest({
      payload: {
        data: '哈哈哈哈'
      }
    })
    .then(result => {
      console.log(result)
    })
})

function App() {
  console.log(signer)
  return (
    <div className="App">
      <header className="App-header">
        <button>连接 chainx</button>
      </header>
    </div>
  )
}

export default App
