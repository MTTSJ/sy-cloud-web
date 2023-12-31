<template>
    <div>
        <x-card>
            <div slot="content" class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="流程名称">
                                <a-input
                                    v-model="queryParam.processName"
                                    allow-clear
                                    placeholder="请输入流程名称"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="任务名称">
                                <a-input
                                    v-model="queryParam.name"
                                    allow-clear
                                    placeholder="请输入任务名称"
                                />
                            </a-form-item>
                        </a-col>
                        <template v-if="advanced">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="流程分类">
                                    <a-select
                                        v-model="queryParam.category"
                                        placeholder="请选择流程分类"
                                        allow-clear
                                    >
                                        <a-select-option
                                            v-for="(item, index) in flowableCategoryListData"
                                            :key="index"
                                            :value="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="优先级">
                                    <a-input-number
                                        placeholder="请选择优先级"
                                        v-model="queryParam.priority"
                                        style="width: 100%"
                                        :min="1"
                                        :max="1000"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="12" :sm="24">
                                <a-form-item label="创建时间">
                                    <a-range-picker
                                        v-model="queryParam.dates"
                                        :show-time="{
                                            hideDisabledOptions: true,
                                            defaultValue: [
                                                moment('00:00:00', 'HH:mm:ss'),
                                                moment('23:59:59', 'HH:mm:ss'),
                                            ],
                                        }"
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="(!advanced && 8) || 24" :sm="24">
                            <span
                                class="table-page-search-submitButtons"
                                :style="
                                    (advanced && { float: 'right', overflow: 'hidden' }) || {}
                                "
                            >
                                <a-button type="primary" @click="$refs.table.refresh(true)">
                                    查询
                                </a-button>
                                <a-button
                                    style="margin-left: 8px"
                                    @click="() => (queryParam = {})"
                                >
                                    重置
                                </a-button>
                                <a @click="toggleAdvanced" style="margin-left: 8px">
                                    {{ advanced ? '收起' : '展开' }}
                                    <a-icon :type="advanced ? 'up' : 'down'" />
                                </a>
                            </span>
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
                :rowKey="(record) => record.id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
            >
                <span slot="procInsName" slot-scope="text">
                    <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                </span>
                <span slot="formatStartTime" slot-scope="text, record">
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>{{ record.procIns.startTime }}</span>
                        </template>
                        {{ text }}
                    </a-tooltip>
                </span>
                <span slot="formatEndTime" slot-scope="text, record">
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>{{ record.endTime }}</span>
                        </template>
                        {{ text }}
                    </a-tooltip>
                </span>
                <span slot="action" slot-scope="text, record">
                    <a @click="$refs.tracking.tracking(record.procIns.id)">追踪</a>
                </span>
            </s-table>
            <tracking ref="tracking" />
        </a-card>
    </div>
</template>

<script>
    import { STable, Ellipsis, XCard } from '@/components';
    import { flowableDoneTaskPage } from '@/api/modular/flowable/taskDoneManage';
    import { flowableCategoryList } from '@/api/modular/flowable/categoryManage';
    import moment from 'moment';
    import tracking from '@/views/flow/tracking/tracking';

    export default {
        components: {
            XCard,
            STable,
            Ellipsis,
            tracking,
        },
        data() {
            return {
                // 高级搜索 展开/关闭
                advanced: false,
                // 查询参数
                queryParam: {},
                // 表头
                columns: [
                    {
                        title: '流程名称',
                        dataIndex: 'procIns.name',
                        scopedSlots: { customRender: 'procInsName' },
                    },
                    {
                        title: '任务名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '发起人',
                        dataIndex: 'procIns.startUserName',
                    },
                    {
                        title: '发起时间',
                        dataIndex: 'procIns.formatStartTime',
                        scopedSlots: { customRender: 'formatStartTime' },
                    },
                    {
                        title: '办理时间',
                        dataIndex: 'formatEndTime',
                        scopedSlots: { customRender: 'formatEndTime' },
                    },
                    {
                        title: '任务历时',
                        dataIndex: 'duration',
                    },
                ],
                // 加载数据方法 必须为 Promise 对象
                loadData: (parameter) => {
                    const dates = this.queryParam.dates;
                    if (dates != null) {
                        this.queryParam.searchBeginTime = moment(dates[0]).format(
                            'YYYY-MM-DD HH:mm:ss',
                        );
                        this.queryParam.searchEndTime = moment(dates[1]).format(
                            'YYYY-MM-DD HH:mm:ss',
                        );
                        if (dates.length < 1) {
                            delete this.queryParam.searchBeginTime;
                            delete this.queryParam.searchEndTime;
                        }
                    }
                    const obj = JSON.parse(JSON.stringify(this.queryParam));
                    delete obj.dates;
                    return flowableDoneTaskPage(Object.assign(parameter, obj)).then(
                        (res) => {
                            return res.data;
                        },
                    );
                },
                selectedRowKeys: [],
                selectedRows: [],
                flowableCategoryListData: [],
            };
        },
        created() {
            this.flowableCategoryList();
            this.columns.push({
                title: '操作',
                width: '150px',
                dataIndex: 'action',
                scopedSlots: { customRender: 'action' },
            });
        },
        methods: {
            moment,
            /**
             * 获取流程类型
             */
            flowableCategoryList() {
                flowableCategoryList().then((res) => {
                    this.flowableCategoryListData = res.data;
                });
            },
            toggleAdvanced() {
                this.advanced = !this.advanced;
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
