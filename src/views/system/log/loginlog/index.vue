<template>
    <div>
        <a-card :bordered="false" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('loginLog:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="用户名">
                                <a-input v-model="queryParam.userName" allow-clear placeholder="请输入用户名"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
                                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                                <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-card>
        <a-card :bordered="false">
            <s-table
                ref="table"
                size="default"
                :columns="columns"
                :data="loadData"
                :alert="true"
                :rowKey="record => record.id"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
                <template class="table-operator" slot="operator" v-if="hasPerm('loginLog:add')">
                    <a-button type="primary" v-if="hasPerm('loginLog:add')" icon="plus" @click="$refs.addForm.add()">
                        新增登录日志
                    </a-button>
                </template>
                <span slot="descriptionscopedSlots" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="type" slot-scope="text, record">
                    <a-tag :color="record.type === 'SUCCESS' ? 'blue' : 'red'">
                        {{ text }}
                    </a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('loginLog:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit"/>
                        编辑
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('loginLog:edit') & hasPerm('loginLog:delete')"/>
                    <a-popconfirm
                        v-if="hasPerm('loginLog:delete')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => loginLogDelete(record)"
                    >
                        <a>
                            <a-icon type="delete"/>
                            删除
                        </a>
                    </a-popconfirm>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk"/>
            <edit-form ref="editForm" @ok="handleOk"/>
        </a-card>
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { loginLogPage, loginLogDelete } from '@/api/modular/system/loginlog';
    import addForm from './addForm.vue';
    import editForm from './editForm.vue';

    export default {
        components: {
            Ellipsis,
            STable,
            addForm,
            editForm,
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '用户名',
                        align: 'center',
                        dataIndex: 'userName',
                    },

                    {
                        title: '日志状态',
                        align: 'center',
                        dataIndex: 'type',
                        scopedSlots: { customRender: 'type' },
                    },

                    {
                        title: '登录描述',
                        align: 'center',
                        dataIndex: 'description',
                        scopedSlots: { customRender: 'descriptionscopedSlots' },
                    },

                    {
                        title: 'IP地址',
                        align: 'center',
                        dataIndex: 'ip',
                    },

                    {
                        title: '地区',
                        align: 'center',
                        dataIndex: 'location',
                    },

                    {
                        title: '浏览器',
                        align: 'center',
                        dataIndex: 'browser',
                    },

                    {
                        title: '操作系统',
                        align: 'center',
                        dataIndex: 'os',
                    },

                    {
                        title: '登录时间',
                        align: 'center',
                        dataIndex: 'createTime',
                    },
                ],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return loginLogPage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
            };
        },
        created() {
            if (this.hasPerm('loginLog:edit') || this.hasPerm('loginLog:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },
        methods: {
            loginLogDelete(record) {
                loginLogDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('删除失败'); // + res.message
                    }
                });
            },
            handleOk() {
                this.$refs.table.refresh();
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
