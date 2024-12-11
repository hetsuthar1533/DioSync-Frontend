import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  generalData: {},
}

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setGeneral: (state, action) => {
      state.generalData = action.payload
    },
  },
})

export const generalDataSelector = (state) => state.generalData

const { actions, reducer } = generalSlice

export const { setGeneral } = actions

export default reducer
