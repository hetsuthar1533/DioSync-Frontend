import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost } from '../axios/axiosMiddleware'

//for graph of dashboard topsales
export const GetMultiVenueTopSale = () => {
  return axiosGet(`${API.OWNER.MULTIVENUETOPSALES}`)
}

export const GetTopSaleInvenotry = (queryString) => {
  return axiosGet(`${API.OWNER.INVENTORYSTOCKGRAPH}${queryString}`)
}

export const GetInventoryStockList = (queryString) => {
  return axiosGet(`${API.OWNER.INVENTORYSTOCKLIST}${queryString}`)
}

export const GetItemsForRecordTransfer = (id) => {
  return axiosGet(`${API.OWNER.RECORDTRANSFER}/${id}`)
}

export const AddToCart = (data, id) => {
  return axiosPost(`${API.OWNER.ADDCARTDATA}/${id}`, data)
}

export const UpdateInventoryQuantity = (data) => {
  return axiosPost(`${API.OWNER.UPDATEINVENTORYQUANTITY}`, data)
}

export const GetAllRecordBreakageReasons = () => {
  return axiosGet(`${API.OWNER.BREAKAGEANDLOSSREASONS}`)
}

export const GetAllEmployees = (barVanueId) => {
  return axiosGet(`${API.OWNER.EMPLOYEELIST}/${barVanueId}`)
}

export const AddRecordBreakage = (data) => {
  return axiosPost(`${API.OWNER.ADDRECORDBREAKAGE}`, data)
}

export const AddRecordTransfer = (data) => {
  return axiosPost(`${API.OWNER.ADDRECORDTRANSFER}`, data)
}
