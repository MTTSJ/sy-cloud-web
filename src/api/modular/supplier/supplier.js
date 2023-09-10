/**
 * 厂商管理页面
 *
 * @author mtt
 * @date 2023/8/26
 */
import { axios } from '@/utils/request';

/**
 * 厂商管理查询列表
 *
 * @author pangu
 * @date 2020/8/26 00:17
 */
export function spmCompanyList(parameter) {
  return axios({
    url: '/sycloud-biz/spmCompany/page',
    method: 'post',
    params: parameter,
  });
}
export function updateSupplierStatus(parameter) {
  return axios({
    url: '/sycloud-biz/spmCompany/updateState',
    method: 'post',
    params: parameter,
  });
}
export function enumList(parameter) {
  return axios({
    url: '/mate-system/dict/get-sub-list',
    // method: 'post',
    params: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function addSupplier(parameter) {
  let companyType = '';
  parameter.companyType.map((item, index) => {
    companyType += item + ',';
  });
  parameter.companyType = companyType.substring(0, companyType.length - 1);
  return axios({
    url: '/sycloud-biz/spmCompany/add',
    method: 'post',
    params: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function updateSupplier(params) {
  params.longitude = params.dz.lng;
  params.latitude = params.dz.lat;
  params.address = params.dz.address;
  let companyType = '';
  if (typeof params.companyType === 'string') {
    companyType = params.companyType;
  } else {
    params.companyType.map((item, index) => {
      companyType += item + ',';
    });
    companyType = companyType.substring(0, companyType.length - 1);
  }
  params.companyType = companyType;
  return axios({
    url: '/sycloud-biz/spmCompany/update',
    method: 'post',
    params: params,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
// 厂商管理详情查询
export function getSupplierDetail(parameter) {
  return axios({
    url: '/sycloud-biz/spmCompany/get',
    method: 'get',
    params: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function queryProvince(parameter) {
  return axios({
    url: '/mate-system/region/tree3',
    method: 'get',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
// 饲料管理列表查询
export function fodderList(parameter) {
  return axios({
    url: '/sycloud-biz/spmfeed/listPage',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function feedListAll(parameter) {
  return axios({
    url: '/sycloud-biz/feedFactory/list',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function approvalFeed(parameter) {
  return axios({
    url: '/sycloud-biz/spmfeed/updateStatus',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function removeFeed(parameter) {
  return axios({
    url: '/sycloud-biz/spmfeed/delete',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function queryFodderDetail(parameter) {
  return axios({
    url: '/sycloud-biz/spmfeed/detail',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function fakeSubmitFeed(parameter) {
  return axios({
    url: '/sycloud-biz/spmfeed/save',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function farmerList(parameter) {
  return axios({
    url: '/sycloud-biz/customer/page',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function updateCustomerStatus(parameter) {
  return axios({
    url: '/sycloud-biz/customer/updateStatus',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}

export function queryFarmerDetail(parameter) {
  return axios({
    url: '/sycloud-biz/customer/detail',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}

export function breedBaseByCustomer(parameter) {
  return axios({
    url: '/sycloud-biz/breedingBase/pageByCustomer',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
export function authInfo(parameter) {
  return axios({
    url: '/sycloud-biz/customer/authInfo',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}

export function queryCustomerOtherInfo(parameter) {
  return axios({
    url: '/sycloud-biz/customer/getExtendInfo',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}

export function addCustomerOtherInfo(parameter) {
  return axios({
    url: '/sycloud-biz/customer/editExtendInfo',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}

export function baseList(parameter) {
  return axios({
    url: '/sycloud-biz/breedingBase/page',
    method: 'post',
    data: parameter,
    headers: {
      'Mate-Auth': sessionStorage.getItem('currentUser')
        ? JSON.parse(sessionStorage.getItem('currentUser')).accessToken
        : '',
    },
  });
}
