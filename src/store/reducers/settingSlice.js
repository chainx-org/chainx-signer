import { createSlice } from '@reduxjs/toolkit'
import { CHAINX_MAIN, CHAINX_TEST, SETTING_STORE_KEY } from './constants'

export const chainxNetwork = {
  MAIN: CHAINX_MAIN,
  TEST: CHAINX_TEST
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
      window.settingStore.set(SETTING_STORE_KEY, state)
      // TODO: 改变网络后通知连接的dapps
    }
  }
})

export const { setNetwork } = settingSlice.actions
export const networkSelector = state => state.setting.network

export default settingSlice.reducer
