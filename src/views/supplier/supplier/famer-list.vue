<template>
    <a-card :bordered="false">
        <a-spin :spinning="Loading">
            <div class="table-page-search-wrapper" >
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="养殖户" >
                                <a-input v-model="queryParam.customerName" allow-clear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="养殖户ID" >
                                <a-input v-model="queryParam.id" allow-clear />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="手机号" >
                                <a-input v-model="queryParam.mobile" allow-clear />
                            </a-form-item>
                        </a-col>
                        <template v-if="isShow">
                            <a-col :md="6" :sm="24">
                                <a-form-item label="实名认证状态" >
                                    <a-select v-model="queryParam.authStatus" @change="statusChange">
                                        <a-select-option :value="2">全部状态</a-select-option>
                                        <a-select-option :value="1">已认证</a-select-option>
                                        <a-select-option :value="0">未认证</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="账号状态" >
                                    <a-select v-model="queryParam.customerStatus" @change="statusChange">
                                        <a-select-option :value="2">全部状态</a-select-option>
                                        <a-select-option :value="0">正常</a-select-option>
                                        <a-select-option :value="1">封禁</a-select-option>
                                        <a-select-option :value="3">已注销</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="注册日期" >
                                    <a-range-picker  :disabled-date="disabledDate" @change="dateChange" />
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="料商" >
                                    <a-input v-model="queryParam.tenantName" allow-clear />
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="6" :sm="24" style="text-align: right;">
                            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                            <a-button type="link" style="margin-left: 8px" @click="isShow=!isShow">
                                {{isShow?'收起':'展开'}}
                                <a-icon v-show="!isShow" type="down" />
                                <a-icon v-show="isShow" type="up" />
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="table-operator"  >
                <div class="table-operator-left">养殖户</div>
                <div class="table-operator-right">
                    <a-tooltip title="刷新" class="s-tool-item"  @click="$refs.table.refresh();">
                        <a-icon type="reload" :style="{ fontSize: '20px'}" />
                    </a-tooltip>
                </div>

            </div>
            <s-table
                ref="table"
                size="default"
                class="tableContent"
                :columns="columns"
                :data="loadData"
                :showTools="false"
                :alert="false"
                :rowKey="(record) => record.id">

                <span slot="mobile" slot-scope="text">
                    <ellipsis :length="20" tooltip>{{ text || '-' }}</ellipsis>
                </span>
                <span slot="customerName" slot-scope="text">
                    <ellipsis :length="20" tooltip>{{ text || '-' }}</ellipsis>
                </span>
                <span slot="customerStatus" slot-scope="text" v-html="getCustomerStatus(text)"></span>
                <span slot="authStatus" slot-scope="text" v-html="renderAuthStatus(text)"></span>
                <span slot="action" slot-scope="text, record">
                    <a  class="mr16" @click="gopage('supplierdetail',record)" >详情</a>
                    <a  @click="showDialog(record)">{{record.customerStatus == 0 ? '封禁' : '恢复'}}</a>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk" />
        </a-spin>
    </a-card>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { farmerList, updateCustomerStatus, enumList } from '@/api/modular/supplier/supplier';
    import addForm from './addForm';
    import moment from 'moment';

    export default {
        components: {
            STable,
            Ellipsis,
            addForm,
        },
        data() {
            return {
                // 查询参数
                queryParam: {
                    authStatus: '',
                    customerName: '',
                    state: '',
                    id: '',
                    customerStatus: '',
                    registerDateBegin: '',
                    registerDateEnd: '',
                },
                isShow: false,
                // 表头
                columns: [
                    {
                        title: '养殖户ID',
                        dataIndex: 'id',
                        width: '180px',
                        align: 'center',
                        scopedSlots: { customRender: 'id' },
                    },
                    {
                        title: '料商',
                        dataIndex: 'name',
                        width: '100px',
                        align: 'center',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '养殖户',
                        dataIndex: 'customerName',
                        width: '120px',
                        align: 'center',

                        scopedSlots: { customRender: 'customerName' },
                    },
                    {
                        title: '手机号',
                        dataIndex: 'mobile',
                        width: '120px',
                        align: 'center',
                        scopedSlots: { customRender: 'mobile' },
                    },
                    {
                        title: '证件类型',
                        width: '100px',
                        align: 'center',
                        dataIndex: 'certificateTypeName',
                        scopedSlots: { customRender: 'certificateTypeName' },
                    },
                    {
                        title: '证件号',
                        dataIndex: 'certificateNo',
                        width: '200px',
                        align: 'center',
                        scopedSlots: { customRender: 'certificateNo' },
                    },
                    {
                        title: '业务经理',
                        dataIndex: 'bizUserName',
                        width: '120px',
                        align: 'center',
                        scopedSlots: { customRender: 'bizUserName' },
                    },
                    {
                        title: '累计养殖次数',
                        dataIndex: 'totalBreedOrderCount',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'totalBreedOrderCount' },
                    },

                    {
                        title: '注册时间',
                        dataIndex: 'signupTime',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'signupTime' },
                    }, {
                        title: '最近登录时间',
                        dataIndex: 'lastLoginTime',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'lastLoginTime' },
                    }, {
                        title: '认证状态',
                        dataIndex: 'authStatus',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'authStatus' },
                    }, {
                        title: '账号状态',
                        dataIndex: 'customerStatus',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'customerStatus' },
                    },

                    {
                        title: '操作',
                        dataIndex: 'action',
                        width: '120px',
                        fixed: 'right',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                loadData: parameter => {
                    if (parameter.authStatus === 2 || parameter.authStatus === '全部') {
                        delete parameter.authStatus;
                    }
                    if (parameter.customerStatus === 2 || parameter.customerStatus === '全部') {
                        delete parameter.customerStatus;
                    }
                    return farmerList(Object.assign(parameter, this.queryParam)).then((res) => {
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
            disabledDate(current) {
                // Can not select days before today and today
                return current && current > moment().endOf('day');
            },
            getspmCompanyList() {

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
            renderAuthStatus(state) {
                if (state === undefined) return;
                if (state === 0) {
                    return `<span style="color: #FF4F4F">未认证</span>`;
                } else if (state === 1) {
                    return `<span style="color: #23D50F">已认证</span>`;
                }
            },
            getCustomerStatus(state) {
                // const valueEnum = {
                //     1: '封禁',
                //     2: '全部',
                //     0: '正常',
                // };
                if (state === undefined) return;
                if (state === 1) {
                    return `<span style="color: #FF4F4F">封禁</span>`;
                } else if (state === 0) {
                    return `<span style="color: #23D50F">正常</span>`;
                }
            },
            dateChange(date, dateString) {
                console.log(date, dateString);
                this.queryParam.registerDateBegin = dateString[0];
                this.queryParam.registerDateEnd = dateString[1];
            },
            showDialog(record) {
                console.log(record);
                this.$confirm({
                    title: '确定要更新用户状态吗??',
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
                    customerStatus: record.flag === 0 ? 1 : 0,
                };
                try {
                    const msg = await updateCustomerStatus({ ...p });
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
  .mr16{
    margin-right: 16px;
  }
 /deep/ .tableContent {
.ant-spin-container {
    .ant-table {
        .ant-table-content {
            .ant-table-body {
                .ant-table-tbody {
                    tr {
                        td {
                            padding: 10px;
                        }
                    }
                }
            }
            .ant-table-fixed-right {
                .ant-table-body-outer {
                    .ant-table-body-inner {
                        .ant-table-tbody {
                            tr {
                                td {
                                    padding: 10px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
  }
</style>
