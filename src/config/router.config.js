// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons';
import store from '@/store';

export const asyncRouterMap = [
  {
    path: '/',
    name: 'MenuIndex.vue',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: {
          title: '仪表盘',
          keepAlive: true,
          icon: bxAnaalyse, /* permission: [ 'dashboard' ] */
        },
        children: [
          {
            path: 'analysis/:current([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/system/dashboard/Analysis'),
            meta: {
              title: '分析页',
              keepAlive: true, /* permission: [ 'dashboard' ] */
            },
          },
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/system/dashboard/Workplace'),
            meta: {
              title: '工作台',
              keepAlive: false, /*, permission: [ 'dashboard' ] */
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/userLoginReg/Login'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/userLoginReg/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/userLoginReg/RegisterResult'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },

  {
    path: '/socialcallback',
    name: 'socialcallback',
    // 处理三方账号登录的回调地址
    async beforeEnter(to, from, next) {
      const { state, code } = to.query;
      if (!state || !code) return;
      if (code.startsWith('wechat_open')) {
        try {
          await store.dispatch('SocialLogin', { state, code });
          next('/');
        } catch (e) {
          console.error(e);
          next('/user/login');
        }
      }
    },
  },
  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home'),
      },
    ],
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/system/exception/404'),
  },
];
