<template>
    <div>
        <a-card style="position: relative;" :bordered="false">
            <a-spin :spinning="Loading">
                <div class="table-page-search-wrapper">
                    <titleLine titleName="基本信息"></titleLine>

                    <a-form layout="inline">
                        <a-row :gutter="48">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="料商">{{ detailInfo.tenantName }}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="养殖户">{{ detailInfo.customerName }}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="基地状态">
                                    <a-tag v-if="detailInfo.state === 2" color="#87d068">合格</a-tag>
                                    <a-tag v-if="detailInfo.state === 1" color="#87d068">不合格</a-tag>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="创建时间">{{detailInfo.createTime}}</a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
                <div class="table-page-search-wrapper">
                    <titleLine titleName="基地信息"></titleLine>
                    <a-form layout="inline">
                        <a-row :gutter="48">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="基地编号">{{detailInfo.brdBaseNo}}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="基地名称">{{detailInfo.brdBaseName}}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="养殖总量(只)">{{detailInfo.totalBreedCount}}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="棚舍类型">{{detailInfo.brdShedType}}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="棚舍数量">{{detailInfo.brdShedCount}}</a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="基地地址">{{detailInfo ? detailInfo.provinceName + detailInfo.cityName + detailInfo.districtName + detailInfo.address : ''}}</a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                </div>
            </a-spin>
        </a-card>
        <a-card style="margin: 20px 0 0 0;" :bordered="false">
            <a-tabs default-active-key="1" >
                <a-tab-pane key="1" tab="基地尽调">
                    <div>
                        <titleLine :titleName="`基地养殖户居住环境照片（至少2张）`" contentStyle="margin-left:-10px">已上传{{ `${postersData.liveImage&&postersData.liveImage.length}` }}张</titleLine>
                        <div class="imgList" v-if="postersData.liveImage&&postersData.liveImage.length>0" >
                            <a-card hoverable v-for="(item,index) in postersData.liveImage" :key="index" style="width: 240px;height:auto;margin-right: 20px;">
                                <img slot="cover" :src="item.fileUrl"/>
                            </a-card>
                        </div>
                        <div class="line"></div>
                        <titleLine  :titleName="`养殖基地内景及周边照片`" contentStyle="margin-left:-10px">已上传{{ `${postersData.baseImage&&postersData.baseImage.length}` }}张</titleLine>
                        <div class="imgList" v-if="postersData.baseImage&&postersData.baseImage.length>0" >
                            <a-card :title="typeMap[item.fileType]" hoverable v-for="(item,index) in postersData.baseImage" :key="`index_${index}`" style="width: 240px;height:auto;margin-right: 20px;">
                                <img slot="cover" :src="item.fileUrl"/>
                            </a-card>
                        </div>
                        <div class="line"></div>
                        <titleLine  :titleName="`养殖环境`" contentStyle="margin-left:-10px">已上传{{ `${postersData.feedImage&&postersData.feedImage.length}` }}张</titleLine>
                        <div class="imgList" v-if="postersData.feedImage&&postersData.feedImage.length>0" >
                            <a-card hoverable v-for="(item,index) in postersData.feedImage" :key="index" style="width: 240px;height:auto;margin-right: 20px;">
                                <img slot="cover" :src="item.fileUrl"/>
                            </a-card>
                        </div>

                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="环控设备" force-render>
                    暂无数据
                </a-tab-pane>
            </a-tabs>

        </a-card>
    </div>
</template>
<script>
    import { queryPosters, queryBaseDetail, enumList } from '@/api/modular/supplier/supplier';
    import titleLine from './components/titleLine.vue';

    export default {
        components: {
            titleLine,
        },
        data() {
            return {
                Loading: false,
                detailInfo: {},
                postersData: {},
                typeMap: {},

            };
        },
        created() {
            this.getenumList();
            this.queryBaseDetail();
            this.queryPosters();
        },
        methods: {
            async getenumList() {
                const msg = await enumList({ code: 'brdBaseFileType' });
                const { data } = msg;
                this.typeMap = {};
                data.forEach((item, index) => {
                    this.typeMap[item.code] = item.value;
                });
            },
            queryBaseDetail() {
                let id = this.$route.query.id;
                queryBaseDetail({ id }).then(res => {
                    if (res.success === true) {
                        this.detailInfo = res.data;
                    }
                });
            },
            queryPosters() {
                let id = this.$route.query.id;
                queryPosters({ breedingBaseId: id }).then(res => {
                    if (res.success === true) {
                        this.postersData = res.data;
                    }
                });
            },

        },
    };
</script>
<style lang="less" scoped>

.table-page-search-wrapper {
    /deep/.ant-form {
        .ant-form-item {
            .ant-form-item-label {
                min-width: 120px;
            }
        }
    }
}
/deep/.imgList {
    display: flex;
    flex-wrap: wrap;
    .ant-card {
margin-bottom: 20px;
    }

}
.line {
        width: 100%;
        height: 1px;
        background-color: #cccccc;
        margin-bottom: 20px;
    }
button {
    margin-right: 8px;
}

.mr16 {
    margin-right: 16px;
}
.mt20 {
    margin-top: 20px;
}
</style>
