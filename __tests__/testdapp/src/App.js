import React from 'react'
import Chainx from 'chainx.js'

import './App.css'
import Signer from './signer'

const chainx = new Chainx('wss://w1.chainx.org/ws')
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

  await chainx.isRpcReady()

  const extrinsic = chainx.api.tx.xAssets.transfer(
    '5Uqv6cLXvfbHr2GNDyofzruGhoY8V7ECyFW3XffAjW5X1osy',
    'PCX',
    1000000000,
    ''
  )

  // 发送交易
  const txresult = await signer.sendApiRequest({
    payload: {
      method: 'chainx_sign',
      params: [
        {
          from: account,
          data: extrinsic.method.toHex()
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
