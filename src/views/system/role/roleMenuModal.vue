<template>
    <a-drawer
        :title="title"
        :maskClosable="true"
        width="400"
        placement="right"
        :closable="true"
        @close="close"
        :visible="visible"
        style="height: calc(100% - 55px); overflow: auto; padding-bottom: 53px"
    >
        <a-form :form="form">
            <a-form-item
                label="菜单权限"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
            >
                <a-tree
                    v-model="checkedKeys"
                    multiple
                    checkable
                    :auto-expand-parent="autoExpandParent"
                    :expanded-keys="expandedKeys"
                    :tree-data="menuTreeData"
                    :selected-keys="selectedKeys"
                    :replaceFields="replaceFields"
                    :checkStrictly="checkStrictly"
                    @expand="onExpand"
                    @select="onSelect"
                    @check="treeCheck"
                />
            </a-form-item>
        </a-form>
        <div class="drawer-bootom-button">
            <a-dropdown
                style="float: left"
                :trigger="['click']"
                placement="topCenter"
            >
                <a-menu slot="overlay">
                    <a-menu-item key="1" @click="switchCheckStrictly(1)">
                        父子关联
                    </a-menu-item>
                    <a-menu-item key="2" @click="switchCheckStrictly(2)">
                        取消关联
                    </a-menu-item>
                    <a-menu-item key="3" @click="checkALL">全部选择</a-menu-item>
                    <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
                    <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
                    <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
                </a-menu>
                <a-button>
                    树操作
                    <a-icon type="up" />
                </a-button>
            </a-dropdown>
            <a-popconfirm
                title="确定放弃编辑？"
                @confirm="close"
                okText="确定"
                cancelText="取消"
            >
                <a-button style="margin-right: 0.8rem">取消</a-button>
            </a-popconfirm>
            <a-button @click="handleSubmit" type="primary">提交</a-button>
        </div>
    </a-drawer>
</template>

<script>
    import { SysMenuTreeForGrant } from '@/api/modular/system/menuManage';
    import { sysRoleOwnMenu, sysRoleGrantMenu } from '@/api/modular/system/roleManage';

    export default {
        props: {
            payload: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                title: '授权菜单',
                labelCol: {
                    style: { 'padding-right': '20px' },
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 15 },
                },
                menuTreeData: [],
                expandedKeys: [],
                checkedKeys: [],
                visible: false,
                confirmLoading: false,
                formLoading: true,
                autoExpandParent: true,
                checkStrictly: true,
                selectedKeys: [],
                allTreeKeys: [],
                subValues: [],
                roleEntity: [],
                replaceFields: {
                    key: 'id',
                },
                form: this.$form.createForm(this),
            };
        },
        methods: {
            // 初始化方法
            roleMenu(record) {
                this.formLoading = true;
                this.roleEntity = record;
                this.visible = true;
                this.getMenuTree();
                this.expandedMenuKeys(record);
            },

            /**
             * 获取菜单列表
             */
            getMenuTree() {
                const data = {
                    ...this.payload,
                };
                SysMenuTreeForGrant(data).then(res => {
                    if (res.success) {
                        this.menuTreeData = res.data.tree;
                        this.allTreeKeys = res.data.ids;
                        // 默认展开目录级
                        this.menuTreeData.forEach(item => {
                            this.expandedKeys.push(item.id);
                        });
                    }
                });
            },

            /**
             * 此角色已有菜单权限
             */
            expandedMenuKeys(record) {
                sysRoleOwnMenu({ id: record.id }).then(res => {
                    if (res.success) {
                        this.checkedKeys = res.data;
                    }
                    this.formLoading = false;
                });
            },

            treeCheck(checkKeys) {
                this.checkedKeys = this.checkStrictly
                    ? checkKeys.checked
                    : checkKeys;
            },
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            onSelect(selectedKeys, info) {
                this.selectedKeys = selectedKeys;
            },

            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        sysRoleGrantMenu({
                            id: this.roleEntity.id,
                            ids: this.checkedKeys,
                        })
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('授权成功');
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.handleCancel();
                                } else {
                                    this.$message.error('授权失败：' + res.message);
                                }
                            })
                            .finally(res => {
                                this.confirmLoading = false;
                            });
                    } else {
                        this.confirmLoading = false;
                    }
                });
            },
            reset() {
                // 清空已展开的
                this.expandedKeysss = [];
                // 清空已选择的
                this.checkedKeys = [];
                this.defaultCheckedKeys = [];
                this.loading = false;
            },
            close() {
                this.reset();
                this.$emit('close');
                this.visible = false;
            },
            expandAll() {
                this.expandedKeys = this.allTreeKeys;
            },
            closeAll() {
                this.expandedKeys = [];
            },
            checkALL() {
                this.checkedKeys = this.allTreeKeys;
            },
            cancelCheckALL() {
                this.checkedKeys = [];
            },
            switchCheckStrictly(v) {
                if (v === 1) {
                    this.checkStrictly = false;
                } else if (v === 2) {
                    this.checkStrictly = true;
                }
            },
            handleCancel() {
                this.close();
            },
        },
    };
</script>
<style lang="less" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
