import { createSlice } from '@reduxjs/toolkit'
import { CHAINX2_NODE_STORE_KEY } from './constants'
import { setChainx2Instances } from '../../shared/chainx2Instances'

const mainNetInitNodes = [
  {
    name: '47.114.131.193',
    url: 'ws://47.114.131.193:9000'
  }
]

export function initChainx2Instances() {
  setChainx2Instances(mainNetInitNodes.map(node => node.url))
}

const defaultNodeInitialState = {
  version: 0,
  mainNetNodes: mainNetInitNodes,
  currentMainNetNode: mainNetInitNodes[0],
  mainnetNodesDelay: {}
}

const initialState =
  window.nodeStore.get(CHAINX2_NODE_STORE_KEY) || defaultNodeInitialState

const chainx2NodeSlice = createSlice({
  name: 'chainx2Node',
  initialState,
  reducers: {
    addChainx2MainNetNode(
      state,
      {
        payload: {
          node: { name, url }
        }
      }
    ) {
      const target = state.mainNetNodes.find(node => node.url === url)
      if (target) {
        return
      }

      const newNode = { name, url }
      state.mainNetNodes.push(newNode)
      setChainx2Instances([url])

      const pre = state.currentMainNetNode
      console.log(pre)
      state.currentMainNetNode = newNode

      // TODO: broadcast node change

      window.nodeStore.set(CHAINX2_NODE_STORE_KEY, state)
    }
  }
})

export default chainx2NodeSlice.reducer
