import fetchFromWs from './fetch'

const TIMEOUT = 10000
const INIT_NODES = [
  {
    name: 'w1.org',
    url: 'wss://w1.chainx.org/ws'
  },
  {
    name: 'w2.org',
    url: 'wss://w2.chainx.org/ws'
  },
  {
    name: 'HashQuark',
    url: 'wss://chainx.hashquark.io'
  },
  {
    name: 'BuildLinks',
    url: 'wss://chainx.buildlinks.org'
  },
  {
    name: 'w1.cn',
    url: 'wss://w1.chainx.org.cn/ws'
  }
]

const TESTNET_INIT_NODES = [
  {
    name: 'testnet.w1.org.cn',
    url: 'wss://testnet.w1.chainx.org.cn/ws'
  }
]

export const isCurrentNodeInit = (node, isTestNet) => {
  let result = false
  if (isTestNet) {
    result = TESTNET_INIT_NODES.some(item => item.url === node.url)
  } else {
    result = INIT_NODES.some(item => item.url === node.url)
  }
  return result
}

const getDelay = async (nodeList, chainId, dispatch, setNodeDelay) => {
  nodeList.forEach(item => {
    fetchFromWs({
      url: item.url,
      method: 'chain_getBlock',
      timeOut: TIMEOUT
    })
      .then((result = {}) => {
        if (result.data) {
          dispatch(
            setNodeDelay({ chainId, url: item.url, delay: result.wastTime })
          )
        }
      })
      .catch(err => {
        console.log('catched', err)
        dispatch(setNodeDelay({ chainId, url: item.url, delay: 'timeout' }))
      })
  })
}

export default getDelay
