<template>
    <a-modal title="字典值管理" :width="900" :visible="visible" :footer="null" @cancel="handleCancel">
        <a-card :bordered="false">
            <div class="table-page-search-wrapper" v-if="hasPerm('dict:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="字典值">
                                <a-input v-model="queryParam.value" allow-clear placeholder="请输入字典值" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="唯一编码">
                                <a-input v-model="queryParam.code" allow-clear placeholder="请输入唯一编码" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="(!advanced && 8) || 24" :sm="24">
                            <span
                                class="table-page-search-submitButtons"
                                :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                            >
                                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                                <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
                            </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <s-table
                ref="table"
                size="default"
                :columns="columns"
                :data="loadData"
                :alert="false"
                :rowKey="record => record.id"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
                <template slot="operator" v-if="hasPerm('dict:add')">
                    <a-button @click="$refs.editForm.add(typeId, code)" icon="plus" type="primary" v-if="hasPerm('dict:add')">
                        新增字典项
                    </a-button>
                </template>
                <span slot="status" slot-scope="text">
                    {{ statusFilter(text) }}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('dict:edit')" @click="$refs.editForm.edit(record)">编辑</a>
                    <a-divider type="vertical" v-if="hasPerm('dict:edit') & hasPerm('dict:del')" />
                    <a-popconfirm
                        v-if="hasPerm('dict:del')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => sysDictDataDelete(record)"
                    >
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </s-table>
            <edit-form ref="editForm" @ok="handleOk" />
        </a-card>
    </a-modal>
</template>

<script>
    import { STable } from '@/components';
    import { sysDictDataPage, sysDictDataDelete } from '@/api/modular/system/dictDataManage';
    import editForm from './editForm';

    export default {
        components: {
            STable,
            editForm,
        },

        data() {
            return {
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '字典值',
                        dataIndex: 'dictValue',
                    },
                    {
                        title: '唯一编码',
                        dataIndex: 'dictKey',
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        width: 200,
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                ],
                visible: false,
                typeId: [],
                code: '',
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    this.queryParam.id = this.typeId;
                    return sysDictDataPage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                statusDict: [],
            };
        },

        created() {
            this.sysDictTypeDropDown();
            if (this.hasPerm('dict:edit') || this.hasPerm('dict:del')) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },

        methods: {
            // 打开此页面首先加载此方法
            index(record) {
                this.visible = true;
                this.typeId = record.id;
                this.queryParam.typeId = record.id;
                this.code = record.code;
                try {
                    this.$refs.table.refresh();
                } catch (e) {
                    // 首次进入界面，因表格加载顺序，会抛异常，我们不予理会
                }
            },

            statusFilter(status) {
                // eslint-disable-next-line eqeqeq
                const values = this.statusDict.filter(item => item.dictKey == status);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },

            /**
             * 获取字典数据
             */
            sysDictTypeDropDown() {
                this.statusDict = this.$options.filters['dictData']('status');
            },

            handleCancel() {
                this.queryParam = {};
                this.visible = false;
            },
            sysDictDataDelete(record) {
                sysDictDataDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('删除失败：' + res.message);
                    }
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
