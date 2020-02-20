import { createSlice } from '@reduxjs/toolkit'

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false,
    initLoading: true,
    homeLoading: true,
    showAccountMenu: false
  },
  reducers: {
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
    }
  }
})

export const {
  setLoading,
  setInitLoading,
  setHomeLoading,
  setShowAccountMenu
} = statusSlice.actions

export const showAccountMenuSelector = state => state.status.showAccountMenu

export default statusSlice.reducer
