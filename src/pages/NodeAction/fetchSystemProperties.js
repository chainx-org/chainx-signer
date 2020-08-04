export default function(url) {
  const id = Number(
    Date.now() +
      Math.random()
        .toString()
        .substr(2, 3)
  ).toString(36)

  const requestMsg = JSON.stringify({
    id,
    jsonrpc: '2.0',
    method: 'system_properties',
    params: []
  })

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)

    ws.onopen = () => {
      ws.send(requestMsg)
    }

    ws.onmessage = res => {
      const data = JSON.parse(res.data)
      if (data.id !== id) {
        return
      }

      resolve({ data: data.result })
      ws.close()
    }

    ws.onerror = err => {
      reject({ err })
      ws.close()
    }
  })
}
