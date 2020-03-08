import request from '@/utils/request'
/* 我的世界-模组管理-列表 */
export function minecraftModList(query) {
  return request({
    url: '/minecraft/mod',
    method: 'get',
    params: query
  })
}
/* 我的世界-模组管理-类型列表 */
export function minecraftModCategoryAll(query) {
  return request({
    url: '/minecraft/mod-category/all',
    method: 'get',
    params: query
  })
}
/* 我的世界-模组管理-新增 */
export function minecraftModCreate(data) {
  return request({
    url: '/minecraft/mod',
    method: 'post',
    data
  })
}
/* 我的世界-模组管理-编辑 */
export function minecraftModUpdate(id, data) {
  return request({
    url: `/minecraft/mod/${id}`,
    method: 'put',
    data
  })
}
/* 我的世界-模组管理-删除 */
export function minecraftModDelete(id) {
  return request({
    url: `/minecraft/mod/${id}`,
    method: 'delete'
  })
}
