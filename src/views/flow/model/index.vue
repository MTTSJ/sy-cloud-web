<template>
    <div>
        <x-card v-if="hasPerm('model:page')">
            <div
                slot="content"
                class="table-page-search-wrapper"
                v-if="hasPerm('model:page')"
            >
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="流程名称">
                                <a-input
                                    v-model="queryParam.name"
                                    allow-clear
                                    placeholder="请输入流程名称"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-button type="primary" @click="$refs.table.refresh(true)">
                                查询
                            </a-button>
                            <a-button
                                style="margin-left: 8px"
                                @click="() => (queryParam = {})"
                            >
                                重置
                            </a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </x-card>
        <a-card :bordered="false" v-show="!versionShow">
            <s-table
                ref="table"
                :columns="columns"
                :data="loadData"
                :alert="false"
                :rowKey="(record) => record.id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
            >
                <a-space slot="operator" v-if="hasPerm('model:add')">
                    <a-button
                        @click="handleAdd"
                        v-if="hasPerm('model:add')"
                        type="primary"
                        icon="plus"
                    >
                        新增模型
                    </a-button>
                    <a-upload
                        v-if="hasPerm('model:add')"
                        accept=".bpmn,.bpmn20.xml"
                        name="file"
                        :multiple="true"
                        :customRequest="customRequest"
                        :showUploadList="false"
                    >
                        <a-button>
                            <a-icon type="upload" />
                            导入模型
                        </a-button>
                    </a-upload>
                </a-space>
                <span slot="name" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="created" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="version" slot-scope="text, record">
                    <a v-if="hasPerm('model:edit')" @click="openVersion(record)">
                        V{{ text }}.0
                    </a>
                    <span v-else>V{{ text }}.0</span>
                </span>
                <span slot="description" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="handleDesign(record)" v-if="hasPerm('model:edit')">设计</a>
                    <a-divider type="vertical" v-if="hasPerm('model:edit')" />
                    <a-popconfirm
                        v-if="hasPerm('model:edit')"
                        placement="topRight"
                        title="将此模型部署发布吗？"
                        @confirm="() => handleDeploy(record)"
                    >
                        <a>部署</a>
                    </a-popconfirm>
                    <a-divider type="vertical" v-if="hasPerm('model:edit')" />
                    <a-dropdown>
                        <a class="ant-dropdown-link">
                            更多
                            <a-icon type="down" />
                        </a>
                        <a-menu slot="overlay" v-if="hasPerm('model:edit')">
                            <a-menu-item v-if="hasPerm('model:edit')">
                                <a @click="handlePreview(record)">预览</a>
                            </a-menu-item>
                            <a-menu-item v-if="hasPerm('model:edit')">
                                <a @click="handleEdit(record)">编辑</a>
                            </a-menu-item>
                            <a-menu-item v-if="hasPerm('model:del')">
                                <a-popconfirm
                                    placement="topRight"
                                    title="确定删除？"
                                    @confirm="() => handleDelete(record)"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="refOk" v-if="hasPerm('model:add')" />
            <edit-form ref="editForm" @ok="refOk" v-if="hasPerm('model:edit')" />
            <preview ref="preview" v-if="hasPerm('model:edit')" />
            <deploy-form ref="deployForm" @ok="refOk" v-if="hasPerm('model:edit')" />
        </a-card>

        <version
            v-show="versionShow"
            ref="version"
            @ok="closeVersion"
            v-if="hasPerm('model:edit')"
        />
    </div>
</template>

<script>
    import { STable, Ellipsis, XCard } from '@/components';
    import {
        modelList,
        modelDelete,
        modelImportModel,
    } from '@/api/modular/flowable/modelManage';
    import addForm from './addForm';
    import editForm from './editForm';
    import preview from './preview';
    import deployForm from './deployForm';
    import version from './version';
    export default {
        components: {
            XCard,
            Ellipsis,
            STable,
            addForm,
            editForm,
            preview,
            deployForm,
            version,
        },
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
                tableLoading: false,
                Loading: false,
                // loadData: [],
                // 查询参数
                queryParam: {},
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return modelList(Object.assign(parameter, this.queryParam)).then(res => res.data);
                },
                // 表头
                columns: [
                    {
                        title: '模型名称',
                        dataIndex: 'name',
                        scopedSlots: { customRender: 'name' },
                    },
                    {
                        title: '唯一编码',
                        dataIndex: 'key',
                    },
                    {
                        title: '版本',
                        dataIndex: 'version',
                        scopedSlots: { customRender: 'version' },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'created',
                        scopedSlots: { customRender: 'created' },
                    },
                    {
                        title: '创建人',
                        dataIndex: 'createdBy',
                    },
                    {
                        title: '描述',
                        dataIndex: 'description',
                        scopedSlots: { customRender: 'description' },
                    },
                ],
                selectedRowKeys: [],
                selectedRows: [],
                // 界面切换
                indexShow: true,
                versionShow: false,
            };
        },
        created() {
            if (this.hasPerm('model:edit') || this.hasPerm('model:del')) {
                this.columns.push({
                    title: '操作',
                    width: '200px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },
        methods: {

            /**
             * 关闭整个页面
             */
            handleCancel() {
                // this.loadData = [];
                this.columns = [];
            },
            /**
             * 打开version列表
             */
            openVersion(record) {
                console.log(JSON.parse(JSON.stringify(record)));
                this.indexShow = false;
                this.versionShow = true;
                this.$refs.version.openVersion(record);
            },
            /**
             * 关闭version界面
             */
            closeVersion() {
                this.indexShow = true;
                this.versionShow = false;
                this.$refs.table.refresh();
            },
            /**
             * 删除
             */
            handleDelete(record) {
                this.Loading = true;
                modelDelete({ ids: record.id }).then(res => {
                    this.Loading = false;
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('删除失败：' + res.message);
                    }
                });
            },
            /**
             * 导入模型
             */
            customRequest(data) {
                const formData = new FormData();
                formData.append('file', data.file);
                this.tableLoading = true;
                modelImportModel(formData).then(res => {
                    this.tableLoading = false;
                    if (res.success) {
                        this.$message.success('导入成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('导入失败：' + res.message);
                    }
                });
            },
            /**
             * 部署
             */
            handleDeploy(record) {
                this.$refs.deployForm.deploy(record);
            },
            /**
             * 新增
             */
            handleAdd() {
                this.$refs.addForm.add();
            },
            /**
             * 设计
             */
            handleDesign(record) {
                this.$router.push({
                    name: 'bpmn_design',
                    query: {
                        id: record.id,
                    },
                });
            },
            /**
             * 编辑
             */
            handleEdit(record) {
                this.$refs.editForm.edit(record);
            },
            /**
             * 预览
             */
            handlePreview(record) {
                this.$refs.preview.preview(record);
            },
            /**
             * 子组件成功后返回
             */
            refOk() {
                this.$refs.table.refresh();
            },
            handleClick(e) {
                this.queryParam = {
                    pid: e.toString(),
                };
                this.$refs.table.refresh(true);
            },
            handleOk() {
                this.$refs.table.refresh();
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
        },
    };
</script>
