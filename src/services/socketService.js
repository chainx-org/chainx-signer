import ApiService from './ApiService'

let service

const emit = (origin, id, path, data) => service.emit(origin, id, path, data)

export const handleApiResponse = async (request, id) => {
  // @todo 校验 appkey。校验 nonce
  const payload = request.data.payload

  const resp = await ApiService.handler(request.data.payload)

  return emit(payload.origin, id, 'api', {
    id: payload.id,
    ...resp
  })
}

export const handlePairedResponse = async (request, id) => {
  return await emit(request.data.origin, id, 'paired', true)
}

export class SocketService {
  static init(_service) {
    service = _service
  }

  static async initialize() {
    return service.initialize()
  }

  static async close() {
    return service.close()
  }

  static sendEvent(event, payload, origin) {
    return service.sendEvent(event, payload, origin)
  }

  static broadcastEvent(event, payload) {
    return service.broadcastEvent(event, payload)
  }
}
