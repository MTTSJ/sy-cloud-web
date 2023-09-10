import { axios } from '@/utils/request';

/**
 * 查询黑名单
 *
 * @author pangu
 * @date 2021-03-15 09:18:56
 */
export function blacklistPage(parameter) {
  return axios({
    url: '/sycloud-micro/blacklist/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 黑名单列表
 *
 * @author pangu
 * @date 2021-03-15 09:18:56
 */
export function blacklistList(parameter) {
  return axios({
    url: '/sycloud-micro/blacklist/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存黑名单
 *
 * @author pangu
 * @date 2021-03-15 09:18:56
 */
export function blacklistSave(parameter) {
  return axios({
    url: '/sycloud-micro/blacklist/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除黑名单
 *
 * @author pangu
 * @date 2021-03-15 09:18:56
 */
export function blacklistDelete(parameter) {
  return axios({
    url: '/sycloud-micro/blacklist/del',
    method: 'post',
    data: parameter,
  });
}
