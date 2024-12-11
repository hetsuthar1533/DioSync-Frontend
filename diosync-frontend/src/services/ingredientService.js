import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddIngridentsApi = (data) => {
  return axiosPost(API.ADMIN.INGREDIENTS, data)
}

export const GetIngridents = (queryString) => {
  return axiosGet(`${API.ADMIN.INGREDIENTS}${queryString}`)
}

export const DeleteIngridents = (id) => {
  return axiosDelete(`${API.ADMIN.INGREDIENTS}/${id}`)
}

export const UpdateIngridents = (data, id) => {
  return axiosPut(`${API.ADMIN.INGREDIENTS}/${id}`, data)
}

export const BulkIngredientsActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkIngredientsDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}

export const GetAllIngridents = (id) => {
  console.log(id, 'id')
  return axiosGet(`${API.ADMIN.INGREDIENTNEWALL}/${id}`)
}
