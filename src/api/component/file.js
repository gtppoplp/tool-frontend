import request from '@/utils/request'

/* 公共组件-文件-上传 */
export function upload(data, config) {
  return request({
    url: '/component/file/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
    config
  })
}
