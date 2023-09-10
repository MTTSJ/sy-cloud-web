/* eslint-disable eqeqeq */
<template>
    <a-card :bordered="false">
        <a-spin :spinning="loading">
            <div class="table-page-search-wrapper" v-if="hasPerm('sysApp:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="10" :sm="24">
                            <a-form-item label="关键词">
                                <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入应用名称或唯一编码" />
                            </a-form-item>
                        </a-col>
                        <!-- <a-col :md="8" :sm="24">
              <a-form-item label="唯一编码">
                <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入唯一编码" />
              </a-form-item>
            </a-col> -->
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
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
            <div class="table-operator" v-if="hasPerm('sysApp:add')">
                <a-button type="primary" v-if="hasPerm('sysApp:add')" icon="plus" @click="$refs.addForm.add()">
                    新增应用
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
                <span slot="active" slot-scope="text, record">
                    <a-tag :color="record.active === 'Y' ? 'blue' : ''">
                        {{ activeFilter(text) }}
                    </a-tag>
                </span>
                <span slot="status" slot-scope="text">
                    {{ statusFilter(text) }}
                </span>
                <span slot="icon" slot-scope="text">
                    <div v-if="text != ''">
                        <a-icon :type="text" />
                    </div>
                </span>

                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('sysApp:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                        编辑
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('sysApp:edit') & hasPerm('sysApp:delete')" />
                    <a-popconfirm
                        v-if="hasPerm('sysApp:delete')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => sysAppDelete(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                            删除
                        </a>
                    </a-popconfirm>
                    <a-divider
                        type="vertical"
                        v-if="
                            hasPerm('sysApp:setAsDefault') &
                                hasPerm('sysApp:delete') &
                                hasPerm('sysApp:setAsDefault') &
                                (record.active == 'N') &
                                (record.active == 'N') || hasPerm('sysApp:edit')
                        "
                    />

                    <a-popconfirm
                        v-if="hasPerm('sysApp:setAsDefault') & (record.active == 'N')"
                        placement="topRight"
                        title="设置为默认应用？"
                        @confirm="() => sysDefault(record)"
                    >
                        <a>
                            <a-icon type="heart" />
                            设为默认
                        </a>
                    </a-popconfirm>
                </span>
            </a-table>

            <add-form ref="addForm" @ok="handleOk" />
            <edit-form ref="editForm" @ok="handleOk" />
        </a-spin>
    </a-card>
</template>

<script>
    import { getPage, sysAppDelete, sysAppSetAsDefault } from '@/api/modular/system/appManage';
    import editForm from './editForm';
    import addForm from './addForm';
    import { TablePageMixin } from '@/mixins/';

    export default {
        components: {
            editForm,
            addForm,
        },
        mixins: [TablePageMixin],
        data() {
            return {
                getPage: getPage,
                // description: '面包屑说明',
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '应用名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '唯一编码',
                        dataIndex: 'code',
                    },
                    {
                        title: '应用图标',
                        dataIndex: 'icon',
                        scopedSlots: { customRender: 'icon' },
                    },
                    {
                        title: '是否默认',
                        dataIndex: 'active',
                        scopedSlots: { customRender: 'active' },
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                ],
                loading: false,
                selectedRowKeys: [],
                selectedRows: [],
                statusDict: [],
                activeDict: [],
            };
        },

        created() {
            this.sysDictTypeDropDown();
            if (this.hasPerm('sysApp:edit') || this.hasPerm('sysApp:delete') || this.hasPerm('sysApp:setAsDefault')) {
                this.columns.push({
                    title: '操作',
                    width: '230px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },

        methods: {
            activeFilter(active) {
                // eslint-disable-next-line eqeqeq
                const values = this.activeDict.filter(item => item.dictKey == active);
                if (values.length > 0) {
                    return values[0].dictValue;
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
                this.activeDict = this.$options.filters['dictData']('ok');
                this.statusDict = this.$options.filters['dictData']('status');
            },

            handleOk() {
                this.reloadTable();
            },

            sysDefault(record) {
                this.loading = true;
                sysAppSetAsDefault({ id: record.id }).then(res => {
                    this.loading = false;
                    if (res.success) {
                        this.$message.success('设置成功');
                        this.reloadTable();
                    } else {
                        this.$message.error('设置失败：' + res.message);
                    }
                });
            },
            /**
             * 删除应用
             */
            sysAppDelete(record) {
                this.loading = true;
                sysAppDelete({ ids: record.id }).then(res => {
                    this.loading = false;
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.reloadTable();
                    } else {
                        this.$message.error('删除失败：' + res.message);
                    }
                });
            },
            onChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
        },
    };
</script>
<style scoped>
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
</style>
