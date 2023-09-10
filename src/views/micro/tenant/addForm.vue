<template>
    <a-modal
        title="新增租户"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item label="租户名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入租户名称"
                        v-decorator="['name', { rules: [{ required: true, message: '请输入租户名称！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="租户编码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入租户编码"
                        v-decorator="['code', { rules: [{ required: true, message: '请输入租户编码！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-date-picker
                        style="width: 100%"
                        placeholder="请选择开始时间"
                        v-decorator="['startTime', { rules: [{ required: true, message: '请选择开始时间！' }] }]"
                        @change="onChangestartTime"
                    />
                </a-form-item>
                <a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-date-picker
                        style="width: 100%"
                        placeholder="请选择结束时间"
                        v-decorator="['endTime', { rules: [{ required: true, message: '请选择结束时间！' }] }]"
                        @change="onChangeendTime"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { tenantSave } from '@/api/modular/micro/tenant';
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
                startTimeDateString: '',
                endTimeDateString: '',
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
            };
        },
        methods: {
            // 初始化方法
            add(record) {
                this.visible = true;
            },
            /**
             * 提交表单
             */
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
                        values.startTime = this.startTimeDateString;
                        values.endTime = this.endTimeDateString;
                        tenantSave(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('新增成功');
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.handleCancel();
                                } else {
                                    this.$message.error('新增失败'); // + res.message
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
            onChangestartTime(date, dateString) {
                this.startTimeDateString = dateString;
            },
            onChangeendTime(date, dateString) {
                this.endTimeDateString = dateString;
            },
            handleCancel() {
                this.form.resetFields();
                this.visible = false;
            },
        },
    };
</script>
