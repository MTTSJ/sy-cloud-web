import antd from 'ant-design-vue/es/locale-provider/zh_CN';
import momentCN from 'moment/locale/zh-cn';
import user from './zh-CN/user';

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN,
};

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.analysis': '分析页',
  'menu.dashboard.monitor': '监控页',
  'menu.dashboard.workplace': '工作台',
  'app.site.title': '舍羽农信',
  'app.site.index': '首页',
  'app.site.plus': '购买',
  'app.site.copyright': '舍羽农信 版权所有',
  'app.site.brand': '舍羽农信',
  'app.site.version': '最新版本号',
  'app.site.loading-desc': '舍羽农信 开发平台',
};

export default {
  ...components,
  ...locale,
  ...user,
};
