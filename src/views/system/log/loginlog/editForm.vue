<template>
    <a-modal
        title="编辑登录日志"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
                <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入用户名"
                        v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="日志状态" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入日志状态"
                        v-decorator="['type', { rules: [{ required: true, message: '请输入日志状态！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="登录描述" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入登录描述"
                        v-decorator="['description', { rules: [{ required: true, message: '请输入登录描述！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="浏览器全文" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入浏览器全文"
                        v-decorator="['ua', { rules: [{ required: true, message: '请输入浏览器全文！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="ip地址" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入ip地址"
                        v-decorator="['ip', { rules: [{ required: true, message: '请输入ip地址！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入地区"
                        v-decorator="['location', { rules: [{ required: true, message: '请输入地区！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="浏览器" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入浏览器"
                        v-decorator="['browser', { rules: [{ required: true, message: '请输入浏览器！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="操作系统" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入操作系统"
                        v-decorator="['system', { rules: [{ required: true, message: '请输入操作系统！' }] }]"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { loginLogSave } from '@/api/modular/system/loginlog';
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

                        userName: record.userName,

                        type: record.type,

                        description: record.description,

                        ua: record.ua,

                        ip: record.ip,

                        location: record.location,

                        browser: record.browser,

                        system: record.system,
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
                        loginLogSave(values)
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
