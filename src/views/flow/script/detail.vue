<template>
    <a-modal
        title="脚本详情"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :footer="null"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item
                    label="名称"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    {{ scriptDetail.name }}
                </a-form-item>
                <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="类别"
                >
                    {{ typeFilter(scriptDetail.type) }}
                </a-form-item>
                <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="语言"
                >
                    {{ langFilter(scriptDetail.lang) }}
                </a-form-item>
                <a-form-item
                    label="脚本内容"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    <a-textarea :rows="6" v-decorator="['content']"></a-textarea>
                </a-form-item>
                <a-form-item
                    label="备注"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                >
                    {{ scriptDetail.remark }}
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script>
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
                typeData: [],
                langData: [],
                form: this.$form.createForm(this),
                scriptDetail: [],
            };
        },
        methods: {
            // 初始化方法
            detail(record) {
                this.visible = true;
                this.getTypeData();
                this.getLangData();
                this.scriptDetail = record;
                setTimeout(() => {
                    this.form.setFieldsValue(
                        {
                            content: record.content,
                        },
                    );
                }, 100);
            },

            typeFilter(type) {
                // eslint-disable-next-line eqeqeq
                const values = this.typeData.filter(item => item.dictKey == type);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },
            langFilter(lang) {
                // eslint-disable-next-line eqeqeq
                const values = this.langData.filter(item => item.dictKey == lang);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },

            /**
             * 获取类型下拉框数据
             */
            getTypeData() {
                this.typeData = this.$options.filters['dictData']('scriptType');
            },

            /**
             * 获取语言下拉框数据
             */
            getLangData() {
                this.langData = this.$options.filters['dictData']('scriptLanguageType');
            },

            handleCancel() {
                this.form.resetFields();
                this.visible = false;
            },
        },
    };
</script>
