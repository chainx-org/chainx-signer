import { getChainx } from './chainx'
import { service } from '../services/socketService'
import store from '../store'
import { toSignSelector } from '../store/reducers/txSlice'
import { currentChainxAccountSelector } from '../store/reducers/accountSlice'
import { codes } from '../error'
import { events as socketsEvents } from '../store/reducers/constants'
import { SubmittableExtrinsic } from 'chainx.js'

export const signAndSend = async (pass, acceleration) => {
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

    throw new Error('Invalid sign data')
  }

  const account = chainx.account.fromKeyStore(currentAccount.keystore, pass)
  let nonce
  try {
    nonce = await api.query.system.accountNonce(account.publicKey())
  } catch (e) {
    console.error('Failed to get nonce')
    service.emit(origin, id, 'api', {
      id: dataId,
      error: e
    })
    throw e
  }

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
    if (process.env.NODE_ENV === 'development' && err) {
      console.error('send error', err)
    }

    service.emit(origin, id, 'event', {
      event: socketsEvents.TX_STATUS,
      payload: {
        id: dataId,
        err: err || null,
        status: status || null
      }
    })
  }

  await signedExtrinsic.send(emitInfo)
}

export const getGas = (hex, acceleration) => {
  const chainx = getChainx()

  const submittable = new SubmittableExtrinsic(chainx.api, hex)
  return submittable.getFeeSync({ acceleration })
}
