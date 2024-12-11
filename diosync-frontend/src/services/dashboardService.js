import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetDashboardDetails = () => {
  return axiosGet(API.ADMIN.DASHBOARD)
}

//Owner Dashboard
export const GetDashboardStatistics = (queryString) => {
  return axiosGet(`${API.OWNER.DASHBOARDSTASTICS}${queryString}`)
}

export const GetDashboardLatestUpdates = (queryString) => {
  return axiosGet(`${API.OWNER.DASHBOARDLATESTUPDATES}${queryString}`)
}

export const GetDashboardOrderAlerts = (queryString) => {
  return axiosGet(`${API.OWNER.DASHBOARDORDERALERT}${queryString}`)
}

export const GetDashboardTopSellingItems = (queryString) => {
  return axiosGet(`${API.OWNER.DASHBOARDTOPSELLINGITEMS}${queryString}`)
}

//MultiVenueOwner

export const GetDashboardMultiVenueStatistics = () => {
  return axiosGet(`${API.OWNER.MULTIDASHBOARDSTASTICS}`)
}
export const GetDashboardMultiVenueSalesAnalytics = (queryString) => {
  return axiosGet(`${API.OWNER.MULTISALESGRAPH}${queryString}`)
}
