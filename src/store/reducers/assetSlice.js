import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../../shared/chainx'
import camelcase from 'camelcase'

const camelCaseKey = obj => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[camelcase(key)] = value
    return result
  }, {})
}

const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    assetsInfo: []
  },
  reducers: {
    setInfo(state, action) {
      state.assetsInfo = action.payload
    }
  }
})

export const { setInfo } = assetSlice.actions

export const fetchAssetsInfo = () => async dispatch => {
  const chainx = getChainx()
  await chainx.isRpcReady()
  const { asset } = chainx

  const resp = await asset.getAssets(0, 100)
  const assetsInfo = resp.data.map(item => {
    const details = camelCaseKey(item.details)
    const limitProps = camelCaseKey(item.limitProps)

    return { ...item, details, limitProps }
  })

  dispatch(setInfo(assetsInfo))
}

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const pcxInfoSelector = createSelector(assetsInfoSelector, assets => {
  return assets.find(asset => asset.name === 'PCX')
})

export const pcxPrecisionSelector = createSelector(pcxInfoSelector, pcx => {
  return pcx && pcx.precision
})

export default assetSlice.reducer
