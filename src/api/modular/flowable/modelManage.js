import { axios } from '@/utils/request';

/**
 * 流程模型控制器
 */
export function modelList(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 流程模型增加
 */
export function modelAdd(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/add',
    method: 'post',
    data: parameter,
  });
}

/**
 * 流程模型编辑
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function modelEdit(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/edit',
    method: 'post',
    data: parameter,
  });
}

/**
 * 流程模型删除
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function modelDelete(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 流程模型查看
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function modelPreview(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/preview',
    method: 'get',
    params: parameter,
  });
}

/**
 * 模型版本
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function modelVersion(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/version',
    method: 'get',
    params: parameter,
  });
}

/**
 * 流程模型设为新版
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function modelSetAsNew(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/set-new',
    method: 'post',
    data: parameter,
  });
}

/**
 * 流程模型导入
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function modelImportModel(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/import',
    method: 'post',
    data: parameter,
  });
}

/**
 * 流程模型导入
 *
 * @author pangu
 * @date 2020/8/17 21:02
 */
export function saveBpmnModel(parameter) {
  return axios({
    url: '/mate-workflow/flow/model/save-bpmn',
    method: 'post',
    data: parameter,
  });
}
