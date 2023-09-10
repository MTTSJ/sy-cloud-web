<template>
    <a-modal
        title="信号定义"
        :visible="dialogVisible"
        width="700px"
        class="signal-modal"
        :closable="false"
        :mask-closable="false"
        :keyboard="false"
    >
        <a-button type="primary" icon="plus" @click="addRecord">新增</a-button>
        <a-form-model :model="formData" ref="xForm">
            <a-table
                :data-source="formData.signal"
                rowKey="_id"
                :pagination="false"
            >
                <a-table-column title="scope" :width="180">
                    <a-form-model-item
                        prop="scope"
                        slot="customRender"
                        slot-scope="record, row, index"
                        :rules="{message: '请选择 Scope', validator: (rule, val, callback) => checkEmpty(rule, record.scope, callback)}"
                    >
                        <a-select placeholder="请选择 Scope" allow-clear v-model="record.scope">
                            <a-select-option value="start">全局</a-select-option>
                            <a-select-option value="end">流程实例</a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-table-column>
                <a-table-column title="ID" :width="200">
                    <a-form-model-item
                        prop="id"
                        slot="customRender"
                        slot-scope="record, row, index"
                        :rules="{message: '请输入 id', validator: (rule, val, callback) => checkEmpty(rule, record.id, callback)}"
                    >
                        <a-input placeholder="请输入 id" v-model="record.id" />
                    </a-form-model-item>
                </a-table-column>
                <a-table-column title="名称">
                    <a-form-model-item
                        prop="name"
                        slot="customRender"
                        slot-scope="record, row, index"
                        :rules="{message: '请输入名称', validator: (rule, val, callback) => checkEmpty(rule, record.name, callback)}"
                    >
                        <a-input placeholder="请输入名称" v-model="record.name" />
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
    import mixinPanel from '../../../common/mixinPanel';
    export default {
        mixins: [mixinPanel],
        data() {
            return {
                dialogVisible: true,
                formData: {
                    signal: [],
                },
            };
        },
        computed: {
            formConfig() {
                //   const _this = this
                return {
                    inline: false,
                    item: [
                        {
                            xType: 'tabs',
                            tabs: [
                                {
                                    label: '信号定义',
                                    name: 'signal',
                                    column: [
                                        {
                                            label: 'scope',
                                            name: 'scope',
                                            width: 180,
                                            rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                                            xType: 'select',
                                            dic: [
                                                { label: '全局', value: 'start' },
                                                { label: '流程实例', value: 'end' },
                                            ],
                                        },
                                        {
                                            label: 'id',
                                            name: 'id',
                                            width: 200,
                                            rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
                                            xType: 'input',
                                        },
                                        {
                                            label: '名称',
                                            name: 'name',
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
        mounted() {
            this.formData.signal = this.element.businessObject.extensionElements?.values.map(item => {
      let type;
      if ('class' in item.$attrs) { type = 'class'; }
      if ('expression' in item.$attrs) { type = 'expression'; }
      if ('delegateExpression' in item.$attrs) { type = 'delegateExpression'; }
      return {
        event: item.$attrs.event,
        type: type,
        className: item.$attrs[type],
      };
            }) ?? [];
        },
        methods: {
            updateElement() {
                if (this.formData.signal?.length) {
                    let extensionElements = this.element.businessObject.get('extensionElements');
                    if (!extensionElements) {
                        extensionElements = this.modeler.get('moddle').create('bpmn:signal');
                    }
                    const length = extensionElements.get('values').length;
                    for (let i = 0; i < length; i++) {
                        // 清除旧值
                        extensionElements.get('values').pop();
                    }
                    this.updateProperties({ extensionElements: extensionElements });
                } else {
                    const extensionElements = this.element.businessObject[`extensionElements`];
                    if (extensionElements) {
                        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener');
                    }
                }
            },
            closeDialog() {
                this.$refs.xForm.validate(valid => {
                    if (valid) {
                        this.updateElement();
                        this.$emit('close');
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
                this.formData.signal.push({
                    _id: Math.random(),
                    scope: undefined,
                    id: undefined,
                    name: undefined,
                });
            },
            remove(record, index) {
                this.formData.signal.splice(index, 1);
            },
        },
    };
</script>

<style lang="less" scoped>
  .flow-containers  .el-badge__content.is-fixed {
      top: 18px;
  }
  .signal-modal {
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
