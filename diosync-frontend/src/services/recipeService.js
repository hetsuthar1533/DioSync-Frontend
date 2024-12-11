import { API } from '../apiEndPoints/apiEndPoints'
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../axios/axiosMiddleware'

export const GetAllOwnerRecipe = (queryString, id) => {
  return axiosGet(`${API.OWNER.OWNERRECIPES}/${id}${queryString}`)
}

export const GetRecipeById = (id) => {
  return axiosGet(`${API.OWNER.RECIPEBYID}/${id}`)
}

export const AddNewRecipe = (data) => {
  return axiosPost(`${API.OWNER.RECIPES}`, data)
}

export const UpdateRecipe = (data, id) => {
  return axiosPatch(`${API.OWNER.RECIPES}/${id}`, data)
}

export const DeleteRecipeById = (id) => {
  return axiosDelete(`${API.OWNER.RECIPES}/${id}`)
}
