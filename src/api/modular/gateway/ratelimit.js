import { axios } from '@/utils/request';

/**
 * 查询流量控制
 *
 * @author pangu
 * @date 2021-03-15 21:31:55
 */
export function rateLimitPage(parameter) {
  return axios({
    url: '/sycloud-micro/rate-limit/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 流量控制列表
 *
 * @author pangu
 * @date 2021-03-15 21:31:55
 */
export function rateLimitList(parameter) {
  return axios({
    url: '/sycloud-micro/rate-limit/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存流量控制
 *
 * @author pangu
 * @date 2021-03-15 21:31:55
 */
export function rateLimitSave(parameter) {
  return axios({
    url: '/sycloud-micro/rate-limit/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除流量控制
 *
 * @author pangu
 * @date 2021-03-15 21:31:55
 */
export function rateLimitDelete(parameter) {
  return axios({
    url: '/sycloud-micro/rate-limit/del',
    method: 'post',
    params: parameter,
  });
}
