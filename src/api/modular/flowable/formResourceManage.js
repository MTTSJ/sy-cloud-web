import { axios } from '@/utils/request';

/**
 * 表单查询
 *
 * @author pangu
 * @date 2020/8/15 16:15
 */
export function formResourcePage(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 表单列表
 *
 * @author pangu
 * @date 2020/8/15 16:15
 */
export function formResourceList(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 表单添加
 *
 * @author pangu
 * @date 2020/8/15 16:15
 */
export function formResourceAdd(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/add',
    method: 'post',
    data: parameter,
  });
}

/**
 * 编辑表单
 *
 * @author pangu
 * @date 2020/8/15 16:15
 */
export function formResourceEdit(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 表单删除
 *
 * @author pangu
 * @date 2020/8/15 16:15
 */
export function formResourceDelete(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 表单查看
 *
 * @author pangu
 * @date 2020/8/15 16:15
 */
export function formResourceDetail(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/detail',
    method: 'get',
    params: parameter,
  });
}

/**
 * 表单设计保存
 *
 * @author pangu
 * @date 2020/8/15 21:43
 */
export function formResourceDesign(parameter) {
  return axios({
    url: '/mate-workflow/flow/form-resource/design',
    method: 'post',
    data: parameter,
  });
}
