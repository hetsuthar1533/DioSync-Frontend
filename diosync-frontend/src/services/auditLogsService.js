import { API } from '../apiEndPoints/apiEndPoints'
import { axiosGet } from '../axios/axiosMiddleware'

export const GetAuditLogs = (queryString) => {
  return axiosGet(`${API.ADMIN.AUDIT_LOGS}${queryString}`)
}
