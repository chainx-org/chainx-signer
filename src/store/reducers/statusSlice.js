import { createSlice } from '@reduxjs/toolkit'

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    loading: false,
    initLoading: true,
    homeLoading: true
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
    }
  }
})

export const {
  setLoading,
  setInitLoading,
  setHomeLoading
} = statusSlice.actions

export default statusSlice.reducer
