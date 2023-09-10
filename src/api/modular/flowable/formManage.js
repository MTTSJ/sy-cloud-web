import { axios } from '@/utils/request';

/**
 * 表单列表
 *
 * @author pangu
 * @date 2021/6/15 16:15
 */
export function formList(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 表单添加
 *
 * @author pangu
 * @date 2021/6/15 16:15
 */
export function formAdd(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 编辑表单
 *
 * @author pangu
 * @date 2021/6/15 16:15
 */
export function formEdit(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 表单删除
 *
 * @author pangu
 * @date 2021/6/15 16:15
 */
export function formDelete(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 表单查看
 *
 * @author pangu
 * @date 2021/6/15 16:15
 */
export function formDetail(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/detail',
    method: 'get',
    params: parameter,
  });
}

/**
 * 流程定义的开始表单
 *
 * @author pangu
 * @date 2021/6/16 23:34
 */
export function formStartFormData(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/start-form-data',
    method: 'get',
    params: parameter,
  });
}

/**
 * 当前任务的任务表单
 *
 * @author pangu
 * @date 2021/6/17 00:40
 */
export function formTaskFormData(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/task-form-data',
    method: 'get',
    params: parameter,
  });
}

/**
 * 流程定义的全局表单
 *
 * @author pangu
 * @date 2021/6/16 23:34
 */
export function formgGlobalFormData(parameter) {
  return axios({
    url: '/mate-workflow/flow/form/global-form-data',
    method: 'get',
    params: parameter,
  });
}
