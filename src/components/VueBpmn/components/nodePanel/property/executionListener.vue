<template>
    <div class="execution-listener">
        <a-modal
            class="execution-listener-modal"
            title="执行监听器"
            v-model="dialogVisible"
            width="900px"
            :closable="false"
            :mask-closable="false"
            :keyboard="false"
        >
            <a-button type="primary" icon="plus" @click="addRecord">新增</a-button>
            <a-form-model
                ref="xForm"
                :model="formData"
            >
                <a-table
                    rowKey="_id"
                    :pagination="false"
                    :data-source="formData.executionListener"
                >
                    <a-table-column title="事件" :width="160">
                        <a-form-model-item
                            slot="customRender"
                            slot-scope="record"
                            prop="event"
                            :rules="{
                                message: '请选择事件',
                                validator: (rule, val, callback) => checkEmpty(rule, record.event, callback)
                            }"
                        >
                            <a-select placeholder="请选择事件" v-model="record.event">
                                <a-select-option value="start">start</a-select-option>
                                <a-select-option value="end">end</a-select-option>
                                <a-select-option value="take">take</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-table-column>
                    <a-table-column :width="160">
                        <div slot="title">
                            <span>类型</span>
                            <a-tooltip>
                                <template slot="title">
                                    类：示例 com.company.MyCustomListener，自定义类必须实现 org.flowable.engine.delegate.TaskListener 接口 <br />
                                    表达式：示例 ${myObject.callMethod(task, task.eventName)} <br />
                                    委托表达式：示例 ${myListenerSpringBean} ，该 springBean 需要实现 org.flowable.engine.delegate.TaskListener 接口
                                </template>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                        </div>
                        <a-form-model-item
                            slot="customRender"
                            slot-scope="record"
                            prop="type"
                            :rules="{
                                message: '请选择类型',
                                validator: (rule, val, callback) => checkEmpty(rule, record.type, callback)
                            }"
                        >
                            <a-select placeholder="请选择类型" v-model="record.type">
                                <a-select-option value="class">类</a-select-option>
                                <a-select-option value="expression">表达式</a-select-option>
                                <a-select-option value="delegateExpression">委托表达式</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-table-column>
                    <a-table-column title="java 类名 / 表达式" >
                        <a-form-model-item
                            slot="customRender"
                            slot-scope="record"
                            prop="className"
                            :rules="{
                                message: '请输入 java 类名或表达式',
                                validator: (rule, val, callback) => checkEmpty(rule, record.className, callback)
                            }"
                        >
                            <a-input placeholder="请输入 java 类名或表达式" v-model="record.className" />
                        </a-form-model-item>
                    </a-table-column>
                    <a-table-column title="参数" align="center"  :width="120">
                        <a-form-model-item
                            prop="params"
                            slot="customRender"
                            slot-scope="record, row, index"
                        >
                            <a-badge show-zero :count="record.params ? record.params.length : 0">
                                <a-button size="small" @click="configParam(index)">配置</a-button>
                            </a-badge>
                        </a-form-model-item>
                    </a-table-column>
                    <a-table-column title="操作" align="center" :width="80">
                        <a-form-model-item
                            slot="customRender"
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
        <listenerParam
            v-if="showParamDialog"
            :value="formData.executionListener[nowIndex].params"
            @close="finishConfigParam"
        />
    </div>
</template>

