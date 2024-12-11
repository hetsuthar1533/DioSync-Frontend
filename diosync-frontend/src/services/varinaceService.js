import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetVarinaceStastics = (queryString) => {
  return axiosGet(`${API.OWNER?.VARINACES}-averagevariance-variancecost${queryString}`)
}
export const GetVarinaceGraph = (queryString) => {
  return axiosGet(`${API.OWNER?.VARINACES}-cost-graph${queryString}`)
}
export const GetVarinaceAlertUpdates = () => {
  return axiosGet(`${API.OWNER?.VARINACES}-alert`)
}

export const GetVarinaceInAmount = (queryString) => {
  return axiosGet(`${API.OWNER?.VARINACES}-item-amout${queryString}`)
}
export const GetVarinaceInCl = (queryString) => {
  return axiosGet(`${API.OWNER?.VARINACES}-item-oncl${queryString}`)
}
export const GetVarinacePageData = (queryString) => {
  return axiosGet(`${API.OWNER?.VARINACES}-page-item-list${queryString}`)
}

// /bar-owner/variances-averagevariance-variancecost
// /bar-owner/variances-cost-graph
// /bar-owner/variances-item-amout
// /bar-owner/variances-item-oncl
// /bar-owner/variances-page-item-list
