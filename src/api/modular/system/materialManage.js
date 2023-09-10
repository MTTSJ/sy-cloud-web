import { axios } from '@/utils/request';

/**
 * 新增素材组
 */
export function addMaterialGroup(parameter) {
  return axios({
    url: '/mate-system/material-group/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 获取素材组列表
 */
export function getMaterialGroupList(parameter) {
  return axios({
    url: '/mate-system/material-group/list',
    method: 'get',
    params: parameter,
  });
}

/**
 * 删除素材组
 */
export function deleteMaterialGroup(parameter) {
  return axios({
    url: '/mate-system/material-group/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 获取素材分页列表
 */
export function getPage(parameter) {
  return axios({
    url: '/mate-system/material/page',
    method: 'get',
    params: parameter,
  });
}

export function deleteMaterial(ids) {
  return axios({
    url: '/mate-system/material/del',
    method: 'post',
    params: { ids },
  });
}

export function moveMaterialToGroup(groupId, ids) {
  return axios({
    url: '/mate-system/material/move-group',
    method: 'post',
    params: { groupId, ids },
  });
}

export function renameMaterialGroup(groupId, name) {
  return axios({
    url: '/mate-system/material-group/rename',
    method: 'post',
    params: { id: groupId, name },
  });
}

export function renameMaterial(materialId, name) {
  return axios({
    url: '/mate-system/material/rename',
    method: 'post',
    params: { id: materialId, name },
  });
}

export function uploadMaterialThumb(file, materialId, onProgress) {
  const form = new FormData();
  form.append('file', file);
  form.append('materialId', materialId);
  return axios({
    url: '/mate-system/material/upload-thumb',
    method: 'post',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => onProgress && onProgress(event),
  });
}

export function uploadMaterial(file, groupId, onProgress) {
  const form = new FormData();
  form.append('file', file);
  if (groupId) {
    form.append('groupId', groupId);
  }
  return axios({
    url: '/mate-system/material/upload',
    method: 'post',
    data: form,
    timeout: 360000,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => onProgress && onProgress(event),
  });
}
