<template>
    <a-modal
        v-model="visible"
        title="新增代码生成配置"
        :width="900"
        :confirmLoading="confirmLoading"
        :afterClose="handleCancel"
        @ok="handleSubmit"
    >
        <a-spin :spinning="confirmLoading">
            <a-form-model
                ref="form"
                :model="formData"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
            >
                <a-row
                    v-for="(optionChunks, index) in formOptions"
                    :key="index"
                    :gutter="24"
                >
                    <a-col v-for="item in optionChunks" :key="item.key" :md="12" :sm="24">
                        <a-form-model-item
                            v-show="!item.hidden"
                            :prop="item.key"
                            :label="item.label"
                            :rules="{ required: true, message: `请填写${item.label}` }"
                        >
                            <component
                                v-model="formData[item.key]"
                                v-bind="item.attrs || {}"
                                v-on="item.on || {}"
                                :is="item.comp"
                                :placeholder="`请填写${item.label}`"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </a-form-model>
        </a-spin>
    </a-modal>
</template>

<script>
    import { codeGenerateAdd, codeTableList } from '@/api/modular/gen/codeGenerateManage';
    import { dataSourceList } from '@/api/modular/dev/datasource';
    import { routeList } from '@/api/modular/gateway/route';
    import { chunk, pick } from 'lodash-es';

    export default {
        data() {
            return {
                labelCol: { xs: { span: 24 }, sm: { span: 5 } },
                wrapperCol: { xs: { span: 24 }, sm: { span: 19 } },
                initData: null,
                visible: false,
                tableNameData: [],
                dataSourceData: [],
                routeData: [],
                tablePrefixData: [],
                generateTypeData: [],
                confirmLoading: false,
                hidePackageName: false,
                prefix: 'vip.mate',
                formData: {
                    dataSourceId: undefined,
                    serviceId: undefined,
                    baseTableName: undefined,
                    tablePrefix: 'N',
                    tableComment: '',
                    className: '',
                    busName: '',
                    generateType: '1',
                    authorName: '',
                    packageName: 'vip.mate',
                },
            };
        },
        computed: {
            isEdit() {
                return !!this.initData;
            },
            formOptions() {
                return chunk(this.originOptions, 2);
            },
            originOptions() {
                return [
                    {
                        label: '数据源',
                        key: 'dataSourceId',
                        comp: 'a-select',
                        on: { change: this.getTableList },
                        attrs: {
                            options: this.dataSourceData.map(item => ({
                                value: item.id,
                                label: item.name,
                            })),
                        },
                    },
                    {
                        label: '服务名',
                        key: 'serviceId',
                        comp: 'a-select',
                        on: { change: this.onServiceIdChange },
                        attrs: {
                            options: this.routeData.map(item => ({
                                value: item.serviceId,
                                label: item.name,
                            })),
                        },
                    },
                    {
                        label: '生成表',
                        key: 'baseTableName',
                        comp: 'a-select',
                        on: { change: this.onTableNameChange },
                        attrs: {
                            showSearch: true,
                            options: this.tableNameData.map(item => ({
                                value: item.name,
                                label: item.name,
                            })),
                        },
                    },
                    {
                        label: '移除前缀',
                        key: 'tablePrefix',
                        comp: 'a-radio-group',
                        on: { change: this.settingDefaultValue },
                        attrs: {
                            options: this.tablePrefixData.map(item => ({
                                value: item.dictKey,
                                label: item.dictValue,
                            })),
                        },
                    },
                    {
                        label: '功能名',
                        key: 'tableComment',
                        comp: 'a-input',
                    },
                    {
                        label: '类名',
                        key: 'className',
                        comp: 'a-input',
                    },
                    {
                        label: '业务名',
                        key: 'busName',
                        comp: 'a-input',
                    },
                    {
                        label: '作者姓名',
                        key: 'authorName',
                        comp: 'a-input',
                    },
                    {
                        label: '生成方式',
                        key: 'generateType',
                        comp: 'a-select',
                        on: { change: this.onGenerateTypeChange },
                        attrs: {
                            options: this.generateTypeData.map(v => ({
                                label: v.dictValue,
                                value: v.dictKey,
                            })),
                        },
                    },
                    {
                        hidden: this.hidePackageName,
                        label: '包名',
                        key: 'packageName',
                        comp: 'a-input',
                    },
                ];
            },
        },
        mounted() {
            this.dataSourceInfoList();
            this.routeInfoList();
            this.dataTypeItem();
        },
        methods: {
            // 根据数据源查询数据库列表
            getTableList() {
                return codeTableList({
                    id: this.formData.dataSourceId,
                }).then(({ data }) => {
                    this.tableNameData = data;
                });
            },
            // 根服务设定包名和作者名称
            onServiceIdChange(id) {
                const suffix = id.split('-')[1];
                if (!suffix) return;
                Object.assign(this.formData, {
                    packageName: `${this.prefix}.${suffix}`,
                    authorName: 'pangu',
                });
            },
            // 选择数据库列表
            onTableNameChange(tableName) {
                const item = this.tableNameData.find(v => v.name === tableName);
                console.log(item);
                this.formData.tableComment = item.comment;
                this.settingDefaultValue();
            },
            // 初始化方法(外部)
            show(initData) {
                this.visible = true;
                if (initData) {
                    this.initData = initData;
                    const keys = this.originOptions.map(v => v.key);
                    const data = pick(initData, keys);
                    Object.assign(this.formData, data);
                    this.getTableList();
                }
            },
            onGenerateTypeChange(type) {
                this.hidePackageName = type !== '1';
            },
            /**
             * 获取所有的数据源列表
             */
            dataSourceInfoList() {
                dataSourceList().then(res => {
                    this.dataSourceData = res.data;
                });
            },
            /**
             * 获取所有的微服务路由列表
             */
            routeInfoList() {
                routeList().then(res => {
                    this.routeData = res.data;
                });
            },
            /**
             * 获取字典数据
             */
            dataTypeItem() {
                this.tablePrefixData = this.$options.filters['dictData']('ok');
                this.generateTypeData = this.$options.filters['dictData']('codeGeneratorType');
            },
            handleCancel() {
                this.initData = null;
                this.$refs.form.resetFields();
            },
            /**
             * 提交表单
             */
            async handleSubmit() {
                let status = false;
                this.$refs.form.validate(state => { status = state; });
                if (!status) return;

                const formData = { ...this.formData };
                let op = '新增';
                if (this.isEdit) {
                    op = '编辑';
                    formData.id = this.initData.id;
                }

                this.confirmLoading = true;
                try {
                    const { success, message } = await codeGenerateAdd(formData);
                    if (!success) throw new Error(message);
                    this.$message.success(`${op}成功`);
                    this.$emit('ok', this.formData);
                    this.visible = false;
                } catch (e) {
                    this.$message.error(`${op}失败：` + e.message);
                } finally {
                    this.confirmLoading = false;
                }
            },
            /**
             * 设置默认值
             */
            settingDefaultValue() {
                const tableName = this.classNameToHump();

                Object.assign(this.formData, {
                    busName: tableName.toLowerCase(),
                    className: tableName,
                });
            },
            /**
             * 设置类名为数据库表的驼峰命名
             */
            classNameToHump() {
                const { baseTableName, tablePrefix } = this.formData;
                const arr = baseTableName.toLowerCase().split('_');
                if (tablePrefix === 'Y') {
                    if (arr[1] === 'sys') {
                        arr.splice(0, 2);
                    } else {
                        arr.splice(0, 1);
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    // charAt()方法得到第一个字母，slice()得到第二个字母以后的字符串
                    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
                }
                return arr.join('');
            },
        },
    };
</script>
