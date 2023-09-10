import { axios } from '@/utils/request';

/**
 * 任务办理_启动
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskStart(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/start',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_提交
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskSubmit(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/submit',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_保存
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskSave(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/save',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_退回
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskBack(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/back',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_转办
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskTurn(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/turn',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_委托
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskEntrust(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/entrust',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_跳转
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskJump(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/jump',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_终止
 *
 * @author pangu
 * @date 2020/8/10 17:13
 */
export function handleTaskEnd(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/end',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_挂起
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskSuspend(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/suspend',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_加签
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskAddSign(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/add-sign',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理_减签
 *
 * @author pangu
 * @date 2020/8/11 12:13
 */
export function handleTaskDeleteSign(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/del-Sign',
    method: 'post',
    data: parameter,
  });
}

/**
 * 任务办理数据
 *
 * @author pangu
 * @date 2020/8/22 19:22
 */
export function handleTaskTaskData(parameter) {
  return axios({
    url: '/mate-workflow/flow/handle-task/task-data',
    method: 'get',
    params: parameter,
  });
}
