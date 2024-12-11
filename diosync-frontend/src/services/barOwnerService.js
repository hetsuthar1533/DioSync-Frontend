import { API } from '../apiEndPoints/apiEndPoints'
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../axios/axiosMiddleware'

export const CreateBarOwner = (data) => {
  return axiosPost(API?.ADMIN?.ADDBAROWNER, data)
}

export const GetBarOwners = (queryString) => {
  return axiosGet(`${API.ADMIN.BAROWNER}${queryString}`)
}

export const DeleteBarOwner = (id) => {
  return axiosDelete(`${API.ADMIN.BAROWNER}/${id}`)
}

export const AddNewVenue = (data, id) => {
  return axiosPatch(`${API?.ADMIN?.BAROWNER}/${id}`, data)
}

export const UpdateVenue = (data, id) => {
  return axiosPatch(`${API?.ADMIN?.BARVENUE}/${id}`, data)
}

export const GetBarOwnersVenues = (id, queryString) => {
  return axiosGet(`${API.ADMIN.BAROWNERVENUES}/${id}${queryString}`)
}

export const DeleteVenueById = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const BulkOwnerActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkOwnerDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const BulkVenueActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkVenueDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const GetVenueDropdownData = (id) => {
  return axiosGet(`${API.ADMIN.BAROWNERVENUES}/${id}`)
}

export const GetBarOwnerProfile = () => {
  return axiosGet(`${API.OWNER.ACCOUNT}`)
}

export const UpdateBarOwnerProfile = (data) => {
  return axiosPatch(`${API.OWNER.ACCOUNT}`, data)
}

export const GetLoginBarOwnerUserCreds = (id) => {
  return axiosGet(`${API.ADMIN.LOGINBAROWNER}/${id}`)
}
