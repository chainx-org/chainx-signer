import { createSlice, createSelector } from '@reduxjs/toolkit'
import { CHAINX_MAIN, CHAINX_TEST, NODE_STORE_KEY } from './constants'
import { chainxNetwork, networkSelector } from './settingSlice'

const defaultNodeInitialState = {
  version: 0,
  chainxMainNetNodes: [],
  currentChainXMainNetNode: null,
  chainxTestNetNodes: [],
  currentChainXTestNetNode: null
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
    addNode(state, { chainId, node: { name, url } }) {
      const targetNodes = findTargetNodes(state, chainId)

      if (targetNodes.findIndex(n => n.url === url) < 0) {
        targetNodes.push({ name, url })
        window.nodeStore.set(NODE_STORE_KEY, state)
      }

      // TODO: 处理存在相同url的情况
    },
    setCurrentChainXMainNetNode(state, { payload: { url } }) {
      const target = state.chainxMainNetNodes.find(n => n.url === url)
      if (!target) {
        throw new Error(`No ChainX mainnet node with url ${url}`)
      }
      state.currentChainXMainNetNode = target
    },
    removeNode(state, { chainId, url }) {
      const targetNodes = findTargetNodes(state, chainId)
      const index = targetNodes.findIndex(n => n.url === url)
      if (index >= 0) {
        targetNodes.splice(index, 1)
        window.nodeStore.set(NODE_STORE_KEY, state)
      }

      // TODO: 处理不存在url的情况
    },
    setCurrentChainXTestNetNode(state, { payload: { url } }) {
      const target = state.chainxTestNetNodes.find(n => n.url === url)
      if (!target) {
        throw new Error(`No ChainX testnet node with url ${url}`)
      }
      state.currentChainXTestNetNode = target
    }
  }
})

export const {
  addNode,
  removeNode,
  setCurrentChainXMainNetNode,
  setCurrentChainXTestNetNode
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
