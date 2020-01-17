import { createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../../shared/chainx'

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    pairs: {},
    fee: 0
  },
  reducers: {
    setPairs: (state, action) => {
      state.pairs = action.payload
    },
    setFee: (state, action) => {
      state.fee = action.payload
    }
  }
})

export const { setPairs, setFee } = tradeSlice.actions

export const fetchTradePairs = () => async dispatch => {
  const chainx = getChainx()

  const { trade } = chainx

  const pairs = await trade.getTradingPairs()
  const result = {}
  pairs.forEach(item => {
    result[item.id] = item
  })
  dispatch(setPairs(result))
}

export const fetchFee = () => async dispatch => {
  const chainx = getChainx()

  const { asset } = chainx

  const resp = await asset.getWithdrawalLimitByToken(['BTC'])
  dispatch(setFee(resp.fee))
}

export const feeSelector = state => state.trade.fee
export const pairsSelector = state => state.trade.pairs

export default tradeSlice.reducer
