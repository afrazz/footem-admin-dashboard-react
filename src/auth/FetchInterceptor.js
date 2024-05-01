import axios from 'axios'
import { API_BASE_URL } from 'configs/AppConfig'
import { signOut, signOutSuccess } from 'store/slices/authSlice'
import store from '../store'
import { AUTH_TOKEN } from 'constants/AuthConstant'
import { notification } from 'antd'
import Utils from 'utils'
import { auth } from './FirebaseAuth'

const unauthorizedCode = [401, 403]

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
})

// Config
const TOKEN_PAYLOAD_KEY = 'authorization'

// API Request interceptor
service.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser

    const token = await user?.getIdTokenResult(true)

    // const value = await AsyncStorage.getItem('token')

    // console.log(value, 'pls')

    // if (store?.getState()?.auth?.token) {

    if (token?.token) {
      config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${token?.token}`
    }

    // const jwtToken = localStorage.getItem(AUTH_TOKEN) || null
    // if(store.getState().auth.token)
    // alert(store.getState().auth.token)
    // if (store.getState().auth.token) {
    //   config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${
    //     store.getState().auth.token
    //   }`
    // }

    return config
  },
  (error) => {
    // Do something with request error here
    notification.error({
      message: 'Error',
    })
    Promise.reject(error)
  }
)

// API respone interceptor
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    Utils.errorMessageHandler(error.response.data)

    let notificationParam = {
      message: '',
    }

    // Remove token and redirect
    if (unauthorizedCode.includes(error.response.status)) {
      notificationParam.message = 'Authentication Fail'
      notificationParam.description = 'Please login again'
      // localStorage.removeItem(AUTH_TOKEN)
      // localStorage.removeItem('User')
      // store.dispatch(signOutSuccess())
      store.dispatch(signOut())
    }

    // if (error.response.status === 404) {
    //   notificationParam.message = 'Not Found'
    // }

    // if (error.response.status === 500) {
    //   notificationParam.message = 'Internal Server Error'
    // }

    // if (error.response.status === 508) {
    //   notificationParam.message = 'Time Out'
    // }
    if (notificationParam?.message) {
      notification.error(notificationParam)
    }

    return Promise.reject(error)
  }
)

export default service
