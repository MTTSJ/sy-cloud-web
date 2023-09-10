<template>
    <div>
        <a-card :bordered="false" v-show="indexOpenShow" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('route:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="关键词">
                                <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入名称或服务ID" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="(!advanced && 8) || 24" :sm="24">
                            <span
                                class="table-page-search-submitButtons"
                                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                            >
                                <a-button type="primary" @click="$refs.table.refresh(true)">
                                    查询
                                </a-button>
                                <a-button style="margin-left: 8px" @click="() => (queryParam = {})">
                                    重置
                                </a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </a-card>
        <a-card :bordered="false" v-show="indexOpenShow">
            <s-table
                ref="table"
                size="default"
                :columns="columns"
                :data="loadData"
                :alert="false"
                :rowKey="record => record.id"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
                <div slot="operator" v-if="hasPerm('route:add')">
                    <a-button type="primary" v-if="hasPerm('route:add')" icon="plus" @click="$refs.editForm.add()">
                        新增
                    </a-button>
                </div>
                <span slot="dbType" slot-scope="text, record">
                    <a-tag :color="record.dbType === '1' ? 'blue' : record.dbType === '2' ? 'green' : 'red'">
                        {{ dbTypeFilter(text) }}
                    </a-tag>
                </span>
                <span slot="path" slot-scope="text">
                    <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="driverClass" slot-scope="text">
                    <ellipsis :length="25" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="status" slot-scope="text, record">
                    <a-tag :color="record.status === '0' ? 'blue' : 'green'">{{ statusFilter(text) }}</a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('route:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('route:edit') & hasPerm('route:delete')" />
                    <a-popconfirm
                        v-if="hasPerm('route:delete')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => dataSourceDel(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                        </a>
                    </a-popconfirm>
                </span>
            </s-table>

            <edit-form ref="editForm" @ok="handleOk" />
        </a-card>
    </div>
</template>

<script>
    import { routePage, routeDel } from '@/api/modular/gateway/route';
    import editForm from './editForm';
    import { STable, Ellipsis } from '@/components';
    export default {
        components: {
            STable,
            Ellipsis,
            editForm,
        },

        data() {
            return {
                // 高级搜索 展开/关闭
                advanced: false,
                indexOpenShow: true,
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '服务ID',
                        dataIndex: 'serviceId',
                    },
                    {
                        title: '服务路径',
                        dataIndex: 'path',
                        scopedSlots: { customRender: 'path' },
                    },
                    {
                        title: 'URI',
                        dataIndex: 'url',
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return routePage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                dbTypeDictTypeDropDown: [],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                okPrefixData: [],
            };
        },

        created() {
            if (this.hasPerm('route:edit') || this.hasPerm('route:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '90px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
            this.dataTypeItem();
        },

        methods: {
            dataSourceDel(record) {
                routeDel({ ids: record.id })
                    .then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.$refs.table.refresh();
                        } else {
                            this.$message.error('删除失败：' + res.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('删除错误：' + err.message);
                    });
            },

            toggleAdvanced() {
                this.advanced = !this.advanced;
            },
            handleOk() {
                this.$refs.table.refresh();
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
            /**
             * 获取字典数据
             */
            dataTypeItem() {
                this.okPrefixData = this.$options.filters['dictData']('status');
            },
            statusFilter(status) {
                // eslint-disable-next-line eqeqeq
                const values = this.okPrefixData.filter(item => item.dictKey == status);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
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
