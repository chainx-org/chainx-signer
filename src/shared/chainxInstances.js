import ChainX from 'chainx.js'

export const instances = new Map()

export const setInstances = urls => {
  for (const url of urls) {
    if (instances.has(url)) {
      continue
    }

    instances.set(url, new ChainX(url))
  }
}

export const removeInstance = url => {
  const deleted = instances.delete(url)
  console.log(
    deleted
      ? `chainx instance for ${url} been deleted`
      : `No chainx instance for ${url}`
  )
}
