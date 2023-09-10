<template>
    <div>
        <a-card :bordered="false" v-show="indexOpenShow" :bodyStyle="tstyle">
            <a-spin :spinning="Loading">
                <div class="table-page-search-wrapper" v-if="hasPerm('code:page')">
                    <a-form layout="inline">
                        <a-row :gutter="48">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="表名">
                                    <a-input
                                        v-model="queryParam.baseTableName"
                                        allow-clear
                                        placeholder="请输入表名"
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
            </a-spin>
        </a-card>
        <a-card :bordered="false" v-show="indexOpenShow">
            <a-spin :spinning="Loading">
                <s-table
                    ref="table"
                    size="default"
                    :columns="columns"
                    :data="loadData"
                    :alert="true"
                    :rowKey="(record) => record.id"
                    :scroll="{ x: 'calc(600px + 50%)', y: 600 }"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange,
                    }"
                >
                    <div slot="operator" v-if="hasPerm('code:add')">
                        <a-button
                            type="primary"
                            v-if="hasPerm('code:add')"
                            icon="plus"
                            @click="$refs.editForm.show()"
                        >
                            新增
                        </a-button>
                    </div>
                    <span slot="baseTableName" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="packageName" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="busName" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="className" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="tableComment" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="tablePrefix" slot-scope="text, record">
                        <a-tag :color="record.tablePrefix === 'Y' ? 'blue' : 'green'">
                            {{ 'ok' | dictType(text) }}
                        </a-tag>
                    </span>
                    <span slot="generateType" slot-scope="text">
                        <ellipsis :length="10" tooltip>
                            {{ 'codeGeneratorType' | dictType(text) }}
                        </ellipsis>
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <span v-if="record.generateType === '1'">
                            <a v-if="hasPerm('code:run')" @click="codePreviewOpen(record)">
                                预览
                            </a>
                        </span>
                        <a-divider type="vertical" v-if="hasPerm('code:run')" />
                        <span v-if="record.generateType === '1'">
                            <a
                                v-if="hasPerm('code:run')"
                                @click="runDownCodeGenerate(record)"
                            >
                                生成
                            </a>
                        </span>
                        <span v-else>
                            <a-popconfirm
                                v-if="hasPerm('code:run')"
                                placement="topRight"
                                title="确定生成代码到本项目？"
                                @confirm="() => runLocalCodeGenerate(record)"
                            >
                                <a>生成</a>
                            </a-popconfirm>
                        </span>
                        <a-divider
                            type="vertical"
                            v-if="hasPerm('code:config') & hasPerm('code:run')"
                        />
                        <a-dropdown
                            v-if="
                                hasPerm('code:config') ||
                                    hasPerm('code:edit') ||
                                    hasPerm('code:del')
                            "
                        >
                            <a class="ant-dropdown-link">
                                <a-icon type="more" />
                                更多
                                <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item v-if="hasPerm('code:config')">
                                    <a @click="indexConfigOpen(record)">表单配置</a>
                                </a-menu-item>
                                <a-menu-item v-if="hasPerm('code:edit')">
                                    <a @click="$refs.editForm.show(record)">编辑</a>
                                </a-menu-item>
                                <a-menu-item v-if="hasPerm('code:edit') & hasPerm('code:del')">
                                    <a-popconfirm
                                        placement="topRight"
                                        title="确认删除？"
                                        @confirm="() => codeGenerateDelete(record)"
                                    >
                                        <a>删除</a>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </span>
                </s-table>
                <EditForm ref="editForm" @ok="handleOk" />
            </a-spin>
        </a-card>
        <index-config
            ref="indexConfig"
            @ok="handleResetOpen"
            v-if="hasPerm('code:config')"
        />
        <preview-form
            ref="previewForm"
            @ok="handleResetPreviewOpen"
            v-if="hasPerm('code:config')"
        />
    </div>
