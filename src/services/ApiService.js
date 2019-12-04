import Chainx from 'chainx.js'
import { Method } from '@chainx/types'

const chainx = new Chainx('wss://w1.chainx.org/ws')

chainx.isRpcReady()

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
    return {
      result: ['5R8wTkX6wobiF1Ax9M2NRYb7VtJLS3uq3pn61vqjpPP9EDAs']
    }
  }

  static async sign(params) {
    // console.log(new Method(params[0].data).toJSON())
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
    })

    // return {
    //   result: ['5R8wTkX6wobiF1Ax9M2NRYb7VtJLS3uq3pn61vqjpPP9EDAs']
    // }
  }
}
