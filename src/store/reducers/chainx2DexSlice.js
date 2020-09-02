import { createSlice } from '@reduxjs/toolkit'
import { getChainx2 } from '@shared/chainx2'

const chainx2DexSlice = createSlice({
  name: 'chainx2Dex',
  initialState: {
    pairs: []
  },
  reducers: {
    setPairs: (state, { payload }) => {
      state.pairs = payload
    }
  }
})

export const fetchChainx2TradePairs = () => async dispatch => {
  const api = getChainx2()
  const pairs = await api.rpc.xspot.getTradingPairs()
  dispatch(setPairs(pairs.toJSON()))
}

export const { setPairs } = chainx2DexSlice.actions

export const pairsSelector = state => state.chainx2Dex.pairs

export default chainx2DexSlice.reducer
