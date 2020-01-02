import ApiService from './ApiService'

export let service

// 就是LowLevelSocketService
export function setService(s) {
  service = s
}

export const handleApiResponse = async (request, id) => {
  // @todo 校验 appkey。校验 nonce
  await new ApiService(service, request, id).handle()
}

export const handlePairedResponse = async (request, id) => {
  // TODO: 外部dapp请求连接，打开确认框让用户确认
  return await service.emit(request.data.origin, id, 'paired', true)
}