</template>
<script>
    import { STable, Ellipsis } from '@/components';
    import {
        codeGeneratePage,
        codeGenerateDelete,
        codeGenerateRunDown,
        codeGenerateRunLocal,
    } from '@/api/modular/gen/codeGenerateManage';
    import EditForm from './editForm';
    import indexConfig from './indexConfig';
    import previewForm from './previewForm';

    export default {
        components: {
            indexConfig,
            STable,
            Ellipsis,
            EditForm,
            previewForm,
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '表名',
                        dataIndex: 'baseTableName',
                        scopedSlots: { customRender: 'baseTableName' },
                        fixed: 'left',
                    },
                    {
                        title: '包名',
                        dataIndex: 'packageName',
                        scopedSlots: { customRender: 'packageName' },
                    },
                    {
                        title: '业务名',
                        dataIndex: 'busName',
                        scopedSlots: { customRender: 'busName' },
                    },
                    {
                        title: '类名',
                        dataIndex: 'className',
                        scopedSlots: { customRender: 'className' },
                    },
                    {
                        title: '功能名',
                        dataIndex: 'tableComment',
                        scopedSlots: { customRender: 'tableComment' },
                    },
                    {
                        title: '作者',
                        dataIndex: 'authorName',
                    },
                    {
                        title: '表前缀移除',
                        dataIndex: 'tablePrefix',
                        scopedSlots: { customRender: 'tablePrefix' },
                    },
                    {
                        title: '生成方式',
                        dataIndex: 'generateType',
                        scopedSlots: { customRender: 'generateType' },
                    },
                ],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                loadData: parameter => {
                    return codeGeneratePage(Object.assign(parameter, this.queryParam)).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                Loading: false,
                jdbcDriverList: [],
                indexOpenShow: true,
            };
        },
        created() {
            if (this.hasPerm('code:edit') || this.hasPerm('code:del')) {
                this.columns.push({
                    title: '操作',
                    width: '208px',
                    dataIndex: 'action',
                    fixed: 'right',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },
        methods: {
            /**
             * 开始生成代码（生成压缩包）
             */
            runDownCodeGenerate(record) {
                this.Loading = true;
                codeGenerateRunDown({ id: record.id })
                    .then(res => {
                        this.Loading = false;
                        // this.downloadfile(res)
                        // eslint-disable-next-line handle-callback-err
                    })
                    .catch(err => {
                        this.Loading = false;
                        this.$message.error('下载错误：获取文件流错误' + err);
                    });
            },
            downloadfile(res) {
                var blob = new Blob([res], { type: 'application/octet-stream;charset=UTF-8' });
                var contentDisposition = res.headers['content-disposition'];
                var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
                var result = patt.exec(contentDisposition);
                var filename = result[1];
                var downloadElement = document.createElement('a');
                var href = window.URL.createObjectURL(blob); // 创建下载的链接
                var reg = /^["](.*)["]$/g;
                downloadElement.style.display = 'none';
                downloadElement.href = href;
                downloadElement.download = decodeURI(filename.replace(reg, '$1')); // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href);
            },
            /**
             * 开始生成代码（本地项目）
             */
            runLocalCodeGenerate(record) {
                codeGenerateRunLocal(record).then(res => {
                    if (res.success) {
                        this.$message.success('生成成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('生成失败：' + res.message);
                    }
                });
            },
            /**
             * 删除
             */
            codeGenerateDelete(record) {
                this.Loading = true;
                codeGenerateDelete({ ids: record.id })
                    .then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.$refs.table.refresh();
                        } else {
                            this.$message.error('删除失败：' + res.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('删除错误：' + err.message);
                    })
                    .finally(res => {
                        this.Loading = false;
                    });
            },
            /**
             * 打开配置界面
             */
            indexConfigOpen(record) {
                this.indexOpenShow = false;
                this.$refs.indexConfig.open(record);
            },

            /**
             * 打开预览界面
             */
            codePreviewOpen(record) {
                this.indexOpenShow = false;
                this.$refs.previewForm.open(record);
            },
            /**
             * 详细配置界面返回
             */
            handleResetOpen() {
                this.indexOpenShow = true;
                this.$refs.table.refresh();
            },

            handleResetPreviewOpen() {
                this.indexOpenShow = true;
            },
            /**
             * 其他界面返回
             */
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
<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
</style>
