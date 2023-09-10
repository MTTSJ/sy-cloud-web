import axios from '@/utils/request';

export function getCodeImg() {
  return axios({
    url: 'sycloud-uaa/auth/code',
    method: 'get',
  });
}
