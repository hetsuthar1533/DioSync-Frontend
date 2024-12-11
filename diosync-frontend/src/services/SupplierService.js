import { API } from '../apiEndPoints/apiEndPoints'
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../axios/axiosMiddleware'

export const GetAllSupplier = (queryString, id) => {
  return axiosGet(`${API.OWNER.OWNERSUPPLIER}/${id}${queryString}`)
}

export const AddNewSupplier = (data) => {
  return axiosPost(`${API.OWNER.SUPPLIERS}`, data)
}

export const UpdateSupplier = (data, id) => {
  return axiosPatch(`${API.OWNER.SUPPLIERS}/${id}`, data)
}

export const DeleteSupplierById = (id) => {
  return axiosDelete(`${API.OWNER.SUPPLIERS}/${id}`)
}

export const GetAllSupplierDropdown = (id) => {
  return axiosGet(`${API.OWNER.SUPPLIERS}/all/${id}`)
}
