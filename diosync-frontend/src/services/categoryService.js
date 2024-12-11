import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddCategories = (data) => {
  return axiosPost(API.ADMIN.CATEGORIES, data)
}

export const GetCategories = (queryString) => {
  return axiosGet(`${API.ADMIN.CATEGORIES}${queryString}`)
}

export const DeleteCategories = (id) => {
  return axiosDelete(`${API.ADMIN.CATEGORIES}/${id}`)
}

export const UpdateCategories = (data, id) => {
  return axiosPut(`${API.ADMIN.CATEGORIES}/${id}`, data)
}

export const GetAllCategories = () => {
  return axiosGet(`${API.ADMIN.CATEGORIESALL}`)
}

export const BulkCategoriesActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkCategoriesDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}
