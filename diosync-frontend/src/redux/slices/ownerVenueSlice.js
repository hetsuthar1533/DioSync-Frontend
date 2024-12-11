import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  venueData: [],
  activeVenue: 0,
  activeVenueCostAlert: 0,
}

export const VenueSlice = createSlice({
  name: 'venue',
  initialState,
  reducers: {
    setVenueData: (state, action) => {
      state.venueData = action.payload
    },

    setActiveVenue: (state, action) => {
      state.activeVenue = Number(action.payload)
    },
    setActiveCostAlert: (state, action) => {
      state.activeVenueCostAlert = Number(action.payload)
    },
  },
})

export const venueDataSelector = (state) => state.venue.venueData

export const activeVenueSelector = (state) => state.venue.activeVenue

export const activeVenueCostAlertSelector = (state) => state.venue.activeVenueCostAlert

export const activeVenueDataSelector = (state) => {
  const resp = state.venue.venueData.find((a) => a.id === state.venue.activeVenue)
  return resp || null
}

const { actions, reducer } = VenueSlice

export const { setVenueData, setActiveVenue, setActiveCostAlert } = actions

export default reducer
