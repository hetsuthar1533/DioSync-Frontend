import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetReports = (queryString) => {
  return axiosGet(`${API.ADMIN.REPORTS}${queryString}`)
}

export const GetCSVReports = (queryString) => {
  return axiosGet(`${API.ADMIN.REPORTSCSV}${queryString}`)
}

export const GetCSVReportsUsingFilter = (queryString) => {
  return axiosGet(`${API.ADMIN.REPORTSFILTER}${queryString}`)
}
