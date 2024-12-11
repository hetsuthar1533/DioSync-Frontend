import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddUnitMeasureApi = (data) => {
  return axiosPost(API.ADMIN.UNITMEASURE, data)
}

export const GetUnitMeasure = (queryString) => {
  return axiosGet(`${API.ADMIN.UNITMEASURE}${queryString}`)
}

export const DeleteUnitMeasure = (id) => {
  return axiosDelete(`${API.ADMIN.UNITMEASURE}/${id}`)
}

export const UpdateUnitMeasure = (data, id) => {
  return axiosPut(`${API.ADMIN.UNITMEASURE}/${id}`, data)
}

export const BulkUnitMeasureActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkUnitMeasureDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const GetAllUnitMeasure = () => {
  return axiosGet(`${API.ADMIN.UNITMEASURE}/all`)
}
