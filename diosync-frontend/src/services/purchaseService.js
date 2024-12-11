import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetPurchaseAlert = (queryString) => {
  return axiosGet(`${API.OWNER.PURCHASE}-alert${queryString}`)
}

export const GetPurchaseGraph = (queryString) => {
  return axiosGet(`${API.OWNER.PURCHASE}-value-history${queryString}`)
}

export const GetMostPurchasedCategories = (queryString) => {
  return axiosGet(`${API.OWNER.PURCHASE}-most-on-category${queryString}`)
}

export const GetMostPurchasedProducts = (queryString) => {
  return axiosGet(`${API.OWNER.PURCHASE}-most-on-product${queryString}`)
}
export const GetMostPurchaseExpenditure = (queryString) => {
  return axiosGet(`${API.OWNER.PURCHASE}-expenditure${queryString}`)
}
export const GetAllPurchaseList = (queryString) => {
  return axiosGet(`${API.OWNER.PURCHASE}-list${queryString}`)
}
