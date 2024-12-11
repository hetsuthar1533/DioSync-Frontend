import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet, axiosPatch } from '../axios/axiosMiddleware'

export const GetMySubscriptionDetails = (queryString) => {
  return axiosGet(`${API.OWNER.MYSUBSCRIPTION}${queryString}`)
}

export const CancelMySubscription = (id) => {
  return axiosPatch(`${API.OWNER.CANCELSUBSCRIPTION}/${id}`)
}
