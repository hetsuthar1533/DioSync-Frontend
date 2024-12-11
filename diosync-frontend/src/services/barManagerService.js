import { API } from '../apiEndPoints/apiEndPoints'
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../axios/axiosMiddleware'

export const GetAllBarManager = (queryString) => {
  return axiosGet(`${API.OWNER.MANAGER}-list${queryString}`)
}

export const GetAllPermissionModules = () => {
  return axiosGet(`${API.OWNER.PERMISSIONMODULE}`)
}

export const AddNewBarManager = (data) => {
  return axiosPost(`${API.OWNER.ADDMANAGER}`, data)
}

export const UpdateBarManager = (id, data) => {
  return axiosPatch(`${API.OWNER.UPDATEMANAGER}/${id}`, data)
}

export const DeleteBarManagerById = (id) => {
  return axiosDelete(`${API.OWNER.MANAGER}-delete/${id}`)
}
