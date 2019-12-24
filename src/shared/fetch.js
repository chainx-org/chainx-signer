const fetchFromWs = ({ url, method, params = [], timeOut = 5000 }) => {
  const id = Number(
    Date.now() +
      Math.random()
        .toString()
        .substr(2, 3)
  ).toString(36)
  const message = JSON.stringify({ id, jsonrpc: '2.0', method, params })
  let startTime
  let endTime
  const request = () =>
    new Promise((resolve, reject) => {
      const ws = new WebSocket(url)
      ws.onmessage = m => {
        try {
          const data = JSON.parse(m.data)
          if (data.id === id) {
            endTime = Date.now()
            resolve({
              data: data.result,
              wastTime: endTime - startTime
            })
            ws.close()
          }
        } catch (err) {
          reject(err)
        }
      }
      ws.onopen = () => {
        startTime = Date.now()
        ws.send(message)
      }
      ws.onerror = err => {
        ws.close()
        reject(err)
      }
    })
  if (timeOut) {
    return Promise.race([
      request(),
      new Promise((resovle, reject) => {
        setTimeout(() => {
          reject('请求超时')
        }, timeOut)
      })
    ])
  } else {
    return request()
  }
}

export default fetchFromWs
