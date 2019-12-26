import { createSelector, createSlice } from '@reduxjs/toolkit'
import { CHAINX_MAIN, CHAINX_TEST, events, NODE_STORE_KEY } from './constants'
import { chainxNetwork, networkSelector } from './settingSlice'

export const mainNetInitNodes = [
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

export const testNetInitNodes = [
  {
    name: 'testnet.w1.org.cn',
    url: 'wss://testnet.w1.chainx.org.cn/ws'
  }
]

const defaultNodeInitialState = {
  version: 0,
  chainxMainNetNodes: mainNetInitNodes,
  currentChainXMainNetNode: mainNetInitNodes[0],
  chainxTestNetNodes: testNetInitNodes,
  currentChainXTestNetNode: testNetInitNodes[0],
  testnetNodesDelay: {},
  mainnetNodesDelay: {}
}

const initialState =
  window.nodeStore.get(NODE_STORE_KEY) || defaultNodeInitialState

function findTargetNodes(state, chainId) {
  let targetNodes
  if (CHAINX_MAIN === chainId) {
    targetNodes = state.chainxMainNetNodes
  } else if (CHAINX_TEST === chainId) {
    targetNodes = state.chainxTestNetNodes
  } else {
    throw new Error(`Invalid chainId: ${chainId}`)
  }

  return targetNodes
}

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    addNode(
      state,
      {
        payload: {
          chainId,
          node: { name, url }
        }
      }
    ) {
      const targetNodes = findTargetNodes(state, chainId)
      const target = targetNodes.find(n => n.url === url)
      if (target) {
        return
      }

      const newNode = { name, url }
      targetNodes.push(newNode)
      let pre
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetNode
        state.currentChainXMainNetNode = newNode
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainXTestNetNode
        state.currentChainXTestNetNode = newNode
      }

      if ([CHAINX_MAIN, CHAINX_TEST].includes(chainId)) {
        window.sockets.broadcastEvent(events.NODE_CHANGE, {
          from: pre,
          to: newNode
        })
      }

      window.nodeStore.set(NODE_STORE_KEY, state)
    },
    setNodeDelay(state, { payload: { chainId, url, delay } }) {
      let nodes = state.testnetNodesDelay
      if (CHAINX_MAIN === chainId) {
        nodes = state.mainnetNodesDelay
      }
      nodes[url] = delay
      window.nodeStore.set(NODE_STORE_KEY, state)
    },
    removeNode(state, { payload: { chainId, url } }) {
      const targetNodes = findTargetNodes(state, chainId)
      if (targetNodes.length <= 1) {
        return
      }

      const index = targetNodes.findIndex(n => n.url === url)
      if (index < 0) {
        return
      }

      targetNodes.splice(index, 1)

      let pre = null
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetNode
        state.currentChainXMainNetNode = targetNodes[0] || null
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainXTestNetNode
        state.currentChainXTestNetNode = targetNodes[0] || null
      }

      if ([CHAINX_MAIN, CHAINX_TEST].includes(chainId)) {
        window.sockets.broadcastEvent(events.NODE_CHANGE, {
          from: pre,
          to: targetNodes[0] || null
        })
      }

      window.nodeStore.set(NODE_STORE_KEY, state)

      // TODO: 处理不存在url的情况
    },
    setCurrentChainXMainNetNode(state, { payload: { url } }) {
      const target = state.chainxMainNetNodes.find(n => n.url === url)
      if (!target) {
        throw new Error(`No ChainX mainnet node with url ${url}`)
      }

      const pre = state.currentChainXTestNetNode
      state.currentChainXMainNetNode = target
      window.nodeStore.set(NODE_STORE_KEY, state)
      window.sockets.broadcastEvent(events.NODE_CHANGE, {
        from: pre,
        to: target
      })
    },
    setCurrentChainXTestNetNode(state, { payload: { url } }) {
      const target = state.chainxTestNetNodes.find(n => n.url === url)
      if (!target) {
        throw new Error(`No ChainX testnet node with url ${url}`)
      }

      const pre = state.currentChainXTestNetNode
      state.currentChainXTestNetNode = target
      window.nodeStore.set(NODE_STORE_KEY, state)
      window.sockets.broadcastEvent(events.NODE_CHANGE, {
        from: pre,
        to: target
      })
    }
  }
})

export const {
  addNode,
  removeNode,
  setCurrentChainXMainNetNode,
  setCurrentChainXTestNetNode,
  setNodeDelay
} = nodeSlice.actions

export const chainxMainNetNodesSelector = state => state.node.chainxMainNetNodes
export const chainxTestNetNodesSelector = state => state.node.chainxTestNetNodes
export const currentChainXMainNetNodeSelector = state =>
  state.node.currentChainXMainNetNode
export const currentChainXTestNetNodeSelector = state =>
  state.node.currentChainXTestNetNode

export const chainxNodesSelector = createSelector(
  networkSelector,
  chainxMainNetNodesSelector,
  chainxTestNetNodesSelector,
  (network, mainNetNodes, testNetNodes) => {
    if (network === chainxNetwork.TEST) {
      return testNetNodes
    } else if (network === chainxNetwork.MAIN) {
      return mainNetNodes
    }
  }
)

export const chainxNodesDelaySelector = createSelector(
  networkSelector,
  state => state.node.mainnetNodesDelay,
  state => state.node.testnetNodesDelay,
  (network, mainnetNodesDelay, testnetNodesDelay) => {
    if (network === chainxNetwork.TEST) {
      return testnetNodesDelay
    } else if (network === chainxNetwork.MAIN) {
      return mainnetNodesDelay
    }
  }
)

export const currentChainxNodeSelector = createSelector(
  networkSelector,
  currentChainXMainNetNodeSelector,
  currentChainXTestNetNodeSelector,
  (network, mainNetNode, testNetNode) => {
    if (network === chainxNetwork.TEST) {
      return testNetNode
    } else if (network === chainxNetwork.MAIN) {
      return mainNetNode
    }
  }
)

export default nodeSlice.reducer
