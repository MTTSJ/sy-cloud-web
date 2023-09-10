import Vue from 'vue';
import axios from 'axios';
import store from '@/store';
import { message, Modal, notification } from 'ant-design-vue'; /// es/notification
import { VueAxios } from './axios';
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types';
import { baseURL } from '@/config/net.config';
import { clientId, clientSecret, tokenName, enableI18n } from '@/config/setting.config';
import { Base64 } from 'js-base64';

// 创建 axios 实例
const service = axios.create({
  baseURL, // api base_url
  timeout: 6000, // 请求超时时间
});

const err = error => {
  if (error.response) {
    const data = error.response.data;
    const token = Vue.ls.get(ACCESS_TOKEN);
    switch (error.response.status) {
      case 403:
        notification.error({ message: '系统提示', description: '拒绝访问', duration: 4 });
        break;
      case 500:
        const type = error.response.request.responseType;
        if (type === 'blob') {
          blobToJson(data);
          break;
        }
        if (token && (data.msg.includes('失效') || data.msg.includes('权限'))) {
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN);
                try {
                  const path = window.document.location.pathname;
                  console.log('location pathname -> ' + path);
                  if (path !== '/' && path.indexOf('/user/login') === -1) {
                    window.location.reload();
                  }
                } catch (e) {
                  window.location.reload();
                }
              });
            },
          });
        }
        break;
      case 404:
        notification.error({ message: '系统提示', description: '很抱歉，资源未找到!', duration: 4 });
        break;
      case 504:
        notification.error({ message: '系统提示', description: '网络超时' });
        break;
      case 401:
        notification.error({ message: '系统提示', description: '未授权，请重新登录', duration: 4 });
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
        }
        break;
      default:
        notification.error({
          message: '系统提示',
          description: data.msg,
          duration: 4,
        });
        break;
    }
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN);
  const tenantId = Vue.ls.get(TENANT_ID);
  if (token) {
    config.headers[tokenName] = 'Bearer ' + token;
    config.headers['Authorization'] = `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`;
    // config.headers['Authorization'] = 'Bearer ' + token
    if (tenantId) {
      config.headers['mate-tenant-id'] = tenantId;
    }
  } else {
    config.headers['Authorization'] = `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`;
  }
  // i18n
  if (enableI18n) {
    const appLanguage = store.getters.lang;
    if (appLanguage) {
      config.headers['Accept-Language'] = appLanguage;
    }
  }
  return config;
}, err);

/**
 * response interceptor
 * 所有请求统一返回
 */
service.interceptors.response.use(response => {
  if (response.request.responseType === 'blob') {
    return response;
  }
  const resData = response.data;
  const code = response.data.code;
  if (!store.state.app.hasError) {
    if (code === 1010005 || code === 1011007 || code === 1011008 || code === 1011009) {
      Modal.error({
        title: '提示：',
        content: response.data.msg,
        okText: '重新登录',
        onOk: () => {
          Vue.ls.remove(ACCESS_TOKEN);
          window.location.reload();
        },
      });
    } else if (code === 1013002 || code === 1016002 || code === 1015002) {
      message.error(response.data.msg);
      return response.data;
    } else {
      return response.data;
    }
  }
  return resData;
}, err);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service);
  },
};

/**
 * Blob解析
 * @param data
 */
function blobToJson(data) {
  const fileReader = new FileReader();
  const token = Vue.ls.get(ACCESS_TOKEN);
  fileReader.onload = function() {
    try {
      const jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
      console.log('jsonData', jsonData);
      if (jsonData.status === 500) {
        if (token && jsonData.message.includes('Token失效')) {
          Modal.error({
            title: '登录已过期',
            content: '很抱歉，登录已过期，请重新登录',
            okText: '重新登录',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN);
                window.location.reload();
              });
            },
          });
        }
      }
    } catch (err) {
      // 解析成对象失败，说明是正常的文件流
      console.log('blob解析fileReader返回err', err);
    }
  };
  fileReader.readAsText(data);
}

export { installer as VueAxios, service as axios };
