import { createSlice } from '@reduxjs/toolkit'
import { CHAINS } from './constants'

const chainSlice = createSlice({
  name: 'chain',
  initialState: {
    chain: CHAINS.chainx
  },
  reducers: {
    setChain(state, action) {
      state.chain = action.payload
    }
  }
})

export const chainSelector = state => state.chain.chain

export default chainSlice.reducer
