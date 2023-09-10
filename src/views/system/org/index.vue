<template>
    <a-row :gutter="10">
        <a-col :md="6" :sm="24">
            <a-card class="tree-card" :bordered="false" :loading="treeLoading">
                <a-input-search v-model="searchValue" style="margin-bottom: 8px" placeholder="Search" />
                <a-tree
                    v-if="treeData.length"
                    class="tree"
                    blockNode
                    defaultExpandAll
                    autoExpandParent
                    :treeData="treeData"
                    :replaceFields="{ key: 'id' }"
                    @select="$set(queryParam, 'pid', $event[0])"
                />
                <a-empty v-else :image="simpleImage" />
            </a-card>
        </a-col>

        <a-col :md="18" :sm="24">
            <a-card :bordered="false">
                <div class="table-page-search-wrapper" v-if="hasPerm('sysOrg:page')">
                    <a-form layout="inline">
                        <a-row :gutter="48">
                            <a-col :md="10" :sm="24">
                                <a-form-item label="机构名称">
                                    <a-input
                                        v-model="queryParam.keyword"
                                        allow-clear
                                        placeholder="请输入机构名称"
                                        @keydown.enter="reloadTable"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-space>
                                    <a-button type="primary" @click="reloadTable">查询</a-button>
                                    <a-button @click="queryParam = {}">重置</a-button>
                                </a-space>
                            </a-col>
                            <a-col :md="8" :sm="24"></a-col>
                        </a-row>
                    </a-form>
                </div>

                <s-table
                    ref="table"
                    size="middle"
                    alert
                    :columns="columns"
                    :data="loadTableData"
                    :rowSelection="{ onChange: onSelectChange, selectedRowKeys: selectedRowKeys }"
                >
                    <template #operator>
                        <a-button type="primary" v-if="hasPerm('sysOrg:add')" icon="plus" @click="$refs.addForm.add()">
                            新增机构
                        </a-button>
                    </template>
                    <a-space slot="action" slot-scope="text, record" size="middle">
                        <a v-if="hasPerm('sysOrg:edit')" @click="$refs.editForm.edit(record)">
                            <a-icon type="edit" />
                            编辑
                        </a>
                        <a-popconfirm
                            v-if="hasPerm('sysOrg:delete')"
                            placement="topRight"
                            title="确认删除？"
                            @confirm="() => sysOrgDelete(record)"
                        >
                            <a>
                                <a-icon type="delete" />
                                删除
                            </a>
                        </a-popconfirm>
                    </a-space>
                </s-table>

                <add-form ref="addForm" @ok="getOrgTree" />
                <edit-form ref="editForm" @ok="getOrgTree" />
            </a-card>
        </a-col>
    </a-row>
</template>

<script>
    import { cloneDeep } from 'lodash-es';
    import { Empty } from 'ant-design-vue';
    import { getPage, sysOrgDelete, getOrgTree } from '@/api/modular/system/orgManage';
    import addForm from './addForm';
    import editForm from './editForm';
    import STable from '@/components/Table';

    export default {
        components: {
            addForm,
            editForm,
            STable,
        },
        data() {
            return {
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    { title: '机构名称', dataIndex: 'name' },
                    { title: '唯一编码', dataIndex: 'code' },
                    { title: '排序', dataIndex: 'sort' },
                    { title: '备注', dataIndex: 'remark' },
                    { title: '操作', width: '150px', dataIndex: 'action', scopedSlots: { customRender: 'action' } },
                ],
                orgTree: [],
                selectedRowKeys: [],
                selectedRows: [],
                // 搜索的三个参数
                searchValue: '',
                treeLoading: true,
                simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
            };
        },
        computed: {
            treeData() {
                const query = this.searchValue;
                const reg = new RegExp(query, 'g');
                const filter = (data) => {
                    const result = [];
                    for (const item of Array.isArray(data) ? data : [data]) {
                        const { title, children = [] } = item;
                        if (reg.test(title)) {
                            result.push(item);
                            item.children = filter(children);
                            item.title = this.$createElement('span', {
                                domProps: {
                                    innerHTML: query
                                        ? title.replace(query, `<span style="color: #f50">${query}</span>`)
                                        : title,
                                },
                            });
                        } else {
                            result.push(...filter(children));
                        }
                    }
                    return result;
                };
                return filter(cloneDeep(this.orgTree));
            },
        },
        watch: {
            queryParam: {
                deep: true,
                handler: 'reloadTable',
            },
        },
        created() {
            this.getOrgTree();
        },
        methods: {
            /**
             * 获取到机构树，展开顶级下树节点，考虑到后期数据量变大，不建议全部展开
             */
            getOrgTree() {
                getOrgTree(this.queryParam).then(res => {
                    this.treeLoading = false;
                    if (!res.success) {
                        return;
                    }
                    this.orgTree = res.data;
                });
            },
            reloadTable() {
                this.$refs.table.refresh();
            },
            loadTableData(params) {
                return getPage({ ...params, ...this.queryParam })
                    .then(({ data }) => data);
            },
            /**
             * 删除
             * @param record
             */
            sysOrgDelete(record) {
                sysOrgDelete({ ids: record.id }).then(res => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.getOrgTree();
                    } else {
                        this.$message.warning('删除失败：' + res.msg);
                    }
                });
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
        },
    };
</script>

<style lang="less" scoped>
.tree-card {
  &::v-deep .ant-card-body {
    padding: 10px;
  }
}
.tree::v-deep {
  .ant-tree-node-content-wrapper {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
