<template>
    <div>
        <a-card :bordered="false" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('rateLimit:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="请求地址">
                                <a-input v-model="queryParam.requestUri" allow-clear placeholder="请输入请求地址" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="请求方法">
                                <a-input v-model="queryParam.requestMethod" allow-clear placeholder="请输入请求方法" />
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
                <template class="table-operator" slot="operator" v-if="hasPerm('rateLimit:add')">
                    <a-button type="primary" v-if="hasPerm('rateLimit:add')" icon="plus" @click="$refs.addForm.add()">
                        新增
                    </a-button>
                </template>
                <span slot="status" slot-scope="text, record">
                    <a-tag :color="record.status === 0 ? 'blue' : 'red'">{{ statusFilter(text) }}</a-tag>
                </span>
                <span slot="requestUriscopedSlots" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="limitFromscopedSlots" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="limitToscopedSlots" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('rateLimit:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                        编辑
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('rateLimit:edit') & hasPerm('rateLimit:delete')" />
                    <a-popconfirm
                        v-if="hasPerm('rateLimit:delete')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => rateLimitDelete(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                            删除
                        </a>
                    </a-popconfirm>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk" />
            <edit-form ref="editForm" @ok="handleOk" />
        </a-card>
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { rateLimitPage, rateLimitDelete } from '@/api/modular/gateway/ratelimit';
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
                        title: '请求地址',
                        align: 'center',
                        dataIndex: 'requestUri',
                        scopedSlots: { customRender: 'requestUriscopedSlots' },
                    },

                    {
                        title: '请求方法',
                        align: 'center',
                        dataIndex: 'requestMethod',
                    },

                    {
                        title: '开始时间',
                        align: 'center',
                        dataIndex: 'limitFrom',
                        scopedSlots: { customRender: 'limitFromscopedSlots' },
                    },

                    {
                        title: '结束时间',
                        align: 'center',
                        dataIndex: 'limitTo',
                        scopedSlots: { customRender: 'limitToscopedSlots' },
                    },

                    {
                        title: '请求次数',
                        align: 'center',
                        dataIndex: 'count',
                    },

                    {
                        title: '时间周期',
                        align: 'center',
                        dataIndex: 'intervalSec',
                    },

                    {
                        title: '状态',
                        align: 'center',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                ],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return rateLimitPage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                statusPrefixData: [],
            };
        },
        created() {
            if (this.hasPerm('rateLimit:edit') || this.hasPerm('rateLimit:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
            this.dataTypeItem();
        },
        methods: {
            rateLimitDelete(record) {
                rateLimitDelete({ ids: record.id }).then(res => {
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
