import { createSelector, createSlice } from '@reduxjs/toolkit'
import {
  CHAINX2_TEST,
  CHAINX_MAIN,
  CHAINX_TEST,
  events,
  SETTING_STORE_KEY
} from './constants'

export const chainxNetwork = {
  MAIN: CHAINX_MAIN,
  TEST: CHAINX_TEST
}

const defaultSettingInitialState = {
  version: 0,
  network: CHAINX2_TEST
  // network: CHAINX_MAIN,
  // network: CHAINX_TEST,
}

let initialState =
  window.settingStore.get(SETTING_STORE_KEY) || defaultSettingInitialState

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setNetwork(state, { payload }) {
      const pre = state.network
      state.network = payload
      window.settingStore.set(SETTING_STORE_KEY, state)

      if (pre !== payload) {
        window.sockets.broadcastEvent(events.NETWORK_CHANGE, {
          from: pre,
          to: payload
        })
      }
    }
  }
})

export const { setNetwork } = settingSlice.actions
export const networkSelector = state => state.setting.network

export const isTestNetSelector = createSelector(networkSelector, network => {
  return network === chainxNetwork.TEST
})

export const chainNameSelector = createSelector(networkSelector, chain => {
  switch (chain) {
    case CHAINX2_TEST:
      return 'ChainX2 testnet'
    case CHAINX_MAIN:
      return 'ChainX mainnet'
    case CHAINX_TEST:
      return 'ChainX testnet'
    default:
      return ''
  }
})

export default settingSlice.reducer
