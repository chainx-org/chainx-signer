import WebSocket from 'isomorphic-ws'

const suffix = '/socket.io/?EIO=3&transport=websocket'

export const getHostname = port => {
  return `127.0.0.1:${port}`
}

export async function findTargetPort() {
  const startingPort = 10013
  const iterStep = 133
  const maxPort = 65535

  let iterPort = startingPort
  while (iterPort < maxPort) {
    const host = `http://${getHostname(iterPort)}`
    try {
      const res = await fetch(host)
      const text = await res.text()
      if (text === 'chainx') {
        return iterPort
      }
    } catch (e) {
      console.log(`port ${iterPort} failed, try to test another port`)
    }

    iterPort += iterStep
  }

  return null
}

export const trySocket = port =>
  new Promise(socketResolver => {
    const hostname = getHostname(port)
    const protocol = 'ws://'
    const s = new WebSocket(`${protocol}${hostname}${suffix}`)

    s.onerror = () => socketResolver(false)
    s.onopen = () => socketResolver(s)
  })
