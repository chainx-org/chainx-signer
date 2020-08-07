/* eslint-disable */
import { createSelector, createSlice } from '@reduxjs/toolkit'
import {
  CHAINX2_TEST,
  CHAINX_MAIN,
  CHAINX_TEST,
  events,
  NODE_STORE_KEY
} from '../constants'
import { chainxNetwork, networkSelector } from '../settingSlice'
import {
  removeChainxInstance,
  setChainxInstances
} from '@shared/chainxInstances'
import _ from 'lodash'
import {
  chainx2TestNetInitNodes,
  chainxMainNetInitNodes,
  chainxTestNetInitNodes
} from '@store/reducers/nodeSlice/constants'
import {
  removeChainx2Instance,
  setChainx2Instances
} from '@shared/chainx2Instances'

const chainxInitNodes = [...chainxMainNetInitNodes, ...chainxTestNetInitNodes]

const defaultNodeInitialState = {
  /**
   * version 1:
   * 1. 去掉了testnetNodesDelay和mainnetNodesDelay
   * 2. 将delay信息直接保存在node对象中
   */
  version: 1,
  chainxMainNetNodes: chainxMainNetInitNodes,
  currentChainXMainNetNode: chainxMainNetInitNodes[0],
  chainxTestNetNodes: chainxTestNetInitNodes,
  currentChainXTestNetNode: chainxTestNetInitNodes[0],
  chainx2TestNetNodes: chainx2TestNetInitNodes,
  currentChainX2TestNetNode: chainx2TestNetInitNodes[0]
}

const initialState = do {
  const storedState = window.nodeStore.get(NODE_STORE_KEY)
  if (!storedState) {
    defaultNodeInitialState
  } else if (storedState.version < 1) {
    ;({
      ...defaultNodeInitialState,
      ..._.pick(storedState, [
        'chainxMainNetNodes',
        'currentChainXMainNetNode',
        'chainxTestNetNodes',
        'currentChainXTestNetNode'
      ])
    })
  } else {
    storedState
  }
}

export const initChainxInstances = () => {
  setChainxInstances(
    [
      ...initialState.chainxMainNetNodes,
      ...initialState.chainxTestNetNodes
    ].map(node => node.url)
  )
}

export function initChainx2Instances() {
  setChainx2Instances(initialState.chainx2TestNetNodes.map(node => node.url))
}

export function removeInstance(chainId, url = '') {
  if (CHAINX2_TEST === chainId) {
    removeChainx2Instance(url)
  } else if ([CHAINX_MAIN, CHAINX_TEST].includes(chainId)) {
    removeChainxInstance(url)
  }
}

function setInstances(chainId, urls = []) {
  if (CHAINX2_TEST === chainId) {
    setChainx2Instances(urls)
  } else if ([CHAINX_MAIN, CHAINX_TEST].includes(chainId)) {
    setChainxInstances(urls)
  }
}

function findTargetNodes(state, chainId) {
  let targetNodes
  if (CHAINX_MAIN === chainId) {
    targetNodes = state.chainxMainNetNodes
  } else if (CHAINX_TEST === chainId) {
    targetNodes = state.chainxTestNetNodes
  } else if (CHAINX2_TEST === chainId) {
    targetNodes = state.chainx2TestNetNodes
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
      setInstances(chainId, [url])

      let pre
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetNode
        state.currentChainXMainNetNode = newNode
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainXTestNetNode
        state.currentChainXTestNetNode = newNode
      } else if (CHAINX2_TEST === chainId) {
        pre = state.currentChainX2TestNetNode
        state.currentChainX2TestNetNode = newNode
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
      const targetNodes = findTargetNodes(state, chainId)
      const targetNode = targetNodes.find(node => node.url === url)
      const idx = targetNodes.findIndex(n => n.url === url)
      targetNodes.splice(idx, 1, { ...targetNode, delay })

      if (url === state.currentChainXTestNetNode.url) {
        state.currentChainXTestNetNode.delay = delay
      } else if (url === state.currentChainXMainNetNode.url) {
        state.currentChainXMainNetNode.delay = delay
      } else if (url === state.currentChainX2TestNetNode) {
        state.currentChainX2TestNetNode.delay = delay
      }
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
      removeInstance(url)

      let pre = null
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetNode
        state.currentChainXMainNetNode = targetNodes[0] || null
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainXTestNetNode
        state.currentChainXTestNetNode = targetNodes[0] || null
      } else if (CHAINX2_TEST === chainId) {
        pre = state.currentChainX2TestNetNode
        state.currentChainX2TestNetNode = targetNodes[0] || null
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
    setCurrentNode(state, { payload: { chainId, url } }) {
      const targetNodes = findTargetNodes(state, chainId)
      if (!targetNodes) {
        return
      }

      const target = targetNodes.find(n => n.url === url)
      if (!target) {
        return
      }

      let pre
      if (CHAINX_MAIN === chainId) {
        pre = state.currentChainXMainNetNode
        state.currentChainXMainNetNode = target
      } else if (CHAINX_TEST === chainId) {
        pre = state.currentChainXTestNetNode
        state.currentChainXTestNetNode = target
      } else if (CHAINX2_TEST === chainId) {
        pre = state.currentChainX2TestNetNode
        state.currentChainX2TestNetNode = target
      }

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
  setCurrentNode,
  setNodeDelay
} = nodeSlice.actions

export const chainxMainNetNodesSelector = state =>
  state.node.chainxMainNetNodes.map(node => {
    const isInit = chainxInitNodes.some(n => n.url === node.url)

    return {
      ...node,
      isInit
    }
  })
export const chainxTestNetNodesSelector = state =>
  state.node.chainxTestNetNodes.map(node => {
    const isInit = chainxInitNodes.some(n => n.url === node.url)

    return {
      ...node,
      isInit
    }
  })

export const chainx2TestNetNodesSelector = state =>
  state.node.chainx2TestNetNodes.map(node => {
    const isInit = chainx2TestNetInitNodes.some(n => n.url === node.url)
    return { ...node, isInit }
  })
export const currentChainXMainNetNodeSelector = state =>
  state.node.currentChainXMainNetNode
export const currentChainXTestNetNodeSelector = state =>
  state.node.currentChainXTestNetNode
export const currentChainx2TestNetNodeSelector = state =>
  state.node.currentChainX2TestNetNode

export const nodesSelector = createSelector(
  networkSelector,
  chainxMainNetNodesSelector,
  chainxTestNetNodesSelector,
  chainx2TestNetNodesSelector,
  (network, mainNetNodes, testNetNodes, chainx2TestNetNodes) => {
    if (network === chainxNetwork.TEST) {
      return testNetNodes
    } else if (network === chainxNetwork.MAIN) {
      return mainNetNodes
    } else if (network === CHAINX2_TEST) {
      return chainx2TestNetNodes
    }
  }
)

export const currentNodeSelector = createSelector(
  networkSelector,
  currentChainXMainNetNodeSelector,
  currentChainXTestNetNodeSelector,
  currentChainx2TestNetNodeSelector,
  (network, chainxMainNet, chainxTestNet, chainx2TestNet) => {
    if (network === chainxNetwork.TEST) {
      return chainxTestNet
    } else if (network === chainxNetwork.MAIN) {
      return chainxMainNet
    } else if (network === CHAINX2_TEST) {
      return chainx2TestNet
    }
  }
)

export default nodeSlice.reducer
