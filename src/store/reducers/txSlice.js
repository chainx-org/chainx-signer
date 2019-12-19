import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  version: 0,
  toSign: null
}

const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setToSign(state, { payload: { address, data, isTestNet } }) {
      state.toSign = { address, data, isTestNet }
    },
    clearToSign(state) {
      // TODO: 切换网络是清掉toSign
      state.toSign = null
    }
  }
})

export const { setToSign, clearToSign } = txSlice.actions

export default txSlice.reducer
