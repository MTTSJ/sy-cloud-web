import { axios } from '@/utils/request';

/**
 * 查询客户端
 *
 * @author pangu
 * @date 2021-03-31 17:17:51
 */
export function onlinePage(parameter) {
  return axios({
    url: '/sycloud-uaa/auth/online',
    method: 'get',
    params: parameter,
  });
}

/**
 * 强制下线
 *
 * @author pangu
 * @date 2020/6/8 11:11
 */
export function onlineForceLogout(parameter) {
  return axios({
    url: '/sycloud-uaa/auth/force-logout',
    method: 'post',
    data: parameter,
  });
}
