import { axios } from '@/utils/request';

/**
 * 查询客户端
 *
 * @author pangu
 * @date 2021-03-31 17:17:51
 */
export function clientPage(parameter) {
  return axios({
    url: '/sycloud-micro/client/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 客户端列表
 *
 * @author pangu
 * @date 2021-03-31 17:17:51
 */
export function clientList(parameter) {
  return axios({
    url: '/sycloud-micro/client/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存客户端
 *
 * @author pangu
 * @date 2021-03-31 17:17:51
 */
export function clientSave(parameter) {
  return axios({
    url: '/sycloud-micro/client/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除客户端
 *
 * @author pangu
 * @date 2021-03-31 17:17:51
 */
export function clientDelete(parameter) {
  return axios({
    url: '/sycloud-micro/client/del',
    method: 'post',
    params: parameter,
  });
}
