<template>
    <div>
        <x-card v-if="hasPerm('script:page')">
            <div slot="content" class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="名称">
                                <a-input
                                    v-model="queryParam.name"
                                    allow-clear
                                    placeholder="请输入名称"
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
        <a-card :bordered="false">
            <s-table
                ref="table"
                :columns="columns"
                :data="loadData"
                :alert="false"
                :rowKey="record => record.id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
            >
                <template slot="operator" v-if="hasPerm('script:add')">
                    <a-button
                        v-if="hasPerm('script:add')"
                        type="primary"
                        @click="$refs.addForm.add()"
                        icon="plus"
                    >
                        新增脚本
                    </a-button>
                </template>
                <span slot="type" slot-scope="text">
                    {{ typeFilter(text) }}
                </span>
                <span slot="lang" slot-scope="text">
                    {{ langFilter(text) }}
                </span>
                <span slot="remark" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a
                        @click="$refs.Detail.detail(record)"
                        v-if="hasPerm('script:page')"
                    >
                        详情
                    </a>
                    <a-divider
                        type="vertical"
                        v-if="
                            hasPerm('script:edit') & hasPerm('script:page')
                        "
                    />
                    <a
                        @click="$refs.editForm.edit(record)"
                        v-if="hasPerm('script:edit')"
                    >
                        编辑
                    </a>
                    <a-divider
                        type="vertical"
                        v-if="
                            hasPerm('script:edit') & hasPerm('script:del')
                        "
                    />
                    <a-popconfirm
                        v-if="hasPerm('script:del')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => flowableScriptDelete(record)"
                    >
                        <a>删除</a>
                    </a-popconfirm>
                </span>
            </s-table>
            <add-form
                v-if="hasPerm('script:add')"
                ref="addForm"
                @ok="handleOk"
            />
            <edit-form
                v-if="hasPerm('script:edit')"
                ref="editForm"
                @ok="handleOk"
            />
            <detail
                v-if="hasPerm('script:page')"
                ref="Detail"
                @ok="handleOk"
            />
        </a-card>
    </div>
</template>
<script>
    import { STable, Ellipsis, XCard } from '@/components';
    import {
        flowableScriptPage,
        flowableScriptDelete,
    } from '@/api/modular/flowable/scriptManage';
    import addForm from './addForm';
    import editForm from './editForm';
    import Detail from './detail';
    export default {
        components: {
            XCard,
            Ellipsis,
            STable,
            addForm,
            editForm,
            Detail,
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '类别',
                        dataIndex: 'type',
                        scopedSlots: { customRender: 'type' },
                    },
                    {
                        title: '语言',
                        dataIndex: 'lang',
                        scopedSlots: { customRender: 'lang' },
                    },
                    {
                        title: '备注',
                        dataIndex: 'remark',
                        scopedSlots: { customRender: 'remark' },
                    },
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return flowableScriptPage(
                        Object.assign(parameter, this.queryParam),
                    ).then(res => {
                        return res.data;
                    });
                },
                selectedRowKeys: [],
                selectedRows: [],
                typeData: [],
                langData: [],
            };
        },
        created() {
            this.getDictData();
            if (
                this.hasPerm('script:edit') ||
                this.hasPerm('script:del')
            ) {
                this.columns.push({
                    title: '操作',
                    width: '200px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },
        methods: {
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
             * 获取字典翻译数据
             */
            getDictData() {
                this.typeData = this.$options.filters['dictData']('scriptType');
                this.langData = this.$options.filters['dictData']('scriptLanguageType');
            },
            /**
             * 删除
             * @param record
             */
            flowableScriptDelete(record) {
                flowableScriptDelete(record)
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
                    });
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
<style lang="less">
.table-operator {
  margin-bottom: 18px;
}
button {
  margin-right: 8px;
}
</style>
