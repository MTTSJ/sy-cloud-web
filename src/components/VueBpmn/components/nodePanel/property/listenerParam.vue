<template>
    <a-modal
        class="param-modal"
        title="监听器参数"
        v-model="dialogVisible"
        :closable="false"
        :mask-closable="false"
        :keyboard="false"
        width="700px"
        @cancel="$emit('close', formData.paramList)"
    >
        <a-button type="primary" icon="plus" @click="addRecord">新增</a-button>
        <a-form-model :model="formData" ref="xForm" >
            <a-table
                :data-source="formData.paramList"
                rowKey="_id"
                :pagination="false"
            >
                <a-table-column title="类型" :width="180">
                    <a-form-model-item
                        slot="customRender"
                        prop="type"
                        slot-scope="record"
                        :rules="{message: '请选择类型', validator: (rule, val, callback) => checkEmpty(rule, record.type, callback)}"
                    >
                        <a-select placeholder="请选择类型" v-model="record.type">
                            <a-select-option value="stringValue">字符串</a-select-option>
                            <a-select-option value="expression">表达式</a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-table-column>
                <a-table-column title="名称" :width="180">
                    <a-form-model-item
                        slot="customRender"
                        prop="name"
                        slot-scope="record"
                        :rules="{message: '请输入名称', validator: (rule, val, callback) => checkEmpty(rule, record.name, callback)}"
                    >
                        <a-input placeholder="请输入名称" v-model="record.name" />
                    </a-form-model-item>
                </a-table-column>
                <a-table-column title="值">
                    <a-form-model-item
                        slot="customRender"
                        prop="value"
                        slot-scope="record"
                        :rules="{message: '请输入值', validator: (rule, val, callback) => checkEmpty(rule, record.value, callback)}"
                    >
                        <a-input placeholder="请输入值" v-model="record.value" />
                    </a-form-model-item>
                </a-table-column>
                <a-table-column title="操作">
                    <a-form-model-item
                        slot="customRender"
                        prop="value"
                        slot-scope="record, row, index"
                    >
                        <a-icon class="remove-icon" type="close-circle" @click="remove(record, index)" theme="filled" />
                    </a-form-model-item>
                </a-table-column>
            </a-table>
        </a-form-model>
        <span slot="footer" class="dialog-footer">
            <a-button type="primary" @click="closeDialog">确 定</a-button>
        </span>
    </a-modal>
</template>

<script>
    export default {
        components: { },
        props: {
            value: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                dialogVisible: true,
                formData: {
                    paramList: this.value,
                },
            };
        },
        computed: {
            formConfig() {
                return {
                    inline: false,
                    item: [
                        {
                            xType: 'tabs',
                            tabs: [
                                {
                                    label: '监听器参数',
                                    name: 'paramList',
                                    column: [
                                        {
                                            label: '类型',
                                            name: 'type',
                                            width: 180,
                                            rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                                            xType: 'select',
                                            dic: [
                                                { label: '字符串', value: 'stringValue' },
                                                { label: '表达式', value: 'expression' },
                                            ],
                                        },
                                        {
                                            label: '名称',
                                            name: 'name',
                                            width: 180,
                                            rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                                            xType: 'input',
                                        },
                                        {
                                            label: '值',
                                            name: 'value',
                                            xType: 'input',
                                            rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                };
            },
        },
        methods: {
            closeDialog() {
                this.$refs.xForm.validate(valid => {
                    if (valid) {
                        // this.dialogVisible = false;
                        this.$emit('close', this.formData.paramList);
                    }
                });
            },
            checkEmpty(rule, val, callback) {
                if (val === undefined || val === null || val === '') {
                    callback(new Error(rule.message));
                    return;
                }
                callback();
            },
            addRecord() {
                this.formData.paramList.push({
                    _id: Math.random(),
                    type: undefined,
                    name: undefined,
                    value: undefined,
                });
            },
            remove(record, index) {
                this.formData.paramList.splice(index, 1);
            },
        },
    };
</script>

<style lang="less" scoped>
.flow-containers  .el-badge__content.is-fixed {
    top: 18px;
}
.param-modal {
  ::v-deep {
    .ant-btn {
      margin-right: 0;
    }
    .ant-form-item {
      height: 59px;
      margin-bottom: -16px;
    }
    .remove-icon {
      font-size: 18px;
      color: #f5222d;
    }
  }
}
</style>
