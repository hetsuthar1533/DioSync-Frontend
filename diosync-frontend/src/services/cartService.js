import { API } from '../apiEndPoints/apiEndPoints'
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../axios/axiosMiddleware'

export const GetCartData = (queryString, id) => {
  return axiosGet(`${API.OWNER.OWNERCARTDATA}/${id}${queryString}`)
}

export const UpdateCartData = (data) => {
  return axiosPatch(`${API.OWNER.UPDATECART}`, data)
}

export const GetCartOrderSummary = (bar_venue_id) => {
  return axiosGet(`${API.OWNER.CARTORDERSUMMARY}/${bar_venue_id}`)
}

export const GetCartOrderSupplier = (bar_venue_id) => {
  return axiosGet(`${API.OWNER.CARTSUMMARYSUPPLIERS}/${bar_venue_id}`)
}

export const DeleteYourcartItem = (bar_venue, item) => {
  return axiosDelete(`${API.OWNER.DELETECART}`, { bar_venue, item })
}

export const SendSingleOrder = (data) => {
  return axiosPost(`${API.OWNER.SENDORDER}`, data)
}

export const SendBulkOrder = (data) => {
  return axiosPost(`${API.OWNER.SENDALLORDER}`, data)
}
