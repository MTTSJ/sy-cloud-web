<template>
    <a-modal
        v-model="visible"
        maskClosable
        class="route-search"
        :closable="false"
        :footer="false"
        :afterClose="reset"
        @keydown.native="onKeydown"
    >
        <a-input v-model.trim="query" ref="input" size="large" allowClear placeholder="菜单搜索" />
        <a-list class="result-container" ref="list">
            <a-list-item
                v-for="(item, index) in result"
                :key="index"
                :class="['result-item', { active: curIndex === index }]"
                ref="listItem"
                @click="jump"
                @mouseenter="curIndex = index"
            >
                <a-icon style="margin: 0 10px" :type="item.icon" />
                <div class="content">
                    <div v-html="item.template" />
                    <div class="description" v-html="item.pathTemplate" />
                </div>
                <a-icon v-show="curIndex === index" slot="actions" type="enter" />
            </a-list-item>
        </a-list>
    </a-modal>
</template>

<script>
    import { cloneDeep, debounce } from 'lodash-es';

    export default {
        name: 'MenuSearch',
        data() {
            return {
                visible: false,
                query: '',
                result: [],
                curIndex: 0,
            };
        },
        computed: {
            routers() {
                const data = cloneDeep(this.$store.state.permission.addRouters);
                const root = data.find(v => v.path === '/');
                const map = new Map();
                walkTree(root, (route, parent) => {
                    route._isLeaf = !route.children?.length;
                    route._title = route.meta?.title || route.name;
                    route._path = parent
                        ? parent._path + ' > ' + route._title
                        : route._title;
                    if (!route.hidden && route._isLeaf) {
                        map.set(route._path, route);
                    }
                });
                return map;
            },
        },
        watch: {
            query: 'onSearch',
            async visible() {
                await this.$nextTick();
                this.$refs.input.focus();
            },
        },
        methods: {
            show() {
                this.visible = true;
            },
            reset() {
                this.query = '';
                this.result = [];
                this.curIndex = 0;
            },
            onSearch: debounce(function(query) {
                if (!query) {
                    return this.reset();
                }
                const result = [];
                const reg = new RegExp(query, 'g');
                const replace = str => str.replace(reg, `<strong style="color: black">${query}</strong>`);
                for (const [key, route] of this.routers) {
                    if (reg.test(key) || reg.test(route.path)) {
                        result.push({
                            template: replace(key),
                            pathTemplate: replace(route.path),
                            path: route.path,
                            icon: route.meta?.icon || 'file-search',
                        });
                    }
                }
                this.result = result;
                this.curIndex = 0;
            }, 200),
            jump() {
                const path = this.result[this.curIndex]?.path;
                if (!path) return;
                this.$router.push(path);
                this.visible = false;
            },
            onKeydown({ keyCode }) {
                switch (keyCode) {
                case 13: // enter
                    this.jump();
                    break;
                case 38: // key up
                    this.curIndex >= 1
                        ? this.curIndex--
                        : this.curIndex = Math.max(this.result.length - 1, 0);
                    this.handleMove();
                    break;
                case 40: // key down
                    this.curIndex + 1 < this.result.length
                        ? this.curIndex++
                        : this.curIndex = 0;
                    this.handleMove();
                    break;
                }
            },
            // 键盘上下键移动到边缘时，元素自动滚动至视野范围内
            handleMove() {
                const curItem = this.$refs.listItem?.[this.curIndex].$el;
                const parent = this.$refs.list.$el;
                if (!curItem || !parent) return;
                const itemTop = getElementTop(curItem);
                const itemBottom = itemTop + curItem.offsetHeight;
                const parentTop = getElementTop(parent);
                const parentBottom = parentTop + parent.offsetHeight;
                if (itemTop <= parentTop || itemBottom >= parentBottom) {
                    curItem.scrollIntoView({ block: 'nearest' });
                }
            },
        },
    };

    /**
     * 遍历树节点
     */
    function walkTree(root, callback, parent = null) {
        for (const route of Array.isArray(root) ? root : [root]) {
            callback(route, parent);
            walkTree(route.children || [], callback, route);
        }
    }

    /**
     * 获取元素相对视窗的真实Y坐标
     */
    function getElementTop(element) {
        let actualTop = element.offsetTop;
        let current = element.offsetParent;

        while (current) {
            actualTop += (current.offsetTop - current.scrollTop);
            current = current.offsetParent;
        }

        return actualTop;
    }
</script>

<style lang="less" scoped>
.route-search::v-deep .ant-modal-content {
  border-radius: 10px;
}
.result-container {
  margin-top: 10px;
  max-height: 300px;
  overflow: auto;
  .result-item {
    cursor: pointer;
    border-color: #f6f6f6;
    &.active {
      background-color: #f6f6f6;
    }
    .content {
      flex-grow: 1;
      .description {
        font-size: 12px;
      }
    }
  }
}
</style>
