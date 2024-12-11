import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPatch } from '../axios/axiosMiddleware'

export const AddSubCategories = (data) => {
  return axiosPost(API.ADMIN.SUBCATEGORIES, data)
}

export const GetSubCategories = (queryString) => {
  return axiosGet(`${API.ADMIN.SUBCATEGORIES}${queryString}`)
}

export const DeleteSubCategories = (id) => {
  return axiosDelete(`${API.ADMIN.SUBCATEGORIES}/${id}`)
}

export const UpdateSubCategories = (data, id) => {
  return axiosPatch(`${API.ADMIN.SUBCATEGORIES}/${id}`, data)
}
export const GetSubCategoriesbyCategories = (id) => {
  return axiosGet(`${API.ADMIN.SUBCATEGORIESFORNEWREFERENCE}/${id}`)
}

export const GetAllSubCategories = () => {
  return axiosGet(`${API.ADMIN.SUBCATEGORIESALL}`)
}

export const BulkSubcategoriesActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkSubcategoriesDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}
