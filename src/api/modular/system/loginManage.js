/**
 * 系统应用
 *
 * @author pangu
 * @date 2020/5/26 19:06
 */
import { axios } from '@/utils/request';
import md5 from 'js-md5';

/**
 * 登录
 *
 * @author xuzhanfu
 * @date 2020/5/26 19:06
 */
export function login(data) {
  return axios({
    url: '/sycloud-uaa/oauth/token',
    method: 'post',
    headers: {
      key: data.key,
      code: data.code,
    },
    params: {
      username: data.account,
      password: md5(data.password),
      grant_type: 'captcha',
      scope: 'all',
    },
  });
}

/**
 * 手机号登录
 *
 * @author xuzhanfu
 * @date 2020/5/26 19:06
 */
export function loginByMobile(data) {
  return axios({
    url: '/sycloud-uaa/oauth/token',
    method: 'post',
    params: {
      mobile: data.mobile,
      code: data.code,
      grant_type: 'sms',
      scope: 'all',
    },
  });
}

/**
 * 社交登录
 *
 * @author xuzhanfu
 * @date 2020/5/26 19:06
 */
export function loginBySocial(data) {
  // TODO: 修改后端接收参数的方式
  // return axios.post('/sycloud-uaa/oauth/token', {
  //   code: data.code,
  //   state: data.state,
  //   grant_type: 'social',
  //   scope: 'all'
  // })
  return axios({
    url: '/sycloud-uaa/oauth/token',
    method: 'post',
    params: {
      code: data.code,
      state: data.state,
      grant_type: 'social',
      scope: 'all',
    },
  });
}

/**
 * 登出
 *
 * @author pangu
 * @date 2020/5/26 19:07
 */
export function logout(parameter) {
  return axios({
    url: '/sycloud-uaa/auth/logout',
    method: 'post',
    params: parameter,
  });
}

/**
 * 获取登录用户信息
 *
 * @author pangu
 * @date 2020/5/26 19:08
 */
export function getLoginUser(parameter) {
  return axios({
    url: '/sycloud-uaa/auth/get/user',
    method: 'get',
    params: parameter,
  });
}

/**
 * 获取短信验证码
 *
 * @author pangu
 * @date 2020/5/26 19:29
 */
export function getSmsCaptcha(parameter) {
  return axios({
    url: 'sycloud-uaa/auth/sms-code',
    method: 'get',
    params: parameter,
  });
}

/**
 * 获取短信验证码
 *
 * @author pangu
 * @date 2020/5/26 19:29
 */
export function getCodeCaptcha() {
  return axios({
    url: 'sycloud-uaa/auth/code',
    method: 'get',
  });
}
