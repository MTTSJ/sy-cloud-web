import { axios } from '@/utils/request';

/**
 * 获取用户列表
 *
 * @author pangu
 * @date 2020/4/26 12:08
 */
export function getPage(parameter) {
  return axios({
    url: '/mate-system/user/page',
    method: 'get',
    params: parameter,
  });
}

/**
 * 增加用户
 *
 * @author pangu
 * @date 2020/5/5 02:08
 */
export function sysUserAdd(parameter) {
  return axios({
    url: '/mate-system/user/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 编辑用户
 *
 * @author pangu
 * @date 2020/5/5 02:08
 */
export function sysUserEdit(parameter) {
  return axios({
    url: '/mate-system/user/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 获取用户详情
 *
 * @author pangu
 * @date 2020/5/5 19:55
 */
export function sysUserDetail(parameter) {
  return axios({
    url: '/mate-system/user/get',
    method: 'get',
    params: parameter,
  });
}

/**
 * 删除用户
 *
 * @author pangu
 * @date 2020/5/7 19:31
 */
export function sysUserDelete(parameter) {
  return axios({
    url: '/mate-system/user/del',
    method: 'post',
    params: parameter,
  });
}

/**
 * 拥有角色
 *
 * @author pangu
 * @date 2020/6/3 11:58
 */
export function sysUserOwnRole(parameter) {
  return axios({
    url: '/mate-system/user/get-role',
    method: 'get',
    params: parameter,
  });
}

/**
 * 授权角色
 *
 * @author pangu
 * @date 2020/5/26 23:59
 */
export function sysUserGrantRole(parameter) {
  return axios({
    url: '/mate-system/user/set-role',
    method: 'post',
    data: parameter,
  });
}

/**
 * 拥有数据
 *
 * @author pangu
 * @date 2020/6/2 23:14
 */
export function sysUserOwnData(parameter) {
  return axios({
    url: '/mate-system/user/get-data-scope',
    method: 'get',
    params: parameter,
  });
}

/**
 * 授权数据
 *
 * @author pangu
 * @date 2020/6/2 23:15
 */
export function sysUserGrantData(parameter) {
  return axios({
    url: '/mate-system/user/set-data-scope',
    method: 'post',
    data: parameter,
  });
}

/**
 * 修改状态
 *
 * @author pangu
 * @date 2020/6/23 21:36
 */
export function sysUserChangeStatus(parameter) {
  return axios({
    url: '/mate-system/user/set-status',
    method: 'post',
    data: parameter,
  });
}

/**
 * 重置密码
 *
 * @author pangu
 * @date 2020/6/23 22:04
 */
export function sysUserResetPwd(parameter) {
  return axios({
    url: '/sysUser/resetPwd',
    method: 'post',
    data: parameter,
  });
}

/**
 * 修改密码
 *
 * @author pangu
 * @date 2020/6/23 22:04
 */
export function userChangePwd(parameter) {
  return axios({
    url: '/mate-system/user/set-password',
    method: 'post',
    data: parameter,
  });
}

/**
 * 修改密码
 *
 * @author pangu
 * @date 2020/6/25 00:25
 */
export function sysUserUpdatePwd(parameter) {
  return axios({
    url: '/sysUser/updatePwd',
    method: 'post',
    data: parameter,
  });
}

/**
 * 用户选择器
 *
 * @author pangu
 * @date 2020/6/25 00:25
 */
export function sysUserSelector(parameter) {
  return axios({
    url: '/sysUser/selector',
    method: 'get',
    params: parameter,
  });
}

/**
 * 修改头像
 *
 * @author pangu
 * @date 2020/9/20 2:21
 */
export function sysUserUpdateAvatar(parameter) {
  return axios({
    url: '/mate-system/user/set-avatar',
    method: 'post',
    data: parameter,
  });
}

/**
 * 更新基本信息
 *
 * @author pangu
 * @date 2020/9/20 03:12
 */
export function sysUserUpdateInfo(parameter) {
  return axios({
    url: '/mate-system/user/set',
    method: 'post',
    data: parameter,
  });
}

/**
 * 工作流用户列表
 */
export function flowUserList(parameter) {
  return axios({
    url: '/mate-system/user/flow-user-list',
    method: 'get',
    params: parameter,
  });
}
