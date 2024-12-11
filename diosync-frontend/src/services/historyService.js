import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetHistoryInventory = (bar_venue_id, queryString) => {
  return axiosGet(`${API.OWNER.HISTORYINVENTORY}/${bar_venue_id}${queryString}`)
}

export const GetAllHistoryType = () => {
  return axiosGet(`${API.OWNER.HISTORY}/history-type`)
}

export const GetAllHistoryOrders = (bar_venue_id, queryString) => {
  return axiosGet(`${API.OWNER.HISTORY}/orders/${bar_venue_id}${queryString}`)
}

export const GetOrderDetailById = (orderId, unique_order_id) => {
  return axiosGet(`${API.OWNER.HISTORY}/orders/details/${unique_order_id}/${orderId}`)
}
