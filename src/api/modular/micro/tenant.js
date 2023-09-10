import { axios } from '@/utils/request';

/**
 * 查询租户
 *
 * @author pangu
 * @date 2021-04-02 09:42:03
 */
export function tenantPage(parameter) {
  return axios({
    url: '/sycloud-micro/tenant/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 租户列表
 *
 * @author pangu
 * @date 2021-04-02 09:42:03
 */
export function tenantList(parameter) {
  return axios({
    url: '/sycloud-micro/tenant/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存租户
 *
 * @author pangu
 * @date 2021-04-02 09:42:03
 */
export function tenantSave(parameter) {
  return axios({
    url: '/sycloud-micro/tenant/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除租户
 *
 * @author pangu
 * @date 2021-04-02 09:42:03
 */
export function tenantDelete(parameter) {
  return axios({
    url: '/sycloud-micro/tenant/del',
    method: 'post',
    data: parameter,
  });
}
