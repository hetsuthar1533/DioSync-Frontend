import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetStocksStastics = (queryString) => {
  return axiosGet(`${API.OWNER?.STOCKS}-stockvalue-breakageloss${queryString}`)
}

export const GetStocksByUnits = (queryString) => {
  return axiosGet(`${API.OWNER?.STOCKS}-item-by-unit${queryString}`)
}
export const GetStocksByValue = (queryString) => {
  return axiosGet(`${API.OWNER?.STOCKS}-item-by-value${queryString}`)
}
export const GetStocksSlowMovingItems = (queryString) => {
  return axiosGet(`${API.OWNER?.STOCKS}-slow-moving-item${queryString}`)
}

export const GetAllPageStocksItems = (queryString) => {
  return axiosGet(`${API.OWNER?.STOCKS}-page-item-list${queryString}`)
}
