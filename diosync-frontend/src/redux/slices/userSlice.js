import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: null,
  refreshToken: null,
  user_Type: 1,
  user: null,
  email:null
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload 
    },
    setUserType: (state, action) => {
      state.user_Type = action.payload ? action.payload : 1
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload
    },
    removeUser: (state) => {
      state.user = null
    },
    removeToken: (state) => {
      state.token = null
    },
    removeRefreshToken: (state) => {
      state.refreshToken = null
    },
    removeUserType: (state) => {
      state.user_Type = null
    },
    clearUser: (state) => {
      state.user = null
      state.token = null
      state.user_Type = null
      state.refreshToken = null
      state.email = null
    },
  },
})

export const userSelector = (state) => state.user.user
export const userTypeSelector = (state) => state.user.user_Type
export const tokenSelector = (state) => state.user.token
export const refreshTokenSelector = (state) => state.user.refreshToken
export const emailSelector = (state) => state.user.email
console.log((state) => state.user.email)
const { actions, reducer } = userSlice

export const {
  setUser,
  setToken,
  setRefreshToken,
  setUserType,
  removeToken,
  removeRefreshToken,
  removeUserType,
  removeUser,
  clearUser,
  setEmail
} = actions
export const setuser = (data) => {
  setUser(data)
}
export const settoken = (data) => {
  setToken(data)
}
export default reducer
