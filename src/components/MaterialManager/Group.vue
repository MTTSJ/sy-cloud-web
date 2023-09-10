<template>
    <div :class="['group', { hidden: needHide }]">
        <a-button class="group-add" icon="plus" v-if="hasPerm('material:add')" type="primary" @click="onAdd()">
            添加分组
        </a-button>
        <a-menu mode="inline" theme="light" :selected-keys="selectedKeys" class="group-list">
            <a-menu-item key="all" @click="onSelect">
                <div class="group-info">
                    <a-icon type="user" />
                    <span class="title">全部</span>
                </div>
            </a-menu-item>
            <a-menu-item v-for="item in dataSource" :key="item.id" @click="onSelect">
                <div class="group-item">
                    <div class="group-info">
                        <a-icon type="user" />
                        <span class="title">{{ item.name }}</span>
                    </div>
                    <div class="actions">
                        <a-icon class="edit" type="edit" v-if="hasPerm('material:edit')" @click.prevent.stop="onEdit(item)" />
                        <a-popconfirm title="确认删除？" v-if="hasPerm('material:delete')" @confirm="onDelete(item)">
                            <a-icon class="remove" type="delete" @click.prevent.stop />
                        </a-popconfirm>
                    </div>
                </div>
            </a-menu-item>
        </a-menu>
        <a-modal :force-render="true" width="360px" v-model="visible" :title="title" @ok="submit">
            <a-form-model ref="form" :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
                <a-form-model-item
                    :rules="[
                        { required: true, message: '请输入分组名称' },
                        { min: 1, max: 8, message: '名称为1到8个字符' },
                    ]"
                    prop="name"
                    label="名称"
                >
                    <a-input v-model="form.name" />
                </a-form-model-item>
            </a-form-model>
        </a-modal>
    </div>
</template>

<script>
    export default {
        name: 'Group',
        props: {
            dataSource: {
                type: Array,
                default: () => [],
            },
            selected: {
                type: [String, Number],
                default: 'all',
            },
        },
        inject: ['materialContext'],
        data() {
            return {
                title: '',
                visible: false,
                event: 'add',
                form: {
                    name: '',
                },
            };
        },
        computed: {
            selectedKeys: {
                get() {
                    return [this.selected];
                },
                set(val) {
                    this.$emit('update:selected', val[0]);
                },
            },
            modal() {
                return this.materialContext.modal;
            },
            needHide() {
                return this.modal && this.materialContext.size === 'small';
            },
        },
        methods: {
            onAdd() {
                this.$refs.form.resetFields();
                this.title = '新增分组';
                this.visible = true;
                this.event = 'add';
            },
            onDelete(item) {
                this.$emit('delete', item);
            },
            onEdit(item) {
                this.title = '重命名';
                this.$refs.form.resetFields();
                this.form = { ...item };
                this.visible = true;
                this.event = 'rename';
            },
            onSelect(item) {
                this.$emit('select', item.key);
            },
            submit() {
                this.$refs.form.validate(pass => {
                    if (pass) {
                        this.$emit(`${this.event}`, this.form);
                        this.visible = false;
                        this.$refs.form.reset();
                    }
                });
            },
        },
    };
</script>

<style scoped lang="less">
@import './index';
@media screen and (max-width: 768px) {
  .group:not(.hidden) {
    display: none;
  }
}
.group {
  &.hidden {
    display: none;
  }
  padding-top: @padding-lg;
  .group-add {
    margin: 0 0 @margin @margin-lg;
    height: 32.5px;
  }
  .group-list {
    border: 0;
    .group-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .group-info {
      }
      .actions {
        .edit,
        .remove {
          color: #909090;
          padding: 12px 0;
          &:hover {
            color: @primary-color;
          }
        }
      }
    }
  }
}
</style>
