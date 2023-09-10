import { axios } from '@/utils/request';

/**
 * 代码生成详细配置列表
 */
export function sysCodeGenerateConfigList(parameter) {
  return axios({
    url: '/sycloud-code/code-config/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 编辑代码生成详细配置
 */
export function sysCodeGenerateConfigEdit(parameter) {
  return axios({
    url: '/sycloud-code/code-config/set-config-list',
    method: 'post',
    data: parameter,
  });
}
