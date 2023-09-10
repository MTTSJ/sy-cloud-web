import { axios } from '@/utils/request';

/**
 * 查询登录日志
 *
 * @author pangu
 * @date 2021-03-18 18:38:28
 */
export function loginLogPage(parameter) {
  return axios({
    url: '/mate-system/login-log/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 登录日志列表
 *
 * @author pangu
 * @date 2021-03-18 18:38:28
 */
export function loginLogList(parameter) {
  return axios({
    url: '/loginLog/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存登录日志
 *
 * @author pangu
 * @date 2021-03-18 18:38:28
 */
export function loginLogSave(parameter) {
  return axios({
    url: '/loginLog/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除登录日志
 *
 * @author pangu
 * @date 2021-03-18 18:38:28
 */
export function loginLogDelete(parameter) {
  return axios({
    url: '/mate-system/login-log/del',
    method: 'post',
    params: parameter,
  });
}
