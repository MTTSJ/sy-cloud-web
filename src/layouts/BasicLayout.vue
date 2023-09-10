<template>
    <a-layout ref="layout" :class="['layout', device]">
        <!-- SideMenu -->
        <a-drawer
            v-if="isMobile()"
            placement="left"
            :wrapClassName="`drawer-sider ${navTheme}`"
            :closable="false"
            :visible="collapsed"
            @close="drawerClose"
        >
            <side-menu
                mode="inline"
                :menus="menus"
                :theme="navTheme"
                :collapsed="false"
                :collapsible="true"
                @menuSelect="menuSelect"
            ></side-menu>
        </a-drawer>

        <side-menu
            v-else-if="isSideMenu()"
            mode="inline"
            :menus="sideMenus"
            :theme="navTheme"
            :collapsed="collapsed"
            :collapsible="true"
        ></side-menu>
        <split-menu
            v-else-if="isSplitMenu()"
            :collapsed.sync="collapsed"
            :menu-data="menus"
            :theme="navTheme"
            :class="{ 'split-menu-fixed': fixSiderbar }"
            :width="236"
        ></split-menu>

        <a-layout
            :class="[layoutMode, `content-width-${contentWidth}`]"
            :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }"
        >
            <!-- layout header -->
            <global-header
                :mode="layoutMode"
                :menus="menus"
                :theme="headerTheme"
                :collapsed="collapsed"
                :device="device"
                :fullscreen="fullscreen"
                @toggle="toggle"
                @fullscreen="onFullscreen"
            />

            <!-- layout content -->
            <a-layout-content
                :style="{ height: '100%', paddingTop: fixedHeader ? '64px' : '0' }"
            >
                <multi-tab v-if="multiTab"></multi-tab>
                <transition name="page-transition">
                    <route-view />
                </transition>
            </a-layout-content>

            <!-- layout footer -->
            <a-layout-footer>
                <global-footer />
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script>
    import { triggerWindowResizeEvent } from '@/utils/util';
    import { mapState, mapActions } from 'vuex';
    import { mixin, mixinDevice } from '@/utils/mixin';
    import RouteView from './RouteView';
    import SideMenu from '@/components/Menu/SideMenu';
    import GlobalHeader from '@/components/GlobalHeader';
    import GlobalFooter from '@/components/GlobalFooter';
    import { convertRoutes } from '@/utils/routeConvert';
    import SplitMenu from '@/components/Menu/split-menu';
    import Fullscreen from '@/utils/fullScreen';

    export default {
        name: 'BasicLayout',
        mixins: [mixin, mixinDevice],
        components: {
            SplitMenu,
            RouteView,
            SideMenu,
            GlobalHeader,
            GlobalFooter,
        },
        data() {
            return {
                collapsed: false,
                menus: [],
                fullscreen: false,
            };
        },
        provide() {
            return {
                layout: this,
            };
        },
        computed: {
            ...mapState({
                // 动态主路由
                mainMenu: state => state.permission.addRouters,
            }),
            headerTheme() {
                return this.layoutMode === 'mixmenu' ? 'light' : this.navTheme;
            },
            contentPaddingLeft() {
                if (!this.fixSidebar || this.isMobile()) {
                    return '0';
                }
                if (this.sidebarOpened) {
                    return this.layoutMode === 'mixmenu' ? '180px' : '236px';
                }
                return this.layoutMode === 'split-menu' ? '73px' : '80px';
            },
            sideMenus() {
                if (this.layoutMode === 'mixmenu') {
                    const route = this.menus.find(item => item.children && this.containPath(item.children, this.$route.path));
                    return (route && route.children) || [];
                }
                return this.menus;
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
            Fullscreen.addListener(this.onFullscreenchange);
        },
        beforeDestroy() {
            Fullscreen.removeListener(this.onFullscreenchange);
        },
        methods: {
            ...mapActions(['setSidebar']),
            // 重新生成
            setMenus() {
                const routes = convertRoutes(this.mainMenu.find(item => item.path === '/'));
                this.menus = (routes && routes.children) || [];
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
            containPath(menuList, path) {
                for (let i = 0; i < menuList.length; i++) {
                    const route = menuList[i];
                    if (route.path === path) {
                        return true;
                    } else if (route.children && route.children.length > 0) {
                        const childrenContain = this.containPath(route.children, path);
                        if (childrenContain) {
                            return true;
                        }
                    }
                }
                return false;
            },
            menuSelect() {},
            drawerClose() {
                this.collapsed = false;
            },
            onFullscreen(action) {
                if (action === 'enter') {
                    const body = document.querySelector('body');
                    const success = Fullscreen.enterFullscreen(body);
                    if (!success) {
                        this.$message.warning('对不起，您的浏览器不支持全屏');
                    }
                } else {
                    Fullscreen.outFullScreen();
                }
            },
            onFullscreenchange(e) {
                if (e.target.tagName === 'BODY' || e.target.tagName === 'body') {
                    this.fullscreen = !this.fullscreen;
                }
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
.split-menu-fixed {
  position: fixed !important;
  height: 100%;
}
.split-menu {
  z-index: 999;
}
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
