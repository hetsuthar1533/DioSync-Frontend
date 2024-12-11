import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddBreakageAndLossApi = (data) => {
  return axiosPost(API.ADMIN.BREAKAGEANDLOSS, data)
}

export const GetBreakageAndLoss = (queryString) => {
  return axiosGet(`${API.ADMIN.BREAKAGEANDLOSS}${queryString}`)
}

export const DeleteBreakageAndLoss = (id) => {
  return axiosDelete(`${API.ADMIN.BREAKAGEANDLOSS}/${id}`)
}

export const UpdateBreakageAndLoss = (data, id) => {
  return axiosPut(`${API.ADMIN.BREAKAGEANDLOSS}/${id}`, data)
}

export const BulkBreakageAndLossActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkBreakageAndLossDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}
