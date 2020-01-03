import { getChainx } from './chainx'
import { service } from '../services/socketService'
import { Extrinsic } from '@chainx/types'
import store from '../store'
import { toSignSelector } from '../store/reducers/txSlice'
import { currentChainxAccountSelector } from '../store/reducers/accountSlice'
import { codes } from '../error'
import { events as socketsEvents } from '../store/reducers/constants'

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

  chainx.api.rpc.author.submitAndWatchExtrinsic(
    signedExtrinsic,
    async (err, status) => {
      if (err) {
        return service.emit(origin, id, 'event', {
          event: socketsEvents.TX_STATUS,
          payload: {
            id: dataId,
            err,
            status: null
          }
        })
      }

      async function checkStatus() {
        let events = null
        let result = null
        let index = null
        let blockHash = null
        let broadcast = null
        if (status.type === 'Broadcast') {
          broadcast = status.value && status.value.toJSON()
        }

        if (status.type === 'Finalized') {
          blockHash = status.value
          const {
            block: { extrinsics }
          } = await chainx.api.rpc.chain.getBlock(blockHash)
          const allEvents = await chainx.api.query.system.events.at(blockHash)
          index = extrinsics.map(ext => ext.hash.toHex()).indexOf(hash)
          if (index !== -1) {
            events = allEvents.filter(
              ({ phase }) =>
                phase.type === 'ApplyExtrinsic' && phase.value.eqn(index)
            )

            result = ''
            if (events.length) {
              result = events[events.length - 1].event.data.method
            }
          }
        }

        const stat = {
          result,
          index,
          events:
            events &&
            events.map(event => {
              const o = event.toJSON()
              o.method = event.event.data.method
              return o
            }),
          txHash: hash,
          blockHash: blockHash && blockHash.toJSON(),
          broadcast: broadcast,
          status: status.type
        }

        service.emit(origin, id, 'event', {
          event: socketsEvents.TX_STATUS,
          payload: {
            id: dataId,
            err: null,
            status: stat
          }
        })
      }

      try {
        await checkStatus()
      } catch (e) {
        return service.emit(origin, id, 'event', {
          event: socketsEvents.TX_STATUS,
          payload: {
            id: dataId,
            err: e,
            status: null
          }
        })
      }
    }
  )
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
