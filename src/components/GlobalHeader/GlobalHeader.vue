<template>
    <transition name="showHeader">
        <div v-if="visible" class="header-animat">
            <a-layout-header
                v-if="visible"
                :class="[
                    fixedHeader && 'ant-header-fixedHeader',
                    sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed',
                ]"
                :style="{ padding: `0 0 0 ${siderWidth}` }"
            >
                <div
                    v-if="mode === 'sidemenu' || mode === 'splitmenu'"
                    class="header menu-container"
                    :style="
                        device === 'mobile' ? { 'justify-content': 'space-between' } : {}
                    "
                >
                    <a-icon
                        v-if="device === 'mobile'"
                        class="trigger"
                        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                        @click="toggle"
                    />
                    <a-icon
                        v-else
                        class="trigger"
                        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                        @click="toggle"
                    />

                    <a-menu
                        v-if="device !== 'mobile'"
                        mode="horizontal"
                        :default-selected-keys="this.defApp"
                        class="header-menu"
                    >
                        <a-menu-item
                            v-for="item in userInfo.apps"
                            :key="item.code"
                            @click="switchApp(item.code)"
                        >
                            <a-icon :type="item.icon" style="margin-right: 0" />
                            {{ item.name }}
                        </a-menu-item>
                    </a-menu>

                    <user-menu
                        :fullscreen="fullscreen"
                        @fullscreen="(action) => $emit('fullscreen', action)"
                    />
                </div>
                <div v-else :class="['top-nav-header-index', theme]">
                    <div :class="['header-index-wide', mode]">
                        <div class="header-index-left">
                            <logo
                                class="top-nav-header"
                                v-if="mode !== 'mixmenu'"
                                :show-title="device !== 'mobile'"
                            />
                            <a-icon
                                class="trigger"
                                :type="collapsed ? 'menu-fold' : 'menu-unfold'"
                                @click="toggle"
                            />
                            <s-menu
                                v-if="device !== 'mobile'"
                                mode="horizontal"
                                :menu="menuList"
                                :theme="mixTheme"
                            />
                        </div>
                        <user-menu
                            :fullscreen="fullscreen"
                            @fullscreen="(action) => $emit('fullscreen', action)"
                            class="header-index-right"
                        ></user-menu>
                    </div>
                </div>
            </a-layout-header>
        </div>
    </transition>
</template>

<script>
    import UserMenu from '../tools/UserMenu.vue';
    import SMenu from '../Menu/';
    import Logo from '../tools/Logo';
    import { mixin } from '@/utils/mixin';
    import { mapActions, mapGetters } from 'vuex';
    import { ALL_APPS_MENU } from '@/store/mutation-types';
    import Vue from 'vue';
    import { message } from 'ant-design-vue/es';

    export default {
        name: 'GlobalHeader',
        mixins: [mixin],
        components: {
            UserMenu,
            SMenu,
            Logo,
        },
        computed: {
            ...mapGetters(['userInfo']),
            menuList() {
                const rootMenu = this.menus.map(item => {
                    const route = {
                        ...item,
                        redirect: this.getRedirectUrl(item),
                    };
                    delete route.children;
                    return route;
                });
                return this.mode === 'mixmenu' ? rootMenu : this.menus;
            },
            mixTheme() {
                return this.mode === 'mixmenu' ? 'light' : this.theme;
            },
            siderWidth() {
                if (!this.fixedHeader || this.layoutMode === 'topmenu') {
                    return '0';
                }
                if (this.sidebarOpened) {
                    return this.layoutMode === 'mixmenu' ? '180px' : '236px';
                }
                return this.layoutMode === 'splitmenu' ? '73px' : '80px';
            },
        },
        created() {
            this.defApp.push(Vue.ls.get(ALL_APPS_MENU)[0].code);
        },
        props: {
            mode: {
                type: String,
                // sidemenu, topmenu
                default: 'sidemenu',
            },
            menus: {
                type: Array,
                required: true,
            },
            theme: {
                type: String,
                required: false,
                default: 'dark',
            },
            collapsed: {
                type: Boolean,
                required: false,
                default: false,
            },
            device: {
                type: String,
                required: false,
                default: 'desktop',
            },
            fullscreen: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                visible: true,
                oldScrollTop: 0,
                defApp: [],
            };
        },
        mounted() {
            document.addEventListener('scroll', this.handleScroll, { passive: true });
        },
        methods: {
            ...mapActions(['MenuChange']),
            onFullscreen() {
                console.log('screen');
            },
            /**
             * 应用切换
             */
            switchApp(appCode) {
                this.defApp = [];
                const applicationData = this.userInfo.apps.filter(item => item.code === appCode);
                const hideMessage = message.loading('应用切换中...', 0);
                this.MenuChange(applicationData[0])
                    .then(res => {
                        hideMessage();
                        // eslint-disable-next-line handle-callback-err
                    })
                    .catch(err => {
                        message.error(err + '应用切换异常');
                    });
            },
            handleScroll() {
                if (!this.autoHideHeader) {
                    return;
                }

                const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
                if (!this.ticking) {
                    this.ticking = true;
                    requestAnimationFrame(() => {
                        if (this.oldScrollTop > scrollTop) {
                            this.visible = true;
                        } else if (scrollTop > 300 && this.visible) {
                            this.visible = false;
                        } else if (scrollTop < 300 && !this.visible) {
                            this.visible = true;
                        }
                        this.oldScrollTop = scrollTop;
                        this.ticking = false;
                    });
                }
            },
            toggle() {
                this.$emit('toggle');
            },
            getRedirectUrl(route) {
                if (route.redirect) {
                    return route.redirect;
                } else if (route.children && route.children.length > 0) {
                    return this.getRedirectUrl(route.children[0]);
                }
                return route.path;
            },
        },
        beforeDestroy() {
            document.body.removeEventListener('scroll', this.handleScroll, true);
        },
    };
</script>

<style lang="less">
@import '../index.less';

.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
</style>

<style lang="stylus" scoped>
.menu-container
  display flex
  .header-menu
    font-size 16px
    border-bottom 0px
    line-height 62px
    flex-grow 1
    & >>> .ant-menu-item
      padding 0
      &:not(:last-child)
        margin-right 20px
</style>
