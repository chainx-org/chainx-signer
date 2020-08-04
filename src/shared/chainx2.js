import { getChainx2Instances } from '@shared/chainx2Instances'

let chainx2 = null

export const setChainx2 = async nodeUrl => {
  const instance = getChainx2Instances().get(nodeUrl)
  if (!instance) {
    throw new Error('Can not find target ChainX2 instance')
  }

  await instance.isReady
  return instance
}

export const getChainx2 = () => chainx2
