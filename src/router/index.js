import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注：子菜单只出现在路线 children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会在侧边栏显示（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果没有始终设置显示，当项目有不止一个孩子的路线，
 *                                它会成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置不重定向将在面包屑没有重定向
 * name:'router-name'             名称用于通过保活>（必须设置！）
 * meta : {
    roles: ['admin','editor']     控制页面的角色（可以设置多个角色）
    title: 'title'                名称显示在侧边栏和面包屑（建议集)
    icon: 'svg-name'              图标显示在侧边栏
    breadcrumb: false             如果设置为false，该项目将隐藏在面包屑（默认为true）
    activeMenu: '/example/list'   如果设定的路径，侧边栏会突出显示您设置的路径
  }
 */

/**
 * 路线不变
 * 基页是没有权限要求
 * 所有角色可以访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/minecraft',
    component: Layout,
    redirect: '/minecraft/mod/type',
    name: 'minecraft',
    meta: { title: '我的世界', icon: 'example' },
    children: [
      {
        path: 'mod-type',
        component: () => import('@/views/minecraft/modCategory/list'),
        name: 'mod-type',
        meta: { title: '模组类型管理', icon: 'table' }
      },
      {
        path: 'mod',
        component: () => import('@/views/minecraft/mod/list'),
        name: 'mod',
        meta: { title: '模组管理', icon: 'table' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
