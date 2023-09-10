import { axios } from '@/utils/request';

/**
 * 查询接口
 *
 * @author pangu
 * @date 2021-03-14 21:46:42
 */
export function apiPage(parameter) {
  return axios({
    url: '/sycloud-micro/api/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 接口列表
 *
 * @author pangu
 * @date 2021-03-14 21:46:42
 */
export function apiList(parameter) {
  return axios({
    url: '/sycloud-micro/api/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存接口
 *
 * @author pangu
 * @date 2021-03-14 21:46:42
 */
export function apiSave(parameter) {
  return axios({
    url: '/sycloud-micro/api/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除接口
 *
 * @author pangu
 * @date 2021-03-14 21:46:42
 */
export function apiDelete(parameter) {
  return axios({
    url: '/sycloud-micro/api/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 同步接口
 *
 * @author pangu
 * @date 2021-03-14 21:46:42
 */
export function apiSync(parameter) {
  return axios({
    url: '/sycloud-micro/api/sync',
    method: 'post',
    data: parameter,
  });
}
