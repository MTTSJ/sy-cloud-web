<template>
    <div>
        <div v-if="hasPerm('defin:page')">
            <a-table
                :columns="columns"
                :dataSource="loadData"
                :pagination="false"
                :loading="tableLoading"
                :rowKey="(record) => record.id"
            >
                <span slot="jumpFirst" slot-scope="text,record">
                    <a-tag
                        v-if="text!=null & text === 'Y'"
                        :key="record.id"
                        :color="'green'"
                    >
                        {{ okFilter(text) }}
                    </a-tag>
                    <div v-else>{{ okFilter(text) }}</div>
                </span>
                <span slot="smartComplete" slot-scope="text,record">
                    <a-tag
                        v-if="text!=null & text === 'Y' "
                        :key="record.id"
                        :color="'green'"
                    >
                        {{ okFilter(text) }}
                    </a-tag>
                    <div v-else>{{ okFilter(text) }}</div>
                </span>
                <span slot="action" slot-scope="text,record">
                    <a @click="handleDetail(record)" v-if="hasPerm('defin:page')">查看</a>
                    <a-divider type="vertical" v-if="hasPerm('defin:edit')"/>
                    <a @click="handleEdit(record)" v-if="hasPerm('defin:edit')">编辑</a>
                </span>
            </a-table>
        </div>
        <div v-if="hasPerm('defin:page')">
            <a-modal
                title="选项详情"
                :width="900"
                :visible="visibleDetail"
                :footer="null"
                @cancel="handleCancelDetail"
            >
                <a-spin :spinning="detailLoading">
                    <a-form :form="detailForm">
                        <a-form-item
                            label="标题规则"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                        >
                            {{ Detail.title }}
                        </a-form-item>
                        <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="自动完成第一个任务"
                        >
                            <a-tag
                                v-if="Detail.jumpFirst === 'Y' "
                                :color="'green'"
                            >
                                {{ okFilter(Detail.jumpFirst) }}
                            </a-tag>
                            <div v-else>{{ okFilter(Detail.jumpFirst) }}</div>
                        </a-form-item>
                        <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="跳过相同处理人"
                        >
                            <a-tag
                                v-if="Detail.smartComplete === 'Y' "
                                :color="'green'"
                            >
                                {{ okFilter(Detail.smartComplete) }}
                            </a-tag>
                            <div v-else>{{ okFilter(Detail.smartComplete) }}</div>
                        </a-form-item>
                    </a-form>
                </a-spin>
            </a-modal>
        </div>
        <div v-if="hasPerm('defin:edit')">
            <a-modal
                title="编辑选项"
                :width="900"
                :visible="visibleEdit"
                @ok="editHandSubmit"
                @cancel="handleCancelEdit"
            >
                <a-spin :spinning="editLoading">
                    <a-form :form="editForm">
                        <a-form-item v-show="false"><a-input v-decorator="['id']" /></a-form-item>
                        <a-form-item v-show="false"><a-input v-decorator="['processDefinitionId']" /></a-form-item>
                        <a-form-item
                            label="标题规则"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                        >
                            <a-input placeholder="请输入标题规则" v-decorator="['title', {rules: [{required: true, message: '请输入标题规则！'}]}]" />
                        </a-form-item>
                        <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="自动完成第一个任务"
                        >
                            <a-radio-group v-decorator="['jumpFirst',{rules: [{ required: true, message: '是否自动完成第一个任务！' }]}]" >
                                <a-radio v-for="(item,index) in okPrefixData" :key="index" :value="item.dictKey">{{ item.dictValue }}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            label="跳过相同处理人"
                        >
                            <a-radio-group v-decorator="['smartComplete',{rules: [{ required: true, message: '是否跳过相同处理人！' }]}]" >
                                <a-radio v-for="(item,index) in okPrefixData" :key="index" :value="item.dictKey">{{ item.dictValue }}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-form>
                </a-spin>
            </a-modal>
        </div>
    </div>
</template>

<script>
    import { optionList, optionEdit } from '@/api/modular/flowable/optionManage';
    export default {
        data() {
            return {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 7 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 15 },
                },
                visible: false,
                // 详情参数
                visibleDetail: false,
                tableLoading: false,
                detailLoading: false,
                detailForm: this.$form.createForm(this),
                Detail: [],
                // 编辑参数
                visibleEdit: false,
                editLoading: false,
                editForm: this.$form.createForm(this),
                // 查询参数
                queryParam: {},
                // 表头
                columns: [],
                loadData: [],
                textData: [],
                okPrefixData: [],
            };
        },
        methods: {
            /**
             * 初始化界面
             */
            optionIndex(id) {
                this.queryParam.processDefinitionId = id;
                this.getOptionList();
                this.addAction();
                // this.getDictData();
                this.dataTypeItem();
            },
            /**
             * 初始化table
             */
            addAction() {
                this.columns.push(
                    {
                        title: '标题规则',
                        dataIndex: 'title',
                    },
                    {
                        title: '自动完成第一个任务',
                        dataIndex: 'jumpFirst',
                        scopedSlots: { customRender: 'jumpFirst' },
                    },
                    {
                        title: '跳过相同处理人',
                        dataIndex: 'smartComplete',
                        scopedSlots: { customRender: 'smartComplete' },
                    },
                );
                if (this.hasPerm('defin:page') || this.hasPerm('defin:edit')) {
                    this.columns.push({
                        title: '操作',
                        width: '150px',
                        dataIndex: 'action',
                        scopedSlots: { customRender: 'action' },
                    });
                }
            },
            /**
             * 加载table数据
             */
            getOptionList() {
                this.tableLoading = true;
                optionList(this.queryParam).then((res) => {
                    this.tableLoading = false;
                    if (res.success) {
                        this.loadData = res.data;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            /**
             * 获取字典数据
             */
            dataTypeItem() {
                this.okPrefixData = this.$options.filters['dictData']('ok');
            },
            okFilter(status) {
                // eslint-disable-next-line eqeqeq
                const values = this.okPrefixData.filter(item => item.dictKey == status);
                if (values.length > 0) {
                    return values[0].dictValue;
                }
            },
            /**
             * 清理数据
             */
            handleCancel() {
                this.loadData = [];
                this.columns = [];
            },
            /**
             * 打开详情框
             */
            handleDetail(detail) {
                this.Detail = detail;
                this.visibleDetail = true;
            },
            /**
             * 关闭详情框
             */
            handleCancelDetail() {
                this.visibleDetail = false;
            },
            /**
             * 打开编辑框
             */
            handleEdit(record) {
                this.visibleEdit = true;
                setTimeout(() => {
                    this.editForm.setFieldsValue(
                        {
                            id: record.id,
                            processDefinitionId: record.processDefinitionId,
                            title: record.title,
                            jumpFirst: record.jumpFirst,
                            smartComplete: record.smartComplete,
                        },
                    );
                }, 100);
            },
            /**
             * 关闭编辑框
             */
            handleCancelEdit() {
                this.editForm.resetFields();
                this.visibleEdit = false;
            },
            /**
             * 编辑提交
             */
            editHandSubmit() {
                const { editForm: { validateFields } } = this;
                this.editLoading = true;
                validateFields((errors, values) => {
                    if (!errors) {
                        optionEdit(values).then((res) => {
                            this.editLoading = false;
                            if (res.success) {
                                this.$message.success('编辑成功');
                                this.getOptionList();
                                this.handleCancelEdit();
                            } else {
                                this.$message.error('编辑失败：' + res.message);
                            }
                        });
                    } else {
                        this.editLoading = false;
                    }
                });
            },
        },
    };
</script>
