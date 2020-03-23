import store from '../store'
import { chainxNodesSelector, setNodeDelay } from '../store/reducers/nodeSlice'
import { networkSelector } from '../store/reducers/settingSlice'
import { instances } from './chainxInstances'
import { sleep } from './chainx'

const TIMEOUT = 10000

const getDelay = async () => {
  const state = store.getState()
  const nodes = chainxNodesSelector(state)
  const chainId = networkSelector(state)

  async function updateNodeDelay(node) {
    const instance = instances.get(node.url)
    if (!instance) {
      return
    }

    let delay
    try {
      delay = await testNet(instance)
    } catch (e) {
      console.log('e', e)
      delay = 'timeout'
    }
    store.dispatch(setNodeDelay({ chainId, url: node.url, delay }))
  }

  return Promise.all((nodes || []).map(node => updateNodeDelay(node)))
}

const fetchInstanceTime = async instance => {
  const startTime = Date.now()
  await instance.chain.api.rpc.system.chain()
  const endTime = Date.now()

  return endTime - startTime
}

const testNet = async instance => {
  const result = await Promise.race([
    fetchInstanceTime(instance),
    sleep(TIMEOUT)
  ])
  return typeof result === 'number' ? result : 'timeout'
}

export default getDelay
