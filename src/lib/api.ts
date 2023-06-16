import { getSession } from 'next-auth/react'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  async function (config) {
    const session = await getSession()
    console.log('api')
    const token = session?.user.accessToken
    config.headers.Authorization = token ? ` Bearer ${token}` : ''

    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

export { api }

// export class ApiCore {
//   constructor() {
//     // api.interceptors.request.use(
//     //   async function (config) {
//     //     const session = await getSession()
//     //     console.log('api')
//     //     const token = session?.user.accessToken
//     //     config.headers.Authorization = token ? ` Bearer ${token}` : ''

//     //     return config
//     //   },
//     //   function (error) {
//     //     return Promise.reject(error)
//     //   },
//     // )
//     console.log('api')
//   }

//   get = async (url: string, params?: any) => {
//     console.log('get api')
//     const session = await getSession()
//     console.log('session', session)
//     const token = session?.user.accessToken
//     let response
//     if (params) {
//       const queryString = params
//         ? Object.keys(params)
//             .map((key) => key + '=' + params[key])
//             .join('&')
//         : ''
//       response = api.get(`${url}?${queryString}`, {
//         headers: {
//           Authorization: token ? ` Bearer ${token}` : '',
//         },
//       })
//     } else {
//       response = api.get(`${url}`, {
//         headers: {
//           Authorization: token ? ` Bearer ${token}` : '',
//         },
//       })
//     }
//     return response
//   }

//   delete(data: string) {
//     return api.delete(data)
//   }

//   create(url: string, data: any, opts?: any) {
//     if (opts) {
//       return api.post(url, data, opts)
//     }

//     return api.post(url, data)
//   }

//   update(url: string, data: any) {
//     return api.put(url, data)
//   }
// }
