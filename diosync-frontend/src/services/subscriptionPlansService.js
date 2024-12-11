import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost, axiosDelete, axiosPut, axiosPatch } from '../axios/axiosMiddleware'

export const AddSubscriptionPlanApi = (data) => {
  return axiosPost(API.ADMIN.SUBSCRIPTIONPLANS, data)
}

export const GetSubscriptionPlans = (queryString) => {
  return axiosGet(`${API.ADMIN.SUBSCRIPTIONPLANS}${queryString}`)
}

export const DeleteSubscriptionPlans = (id) => {
  return axiosDelete(`${API.ADMIN.SUBSCRIPTIONPLANS}/${id}`)
}

export const UpdateSubscriptionPlans = (data, id) => {
  return axiosPut(`${API.ADMIN.SUBSCRIPTIONPLANS}/${id}`, data)
}

export const GetAllSubscriptionsPlans = () => {
  return axiosGet(`${API.ADMIN.SUBSCRIPTIONPLANSALL}`)
}

export const BulkSubscriptionPlansActiveInactive = (data) => {
  return axiosPatch(API?.ADMIN?.ADDBAROWNER, data)
}

export const BulkSubscriptionPlansDelete = (id) => {
  return axiosDelete(`${API.ADMIN.BARVENUE}/${id}`)
}
