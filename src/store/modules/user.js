import Vue from 'vue';
import { login, loginByMobile, getLoginUser, logout, loginBySocial } from '@/api/modular/system/loginManage';
import { sysDictTypeTree } from '@/api/modular/system/dictManage';
import { sysMenuChange } from '@/api/modular/system/menuManage';
import { ACCESS_TOKEN, ALL_APPS_MENU, DICT_TYPE_TREE_DATA, TENANT_ID } from '@/store/mutation-types';

import { welcome } from '@/utils/util';
import store from '../index';
import router from '../../router';

const user = {
  state: {
    token: '',
    tenantId: '',
    name: '',
    welcome: '',
    avatar: '',
    buttons: [], // 按钮权限
    admintype: '', // 是否是超管
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name;
      state.welcome = welcome;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons;
    },
    SET_ADMINTYPE: (state, admintype) => {
      state.admintype = admintype;
    },
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId;
    },
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(res => {
            if (res.success) {
              const result = res.data.accessToken;
              Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000);
              commit('SET_TOKEN', result);
              resolve();
            } else {
              reject(res.msg);
            }
          })
          /* eslint handle-callback-err: "warn" */
          .catch(error => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('登录失败');
          });
      });
    },

    MobileLogin({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginByMobile(data)
          .then(res => {
            if (res.success) {
              const result = res.data.accessToken;
              Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000);
              commit('SET_TOKEN', result);
              resolve();
            } else {
              reject(res.msg);
            }
          })
          /* eslint handle-callback-err: "warn" */
          .catch(error => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('登录失败');
          });
      });
    },

    SocialLogin({ commit, dispatch }, payload) {
      return loginBySocial(payload).then(({ code, success, msg, data }) => {
        console.log(code, success);
        if (code === 200 && success) {
          const result = data.accessToken;
          Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000);
          commit('SET_TOKEN', result);
          dispatch('dictTypeData');
        } else throw new Error(msg);
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getLoginUser()
          .then(response => {
            if (response.code === 200) {
              const data = response.data;
              commit('SET_ADMINTYPE', data.adminType);
              commit('SET_ROLES', 1);
              commit('SET_BUTTONS', data.permissions);
              commit('SET_INFO', data);
              commit('SET_NAME', { name: data.name, welcome: welcome() });
              commit('SET_TENANTID', data.tenantId === '' ? '1' : data.tenantId);
              Vue.ls.set(TENANT_ID, data.tenantId === '' ? '1' : data.tenantId);
              if (data.avatar != null) {
                commit('SET_AVATAR', data.avatar);
              }
              resolve(data);
            } else {
              // eslint-disable-next-line no-undef
              reject(new Error(data.message));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        logout(state.token)
          .then(() => {
            resolve();
          })
          .catch(() => {
            resolve();
          })
          .finally(() => {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);
            commit('SET_BUTTONS', []);
            commit('SET_ADMINTYPE', '');
            commit('SET_TENANTID', '');
            Vue.ls.remove(ACCESS_TOKEN);
            Vue.ls.remove(ALL_APPS_MENU);
            Vue.ls.remove(DICT_TYPE_TREE_DATA);
            Vue.ls.remove(TENANT_ID);
          });
      });
    },

    // 加载所有字典数据
    dictTypeData() {
      return new Promise((resolve, reject) => {
        sysDictTypeTree()
          .then(data => {
            if (data.success) {
              const result = data.data;
              Vue.ls.set(DICT_TYPE_TREE_DATA, result);
              resolve();
            } else {
              // eslint-disable-next-line no-undef
              reject(new Error(data.message));
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 切换应用菜单
    MenuChange({ commit }, application) {
      return new Promise(resolve => {
        sysMenuChange({ application: application.code })
          .then(res => {
            const apps = { code: '', name: '', active: '', menu: '' };
            apps.active = true;
            apps.menu = res.data;
            // eslint-disable-next-line camelcase
            const all_app_menu = Vue.ls.get(ALL_APPS_MENU);
            // eslint-disable-next-line camelcase
            const new_false_all_app_menu = [];
            // 先去除所有默认的，以为此时切换的即将成为前端缓存默认的应用
            all_app_menu.forEach(item => {
              if (item.active) {
                item.active = false;
              }
              new_false_all_app_menu.push(item);
            });
            // 此时缓存中全部都是不默认的应用
            Vue.ls.set(ALL_APPS_MENU, new_false_all_app_menu);
            apps.name = application.name;
            apps.code = application.code;
            const applocationR = [];
            applocationR.push(apps);
            Vue.ls.set(ALL_APPS_MENU, applocationR);
            resolve(res);
            const antDesignmenus = res.data;
            store.dispatch('GenerateRoutes', { antDesignmenus }).then(() => {
              router.addRoutes(store.getters.addRouters);
            });
            // 切换应用刷新整体界面，暂且取消
            router.replace('/').catch(e => e);
          })
          .catch(() => {
            resolve();
          });
      });
    },
  },
};

export default user;
