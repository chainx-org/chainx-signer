import { getCurrentChainxNode } from '../../messaging'
import { createSlice } from '@reduxjs/toolkit'
import { setChainx } from '../../shared/chainx'

const intentionSlice = createSlice({
  name: 'intentions',
  initialState: {
    intentions: {}
  },
  reducers: {
    setIntentions: {
      reducer(state, action) {
        state.intentions = action.payload
      }
    }
  }
})

export const { setIntentions } = intentionSlice.actions

async function getStake(isTestNet) {
  const node = await getCurrentChainxNode(isTestNet)
  const chainx = await setChainx(node.url)
  await chainx.isRpcReady()
  const { stake } = chainx

  return stake
}

export const fetchIntentions = isTestNet => async dispatch => {
  const stake = await getStake(isTestNet)

  const resp = await stake.getIntentions()
  const result = {}
  resp.forEach(item => {
    result[item.account] = item.name
  })
  dispatch(setIntentions(result))
}

export const intentionsSelector = state => {
  return state.intentions.intentions
}

export default intentionSlice.reducer
