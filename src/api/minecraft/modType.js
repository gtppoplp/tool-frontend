import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/minecraft/mod-type',
    method: 'get',
    params
  })
}
