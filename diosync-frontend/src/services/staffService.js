import { API } from '../apiEndPoints/apiEndPoints'
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../axios/axiosMiddleware'

export const GetAllStaffMember = (queryString) => {
  return axiosGet(`${API.OWNER.STAFFMEMBER}-list${queryString}`)
}

export const AddNewStaffMember = (data) => {
  return axiosPost(`${API.OWNER.ADDSTAFFMEMBER}`, data)
}

export const UpdateStaffMember = (id, data) => {
  return axiosPatch(`${API.OWNER.STAFFMEMBER}/details/${id}`, data)
}

export const DeleteStaffeMemberById = (id) => {
  return axiosDelete(`${API.OWNER.STAFFMEMBER}-delete/${id}`)
}
