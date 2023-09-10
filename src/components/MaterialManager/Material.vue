<template>
    <div :class="['material', { mobile: isMobile() }]">
        <div class="nav-bar">
            <div class="intro" v-if="!needHidden">
                <a-upload :beforeUpload="beforeUpload" :show-upload-list="false" :accept="accept">
                    <a-button v-if="hasPerm('material:add')" class="upload" icon="upload" type="primary">
                        添加{{ categoryName }}
                    </a-button>
                </a-upload>
            </div>
            <div class="actions">
                <a-input-search
                    @search="onSearch"
                    v-if="hasPerm('material:page')"
                    class="action search"
                    placeholder="请输入名称搜索"
                />
                <a-checkbox
                    :disabled="selectMode === 'radio'"
                    class="action"
                    :indeterminate="halfCheck"
                    :checked="checkAll"
                    @change="onCheckAllChange"
                >
                    全选
                </a-checkbox>
                <a-popconfirm v-if="hasPerm('material:delete')" title="确认删除？" @confirm="onDelete">
                    <a-button class="action" icon="delete" type="danger">删除</a-button>
                </a-popconfirm>
                <a-dropdown v-if="needOperate">
                    <a-button class="action move" v-if="hasPerm('material:move')">
                        移动至
                        <a-icon type="down" />
                    </a-button>
                    <a-menu slot="overlay">
                        <a-menu-item @click="moveTo(item.id)" v-for="item in groupList" :key="item.id">{{ item.name }}</a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </div>
        <div class="main">
            <a-list
                :grid="grid"
                :data-source="dataSource"
                :loading="loading"
                :pagination="{ ...pagination, size: isMobile() ? 'small' : 'default' }"
            >
                <a-list-item slot="renderItem" slot-scope="item" rowKey="id">
                    <div :class="['img-box', { selected: selectedKeys.includes(item.id) }]" @click="onImgClick(item)">
                        <div class="img-preview">
                            <img :src="item.thumbUrl" />
                        </div>
                        <div class="footer">
                            <a-tooltip :title="item.name">
                                <span class="title">{{ item.name }}</span>
                            </a-tooltip>
                            <div class="actions">
                                <a-tooltip title="预览">
                                    <a-icon type="eye" class="preview" @click.prevent.stop="onPreview(item)" />
                                </a-tooltip>
                                <a-tooltip title="重命名">
                                    <a-icon type="edit" v-if="hasPerm('material:edit')" class="edit" @click.prevent.stop="onEdit(item)" />
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
        </div>
        <a-modal width="400px" title="重命名" v-model="visible" @ok="submit">
            <a-form-model ref="form" :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-model-item
                    :rules="[
                        { required: true, message: `请输入${categoryName}名称` },
                        { min: 2, max: 20, message: '需在2至20个字符之间' },
                    ]"
                    prop="fileName"
                    label="名称"
                >
                    <a-input v-model="form.fileName" :addonAfter="`.${form.fileSuffix}`" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
        <preview-box :src="previewUrl" :type="category" v-model="preview" />
    </div>
</template>

