<template>
    <a-card :bordered="false">
        <a-spin :spinning="Loading">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="姓名">
                                <a-input v-model="queryParam.name" allow-clear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="手机号">
                                <a-input v-model="queryParam.name" allow-clear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="状态">
                                <a-select v-model="queryParam.state" @change="statusChange">
                                    <a-select-option value="all">全部状态</a-select-option>
                                    <a-select-option :value="1">正常</a-select-option>
                                    <a-select-option :value="0">封禁</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="table-operator">
                <div class="table-operator-left">司机管理</div>
                <div class="table-operator-right">
                    <a-button type="primary" icon="plus" @click="$refs.addForm.add()">新增司机</a-button>
                    <a-tooltip title="刷新" class="s-tool-item" @click="$refs.table.refresh();">
                        <a-icon type="reload" :style="{ fontSize: '20px' }" />
                    </a-tooltip>
                </div>

            </div>
            <s-table ref="table" size="default" :columns="columns" :data="loadData" :showTools="false" :alert="false"
                     :rowKey="(record) => record.id">
                <span slot="index" slot-scope="text,record,index">
                    <ellipsis :length="20" tooltip>{{ index + 1 }}</ellipsis>
                </span>
                <span slot="companyType" slot-scope="text">
                    {{ getSpmCompanyType(text) }}
                </span>
                <span slot="status" slot-scope="text" :style="`color:${text == 1 ? '#1DBF50' : '#EC3838'}`">
                    {{ getState(text) }}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" @click="gopage('supplierdetail', record)">详情</a>
                    <a class="mr16" @click="showDialog(record)">{{ record.status == 1 ? '封禁' : '恢复' }}</a>
                    <a @click="$refs.addForm.edit(record)">编辑</a>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk" />
            <route-view></route-view>
        </a-spin>
    </a-card>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { queryDriver, updateSupplierStatus, enumList } from '@/api/modular/supplier/supplier';
    import addForm from './addForm';
    import { RouteView } from '@/layouts';

    export default {
        components: {
            STable,
            Ellipsis,
            addForm,
            RouteView,
        },
        data() {
            return {
                // 查询参数
                queryParam: {
                    name: '',
                    companyType: '',
                    state: '',
                },
                // 表头
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        scopedSlots: { customRender: 'index' },
                    },
                    {
                        title: '姓名',
                        dataIndex: 'name',
                        width: '200px',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '联系地址',
                        dataIndex: 'address',
                        width: '200px',
                        scopedSlots: { customRender: 'address' },
                    },
                    {
                        title: '手机号',
                        dataIndex: 'phone',
                        scopedSlots: { customRender: 'phone' },
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' },
                    },
                    {
                        title: '备注',
                        dataIndex: 'createBy',
                        scopedSlots: { customRender: 'createBy' },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        scopedSlots: { customRender: 'createTime' },
                    },
                    {
                        title: '最近登录时间',
                        dataIndex: 'updateTime',
                        scopedSlots: { customRender: 'updateTime' },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '300px',
                        fixed: 'right',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                loadData: parameter => {
                    return queryDriver(Object.assign(parameter, this.queryParam)).then((res) => {
                        return res.data;
                    });
                },
                Loading: false,
                companyTypeList: [],
            };
        },
        async created() {
            const msg = await enumList({ code: 'spmCompanyType' });
            const { data } = msg;
            this.companyTypeList = data;
        },
        methods: {
            companyTypeChange(val) {
                this.queryParam.companyType = val;
            },
            statusChange(val) {
                console.log(typeof val);
                this.queryParam.state = val;
            },
            getSpmCompanyType(val) {
                let companyType = '';
                const typeMap = new Map();
                if (this.companyTypeList) {
                    this.companyTypeList.map((item, index) => {
                        typeMap.set(item.code, item.value);
                    });
                }
                val.split(',').map((item, index) => {
                    companyType += typeMap.get(item) + ',';
                });
                return companyType.substring(0, companyType.length - 1);
            },
            getState(val) {
                const valueEnum = {
                    0: '封禁',
                    1: '正常',
                };
                return valueEnum[val];
            },
            showDialog(record) {
                console.log(record);
                this.$confirm({
                    title: '确定要更新供应商状态吗?',
                    class: 'material-move-confirm',
                    width: 500,
                    icon: false,
                    onOk: () => {
                        this.updateStatus(record);
                    },
                });
            },
            handleOk() {
                this.$refs.table.refresh();
            },
            async updateStatus(record) {
                const hide = this.$message.loading('正在更新');
                const p = {
                    id: record.id,
                    state: record.flag === 0 ? 1 : 0,
                };
                try {
                    const msg = await updateSupplierStatus({ ...p });
                    if (msg.code === 200) {
                        this.$message.success('更新成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.success('更新失败' + msg.msg);
                    }
                    hide();
                    return true;
                } catch (error) {
                    console.log(error);
                    hide();
                    this.$message.error('更新失败!');
                    return false;
                }
            },
            gopage(key, queryParam) {
                const URL_EMU = {
                    feedList: '/operate/feed-list',
                    supplierdetail: '/supplier/supplierdetail2',
                    supplierform: '/supplier/supplierform',
                };
                const { id } = queryParam;
                this.$router.push({
                    path: URL_EMU[key],
                    query: {
                        id,
                    },
                });
            },
        },
    };
</script>
<style lang="less" scoped>
/deep/.table-operator {
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .table-operator-left {
        font-weight: bold;
        font-size: 28px;
    }

    .table-operator-right {
        display: flex;
        align-items: center;
    }
}

button {
    margin-right: 8px;
}

.mr16 {
    margin-right: 16px;
}
</style>
