import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 建一个实例 axios
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://localhost:9002',
  // withCredentials: true, // 发送cookie时跨域请求
  timeout: 50000 // 请求超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 做一些以前请求发送(不知道这个能改不,不规范)
    if (config.config !== undefined && config.config.onUploadProgress !== undefined) {
      config.onUploadProgress = config.config.onUploadProgress
    }
    if (store.getters.token) {
      // 让每个请求进位标记
      // ['X-Token'] 是一个自定义标题密钥
      // 请根据实际情况修改
      config.headers['authorization'] = getToken()
    }
    return config
  },
  error => {
    // 做请求错误的东西
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  /**
   * 如果你想获得HTTP信息，如标题或状态，请返回响应=>响应
   * 确定由自定义代码在这里，请求状态仅仅是一个例子也可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data

    // 如果自定义代码不是200，则判断为错误。
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // TODO 50008：非法令牌; 50012：其他客户端登录; 50014：令牌到期;
      if (res.code === 4001 || res.code === 401 || res.code === 403) {
        // to re-login
        MessageBox.confirm('您已被注销，则可以取消留在此页面，或重新登录', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.status === 401) {
      console.log('error', error.response.status === 401)
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
