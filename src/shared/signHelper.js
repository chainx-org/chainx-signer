import { getChainx } from './chainx'
import { service } from '../services/socketService'
import store from '../store'
import { toSignSelector } from '../store/reducers/txSlice'
import { currentChainxAccountSelector } from '../store/reducers/accountSlice'
import { codes } from '../error'
import { events as socketsEvents } from '../store/reducers/constants'
import { SubmittableExtrinsic } from 'chainx.js'

export const getSignRequest = async (pass, acceleration) => {
  const state = store.getState()
  const { origin, id, data, dataId, needBroadcast } = toSignSelector(state)
  const currentAccount = currentChainxAccountSelector(state)

  const chainx = getChainx()
  const api = chainx.api
  let extrinsic
  try {
    extrinsic = new SubmittableExtrinsic(chainx.api, data)
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
  console.log('nonce origin:', nonce)
  console.log('nonce', nonce.toNumber())
  const signedExtrinsic = extrinsic.sign(account, {
    nonce: nonce.toNumber(),
    acceleration,
    blockHash: api.genesisHash
  })

  const hash = signedExtrinsic.hash.toHex()
  service.emit(origin, id, 'api', {
    id: dataId,
    result: {
      hash,
      hex: signedExtrinsic.toHex()
    }
  })

  if (!needBroadcast) {
    return
  }

  function emitInfo(err, status) {
    return service.emit(origin, id, 'event', {
      event: socketsEvents.TX_STATUS,
      payload: {
        id: dataId,
        err: err || null,
        status: status || null
      }
    })
  }

  try {
    await signedExtrinsic.send(emitInfo)
  } catch (e) {
    return emitInfo(e)
  }
}

export const getGas = (hex, acceleration) => {
  const chainx = getChainx()

  const submittable = new SubmittableExtrinsic(chainx.api, hex)
  return submittable.getFeeSync({ acceleration })
}
