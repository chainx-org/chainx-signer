const { ApiPromise, WsProvider } = require('@polkadot/api')
const { options } = require('@chainx-v2/api')
const instances = new Map()

export function getChainx2Instances() {
  return instances
}

export const setChainx2Instances = urls => {
  for (const url of urls) {
    if (instances.has(url)) {
      continue
    }

    const wsProvider = new WsProvider(url)
    const api = new ApiPromise(options({ provider: wsProvider }))
    instances.set(url, { api, provider: wsProvider })
  }
}

export const removeChainx2Instance = url => {
  if (!instances.has(url)) {
    return
  }

  const { provider } = instances.get(url)
  provider.disconnect()
  const deleted = instances.delete(url)

  console.log(
    deleted
      ? `chainx2 instance for ${url} been deleted`
      : `deletion of chainx2 instance for ${url} failed`
  )
}
