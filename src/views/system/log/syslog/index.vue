<template>
    <div>
        <a-card :bordered="false" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('sysLog:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="跟踪ID">
                                <a-input v-model="queryParam.traceId" allow-clear placeholder="请输入跟踪ID" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="日志标题">
                                <a-input v-model="queryParam.title" allow-clear placeholder="请输入日志标题" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="IP地址">
                                <a-input v-model="queryParam.ip" allow-clear placeholder="请输入IP地址" />
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
        </a-card>
        <a-card :bordered="false">
            <s-table
                ref="table"
                size="default"
                :columns="columns"
                :data="loadData"
                :alert="true"
                :rowKey="record => record.id"
                :scroll="{ x: 'calc(600px + 50%)', y: 800 }"
                :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            >
                <template class="table-operator" slot="operator" v-if="hasPerm('sysLog:delete')">
                    <a-popconfirm
                        placement="topRight"
                        title="确认清空所有操作日志数据？"
                        @confirm="() => sysLogDelete({ type: this.queryParam.type })"
                    >
                        <a-button type="primary" icon="delete">
                            清空日志
                        </a-button>
                    </a-popconfirm>
                </template>
                <span slot="urlscopedSlots" slot-scope="text, record">
                    <div style="display:flex;align-items: center;">
                        <a-tag color="#108ee9">
                            {{ record.methodType }}
                        </a-tag>
                        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
                    </div>
                </span>
                <span slot="traceIdscopedSlots" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="ipscopedSlots" slot-scope="text">
                    <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="titlescopedSlots" slot-scope="text">
                    <ellipsis :length="12" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="execTimescopedSlots" slot-scope="text, record">
                    <a-tag :color="record.executeTime <= 1000 ? '#87d068' : 'red'">{{ text }}ms</a-tag>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('sysLog:page')" @click="$refs.detailForm.detail(record)">
                        <a-icon type="eye" />
                        详情
                    </a>
                </span>
            </s-table>
            <detail-form ref="detailForm" @ok="handleOk" />
        </a-card>
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { sysLogPage, sysLogDelete } from '@/api/modular/system/syslog';
    import detailForm from './detailForm.vue';
    export default {
        components: {
            Ellipsis,
            STable,
            detailForm,
        },
        data() {
            return {
                // 查询参数
                queryParam: {
                    type: 'OPT',
                },
                // 表头
                columns: [
                    {
                        title: '服务标识',
                        align: 'center',
                        dataIndex: 'serviceId',
                    },
                    {
                        title: '操作时间',
                        align: 'center',
                        dataIndex: 'createTime',
                    },
                    {
                        title: '用户名',
                        align: 'center',
                        dataIndex: 'userName',
                    },
                    {
                        title: '日志标题',
                        align: 'center',
                        dataIndex: 'title',
                        scopedSlots: { customRender: 'titlescopedSlots' },
                    },
                    {
                        title: '跟踪ID',
                        align: 'center',
                        dataIndex: 'traceId',
                        scopedSlots: { customRender: 'traceIdscopedSlots' },
                    },
                    {
                        title: '方法名',
                        align: 'center',
                        dataIndex: 'methodName',
                    },
                    {
                        title: '请求路径',
                        dataIndex: 'url',
                        width: 200,
                        scopedSlots: { customRender: 'urlscopedSlots' },
                    },
                    {
                        title: '耗时',
                        width: 80,
                        dataIndex: 'executeTime',
                        scopedSlots: { customRender: 'execTimescopedSlots' },
                    },
                    {
                        title: 'IP地址',
                        align: 'center',
                        dataIndex: 'ip',
                    },
                ],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return sysLogPage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
            };
        },
        created() {
            if (this.hasPerm('sysLog:edit') || this.hasPerm('sysLog:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '80px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                    fixed: 'right',
                });
            }
        },
        methods: {
            sysLogDelete(record) {
                sysLogDelete(record).then(res => {
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
