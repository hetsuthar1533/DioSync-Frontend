import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

const initialState = {
  message: null,
  type: null,
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    ToastShow: (state, action) => {
      state.message = action.payload.message
      state.type = action.payload.type
    },
  },
})

const selectToast = (state) => state.toast

export const toastSelector = createSelector([selectToast], (toast) => ({
  message: toast.message,
  type: toast.type,
}))

const { actions, reducer } = toastSlice

export const { ToastShow } = actions

export default reducer
