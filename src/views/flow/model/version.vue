<template>
    <a-card :bordered="false">
        <a-spin :spinning="loading">
            <s-table
                ref="table"
                :columns="columns"
                :data="loadData"
                :alert="false"
                :immediate="false"
                :rowKey="record => record.id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
            >
                <template #operator>
                    <a-button
                        style="margin-left: 8px"
                        type="dashed"
                        icon="rollback"
                        @click="returnPage"
                    >
                        返回
                    </a-button>
                </template>
                <span slot="name" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="created" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="version" slot-scope="text">V{{ text }}.0</span>
                <span slot="description" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a-popconfirm
                        v-if="hasPerm('model:edit')"
                        placement="topRight"
                        title="确定将此设为新版？"
                        @confirm="() => handleSetAsNew(record)"
                    >
                        <a>设为新版</a>
                    </a-popconfirm>
                </span>
                <!-- </a-table> -->
            </s-table>
        </a-spin>
    </a-card>
</template>

<script>
    import { STable, Ellipsis } from '@/components';
    import {
        modelSetAsNew,
        modelVersion,
    } from '@/api/modular/flowable/modelManage';

    export default {
        components: {
            STable,
            Ellipsis,
        },

        data() {
            return {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 15 },
                },
                loading: false,
                tableLoading: false,
                // 查询参数
                queryParam: {},
                columns: [
                    {
                        title: '模型名称',
                        dataIndex: 'name',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '唯一编码',
                        dataIndex: 'key',
                    },
                    {
                        title: '版本',
                        dataIndex: 'version',
                        scopedSlots: { customRender: 'version' },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'created',
                        scopedSlots: { customRender: 'created' },
                    },
                    {
                        title: '创建人',
                        dataIndex: 'createdBy',
                    },
                    {
                        title: '描述',
                        dataIndex: 'description',
                        scopedSlots: { customRender: 'description' },
                    },
                ],
                selectedRowKeys: [],
                selectedRows: [],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return modelVersion(Object.assign(parameter, this.queryParam)).then(
                        res => res.data,
                    );
                },
                recordData: {},
            };
        },
        created() {
            if (this.hasPerm('model:edit')) {
                this.columns.push({
                    title: '操作',
                    width: '100px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },
        methods: {
            /**
             * 打开此页面
             */
            openVersion(record) {
                this.recordData = record;
                // this.addAction();
                Object.assign(this.queryParam, { id: record.id });
                this.$refs.table.refresh();
            },
            /**
             * 设为新版
             */
            handleSetAsNew(record) {
                this.loading = true;
                modelSetAsNew({ id: record.id, modelId: this.recordData.id }).then(
                    res => {
                        this.loading = false;
                        if (res.success) {
                            this.$message.success('设为新版成功');
                            this.getModelList();
                        } else {
                            this.$message.error('设为新版失败：' + res.message);
                        }
                    },
                );
            },
            returnPage() {
                this.recordData = {};
                this.$emit('ok');
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
        },
    };
</script>
