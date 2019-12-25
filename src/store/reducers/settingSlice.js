import { createSlice } from '@reduxjs/toolkit'
import { SETTING_STORE_KEY } from './constants'

export const chainxNetwork = {
  MAIN: 'mainnet',
  TEST: 'testnet'
}

const defaultSettingInitialState = {
  version: 0,
  network: chainxNetwork.MAIN
}

let initialState =
  window.settingStore.get(SETTING_STORE_KEY) || defaultSettingInitialState

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setNetwork(state, { payload }) {
      state.network = payload
      // TODO: 改变网络后通知连接的dapps
    }
  }
})

export const { setNetwork } = settingSlice.actions
export const networkSelector = state => state.setting.network

export default settingSlice.reducer
