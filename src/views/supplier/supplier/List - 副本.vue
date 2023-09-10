<template>
    <a-card :bordered="false">
        <a-spin :spinning="Loading">
            <div class="table-page-search-wrapper" >
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="厂商名" >
                                <a-input v-model="queryParam.name" allow-clear placeholder="请输入厂商名称"/>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="厂商类型" >
                                <a-select v-model="queryParam.companyType"  dropdownMatchSelectWidth @change="companyTypeChange">
                                    <a-select-option value="all">全部状态</a-select-option>
                                    <a-select-option  :key="index" v-for="(item,index) in companyTypeList" :value="item.code">{{ item.value }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="状态" >
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
            <div class="table-operator"  >
                <div class="table-operator-left">厂商管理</div>
                <div class="table-operator-right">
                    <a-button type="primary" icon="plus" @click="$refs.addForm.add()">新增厂商</a-button>
                    <a-tooltip title="刷新" class="s-tool-item"  @click="$refs.table.refresh();">
                        <a-icon type="reload" :style="{ fontSize: '20px'}" />
                    </a-tooltip>
                </div>

            </div>
            <s-table
                ref="table"
                size="default"
                :columns="columns"
                :data="loadData"
                :showTools="false"
                :alert="false"
                :rowKey="(record) => record.id">
                <span slot="linkman" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text|| '-' }}</ellipsis>
                </span>
                <span slot="mobile" slot-scope="text">
                    <ellipsis :length="20" tooltip>{{ text|| '-' }}</ellipsis>
                </span>
                <span slot="companyType" slot-scope="text">
                    {{getSpmCompanyType(text)}}
                </span>
                <span slot="state" slot-scope="text" :style="`color:${text==1?'#1DBF50':'#EC3838'}`">
                    {{getState(text)}}
                </span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16"  @click="gopage('feedList',record)" v-if="record.companyType.indexOf(2) > -1" >饲料管理</a>
                    <a  class="mr16" @click="gopage('supplierdetail',record)" >详情</a>
                    <a  class="mr16" @click="$refs.addForm.edit(record)" >编辑</a>
                    <a  @click="showDialog(record)">{{record.state == 1 ? '封禁' : '恢复'}}</a>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk" />
            <route-view></route-view>
        </a-spin>
    </a-card>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { spmCompanyList, updateSupplierStatus, enumList } from '@/api/modular/supplier/supplier';
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
                        title: '厂商ID',
                        dataIndex: 'id',
                        width: '250px',
                        scopedSlots: { customRender: 'id' },
                    },
                    {
                        title: '厂商全称',
                        dataIndex: 'name',
                        width: '250px',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '厂商简称',
                        dataIndex: 'shortName',
                        scopedSlots: { customRender: 'shortName' },
                    },
                    {
                        title: '厂商类型',
                        dataIndex: 'companyType',
                        scopedSlots: { customRender: 'companyType' },
                    },
                    {
                        title: '联系人',
                        dataIndex: 'linkman',
                        scopedSlots: { customRender: 'linkman' },
                    },
                    {
                        title: '手机号',
                        dataIndex: 'mobile',
                        scopedSlots: { customRender: 'mobile' },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        scopedSlots: { customRender: 'createTime' },
                    },
                    {
                        title: '状态',
                        dataIndex: 'state',
                        scopedSlots: { customRender: 'state' },
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
                    return spmCompanyList(Object.assign(parameter, this.queryParam)).then((res) => {
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
  .mr16{
    margin-right: 16px;
  }
</style>
