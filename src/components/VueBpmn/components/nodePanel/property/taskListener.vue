<template>
    <div>
        <a-modal
            title="任务监听器"
            :visible="dialogVisible"
            width="900px"
            class="task-listener-modal"
            :closable="false"
            :mask-closable="false"
            :keyboard="false"
        >
            <a-button type="primary" icon="plus" @click="addRecord">新增</a-button>
            <a-form-model
                :model="formData"
                ref="xForm"
            >
                <a-table
                    rowKey="_id"
                    :data-source="formData.taskListener"
                    :pagination="false"
                >
                    <a-table-column :width="180">
                        <div slot="title">
                            <span>事件</span>
                            <a-tooltip>
                                <template slot="title">
                                    create（创建）：当任务已经创建，并且所有任务参数都已经设置时触发。<br />
                                    assignment（指派）：当任务已经指派给某人时触发。请注意：当流程执行到达用户任务时，在触发create事件之前，会首先触发assignment事件。<br />
                                    complete（完成）：当任务已经完成，从运行时数据中删除前触发。<br />
                                    delete（删除）：在任务即将被删除前触发。请注意任务由completeTask正常完成时也会触发。
                                </template>
                                <a-icon type="question-circle" />
                            </a-tooltip>
                        </div>
                        <a-form-model-item
                            prop="event"
                            slot="customRender"
                            slot-scope="record"
                            :rules="{message: '请选择事件', validator: (rule, val, callback) => checkEmpty(rule, record.event, callback)}"
                        >
                            <a-select placeholder="请选择事件" v-model="record.event">
                                <a-select-option value="create">create</a-select-option>
                                <a-select-option value="assignment">assignment</a-select-option>
                                <a-select-option value="complete">complete</a-select-option>
                                <a-select-option value="delete">delete</a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </a-table-column>
                    <a-table-column title="类型" :width="180">
                        <a-form-model-item
                            prop="type"
                            slot="customRender"
                            slot-scope="record"
                            :rules="{message: '请选择类型', validator: (rule, val, callback) => checkEmpty(rule, record.type, callback)}"
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
                            :rules="{ message: '请输入 java 类名或表达式', validator: (rule, val, callback) => checkEmpty(rule, record.className, callback)}"
                        >
                            <a-input placeholder="请输入 java 类名或表达式" v-model="record.className"/>
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
        <listenerParam v-if="showParamDialog" :value="formData.taskListener[nowIndex].params" @close="finishConfigParam" />
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
                nowIndex: null,
                formData: {
                    taskListener: [],
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
                                    label: '任务监听器',
                                    name: 'taskListener',
                                    column: [
                                        {
                                            label: '事件',
                                            name: 'event',
                                            width: 180,
                                            rules: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
                                            xType: 'select',
                                            dic: [
                                                { label: 'create', value: 'create' },
                                                { label: 'assignment', value: 'assignment' },
                                                { label: 'complete', value: 'complete' },
                                                { label: 'delete', value: 'delete' },
                                            ],
                                            tooltip: `create（创建）：当任务已经创建，并且所有任务参数都已经设置时触发。<br />
                              assignment（指派）：当任务已经指派给某人时触发。请注意：当流程执行到达用户任务时，在触发create事件之前，会首先触发assignment事件。<br />
                              complete（完成）：当任务已经完成，从运行时数据中删除前触发。<br />
                              delete（删除）：在任务即将被删除前触发。请注意任务由completeTask正常完成时也会触发。
                    `,
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
            this.formData.taskListener = this.element.businessObject.extensionElements?.values
      .filter(item => item.$type === 'flowable:TaskListener')
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
            configParam(index) {
                this.nowIndex = index;
                const nowObj = this.formData.taskListener[index];
                if (!nowObj.params) {
                    nowObj.params = [];
                }
                this.showParamDialog = true;
            },
            finishConfigParam(param) {
                this.showParamDialog = false;
                // hack 数量不更新问题
                const cache = this.formData.taskListener[this.nowIndex];
                cache.params = param;
                this.$set(this.formData.taskListener[this.nowIndex], this.nowIndex, cache);
                this.nowIndex = null;
            },
            updateElement() {
                if (this.formData.taskListener?.length) {
                    let extensionElements = this.element.businessObject.get('extensionElements');
                    if (!extensionElements) {
                        extensionElements = this.modeler.get('moddle').create('bpmn:ExtensionElements');
                    }
                    // 清除旧值
                    extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? [];
                    this.formData.taskListener.forEach(item => {
                        const taskListener = this.modeler.get('moddle').create('flowable:TaskListener');
                        taskListener['event'] = item.event;
                        taskListener[item.type] = item.className;
                        if (item.params && item.params.length) {
                            item.params.forEach(field => {
                                const fieldElement = this.modeler.get('moddle').create('flowable:Field');
                                fieldElement['name'] = field.name;
                                fieldElement[field.type] = field.value;
                                // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
                                // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
                                // fieldElement[field.type] = valueElement
                                taskListener.get('fields').push(fieldElement);
                            });
                        }
                        extensionElements.get('values').push(taskListener);
                    });
                    this.updateProperties({ extensionElements: extensionElements });
                } else {
                    const extensionElements = this.element.businessObject[`extensionElements`];
                    if (extensionElements) {
                        extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:TaskListener') ?? [];
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
                this.formData.taskListener.push({
                    _id: Math.random(),
                    event: undefined,
                    type: undefined,
                    className: undefined,
                    params: [],
                });
            },
            remove(record, index) {
                this.formData.taskListener.splice(index, 1);
            },
        },
    };
</script>

<style scoped lang="less">
  .flow-containers  .el-badge__content.is-fixed {
      top: 18px;
  }
  .task-listener-modal {
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
