import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx } from '../../shared/chainx'
import camelcase from 'camelcase'
import { setFetchAssetLoading } from './statusSlice'

const emptyAsset = {
  details: {
    Free: 0,
    ReservedCurrency: 0,
    ReservedDexFuture: 0,
    ReservedDexSpot: 0,
    ReservedStaking: 0,
    ReservedStakingRevocation: 0,
    ReservedWithdrawal: 0
  }
}

const camelCaseKey = obj => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[camelcase(key)] = value
    return result
  }, {})
}

const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    assetsInfo: [],
    assets: []
  },
  reducers: {
    setInfo(state, action) {
      state.assetsInfo = action.payload
    },
    setAssets(state, action) {
      state.assets = action.payload
    }
  }
})

export const { setInfo, setAssets } = assetSlice.actions

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

export const fetchAccountAssets = (
  address,
  loading = false
) => async dispatch => {
  if (loading) {
    dispatch(setFetchAssetLoading(true))
  }

  try {
    const chainx = getChainx()
    await chainx.isRpcReady()
    const { asset } = chainx

    if (!address) {
      return
    }

    const { data } = await asset.getAssetsByAccount(address, 0, 100)
    ;['PCX', 'BTC', 'L-BTC', 'SDOT'].forEach(token => {
      if (!data.find(asset => asset.name === token)) {
        data.push({
          name: token,
          ...emptyAsset
        })
      }
    })

    const assets = data.map(item => {
      return { name: item.name, details: camelCaseKey(item.details) }
    })

    dispatch(setAssets(assets))
  } finally {
    dispatch(setFetchAssetLoading(false))
  }
}

export const assetsInfoSelector = state => {
  return state.assets.assetsInfo
}

export const assetsSelector = state => {
  return state.assets.assets
}

export const normalizedAssetsSelector = createSelector(
  assetsSelector,
  assetsInfoSelector,
  (assets, infoArr) => {
    return assets.map(asset => {
      const info = infoArr.find(info => info.name === asset.name)

      return {
        ...asset,
        precision: info?.precision
      }
    })
  }
)

export const pcxInfoSelector = createSelector(assetsInfoSelector, assets => {
  return assets.find(asset => asset.name === 'PCX')
})

export const pcxPrecisionSelector = createSelector(pcxInfoSelector, pcx => {
  return pcx ? pcx.precision : 8
})

export default assetSlice.reducer
