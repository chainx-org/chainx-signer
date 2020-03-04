import fetchFromWs from './fetch'
import store from '../store'
import { chainxNodesSelector, setNodeDelay } from '../store/reducers/nodeSlice'
import { networkSelector } from '../store/reducers/settingSlice'

const TIMEOUT = 10000

const getDelay = async () => {
  const state = store.getState()
  const nodes = chainxNodesSelector(state)
  const chainId = networkSelector(state)

  async function updateNodeDelay(node) {
    try {
      const result = await fetchFromWs({
        url: node.url,
        method: 'system_health',
        timeOut: TIMEOUT
      })

      if (result.data) {
        store.dispatch(
          setNodeDelay({ chainId, url: node.url, delay: result.wastTime })
        )
      }
    } catch (e) {
      console.log('catched', e)
      store.dispatch(setNodeDelay({ chainId, url: node.url, delay: 'timeout' }))
    }
  }

  return Promise.all((nodes || []).map(node => updateNodeDelay(node)))
}

export default getDelay
