import { createSelector, createSlice } from '@reduxjs/toolkit'
import { getChainx2 } from '@shared/chainx2'

const emptyAsset = {
  Free: '0',
  Locked: '0',
  ReservedDexSpot: '0',
  ReservedWithdrawal: '0',
  ReservedXRC20: '0'
}

const chainx2AssetSlice = createSlice({
  name: 'chainx2Asset',
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

export const { setInfo, setAssets } = chainx2AssetSlice.actions

export const fetchChainx2AssetsInfo = () => async dispatch => {
  const api = getChainx2()
  const assets = await api.rpc.xassets.getAssets()
  const json = assets.toJSON()
  const normalized = Object.keys(json).map(id => {
    return {
      id,
      ...json[id]
    }
  })
  dispatch(setInfo(normalized))
}

export const fetchChainx2Assets = address => async dispatch => {
  const api = getChainx2()
  const assets = await api.rpc.xassets.getAssetsByAccount(address)
  const json = assets.toJSON()
  const normalized = Object.keys(assets.toJSON()).map(id => {
    return {
      id,
      details: json[id]
    }
  })
  dispatch(setAssets(normalized))
}

export const chainx2AssetsInfoSelector = state => state.chainx2Asset.assetsInfo
export const chainx2AssetsSelector = state => state.chainx2Asset.assets

export const normalizedChainx2AssetsSelector = createSelector(
  chainx2AssetsSelector,
  chainx2AssetsInfoSelector,
  (assets, infoArr) => {
    return infoArr.map(({ id, info: { token, precision } }) => {
      const target = assets.find(a => a.id === id)
      const details = target ? target.details : emptyAsset

      const balance = Object.values(details).reduce(
        (sum, value) => sum + parseInt(value),
        0
      )

      return {
        balance,
        token,
        precision
      }
    })
  }
)

export default chainx2AssetSlice.reducer
