import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://101.43.18.248:3100',
  timeout: 3000,
  withCredentials: true,
})
instance.interceptors.response.use(
  (res) => {
    if (res.status === 401) return reject('错误状态码!')
    if (res.status === 500) return reject('服务器错误!')
    return res.data
  },
  (err) => {
    //超时
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      // eslint-disable-next-line
      return Promise.reject('请求超时！')
    }
    return Promise.reject(err)
  }
)
export async function Axios(options) {
  const res = await instance(options)
  return res
}
