import React from 'react'
import Chainx from 'chainx.js'

import './App.css'
import Signer from './signer'
import { events } from './signer/constants'

const chainx = new Chainx('wss://w1.chainx.org/ws')
const signer = new Signer('dapp')

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

  const account = await signer.sendApiRequest({
    method: 'chainx_account',
    params: []
  })

  console.log('account', account)
}

async function getSettings() {
  if (!signer.connected) {
    console.error('not connected')
    return
  }

  const settings = await signer.sendApiRequest({
    method: 'get_settings',
    params: []
  })
  console.log('settings', settings)
}

async function testTransfer() {
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

  // 发送交易
  const signResult = await signer.sendApiRequest({
    method: 'chainx_sign',
    params: [account.address, hex]
  })

  console.log('signResult', signResult)
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={link}>连接 chainx</button>
        <button onClick={getAccount}>获取account</button>
        <button onClick={getSettings}>获取settings</button>
        <button onClick={testTransfer}>test transfer</button>
      </header>
    </div>
  )
}

export default App
