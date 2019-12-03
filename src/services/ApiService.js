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
      case 'chainx_call': {
        return ApiService.call(data.params)
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

  static call() {
    return {
      result: ['5R8wTkX6wobiF1Ax9M2NRYb7VtJLS3uq3pn61vqjpPP9EDAs']
    }
  }
}
