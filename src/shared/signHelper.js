import { getCurrentChainxAccount, getCurrentChainxNode } from '../messaging'
import { setChainx } from './chainx'

const getSubmittable = (query, chainx) => {
  const { module, method, args } = query
  const call = chainx.api.tx[module][method]
  if (!call) {
    throw new Error('Invalid method')
  }
  if (method === 'putCode') {
    args[1] = Uint8Array.from(Object.values(args[1]))
  }
  return call(...args)
}

export const getSignRequest = async (isTestNet, query, pass, acceleration) => {
  const node = await getCurrentChainxNode(isTestNet)
  const chainx = await setChainx(node.url)
  const currentAccount = await getCurrentChainxAccount(isTestNet)

  const submittable = getSubmittable(query, chainx)
  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass)
  const nonce = await submittable.getNonce(account.publicKey())
  submittable.sign(account, {
    nonce: nonce.toNumber(),
    acceleration: acceleration
  })
  const hex = submittable.toHex()
  const request = {
    id: query.id,
    hex: hex
  }
  return request
}

export const getCurrentGas = async (
  isTestNet,
  query,
  setErrMsg,
  setCurrentGas
) => {
  const node = await getCurrentChainxNode(isTestNet)
  const chainx = await setChainx(node.url)
  await chainx.isRpcReady()
  const _currentAccount = await getCurrentChainxAccount(isTestNet)

  const { address, module, method, args } = query

  const call = chainx.api.tx[module][method]

  if (!call) {
    setErrMsg('Invalid method')
    return
  }

  if (_currentAccount.address !== address) {
    setErrMsg('Invalid address')
    return
  }

  if (method === 'putCode') {
    args[1] = Uint8Array.from(Object.values(args[1]))
  }

  const submittable = call(...args)
  const _currentGas = submittable.getFeeSync(_currentAccount.address, 1)

  setCurrentGas(_currentGas)
}
