import { getCurrentChainxNode, getAllChainxNodes } from '../messaging'
import fetchFromWs from './fetch'

const TIMEOUT = 7000
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
export const getNodeList = async (setNodeList, isTestNet) => {
  // const nodeListResult = await getAllChainxNodes(isTestNet);
  const nodeListResult = [
    {
      name: 'testnet.w1.org.cn',
      url: 'wss://testnet.w1.chainx.org.cn/ws'
    }
  ]
  setNodeList({ nodeList: nodeListResult })
  return nodeListResult
}

export const getCurrentNode = async (setCurrentNode, isTestNet) => {
  const currentNodeResult = {
    name: 'testnet.w1.org.cn',
    url: 'wss://testnet.w1.chainx.org.cn/ws'
  }
  setCurrentNode({ currentNode: currentNodeResult })
  return currentNodeResult
}

export const isCurrentNodeInit = (node, isTestNet) => {
  let result = false
  if (isTestNet) {
    result = TESTNET_INIT_NODES.some(item => item.url === node.url)
  } else {
    result = INIT_NODES.some(item => item.url === node.url)
  }
  return result
}

export const getDelay = async (
  currentNode,
  setCurrentDelay,
  nodeList,
  delayList,
  setDelayList,
  isTestNet
) => {
  nodeList.forEach((item, index) => {
    fetchFromWs({
      url: item.url,
      method: 'chain_getBlock',
      timeOut: TIMEOUT
    })
      .then((result = {}) => {
        if (result.data) {
          nodeList[index].delay = result.wastTime
        }
      })
      .catch(() => {
        nodeList[index].delay = 'timeout'
      })
      .finally(() => {
        if (nodeList[index].url === currentNode.url) {
          if (isTestNet) {
            setCurrentDelay({ currentTestDelay: nodeList[index].delay })
          } else {
            setCurrentDelay({ currentDelay: nodeList[index].delay })
          }
        }
        delayList[index] = nodeList[index].delay
        if (isTestNet) {
          setDelayList({ testDelayList: delayList })
        } else {
          setDelayList({ delayList: delayList })
        }
      })
  })
}

async function updateNodeStatus(
  setCurrentNode,
  setCurrentDelay,
  setNodeList,
  delayList = [],
  setDelayList,
  isTestNet
) {
  const currentNode = await getCurrentNode(setCurrentNode, isTestNet)
  const nodeList = await getNodeList(setNodeList, isTestNet)
  getDelay(
    currentNode,
    setCurrentDelay,
    nodeList,
    delayList,
    setDelayList,
    isTestNet
  )
}

export default updateNodeStatus
