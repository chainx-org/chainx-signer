import React from 'react'
import './App.css'
import Signer from './signer'

const signer = new Signer('dapp')

signer.link().then(async () => {
  // 获取账户
  const accounts = await signer.sendApiRequest({
    payload: {
      method: 'chainx_accounts',
      params: []
    }
  })
  console.log(accounts)
  //
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
