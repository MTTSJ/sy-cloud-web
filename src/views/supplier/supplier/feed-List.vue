<template>
    <a-card :bordered="false">
        <a-spin :spinning="Loading">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24">
                            <a-form-item label="饲料料号">
                                <a-input v-model="queryParam.feedNo" allow-clear placeholder="请输入饲料料号" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="饲料编号">
                                <a-input v-model="queryParam.feedPartNo" allow-clear placeholder="请输入饲料料号" />
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="饲料厂">
                                <a-select placeholder="请选择饲料厂" v-model="queryParam.feedFactoryId" dropdownMatchSelectWidth @change="companyTypeChange">
                                    <a-select-option :key="index" v-for="(item, index) in companyTypeList" :value="item.value">{{ item.label }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="6" :sm="24">
                            <a-form-item label="料商">
                                <a-input v-model="queryParam.liaosshang" allow-clear placeholder="请输入饲料料号" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row :gutter="48">
                        <a-col :md="6" :sm="24"></a-col>
                        <a-col :md="6" :sm="24"></a-col>
                        <a-col :md="6" :sm="24"></a-col>
                        <a-col :md="6" :sm="24" style="text-align: right;">
                            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <div class="table-operator" style="margin-top: 20px;">
                <div class="table-operator-left">
                    <a-tooltip title="刷新" class="s-tool-item" @click="$refs.table.refresh();">
                        <a-icon type="reload" :style="{ fontSize: '20px' }" />
                    </a-tooltip>
                </div>
                <div class="table-operator-right">
                    <a-button type="primary" @click="$refs.addForm.add()">新增饲料</a-button>
                </div>

            </div>
            <s-table ref="table" size="default" :columns="columns" :data="loadData" :showTools="false" :alert="false"
                     :rowKey="(record) => record.id">
                <span slot="feedSection" slot-scope="text">
                    {{ getFeedSection(text) }}
                </span>
                <span slot="feedCategoryCd" slot-scope="text">
                    {{ getFeedCategoryCd(text) }}
                </span>
                <span slot="mobile" slot-scope="text">
                    <ellipsis :length="20" tooltip>{{ text || '-' }}</ellipsis>
                </span>
                <span slot="state" slot-scope="text" v-html="getState(text)"></span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" v-if="record.state == 1 || record.state == 3" @click="gopage('feedForm', record)">编辑</a>
                    <a class="mr16" v-if="record.state == 1 || record.state == 3" @click="showDialog('op', record)">{{record.state == 1 ? '失效' : '生效'}}</a>
                    <a class="mr16" v-if="record.state == 1 || record.state == 3" @click="showDialog('del', record)">删除</a>
                    <a class="mr16" v-if="record.state == 0" @click="gopage('feedDetail', record)">审核</a>
                    <a class="mr16" v-if="record.state == 2" @click="gopage('feedDetail', record)">详情</a>
                </span>
            </s-table>
        </a-spin>
    </a-card>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { fodderList, feedListAll, approvalFeed, removeFeed } from '@/api/modular/supplier/supplier';

    export default {
        components: {
            STable,
            Ellipsis,
        },
        data() {
            return {
                // 查询参数
                queryParam: {
                    state: '1',
                    feedFactoryId: null,
                    feedNo: null,
                    feedPartNo: null,
                    liaosshang: null,
                },
                // 表头
                columns: [
                    {
                        title: '饲料编号',
                        dataIndex: 'feedNo',
                        width: '250px',
                        scopedSlots: { customRender: 'feedNo' },
                    },
                    {
                        title: '料商',
                        dataIndex: 'name',
                        width: '250px',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '饲料厂',
                        dataIndex: 'feedFactoryName',
                        scopedSlots: { customRender: 'feedFactoryName' },
                    },
                    {
                        title: '饲料号段',
                        dataIndex: 'feedSection',
                        scopedSlots: { customRender: 'feedSection' },
                    },
                    {
                        title: '饲料料号',
                        dataIndex: 'feedPartNo',
                        scopedSlots: { customRender: 'feedPartNo' },
                    },
                    {
                        title: '类目',
                        dataIndex: 'feedCategoryCd',
                        scopedSlots: { customRender: 'feedCategoryCd' },
                    },
                    {
                        title: '饲料状态',
                        dataIndex: 'state',
                        scopedSlots: { customRender: 'state' },
                    },
                    {
                        title: '状态更新时间',
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
                    return fodderList(Object.assign(parameter, this.queryParam)).then((res) => {
                        return res.data;
                    });
                },
                Loading: false,
                companyTypeList: [],
            };
        },
        async created() {
            const msg = await feedListAll();
            const { data } = msg;
            this.companyTypeList = data && data.map((item) => {
                return {
                    label: item.name,
                    value: item.id,
                };
            });
        },
        methods: {

            companyTypeChange(val) {
                this.queryParam.feedFactoryId = val;
            },
            getFeedSection(val) {
                const valueEnum = {
                    1001: {
                        text: '二段料',
                    },
                    1002: {
                        text: '三段料',
                    },
                };
                return valueEnum[val] ? valueEnum[val].text ? valueEnum[val].text : null : null;
            },
            getFeedCategoryCd(val) {
                const valueEnum = {
                    1001: {
                        text: '鸭饲料',
                    },
                    1002: {
                        text: '鸡饲料',
                    },
                };
                return valueEnum[val] ? valueEnum[val].text ? valueEnum[val].text : null : null;
            },
            getState(state) {
                if (state === undefined) return;
                if (state === 0) {
                    return `<span style="color: #FFB018">待审核</span>`;
                } else if (state === 3) {
                    return `<span style="color: #FF4F4F">失效</span>`;
                } else if (state === 1) {
                    return `<span style="color: #23D50F">有效</span>`;
                } else if (state === 2) {
                    return `<span style="color: #FF1826">已驳回</span>`;
                }
            },
            statusChange(val) {
                console.log(typeof val);
                this.queryParam.state = val;
            },
            async updateStatus(record) {
                const hide = this.$message.loading('正在更新');
                const params = {};
                params.id = record.id;
                params.auditState = record.state === 1 ? 2 : 1;
                params.state = record.state;
                const msg = await approvalFeed({ ...params });
                if (msg.code === 200) {
                    this.$message.success('更新成功');
                } else {
                    this.$message.success('更新失败' + msg.msg);
                }
                this.$refs.table.refresh();
                hide();
            },
            gopage(key, queryParam) {
                const URL_EMU = {
                    feedForm: '/operate/feed-form',
                    feedDetail: '/operate/feed-detail',
                };
                const { id } = queryParam;
                this.$router.push({
                    path: URL_EMU[key],
                    query: {
                        id,
                    },
                });
            },
            async handleRemove(id) {
                const hide = this.$message.loading('正在删除');
                const res = await removeFeed({
                    id,
                });
                if (res.code === 200) {
                    this.$message.success('删除成功');
                } else {
                    this.$message.success('删除失败' + res.msg);
                }
                this.$refs.table.refresh();
                hide();
            },
            showDialog(type, record) {
                console.log(record);
                const title = {
                    op: `确定要设置成${record.state !== 1 ? '有效吗?' : '失效吗?'}`,
                    del: '确定要删除吗?',
                };
                this.$confirm({
                    title: title[type],
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    icon: false,
                    onOk: () => {
                        if (type === 'op') {
                            this.updateStatus(record);
                        } else if (type === 'del') {
                            this.handleRemove(record.id);
                        }
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
