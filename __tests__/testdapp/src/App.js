import React from 'react'
import './App.css'
import Signer from './signer'
// import chainx from ''
const signer = new Signer('dapp')

signer.link().then(async () => {
  // 获取账户
  const accounts = await signer.sendApiRequest({
    payload: {
      method: 'chainx_accounts',
      params: []
    }
  })

  const account = accounts[0]

  // 发送交易
  const txresult = await signer.sendApiRequest({
    payload: {
      method: 'chainx_call',
      params: [
        {
          from: account,
          data: '0x1111'
        }
      ]
    }
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
