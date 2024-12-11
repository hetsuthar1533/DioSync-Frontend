import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPatch } from '../axios/axiosMiddleware'

export const EditGeneralSettings = (data) => {
  return axiosPatch(API.ADMIN.UPDATE_GENERAL_SETTINGS, data)
}

export const GetGeneralSettings = () => {
  return axiosGet(API.ADMIN.GENERAL_SETTINGS)
}

export const GetMailSettings = () => {
  return axiosGet(API.ADMIN.EMAIL_SETTINGS)
}

export const EditEmailSettings = (data) => {
  return axiosPatch(API.ADMIN.UPDATE_EMAIL_SETTINGS, data)
}
