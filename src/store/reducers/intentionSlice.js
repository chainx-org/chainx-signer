import { createSlice, createSelector } from '@reduxjs/toolkit'
import { getChainx } from '../../shared/chainx'

const intentionSlice = createSlice({
  name: 'intentions',
  initialState: {
    intentions: []
  },
  reducers: {
    setIntentions(state, action) {
      state.intentions = action.payload
    }
  }
})

export const { setIntentions } = intentionSlice.actions

async function getStake() {
  const chainx = getChainx()
  const { stake } = chainx

  return stake
}

export const fetchIntentions = () => async dispatch => {
  const stake = await getStake()

  const resp = await stake.getIntentionsV1()
  dispatch(setIntentions(resp))
}

export const intentionsSelector = state => {
  return state.intentions.intentions
}

export const intentionAccountNameMapSelector = createSelector(
  intentionsSelector,
  intentions => {
    return (intentions || []).reduce((result, item) => {
      result[item.account] = item.name
      return result
    }, {})
  }
)

export default intentionSlice.reducer
