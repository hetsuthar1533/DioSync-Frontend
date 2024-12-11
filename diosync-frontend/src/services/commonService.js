import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost } from '../axios/axiosMiddleware'

export const GetAllStates = () => {
  return axiosGet(`${API.ADMIN.STATES}`)
}
export const GetAllCities = () => {
  return axiosGet(`${API.ADMIN.CITIES}`)
}

export const GetAllCountriesCode = () => {
  return axiosGet(`${API.ADMIN.COUNTRIESCODE}`)
}

export const GetAllCountries = () => {
  return axiosGet(`${API.ADMIN.COUNTRIES}`)
}

export const BulkPerformAction = (data) => {
  return axiosPost(`${API.ADMIN.BULK}`, data)
}

export const GetTimezone = () => {
  return axiosGet(`${API.ADMIN.TIMEZONE}`)
}
export const GetGeneralData = (queryString) => {
  return axiosGet(`${API.OWNER.GENERALDATA}${queryString}`)
}

export const GetTrustIndicator = (queryString) => {
  return axiosGet(`${API.OWNER.TRUSTINDICATOR}${queryString}`)
}

export const GetAdminGeneralData = () => {
  return axiosGet(`${API.ADMIN.GENERALDATA}`)
}
