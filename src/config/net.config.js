// 默认的接口地址
// 当然你也可以选择自己配置成需要的接口地址，如"https://api.mate.vip'"
// 开发环境地址：http://localhost:10001
// 线上环境地址：http://api.test.sheyu.xin/

const baseURL = process.env.VUE_APP_API;

/**
 * @description 导出网络配置
 **/
module.exports = {
  baseURL,
  // 社交登录后台地址
  socialLoginUrl: `${baseURL}/sycloud-uaa/auth/login`,
  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  // 最长请求时间
  requestTimeout: 10000,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, '200', '0'],
  // 数据状态的字段名称
  statusName: 'code',
  // 状态信息的字段名称
  messageName: 'msg',
};
