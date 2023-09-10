<template>
    <a-modal
        title="应用编辑"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item style="display: none;" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['id']" />
                </a-form-item>
                <a-form-item style="display: none;" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-input v-decorator="['active']" />
                </a-form-item>

                <a-form-item label="应用名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入应用名称"
                        v-decorator="['name', { rules: [{ required: true, message: '请输入应用名称！' }] }]"
                    />
                </a-form-item>

                <a-form-item label="唯一编码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入唯一编码"
                        v-decorator="['code', { rules: [{ required: true, message: '请输入唯一编码！' }] }]"
                    />
                </a-form-item>

                <div v-show="iconShow">
                    <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="应用图标">
                        <a-input placeholder="请选择图标" disabled="disabled" v-decorator="['icon']">
                            <a-icon slot="addonAfter" @click="openIconSele()" type="setting" />
                        </a-input>
                    </a-form-item>
                </div>
            </a-form>
        </a-spin>
        <!-- 图标组件 -->
        <a-modal
            :width="850"
            :visible="visibleIcon"
            @cancel="handleCancelIcon"
            footer=""
            :mask="false"
            :closable="false"
            :destroyOnClose="true"
        >
            <icon-selector v-model="currentSelectedIcon" @change="handleIconChange" />
        </a-modal>
    </a-modal>
</template>

<script>
    import { sysAppEdit } from '@/api/modular/system/appManage';
    import IconSelector from '@/components/IconSelector';

    export default {
        components: { IconSelector },
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
                // 图标相关---start
                iconShow: true,
                visibleIcon: false,
                // 图标组件
                currentSelectedIcon: 'pause-circle',
                // 图标相关----end
                visibleDef: false,
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
                        name: record.name,
                        code: record.code,
                        icon: record.icon,
                        active: record.active,
                    });
                }, 100);
            },

            openIconSele() {
                this.visibleIcon = true;
            },
            handleIconChange(icon) {
                this.form.getFieldDecorator('icon', { initialValue: icon });
                this.form.resetFields(`icon`, icon);
                this.visibleIcon = false;
            },
            handleCancelIcon() {
                this.visibleIcon = false;
            },

            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        sysAppEdit(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('编辑成功');
                                    this.visible = false;
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
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
