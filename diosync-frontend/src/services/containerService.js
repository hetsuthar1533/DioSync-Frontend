import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddContainerApi = (data) => {
  return axiosPost(API.ADMIN.CONATINER, data)
}

export const GetContainer = (queryString) => {
  return axiosGet(`${API.ADMIN.CONATINER}${queryString}`)
}

export const DeleteContainer = (id) => {
  return axiosDelete(`${API.ADMIN.CONATINER}/${id}`)
}

export const UpdateContainer = (data, id) => {
  return axiosPut(`${API.ADMIN.CONATINER}/${id}`, data)
}

export const BulkContainerActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkContainerDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const GetAllContainer = () => {
  return axiosGet(`${API.ADMIN.CONATINER}/all`)
}
