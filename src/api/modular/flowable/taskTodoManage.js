import { axios } from '@/utils/request';

/**
 * 待办任务
 *
 * @author pangu
 * @date 2020/8/4 23:10
 */
export function flowableTodoTaskPage(parameter) {
  return axios({
    url: '/mate-workflow/flow/todo-task/page',
    method: 'get',
    params: parameter,
  });
}
