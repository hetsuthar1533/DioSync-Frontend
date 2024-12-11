import { clearUser, setToken } from '../redux/slices/userSlice'
import axios from 'axios'
import { ToastShow } from '../redux/slices/toastSlice'
import { API } from '../apiEndPoints/apiEndPoints'

const BASE_URL = process.env.REACT_APP_API_URL

const setupAxios = (store) => {
  axios.interceptors.request.use((request) => {
    const storeData = store.getState()

    const authToken = storeData.user.token
    if (authToken) {
      request.headers.Authorization = `Bearer ${authToken}`
    }
    return request
  })

  axios.interceptors.response.use(
    (res) => {
      if (res.config.method !== 'get') {
        store.dispatch(ToastShow({ message: res.data.message, type: res.data.success ? 'sucess' : 'error' }))
      }
      return res
    },
    async (error) => {
      const storeData = store?.getState()
      const originalRequest = error?.config
      if (error?.response?.status === 401 && !originalRequest?._retry) {
        originalRequest._retry = true
        const refreshToken = storeData?.user?.refreshToken
        try {
          await axios({
            method: 'post',
            url: `${BASE_URL}${API.AUTH.REFRESH_TOKEN}`,
            data: { refresh: refreshToken },
          })
            .then((response) => {
              if (response?.data?.access && response?.status === 200) {
                store.dispatch(setToken(response?.data?.access))

                // axios.headers.common['Authorization'] = `Bearer ${response?.data?.access}`
                axios.headers.Authorization = `Bearer ${response?.data?.access}`
                return response?.data?.access
              } else {
                store.dispatch(
                  ToastShow({
                    message: error?.response?.errors?.length ? Object.values(error?.response.errors[0])[0] : '',
                    type: 'error',
                  }),
                  store.dispatch(clearUser()),
                )
              }
            })
            .catch((error) => error?.response?.data)
          return axios(originalRequest)
        } catch (refreshError) {
          if (storeData.user.token !== null) {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
              if (error.response.errors) {
                store.dispatch(
                  ToastShow({
                    message: error?.response?.errors?.length ? Object.values(error?.response.errors)[0] : '',
                    type: 'error',
                  }),
                )
              }
              store.dispatch(clearUser())
            }
          }
        }
      } else {
        store.dispatch(
          ToastShow({
            message: error?.response?.data.errors?.length ? Object.values(error?.response?.data.errors[0])[0] : '',
            type: 'error',
          }),
        )
      }
    },
  )
}

export default setupAxios

export function axiosGet(url, data = null) {
  return axios.get(`${BASE_URL}${url}`, {
    params: data,
  })
}

export function axiosPost(url, data, headers) {
  return axios.post(`${BASE_URL}${url}`, data, headers ?? {})
}

export const axiosConfig = (method, url, config, data) => {
  return axios({
    method: method,
    url: `${BASE_URL}${url}`,
    ...config,
    data,
  })
}

export const axiosPatch = (url, data) => {
  return axios.patch(`${BASE_URL}${url}`, data)
}

export const axiosPut = (url, data) => {
  return axios.put(`${BASE_URL}${url}`, data)
}

export const axiosDelete = (url, data) => {
  return axios.delete(`${BASE_URL}${url}`, { data })
}
