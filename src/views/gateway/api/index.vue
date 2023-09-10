<template>
    <div>
        <a-row :gutter="24">
            <a-col :md="4" :sm="24">
                <a-card :bordered="false">
                    <a-menu mode="inline" theme="light" class="group-list">
                        <a-menu-item key="all" @click="onSelect">
                            <div class="group-info">
                                <a-icon type="api" />
                                <span class="title">全部服务</span>
                            </div>
                        </a-menu-item>
                        <a-menu-item v-for="item in routeData" :key="item.serviceId" @click="onSelect">
                            <div class="group-item">
                                <div class="group-info">
                                    <a-icon type="api" />
                                    <span class="title">{{ item.serviceId }}</span>
                                </div>
                            </div>
                        </a-menu-item>
                    </a-menu>
                </a-card>
            </a-col>
            <a-col :md="20" :sm="24">
                <a-card :bordered="false">
                    <div class="table-page-search-wrapper" v-if="hasPerm('api:page')">
                        <a-form layout="inline">
                            <a-row :gutter="48">
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="接口名称">
                                        <a-input v-model="queryParam.name" allow-clear placeholder="请输入接口名称" />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <a-form-item label="请求地址">
                                        <a-input v-model="queryParam.path" allow-clear placeholder="请输入请求地址" />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="6" :sm="24">
                                    <span class="table-page-search-submitButtons">
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
                        :alert="true"
                        :rowKey="record => record.id"
                        :scroll="{ x: 'calc(600px + 50%)', y: 600 }"
                        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    >
                        <template class="table-operator" slot="operator" v-if="hasPerm('api:sync')">
                            <a-popconfirm
                                v-if="hasPerm('api:sync')"
                                placement="topRight"
                                title="确认同步？"
                                @confirm="() => aipSync()"
                            >
                                <a-button type="primary" icon="reload">
                                    同步接口
                                </a-button>
                            </a-popconfirm>
                        </template>
                        <span slot="status" slot-scope="text, record">
                            <a-tag :color="record.status === 0 ? 'blue' : 'red'">{{ statusFilter(text) }}</a-tag>
                        </span>
                        <span slot="auth" slot-scope="text, record">
                            <a-tag :color="record.auth === 0 ? 'blue' : 'red'">{{ authFilter(text) }}</a-tag>
                        </span>
                        <span slot="code" slot-scope="text">
                            <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                        </span>
                        <span slot="path" slot-scope="text">
                            <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                        </span>
                        <span slot="action" slot-scope="text, record">
                            <a v-if="hasPerm('api:edit')" @click="$refs.editForm.edit(record)">
                                <a-icon type="edit" />
                            </a>
                            <a-divider type="vertical" v-if="hasPerm('api:edit') & hasPerm('api:delete')" />
                            <a-popconfirm
                                v-if="hasPerm('api:delete')"
                                placement="topRight"
                                title="确认删除？"
                                @confirm="() => apiDelete(record)"
                            >
                                <a>
                                    <a-icon type="delete" />
                                </a>
                            </a-popconfirm>
                        </span>
                    </s-table>
                    <edit-form ref="editForm" @ok="handleOk" />
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { apiPage, apiDelete, apiSync } from '@/api/modular/gateway/api';
    import { routeList } from '@/api/modular/gateway/route';
    import editForm from './editForm.vue';
    export default {
        components: {
            STable,
            editForm,
            Ellipsis,
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '接口编码',
                        align: 'center',
                        dataIndex: 'code',
                        fixed: 'left',
                        scopedSlots: { customRender: 'code' },
                    },
                    {
                        title: '服务ID',
                        align: 'center',
                        dataIndex: 'serviceId',
                    },
                    {
                        title: '接口名称',
                        align: 'center',
                        dataIndex: 'name',
                    },
                    {
                        title: '请求方法',
                        align: 'center',
                        dataIndex: 'method',
                    },
                    {
                        title: '请求路径',
                        align: 'center',
                        dataIndex: 'path',
                        scopedSlots: { customRender: 'path' },
                    },
                    {
                        title: '认证检验',
                        align: 'center',
                        dataIndex: 'auth',
                        scopedSlots: { customRender: 'auth' },
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
                    return apiPage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                routeData: [],
                statusPrefixData: [],
                authPrefixData: [],
            };
        },
        created() {
            if (this.hasPerm('api:edit') || this.hasPerm('api:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '90px',
                    align: 'center',
                    dataIndex: 'action',
                    fixed: 'right',
                    scopedSlots: { customRender: 'action' },
                });
            }
            this.routeList();
            this.dataTypeItem();
        },
        methods: {
            apiDelete(record) {
                apiDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('删除失败'); // + res.message
                    }
                });
            },
            aipSync() {
                apiSync().then(res => {
                    if (res.success) {
                        this.$message.success('同步成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('同步失败'); // + res.message
                    }
                });
            },
            handleOk() {
                this.$refs.table.refresh();
            },
            routeList() {
                routeList().then(res => {
                    if (res.success) {
                        this.routeData = res.data;
                    }
                });
            },
            /**
             * 获取字典数据
             */
            dataTypeItem() {
                this.statusPrefixData = this.$options.filters['dictData']('status');
                this.authPrefixData = this.$options.filters['dictData']('auth');
            },
            statusFilter(status) {
                // eslint-disable-next-line eqeqeq
                const values = this.statusPrefixData.filter(item => item.dictKey == status);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },
            authFilter(auth) {
                // eslint-disable-next-line eqeqeq
                const values = this.authPrefixData.filter(item => item.dictKey == auth);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },
            onSelect(record) {
                this.queryParam.serviceId = record.key;
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
@import './index';
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
.group-add {
  margin: 0 0 @margin @margin-lg;
  height: 32.5px;
}
.group-list {
  border: 0;
  .group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .actions {
      .edit,
      .remove {
        color: #909090;
        padding: 12px 0;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }
}
</style>
