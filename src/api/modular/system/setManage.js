import { axios } from '@/utils/request';

export function getOss(parameter) {
  return axios({
    url: '/mate-system/set/oss/get',
    method: 'get',
    params: parameter,
  });
}

export function ossCheck(parameter) {
  return axios({
    url: '/mate-system/set/oss/check',
    method: 'get',
    params: parameter,
  });
}

export function getOssSecret(parameter) {
  return axios({
    url: '/mate-system/set/oss/get-secret',
    method: 'get',
    params: parameter,
  });
}

export function saveOss(parameter) {
  return axios({
    url: '/mate-system/set/oss/set',
    method: 'post',
    data: parameter,
  });
}

export function getSms(parameter) {
  return axios({
    url: '/mate-system/set/sms/get',
    method: 'get',
    params: parameter,
  });
}

export function saveSms(parameter) {
  return axios({
    url: '/mate-system/set/sms/set',
    method: 'post',
    data: parameter,
  });
}

export function smsCheck(parameter) {
  return axios({
    url: '/mate-system/set/sms/check',
    method: 'get',
    params: parameter,
  });
}
