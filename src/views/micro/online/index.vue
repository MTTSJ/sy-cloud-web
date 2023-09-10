<template>
    <div>
        <a-card :bordered="false" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('client:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="关键词">
                                <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入客户端ID或者应用名称" />
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
                <template class="table-operator" slot="operator" v-if="hasPerm('client:add')">
                    <a-button type="primary" v-if="hasPerm('client:add')" icon="plus">
                        新增
                    </a-button>
                </template>
                <span slot="accessToken" slot-scope="text">
                    <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="status" slot-scope="text, record">
                    <a-tag :color="record.status === 0 ? 'blue' : 'red'">{{ statusFilter(text) }}</a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('client:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('client:edit') & hasPerm('client:delete')" />
                    <a-popconfirm
                        v-if="hasPerm('client:delete')"
                        placement="topRight"
                        title="确认强退用户？"
                        @confirm="() => clientDelete(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                        </a>
                    </a-popconfirm>
                </span>
            </s-table>
        </a-card>
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { onlinePage, onlineForceLogout } from '@/api/modular/micro/online';
    export default {
        components: {
            STable,
            Ellipsis,
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '用户ID',
                        align: 'center',
                        dataIndex: 'userId',
                    },
                    {
                        title: '用户名',
                        align: 'center',
                        dataIndex: 'userName',
                    },
                    {
                        title: 'IP地址',
                        align: 'center',
                        dataIndex: 'ip',
                    },
                    {
                        title: 'Token',
                        align: 'center',
                        dataIndex: 'access_token',
                        scopedSlots: { customRender: 'accessToken' },
                    },
                ],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return onlinePage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                statusPrefixData: [],
            };
        },
        created() {
            if (this.hasPerm('client:edit') || this.hasPerm('client:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '80px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
            this.dataTypeItem();
        },
        methods: {
            clientDelete(record) {
                onlineForceLogout({ accessToken: record.access_token }).then(res => {
                    if (res.success) {
                        this.$message.success('强退成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('强退失败'); // + res.message
                    }
                });
            },
            handleOk() {
                this.$refs.table.refresh();
            },
            /**
             * 获取字典数据
             */
            dataTypeItem() {
                this.statusPrefixData = this.$options.filters['dictData']('status');
            },
            statusFilter(status) {
                // eslint-disable-next-line eqeqeq
                const values = this.statusPrefixData.filter(item => item.dictKey == status);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
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
