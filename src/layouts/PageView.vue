<template>
    <div id="pageView" ref="page" class="page-view">
        <!-- pageHeader , route meta :true on hide -->
        <page-header
            v-if="!$route.meta.hiddenHeaderContent"
            :title="pageTitle"
            :logo="logo"
            :avatar="avatar"
            :loading="loading"
            :fullscreen="fullscreen"
            @refresh="onRefresh"
            @fullscreen="onFullscreen"
        >
            <slot slot="action" name="action"></slot>
            <slot slot="content" name="headerContent"></slot>
            <div slot="content" v-if="!this.$slots.headerContent && description">
                <p style="font-size: 14px;color: rgba(0,0,0,.65)">{{ description }}</p>
                <div class="link">
                    <template v-for="(link, index) in linkList">
                        <a
                            :key="index"
                            @click="link.callback && link.callback()"
                        >
                            <a-icon :type="link.icon" />
                            <span>{{ link.title }}</span>
                        </a>
                    </template>
                </div>
            </div>
            <slot slot="extra" name="extra">
                <div class="extra-img">
                    <img v-if="typeof extraImage !== 'undefined'" :src="extraImage" />
                </div>
            </slot>
            <div slot="pageMenu">
                <div class="page-menu-search" v-if="search">
                    <a-input-search
                        style="width: 80%; max-width: 522px;"
                        placeholder="请输入..."
                        size="large"
                        enterButton="搜索"
                    />
                </div>
                <div class="page-menu-tabs" v-if="tabs && tabs.items">
                    <!-- @change="callback" :activeKey="activeKey" -->
                    <a-tabs :tabBarStyle="{ margin: 0 }" :activeKey="tabs.active()" @change="tabs.callback">
                        <a-tab-pane v-for="item in tabs.items" :tab="item.title" :key="item.key"></a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </page-header>
        <div class="content">
            <div class="page-header-index-wide">
                <slot v-if="!loading">
                    <!-- keep-alive  -->
                    <keep-alive v-if="multiTab">
                        <router-view ref="content" />
                    </keep-alive>
                    <router-view v-else ref="content" />
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import PageHeader from '@/components/PageHeader';
    import Fullscreen from '@/utils/fullScreen';

    export default {
        name: 'PageView',
        components: {
            PageHeader,
        },
        props: {
            avatar: {
                type: String,
                default: null,
            },
            title: {
                type: [String, Boolean],
                default: true,
            },
            logo: {
                type: String,
                default: null,
            },
            directTabs: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                pageTitle: null,
                description: null,
                linkList: [],
                extraImage: '',
                search: false,
                loading: false,
                fullscreen: false,
                tabs: {},
            };
        },
        computed: {
            ...mapState({
                multiTab: state => state.app.multiTab,
            }),
        },
        mounted() {
            this.tabs = this.directTabs;
            Fullscreen.addListener(this.onFullscreenchange);
            this.getPageMeta();
        },
        beforeDestroy() {
            Fullscreen.removeListener(this.onFullscreenchange);
        },
        updated() {
            this.getPageMeta();
        },
        methods: {
            getPageMeta() {
                // eslint-disable-next-line
      //文字样式//(typeof(this.title) === 'string' || !this.title) ? this.title : this.$route.meta.title
                // 为了简洁改为无
                this.pageTitle = '';

                const content = this.$refs.content;
                if (content) {
                    if (content.pageMeta) {
                        Object.assign(this, content.pageMeta);
                    } else {
                        this.description = content.description;
                        this.linkList = content.linkList;
                        this.extraImage = content.extraImage;
                        this.search = content.search === true;
                        this.tabs = content.tabs;
                    }
                }
            },
            onRefresh() {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                }, 100);
            },
            onFullscreen(action) {
                if (action === 'enter') {
                    const success = Fullscreen.enterFullscreen(this.$refs.page);
                    if (!success) {
                        this.$message.warning('对不起，您的浏览器不支持全屏');
                    }
                } else {
                    Fullscreen.outFullScreen();
                }
            },
            onFullscreenchange(e) {
                if (e.target.id === 'pageView') {
                    this.fullscreen = !this.fullscreen;
                }
            },
        },
    };
</script>

<style lang="less" scoped>
.page-view {
  background-color: #f0f2f5;
}
.content {
  margin: 16px;
  .link {
    margin-top: 16px;
    &:not(:empty) {
      margin-bottom: 16px;
    }
    a {
      margin-right: 32px;
      height: 24px;
      line-height: 24px;
      display: inline-block;
      i {
        font-size: 24px;
        margin-right: 8px;
        vertical-align: middle;
      }
      span {
        height: 24px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
.page-menu-search {
  text-align: center;
  margin-bottom: 16px;
}
.page-menu-tabs {
  margin-top: 48px;
}

.extra-img {
  margin-top: -60px;
  text-align: center;
  width: 195px;

  img {
    width: 100%;
  }
}

.mobile {
  .extra-img {
    margin-top: 0;
    text-align: center;
    width: 96px;

    img {
      width: 100%;
    }
  }
}
</style>
