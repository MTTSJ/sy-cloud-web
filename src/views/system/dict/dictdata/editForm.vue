<template>
    <a-modal
        :title="title"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item style="display: none;" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input v-decorator="['id']" />
                </a-form-item>
                <a-form-item style="display: none;" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input v-decorator="['code']" />
                </a-form-item>
                <a-form-item style="display: none;" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input v-decorator="['parentId']" />
                </a-form-item>

                <a-form-item label="字典值" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入字典值"
                        v-decorator="['dictValue', { rules: [{ required: true, message: '请输入字典值！' }] }]"
                    />
                </a-form-item>

                <a-form-item label="唯一编码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入唯一编码"
                        v-decorator="['dictKey', { rules: [{ required: true, message: '请输入唯一编码！' }] }]"
                    />
                </a-form-item>

                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序" has-feedback>
                    <a-input-number
                        style="width: 100%"
                        placeholder="请输入排序"
                        v-decorator="['sort', { initialValue: 100 }]"
                        :min="1"
                        :max="1000"
                    />
                </a-form-item>

                <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-textarea :rows="4" placeholder="请输入备注" v-decorator="['remark']"></a-textarea>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick';
    import { dictDataSave } from '@/api/modular/system/dictManage';
    export default {
        data() {
            return {
                title: '',
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
            // 新增初始化方法
            add(typeId, code) {
                this.visible = true;
                this.title = '新增字典项';
                // 增加上级类型ID
                setTimeout(() => {
                    this.form.setFieldsValue({
                        parentId: typeId,
                        code: code,
                    });
                }, 100);
            },
            // 保存初始化方法
            edit(record) {
                this.visible = true;
                this.title = '编辑字典项';
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'id', 'parentId', 'typeId', 'code', 'sort', 'remark', 'dictKey', 'dictValue'),
                    );
                });
            },

            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        dictDataSave(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('编辑成功');
                                    this.visible = false;
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.form.resetFields();
                                } else {
                                    this.$message.error('编辑失败：' + res.message);
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
