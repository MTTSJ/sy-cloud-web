<template>
    <div :class="['manager', { small: needHidden, mobile: isMobile() }]">
        <a-spin :spinning="!!progress">
            <div class="upload-tip" slot="indicator">
                <a-progress v-if="progress.type === 'progress'" type="circle" :percent="progress.percent" :width="88" />
                <a-icon type="loading" v-else />
                <div class="tip">{{ progress.text }}</div>
            </div>
            <a-tabs class="category" v-model="category">
                <a-tab-pane :key="item.key" :tab="item.name" v-for="item in categories"></a-tab-pane>
            </a-tabs>
            <div class="container">
                <group
                    :data-source="groupList"
                    :selected="group"
                    @select="onGroupSelect"
                    @add="onGroupAdd"
                    @rename="onGroupRename"
                    @delete="onGroupDelete"
                />
                <material
                    :data-source="materialList"
                    :group-list="groupList"
                    :group="group"
                    :category="category"
                    :loading="materialLoading"
                    :pagination="pagination"
                    :select-mode="selectMode"
                    @move="onMaterialMove"
                    @upload="onMaterialUpload"
                    @search="onMaterialSearch"
                    @rename="onMaterialRename"
                    @delete="onMaterialDelete"
                    @select="onMaterialSelect"
                />
            </div>
        </a-spin>
    </div>
</template>

<script>
    import Group from './Group';
    import Material from './Material';
    import { mixinDevice } from '@/utils/mixin';
    export default {
        name: 'Manager',
        components: { Group, Material },
        mixins: [mixinDevice],
        watch: {
            category(val) {
                this.group = 'all';
                this.$emit('category:change', val);
            },
            activeCategories() {
                this.sCategory = undefined;
            },
        },
        props: {
            groupList: {
                type: Array,
                default: () => [],
            },
            materialList: {
                type: Array,
                default: () => [],
            },
            materialLoading: Boolean,
            pagination: {
                type: [Object, Boolean],
                default: false,
            },
            progress: {
                type: [Boolean, Object],
                default: false,
            },
            selectMode: {
                type: String,
                default: 'multi',
            },
            activeCategories: {
                type: Array,
                default: () => ['image', 'video'],
            },
        },
        inject: ['materialContext'],
        data() {
            return {
                sCategory: undefined,
                group: 'all',
                categoryList: [
                    {
                        key: 'image',
                        name: '图片',
                    },
                    {
                        key: 'video',
                        name: '视频',
                    },
                ],
            };
        },
        computed: {
            needHidden() {
                return this.modal && this.materialContext.size === 'small';
            },
            modal() {
                return this.materialContext.modal;
            },
            categories() {
                return this.categoryList.filter(item => this.activeCategories.includes(item.key));
            },
            category: {
                get() {
                    const { sCategory, categories } = this;
                    return sCategory || (categories && categories[0] && categories[0].key);
                },
                set(val) {
                    this.sCategory = val;
                },
            },
        },
        methods: {
            onGroupAdd(item) {
                this.$emit('group:add', item, this.category);
            },
            onGroupRename(group) {
                this.$emit('group:rename', group.id, group.name);
            },
            onGroupDelete(item) {
                this.$emit('group:delete', item);
            },
            onGroupSelect(key) {
                this.group = key;
                this.$emit('group:select', key);
            },
            onMaterialUpload(file) {
                this.$emit('material:upload', file, this.group);
            },
            onMaterialMove(groupId, selectedKeys) {
                this.$emit('material:move', groupId, selectedKeys);
            },
            onMaterialRename(id, name) {
                this.$emit('material:rename', id, name);
            },
            onMaterialSelect(val) {
                this.$emit('material:select', val);
            },
            onMaterialSearch(keyword) {
                this.$emit('material:search', keyword, this.group, this.category);
            },
            onMaterialDelete(ids) {
                this.$emit('material:delete', ids);
            },
        },
    };
</script>

<style scoped lang="less">
@import './index';
.manager ::v-deep {
  .ant-spin-container::after {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
.manager {
  padding: @padding @padding-lg;
  &.small {
    .container .material {
      margin-left: 0;
    }
  }
  &.mobile {
    text-align: center;
    padding: @padding @padding-sm;
  }
  .upload-tip {
    width: 200px;
    transform: translateX(-50%);
    .tip {
      font-size: 14px;
    }
  }
  ::v-deep.category .ant-tabs-bar {
    text-align: center;
    margin-bottom: 0;
    .ant-tabs-tab {
      font-size: 18px;
    }
  }
  .container {
    display: flex;
    .group {
      width: 240px;
      border-right: @border;
    }
    .material {
      flex: 1;
      margin-left: @margin-lg;
      .nav-bar {
        display: flex;
        .group-name {
          margin-bottom: 0;
        }
      }
    }
  }
  .actions {
    border-top: @border;
    padding-top: @padding;
    text-align: center;
    .btn {
      margin: 0 @margin;
      width: 120px;
    }
  }
}
</style>
