import { getChainx2Instances } from '@shared/chainx2Instances'

let instance = null

export const setChainx2 = async nodeUrl => {
  instance = getChainx2Instances().get(nodeUrl)
  if (!instance) {
    throw new Error('Can not find target ChainX2 instance')
  }

  await instance.api.isReady
  return instance
}

export const getChainx2 = () => (instance || {}).api
