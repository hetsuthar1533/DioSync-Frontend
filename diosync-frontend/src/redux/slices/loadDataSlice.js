import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  refresh: false,
}

export const loadDataSlice = createSlice({
  name: 'loadData',
  initialState,
  reducers: {
    showData: (state) => {
      state.refresh = true
    },
    hideData: (state) => {
      state.refresh = false
    },
  },
})

export const loadDataSelector = (state) => {
  return state.loadData.refresh
}

const { actions, reducer } = loadDataSlice

export const { showData, hideData } = actions

export default reducer
