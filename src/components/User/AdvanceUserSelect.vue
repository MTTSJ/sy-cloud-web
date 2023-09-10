<template>
    <a-modal
        v-model="visible"
        title="用户选择"
        class="select-modal"
        width="800px"
        :after-close="reset"
        @ok="ok"
    >
        <div v-if="selectedRows.length" class="tag-container">
            <a-tag
                v-for="user in selectedRows"
                :key="user.id"
                color="blue"
                closable
                @close="onRemoveUser(user.id)"
            >
                {{ user.account }}
            </a-tag>
        </div>
        <a-row>
            <a-col :md="6" :sm="24">
                <DeptTreeSelect @select="getUsers({ orgId: $event })" />
            </a-col>
            <a-col :md="18" :sm="24">
                <a-input
                    v-model="queryParams.keyword"
                    allowClear
                    placeholder="关键词"
                    style="margin: 10px 0"
                >
                    <a-select
                        v-model="queryParams.status"
                        slot="addonBefore"
                        placeholder="状态"
                        style="width: 90px"
                        allowClear
                    >
                        <a-select-option value="0">启用</a-select-option>
                        <a-select-option value="1">禁用</a-select-option>
                    </a-select>
                </a-input>
                <a-table
                    row-key="id"
                    size="middle"
                    :loading="loading"
                    :columns="columns"
                    :data-source="tableData"
                    :pagination="pagination"
                    :scroll="{ x: 1000 }"
                    :row-selection="rowSelection"
                    @change="onTableChange"
                />
            </a-col>
        </a-row>
    </a-modal>
</template>

<script>
    import DeptTreeSelect from '@/components/User/DeptTreeSelect.vue';
    import { getPage } from '@/api/modular/system/userManage';
    import { message } from 'ant-design-vue';

    const statusMap = {
        0: {
            status: 'processing',
            text: '启用',
        },
        1: {
            status: 'default',
            text: '禁用',
        },
    };

    export default {
        name: 'AdvanceUserSelect',
        props: {
            multiple: {
                type: Boolean,
                default: false,
            },
        },
        components: {
            DeptTreeSelect,
        },
        data() {
            return {
                visible: false,
                tableData: [],
                selectedRowKeys: [],
                selectedRows: [],
                queryParams: {},
                sexMap: {},
                loading: false,
                total: 0,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    showSizeChanger: true,
                    size: 'small',
                    showTotal: (total) => `共 ${total} 条`,
                },
                columns: [
                    { title: '账号', dataIndex: 'account', width: 100, fixed: 'left' },
                    { title: '姓名', dataIndex: 'name', width: 100, ellipsis: true },
                    {
                        title: '性别',
                        dataIndex: 'sex',
                        width: 50,
                        customRender: (sex) => this.sexMap[sex],
                    },
                    { title: '手机', dataIndex: 'phone', width: 150 },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        customRender: (data) => {
                            const { text, status } = statusMap[data];
                            return <a-badge status={status} text={text} />;
                        },
                    },
                ],
            };
        },
        computed: {
            rowSelection() {
                return {
                    onChange: this.onSelectChange,
                    selectedRowKeys: this.selectedRowKeys,
                    type: this.multiple ? 'checkbox' : 'radio',
                };
            },
        },
        watch: {
            queryParams: {
                deep: true,
                immediate: true,
                handler: 'getUsers',
            },
        },
        mounted() {
            const toMap = (arr) =>
                arr.reduce((r, i) => ({ ...r, [i.dictKey]: i.dictValue }), {});
            this.sexMap = toMap(this.$options.filters['dictData']('sex'));
        },
        methods: {
            onTableChange(pagination) {
                Object.assign(this.pagination, pagination);
                this.getUsers();
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
            onRemoveUser(id) {
                this.selectedRowKeys = this.selectedRowKeys.filter((v) => v !== id);
                this.selectedRows = this.selectedRows.filter((v) => v.id !== id);
            },
            getUsers(params = {}) {
                this.loading = true;
                getPage({
                    current: this.pagination.current,
                    size: this.pagination.pageSize,
                    ...params,
                })
                    .then(({ data }) => {
                        this.total = data.total;
                        this.tableData = data.records || [];
                    })
                    .catch((e) => {
                        console.error(e);
                        message.error('用户数据获取失败');
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            ok() {
                if (this.selectedRows.length === 0) {
                    message.error('请选择用户');
                    return;
                }
                this.$emit('ok', this.selectedRows);
                this.visible = false;
            },
            /**
             * 以下为外部调用方法
             */
            reset() {
                this.selectedRowKeys = [];
                this.selectedRows = [];
                this.queryParams = {};
            },
            show() {
                this.reset();
                this.visible = true;
            },
            close() {
                this.reset();
                this.visible = false;
            },
        },
    };
</script>

<style lang="less" scoped>
.select-modal::v-deep {
  .ant-modal-body {
    padding: 0 10px 0 0;
  }
}
.tag-container {
  border: 1px dashed lightgrey;
  background-color: white;
  padding: 3px 5px 2px 5px;
  margin: 10px 0 0 10px;
  &::v-deep .ant-tag {
    margin-bottom: 3px;
    margin-top: 2px;
  }
}
</style>
