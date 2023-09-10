<template>
    <a-layout-sider :width="collapsed ? 57 + 16 : width" class="split-menu" theme="light">
        <div :class="['root-menu', theme]">
            <img class="logo" src="@/assets/logo.png"/>
            <div class="menu-list">
                <div
                    :class="['menu-list-item', { active: index === active }]"
                    v-for="(item, index) in rootMenuData"
                    :key="index"
                    @click="toggleRoot(index)"
                >
                    <a-icon :type="item.meta.icon"/>
                    <div class="title">{{ item.meta.title.length > 3 ? item.meta.title.substring(0, 2) : item.meta.title }}</div>
                </div>
            </div>
        </div>
        <div class="children-menu" :style="`width: ${collapsed ? 0 : width - 57 - 16}px;`">
            <div class="header">
                <h1 class="title">{{ $t('app.site.title') }}</h1>
                <h3 class="subtitle" :style="`width: ${collapsed ? 0 : width - 57 - 16}px;`">
                    {{ subTitle }}
                </h3>
            </div>
            <s-menu
                class="s-menu"
                :menu="subMenuData"
                theme="light"
                :style="`width: ${collapsed ? 0 : width - 57 - 16 - 1}px;`"
            ></s-menu>
        </div>
    </a-layout-sider>
</template>

<script>
    import SMenu from '../index';

    export default {
        name: 'SplitMenu',
        components: { SMenu },
        props: {
            menuData: {
                type: Array,
                default: () => [],
            },
            collapsed: {
                type: Boolean,
                default: false,
            },
            width: {
                type: Number,
                default: 250,
            },
            theme: {
                type: String,
                default: 'dark',
            },
        },
        watch: {
            $route: function(value) {
                this.setActive(value);
            },
            menuData() {
                this.setActive(this.$route);
            },
        },
        mounted() {
            this.setActive(this.$route);
        },
        data() {
            return {
                active: 0,
            };
        },
        computed: {
            rootMenuData() {
                const { menuData } = this;
                return menuData.filter(item => item.hidden === undefined || !item.hidden);
            },
            subMenuData() {
                const { active, menuData } = this;
                return menuData[active].children;
            },
            subTitle() {
                const { rootMenuData, active } = this;
                if (rootMenuData[active]) {
                    return rootMenuData[active].meta.title;
                }
                return '——';
            },
        },
        methods: {
            toggleRoot(index) {
                this.active = index;
                const activeRootRoute = this.rootMenuData[index];
                if (activeRootRoute) {
                    const redirectPath = this.getRedirectUrl(activeRootRoute);
                    this.$router.push(redirectPath);
                }
                this.$emit('update:collapsed', false);
            },
            /**
             * 设置当前激活的一级菜单
             * @param route
             */
            setActive(route) {
                const { includeRoute, rootMenuData } = this;
                let active = 0;
                for (let i = 0; i < rootMenuData.length; i++) {
                    if (includeRoute(rootMenuData[i].children, route)) {
                        active = i;
                        break;
                    }
                }
                this.active = active;
            },
            getRedirectUrl(route) {
                if (route.redirect) {
                    return route.redirect;
                } else if (route.children && route.children.length > 0) {
                    return this.getRedirectUrl(route.children[0]);
                }
                return route.path;
            },
            /**
             * 判断 route 是否在 menuData 树数据中
             * @param menuData
             * @param route
             * @returns {boolean}
             */
            includeRoute(menuData, route) {
                for (let i = 0; i < menuData.length; i++) {
                    const current = menuData[i];
                    if (route.path === current.path) {
                        return true;
                    } else if (current.children && current.children.length > 0) {
                        const include = this.includeRoute(current.children, route);
                        if (include) {
                            return include;
                        }
                    }
                }
                return false;
            },
        },
    };
</script>

<style scoped lang="less">
.split-menu {
  display: flex;
  /*box-shadow: 2px 0px 10px 4px rgba(0 ,0 ,0, 0.2);*/
  border-right: 1px solid rgba(0, 0, 0, 0.1);

  .root-menu {
    background-color: #001628;
    display: inline-block;
    height: 100%;
    vertical-align: top;
    padding: 0 8px;
    border-right: 1px solid #e0e0e0;

    &.light {
      background-color: white;
      color: black;

      .menu-list-item {
        color: #383838;

        &.active {
          color: white;
        }
      }
    }

    .logo {
      width: 55px;
      margin: 16px 0;
    }

    .menu-list {
      &-item {
        color: white;
        text-align: center;
        margin: 8px -8px;
        padding: 4px 0;
        cursor: pointer;

        &.active {
          background-color: @primary-color;
        }
      }
    }
  }

  .children-menu {
    flex: 1;
    transition: 0.25s width ease-in-out;
    display: inline-block;
    overflow-x: hidden;

    .header {
      height: 64px;
      position: relative;
      line-height: 64px;
      box-shadow: none;
    }

    .s-menu {
      margin-top: 20px;
      border-right: 0;
      transition: width 0.25s ease-in-out;
    }

    .title,
    .subtitle {
      text-align: center;
      overflow: hidden;
      margin-bottom: 0;
    }

    .title {
      font-size: 20px;
      margin-bottom: 0;
      margin-left: 10px;
      white-space: nowrap;
    }

    .subtitle {
      color: rgba(0, 0, 0, 0.65);
      white-space: nowrap;
      font-size: 13px;
      transform: translateY(-50%);
      width: 100%;
      display: flex;
      transition: width 0.25s ease-in-out;

      &:after,
      &:before {
        border-top: 1px solid #e0e0e0;
        content: '';
        flex: 1;
        margin: auto;
      }

      &:before {
        margin-right: 16px;
      }

      &:after {
        margin-left: 16px;
      }
    }
  }
}
</style>
