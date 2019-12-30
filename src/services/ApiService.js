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

function getSettings() {
  const state = store.getState()
  const settings = state.setting

  return {
    result: settings
  }
}

export default class ApiService {
  static async handler(data) {
    if (!data.method) {
      return {
        error: {
          code: -1,
          message: 'method not found'
        }
      }
    }

    switch (data.method) {
      case 'get_settings':
        return getSettings()
      case 'chainx_account':
        return getAccount()
      case 'chainx_accounts': {
        return ApiService.getAccounts()
      }
      case 'chainx_sign': {
        return ApiService.sign(data.id, ...data.params)
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

  static getAccounts() {
    const state = store.getState()
    const accounts = chainxAccountsSelector(state)
    return {
      result: accounts
    }
  }

  static async sign(id, from, data) {
    const state = store.getState()
    const currentAccount = currentChainxAccountSelector(state)
    if (!currentAccount || currentAccount.address !== from) {
      return {
        error: {
          code: codes.INVALID_ADDRESS,
          message: `${from} not found`
        }
      }
    }

    if (!from || !data) {
      return {
        error: {
          code: codes.INVALID_SIGN_DATA,
          message: 'invalid sign params'
        }
      }
    }

    const currentToSign = toSignSelector(state)
    if (currentToSign) {
      return {
        error: {
          code: codes.SIGN_BUSY,
          message: 'sign busy'
        }
      }
    }

    store.dispatch(setToSign({ id, address: from, data }))
  }
}
