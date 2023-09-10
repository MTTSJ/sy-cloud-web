<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper" v-if="hasPerm('sysRole:page')">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="6" :sm="24">
                        <a-form-item
                            label="所属应用"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                        >
                            <a-select
                                v-model="queryParam.application"
                                clearable
                                placeholder="请选择应用分类"
                            >
                                <a-select-option
                                    v-for="(item, index) in appData"
                                    :key="item.code"
                                    :value="item.code"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="6" :sm="24">
                        <a-form-item
                            label="关键词"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                        >
                            <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入角色名或唯一编码" />
                        </a-form-item>
                    </a-col>
                    <!-- <a-col :md="8" :sm="24">
            <a-form-item label="唯一编码">
              <a-input v-model="queryParam.code" allow-clear placeholder="请输入唯一编码" />
            </a-form-item>
          </a-col> -->
                    <a-col :md="6" :sm="24">
                        <a-button type="primary" @click="reloadTable">
                            查询
                        </a-button>
                        <a-button style="margin-left: 8px" @click="() => (queryParam = {})">
                            重置
                        </a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <div class="table-operator" v-if="hasPerm('sysRole:add')">
            <a-button type="primary" v-if="hasPerm('sysRole:add')" icon="plus" @click="$refs.addForm.add()">
                新增角色
            </a-button>
        </div>

        <a-table
            ref="table"
            size="middle"
            :rowKey="rowKey"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            :alert="{ show: true, clear: true }"
            :rowSelection="{ onChange: onSelectChange, selectedRowKeys: selectedRowKeys }"
        >
            <span slot="action" slot-scope="text, record">
                <a v-if="hasPerm('sysRole:edit')" @click="$refs.editForm.edit(record)">
                    <a-icon type="edit" />
                    编辑
                </a>
                <a-divider type="vertical" v-if="hasPerm('sysRole:edit')" />
                <a-dropdown v-if="hasPerm('sysRole:grantMenu') || hasPerm('sysRole:grantData') || hasPerm('sysRole:delete')">
                    <a class="ant-dropdown-link">
                        <a-icon type="more" />
                        更多
                        <a-icon type="down" />
                    </a>
                    <a-menu slot="overlay">
                        <a-menu-item v-if="hasPerm('sysRole:grantMenu')">
                            <a @click="$refs.modalRoleMenu.roleMenu(record)">授权菜单</a>
                        </a-menu-item>
                        <a-menu-item v-if="hasPerm('sysRole:grantData')">
                            <a @click="$refs.roleOrgForm.roleOrg(record)">授权数据</a>
                        </a-menu-item>
                        <a-menu-item v-if="hasPerm('sysRole:delete')">
                            <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => sysRoleDelete(record)">
                                <a>删除</a>
                            </a-popconfirm>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </span>
        </a-table>

        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
        <role-menu-form ref="roleMenuForm" @ok="handleOk" :payload="{ application: queryParam.application }" />
        <role-org-form ref="roleOrgForm" @ok="handleOk" />
        <!-- 表单区域 -->
        <!-- <role-modal ref="modalForm" @ok="handleOk"></role-modal> -->
        <role-menu-modal ref="modalRoleMenu" @ok="handleOk" :payload="{ application: queryParam.application }"></role-menu-modal>
    </a-card>
</template>

<script>
    import { getPage, sysRoleDelete } from '@/api/modular/system/roleManage';
    import { getAppList } from '@/api/modular/system/appManage';
    import addForm from './addForm';
    import editForm from './editForm';
    import roleMenuForm from './roleMenuForm';
    import roleMenuModal from './roleMenuModal';
    import roleOrgForm from './roleOrgForm';
    import { TablePageMixin } from '@/mixins/';

    export default {
        components: {
            addForm,
            editForm,
            roleMenuForm,
            roleMenuModal,
            roleOrgForm,
        },
        mixins: [TablePageMixin],

        data() {
            return {
                labelCol: {
                    sm: { span: 24 },
                    md: { span: 6 },
                },
                wrapperCol: {
                    sm: { span: 24 },
                    md: { span: 18 },
                },
                appData: [],
                getPage: getPage,
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '角色名',
                        dataIndex: 'name',
                    },
                    {
                        title: '唯一编码',
                        dataIndex: 'code',
                    },
                    {
                        title: '所属应用',
                        dataIndex: 'application',
                        customRender: (text, record) => {
                            return this.appData?.find(item => item.code === text)?.name || '-';
                        },
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                    },
                ],
                selectedRowKeys: [],
                selectedRows: [],
            };
        },

        created() {
            this.getSysApplist();
            if (
                this.hasPerm('sysRole:edit') ||
                this.hasPerm('sysRole:grantMenu') ||
                this.hasPerm('sysRole:grantData') ||
                this.hasPerm('sysRole:delete')
            ) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },

        methods: {
            getSysApplist() {
                return getAppList().then(res => {
                    if (res.success) {
                        this.appData = res.data;
                    } else {
                        this.$message.warning(res.message);
                    }
                });
            },
            sysRoleDelete(record) {
                sysRoleDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.reloadTable();
                    } else {
                        this.$message.error('删除失败：' + res.message);
                    }
                });
            },

            handleOk() {
                this.reloadTable();
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
        },
    };
</script>

<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
</style>
