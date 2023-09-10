<template>
    <a-card style="position: relative;min-height: 90vh; padding-bottom: 200px;" :bordered="false">
        <a-spin :spinning="Loading">
            <div class="table-page-search-wrapper">
                <titleLine titleName="基本信息"></titleLine>

                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="料商">
                                <a-select placeholder="请选择料商" v-model="queryParam.tenantName" dropdownMatchSelectWidth @change="companyTypeChange">
                                    <a-select-option :key="index" v-for="(item, index) in companyTypeList" :value="item.value">{{ item.label }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="8" :sm="24">
                            <a-form-item label="饲料厂">
                                <a-select placeholder="请选择饲料厂" v-model="queryParam.feedFactoryId" dropdownMatchSelectWidth @change="companyTypeChange">
                                    <a-select-option :key="index" v-for="(item, index) in companyTypeList" :value="item.value">{{ item.label }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="类目">
                                <div style="display: flex;">
                                    <a-select  v-model="queryParam.feedCategoryCd" dropdownMatchSelectWidth @change="companyTypeChange" style="margin-right: 10px;">
                                        <a-select-option :key="index" v-for="(item, index) in feedCategoryCdList" :value="item.value">{{ item.label }}</a-select-option>
                                    </a-select>
                                    <a-select  v-model="queryParam.feedFactoryId" dropdownMatchSelectWidth @change="companyTypeChange">
                                        <a-select-option :key="index" v-for="(item, index) in companyTypeList" :value="item.value">{{ item.label }}</a-select-option>
                                    </a-select>
                                </div>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="饲料号段">
                                <a-select placeholder="请选择饲料号段" v-model="queryParam.feedSection" dropdownMatchSelectWidth @change="companyTypeChange">
                                    <a-select-option :key="index" v-for="(item, index) in feedSectionList" :value="item.value">{{ item.label }}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :md="8" :sm="24">
                            <a-form-item label="饲料料号">
                                <a-input v-model="queryParam.feedPartNo" allow-clear placeholder="请输入饲料料号" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <titleLine titleName="规格信息"></titleLine>
            <a-card title="规格设置">
                <a-card-grid style="width:25%;text-align:right">产品重量</a-card-grid>
                <a-card-grid style="width:75%;text-align:left" :hoverable="false">
                    <a-checkbox :checked="true" @change="weightChange">40kg</a-checkbox>
                </a-card-grid>
            </a-card>
            <a-card title="价格信息">
                <a-card-grid style="width:100%;text-align:left;display: flex;align-items: center;" :hoverable="false">
                    <span style="margin-right: 10px;">价格</span> <a-input style="width:400px;margin-right: 10px;" v-model="queryParam.feedPrice" placeholder="请输入价格" />元/吨
                </a-card-grid>
                <a-card-grid :hoverable="false" style="width:50%;text-align:center">产品重量</a-card-grid>
                <a-card-grid :hoverable="false" style="width:50%;text-align:center">单价</a-card-grid>
                <template v-for="(item,index) in detailInfo.spmFeedUnitPriceVoList">
                    <a-card-grid :hoverable="false" :key="`weight_${index}`" style="width:50%;text-align:center">{{item.weight||'--'}}KG</a-card-grid>
                    <a-card-grid :hoverable="false" :key="`feedPrice_${index}`" style="width:50%;text-align:center">￥{{item.feedPrice|| '--'}}</a-card-grid>

                </template>
            </a-card>

        </a-spin>
        <a-card style="position: absolute;bottom: 0;width: 100%;" :bordered="false">
            <a-card-grid :hoverable="false" style="width:100%;text-align:left;box-shadow:none;">
                <a-button @click="showDialog" type="primary">保存</a-button>
                <a-button @click="gopage">取消</a-button>
            </a-card-grid>

        </a-card>
    </a-card>
</template>
<script>
    import { feedListAll, queryFodderDetail, enumList, fakeSubmitFeed } from '@/api/modular/supplier/supplier';
    import titleLine from './components/titleLine.vue';

    export default {
        components: {
            titleLine,
        },
        data() {
            return {
                // 查询参数
                queryParam: {
                    feedFactoryId: null,
                    feedCategoryCd: null,
                    feedPartNo: null,
                    feedSection: null,
                    tenantName: null,
                    feedPrice: null,
                },
                Loading: false,
                companyTypeList: [], // 饲料厂
                feedSectionList: [], // 饲料号段
                detailInfo: {},
                feedCategoryCdList: [
                    {
                        label: '鸭饲料',
                        value: '1001',
                    },
                    {
                        label: '鸡饲料',
                        value: '1002',
                    },
                ],

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
            this.queryFodderDetail();
        },
        methods: {
            async getenumList() {
                const msg = await enumList({ code: 'feedSection' });
                const { data } = msg;
                this.feedSectionList = data && data.map((item) => {
                    return {
                        label: item.value,
                        value: item.code,
                    };
                });
            },
            queryFodderDetail() {
                let id = this.$route.query.id;
                queryFodderDetail({ id }).then(res => {
                    if (res.success === true) {
                        this.detailInfo = res.data;
                        this.queryParam = {
                            feedFactoryId: this.detailInfo.feedFactoryId || null,
                            feedCategoryCd: this.detailInfo.feedCategoryCd || null,
                            feedPartNo: this.detailInfo.feedPartNo || null,
                            feedSection: this.detailInfo.feedSection || null,
                            tenantName: this.detailInfo.tenantName || null,
                            feedPrice: this.detailInfo.feedPrice || null,
                        };
                    }
                });
            },

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
            gopage() {
                this.$router.push('/operate/feed-list');
            },
            showDialog() {
                this.$confirm({
                    title: '确定保存吗?',
                    okText: '是',
                    okType: 'danger',
                    cancelText: '否',
                    content: '保存后，饲料状态会变为【生效中】',
                    icon: false,
                    onOk: () => {
                        this.submit();
                    },
                });
            },
            weightChange(e) {
                console.log(`checked = ${e.target.checked}`);
            },
            async submit() {
                try {
                    let params = {
                        feedFactoryId: '1528676289194889217',
                        feedCategoryCd: '1001',
                        feedSection: '1002',
                        feedPartNo: '549红',
                        feedPrice: 2700,
                        id: this.$route.query.id || null,
                        weightModel: 40,
                    };
                    let p = { ...params, ...this.queryParam };

                    const response = await fakeSubmitFeed(p);
                    if (response.code === 200) {
                        this.$message.success('提交成功');
                        this.$router.push('/operate/feed-list');
                    } else {
                        this.$message.error('提交失败!');
                    }
                } catch {
                    // console.log
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
.table-page-search-wrapper {
    /deep/.ant-form {
        .ant-form-item {
            .ant-form-item-label {
                min-width: 120px;
            }
        }
    }
}

button {
    margin-right: 8px;
}

.mr16 {
    margin-right: 16px;
}
</style>
