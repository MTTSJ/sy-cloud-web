<template>
    <a-modal title="修改密码" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleClose">
        <a-spin :spinning="confirmLoading">
            <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-form-item label="用户名">
                    <a-input v-decorator="['account']" disabled placeholder="用户名" />
                </a-form-item>

                <a-form-item label="新密码" hasFeedback>
                    <a-input
                        type="password"
                        @blur="validateConfirmOnBlur"
                        placeholder="新密码"
                        v-decorator="['pass', decoratorOptions.pass]"
                    />
                </a-form-item>

                <a-form-item label="确认密码" hasFeedback>
                    <a-input type="password" placeholder="确认密码" v-decorator="['confirmPass', decoratorOptions.confirmPass]" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { passEncrypt } from '@/utils/encrypt';
    import { userChangePwd } from '@/api/modular/system/userManage';
    export default {
        name: 'PasswordEditForm',
        data() {
            return {
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
                userId: '',
                confirmDirty: false,
                decoratorOptions: {
                    pass: {
                        rules: [
                            {
                                required: true,
                                pattern: /^(?=.*\d)(?=.*[a-zA-Z]).{6,12}$/,
                                message: '密码必须包含数字和字母组合(可使用特殊符号)，长度为6-12位！',
                            },
                        ],
                    },
                    confirmPass: {
                        rules: [
                            {
                                required: true,
                                message: '请确认登陆密码!',
                            },
                            {
                                validator: this.validateConfirm,
                            },
                        ],
                    },
                },
            };
        },
        methods: {
            show(record) {
                this.visible = true;
                this.userId = record.userId;
                this.form.resetFields();
                this.$nextTick(() => {
                    this.form.setFieldsValue({ account: record.account });
                });
            },
            handleOk() {
                // 触发表单验证
                this.form.validateFields({ force: true }, (err, values) => {
                    if (!err) {
                        this.confirmLoading = true;
                        //   delete values.account
                        values.pass = passEncrypt(values.pass);
                        values.confirmPass = passEncrypt(values.confirmPass);
                        userChangePwd(values)
                            .then(res => {
                                res.success ? this.$message.success(res.msg) : this.$message.warning(res.msg);
                            })
                            .finally(() => {
                                this.handleClose();
                            });
                    }
                });
            },
            handleClose(e) {
                this.visible = false;
                this.confirmLoading = false;
            },
            validateConfirmOnBlur() {
                this.form.validateFields(['confirm'], { force: true });
            },
            validateConfirm(rule, confirm, callback) {
                const pass = this.form.getFieldValue('pass');
                if (pass && confirm && pass !== confirm) {
                    callback(new Error('两次输入的密码不一致！'));
                }
                callback();
            },
        },
    };
</script>
