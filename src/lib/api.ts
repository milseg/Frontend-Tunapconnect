import { getSession } from 'next-auth/react'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

const apiB = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL_B,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiB.interceptors.request.use(
  async function (config) {
    const session = await getSession()
    const token = session?.user.accessToken
    config.headers.Authorization = token ? ` Bearer ${token}` : ''

    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

api.interceptors.request.use(
  async function (config) {
    const session = await getSession()
    const token = session?.user.accessToken
    config.headers.Authorization = token ? ` Bearer ${token}` : ''

    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

export { api, apiB }
