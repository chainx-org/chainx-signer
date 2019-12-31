import { getChainx } from './chainx'
import { compactAddLength } from '@chainx/util'
import { service } from '../services/socketService'

const getSubmittable = (query, chainx) => {
  const { module, method, args } = query
  const call = chainx.api.tx[module][method]
  if (!call) {
    throw new Error('Invalid method')
  }
  if (method === 'putCode') {
    args[0] = args[0].toString()
    args[1] = compactAddLength(args[1])
  }
  return call(...args)
}

export const getSignRequest = async (
  currentAccount,
  query,
  pass,
  acceleration
) => {
  const chainx = getChainx()
  const submittable = getSubmittable(query, chainx)
  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass)
  const nonce = await submittable.getNonce(account.publicKey())
  submittable.sign(account, {
    nonce: nonce.toNumber(),
    acceleration: acceleration
  })

  const { origin, id, dataId } = query
  service.emit(origin, id, 'api', {
    id: dataId,
    result: {
      hash: submittable.hash.toString()
    }
  })
  const hex = submittable.toHex()
  return {
    id: query.id,
    hex: hex
  }
}

export const getCurrentGas = async (
  currentAccount,
  query,
  setErrMsg,
  setCurrentGas
) => {
  const chainx = getChainx()

  const { address, module, method, args } = query

  const call = chainx.api.tx[module][method]

  if (!call) {
    setErrMsg('Invalid method')
    return
  }

  if (currentAccount.address !== address) {
    setErrMsg('Invalid address')
    return
  }

  if (method === 'putCode') {
    args[1] = Uint8Array.from(Object.values(args[1]))
  }

  const submittable = call(...args)
  const _currentGas = submittable.getFeeSync(currentAccount.address, 1)

  setCurrentGas(_currentGas)
}
