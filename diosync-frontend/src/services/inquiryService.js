import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPost } from '../axios/axiosMiddleware'

export const GetSubscriptionInquiries = (queryString) => {
  return axiosGet(`${API.ADMIN.SUBSCRIPTIONINQUIRY}${queryString}`)
}

export const GetContactusInquiries = (queryString) => {
  return axiosGet(`${API.ADMIN.CONTACTUSINQUIRY}${queryString}`)
}

export const replyContactedInquiries = (data, id) => {
  return axiosPost(`${API.ADMIN.CONTACTUSINQUIRYREPLY}/${id}`, data)
}

export const replySubscriptionInquiries = (data, id) => {
  return axiosPost(`${API.ADMIN.SUBSCRIPTIONINQUIRYREPLY}/${id}`, data)
}
