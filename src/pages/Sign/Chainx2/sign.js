import store from '@store/index'
import { chainx2ToSignSelector } from '@store/reducers/txSlice'
import { currentAccountSelector } from '@store/reducers/accountSlice'
import { getChainx2 } from '@shared/chainx2'
import { service } from '../../../services/socketService'
import { codes } from '../../../error'
import KeyStore from '@chainx/keystore'
import Keyring from '@chainx-v2/keyring'
import { ss58FormatSelector } from '@store/reducers/chainx2AssetSlice'
import { events as socketsEvents } from '@store/reducers/constants'

export const signExtrinsic = async pass => {
  const state = store.getState()
  const {
    origin,
    id,
    data: { section, method, params },
    dataId
  } = chainx2ToSignSelector(state)
  const account = currentAccountSelector(state)

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

  const api = getChainx2()
  await api.isReady

  if (!api.tx[section] || !api.tx[section][method]) {
    service.emit(origin, id, 'api', {
      id: dataId,
      error: {
        code: codes.INVALID_SIGN_DATA,
        message: 'invalid sign data'
      }
    })

    throw new Error('Invalid sign data')
  }

  const pk = KeyStore.decrypt(account.keystore, pass)
  const ss58Format = ss58FormatSelector(state)
  const keyring = new Keyring({ ss58Format })
  const pair = keyring.addFromUri(pk)

  const extrinsic = api.tx[section][method](...params)

  const unsub = await extrinsic.signAndSend(pair, ({ events = [], status }) => {
    const normalizedEvents = events.map(
      ({ event: { data, method, section }, phase }) => {
        return {
          data,
          method,
          section,
          phase
        }
      }
    )
    emitInfo(null, { status, events, normalizedEvents })

    if (status.isFinalized) {
      unsub()
    }
  })
}
