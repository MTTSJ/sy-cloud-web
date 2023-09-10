/**
 * 代码生成
 */
import { axios } from '@/utils/request';

/**
 * 查询列表
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGeneratePage(parameter) {
  return axios({
    url: '/sycloud-code/code/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 增加
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGenerateAdd(parameter) {
  return axios({
    url: '/sycloud-code/code/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 编辑
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGenerateEdit(parameter) {
  return axios({
    url: '/codeGenerate/edit',
    method: 'post',
    data: parameter,
  });
}

/**
 * 删除
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGenerateDelete(parameter) {
  return axios({
    url: '/sycloud-code/code/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 查询当前数据库用户下的所有表
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGenerateInformationList(parameter) {
  return axios({
    url: '/codeGenerate/InformationList',
    method: 'get',
    params: parameter,
  });
}

/**
 * 本地生成
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGenerateRunLocal(parameter) {
  return axios({
    url: '/codeGenerate/runLocal',
    method: 'post',
    data: parameter,
  });
}

/**
 * 压缩包方式下载
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeGenerateRunDown(parameter) {
  return axios({
    url: '/sycloud-code/code/download',
    method: 'post',
    data: parameter,
    responseType: 'arraybuffer',
  }).then(response => {
    // 处理返回的文件流
    const blob = new Blob([response], { type: 'application/zip' });
    const filename = parameter.id + '.zip';
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(function() {
      URL.revokeObjectURL(blob);
      document.body.removeChild(link);
    }, 0);
  });
}

/**
 * 代码预览
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codePreview(parameter) {
  return axios({
    url: '/sycloud-code/code/preview',
    method: 'get',
    params: parameter,
  });
}

/**
 * 查询列表
 *
 * @author pangu
 * @date 2020/12/23 15:00
 */
export function codeTableList(parameter) {
  return axios({
    url: '/sycloud-code/code/table-list',
    method: 'post',
    params: parameter,
  });
}
