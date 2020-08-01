import { createSlice, createSelector } from '@reduxjs/toolkit'

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    appVersion: '0.0.0',
    latestVersion: {
      version: '0.0.0',
      forceUpdate: false,
      path: 'https://github.com/chainx-org/chainx-signer/releases'
    },
    loading: false,
    initLoading: true,
    homeLoading: true,
    showAccountMenu: false,
    showNodeMenu: false,
    showAccountAction: false,
    fetchAssetLoading: false,
    showImportMenu: false,
    importedKeystore: null
  },
  reducers: {
    setAppVersion: (state, action) => {
      state.appVersion = action.payload
    },
    setLatestVersion: (state, action) => {
      state.latestVersion = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setInitLoading: (state, action) => {
      state.initLoading = action.payload
    },
    setHomeLoading: (state, action) => {
      state.homeLoading = action.payload
    },
    setShowAccountMenu: (state, action) => {
      state.showAccountMenu = action.payload
    },
    setShowNodeMenu: (state, action) => {
      state.showNodeMenu = action.payload
    },
    setShowAccountAction: (state, action) => {
      state.showAccountAction = action.payload
    },
    setFetchAssetLoading: (state, { payload }) => {
      state.fetchAssetLoading = payload
    },
    setShowImportMenu: (state, { payload }) => {
      state.showImportMenu = payload
    },
    setImportedKeystore(state, { payload }) {
      state.importedKeystore = payload
    }
  }
})

export const {
  setAppVersion,
  setLatestVersion,
  setLoading,
  setInitLoading,
  setHomeLoading,
  setShowAccountMenu,
  setShowNodeMenu,
  setShowAccountAction,
  setFetchAssetLoading,
  setShowImportMenu,
  setImportedKeystore
} = statusSlice.actions

export const importedKeystoreSelector = state => state.status.importedKeystore
export const showImportMenuSelector = state => state.status.showImportMenu
export const showAccountMenuSelector = state => state.status.showAccountMenu
export const showNodeMenuSelector = state => state.status.showNodeMenu
export const showAccountActionSelector = state => state.status.showAccountAction
export const appVersionSelector = state => state.status.appVersion
export const latestVersionSelector = state => state.status.latestVersion
export const fetchAssetLoadingSelector = state => state.status.fetchAssetLoading
export const updateInfoSelector = createSelector(
  latestVersionSelector,
  appVersionSelector,
  (latestVersion, appVersion) => {
    if (window.versionLte(latestVersion.version, appVersion)) {
      return {
        hasNewVersion: false
      }
    }

    return {
      hasNewVersion: true,
      versionInfo: {
        ...latestVersion
      }
    }
  }
)
export const forceUpdateSelector = createSelector(
  updateInfoSelector,
  updateInfo => {
    return updateInfo.hasNewVersion && updateInfo?.versionInfo?.forceUpdate
  }
)

export default statusSlice.reducer
