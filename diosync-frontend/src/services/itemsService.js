import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const ItemsApiAdd = (data) => {
  return axiosPost(API.ADMIN.ITEMS, data)
}

export const GetItems = (queryString) => {
  return axiosGet(`${API.ADMIN.ITEMS}${queryString}`)
}

export const DeleteItems = (id) => {
  return axiosDelete(`${API.ADMIN.ITEMS}/${id}`)
}

export const UpdateItems = (data, id) => {
  return axiosPut(`${API.ADMIN.ITEMS}/${id}`, data)
}

export const BulkItemsActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkItemsDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const GetOwnerItems = (queryString, id) => {
  return axiosGet(`${API.OWNER.OWNRITEMS}/${id}${queryString}`)
}

export const DeleteOwnerItems = (id) => {
  return axiosDelete(`${API.OWNER.ITEMS}/${id}`)
}

export const AddNewReferenceAPI = (data) => {
  return axiosPost(API.OWNER.ITEMS, data)
}

export const UpdateOwnerItem = (data, id) => {
  return axiosPatch(`${API.OWNER.ITEMS}/${id}`, data)
}

export const GetAllItems = () => {
  return axiosGet(`${API.ADMIN.ITEMS}/all`)
}

export const GetAllItemsOfBarVenue = (id) => {
  return axiosGet(`${API.OWNER.ITEMSVENUE}/${id}`)
}
