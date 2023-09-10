import { axios } from '@/utils/request';

/**
 * 查询系统职位
 *
 * @author pangu
 * @date 2020/5/25 01:31
 */
export function getPage(parameter) {
  return axios({
    url: '/mate-system/pos/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 系统职位列表
 *
 * @author pangu
 * @date 2020/6/21 23:50
 */
export function sysPosList(parameter) {
  return axios({
    url: '/mate-system/pos/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 添加系统职位
 *
 * @author pangu
 * @date 2020/5/25 01:31
 */
export function sysPosAdd(parameter) {
  return axios({
    url: '/mate-system/pos/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 编辑系统职位
 *
 * @author pangu
 * @date 2020/5/25 01:31
 */
export function sysPosEdit(parameter) {
  return axios({
    url: '/mate-system/pos/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除系统职位
 *
 * @author pangu
 * @date 2020/5/25 01:31
 */
export function sysPosDelete(parameter) {
  return axios({
    url: '/mate-system/pos/del',
    method: 'post',
    params: parameter,
  });
}
