import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetCostChangesStastics = (queryString) => {
  return axiosGet(`${API.OWNER?.COSTCHANGES}-value-costchange${queryString}`)
}

export const GetCostChangesAlertAndUpdates = (queryString) => {
  return axiosGet(`${API.OWNER.COSTCHANGES}-alert${queryString}`)
}

export const GetCostChangesGraph = (queryString) => {
  return axiosGet(`${API.OWNER.COSTCHANGES}-status-graph${queryString}`)
}

export const GetMostInflatedItems = (queryString) => {
  return axiosGet(`${API.OWNER.COSTCHANGES}-most-inflated${queryString}`)
}

export const GetAllCostItemList = (queryString) => {
  return axiosGet(`${API.OWNER.COSTCHANGES}-item-list${queryString}`)
}
