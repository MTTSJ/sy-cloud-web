import { mapState, mapActions } from 'vuex';
import { ALL_APPS_MENU } from '@/store/mutation-types';
import Vue from 'vue';
import { message } from 'ant-design-vue';

const i18nMixin = {
  computed: {
    ...mapState({
      currentLang: state => state.app.lang,
    }),
  },
  methods: {
    ...mapActions(['MenuChange']),
    setLang(lang) {
      let path = window.location.pathname;
      if (path !== '/user/login') {
        const application = Vue.ls.get(ALL_APPS_MENU);
        const hideMessage = message.loading('应用切换中...', 0);
        this.MenuChange(application[0])
          .then(res => {
            hideMessage();
            // 菜单更新成功后刷新页面
            location.reload();
          })
          .catch(err => {
            message.error(err + '应用切换异常');
          });
      }
      this.$store.dispatch('setLang', lang);
    },
  },
};

export default i18nMixin;
