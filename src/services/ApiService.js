import { getChainx } from '../shared/chainx'
import store from '../store'
import {
  chainxAccountsSelector,
  currentChainxAccountSelector
} from '../store/reducers/accountSlice'
import _ from 'lodash'

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
        return ApiService.sign(data.params)
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

  static async sign(params) {
    const chainx = getChainx()
    const extrinsic = chainx.api.createExtrinsic(params[0].data)

    return new Promise((resolve, reject) => {
      const txid = extrinsic.signAndSend(
        '0xe63efbb29e8111c85d9f75bfbb7ab96d68c7bc32d60662be16f1526a14567a6a',
        (error, result) => {
          if (error) {
            if (typeof error === 'object') {
              return resolve({
                error: {
                  code: -2,
                  message: error.message || error
                }
              })
            }
          } else {
            if (result.result === 'ExtrinsicSuccess') {
              return resolve({
                result
              })
            } else if (result.result === 'ExtrinsicFailed') {
              return resolve({
                error: {
                  code: -3,
                  message: 'ExtrinsicFailed'
                }
              })
            }
          }
        }
      )

      console.log(txid)
    })

    // return {
    //   result: ['5R8wTkX6wobiF1Ax9M2NRYb7VtJLS3uq3pn61vqjpPP9EDAs']
    // }
  }
}
