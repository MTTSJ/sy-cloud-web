import { axios } from '@/utils/request';

/**
 * 查询微信应用
 *
 * @author pangu
 * @date 2021-07-31 10:09:38
 */
export function wxAppPage(parameter) {
  return axios({
    url: '/mate-weixin/wx-app/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 微信应用列表
 *
 * @author pangu
 * @date 2021-07-31 10:09:38
 */
export function wxAppList(parameter) {
  return axios({
    url: '/mate-weixin/wx-app/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存微信应用
 *
 * @author pangu
 * @date 2021-07-31 10:09:38
 */
export function wxAppSave(parameter) {
  return axios({
    url: '/mate-weixin/wx-app/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除微信应用
 *
 * @author pangu
 * @date 2021-07-31 10:09:38
 */
export function wxAppDelete(parameter) {
  return axios({
    url: '/mate-weixin/wx-app/del',
    method: 'post',
    data: parameter,
  });
}
