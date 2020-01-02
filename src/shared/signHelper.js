import { getChainx } from './chainx'
import { compactAddLength } from '@chainx/util'
import { service } from '../services/socketService'
import { Extrinsic } from '@chainx/types'
import store from '../store'
import { toSignSelector } from '../store/reducers/txSlice'
import { currentChainxAccountSelector } from '../store/reducers/accountSlice'
import { codes } from '../error'

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

export const getSignRequest = async (pass, acceleration) => {
  const state = store.getState()
  const { origin, id, data, dataId, needBroadcast } = toSignSelector(state)
  const currentAccount = currentChainxAccountSelector(state)

  const chainx = getChainx()
  const api = chainx.api
  let extrinsic
  try {
    extrinsic = new Extrinsic(data)
  } catch (e) {
    service.emit(origin, id, 'api', {
      id: dataId,
      error: {
        code: codes.INVALID_SIGN_DATA,
        message: 'invalid sign data'
      }
    })
  }
  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass)
  const nonce = await api.query.system.accountNonce(account.publicKey())
  const signedExtrinsic = extrinsic.sign(
    account,
    nonce.toNumber(),
    acceleration,
    api.genesisHash
  )

  service.emit(origin, id, 'api', {
    id: dataId,
    result: {
      hash: signedExtrinsic.hash.toHex(),
      hex: signedExtrinsic.toHex()
    }
  })

  if (needBroadcast) {
    // TODO: 广播交易，并且返回给dapp交易的status
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
