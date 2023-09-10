<template>
    <a-modal
        title="编辑接口"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-row :gutter="24">
                    <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
                    <a-col :md="24" :sm="24">
                        <a-form-item label="接口编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input placeholder="请输入接口编码" :disabled="true" v-decorator="['code']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="接口名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入接口名称"
                                v-decorator="['name', { rules: [{ required: true, message: '请输入接口名称！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="接口描述" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入接口描述"
                                v-decorator="['notes', { rules: [{ required: true, message: '请输入接口描述！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="请求方法" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-select
                                style="width: 100%"
                                placeholder="请选择请求方法"
                                v-decorator="['method', { rules: [{ required: true, message: '请选择请求方法！' }] }]"
                            >
                                <a-select-option value="GET">
                                    GET
                                </a-select-option>
                                <a-select-option value="POST">
                                    POST
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="类名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入类名"
                                v-decorator="['className', { rules: [{ required: true, message: '请输入类名！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="方法名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入方法名"
                                v-decorator="['methodName', { rules: [{ required: true, message: '请输入方法名！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="请求路径" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入请求路径"
                                v-decorator="['path', { rules: [{ required: true, message: '请输入请求路径！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="响应类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入响应类型"
                                v-decorator="['contentType', { rules: [{ required: true, message: '请输入响应类型！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="服务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入服务ID"
                                v-decorator="['serviceId', { rules: [{ required: true, message: '请输入服务ID！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="API状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-radio-group v-decorator="['status', { rules: [{ required: true, message: '请选择状态！' }] }]">
                                <a-radio :value="0">启用</a-radio>
                                <a-radio :value="1">禁用</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="是否认证" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-radio-group v-decorator="['auth', { rules: [{ required: true, message: '请选择是否认证！' }] }]">
                                <a-radio :value="0">认证</a-radio>
                                <a-radio :value="1">不认证</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { apiSave } from '@/api/modular/gateway/api';
    export default {
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
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
            };
        },
        methods: {
            // 初始化方法
            edit(record) {
                this.visible = true;
                setTimeout(() => {
                    this.form.setFieldsValue({
                        id: record.id,

                        code: record.code,

                        name: record.name,

                        notes: record.notes,

                        method: record.method,

                        className: record.className,

                        methodName: record.methodName,

                        path: record.path,

                        contentType: record.contentType,

                        serviceId: record.serviceId,

                        status: record.status,

                        auth: record.auth,
                    });
                }, 100);
            },
            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        for (const key in values) {
                            if (typeof values[key] === 'object') {
                                values[key] = JSON.stringify(values[key]);
                            }
                        }
                        apiSave(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('编辑成功');
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.handleCancel();
                                } else {
                                    this.$message.error('编辑失败'); //  + res.message
                                }
                            })
                            .finally(res => {
                                this.confirmLoading = false;
                            });
                    } else {
                        this.confirmLoading = false;
                    }
                });
            },
            handleCancel() {
                this.form.resetFields();
                this.visible = false;
            },
        },
    };
</script>
