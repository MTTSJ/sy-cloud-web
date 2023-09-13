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
                            <a-form-item label="料商" >
                                <a-input v-model="queryParam.tenantName" allow-clear />
                            </a-form-item>
                        </a-col>

                        <a-col :md="6" :sm="24">
                            <a-form-item label="基地名称" >
                                <a-input v-model="queryParam.brdBaseName" allow-clear />
                            </a-form-item>
                        </a-col>
                        <template v-if="isShow">

                            <a-col :md="6" :sm="24">
                                <a-form-item label="基地编号" >
                                    <a-input v-model="queryParam.id" allow-clear />
                                </a-form-item>
                            </a-col>
                            <a-col :md="6" :sm="24">
                                <a-form-item label="养殖户ID" >
                                    <a-input v-model="queryParam.customerNo" allow-clear />
                                </a-form-item>
                            </a-col>

                            <a-col :md="12" :sm="24"></a-col>
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
                <div class="table-operator-left">养殖基地管理</div>
                <div class="table-operator-right">
                    <!-- <a-tooltip title="刷新" class="s-tool-item"  @click="$refs.table.refresh();">
                        <a-icon type="reload" :style="{ fontSize: '20px'}" />
                    </a-tooltip> -->
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
                <span slot="state" slot-scope="text" v-html="getCustomerStatus(text)"></span>
                <span slot="action" slot-scope="text, record">
                    <a  @click="showDialog(record)">{{record.state == 0 ? '审核' : '详情'}}</a>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk" />
        </a-spin>
    </a-card>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { baseList, updateCustomerStatus, enumList } from '@/api/modular/supplier/supplier';
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
                    customerName: '',
                    tenantName: '',
                    brdBaseName: '',
                    id: '',
                    customerNo: '',
                },
                isShow: false,
                // 表头
                columns: [
                    {
                        title: '基地编号',
                        dataIndex: 'id',
                        width: '180px',
                        align: 'center',
                        scopedSlots: { customRender: 'id' },
                    },
                    {
                        title: '料商',
                        dataIndex: 'tenantName',
                        width: '100px',
                        align: 'center',
                        scopedSlots: { customRender: 'tenantName' },
                    },
                    {
                        title: '基地名称',
                        dataIndex: 'brdBaseName',
                        width: '120px',
                        align: 'center',

                        scopedSlots: { customRender: 'brdBaseName' },
                    },
                    {
                        title: '养殖户',
                        dataIndex: 'customerName',
                        width: '120px',
                        align: 'center',
                        scopedSlots: { customRender: 'customerName' },
                    },
                    {
                        title: '棚舍类型',
                        width: '100px',
                        align: 'center',
                        dataIndex: 'brdShedType',
                        scopedSlots: { customRender: 'brdShedType' },
                    },
                    {
                        title: '棚舍数量',
                        dataIndex: 'brdShedCount',
                        width: '200px',
                        align: 'center',
                        scopedSlots: { customRender: 'brdShedCount' },
                    },
                    {
                        title: '养殖总量(只)',
                        dataIndex: 'totalBreedCount',
                        width: '120px',
                        align: 'center',
                        scopedSlots: { customRender: 'totalBreedCount' },
                    },
                    {
                        title: '基地位置',
                        dataIndex: 'address',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'address' },
                    },

                    {
                        title: '基地照片',
                        dataIndex: 'filePath',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'filePath' },
                    }, {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'createTime' },
                    }, {
                        title: '状态',
                        dataIndex: 'state',
                        width: '150px',
                        align: 'center',
                        scopedSlots: { customRender: 'state' },
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
                    parameter.state = '0';
                    return baseList(Object.assign(parameter, this.queryParam)).then((res) => {
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
            getCustomerStatus(state) {
                if (state === undefined) return;
                if (state === 1) {
                    return `<span style="color: #EC3D3D">不合格</span>`;
                } else if (state === 2) {
                    return `<span style="color: #1DBF50">合格</span>`;
                } else if (state === 0) {
                    return `<span style="color: #F69D35">待审核</span>`;
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
