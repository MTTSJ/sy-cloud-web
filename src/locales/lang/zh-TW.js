import antd from 'ant-design-vue/es/locale-provider/zh_CN';
import momentTW from 'moment/locale/zh-tw';
import user from './zh-TW/user';

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentTW,
};

const locale = {
  'message': '-',
  'menu.home': '主頁',
  'menu.dashboard': '儀表盤',
  'menu.dashboard.analysis': '分析頁',
  'menu.dashboard.monitor': '監控頁',
  'menu.dashboard.workplace': '工作臺',
  'app.site.title': '邁特雲商業版',
  'app.site.index': '首页',
  'app.site.plus': '購買',
  'app.site.copyright': '道天地公司 版權所有',
  'app.site.brand': '邁特雲',
  'app.site.version': '最新版本號',
  'app.site.loading-desc': 'Artemis Plus 快速開發平臺',
};

export default {
  ...components,
  ...locale,
  ...user,
};
