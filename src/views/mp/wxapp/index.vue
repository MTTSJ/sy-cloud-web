<template>
    <div>
        <a-card :bordered="false" :bodyStyle="tstyle">
            <div class="table-page-search-wrapper" v-if="hasPerm('wxApp:page')">
                <a-form layout="inline">
                    <a-row :gutter="48">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="机构ID">
                                <a-input
                                    v-model="queryParam.organId"
                                    allow-clear
                                    placeholder="请输入机构ID"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="微信原始标识">
                                <a-input
                                    v-model="queryParam.wxSign"
                                    allow-clear
                                    placeholder="请输入微信原始标识"
                                />
                            </a-form-item>
                        </a-col>
                        <template v-if="advanced">
                            <a-col :md="8" :sm="24">
                                <a-form-item label="应用类型">
                                    <a-input
                                        v-model="queryParam.appType"
                                        allow-clear
                                        placeholder="请输入应用类型"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="应用密钥">
                                    <a-input
                                        v-model="queryParam.secret"
                                        allow-clear
                                        placeholder="请输入应用密钥"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="token">
                                    <a-input
                                        v-model="queryParam.token"
                                        allow-clear
                                        placeholder="请输入token"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="EncodingAESKey">
                                    <a-input
                                        v-model="queryParam.aesKey"
                                        allow-clear
                                        placeholder="请输入EncodingAESKey"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="微信号名称">
                                    <a-input
                                        v-model="queryParam.name"
                                        allow-clear
                                        placeholder="请输入微信号名称"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="是否第三方平台应用">
                                    <a-input
                                        v-model="queryParam.isComponent"
                                        allow-clear
                                        placeholder="请输入是否第三方平台应用"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="微信类型">
                                    <a-input
                                        v-model="queryParam.wxType"
                                        allow-clear
                                        placeholder="请输入微信类型"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="公众号微信号">
                                    <a-input
                                        v-model="queryParam.wxHao"
                                        allow-clear
                                        placeholder="请输入公众号微信号"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="认证类型">
                                    <a-input
                                        v-model="queryParam.verifyType"
                                        allow-clear
                                        placeholder="请输入认证类型"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="logo">
                                    <a-input
                                        v-model="queryParam.logo"
                                        allow-clear
                                        placeholder="请输入logo"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="二维码">
                                    <a-input
                                        v-model="queryParam.qrCode"
                                        allow-clear
                                        placeholder="请输入二维码"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="主体名称">
                                    <a-input
                                        v-model="queryParam.principalName"
                                        allow-clear
                                        placeholder="请输入主体名称"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="微社区URL">
                                    <a-input
                                        v-model="queryParam.community"
                                        allow-clear
                                        placeholder="请输入微社区URL"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="备注信息">
                                    <a-input
                                        v-model="queryParam.remarks"
                                        allow-clear
                                        placeholder="请输入备注信息"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="绑定的会员卡ID">
                                    <a-input
                                        v-model="queryParam.vipCardId"
                                        allow-clear
                                        placeholder="请输入绑定的会员卡ID"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="租户ID">
                                    <a-input
                                        v-model="queryParam.tenantId"
                                        allow-clear
                                        placeholder="请输入租户ID"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :md="8" :sm="24">
                                <a-form-item label="是否已删除">
                                    <a-input
                                        v-model="queryParam.isDeleted"
                                        allow-clear
                                        placeholder="请输入是否已删除"
                                    />
                                </a-form-item>
                            </a-col>
                        </template>
                        <a-col :md="8" :sm="24">
                            <span class="table-page-search-submitButtons">
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
        </a-card>
        <a-card :bordered="false">
            <s-table
                ref="table"
                size="default"
                :columns="columns"
                :data="loadData"
                :alert="true"
                :rowKey="(record) => record.id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: onSelectChange,
                }"
            >
                <template
                    class="table-operator"
                    slot="operator"
                    v-if="hasPerm('wxApp:add')"
                >
                    <a-button
                        type="primary"
                        v-if="hasPerm('wxApp:add')"
                        icon="plus"
                        @click="$refs.addForm.add()"
                    >
                        新增微信应用
                    </a-button>
                </template>
                <span slot="action" slot-scope="text, record">
                    <a v-if="hasPerm('wxApp:edit')" @click="$refs.editForm.edit(record)">
                        <a-icon type="edit" />
                        编辑
                    </a>
                    <a-divider
                        type="vertical"
                        v-if="hasPerm('wxApp:edit') & hasPerm('wxApp:delete')"
                    />
                    <a-popconfirm
                        v-if="hasPerm('wxApp:delete')"
                        placement="topRight"
                        title="确认删除？"
                        @confirm="() => wxAppDelete(record)"
                    >
                        <a>
                            <a-icon type="delete" />
                            删除
                        </a>
                    </a-popconfirm>
                </span>
                <span slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <div>
                        <a-row :gutter="16">
                            <a-col :span="8">
                                <p style="text-align: center"><img :src="record.qrCode" style="width: 160px; height: 160px"/></p>
                                <p style="text-align: center">
                                    <a-button type="danger" icon="search" ghost>重新授权</a-button>
                                    <a-button type="danger" icon="search" ghost>授权信息</a-button>
                                </p>
                            </a-col>
                            <a-col :span="16">
                                <a-card :bordered="false">
                                    <p style="padding-top: 20px;">AppID: {{record.id}}</p>
                                    <p>主体名称: {{record.principalName}}</p>
                                    <p>创建时间: {{record.createTime}}</p>
                                    <p style="padding-top: 20px;">
                                        <a-button type="primary" icon="search" ghost>查看acess-token</a-button>
                                        <a-button type="primary" icon="search" ghost>查看JsapiTicket</a-button>
                                        <a-button type="primary" icon="search" ghost>api次数清零</a-button>
                                        <a-button type="primary" icon="search" ghost>场景二维码</a-button>
                                    </p>
                                </a-card>
                            </a-col>
                        </a-row>
                    </div>
                </span>
            </s-table>
            <add-form ref="addForm" @ok="handleOk" />
            <edit-form ref="editForm" @ok="handleOk" />
        </a-card>
    </div>
