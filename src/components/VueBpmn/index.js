import vueBpmn from './index.vue';

vueBpmn.install = Vue => Vue.component(vueBpmn.name, vueBpmn); // 给组件配置install方法

export default vueBpmn;
