import { axios } from '@/utils/request';

/**
 * 已办任务
 *
 * @author pangu
 * @date 2020/8/4 23:13
 */
export function flowableDoneTaskPage(parameter) {
  return axios({
    url: '/mate-workflow/flow/done-task/page',
    method: 'get',
    params: parameter,
  });
}
