<template>
    <a-modal
        :title="title"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :afterClose="reset"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form-model
                ref="form"
                :model="formData"
                :rules="rules"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
            >
                <a-form-model-item style="display: none" has-feedback prop="id">
                    <a-input v-model="formData.id" />
                </a-form-model-item>

                <a-form-model-item label="名称" has-feedback prop="name">
                    <a-input placeholder="请输入服务名称" v-model="formData.name" />
                </a-form-model-item>

                <a-form-model-item label="服务ID" has-feedback prop="serviceId">
                    <a-input
                        v-model="formData.serviceId"
                        placeholder="请输入服务ID"
                        @change="onIdChange"
                    />
                </a-form-model-item>

                <a-form-model-item label="服务路径" has-feedback prop="path">
                    <a-input v-model="formData.path" placeholder="请输入服务路径" />
                </a-form-model-item>

                <a-form-model-item label="URI" has-feedback prop="url">
                    <a-input v-model="formData.url" placeholder="请输入服务URI" />
                </a-form-model-item>
            </a-form-model>
        </a-spin>
    </a-modal>
</template>

<script>
    import { pick } from 'lodash-es';
    import { routeSave } from '@/api/modular/gateway/route';

    export default {
        data() {
            return {
                title: '',
                rules: {
                    serviceId: { required: true, message: '请输入服务ID!' },
                    name: { required: true, message: '请输入服务名称!' },
                    url: { required: true, message: '请输入服务URI!' },
                    path: { required: true, message: '请输入服务路径!' },
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 15 },
                },
                visible: false,
                confirmLoading: false,
                selectedItems: [],
                formData: {
                    name: '',
                    id: '',
                    path: '',
                    serviceId: '',
                    url: '',
                },
            };
        },
        methods: {
            // 初始化方法
            add(record) {
                this.title = '新增';
                this.visible = true;
            },
            // 初始化方法
            edit(record) {
                this.title = '编辑';
                this.visible = true;
                this.formData = pick(record, Object.keys(this.formData));
            },
            handleSubmit() {
                this.$refs.form.validate().then(() => {
                    const { formData } = this;
                    this.confirmLoading = true;
                    routeSave(formData)
                        .then(res => {
                            if (res.success) {
                                this.$message.success('编辑成功');
                                this.visible = false;
                                this.confirmLoading = false;
                                this.$emit('ok', formData);
                            } else {
                                this.$message.error('编辑失败：' + res.message);
                            }
                        })
                        .finally(res => {
                            this.confirmLoading = false;
                        });
                });
            },
            handleCancel() {
                this.visible = false;
            },
            reset() {
                this.$refs.form.resetFields();
                this.formData = Object.keys(this.formData)
                    .reduce((r, k) => ({ ...r, [k]: '' }), {});
            },
            onIdChange({ target: { value } }) {
                if (!value) return;
                Object.assign(this.formData, {
                    path: `/${value}/**`,
                    url: `lb://${value}`,
                });
            },
        },
    };
</script>
