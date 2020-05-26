import ChainX from 'chainx.js'

export const instances = new Map()

export const setInstances = urls => {
  for (const url of urls) {
    if (instances.has(url)) {
      continue
    }

    const instance = new ChainX(url)
    instances.set(url, instance)
  }
}

export const removeInstance = url => {
  if (!instances.has(url)) {
    return
  }
  const instance = instances.get(url)
  if (instance.provider.isConnected()) {
    instance.provider.websocket.close()
  }

  const deleted = instances.delete(url)
  console.log(
    deleted
      ? `chainx instance for ${url} been deleted`
      : `No chainx instance for ${url}`
  )
}
