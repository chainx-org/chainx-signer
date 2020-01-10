import Chainx from 'chainx.js'

let chainx = null

export const setChainx = async nodeUrl => {
  chainx = new Chainx(nodeUrl)
  await chainx.isRpcReady()
  return chainx
}

export const getChainx = () => {
  return chainx
}

export const replaceBTC = token => {
  return token === 'BTC' ? 'X-BTC' : token
}

export const sleep = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
