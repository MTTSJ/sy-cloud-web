import { axios } from '@/utils/request';

/**
 * 根据流程定义查询选项列表
 *
 * @author pangu
 * @date 2020/8/11 15:41
 */
export function optionList(parameter) {
  return axios({
    url: '/mate-workflow/flow/option/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 编辑流程选项
 *
 * @author pangu
 * @date 2020/8/11 15:41
 */
export function optionEdit(parameter) {
  return axios({
    url: '/mate-workflow/flow/option/edit',
    method: 'post',
    data: parameter,
  });
}

/**
 * 查看流程选项
 *
 * @author pangu
 * @date 2020/8/11 15:41
 */
export function optionDetail(parameter) {
  return axios({
    url: '/flowableOption/detail',
    method: 'get',
    params: parameter,
  });
}
