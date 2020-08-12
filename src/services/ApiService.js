import store from '../store'
import _ from 'lodash'
import { codes } from '../error'
import {
  chainx2ToSignSelector,
  setToSign,
  toSignSelector
} from '../store/reducers/txSlice'
import { Extrinsic } from '@chainx/types'
import { methods } from '../constants'
import { currentNodeSelector } from '@store/reducers/nodeSlice'
import { currentAccountSelector } from '@store/reducers/accountSlice'
import { networkSelector } from '@store/reducers/settingSlice'
import { CHAINX2_TEST } from '@store/reducers/constants'

function getAccount() {
  const state = store.getState()
  const account = currentAccountSelector(state)
  return {
    result: account ? _.pick(account, ['name', 'address']) : account
  }
}

function getNode() {
  const state = store.getState()
  const node = currentNodeSelector(state)
  return {
    result: node
  }
}

function getSettings() {
  const state = store.getState()
  const settings = state.setting

  return {
    result: settings
  }
}

const type = 'api'
export default class ApiService {
  constructor(sockets, request, id) {
    this.sockets = sockets // 就是LowLevelSocketService
    this.request = request
    this.id = id
  }

  async handle() {
    const data = this.request.data.payload

    if (!data.method) {
      return this.sockets.emit(this.request.data.origin, this.id, type, {
        id: data.id,
        error: {
          code: -1,
          message: 'method not found'
        }
      })
    }

    switch (data.method) {
      case methods.getSettings:
        return this.emit(getSettings())
      case methods.getAccount:
        return this.emit(getAccount())
      case methods.getNode:
        return this.emit(getNode())
      case methods.signAndSendChainXExtrinsic: {
        return this.sign(data.id, ...data.params, true)
      }
      case methods.signChainxExtrinsic: {
        return this.sign(data.id, ...data.params, false)
      }
      default: {
        return {
          error: {
            code: -1,
            message: `${data.method} not found`
          }
        }
      }
    }
  }

  emit(data) {
    this.sockets.emit(this.request.data.origin, this.id, type, {
      id: this.request.data.payload.id,
      ...data
    })
  }

  async sign(id, from, data, needBroadcast) {
    const state = store.getState()
    const currentAccount = currentAccountSelector(state)
    if (!currentAccount || currentAccount.address !== from) {
      this.emit({
        error: {
          code: codes.INVALID_ADDRESS,
          message: `${from} not found`
        }
      })
    }

    if (!from || !data) {
      return this.emit({
        error: {
          code: codes.INVALID_SIGN_DATA,
          message: 'invalid sign params'
        }
      })
    }

    const chainx2ToSign = chainx2ToSignSelector(state)
    const chainxToSign = toSignSelector(state)
    const chainId = networkSelector(state)
    const hasToSign = [CHAINX2_TEST].includes(chainId)
      ? !!chainx2ToSign
      : !!chainxToSign
    if (hasToSign) {
      return this.emit({
        error: {
          code: codes.SIGN_BUSY,
          message: 'sign busy'
        }
      })
    }

    try {
      new Extrinsic(data)
    } catch (e) {
      return this.emit({
        error: {
          code: codes.INVALID_SIGN_DATA,
          message: 'invalid sign data'
        }
      })
    }

    store.dispatch(
      setToSign({
        origin: this.request.data.origin,
        id: this.id,
        dataId: id,
        address: from,
        data,
        needBroadcast: !!needBroadcast
      })
    )

    this.sockets.activateWindow()
  }
}
