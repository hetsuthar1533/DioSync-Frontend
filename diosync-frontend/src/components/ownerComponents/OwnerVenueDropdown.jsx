import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  activeVenueSelector,
  setActiveCostAlert,
  setActiveVenue,
  setVenueData,
  venueDataSelector,
} from '../../redux/slices/ownerVenueSlice'
import SelectType from '../core/formComponents/SelectType'
import { GetVenueDropdownData } from '../../services/barOwnerService'
import { userSelector } from '../../redux/slices/userSlice'

const OwnerVenueDropdown = () => {
  const owner = useSelector(userSelector) //for ownwer
  const venueData = useSelector(venueDataSelector)
  const activeVenue = useSelector(activeVenueSelector)
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])

  useEffect(() => {
    if (!venueData?.length) {
      fetchAllVenues()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner?.id])

  useEffect(() => {
    if (venueData) {
      const resp = venueData?.map((data) => {
        return { label: data?.name, value: data?.id }
      })
      resp && setOptions(resp)
    }
  }, [venueData])

  const fetchAllVenues = async () => {
    if (owner?.id) {
      const response = await GetVenueDropdownData(owner?.id)
      if (response?.data?.data) {
        dispatch(setVenueData(response?.data?.data?.results))
        dispatch(setActiveVenue(response?.data?.data?.results[0]?.id))
        dispatch(setActiveCostAlert(response?.data?.data?.results[0]?.cost_alert))
      }
    }
  }

  return (
    <div>
      <SelectType
        options={options}
        value={options?.find((option) => option?.value === activeVenue) || ''}
        onChange={(option) => {
          dispatch(setActiveVenue(option.value))
        }}
        sm
      ></SelectType>
    </div>
  )
}

export default OwnerVenueDropdown
