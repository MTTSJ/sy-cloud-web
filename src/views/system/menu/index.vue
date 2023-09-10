<template>
    <a-card :bordered="false">
        <div v-if="hasPerm('sysMenu:add')">
            <a-form
                :form="queryParam"
                layout="horizontal"
            >
                <a-row :gutter="24">
                    <a-col :md="6" :sm="24">
                        <a-form-item label="所属应用" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-select
                                v-model="queryParam.application"
                                placeholder="请选择应用分类"
                                style="width: 100%"
                                clearable
                                @change="changeApplication"
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
                        <a-button type="primary" v-if="hasPerm('sysMenu:add')" icon="plus" @click="$refs.addForm.add()">
                            新增菜单
                        </a-button>
                        <a-button @click="batchDel" v-if="selectedRowKeys.length > 0" ghost type="primary" icon="delete">
                            批量删除
                        </a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <a-alert :showIcon="true" style="margin-bottom: 16px">
            <template #message>
                <span style="margin-right: 12px">
                    已选择:
                    <a style="font-weight: 600">{{ selectedRows.length }}</a>
                </span>
                <a style="margin-left: 24px" v-show="selectedRows.length > 0" @click="onClearSelected">清空</a>
            </template>
        </a-alert>

        <a-table
            ref="table"
            :rowKey="record => record.id"
            :pagination="false"
            :defaultExpandAllRows="true"
            :columns="columns"
            :dataSource="data"
            :loading="loading"
            showPagination="auto"
            :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }"
        >
            <!--:rowSelection="rowSelectionon"-->

            <span slot="type" slot-scope="text, record">
                <a-tag :color="record.type === 0 ? 'blue' : record.type === 1 ? 'green' : 'orange'">
                    {{ typeFilter(text) }}
                </a-tag>
            </span>

            <span slot="icon" slot-scope="text">
                <div v-if="text != ''">
                    <a-icon :type="text" />
                </div>
            </span>

            <span slot="action" slot-scope="text, record">
                <template>
                    <a v-if="hasPerm('sysMenu:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                        编辑
                    </a>
                    <a-divider type="vertical" v-if="hasPerm('sysMenu:edit') & hasPerm('sysMenu:delete')" />
                    <a-popconfirm
                        v-if="hasPerm('sysMenu:delete')"
                        placement="topRight"
                        title="删除本菜单与下级？"
                        @confirm="() => handleDel(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                            删除
                        </a>
                    </a-popconfirm>
                </template>
            </span>
        </a-table>

        <add-form ref="addForm" @ok="handleOk" />
        <edit-form ref="editForm" @ok="handleOk" />
    </a-card>
</template>

<script>
    import { getMenuList, sysMenuDelete } from '@/api/modular/system/menuManage';
    import { getAppList } from '@/api/modular/system/appManage';
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
                data: [],
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 6 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 18 },
                },
                queryParam: {
                    application: undefined,
                },
                appData: [],
                loading: true,
                columns: [
                    {
                        title: '菜单名称',
                        dataIndex: 'i18nTitle',
                        width: '20%',
                    },
                    {
                        title: '菜单类型',
                        dataIndex: 'type',
                        scopedSlots: { customRender: 'type' },
                    },
                    {
                        title: '图标',
                        dataIndex: 'icon',
                        scopedSlots: { customRender: 'icon' },
                    },
                    {
                        title: '组件',
                        dataIndex: 'component',
                        ellipsis: true,
                    },
                    {
                        title: '路由地址',
                        dataIndex: 'router',
                        key: 'router',
                        ellipsis: true,
                    },
                    {
                        title: '排序',
                        dataIndex: 'sort',
                    },
                ],
                selectedRowKeys: [],
                typeDict: [],
            };
        },

        created() {
            this.loadData();
            this.getSysApplist();
            if (this.hasPerm('sysMenu:edit') || this.hasPerm('sysMenu:delete')) {
                this.columns.push({
                    title: '操作',
                    dataIndex: 'action',
                    width: '150px',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },

        methods: {
            changeApplication() {
                this.loadData();
            },
            getSysApplist() {
                return getAppList().then(res => {
                    if (res.success) {
                        this.appData = res.data;
                    } else {
                        this.$message.warning(res.message);
                    }
                });
            },
            loadData() {
                this.loading = true;
                getMenuList(this.queryParam)
                    .then(res => {
                        if (res.success) {
                            this.data = res.data;
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    });
                this.sysDictTypeDropDown();
            },

            typeFilter(type) {
                // eslint-disable-next-line eqeqeq
                const values = this.typeDict.filter(item => item.dictKey == type);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },

            /**
             * 获取字典数据
             */
            sysDictTypeDropDown() {
                this.typeDict = this.$options.filters['dictData']('menuType');
            },

            refreshSele() {
                this.loadData();
            },
            handleOk() {
                this.loadData();
            },
            handleDel(record) {
                sysMenuDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.loadData();
                    } else {
                        this.$message.error('删除失败：' + res.message);
                    }
                });
            },

            // onSelectChange(selectedRowKeys) {
            //   this.selectedRowKeys = selectedRowKeys
            // },
            clearSele() {
                this.selectedRowKeys = [];
            },
            onSelectChange(selectedRowKeys, selectedRows) {
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
