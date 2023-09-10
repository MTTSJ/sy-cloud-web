<template>
    <a-card title="OSS资源配置" class="oss-form" :bordered="false">
        <a-form @submit="handleSubmit" :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="服务提供商" has-feedback>
                <a-select
                    style="width: 100%"
                    placeholder="请选择服务提供商"
                    v-decorator="['code', { rules: [{ required: true, message: '请选择服务提供商！' }] }]"
                >
                    <a-select-option
                        v-for="(item, index) in providers"
                        :key="index"
                        :value="item.code"
                        @click="changeProvider(item.code)"
                    >
                        {{ item.value }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="存储服务地址" has-feedback>
                <a-input
                    placeholder="请输入存储服务地址"
                    v-decorator="['endpoint', { rules: [{ required: true, message: '请输入存储服务地址！' }] }]"
                />
            </a-form-item>

            <a-form-item label="自定义域名" has-feedback>
                <a-input
                    placeholder="请输入自定义域名"
                    v-decorator="['customDomain', { rules: [{ required: true, message: '请输入自定义域名！' }] }]"
                >
                    <a-select slot="addonBefore" v-decorator="['prefix', { initialValue: 'https://' }]" style="width: 90px">
                        <a-select-option value="https://">
                            https://
                        </a-select-option>
                        <a-select-option value="http://">
                            http://
                        </a-select-option>
                    </a-select>
                </a-input>
            </a-form-item>

            <a-form-item label="accessKey" has-feedback>
                <a-input
                    placeholder="请输入accessKey"
                    v-decorator="['accessKey', { rules: [{ required: true, message: '请输入accessKey！' }] }]"
                />
            </a-form-item>

            <a-form-item label="secretKey" has-feedback>
                <a-input
                    placeholder="请输入secretKey"
                    v-decorator="['secretKey', { rules: [{ required: true, message: '请输入secretKey！' }] }]"
                >
                    <a-tooltip slot="suffix" title="点击查看密钥">
                        <a-icon type="eye" style="color: rgba(0,0,0,.45)" @click="displaySecret()" />
                    </a-tooltip>
                </a-input>
            </a-form-item>

            <a-form-item label="bucket" has-feedback>
                <a-input
                    placeholder="请输入bucket空间名"
                    v-decorator="['bucketName', { rules: [{ required: true, message: '请输入bucket空间名！' }] }]"
                />
            </a-form-item>

            <a-form-item v-if="hasPerm('set:edit')" :wrapperCol="{ span: 24 }" style="text-align: center">
                <a-button @click="handleSubmit" type="primary">保存并默认</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script>
    import { sysDictTypeDropDown } from '@/api/modular/system/dictManage';
    import { getOss, ossCheck, getOssSecret, saveOss } from '@/api/modular/system/setManage';
    export default {
        data() {
            return {
                providers: [],
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 },
                },
                visible: false,
                confirmLoading: false,
                form: this.$form.createForm(this),
            };
        },
        created() {
            // 初始化字典
            this.sysDictTypeDropDown();
            // 初始化默认OSS
            this.initOss();
        },
        methods: {
            /**
             * 初始化OSS
             */
            initOss() {
                ossCheck().then(res => {
                    if (res.success) {
                        if (res.data !== '') {
                            this.form.setFieldsValue({
                                code: res.data,
                            });
                            this.changeProvider(res.data);
                        }
                    }
                });
            },
            /**
             * 提交保存
             */
            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        saveOss(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('新增成功');
                                    this.visible = false;
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.form.resetFields();
                                    this.initOss();
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
            /**
             * 切换OSS服务提供商
             */
            changeProvider(value) {
                getOss({ code: value }).then(res => {
                    if (res.success) {
                        if (res.data === null || res.data === '') {
                            this.form.resetFields();
                            this.form.setFieldsValue({
                                code: value,
                            });
                            return;
                        }
                        this.form.setFieldsValue(res.data);
                    }
                });
            },
            /**
             * 显示密钥
             */
            displaySecret() {
                getOssSecret({ provider: this.form.getFieldValue('code') }).then(res => {
                    if (res.success) {
                        this.form.setFieldsValue({ secretKey: res.data });
                    }
                });
            },
            /**
             * 获取字典数据
             */
            sysDictTypeDropDown() {
                sysDictTypeDropDown({ code: 'oss' }).then(res => {
                    this.providers = res.data;
                });
            },
        },
    };
</script>

<style lang="stylus" scoped>
.oss-form >>>
  .ant-card-body
    padding 16px 0
  .ant-form-item-label
    max-width 150px
    text-align left
</style>
