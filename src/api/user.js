import request from '@/utils/request'

/**
 * 登录
 * @param data
 * @returns {AxiosPromise}
 */
export function login(data) {
  return request({
    url: '/security/account/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @param token
 * @returns {AxiosPromise}
 */
export function getInfo(token) {
  return request({
    url: '/security/account/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 登出
 * @returns {AxiosPromise}
 */
export function logout() {
  return request({
    url: '/security/account/logout',
    method: 'post'
  })
}
