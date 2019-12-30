import React from 'react'
import Chainx from 'chainx.js'

import './App.css'
import Signer from './signer'

const chainx = new Chainx('wss://w1.chainx.org/ws')
const signer = new Signer('dapp')

signer.link().then(async () => {
  // 获取账户
  const account = await signer.sendApiRequest({
    method: 'chainx_account',
    params: []
  })

  console.log('account', account)

  const settings = await signer.sendApiRequest({
    method: 'get_settings',
    params: []
  })
  console.log('settings', settings)

  await chainx.isRpcReady()

  const extrinsic = chainx.api.tx.xAssets.transfer(
    '5GikUJaUwAoSnRHk6nupxEmFdbY2BpPGub3ZVqUQyAVLy1ff',
    'PCX',
    1 * 10 ** 8,
    ''
  )

  // 发送交易
  const signResult = await signer.sendApiRequest({
    method: 'chainx_sign',
    params: [account.address, extrinsic.toHex()]
  })

  console.log('signResult', signResult)
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
