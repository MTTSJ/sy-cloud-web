<template>
    <a-layout :class="['layout', device, 'leftmenu-layout']">
        <side-menu
            mode="inline"
            :menus="mainMenus"
            :theme="navTheme"
            :collapsed="false"
            :collapsible="true"
            @menuSelect="menuSelect"
        ></side-menu>
        <a-layout style="position: relative; flex-direction: column">
            <!-- layout header -->
            <global-header
                :mode="layoutMode"
                :menus="menus"
                :theme="navTheme"
                :collapsed="collapsed"
                :device="device"
                @toggle="toggle"
            />
            <a-layout>
                <side-menu
                    :style="{
                        zIndex: 7,
                        position: 'fixed',
                        left: `${collapsed ? collapsedWidth : sideWidth}px`,
                    }"
                    mode="inline"
                    :menus="menus"
                    :theme="light"
                    :collapsed="false"
                    :collapsible="true"
                    @menuSelect="menuSelect"
                ></side-menu>
                <a-layout-content>
                    <multi-tab v-if="multiTab"></multi-tab>
                    <route-view />
                    <!-- layout footer -->
                    <a-layout-footer>
                        <global-footer />
                    </a-layout-footer>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
    import { triggerWindowResizeEvent } from '@/utils/util';
    import { mapState, mapActions } from 'vuex';
    import { mixin, mixinDevice } from '@/utils/mixin';
    import config from '@/config/defaultSettings';

    import RouteView from './RouteView';
    import SideMenu from '@/components/Menu/SideMenu';
    import GlobalHeader from '@/components/GlobalHeader';
    import GlobalFooter from '@/components/GlobalFooter';
    import { convertRoutes } from '@/utils/routeConvert';

    export default {
        name: 'BasicLayout',
        mixins: [mixin, mixinDevice],
        components: {
            RouteView,
            SideMenu,
            GlobalHeader,
            GlobalFooter,
        },
        data() {
            return {
                collapsed: false,
                menus: [],
                mainMenus: [],
            };
        },
        computed: {
            ...mapState({
                // 动态主路由
                mainMenu: state => state.permission.addRouters,
            }),
            contentPaddingLeft() {
                if (!this.fixSidebar || this.isMobile()) {
                    return '0';
                }
                if (this.sidebarOpened) {
                    return '256px';
                }
                return '80px';
            },
            getMenuFirstChildren() {
                return this.menus.map(menu => {
                    const { children: _children, ...rest } = menu;
                    console.log(_children, 'children====');
                    return rest;
                });
            },
        },
        watch: {
            sidebarOpened(val) {
                this.collapsed = !val;
            },
            // 菜单变化
            mainMenu(val) {
                this.setMenus();
            },
        },
        created() {
            this.setMenus();
            /* const routes = convertRoutes(this.mainMenu.find(item => item.path === '/'))
    this.menus = (routes && routes.children) || [] */
            this.collapsed = !this.sidebarOpened;
        },
        mounted() {
            const userAgent = navigator.userAgent;
            if (userAgent.indexOf('Edge') > -1) {
                this.$nextTick(() => {
                    this.collapsed = !this.collapsed;
                    setTimeout(() => {
                        this.collapsed = !this.collapsed;
                    }, 16);
                });
            }
        },
        methods: {
            ...mapActions(['setSidebar']),
            // 重新生成
            setMenus() {
                const routes = convertRoutes(
                    this.mainMenu.find(item => item.path === '/'),
                );
                this.menus = (routes && routes.children) || [];
                this.mainMenus = this.getMenuFirstChildren(this.menus);
            },
            toggle() {
                this.collapsed = !this.collapsed;
                this.setSidebar(!this.collapsed);
                triggerWindowResizeEvent();
            },

            paddingCalc() {
                let left = '';
                if (this.sidebarOpened) {
                    left = this.isDesktop() ? '256px' : '80px';
                } else {
                    left = (this.isMobile() && '0') || (this.fixSidebar && '80px') || '0';
                }
                return left;
            },
            menuSelect() {},
            drawerClose() {
                this.collapsed = false;
            },
        },
    };
</script>

<style lang="less">
/*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
