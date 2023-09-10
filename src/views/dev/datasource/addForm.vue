<template>
    <a-modal
        title="新增数据源"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item label="数据源名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入数据源名称"
                        v-decorator="['name', { rules: [{ required: true, message: '请输入数据源名称！' }] }]"
                    />
                </a-form-item>

                <a-form-item label="数据库类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-select
                        v-decorator="['dbType', { rules: [{ required: true, message: '请输入数据库类型！' }] }]"
                        @change="changeDbType"
                    >
                        <a-select-option v-for="item in dbTypeItems" :key="item.code" :value="item.code">
                            {{ item.value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="驱动类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入驱动类型"
                        v-decorator="['driverClass', { rules: [{ required: true, message: '请输入驱动类型！' }] }]"
                    />
                </a-form-item>

                <a-form-item label="连接地址" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-textarea
                        :rows="4"
                        placeholder="请输入连接地址"
                        v-decorator="['url', { rules: [{ required: true, message: '请输入连接地址！' }] }]"
                    ></a-textarea>
                </a-form-item>

                <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入用户名"
                        v-decorator="['username', { initialValue: 'root', rules: [{ required: true, message: '请输入用户名！' }] }]"
                    />
                </a-form-item>

                <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input-password
                        placeholder="请输入密码"
                        v-decorator="['password', { initialValue: 'root', rules: [{ required: true, message: '请输入密码！' }] }]"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { dataSourceSave } from '@/api/modular/dev/datasource';
    import { getDictValue, sysDictTypeDropDown } from '@/api/modular/system/dictManage';
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
                selectedItems: [],
                dbTypeItems: [],
            };
        },
        methods: {
            // 初始化方法
            add(record) {
                this.visible = true;
                this.sysDictTypeDropDown();
            },

            /**
             * 获取字典数据
             */
            sysDictTypeDropDown() {
                sysDictTypeDropDown({ code: 'dbType' }).then(res => {
                    this.dbTypeItems = res.data;
                });
            },

            changeDbType(record) {
                getDictValue({ code: 'driverType', dictKey: record }).then(res => {
                    if (res.success) {
                        this.form.setFieldsValue({ driverClass: res.data });
                    }
                });
            },

            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        dataSourceSave(values)
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
