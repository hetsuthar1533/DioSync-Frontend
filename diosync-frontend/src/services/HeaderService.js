import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetNotifications = (queryString) => {
  return axiosGet(`${API.OWNER.NOTIFICATIONS}${queryString}`)
}

export const GetCarts = (queryString) => {
  return axiosGet(`${API.OWNER.CARTDATA}${queryString}`)
}
