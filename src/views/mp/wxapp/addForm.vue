<template>
    <a-modal
        title="新增微信应用"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                    label="机构ID"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入机构ID"
                        v-decorator="[
                            'organId',
                            { rules: [{ required: true, message: '请输入机构ID！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="微信原始标识"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入微信原始标识"
                        v-decorator="[
                            'wxSign',
                            { rules: [{ required: true, message: '请输入微信原始标识！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="应用类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入应用类型"
                        v-decorator="[
                            'appType',
                            { rules: [{ required: true, message: '请输入应用类型！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="应用密钥"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入应用密钥"
                        v-decorator="[
                            'secret',
                            { rules: [{ required: true, message: '请输入应用密钥！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="token"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入token"
                        v-decorator="[
                            'token',
                            { rules: [{ required: true, message: '请输入token！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="EncodingAESKey"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入EncodingAESKey"
                        v-decorator="[
                            'aesKey',
                            {
                                rules: [{ required: true, message: '请输入EncodingAESKey！' }],
                            },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="微信号名称"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入微信号名称"
                        v-decorator="[
                            'name',
                            { rules: [{ required: true, message: '请输入微信号名称！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="是否第三方平台应用"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入是否第三方平台应用"
                        v-decorator="[
                            'isComponent',
                            {
                                rules: [
                                    { required: true, message: '请输入是否第三方平台应用！' },
                                ],
                            },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="微信类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入微信类型"
                        v-decorator="[
                            'wxType',
                            { rules: [{ required: true, message: '请输入微信类型！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="公众号微信号"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入公众号微信号"
                        v-decorator="[
                            'wxHao',
                            { rules: [{ required: true, message: '请输入公众号微信号！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="认证类型"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入认证类型"
                        v-decorator="[
                            'verifyType',
                            { rules: [{ required: true, message: '请输入认证类型！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="logo"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入logo"
                        v-decorator="[
                            'logo',
                            { rules: [{ required: true, message: '请输入logo！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="二维码"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入二维码"
                        v-decorator="[
                            'qrCode',
                            { rules: [{ required: true, message: '请输入二维码！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="主体名称"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入主体名称"
                        v-decorator="[
                            'principalName',
                            { rules: [{ required: true, message: '请输入主体名称！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="微社区URL"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入微社区URL"
                        v-decorator="[
                            'community',
                            { rules: [{ required: true, message: '请输入微社区URL！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="备注信息"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入备注信息"
                        v-decorator="[
                            'remarks',
                            { rules: [{ required: true, message: '请输入备注信息！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="绑定的会员卡ID"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入绑定的会员卡ID"
                        v-decorator="[
                            'vipCardId',
                            {
                                rules: [{ required: true, message: '请输入绑定的会员卡ID！' }],
                            },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="租户ID"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入租户ID"
                        v-decorator="[
                            'tenantId',
                            { rules: [{ required: true, message: '请输入租户ID！' }] },
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    label="是否已删除"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    has-feedback
                >
                    <a-input
                        placeholder="请输入是否已删除"
                        v-decorator="[
                            'isDeleted',
                            { rules: [{ required: true, message: '请输入是否已删除！' }] },
                        ]"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { wxAppSave } from '@/api/modular/mp/wxapp';
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
                        wxAppSave(values)
                            .then((res) => {
                                if (res.success) {
                                    this.$message.success('新增成功');
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.handleCancel();
                                } else {
                                    this.$message.error('新增失败'); // + res.message
                                }
                            })
                            .finally((res) => {
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