<script>
    import PreviewBox from '@/components/MaterialManager/PreviewBox';
    import { mixinDevice } from '@/utils/mixin';
    export default {
        name: 'Material',
        components: { PreviewBox },
        mixins: [mixinDevice],
        props: {
            dataSource: {
                type: Array,
                default: () => [],
            },
            loading: Boolean,
            pagination: {
                type: [Object, Boolean],
                default: false,
            },
            groupList: {
                type: Array,
                default: () => [],
            },
            group: {
                type: [String, Number],
                default: 'all',
            },
            category: {
                type: String,
                default: 'image',
            },
            selectMode: {
                type: String,
                default: 'multi',
            },
        },
        inject: ['materialContext'],
        data() {
            return {
                selectedKeys: [],
                checkAll: false,
                halfCheck: false,
                visible: false,
                form: {
                    fileName: '',
                    fileSuffix: '',
                },
                previewUrl: '',
                preview: false,
            };
        },
        watch: {
            selectedKeys(val) {
                this.$emit('select', val);
                if (this.dataSource.length > 0) {
                    if (this.dataSource.length === val.length) {
                        this.checkAll = true;
                        this.halfCheck = false;
                    } else {
                        this.halfCheck = this.selectedKeys.length > 0;
                        this.checkAll = false;
                    }
                }
            },
            dataSource() {
                this.selectedKeys = [];
            },
        },
        computed: {
            accept() {
                return this.category === 'image' ? 'image/*' : 'video/*';
            },
            modal() {
                return this.materialContext.modal;
            },
            needOperate() {
                return !this.modal || this.materialContext.size === 'large';
            },
            needHidden() {
                return this.modal && this.materialContext.size === 'small';
            },
            categoryName() {
                switch (this.category) {
                case 'image':
                    return '图片';
                case 'video':
                    return '视频';
                default:
                    return '--';
                }
            },
            grid() {
                const { materialContext: context } = this;
                if (context.modal) {
                    if (this.isMobile()) {
                        return { gutter: 16, column: 2 };
                    } else {
                        let column = 4;
                        switch (context.size) {
                        case 'large':
                            column = 6;
                            break;
                        case 'middle':
                            column = 4;
                            break;
                        case 'small':
                            column = 3;
                            break;
                        }
                        return { gutter: 16, column };
                    }
                } else {
                    return { gutter: 16, xs: 2, sm: 3, md: 3, lg: 3, xl: 4, xxl: 6 };
                }
            },
        },
        methods: {
            beforeUpload(file) {
                this.$emit('upload', file);
                return false;
            },
            onImgClick(img) {
                if (this.selectMode === 'radio') {
                    this.selectedKeys = [img.id];
                } else {
                    if (this.selectedKeys.includes(img.id)) {
                        const index = this.selectedKeys.findIndex(item => item === img.id);
                        this.selectedKeys.splice(index, 1);
                    } else {
                        this.selectedKeys.push(img.id);
                    }
                }
            },
            onCheckAllChange({ target }) {
                this.checkAll = target.checked;
                if (this.checkAll) {
                    this.dataSource.forEach(item => {
                        if (!this.selectedKeys.includes(item.id)) {
                            this.selectedKeys.push(item.id);
                        }
                    });
                } else {
                    this.selectedKeys.splice(0, this.selectedKeys.length);
                }
            },
            onEdit(file) {
                const names = file.name.split('.');
                this.form = { id: file.id, fileName: names[0], fileSuffix: names[1] };
                this.visible = true;
            },
            onPreview(file) {
                this.previewUrl = file.url;
                this.preview = true;
            },
            onSearch(val) {
                this.$emit('search', val);
            },
            submit() {
                this.$refs.form.validate(pass => {
                    if (pass) {
                        const { id, fileName, fileSuffix } = this.form;
                        this.$emit('rename', id, fileName + '.' + fileSuffix);
                        this.visible = false;
                        this.$refs.form.reset();
                    }
                });
            },
            onDelete() {
                if (this.selectedKeys.length === 0) {
                    this.$message.info('请选择要删除的素材');
                    return;
                }
                this.$emit('delete', this.selectedKeys);
            },
            moveTo(groupId) {
                if (this.selectedKeys.length === 0) {
                    this.$message.info('请选择要移动的素材');
                    return;
                }
                this.$confirm({
                    title: '确认移动至新分组？',
                    class: 'material-move-confirm',
                    width: 280,
                    icon: false,
                    onOk: () => {
                        this.$emit('move', groupId, this.selectedKeys);
                    },
                });
            },
        },
    };
</script>

<style lang="less">
.material-move-confirm {
  .ant-modal-body .ant-modal-confirm-btns {
    text-align: center !important;
    width: 100%;
    float: left;
  }
}
</style>
<style scoped lang="less">
@import './index';
@media screen and (max-width: 1250px) {
  .material .nav-bar .actions .action.move,
  .action.search {
    display: none !important;
  }
}
@media screen and (max-width: 1000px) {
  .material .nav-bar .actions .action.search {
    display: none !important;
  }
}
.material {
  display: flex;
  flex-direction: column;
  padding: @padding-lg 0;
  &.mobile {
    margin-left: 0 !important;
  }
  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .intro {
      display: flex;
      align-items: center;
      .group-name {
        margin-bottom: 0;
      }
      .upload {
        margin-left: @margin-sm;
      }
    }
    .actions {
      .action {
        display: inline-block;
        &:not(:first-child) {
          margin-left: @margin;
        }
        &.search {
          width: 200px;
        }
      }
    }
  }
  .main {
    flex: 1;
    margin-top: @margin-lg + @margin-sm;
    .img-box {
      margin: 0 auto;
      user-select: none;
      padding: @padding-sm;
      cursor: pointer;
      border-radius: 4px;
      border: @border;
      background-color: #fafafa;
      display: inline-flex;
      width: 160px;
      height: 144px;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      &.selected {
        background-color: #e6f7ff;
        border-color: #1890ff;
      }
      .img-preview {
        flex: 1;
        width: 144px;
        display: flex;
        align-items: center;
        img {
          margin: 0 auto;
          max-width: 144px;
          max-height: 98px;
        }
      }
      .footer {
        width: 100%;
        margin-top: @margin-sm;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .actions {
          display: flex;
        }
        .edit,
        .preview {
          cursor: pointer;
          color: #909090;
          padding: @padding-sm 0 0 @padding-sm;
          &:hover {
            color: #1890ff;
          }
        }
      }
    }
  }
}
</style>
