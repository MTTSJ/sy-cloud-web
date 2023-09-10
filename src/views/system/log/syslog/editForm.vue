<template>
    <a-modal
        title="编辑操作日志"
        :width="900"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
                <a-form-item label="日志类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入日志类型"
                        v-decorator="['type', { rules: [{ required: true, message: '请输入日志类型！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="跟踪ID" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入跟踪ID"
                        v-decorator="['traceId', { rules: [{ required: true, message: '请输入跟踪ID！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="日志标题" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入日志标题"
                        v-decorator="['title', { rules: [{ required: true, message: '请输入日志标题！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="操作内容" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入操作内容"
                        v-decorator="['operation', { rules: [{ required: true, message: '请输入操作内容！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="方法类型" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入方法类型"
                        v-decorator="['methodType', { rules: [{ required: true, message: '请输入方法类型！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="方法名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入方法名"
                        v-decorator="['methodName', { rules: [{ required: true, message: '请输入方法名！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="参数" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入参数"
                        v-decorator="['params', { rules: [{ required: true, message: '请输入参数！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="类名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入类名"
                        v-decorator="['classPath', { rules: [{ required: true, message: '请输入类名！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="请求路径" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入请求路径"
                        v-decorator="['url', { rules: [{ required: true, message: '请输入请求路径！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="ip地址" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入ip地址"
                        v-decorator="['ip', { rules: [{ required: true, message: '请输入ip地址！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="异常内容" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入异常内容"
                        v-decorator="['exception', { rules: [{ required: true, message: '请输入异常内容！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="耗时" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback></a-form-item>
                <a-form-item label="地区" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入地区"
                        v-decorator="['location', { rules: [{ required: true, message: '请输入地区！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="浏览器" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入浏览器"
                        v-decorator="['ua', { rules: [{ required: true, message: '请输入浏览器！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入用户名"
                        v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="服务ID" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入服务ID"
                        v-decorator="['serviceId', { rules: [{ required: true, message: '请输入服务ID！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="删除标识" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入删除标识"
                        v-decorator="['isDeleted', { rules: [{ required: true, message: '请输入删除标识！' }] }]"
                    />
                </a-form-item>
                <a-form-item label="租户ID" :labelCol="labelCol" :wrapperCol="wrapperCol" has-feedback>
                    <a-input
                        placeholder="请输入租户ID"
                        v-decorator="['tenantId', { rules: [{ required: true, message: '请输入租户ID！' }] }]"
                    />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import { sysLogSave } from '@/api/modular/system/syslog';
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
            };
        },
        methods: {
            // 初始化方法
            edit(record) {
                this.visible = true;
                setTimeout(() => {
                    this.form.setFieldsValue({
                        id: record.id,

                        type: record.type,

                        traceId: record.traceId,

                        title: record.title,

                        operation: record.operation,

                        methodType: record.methodType,

                        methodName: record.methodName,

                        params: record.params,

                        classPath: record.classPath,

                        url: record.url,

                        ip: record.ip,

                        exception: record.exception,

                        executeTime: record.executeTime,

                        location: record.location,

                        ua: record.ua,

                        userName: record.userName,

                        serviceId: record.serviceId,

                        isDeleted: record.isDeleted,

                        tenantId: record.tenantId,
                    });
                }, 100);
            },
            handleSubmit() {
                const {
                    form: { validateFields },
                } = this;
                this.confirmLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        for (const key in values) {
                            if (typeof values[key] === 'object') {
                                values[key] = JSON.stringify(values[key]);
                            }
                        }
                        sysLogSave(values)
                            .then(res => {
                                if (res.success) {
                                    this.$message.success('编辑成功');
                                    this.confirmLoading = false;
                                    this.$emit('ok', values);
                                    this.handleCancel();
                                } else {
                                    this.$message.error('编辑失败'); //  + res.message
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
