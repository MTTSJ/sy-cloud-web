<template>
    <a-modal
        title="编辑黑名单"
        :width="600"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
                <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入IP地址"
                        v-decorator="['ip', { rules: [{ required: false, message: '请输入IP地址！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="请求地址" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入请求地址"
                        v-decorator="['requestUri', { rules: [{ required: true, message: '请输入请求地址！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="请求方法" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-select
                        style="width: 100%"
                        placeholder="请选择请求方法"
                        v-decorator="['requestMethod', { rules: [{ required: true, message: '请选择请求方法！' }] }]"
                    >
                        <a-select-option value="GET">
                            GET
                        </a-select-option>
                        <a-select-option value="POST">
                            POST
                        </a-select-option>
                        <a-select-option value="ALL">
                            ALL
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-radio-group v-decorator="['status', { initialValue: 0 }]">
                        <a-radio :value="0">启用</a-radio>
                        <a-radio :value="1">禁用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-time-picker v-decorator="['startTime']" @change="onChangeFrom" />
                </a-form-item>
                <a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-time-picker v-decorator="['endTime']" @change="onChangeTo" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { blacklistSave } from '@/api/modular/gateway/blacklist';
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

                        ip: record.ip,

                        requestUri: record.requestUri,

                        requestMethod: record.requestMethod,

                        startTime: record.startTime,

                        endTime: record.endTime,

                        status: record.status,
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
                        blacklistSave(values)
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
