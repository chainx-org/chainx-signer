import { getCurrentChainxNode } from '../../messaging'
import { createSlice } from '@reduxjs/toolkit'
import { setChainx } from '../../shared/chainx'

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

export const fetchTradePairs = isTestNet => async dispatch => {
  const node = await getCurrentChainxNode(isTestNet)
  const chainx = await setChainx(node.url)
  await chainx.isRpcReady()

  const { trade } = chainx

  const pairs = await trade.getTradingPairs()
  const result = {}
  pairs.forEach(item => {
    result[item.id] = item
  })
  dispatch(setPairs(result))
}

export const fetchFee = isTestNet => async dispatch => {
  const node = await getCurrentChainxNode(isTestNet)
  const chainx = await setChainx(node.url)
  await chainx.isRpcReady()

  const { asset } = chainx

  const resp = await asset.getWithdrawalLimitByToken(['BTC'])
  dispatch(setFee(resp.fee))
}

export const feeSelector = state => state.trade.fee
export const pairsSelector = state => state.trade.pairs

export default tradeSlice.reducer
