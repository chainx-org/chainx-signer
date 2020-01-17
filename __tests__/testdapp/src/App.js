import React from 'react'
import Chainx from 'chainx.js'

import './App.css'
import Signer from '@chainx/signer-connector'
import { events } from './signer/constants'

const chainx = new Chainx('wss://w1.chainx.org/ws')
const signer = new Signer('dapp', true)

function logPayload(payload) {
  console.log('change', payload)
}

signer.addEventHandler(events.NETWORK_CHANGE, logPayload)
signer.addEventHandler(events.NODE_CHANGE, logPayload)
signer.addEventHandler(events.ACCOUNT_CHANGE, logPayload)

async function link() {
  try {
    const linked = await signer.link()
    console.log(linked ? `connect successfully` : `failed to connect`)
  } catch (e) {
    console.log('failed to connect', e)
  }
}

async function getAccount() {
  if (!signer.connected) {
    console.error('not connected')
    return
  }

  const account = await signer.getCurrentAccount()

  console.log('account', account)
}

async function getSettings() {
  if (!signer.connected) {
    console.error('not connected')
    return
  }

  const settings = await signer.getSettings()
  console.log('settings', settings)
}

async function getNode() {
  if (!signer.connected) {
    console.error('not connected')
    return
  }

  const node = await signer.getCurrentNode()

  console.log('node', node)
}

async function testTransfer(needBroadcast = false) {
  if (!signer.connected) {
    console.error('not connected')
    return
  }

  await chainx.isRpcReady()

  const account = await signer.sendApiRequest({
    method: 'chainx_account',
    params: []
  })

  const extrinsic = chainx.api.tx.xAssets.transfer(
    '5GikUJaUwAoSnRHk6nupxEmFdbY2BpPGub3ZVqUQyAVLy1ff',
    'PCX',
    10 ** 8,
    ''
  )

  const hex = extrinsic.toHex()

  if (needBroadcast) {
    const result = await signer.signAndSendExtrinsic(
      account.address,
      hex,
      (err, status) => {
        console.log('err', err, 'status', status)
      }
    )
    console.log('result', result)
  } else {
    const result = await signer.signExtrinsic(account.address, hex).catch(e => {
      console.log('error', e)
    })

    console.log('result', result)
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={link}>连接 chainx</button>
        <button onClick={getAccount}>获取account</button>
        <button onClick={getSettings}>获取settings</button>
        <button onClick={getNode}>获取node</button>
        <button onClick={() => testTransfer(false)}>sign transfer</button>
        <button onClick={() => testTransfer(true)}>
          sign and send transfer
        </button>
      </header>
    </div>
  )
}

export default App
