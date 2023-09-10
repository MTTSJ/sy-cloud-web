<template>
    <a-modal
        title="查看操作日志"
        :width="1200"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        :ok-button-props="{ props: { disabled: true } }"
    >
        <a-spin :spinning="confirmLoading">
            <a-form :form="form">
                <a-row :gutter="24">
                    <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="日志类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input placeholder="请输入日志类型" v-decorator="['type']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="跟踪ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input placeholder="请输入跟踪ID" v-decorator="['traceId']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="日志标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['title']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="IP地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['ip']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="操作系统" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['os']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="浏览器" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['browser']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="方法类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['methodType']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="方法名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['methodName']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="类名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['classPath']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24" >
                        <a-form-item label="请求路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['url']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="24" :sm="24" :padding="12">
                        <a-form-item label="参数" :labelCol="labelColFull" :wrapperCol="wrapperColFull">
                            <!-- <a-textarea :rows="6" v-decorator="['params']" /> -->
                            <Java v-decorator="['params']" :height="height" :width="width"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="24" :sm="24">
                        <a-form-item v-if="logType === 'EX'" label="异常内容" :labelCol="labelColFull" :wrapperCol="wrapperColFull">
                            <!-- <a-input
                placeholder="请输入异常内容"
                v-decorator="['exception', { rules: [{ required: true, message: '请输入异常内容！' }] }]"
              /> -->
                            <Java v-decorator="['exception']" :height="height" />
                        </a-form-item>
                        <a-form-item v-else label="响应内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <!-- <a-textarea :rows="6" v-decorator="['operation']" /> -->
                            <Java :value="jsonData" :height="height" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['userName']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="租户ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['tenantId']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="服务ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input v-decorator="['serviceId']" />
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="24">
                        <a-form-item label="耗时" :labelCol="labelCol" :wrapperCol="wrapperCol">
                            <a-input :value="timeStr" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick';
    import Java from '@/components/JavaEdit/index';
    export default {
        components: {
            Java,
        },
        data() {
            return {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 20 },
                },
                labelColFull: {
                    xs: { span: 24 },
                    sm: { span: 2 },
                },
                wrapperColFull: {
                    xs: { span: 24 },
                    sm: { span: 22 },
                },
                visible: false,
                confirmLoading: false,
                jsonData: '',
                logType: '',
                timeStr: '',
                height: '500',
                form: this.$form.createForm(this),
            };
        },
        methods: {
            // 初始化方法
            detail(record) {
                this.visible = true;
                this.model = Object.assign({}, record);
                this.$nextTick(() => {
                    this.form.setFieldsValue(
                        pick(
                            this.model,
                            'id',
                            'type',
                            'traceId',
                            'title',
                            'operation',
                            'methodType',
                            'methodName',
                            'params',
                            'classPath',
                            'url',
                            'ip',
                            'exception',
                            'executeTime',
                            'location',
                            'browser',
                            'os',
                            'userName',
                            'serviceId',
                            'isDeleted',
                            'tenantId',
                        ),
                    );
                });
                this.jsonData = this.model['operation'];
                this.logType = this.model['type'];
                this.timeStr = this.model['executeTime'] + 'ms';
            },
            handleCancel() {
                this.form.resetFields();
                this.visible = false;
            },
        },
    };
</script>
