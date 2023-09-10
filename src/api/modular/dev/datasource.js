/**
 * 数据源管理
 */
import { axios } from '@/utils/request';

/**
 * 查询数据源
 *
 */
export function dataSourcePage(parameter) {
  return axios({
    url: '/sycloud-code/data-source/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 保存数据源
 *
 */
export function dataSourceSave(parameter) {
  return axios({
    url: '/sycloud-code/data-source/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除数据源
 *
 */
export function dataSourceDel(parameter) {
  return axios({
    url: '/sycloud-code/data-source/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 测试数据源连接
 */
export function dataSourceTest(parameter) {
  return axios({
    url: '/sycloud-code/data-source/test',
    method: 'post',
    data: parameter,
  });
}

/**
 * 数据源列表
 */
export function dataSourceList(parameter) {
  return axios({
    url: '/sycloud-code/data-source/list',
    method: 'get',
    params: parameter,
  });
}
