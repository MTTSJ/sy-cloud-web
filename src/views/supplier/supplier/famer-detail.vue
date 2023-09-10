<template>
    <div>
        <a-card :bordered="false">
            <a-spin :spinning="Loading">
                <div class="pageHeaderContent">
                    <div class="avatar">
                        <a-avatar size="large" src='https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png' />
                    </div>
                    <div class="content">
                        <div class="contentTitle">{{ detailInfo.customerName }}</div>
                        <div>ID: {{ detailInfo.customerNo }}</div>
                    </div>
                    <div class="col">
                        <div>最近登录时间：{{ detailInfo.lastLoginTime || '--' }}</div>
                        <div>注册时间：{{ detailInfo.signupTime || '--' }}</div>
                    </div>
                    <div class="col">
                        <div>实名认证时间：{{ detailInfo.authTime || '--' }}</div>
                    </div>
                </div>
                <a-card :bordered="false">
                    <a-descriptions :column="5">
                        <a-descriptions-item label="手机号码：">{{ detailInfo.mobile }}</a-descriptions-item>
                        <a-descriptions-item label="证件类型">{{ detailInfo.certificateTypeName }}</a-descriptions-item>
                        <a-descriptions-item label="证件号">{{ detailInfo.certificateNo }}</a-descriptions-item>
                        <a-descriptions-item label="实名认证状态">{{ detailInfo.authStatus }}</a-descriptions-item>
                        <a-descriptions-item label="账号状态">{{ detailInfo.customerStatus == 0 ? '正常' : '异常'
                        }}</a-descriptions-item>
                        <a-descriptions-item label="户籍地址">{{ detailInfo.hjAddress }}</a-descriptions-item>
                        <a-descriptions-item label="业务经理">{{ detailInfo.bizUserName }}</a-descriptions-item>
                        <a-descriptions-item label="银行卡号">{{ detailInfo.invisterName }}</a-descriptions-item>
                        <a-descriptions-item label="开户行">{{ detailInfo.invisterName }}</a-descriptions-item>
                    </a-descriptions>

                </a-card>
            </a-spin>
        </a-card>

        <a-card :bordered="false" class="tabCardContent" :tabList="operationTabList" :active-tab-key="key" @tabChange="onOperationTabChange">
            <s-table v-if="key == 'tab1'" ref="table" size="default" class="tableContent" :columns="baseColumns"
                     :data="loadData" :showTools="false" :alert="false" :rowKey="(record) => record.id">

                <span slot="fileUrl" slot-scope="text">
                    <img :src="text" alt="" height="120" width="200">
                </span>
                <span slot="state" slot-scope="text" v-html="getState(text)"></span>
                <span slot="type" slot-scope="text" v-html="getType(text)"></span>
                <span slot="customerName" slot-scope="text">
                    <ellipsis :length="20" tooltip>{{ text || '-' }}</ellipsis>
                </span>
                <span slot="customerStatus" slot-scope="text" v-html="getCustomerStatus(text)"></span>
                <span slot="authStatus" slot-scope="text" v-html="renderAuthStatus(text)"></span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" @click="gopage('supplierdetail', record)">详情</a>
                </span>
            </s-table>
            <s-table v-if="key == 'tab2'" ref="table" size="default" class="tableContent" :columns="breedColumns"
                     :data="loadData" :showTools="false" :alert="false" :rowKey="(record) => record.id">
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" @click="gopage('supplierdetail', record)">详情</a>
                </span>
            </s-table>
            <s-table v-if="key == 'tab3'" ref="table" size="default" class="tableContent" :columns="laliaoColumns"
                     :data="loadData" :showTools="false" :alert="false" :rowKey="(record) => record.id">
                <span slot="contactMode" slot-scope="text" v-html="getcontactMode(text)"></span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" @click="gopage('supplierdetail', record)">详情</a>
                </span>
            </s-table>
            <s-table v-if="key == 'tab4'" ref="table" size="default" class="tableContent" :columns="contractColumns"
                     :data="loadData" :showTools="false" :alert="false" :rowKey="(record) => record.id">
                <span slot="contactMode" slot-scope="text" v-html="getcontactMode(text)"></span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" @click="gopage('supplierdetail', record)">详情</a>
                </span>
            </s-table>
            <div v-if="key == 'tab5'">
                <a-list :grid="{ gutter: 16, column: 4 }" :data-source="authInfoData">
                    <a-list-item  slot="renderItem" slot-scope="item, index">
                        <a-card :title="item.title">
                            <img v-if="item.type=='img'" height="200" width="250" :src="item.content" />
                            <video v-if="item.type=='video'"  height="200" width="250" controls>
                                <source :src="item.content" type="video/mp4" />
                            </video>
                        </a-card>
                    </a-list-item>
                </a-list>
            </div>
            <s-table v-if="key == 'tab6'" ref="table" size="default" class="tableContent" :columns="deviceColumns"
                     :data="loadData" :showTools="false" :alert="false" :rowKey="(record) => record.id">
                <span slot="contactMode" slot-scope="text" v-html="getcontactMode(text)"></span>
                <span slot="state" slot-scope="text, record" v-html="getTab6State(text,record)"></span>
                <span slot="alarmState" slot-scope="text, record" v-html="getTab6alarmState(text,record)"></span>
                <span slot="activateState" slot-scope="text, record" v-html="getactivateState(text,record)"></span>
                <span slot="action" slot-scope="text, record">
                    <a class="mr16" @click="gopage('supplierdetail', record)">详情</a>
                </span>
            </s-table>
            <div style="padding: 20px;padding-top: 0px;" v-if="key == 'tab7'">
                <a-list :data-source="tab7Data" :bordered="false" >
                    <a-list-item slot="renderItem" slot-scope="item, index" >
                        <a slot="actions" @click="downloadFile(item.fileUrl, item.fileName);">下载</a>
                        <div class="text-item" @click="lookFile(item.fileUrl);">{{item.fileName}}</div>
                    </a-list-item>
                </a-list>
                <a-button style="margin-top: 20px;" @click="handleOtherModalVisible(true)" type="primary">补充信息</a-button>
            </div>
        </a-card>

        <a-modal title="补充信息" :width="900" :visible="visible" @cancel="handleOtherModalVisible(false)" @ok="handleSubmit">
            <a-spin :spinning="confirmLoading">
                <a-form layout="inline">
                    <a-row :gutter="48" style="width: 100%;">
                        <a-col style="width: 100%;" :md="24" :sm="24">
                            <a-form-item style="width: 100%;" label="补充信息" :label-col="{ span: 2 }"
                                         :wrapper-col=" { span: 22 }">
                                <a-upload
                                    style="width: 100%;"
                                    @change="uploadChange"
                                    :action="`${apiBase}/sycloud-biz/file/upload`"
                                    list-type="picture"
                                    :default-file-list="convertValue(fileList)"
                                >
                                    <a-button> <a-icon type="upload" />单击上传 </a-button>
                                </a-upload>

                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
                <div>支持pdf、xlsx、png、jpg格式，单个大小不超过20M</div>

            </a-spin>
        </a-modal>
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import { download } from '@/utils/download.js';
    import { queryFarmerDetail, breedBaseByCustomer, authInfo, queryCustomerOtherInfo, addCustomerOtherInfo } from '@/api/modular/supplier/supplier';

    export default {
        components: {
            STable,
            Ellipsis,
        },
        data() {
            return {
                Loading: false,
                detailInfo: {},
                visible: false,
                apiBase: process.env.VUE_APP_API,
                fileList: [],
                confirmLoading: false,
                operationTabList: [
                    {
                        key: 'tab1',
                        tab: '养殖基地',
                    },
                    {
                        key: 'tab2',
                        tab: '养殖单',
                    },
                    {
                        key: 'tab3',
                        tab: '拉料单',
                    },
                    {
                        key: 'tab4',
                        tab: '合同信息',
                    },
                    {
                        key: 'tab5',
                        tab: '实名认证信息',
                    },
                    {
                        key: 'tab6',
                        tab: '设备信息',
                    },
                    {
                        key: 'tab7',
                        tab: '其他信息',
                    },
                ],
                key: 'tab1',
                authInfoData: [],
                tab7Data: [],

                baseColumns: [
                    {
                        title: '基地编号',
                        dataIndex: 'id',
                        key: 'id',
                        scopedSlots: { customRender: 'id' },
                    },
                    {
                        title: '基地名称',
                        dataIndex: 'brdBaseName',
                        key: 'brdBaseName',
                        scopedSlots: { customRender: 'brdBaseName' },
                    },
                    {
                        title: '棚舍类型',
                        dataIndex: 'brdShedType',
                        key: 'brdShedType',
                        scopedSlots: { customRender: 'brdShedType' },
                    },
                    {
                        title: '棚舍数量',
                        dataIndex: 'brdShedCount',
                        key: 'brdShedCount',
                        scopedSlots: { customRender: 'brdShedCount' },
                    },
                    {
                        title: '支持养殖总量',
                        dataIndex: 'totalBreedCount',
                        key: 'totalBreedCount',
                        scopedSlots: { customRender: 'totalBreedCount' },
                    },
                    {
                        title: '基地位置',
                        dataIndex: 'address',
                        key: 'address',
                        scopedSlots: { customRender: 'address' },
                    },
                    {
                        title: '基地照片',
                        dataIndex: 'fileUrl',
                        key: 'fileUrl',
                        scopedSlots: { customRender: 'fileUrl' },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        key: 'createTime',
                        scopedSlots: { customRender: 'createTime' },
                    },
                    {
                        title: '状态',
                        dataIndex: 'state',
                        key: 'state',
                        scopedSlots: { customRender: 'state' },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        valueType: 'action',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                breedColumns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        valueType: 'index',
                        scopedSlots: { customRender: 'id' },
                    },
                    {
                        title: '养殖批次',
                        dataIndex: 'brdBatchNo',
                        scopedSlots: { customRender: 'brdBatchNo' },
                    },
                    {
                        title: '申请日期',
                        dataIndex: 'applyDate',
                        scopedSlots: { customRender: 'applyDate' },
                    },
                    {
                        title: '上苗日期',

                        dataIndex: 'actualSeedDate',
                        scopedSlots: { customRender: 'actualSeedDate' },
                    },
                    {
                        title: '合同模式',
                        dataIndex: 'contractTypeName',
                        scopedSlots: { customRender: 'contractTypeName' },
                    },
                    {
                        title: '养殖基地',
                        dataIndex: 'brdBaseName',
                        scopedSlots: { customRender: 'brdBaseName' },
                    },
                    {
                        title: '饲养品类',
                        dataIndex: 'breedCategoryName',
                        scopedSlots: { customRender: 'breedCategoryName' },
                    },
                    {
                        title: '上苗数量',
                        dataIndex: 'actualSeedNum',
                        scopedSlots: { customRender: 'actualSeedNum' },
                    },
                    {
                        title: '业务支持',
                        dataIndex: 'bizUserName',
                        scopedSlots: { customRender: 'bizUserName' },
                    },
                    {
                        title: '状态',
                        dataIndex: 'orderStatusDesc',
                        scopedSlots: { customRender: 'orderStatusDesc' },
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        valueType: 'action',
                        scopedSlots: { customRender: 'action' },
                    },

                ],
                laliaoColumns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        valueType: 'index',
                    },
                    {
                        title: '拉料单号',
                        dataIndex: 'brdBatchNo',
                        order: 6,
                    },
                    {
                        title: '申请重量（kg）',
                        dataIndex: 'createTime',
                        order: 1,
                        valueType: 'dateRange',
                        search: {
                            transform: (value) => {
                                return {
                                    startTime: value[0],
                                    endTime: value[1],
                                };
                            },
                        },
                    },
                    {
                        title: '申请人',
                        sorter: true,
                        dataIndex: 'seedlingDate',
                        search: false,
                    },
                    {
                        title: '订单类型',
                        dataIndex: 'contactMode',
                        order: 2,
                        valueType: 'select',
                        initialValue: '全部',
                    },
                    {
                        title: '业务支持',
                        sorter: true,
                        search: false,
                        dataIndex: 'brdCount1',
                    },
                    {
                        title: '基地地址',
                        sorter: true,
                        search: false,
                        dataIndex: 'brdCount',
                    },
                    {
                        title: '司机',
                        dataIndex: 'bizManagerId2',
                        order: 4,
                    },
                    {
                        title: '状态',
                        dataIndex: 'bizManagerId',
                        order: 4,
                    },
                    {
                        title: '创建时间',
                        sorter: true,
                        order: 3,
                        dataIndex: 'createTime2',
                    },
                    {
                        title: '送达时间',
                        dataIndex: 'bizManagerId3',
                        order: 4,
                    },
                    {
                        title: '操作',
                        dataIndex: 'option',
                        valueType: 'option',
                    },
                ],
                contractColumns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        valueType: 'index',
                    },
                    {
                        title: '养殖批次',
                        dataIndex: 'brdBatchNo',
                        order: 6,
                    },
                    {
                        title: '协议名称',
                        dataIndex: 'createTim2e',
                        order: 1,
                        valueType: 'dateRange',
                        search: {
                            transform: (value) => {
                                return {
                                    startTime: value[0],
                                    endTime: value[1],
                                };
                            },
                        },
                    },
                    {
                        title: '合同模板',
                        sorter: true,
                        dataIndex: 'seedlingDate',
                        search: false,
                    },
                    {
                        title: '合同状态',
                        dataIndex: 'contactMode',
                        order: 2,
                        valueType: 'select',
                        initialValue: '全部',
                        valueEnum: {
                            all: { text: '全部', status: 'Default' },
                            open: {
                                text: '原始合同',
                            },
                            closed: {
                                text: '大小合同',
                            },
                        },
                    },
                    {
                        title: '业务支持',
                        sorter: true,
                        search: false,
                        dataIndex: 'brdCount2',
                    },
                    {
                        title: '签约日期',
                        sorter: true,
                        search: false,
                        dataIndex: 'brdCount',
                    },
                    {
                        title: '操作',
                        dataIndex: 'action',
                        valueType: 'action',
                    },
                ],
                deviceColumns: [
                    {
                        title: '序号',
                        dataIndex: 'index',
                        valueType: 'index',
                        width: '50px',
                    },
                    {
                        title: '设备编码',
                        dataIndex: 'code',
                        // order: 6,
                        width: '100px',
                    },
                    {
                        title: '设备名',
                        dataIndex: 'name',
                        search: false,
                        width: '100px',
                    },
                    {
                        title: '设备类型',
                        dataIndex: 'type',
                        width: '100px',
                        initialValue: '3',
                    },
                    {
                        title: '在线状态',
                        dataIndex: 'state',
                        initialValue: '3',
                        width: '100px',
                    },
                    {
                        title: '预警状态',
                        dataIndex: 'alarmState',
                        width: '100px',
                        search: false,
                    },
                    {
                        title: '温度（℃）',
                        dataIndex: 'temperature',
                        search: false,
                        width: '100px',
                    },
                    {
                        title: '湿度（%）',
                        dataIndex: 'humidity',
                        search: false,
                        width: '100px',
                    },
                    {
                        title: 'Co2（PPM）',
                        dataIndex: 'co2',
                        search: false,
                        width: '100px',
                    },
                    {
                        title: '氨气（PPM）',
                        dataIndex: 'nh3',
                        search: false,
                        width: '120px',
                    },
                    {
                        title: '上报时间',
                        dataIndex: 'reportTime',
                        search: false,
                        width: '200px',
                    },
                    {
                        title: '激活时间',
                        dataIndex: 'activateTime',
                        search: false,
                        width: '200px',
                    },
                    {
                        title: '激活状态',
                        dataIndex: 'activateState',
                        initialValue: '3',
                        width: '100px',
                        valueEnum: {
                            3: { text: '全部' },
                            0: {
                                text: '未激活',
                            },
                            1: {
                                text: '激活',
                            },
                        },
                    },
                    {
                        title: '操作',
                        dataIndex: 'option',
                        valueType: 'option',
                        fixed: 'right',
                        width: '120px',
                        render: (_, record) => [
                        <a
                            key="detail"
                            onClick={() => {
                                history.push('/device/devicedetail?id=' + record.id);
                            }}
                        >
                            详情
                        </a>,
                        ],
                    },
                ],
            };
        },

        created() {
            this.queryFarmerDetail();
        },
        methods: {
            queryFarmerDetail() {
                let p = {
                    id: this.$route.query.id,
                };
                queryFarmerDetail(p).then(res => {
                    this.detailInfo = res.data;
                });
            },
            onOperationTabChange(keyname) {
                console.log('keyname', keyname);
                this.key = keyname;
                if (this.key === 'tab5') {
                    console.log(this.key);
                    this.loadAuthInfo();
                }
                if (this.key === 'tab7') {
                    this.queryCustomerOtherInfo();
                }
            },
            loadData(parameter = {}) {
                let p = {
                    id: this.$route.query.id,
                    operationKey: this.key,
                };
                return breedBaseByCustomer(Object.assign(parameter, p)).then((res) => {
                    return res.data;
                });
            },
            loadAuthInfo(parameter = {}) {
                let p = {
                    id: this.$route.query.id,
                    operationKey: this.key,
                };
                authInfo(Object.assign(parameter, p)).then((res) => {
                    this.authInfoData = [{
                        title: '正面',
                        type: 'img',
                        content: res.data.frontFullImage,
                    }, {
                        title: '背面',
                        type: 'img',
                        content: res.data.backFullImage,
                    }, {
                        title: '人脸识别',
                        type: 'img',
                        content: res.data.photoUrl,
                    }, {
                        title: '视频',
                        type: 'video',
                        content: res.data.videoUrl,
                    }];
                });
            },
            queryCustomerOtherInfo(parameter = {}) {
                let p = {
                    customerId: this.$route.query.id,
                    operationKey: this.key,
                };
                queryCustomerOtherInfo(Object.assign(parameter, p)).then((res) => {
                    this.tab7Data = res.data;
                    this.fileList = res.data;
                });
            },
            downloadFile(content, filename) {
                console.log(content, filename);
                download(content, filename);
            },
            lookFile(content) {
                console.log(content);
                window.open(content);
            },
            convertValue(value) {
                console.log('convertValue', value);
                return value.map((item, index) => {
                    if (!item.originFileObj) {
                        item.status = 'done';
                        item.uid = item.id;
                        item.url = item.fileUrl;
                        item.name = item.fileName;
                        console.log('item', item);
                    }
                    return item;
                });
            },
            handleOtherModalVisible(show) {
                this.visible = show;
            },
            handleSubmit() {
                const hide = this.$message.loading('正在添加');
                let p = {};
                const fileList = this.fileList.map((item) => {
                    const obj = {};
                    obj.fileName = item.name;
                    obj.filePath = item.filePath ? item.filePath : item.response?.data?.name;
                    return obj;
                });
                p.customerId = this.$route.query.id;
                p.fileList = fileList;
                addCustomerOtherInfo(p).then(res => {
                    if (res.success) {
                        hide();
                        this.$message.success('添加成功');
                        this.queryCustomerOtherInfo();
                        this.handleOtherModalVisible(false);
                    }
                });
            },
            uploadChange({ file, fileList }) {
                if (file.status === 'done') {
                    console.log('file,fileList,event', file);
                    file.fileName = file.name;
                    file.filePath = file.response.data.name;
                    const current = this.convertValue([...this.fileList, file]);
                    this.fileList = current;
                    this.$message.success(`${file.name} file uploaded successfully`);
                }
                if (file.status === 'error') {
                    this.$message.error(`${file.name} file upload failed.`);
                }
                if (file.status === 'removed') {
                    console.log('file,fileList,event', file);
                    this.fileList = this.fileList.filter(item => item.name !== file.name);
                }
            },
            getState(state) {
                if (state === undefined) return;
                if (state === 2) {
                    return `<span >合格</span>`;
                } else if (state === 0) {
                    return `<span >待审核</span>`;
                } else if (state === 1) {
                    return `<span >不合格</span>`;
                }
            },
            getTab6State(state, record) {
                if (state === undefined) return '--';
                if (record.activateState === 0) {
                    return '--';
                }
                if (record.state === '0') {
                    return `<span style="color:#FF4F4F">离线</span>`;
                } else if (record.state === '1') {
                    return `<span style="color:#0FD546;">在线</span>`;
                } else {
                    return '--';
                }
            },
            getTab6alarmState(state, record) {
                if (state === undefined) return '--';
                if (record.activateState === 0) {
                    return '--';
                }
                if (state === '0') {
                    return `<span style="color:#0FD546">正常</span>`;
                } else if (state === '1') {
                    return `<span style="color:#FF4F4F;">异常</span>`;
                } else {
                    return '--';
                }
            },
            getactivateState(state, record) {
                if (state === undefined) return '--';
                if (record.activateState === 0) {
                    return '--';
                }
                if (state === '0') {
                    return `<span style="color:#FF4F4F">未激活</span>`;
                } else if (state === '1') {
                    return `<span style="color:#0FD546;">激活</span>`;
                } else {
                    return '--';
                }
            },
            getType(type) {
                if (type === undefined) return;
                if (type === 3) {
                    return `<span >全部</span>`;
                } else if (type === 1) {
                    return `<span >四合一</span>`;
                }
            },
            getcontactMode(type) {
                if (type === undefined) return;
                if (type === 'all') {
                    return `<span >全部</span>`;
                } else if (type === 'open') {
                    return `<span >原始合同</span>`;
                } else if (type === 'closed') {
                    return `<span >大小合同</span>`;
                }
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

.pageHeaderContent {
    display: flex;

    .avatar {
        flex: 0 1 72px;

        &>span {
            display: block;
            width: 72px;
            height: 72px;
            border-radius: 72px;
        }
    }

    .content {
        // position: relative;
        margin-top: 8px;
        // flex: 1 1 auto;
        margin-left: 24px;
        line-height: 22px;

        .contentTitle {
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
        }
    }

    .col {
        margin-top: 4px;
        margin-left: 44px;
        font-size: 13px;
        line-height: 36px;
    }
}
/deep/.tabCardContent {
.ant-list {
    .ant-list-items {
        width: 30%;
        border: none;
        .ant-list-item {
            border: none;
        }

        .text-item {
            color: #1890FF;
            font-weight: bold;
            cursor: pointer;
        }
    }
}
}
</style>
