<template>
    <a-modal
        title="新增分组"
        :width="600"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item label="分组名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入分组名称"
                        allowClear
                        v-decorator="[
                            'name',
                            { rules: [{ required: true, min: 1, max: 8, message: '分组名称不能超过8个字符！' }] }
                        ]"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { addMaterialGroup } from '@/api/modular/system/materialManage';
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
                type: 0,
                form: this.$form.createForm(this),
            };
        },
        methods: {
            // 初始化方法
            add(record) {
                this.visible = true;
                if (record === 'video') {
                    this.type = 1;
                }
                // this.form.getFieldDecorator('type', { initialValue: this.type })
            },

            handleSubmit() {
                this.form.getFieldDecorator('type', { initialValue: this.type });
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        addMaterialGroup(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('新增成功');
                                    this.visible = false;
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.form.resetFields();
                                } else {
                                    this.$message.error('新增失败：' + res.message);
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
