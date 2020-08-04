import store from '@store/index'
import { getChainx2Instances } from '@shared/chainx2Instances'
import { sleep } from '@shared/chainx'
import {
  chainx2TestNetNodesSelector,
  setNodeDelay
} from '@store/reducers/nodeSlice'
import { CHAINX2_TEST } from '@store/reducers/constants'

const TIMEOUT = 10000

async function updateNodeDelay(chainId, node) {
  const instance = getChainx2Instances().get(node.url)
  if (!instance) {
    return
  }

  let delay
  try {
    delay = await testNet(instance)
  } catch (e) {
    console.error('e', e)
    delay = 'timeout'
  }

  store.dispatch(setNodeDelay({ chainId, url: node.url, delay }))
}

const testNet = async instance => {
  const result = await Promise.race([
    fetchInstanceTime(instance),
    sleep(TIMEOUT)
  ])
  return typeof result === 'number' ? result : 'timeout'
}

const fetchInstanceTime = async instance => {
  const startTime = Date.now()
  await instance.api.rpc.system.properties()
  const endTime = Date.now()

  return endTime - startTime
}

export default async function updateChainx2NodesDelay() {
  const state = store.getState()
  const nodes = chainx2TestNetNodesSelector(state)
  return Promise.all(
    (nodes || []).map(node => updateNodeDelay(CHAINX2_TEST, node))
  )
}
