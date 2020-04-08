import { instances } from './chainxInstances'

let chainx = null

export const setChainx = async nodeUrl => {
  chainx = instances.get(nodeUrl)

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