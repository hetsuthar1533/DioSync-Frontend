import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  toggle: false,
}

export const siteLoaderSlice = createSlice({
  name: 'siteLoader',
  initialState,
  reducers: {
    showLoader: (state) => {
      state.toggle = true
    },
    hideLoader: (state) => {
      state.toggle = false
    },
  },
})

export const siteLoaderSelector = (state) => {
  return state.siteLoader.toggle
}

const { actions, reducer } = siteLoaderSlice

export const { showLoader, hideLoader } = actions

export default reducer