</template>
<script>
    import { STable } from '@/components';
    import { wxAppPage, wxAppDelete } from '@/api/modular/mp/wxapp';
    import addForm from './addForm.vue';
    import editForm from './editForm.vue';
    export default {
        components: {
            STable,
            addForm,
            editForm,
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
                        title: '应用类型',
                        align: 'center',
                        dataIndex: 'appType',
                    },

                    {
                        title: '微信号名称',
                        align: 'center',
                        dataIndex: 'name',
                    },

                    {
                        title: '主体名称',
                        align: 'center',
                        dataIndex: 'principalName',
                    },

                    {
                        title: '是否已删除',
                        align: 'center',
                        dataIndex: 'isDeleted',
                    },
                ],
                tstyle: { 'padding-bottom': '0px', 'margin-bottom': '10px' },
                // 加载数据方法 必须为 Promise 对象
                loadData: (parameter) => {
                    return wxAppPage(Object.assign(parameter, this.queryParam)).then(
                        (res) => {
                            return res.data;
                        },
                    );
                },
                selectedRowKeys: [],
                selectedRows: [],
            };
        },
        created() {
            if (this.hasPerm('wxApp:edit') || this.hasPerm('wxApp:delete')) {
                this.columns.push({
                    title: '操作',
                    width: '150px',
                    dataIndex: 'action',
                    scopedSlots: { customRender: 'action' },
                });
            }
        },
        methods: {
            wxAppDelete(record) {
                wxAppDelete(record).then((res) => {
                    if (res.success) {
                        this.$message.success('删除成功');
                        this.$refs.table.refresh();
                    } else {
                        this.$message.error('删除失败'); // + res.message
                    }
                });
            },
            toggleAdvanced() {
                this.advanced = !this.advanced;
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
