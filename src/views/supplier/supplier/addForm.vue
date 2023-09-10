<template>
    <a-modal title="新增厂商" :width="900" :visible="visible" :confirmLoading="confirmLoading" @ok="handleSubmit"
             @cancel="handleCancel">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item label="厂商全称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input  placeholder="请输入厂商全称"
                              v-decorator="['name', { rules: [{ required: true, message: '请输入厂商全称!' }] ,initialValue:formInfo.name}]" />
                </a-form-item>
                <a-form-item label="厂商简称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input  placeholder="请输入厂商简称"
                              v-decorator="['shortName', { rules: [{ required: true, message: '请输入厂商简称!' }] ,initialValue:formInfo.shortName}]" />
                </a-form-item>
                <a-form-item label="厂商类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-checkbox-group style="width: 100%;" :options="companyTypeOptions" @change="onChange" v-decorator="['companyType', { rules: [{ required: true, message: '请选择厂商类型!' }],initialValue:formInfo.companyType }]" />
                </a-form-item>
                <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input style="display: none;" placeholder="请输入厂商地址" v-decorator="['address', { rules: [{ required: true, message: '请输入地址!' }],initialValue:formInfo.address }]"  />
                    <Map :dz="formInfo.dz" @callback="mapCallback"></Map>
                </a-form-item>
                <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input v-decorator="['linkman', { initialValue:formInfo.linkman }]"  placeholder="请输入联系人" />
                </a-form-item>
                <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input v-decorator="['mobile', { initialValue:formInfo.mobile }]" placeholder="请输入联系人" />
                </a-form-item>
                <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-select v-decorator="['state', { initialValue:formInfo.state }]"   style="width: 100%" placeholder="请选择状态">
                        <a-select-option :value="1">正常</a-select-option>
                        <a-select-option :value="0">封禁</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { addSupplier, updateSupplier } from '@/api/modular/supplier/supplier';
    import Map from './map2.vue';
    export default {
        components: {
            Map,
        },
        data() {
            return {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 15 },
                },
                center: { lng: 0, lat: 0 },
                zoom: 3,
                formType: 'addType',
                companyTypeOptions: [
                    {
                        'value': '1',
                        'label': '食品冷藏厂',
                    },
                    {
                        'value': '2',
                        'label': '饲料厂',
                    },
                    {
                        'value': '3',
                        'label': '苗厂',
                    },
                ],
                formInfo: {
                    name: '',
                    shortName: '',
                    dz: {},
                    companyType: [],
                    address: '',
                    linkman: '',
                    mobile: '',
                    state: 1,
                },
                visible: false,
                confirmLoading: false,
                jdbcDriverList: [],
                form: this.$form.createForm(this),
                dzOptions: [],
                keyword: '',
                mapCenter: { lng: 0, lat: 0 },
                mapLocation: {
                    index: 0,
                    address: '',
                    str: '',
                    city: '',
                    point: {
                        lng: 0,
                        lat: 0,
                    },
                },
            };
        },
        mounted() {},
        methods: {
            // 初始化方法
            add() {
                this.formType = 'addType';
                this.visible = true;
            },
            searchcomplete(val) {
                console.log(val);
            },
            selectChange(e) {
                this.keyword = e.target.value;
            },
            // 初始化方法
            edit(record) {
                this.visible = true;
                this.formType = 'addType';
                let companyType = record.companyType ? record.companyType.split(',') : [];
                setTimeout(() => {
                    this.form.setFieldsValue(
                        {
                            name: record.name,
                            shortName: record.shortName,
                            companyType,
                            dz: record.dz,
                            linkman: record.linkman,
                            mobile: record.mobile,
                            address: record.address,
                            state: record.state,
                        },
                    );
                }, 100);
                this.formInfo.dz = {
                    address: record.address,
                    addressInfo: record.address,
                    lat: record.latitude,
                    lng: record.longitude,
                };
            },
            onChange(val) {
                console.log(val);
            },
            handleSubmit() {
                const { form: { validateFields } } = this;
                validateFields((errors, values) => {
                    if (!errors) {
                        this.confirmLoading = true;
                        this[this.formType] && this[this.formType]();
                    }
                });
            },
            addType(values) {
                addSupplier(values).then((res) => {
                    if (res.success) {
                        this.$message.success('新增成功');
                        this.$emit('ok', values);
                        this.handleCancel();
                    } else {
                        this.$message.error('新增失败：' + res.message);
                    }
                }).finally((res) => {
                    this.confirmLoading = false;
                });
            },
            editType(values) {
                updateSupplier(values).then((res) => {
                    if (res.success) {
                        this.$message.success('新增成功');
                        this.$emit('ok', values);
                        this.handleCancel();
                    } else {
                        this.$message.error('新增失败：' + res.message);
                    }
                }).finally((res) => {
                    this.confirmLoading = false;
                });
            },
            handleCancel() {
                this.form.resetFields();
                this.visible = false;
            },
            mapCallback(val) {
                console.log('mapCallback=>>>', val);
                setTimeout(() => {
                    this.form.setFieldsValue(
                        {
                            dz: val,
                            address: val.address,
                        },
                    );
                }, 100);
            },
        },
    };
</script>
<style>

</style>
