import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddCaseSizeApi = (data) => {
  return axiosPost(API.ADMIN.CASESIZE, data)
}

export const GetCaseSize = (queryString) => {
  return axiosGet(`${API.ADMIN.CASESIZE}${queryString}`)
}

export const DeleteCaseSize = (id) => {
  return axiosDelete(`${API.ADMIN.CASESIZE}/${id}`)
}

export const UpdateCaseSize = (data, id) => {
  return axiosPut(`${API.ADMIN.CASESIZE}/${id}`, data)
}

export const GetAllCaseSize = () => {
  return axiosGet(`${API.ADMIN.CASESIZEALL}`)
}

export const BulkCaseSizeActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkCaseSizeDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}
