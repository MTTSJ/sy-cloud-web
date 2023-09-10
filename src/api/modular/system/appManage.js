/**
 * 系统应用
 *
 * @author pangu
 * @date 2020年4月23日12:10:57
 */
import { axios } from '@/utils/request';

/**
 * 系统应用列表
 *
 * @author pangu
 * @date 2020年7月9日15:05:01
 */
export function getPage(parameter) {
  return axios({
    url: '/mate-system/app/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 系统应用列表
 *
 * @author pangu
 * @date 2020年7月9日15:05:01
 */
export function getAppList(parameter) {
  return axios({
    url: '/mate-system/app/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 新增系统应用
 *
 * @author pangu
 * @date 2020年7月9日15:05:01
 */
export function sysAppAdd(parameter) {
  return axios({
    url: '/mate-system/app/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 编辑系统应用
 *
 * @author pangu
 * @param parameter
 * @returns {*}
 */
export function sysAppEdit(parameter) {
  return axios({
    url: '/mate-system/app/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除系统应用
 *
 * @author pangu
 * @date 2020年7月9日15:05:01
 */
export function sysAppDelete(parameter) {
  return axios({
    url: '/mate-system/app/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 设为默认应用
 *
 * @author pangu
 * @date 2020年7月9日15:05:01
 */
export function sysAppSetAsDefault(parameter) {
  return axios({
    url: '/mate-system/app/set-default',
    method: 'post',
    data: parameter,
  });
}
