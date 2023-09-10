<template>
    <div :class="['user-layout-wrapper', device]">
        <div class="user-layout-lang">
            <select-lang class="select-lang-trigger" />
        </div>
        <div class="main">
            <div class="header">
                <a href="/">
                    <img src="~@/assets/logo.png" class="logo" alt="logo"/>
                    <span class="title">{{ $t('app.site.title') }}</span>
                </a>
            </div>
            <route-view/>
        </div>

        <div class="footer">
            <div class="links">
                <a href="_self">帮助</a>
                <a href="_self">隐私</a>
                <a href="_self">条款</a>
            </div>
            <div class="copyright">
                Copyright © 2021
                <a target="_blank" href="#">{{ $t('app.site.brand') }}<sup>®</sup></a>
                {{ $t('app.site.copyright') }} {{ $t('app.site.version') }}: 2.6.130
            </div>
        </div>
    </div>
</template>

<script>
    import RouteView from './RouteView';
    import { mixinDevice } from '@/utils/mixin';
    import SelectLang from '@/components/SelectLang';

    export default {
        name: 'UserLayout',
        components: { RouteView, SelectLang },
        mixins: [mixinDevice],
        data() {
            return {};
        },
        mounted() {
            document.body.classList.add('userLayout');
        },
        beforeDestroy() {
            document.body.classList.remove('userLayout');
        },
    };
</script>

<style lang="less" scoped>
.user-layout-wrapper {
  background: #f0f2f5 url(~@/assets/bg.svg) no-repeat 50%;

  .mobile {
    max-width: 368px;
    width: 98%;

  }
}

a {
  text-decoration: none;
}

.desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 12px;
  margin-bottom: 40px;
}

.user-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 260px;
  width: 368px;
  margin: 0 auto;
}

.user-layout-lang {
  width: 100%;
  height: 40px;
  line-height: 44px;
  text-align: right;

  .select-lang-trigger {
    cursor: pointer;
    padding: 12px;
    margin-right: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    vertical-align: middle;
  }
}

.header {
  height: 44px;
  line-height: 44px;
  text-align: center;
  margin: 24px 0;

  .badge {
    position: absolute;
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    margin-left: -12px;
    margin-top: -10px;
    opacity: 0.8;
  }

  .logo {
    height: 44px;
    vertical-align: top;
    margin-right: 16px;
    border-style: none;
  }

  .title {
    font-size: 33px;
    color: rgba(0, 0, 0, 0.85);
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
  }
}

.footer {
  margin: 24px 0;
  text-align: center;

  .links {
    margin-bottom: 8px;
    font-size: 14px;

    a {
      color: rgba(0, 0, 0, 0.45);
      transition: all 0.3s;

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }

  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
