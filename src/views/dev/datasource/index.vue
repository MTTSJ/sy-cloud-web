<template>
    <div>
        <a-card :bordered="false" v-show="indexOpenShow" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('ds:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="关键词">
                                <a-input v-model="queryParam.keyword" allow-clear placeholder="请输入数据源名称" />
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
                <div slot="operator" v-if="hasPerm('ds:add')">
                    <a-button type="primary" v-if="hasPerm('ds:add')" icon="plus" @click="$refs.editForm.add()">
                        新增
                    </a-button>
                </div>
                <span slot="dbType" slot-scope="text, record">
                    <a-tag :color="record.dbType === 'mysql' ? 'blue' : record.dbType === 'oracle' ? 'green' : 'red'">
                        {{ text }}
                    </a-tag>
                </span>
                <span slot="url" slot-scope="text">
                    <ellipsis :length="25" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="driverClass" slot-scope="text">
                    <ellipsis :length="25" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('ds:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                        编辑
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('ds:edit') & hasPerm('ds:del')" />
                    <a-popconfirm
                        v-if="hasPerm('ds:del')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => dataSourceDel(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                            删除
                        </a>
                    </a-popconfirm>
                </span>
            </s-table>

            <edit-form ref="editForm" @ok="handleOk" />
        </a-card>
    </div>
</template>

<script>
    import { dataSourcePage, dataSourceDel } from '@/api/modular/dev/datasource';
    import { sysDictTypeDropDown } from '@/api/modular/system/dictManage';
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
                        title: '数据库类型',
                        dataIndex: 'dbType',
                        scopedSlots: { customRender: 'dbType' },
                    },
                    {
                        title: '驱动类型',
                        dataIndex: 'driverClass',
                        scopedSlots: { customRender: 'driverClass' },
                    },
                    {
                        title: '连接地址',
                        dataIndex: 'url',
                        scopedSlots: { customRender: 'url' },
                    },
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return dataSourcePage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                dbTypeDictTypeDropDown: [],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
            };
        },

        created() {
            if (this.hasPerm('ds:edit') || this.hasPerm('ds:del')) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
            this.sysDictTypeDropDown();
        },

        methods: {
            dataSourceDel(record) {
                dataSourceDel({ ids: record.id })
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

            dbTypeFilter(dbType) {
                // eslint-disable-next-line eqeqeq
                const values = this.dbTypeDictTypeDropDown.filter(item => item.code == dbType);
                if (values.length > 0) {
                    return values[0].value;
                }
            },

            /**
             * 获取字典数据
             */
            sysDictTypeDropDown() {
                sysDictTypeDropDown({ code: 'dbType' }).then(res => {
                    this.dbTypeDictTypeDropDown = res.data;
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