<script>
    import mixinPanel from '../../../common/mixinPanel';
    import listenerParam from './listenerParam';
    export default {
        components: { listenerParam },
        mixins: [mixinPanel],
        data() {
            return {
                dialogVisible: true,
                showParamDialog: false,
                paramsVisible: false,
                nowIndex: null,
                formData: {
                    executionListener: [],
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
                                    label: '执行监听器',
                                    name: 'executionListener',
                                    column: [
                                        {
                                            label: '事件',
                                            name: 'event',
                                            width: 180,
                                            rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                                            xType: 'select',
                                            dic: [
                                                { label: 'start', value: 'start' },
                                                { label: 'end', value: 'end' },
                                                { label: 'take', value: 'take' },
                                            ],
                                        },
                                        {
                                            label: '类型',
                                            name: 'type',
                                            width: 180,
                                            rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                                            xType: 'select',
                                            dic: [
                                                { label: '类', value: 'class' },
                                                { label: '表达式', value: 'expression' },
                                                { label: '委托表达式', value: 'delegateExpression' },
                                            ],
                                            tooltip: `类：示例 com.company.MyCustomListener，自定义类必须实现 org.flowable.engine.delegate.TaskListener 接口 <br />
                              表达式：示例 \${myObject.callMethod(task, task.eventName)} <br />
                              委托表达式：示例 \${myListenerSpringBean} ，该 springBean 需要实现 org.flowable.engine.delegate.TaskListener 接口
                    `,
                                        },
                                        {
                                            label: 'java 类名',
                                            name: 'className',
                                            xType: 'input',
                                            rules: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
                                        },
                                        {
                                            xType: 'slot',
                                            label: '参数',
                                            width: 120,
                                            slot: true,
                                            name: 'params',
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
            this.formData.executionListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:ExecutionListener')
      .map(item => {
        let type;
        if ('class' in item) type = 'class';
        if ('expression' in item) type = 'expression';
        if ('delegateExpression' in item) type = 'delegateExpression';
        return {
          event: item.event,
          type: type,
          className: item[type],
          params: item.fields?.map(field => {
            let fieldType;
            if ('stringValue' in field) fieldType = 'stringValue';
            if ('expression' in field) fieldType = 'expression';
            return {
              name: field.name,
              type: fieldType,
              value: field[fieldType],
            };
          }) ?? [],
        };
            }) ?? [];
        },
        methods: {
            checkEmpty(rule, val, callback) {
                if (val === undefined || val === null || val === '') {
                    callback(new Error(rule.message));
                    return;
                }
                callback();
            },
            addRecord() {
                this.formData.executionListener.push({
                    _id: Math.random(),
                    event: undefined,
                    type: undefined,
                    className: undefined,
                    params: [],
                });
            },
            remove(record, index) {
                this.formData.executionListener.splice(index, 1);
            },
            configParam(index) {
                this.nowIndex = index;
                const nowObj = this.formData.executionListener[index];
                if (!nowObj.params) {
                    nowObj.params = [];
                }
                this.showParamDialog = true;
            },
            finishConfigParam(param) {
                this.showParamDialog = false;
                // hack 数量不更新问题
                const cache = this.formData.executionListener[this.nowIndex];
                cache.params = param;
                this.$set(this.formData.executionListener[this.nowIndex], this.nowIndex, cache);
                this.nowIndex = null;
            },
            updateElement() {
                if (this.formData.executionListener?.length) {
                    let extensionElements = this.element.businessObject.get('extensionElements');
                    if (!extensionElements) {
                        extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements');
                    }
                    // 清除旧值
                    extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? [];
                    this.formData.executionListener.forEach(item => {
                        const executionListener = this.modeler.get('moddle').create('flowable:ExecutionListener');
                        executionListener['event'] = item.event;
                        executionListener[item.type] = item.className;
                        if (item.params && item.params.length) {
                            item.params.forEach(field => {
                                const fieldElement = this.modeler.get('moddle').create('flowable:Field');
                                fieldElement['name'] = field.name;
                                fieldElement[field.type] = field.value;
                                // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
                                // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
                                // fieldElement[field.type] = valueElement
                                executionListener.get('fields').push(fieldElement);
                            });
                        }
                        extensionElements.get('values').push(executionListener);
                    });
                    this.updateProperties({ extensionElements: extensionElements });
                } else {
                    const extensionElements = this.element.businessObject[`extensionElements`];
                    if (extensionElements) {
                        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener') ?? [];
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
                // this.$refs.xForm.validate().then(() => {
                //
                //   this.dialogVisible = false;
                // }).catch(e => console.error(e));
            },
        },
    };
</script>

<style scoped lang="less">
  .flow-containers  .el-badge__content.is-fixed {
      top: 18px;
  }
  .execution-listener-modal {
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
