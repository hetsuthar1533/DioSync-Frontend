import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetDashboardSalesGraph = (queryString) => {
  return axiosGet(`${API.OWNER.SALES}-value-graph${queryString}`)
}
export const GetSalesStastics = (queryString) => {
  return axiosGet(`${API.OWNER.SALES}-count-data${queryString}`)
}

export const GetSalesGraph = (queryString) => {
  return axiosGet(`${API.OWNER.SALES}-overview-graph${queryString}`)
}
export const GetSalesValueGraph = (queryString) => {
  return axiosGet(`${API.OWNER.SALES}-value-graph${queryString}`)
}

export const GetTopSellingRecipes = (queryString) => {
  return axiosGet(`${API.OWNER.TOPSELLINGRECIPES}${queryString}`)
}

export const GetTopSellingLiqours = (queryString) => {
  return axiosGet(`${API.OWNER.TOPSELLINGLIQUORS}${queryString}`)
}

export const GetAllSalesItemsList = (queryString) => {
  return axiosGet(`${API.OWNER.SALES}-item-list${queryString}`)
}
