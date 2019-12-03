export default class ApiService {
  static handler(data) {
    console.log('哈哈哈哈', data)
    if (!data.method) {
      return {}
    }
    return {
      result: ['5R8wTkX6wobiF1Ax9M2NRYb7VtJLS3uq3pn61vqjpPP9EDAs']
    }
  }

  static getAccounts() {
    return ['5R8wTkX6wobiF1Ax9M2NRYb7VtJLS3uq3pn61vqjpPP9EDAs']
  }
}
