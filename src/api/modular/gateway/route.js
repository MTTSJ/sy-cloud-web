/**
 * 微服务管理
 */
import { axios } from '@/utils/request';

/**
 * 微服务分页查询
 */
export function routePage(parameter) {
  return axios({
    url: '/sycloud-micro/route/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 微服务列表
 */
export function routeList(parameter) {
  return axios({
    url: '/sycloud-micro/route/list-route',
    method: 'get',
    params: parameter,
  });
}

/**
 * 微服务保存
 */
export function routeSave(parameter) {
  return axios({
    url: '/sycloud-micro/route/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 微服务删除
 */
export function routeDel(parameter) {
  return axios({
    url: '/sycloud-micro/route/del',
    method: 'post',
    params: parameter,
  });
}
