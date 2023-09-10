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

                <a-form-item label="数据源名称" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入数据源名称"
                        v-decorator="['name', { rules: [{ required: true, message: '请输入数据源名称！' }] }]"
                    />
                </a-form-item>

                <a-form-item label="数据库类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-select
                        placeholder="请选择数据库类型"
                        v-decorator="[
                            'dbType',
                            {
                                rules: [{ required: true, message: '请选择数据库类型' }]
                            }
                        ]"
                        @change="changeDbType"
                    >
                        <a-select-option v-for="item in dbTypeItems" :key="item.code" :value="item.value">
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

                <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
                    <a-row :gutter="8">
                        <a-col :span="21">
                            <a-input-password
                                placeholder="请输入密码"
                                v-decorator="[
                                    'password',
                                    { initialValue: 'root', rules: [{ required: true, message: '请输入密码！' }] }
                                ]"
                            />
                        </a-col>
                        <a-col :span="3">
                            <a-button type="primary" style="width: 100%" @click="connectTest">测试</a-button>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
                    <a-textarea placeholder="请输入备注" v-decorator="['remark', {}]" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick';
    import { dataSourceSave, dataSourceTest } from '@/api/modular/dev/datasource';
    import { getDictValue, sysDictTypeDropDown } from '@/api/modular/system/dictManage';

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
                selectedItems: [],
                dbTypeItems: [],
                form: this.$form.createForm(this),
                dbUrlMap: {
                    // MySQL5.7+ 数据库
                    mysql: {
                        url:
                            'jdbc:mysql://localhost:3306/db_breedx_cloud?useSSL=false&useUnicode=true&characterEncoding=utf-8&zeroDateTimeBehavior=convertToNull&transformedBitIsBoolean=true&serverTimezone=GMT%2B8&nullCatalogMeansCurrent=true&allowPublicKeyRetrieval=true',
                    },
                    // Oracle
                    oracle: { url: 'jdbc:oracle:thin:@127.0.0.1:1521:ORCL' },
                },
            };
        },
        methods: {
            // 初始化方法
            add(record) {
                this.title = '新增';
                this.visible = true;
                this.sysDictTypeDropDown();
            },
            // 初始化方法
            edit(record) {
                this.title = '编辑';
                this.visible = true;
                this.sysDictTypeDropDown();
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(this.model, 'id', 'name', 'remark', 'dbType', 'driverClass', 'dbUrl', 'url', 'username', 'password'),
                    );
                });
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
                    const url = this.dbUrlMap[record];
                    if (url) {
                        this.form.setFieldsValue(url);
                    }
                });
            },

            // 测试数据源配置是否可以正常连接
            connectTest() {
                const keys = ['dbType', 'driverClass', 'url', 'username', 'password'];
                // 获取以上字段的值，并清除校验状态
                const fieldsValues = this.form.getFieldsValue(keys);
                const setFields = {};
                keys.forEach(key => (setFields[key] = { value: fieldsValues[key], errors: null }));
                // 清除校验状态，目的是可以让错误文字闪烁
                this.form.setFields(setFields);
                // 重新校验
                this.$nextTick(() => {
                    this.form.validateFields(keys, (errors, values) => {
                        if (!errors) {
                            const loading = this.$message.loading('连接中……', 0);
                            dataSourceTest(values)
                                .then(res => {
                                    if (res.success) {
                                        this.$message.success('连接成功');
                                    } else throw new Error(res.message);
                                })
                                .catch(error => {
                                    this.$warning({ title: '连接失败', content: error.message || error });
                                })
                                .finally(() => loading());
                        }
                    });
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
