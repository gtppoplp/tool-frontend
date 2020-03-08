import request from '@/utils/request'

/* 我的世界-模组类型管理-列表 */
export function minecraftModCategoryList(query) {
  return request({
    url: '/minecraft/mod-category',
    method: 'get',
    params: query
  })
}
/* 我的世界-模组类型管理-新增 */
export function minecraftModCategoryCreate(data) {
  return request({
    url: '/minecraft/mod-category',
    method: 'post',
    data
  })
}
/* 我的世界-模组类型管理-编辑 */
export function minecraftModCategoryUpdate(id, data) {
  return request({
    url: `/minecraft/mod-category/${id}`,
    method: 'put',
    data
  })
}
/* 我的世界-模组类型管理-删除 */
export function minecraftModCategoryDelete(id) {
  return request({
    url: `/minecraft/mod-category/${id}`,
    method: 'delete'
  })
}
