import { createSlice } from '@reduxjs/toolkit'

const mockToSign = {
  origin: '',
  id: 'test',
  dataId: '',
  address: '5Fe4i2nqi1yPaMowBmjYKb7eRmRYgSE4QAgpxJq1kaGdvQL8',
  data:
    '0xdc010803ff9e25fd5dc4cc26f921ad805ef234217dbde234910b526f0434f576d8ad2d77830c50435800e1f5050000000018e598bbe598bb'
}

const initialState = {
  version: 0,
  // toSign: null,
  toSign: mockToSign
}

const txSlice = createSlice({
  name: 'tx',
  initialState,
  reducers: {
    setToSign(state, { payload }) {
      state.toSign = payload
    },
    clearToSign(state) {
      // TODO: 切换网络是清掉toSign
      state.toSign = null
    }
  }
})

export const { setToSign, clearToSign } = txSlice.actions

export const toSignSelector = state => state.tx.toSign

export default txSlice.reducer
