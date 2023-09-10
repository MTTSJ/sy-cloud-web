<!--
* @Author: MTT
* @description 厂商详情页面
* @date 2023/08/25 16:30:08
-->
<template>
    <div class="supplierdetail">
        <card>
            <titleLine titleName="基本信息"></titleLine>
            <a-descriptions class="labelStyle">
                <a-descriptions-item label="ID">{{detail.id}}</a-descriptions-item>
                <a-descriptions-item label="厂商全称">
                    {{detail ? detail.name : ''}}
                    <a-tag v-if="renderContent(detail.companyType).includes('1')"  color="#0CB5EA" style=";margin-left: 10px;">冷藏厂</a-tag>
                    <a-tag v-if="renderContent(detail.companyType).includes('2')" color="#FF7A19" style="margin-left: 10px;">饲料厂</a-tag>
                    <a-tag v-if="renderContent(detail.companyType).includes('3')" color="#23D50F" style="margin-left: 10px;">苗厂</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="厂商简称">{{detail.shortName}}</a-descriptions-item>
                <a-descriptions-item label="地址">{{detail.address}}</a-descriptions-item>
                <a-descriptions-item label="联系人">{{detail.linkman}}</a-descriptions-item>
                <a-descriptions-item label="手机号">{{detail.mobile}}</a-descriptions-item>
                <a-descriptions-item label="创建时间">{{detail.createTime}}</a-descriptions-item>
                <a-descriptions-item label="状态">
                    <a-tag v-if="detail.state==1" color="#1DBF50"  style="margin-left: 10px;">正常</a-tag>
                    <a-tag v-if="detail.state==0" color="#EC3838" style="margin-left: 10px;">禁用</a-tag>
                </a-descriptions-item>
            </a-descriptions>
        </card>
    </div>
</template>

<script>
    import card from './components/card.vue';
    import titleLine from './components/titleLine.vue';
    import { getSupplierDetail } from '@/api/modular/supplier/supplier';

    export default {
        name: 'supplierdetail',
        components: {
            card,
            titleLine,
        },
        data() {
            return {
                detail: {},
            };
        },
        mounted() {
            this.getSupplierDetail();
        },
        methods: {
            getSupplierDetail() {
                const p = {
                    id: this.$route.query.id,
                };
                getSupplierDetail(p).then(res => {
                    if (res.success === true) {
                        const detail = res.data;
                        const dz = {};
                        dz.address = detail.address;
                        dz.lng = detail.longitude;
                        dz.lat = detail.latitude;
                        detail.dz = dz;
                        detail.state = detail.state + '';
                        this.detail = detail;
                    }
                });
            },
            renderContent(value) {
                // {"2" => "饲料厂", "3" => "苗厂", "1" => "食品冷藏厂"}
                if (value === undefined) return [];
                return value.split(',');
            },
        },
    };
</script>
<style lang="less" scoped>
   .supplierdetail{
    /deep/.labelStyle {
.ant-descriptions-row {
    .ant-descriptions-item {
        .ant-descriptions-item-label {
            min-width: 100px;
            text-align: right;
        }
    }
}
    }
   }
</style>
