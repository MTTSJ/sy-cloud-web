<template>
    <a-modal
        title="新增客户端"
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
                    <a-col :md="12" :sm="24">
                        <a-form-item label="应用名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入客户端名称"
                                v-decorator="['clientName', { rules: [{ required: true, message: '请输入客户端名称！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="授权范围" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入授权范围"
                                v-decorator="['scope', { rules: [{ required: true, message: '请输入授权范围！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="客户端ID" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入客户端ID"
                                v-decorator="['clientId', { rules: [{ required: true, message: '请输入客户端ID！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="客户端密钥" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入客户端密钥"
                                v-decorator="['clientSecret', { rules: [{ required: true, message: '请输入客户端密钥！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="令牌过期秒数" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入令牌过期秒数"
                                v-decorator="['accessTokenValidity', { rules: [{ required: true, message: '请输入令牌过期秒数！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="刷新令牌过期秒数" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入刷新令牌过期秒数"
                                v-decorator="[
                                    'refreshTokenValidity',
                                    { rules: [{ required: true, message: '请输入刷新令牌过期秒数！' }] }
                                ]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="24" :sm="24">
                        <a-form-item label="授权类型" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
                            <a-select
                                mode="multiple"
                                style="width: 100%"
                                placeholder="请选择授权类型！"
                                v-decorator="['authorizedGrantTypes', { rules: [{ required: true, message: '请选择授权类型！' }] }]"
                            >
                                <a-select-option v-for="(item, index) in grantTypePrefixData" :key="index" :value="item.dictKey">
                                    {{ item.dictValue }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :md="24" :sm="24">
                        <a-form-item label="回调地址" :labelCol="labelCol2" :wrapperCol="wrapperCol2" has-feedback>
                            <a-input
                                placeholder="请输入回调地址"
                                v-decorator="['webServerRedirectUri', { rules: [{ required: true, message: '请输入回调地址！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="资源集合" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入资源集合"
                                v-decorator="['resourceIds', { rules: [{ required: false, message: '请输入资源集合！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="权限" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入权限"
                                v-decorator="['authorities', { rules: [{ required: false, message: '请输入权限！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="附加说明" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入附加说明"
                                v-decorator="['additionalInformation', { rules: [{ required: false, message: '请输入附加说明！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="自动授权" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                            <a-input
                                placeholder="请输入自动授权"
                                v-decorator="['autoapprove', { rules: [{ required: false, message: '请输入自动授权！' }] }]"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { clientSave } from '@/api/modular/micro/client';
    export default {
        data() {
            return {
                grantTypePrefixData: [],
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
                labelCol2: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol2: {
                    xs: { span: 24 },
                    sm: { span: 19 },
                },
                visible: false,
                confirmLoading: false,
                authorizedGrantTypes: [],
                form: this.$form.createForm(this),
            };
        },
        methods: {
            // 初始化方法
            add(record) {
                this.visible = true;
                this.dataTypeItem();
                setTimeout(() => {
                    this.form.setFieldsValue({
                        accessTokenValidity: 3600,
                        refreshTokenValidity: 604800,
                        webServerRedirectUri: 'http://localhost:10001',
                        scope: 'all',
                    });
                }, 100);
            },
            /**
             * 获取字典数据
             */
            dataTypeItem() {
                this.grantTypePrefixData = this.$options.filters['dictData']('grantType');
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
                                values[key] = values[key].join(',');
                            }
                        }
                        clientSave(values)
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
            handleCancel() {
                this.form.resetFields();
                this.visible = false;
            },
        },
    };
</script>
