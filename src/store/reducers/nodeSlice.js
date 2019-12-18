import { createSlice } from '@reduxjs/toolkit'
import {
  CHAINX_MAIN,
  CHAINX_TEST,
  defaultNodeInitialState,
  NODE_STORE_KEY
} from './constants'

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
    removeNode(state, { chainId, url }) {
      const targetNodes = findTargetNodes(state, chainId)
      const index = targetNodes.findIndex(n => n.url === url)
      if (index >= 0) {
        targetNodes.splice(index, 1)
        window.nodeStore.set(NODE_STORE_KEY, state)
      }

      // TODO: 处理不存在url的情况
    }
  }
})

export const { addNode, removeNode } = nodeSlice.actions

export default nodeSlice.reducer
