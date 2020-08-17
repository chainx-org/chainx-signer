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
    nativeTokenInfo: {
      ss58Format: 42,
      tokenDecimals: 8,
      tokenSymbol: 'PCX'
    },
    nativeAsset: {
      free: '0',
      reserved: '0',
      miscFrozen: '0',
      feeFrozen: '0'
    },
    assetsInfo: [],
    assets: []
  },
  reducers: {
    setInfo(state, action) {
      state.assetsInfo = action.payload
    },
    setAssets(state, action) {
      state.assets = action.payload
    },
    setNativeAsset(state, action) {
      state.nativeAsset = action.payload
    },
    setNativeTokenInfo(state, action) {
      state.nativeTokenInfo = action.payload
    }
  }
})

export const {
  setInfo,
  setAssets,
  setNativeAsset,
  setNativeTokenInfo
} = chainx2AssetSlice.actions

export const fetchChainx2NativeAssetInfo = () => async dispatch => {
  const api = getChainx2()
  const systemProperties = await api.rpc.system.properties()
  dispatch(setNativeTokenInfo(systemProperties.toJSON()))
}

export const fetchChainx2NativeAsset = address => async dispatch => {
  const api = getChainx2()
  const asset = await api.query.system.account(address)
  let nativeAsset = {}
  for (let [key, value] of asset.data.entries()) {
    nativeAsset[key] = value.toString()
  }

  dispatch(setNativeAsset(nativeAsset))
}

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
export const chainx2NativeAssetSelector = state =>
  state.chainx2Asset.nativeAsset
export const chainx2NativeTokenInfoSelector = state =>
  state.chainx2Asset.nativeTokenInfo

export const normalizedChainx2NativeAssetSelector = createSelector(
  chainx2NativeTokenInfoSelector,
  chainx2NativeAssetSelector,
  (info, asset) => {
    return {
      data: asset,
      precision: info.tokenDecimals,
      token: info.tokenSymbol
    }
  }
)

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
