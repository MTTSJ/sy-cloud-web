import { axios } from '@/utils/request';

/**
 * 查询操作日志
 *
 * @author pangu
 * @date 2021-03-20 15:47:33
 */
export function sysLogPage(parameter) {
  return axios({
    url: '/mate-system/log/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 操作日志列表
 *
 * @author pangu
 * @date 2021-03-20 15:47:33
 */
export function sysLogList(parameter) {
  return axios({
    url: '/mate-system/log/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存操作日志
 *
 * @author pangu
 * @date 2021-03-20 15:47:33
 */
export function sysLogSave(parameter) {
  return axios({
    url: '/mate-system/log/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 清空
 *
 * @author pangu
 * @date 2021-03-20 15:47:33
 */
export function sysLogDelete(parameter) {
  return axios({
    url: '/mate-system/log/empty',
    method: 'post',
    params: parameter,
  });
}
