<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper" v-if="hasPerm('sysPos:page')">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="8" :sm="24">
                        <a-form-item label="关键词">
                            <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入职位名称或唯一编码" />
                        </a-form-item>
                    </a-col>
                    <!-- <a-col :md="8" :sm="24">
            <a-form-item label="唯一编码">
              <a-input v-model="queryParam.code" allow-clear placeholder="请输入唯一编码" />
            </a-form-item>
          </a-col> -->
                    <a-col :md="(!advanced && 8) || 24" :sm="24">
                        <span
                            class="table-page-search-submitButtons"
                            :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
                        >
                            <a-button type="primary" @click="reloadTable">
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

        <div class="table-operator" v-if="hasPerm('sysPos:add')">
            <a-button type="primary" v-if="hasPerm('sysPos:add')" icon="plus" @click="$refs.addForm.add()">
                新增职位
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
                <a v-if="hasPerm('sysPos:edit')" @click="$refs.editForm.edit(record)">
                    <a-icon type="edit" />
                    编辑
                </a>
                <a-divider type="vertical" v-if="hasPerm('sysPos:edit') & hasPerm('sysPos:delete')" />
                <a-popconfirm
                    v-if="hasPerm('sysPos:delete')"
                    placement="topRight"
                    title="确认删除？"
                    @confirm="() => sysPosDelete(record)"
                >
                    <a>
                        <a-icon type="delete" />
                        删除
                    </a>
                </a-popconfirm>
            </span>
        </a-table>

        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
</template>

<script>
    import { getPage, sysPosDelete } from '@/api/modular/system/posManage';
    import addForm from './addForm';
    import editForm from './editForm';
    import { TablePageMixin } from '@/mixins/';

    export default {
        components: {
            addForm,
            editForm,
        },
        mixins: [TablePageMixin],

        data() {
            return {
                getPage: getPage,
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '职位名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '唯一编码',
                        dataIndex: 'code',
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                    },
                ],
                selectedRowKeys: [],
                selectedRows: [],
            };
        },

        created() {
            if (this.hasPerm('sysPos:edit') || this.hasPerm('sysPos:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },

        methods: {
            sysPosDelete(record) {
                sysPosDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.reloadTable();
                    } else {
                        this.$message.error('删除失败：' + res.message);
                    }
                });
            },

            toggleAdvanced() {
                this.advanced = !this.advanced;
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
