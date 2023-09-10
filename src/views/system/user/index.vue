<template>
    <a-row :gutter="10">
        <a-col :md="6" :sm="24">
            <DeptTreeSelect @select="$set(queryParam, 'orgId', $event)" />
        </a-col>

        <a-col :md="18" :sm="24">
            <a-card :bordered="false">
                <div class="table-page-search-wrapper">
                    <a-form layout="inline">
                        <a-row :gutter="48">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="关键词">
                                    <a-input
                                        v-model="queryParam.keyword"
                                        allow-clear
                                        placeholder="请输入姓名、账号、手机号"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="状态">
                                    <a-select
                                        v-model="queryParam.status"
                                        allow-clear
                                        placeholder="请选择状态"
                                        default-value="0"
                                    >
                                        <a-select-option
                                            v-for="(item, index) in statusDictTypeDropDown"
                                            :key="index"
                                            :value="item.code"
                                        >
                                            {{ item.value }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-button type="primary" @click="reloadTable">查询</a-button>
                                <a-button style="margin-left: 8px" @click="queryParam = {}">
                                    重置
                                </a-button>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>

                <s-table
                    ref="table"
                    size="middle"
                    row-key="id"
                    :alert="true"
                    :data="loadData"
                    :columns="columns"
                    :row-selection="{ onChange: onSelectChange, selectedRowKeys }"
                >
                    <template #operator v-if="hasPerm('sysUser:add')">
                        <a-button
                            type="primary"
                            v-if="hasPerm('sysUser:add')"
                            icon="plus"
                            @click="$refs.addForm.add()"
                        >
                            新增用户
                        </a-button>
                        <a-dropdown
                            v-if="hasPerm('sysUser:edit') && selectedRowKeys.length > 0"
                        >
                            <template #overlay>
                                <a-menu @click="handleUpdateStatus">
                                    <a-menu-item key="0">
                                        <a-icon type="check" />
                                        启用
                                    </a-menu-item>
                                    <!-- lock | unlock -->
                                    <a-menu-item key="1">
                                        <a-icon type="close" />
                                        禁用
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button style="margin-left: 8px">
                                批量操作
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                    <span slot="sex" slot-scope="text">
                        {{ sexFilter(text) }}
                    </span>

                    <span
                        slot="status"
                        slot-scope="text, record"
                        v-if="hasPerm('sysUser:changeStatus')"
                    >
                        <a-popconfirm
                            placement="top"
                            :title="text === 0 ? '确定停用该用户？' : '确定启用该用户？'"
                            @confirm="() => editUserStatus(text, record)"
                        >
                            <!-- <a>{{ statusFilter(text) }}</a> -->
                            <a-badge
                                :status="text | statusTypeFilter"
                                :text="text | statusFilter"
                            />
                        </a-popconfirm>
                    </span>
                    <span slot="status" v-else>
                        {{ statusFilter(text) }}
                    </span>

                    <span slot="action" slot-scope="text, record">
                        <a-tooltip title="编辑">
                            <a
                                v-if="hasPerm('sysUser:edit')"
                                @click="$refs.editForm.edit(record)"
                            >
                                <a-icon type="edit" />
                            </a>
                        </a-tooltip>
                        <a-divider type="vertical" v-if="hasPerm('sysUser:edit')" />
                        <a-dropdown
                            v-if="
                                hasPerm('sysUser:resetPwd') ||
                                    hasPerm('sysUser:grantRole') ||
                                    hasPerm('sysUser:grantData') ||
                                    hasPerm('sysUser:delete')
                            "
                        >
                            <a class="ant-dropdown-link">
                                <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item v-if="hasPerm('sysUser:resetPwd')">
                                    <!-- <a-popconfirm
                    placement="topRight"
                    title="确认重置密码？"
                    @confirm="() => $refs.passwordEditForm.edit(record)"
                  > -->
                                    <a @click="$refs.passwordEditForm.show(record)">修改密码</a>
                                    <!-- </a-popconfirm> -->
                                </a-menu-item>
                                <a-menu-item v-if="hasPerm('sysUser:grantRole')">
                                    <a @click="$refs.userRoleForm.userRole(record)">授权角色</a>
                                </a-menu-item>
                                <a-menu-item v-if="hasPerm('sysUser:grantData')">
                                    <a @click="$refs.userOrgForm.userOrg(record)">授权数据</a>
                                </a-menu-item>
                                <a-menu-item v-if="hasPerm('sysUser:delete')">
                                    <a-popconfirm
                                        placement="topRight"
                                        title="确认删除？"
                                        @confirm="() => sysUserDelete(record)"
                                    >
                                        <a>删除</a>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </s-table>

                <add-form ref="addForm" @ok="reloadTable" />
                <edit-form ref="editForm" @ok="reloadTable" />
                <user-role-form ref="userRoleForm" @ok="reloadTable" />
                <user-org-form ref="userOrgForm" @ok="reloadTable" />
                <password-edit-form ref="passwordEditForm" @ok="reloadTable" />
            </a-card>
        </a-col>
    </a-row>
</template>

<script>
    import { STable } from '@/components';
    import { getPage, sysUserDelete, sysUserChangeStatus, sysUserResetPwd } from '@/api/modular/system/userManage';
    import addForm from './addForm';
    import editForm from './editForm';
    import userRoleForm from './userRoleForm';
    import userOrgForm from './userOrgForm';
    import passwordEditForm from './passwordEditForm';
    import DeptTreeSelect from '@/components/User/DeptTreeSelect.vue';

    const statusMap = {
        0: {
            status: 'processing',
            text: '启用',
        },
        1: {
            status: 'default',
            text: '禁用',
        },
    };

    export default {
        components: {
            STable,
            addForm,
            editForm,
            userRoleForm,
            userOrgForm,
            passwordEditForm,
            DeptTreeSelect,
        },
        data() {
            return {
                getPage,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '账号',
                        dataIndex: 'account',
                        width: 100,
                        fixed: 'left',
                    },
                    {
                        title: '姓名',
                        dataIndex: 'name',
                    },
                    {
                        title: '性别',
                        dataIndex: 'sex',
                        scopedSlots: { customRender: 'sex' },
                    },
                    {
                        title: '手机',
                        dataIndex: 'phone',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: 80,
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                selectedRowKeys: [],
                selectedRows: [],
                defaultExpandedKeys: [],
                orgSelectedKeys: [],
                sexDictTypeDropDown: [],
                statusDictTypeDropDown: [],
            };
        },
        filters: {
            statusFilter(type) {
                return statusMap[type].text;
            },
            statusTypeFilter(type) {
                return statusMap[type].status;
            },
        },
        watch: {
            queryParam: {
                deep: true,
                handler: 'reloadTable',
            },
        },
        created() {
            /**
             * 获取到机构树，展开顶级下树节点，考虑到后期数据量变大，不建议全部展开
             * Object.assign(this.queryParam)
             */
            this.sysDictTypeDropDown();
        },

        methods: {
            // 加载数据方法 必须为 Promise 对象
            loadData(parameter) {
                const params = Object.assign({}, parameter, this.queryParam);
                return getPage(params).then(res => res.data);
            },
            sexFilter(sex) {
                // eslint-disable-next-line eqeqeq
                const values = this.sexDictTypeDropDown.filter(item => item.dictKey == sex);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },
            /**
             * 获取字典数据
             */
            sysDictTypeDropDown() {
                this.sexDictTypeDropDown = this.$options.filters['dictData']('sex');
                this.statusDictTypeDropDown = this.$options.filters['dictData']('status');
            },

            /**
             * 修改用户状态
             */
            editUserStatus(code, record) {
                // eslint-disable-next-line no-unused-vars
                const status = 0;
                // eslint-disable-next-line eqeqeq
                if (code === 0) {
                    this.status = 1;
                    // eslint-disable-next-line eqeqeq
                } else if (code === 1) {
                    this.status = 0;
                }
                sysUserChangeStatus({ id: record.id, status: this.status }).then(res => {
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.reloadTable();
                    } else {
                        this.$message.error('操作失败：' + res.msg);
                    }
                });
            },

            /**
             * 重置密码
             */
            resetPwd(record) {
                sysUserResetPwd({ id: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('重置成功');
                        // this.$refs.table.refresh()
                    } else {
                        this.$message.error('重置失败：' + res.message);
                    }
                });
            },

            /**
             * 删除用户
             * @param record
             */
            sysUserDelete(record) {
                sysUserDelete({ ids: record.id })
                    .then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.reloadTable();
                        } else {
                            this.$message.error('删除失败：' + res.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('删除错误：' + err.message);
                    });
            },
            reloadTable() {
                this.$refs.table.refresh(true);
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
            handleUpdateStatus() {},
        },
    };
</script>
