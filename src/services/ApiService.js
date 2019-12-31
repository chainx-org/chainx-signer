import store from '../store'
import {
  chainxAccountsSelector,
  currentChainxAccountSelector
} from '../store/reducers/accountSlice'
import _ from 'lodash'
import { codes } from '../error'
import { setToSign, toSignSelector } from '../store/reducers/txSlice'

function getAccount() {
  const state = store.getState()
  const account = currentChainxAccountSelector(state)
  return {
    result: _.pick(account, ['name', 'address'])
  }
}

function getAccounts() {
  const state = store.getState()
  const accounts = chainxAccountsSelector(state)
  return {
    result: accounts
  }
}

function getSettings() {
  const state = store.getState()
  const settings = state.setting

  return {
    result: settings
  }
}

const type = 'api'
export default class ApiService {
  constructor(sockets, request, id) {
    this.sockets = sockets // 就是LowLevelSocketService
    this.request = request
    this.id = id
  }

  async handle(request, id) {
    const data = request.data.payload

    if (!data.method) {
      return this.sockets.emit(request.data.origin, id, type, {
        id: data.id,
        error: {
          code: -1,
          message: 'method not found'
        }
      })
    }

    switch (data.method) {
      case 'get_settings':
        return this.emit(getSettings())
      case 'chainx_account':
        return this.emit(getAccount())
      case 'chainx_accounts':
        return this.emit(getAccounts())
      case 'chainx_sign': {
        return this.sign(data.id, ...data.params)
      }
      default: {
        return {
          error: {
            code: -1,
            message: `${data.method} not found`
          }
        }
      }
    }
  }

  emit(data) {
    this.sockets.emit(this.request.data.origin, this.id, type, {
      id: this.request.data.payload.id,
      ...data
    })
  }

  static getAccounts() {
    const state = store.getState()
    const accounts = chainxAccountsSelector(state)
    return {
      result: accounts
    }
  }

  async sign(id, from, data) {
    const state = store.getState()
    const currentAccount = currentChainxAccountSelector(state)
    if (!currentAccount || currentAccount.address !== from) {
      this.emit({
        error: {
          code: codes.INVALID_ADDRESS,
          message: `${from} not found`
        }
      })
    }

    if (!from || !data) {
      return this.emit({
        error: {
          code: codes.INVALID_SIGN_DATA,
          message: 'invalid sign params'
        }
      })
    }

    const currentToSign = toSignSelector(state)
    if (currentToSign) {
      return this.emit({
        error: {
          code: codes.SIGN_BUSY,
          message: 'sign busy'
        }
      })
    }

    store.dispatch(
      setToSign({
        origin: this.request.data.origin,
        id: this.id,
        dataId: id,
        address: from,
        data
      })
    )
  }
}
