<template>
    <div class="task">
        <a-form-model
            ref="xForm"
            :model="formData"
            :label-col="{ span: 7 }"
            :wrapper-col="{ offset: 1, span: 16 }"
        >
            <a-form-model-item
                prop="id"
                label="节点 id"
                :rules="{ required: true, message: 'Id 不能为空' }"
            >
                <a-input placeholder="请输入节点ID" v-model="formData.id" />
            </a-form-model-item>
            <a-form-model-item prop="name" label="节点名称">
                <a-input placeholder="请输入节点名称" v-model="formData.name" />
            </a-form-model-item>
            <a-form-model-item prop="documentation" label="节点描述">
                <a-input
                    placeholder="请输入节点描述"
                    v-model="formData.documentation"
                />
            </a-form-model-item>
            <a-form-model-item prop="executionListener" label="执行监听器">
                <a-badge show-zero class="edit-badge" :count="executionListenerLength">
                    <a-button @click="dialogName = 'executionListenerDialog'">
                        编辑
                    </a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item
                prop="taskListener"
                label="任务监听器"
                v-if="showConfig.taskListener"
            >
                <a-badge show-zero class="edit-badge" :count="taskListenerLength">
                    <a-button @click="dialogName = 'taskListenerDialog'">编辑</a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item
                prop="userType"
                label="人员类型"
                v-if="showConfig.userType"
            >
                <a-select placeholder="请选择人员类型" v-model="formData.userType">
                    <a-select-option
                        v-for="(item, i) in userTypeOption"
                        :key="i"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                prop="assignee"
                label="指定人员"
                v-if="showConfig.assignee && formData.userType === 'assignee'"
            >
                <a-select
                    mode="tags"
                    placeholder="选择人员"
                    @select="onPeopleSelect"
                    @deselect="onPeopleDeselect"
                    :value="formData.assignee"
                    option-filter-prop="children"
                    :filter-option="true"
                >
                    <a-select-option v-for="(item, i) in users" :key="i" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                prop="candidateUsers"
                label="候选人员"
                v-if="
                    showConfig.candidateUsers && formData.userType === 'candidateUsers'
                "
            >
                <a-select
                    placeholder="选择候选人员"
                    mode="multiple"
                    v-model="formData.candidateUsers"
                    option-filter-prop="children"
                    :filter-option="true"
                >
                    <a-select-option v-for="(item, i) in users" :key="i" :value="item.id">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                prop="candidateGroups"
                label="候选人员"
                v-if="
                    showConfig.candidateGroups && formData.userType === 'candidateGroups'
                "
            >
                <a-select
                    placeholder="选择候选人员"
                    mode="multiple"
                    v-model="formData.candidateGroups"
                    option-filter-prop="children"
                    :filter-option="true"
                >
                    <a-select-option
                        v-for="(item, i) in groups"
                        :key="i"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item prop="multiInstance" label="多实例">
                <a-badge :dot="true">
                    <a-button @click="dialogName = 'multiInstanceDialog'">编辑</a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item prop="async" label="异步" v-if="showConfig.async">
                <a-switch size="small" v-model="formData.async" />
            </a-form-model-item>
            <a-form-model-item
                prop="priority"
                label="优先级"
                v-if="showConfig.priority"
            >
                <a-input placeholder="请输入优先级" v-model="formData.priority" />
            </a-form-model-item>
            <a-form-model-item
                prop="formKey"
                label="表单key"
                v-if="showConfig.formKey"
            >
                <a-input placeholder="请输入表单标识key" v-model="formData.formKey" />
            </a-form-model-item>
            <a-form-model-item
                prop="skipExpression"
                label="跳过表达式"
                v-if="showConfig.skipExpression"
            >
                <a-input
                    placeholder="请输入跳过表达式"
                    v-model="formData.skipExpression"
                />
            </a-form-model-item>
            <a-form-model-item
                prop="isForCompensation"
                label="是否为补偿"
                v-if="showConfig.isForCompensation"
            >
                <a-switch size="small" v-model="formData.isForCompensation" />
            </a-form-model-item>
            <a-form-model-item
                prop="triggerable"
                label="任务可触发"
                v-if="showConfig.triggerable"
            >
                <a-switch size="small" v-model="formData.triggerable" />
            </a-form-model-item>
            <a-form-model-item
                prop="autoStoreVariables"
                label="自动存储变量"
                v-if="showConfig.autoStoreVariables"
            >
                <a-switch size="small" v-model="formData.autoStoreVariables" />
            </a-form-model-item>
            <a-form-model-item
                prop="ruleVariablesInput"
                label="输入变量"
                v-if="showConfig.ruleVariablesInput"
            >
                <a-input
                    placeholder="请输入变量"
                    v-model="formData.ruleVariablesInput"
                />
            </a-form-model-item>
            <a-form-model-item prop="rules" label="规则" v-if="showConfig.rules">
                <a-input placeholder="请输入规则" v-model="formData.rules" />
            </a-form-model-item>
            <a-form-model-item
                prop="resultVariable"
                label="输入变量"
                v-if="showConfig.resultVariable"
            >
                <a-input
                    placeholder="请输入结果变量"
                    v-model="formData.resultVariable"
                />
            </a-form-model-item>
            <a-form-model-item prop="exclude" label="排除" v-if="showConfig.exclude">
                <a-switch size="small" v-model="formData.exclude" />
            </a-form-model-item>
            <a-form-model-item prop="class" label="类" v-if="showConfig.class">
                <a-input placeholder="请输入类" v-model="formData.class" />
            </a-form-model-item>
            <a-form-model-item
                prop="dueDate"
                label="到期时间"
                v-if="showConfig.dueDate"
            >
                <a-date-picker
                    style="min-width: 160px; width: 173px"
                    show-time
                    format="YYYY/MM/DD HH:mm:ss"
                    placeholder="请选择到期时间"
                    v-model="formData.dueDate"
                />
            </a-form-model-item>
        </a-form-model>
        <executionListenerDialog
            v-if="dialogName === 'executionListenerDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishExecutionListener"
        />
        <taskListenerDialog
            v-if="dialogName === 'taskListenerDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishTaskListener"
        />
        <multiInstanceDialog
            v-if="dialogName === 'multiInstanceDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishMultiInstance"
        />
    </div>
</template>

<script>
    import mixinPanel from '../../common/mixinPanel';
    import executionListenerDialog from './property/executionListener';
    import taskListenerDialog from './property/taskListener';
    import multiInstanceDialog from './property/multiInstance';
    import { commonParse, userTaskParse } from '../../common/parseElement';
    export default {
        components: {
            executionListenerDialog,
            taskListenerDialog,
            multiInstanceDialog,
        },
        mixins: [mixinPanel],
        props: {
            users: {
                type: Array,
                required: true,
            },
            groups: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                userTypeOption: [
                    { label: '指定人员', value: 'assignee' },
                    { label: '候选人员', value: 'candidateUsers' },
                    { label: '候选组', value: 'candidateGroups' },
                ],
                dialogName: '',
                executionListenerLength: 0,
                taskListenerLength: 0,
                hasMultiInstance: false,
                formData: {},
            };
        },
        computed: {
            formConfig() {
                const _this = this;
                return {
                    inline: false,
                    item: [
                        {
                            xType: 'input',
                            name: 'id',
                            label: '节点 id',
                            rules: [{ required: true, message: 'Id 不能为空' }],
                        },
                        {
                            xType: 'input',
                            name: 'name',
                            label: '节点名称',
                        },
                        {
                            xType: 'input',
                            name: 'documentation',
                            label: '节点描述',
                        },
                        {
                            xType: 'slot',
                            name: 'executionListener',
                            label: '执行监听器',
                        },
                        {
                            xType: 'slot',
                            name: 'taskListener',
                            label: '任务监听器',
                            show: !!_this.showConfig.taskListener,
                        },
                        {
                            xType: 'select',
                            name: 'userType',
                            label: '人员类型',
                            dic: _this.userTypeOption,
                            show: !!_this.showConfig.userType,
                        },
                        {
                            xType: 'select',
                            name: 'assignee',
                            label: '指定人员',
                            allowCreate: true,
                            filterable: true,
                            dic: { data: _this.users, label: 'name', value: 'id' },
                            show:
                                !!_this.showConfig.assignee &&
                                _this.formData.userType === 'assignee',
                        },
                        {
                            xType: 'select',
                            name: 'candidateUsers',
                            label: '候选人员',
                            multiple: true,
                            allowCreate: true,
                            filterable: true,
                            dic: { data: _this.users, label: 'name', value: 'id' },
                            show:
                                !!_this.showConfig.candidateUsers &&
                                _this.formData.userType === 'candidateUsers',
                        },
                        {
                            xType: 'select',
                            name: 'candidateGroups',
                            label: '候选组',
                            multiple: true,
                            allowCreate: true,
                            filterable: true,
                            dic: { data: _this.groups, label: 'name', value: 'id' },
                            show:
                                !!_this.showConfig.candidateGroups &&
                                _this.formData.userType === 'candidateGroups',
                        },
                        {
                            xType: 'slot',
                            name: 'multiInstance',
                            label: '多实例',
                        },
                        {
                            xType: 'switch',
                            name: 'async',
                            label: '异步',
                            activeText: '是',
                            inactiveText: '否',
                            show: !!_this.showConfig.async,
                        },
                        {
                            xType: 'input',
                            name: 'priority',
                            label: '优先级',
                            show: !!_this.showConfig.priority,
                        },
                        {
                            xType: 'input',
                            name: 'formKey',
                            label: '表单标识key',
                            show: !!_this.showConfig.formKey,
                        },
                        {
                            xType: 'input',
                            name: 'skipExpression',
                            label: '跳过表达式',
                            show: !!_this.showConfig.skipExpression,
                        },
                        {
                            xType: 'switch',
                            name: 'isForCompensation',
                            label: '是否为补偿',
                            activeText: '是',
                            inactiveText: '否',
                            show: !!_this.showConfig.isForCompensation,
                        },
                        {
                            xType: 'switch',
                            name: 'triggerable',
                            label: '服务任务可触发',
                            activeText: '是',
                            inactiveText: '否',
                            show: !!_this.showConfig.triggerable,
                        },
                        {
                            xType: 'switch',
                            name: 'autoStoreVariables',
                            label: '自动存储变量',
                            activeText: '是',
                            inactiveText: '否',
                            show: !!_this.showConfig.autoStoreVariables,
                        },
                        {
                            xType: 'input',
                            name: 'ruleVariablesInput',
                            label: '输入变量',
                            show: !!_this.showConfig.ruleVariablesInput,
                        },
                        {
                            xType: 'input',
                            name: 'rules',
                            label: '规则',
                            show: !!_this.showConfig.rules,
                        },
                        {
                            xType: 'input',
                            name: 'resultVariable',
                            label: '结果变量',
                            show: !!_this.showConfig.resultVariable,
                        },
                        {
                            xType: 'switch',
                            name: 'exclude',
                            label: '排除',
                            activeText: '是',
                            inactiveText: '否',
                            show: !!_this.showConfig.exclude,
                        },
                        {
                            xType: 'input',
                            name: 'class',
                            label: '类',
                            show: !!_this.showConfig.class,
                        },
                        {
                            xType: 'datePicker',
                            type: 'datetime',
                            name: 'dueDate',
                            label: '到期时间',
                            show: !!_this.showConfig.dueDate,
                        },
                    ],
                };
            },
        },
        watch: {
            'formData.userType': function(val, oldVal) {
                if (oldVal) {
                    const types = ['assignee', 'candidateUsers', 'candidateGroups'];
                    types.forEach((type) => {
                        delete this.element.businessObject.$attrs[`flowable:${type}`];
                        delete this.formData[type];
                    });
                }
            },
            'formData.assignee': function(val) {
                if (this.formData.userType !== 'assignee') {
                    delete this.element.businessObject.$attrs[`flowable:assignee`];
                    return;
                }
                this.updateProperties({ 'flowable:assignee': val });
            },
            'formData.candidateUsers': function(val) {
                if (this.formData.userType !== 'candidateUsers') {
                    delete this.element.businessObject.$attrs[`flowable:candidateUsers`];
                    return;
                }
                this.updateProperties({ 'flowable:candidateUsers': val?.join(',') });
            },
            'formData.candidateGroups': function(val) {
                if (this.formData.userType !== 'candidateGroups') {
                    delete this.element.businessObject.$attrs[`flowable:candidateGroups`];
                    return;
                }
                this.updateProperties({ 'flowable:candidateGroups': val?.join(',') });
            },
            'formData.async': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:async': true });
            },
            'formData.dueDate': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:dueDate': val });
            },
            'formData.formKey': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:formKey': val });
            },
            'formData.priority': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:priority': val });
            },
            'formData.skipExpression': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:skipExpression': val });
            },
            'formData.isForCompensation': function(val) {
                if (val === '') val = null;
                this.updateProperties({ isForCompensation: val });
            },
            'formData.triggerable': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:triggerable': val });
            },
            'formData.class': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:class': val });
            },
            'formData.autoStoreVariables': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:autoStoreVariables': val });
            },
            'formData.exclude': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:exclude': val });
            },
            'formData.ruleVariablesInput': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:ruleVariablesInput': val });
            },
            'formData.rules': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:rules': val });
            },
            'formData.resultVariable': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:resultVariable': val });
            },
        },
        created() {
            let cache = commonParse(this.element);
            cache = userTaskParse(cache);
            this.formData = cache;
            this.computedExecutionListenerLength();
            this.computedTaskListenerLength();
            this.computedHasMultiInstance();
        },
        methods: {
            onPeopleSelect(value) {
                this.formData.assignee = value;
            },
            onPeopleDeselect() {
                this.formData.assignee = undefined;
            },
            computedExecutionListenerLength() {
                this.executionListenerLength =
        this.element.businessObject.extensionElements?.values?.filter(
          (item) => item.$type === 'flowable:ExecutionListener',
                ).length ?? 0;
            },
            computedTaskListenerLength() {
                this.taskListenerLength =
        this.element.businessObject.extensionElements?.values?.filter(
          (item) => item.$type === 'flowable:TaskListener',
                ).length ?? 0;
            },
            computedHasMultiInstance() {
                if (this.element.businessObject.loopCharacteristics) {
                    this.hasMultiInstance = true;
                } else {
                    this.hasMultiInstance = false;
                }
            },
            finishExecutionListener() {
                if (this.dialogName === 'executionListenerDialog') {
                    this.computedExecutionListenerLength();
                }
                this.dialogName = '';
            },
            finishTaskListener() {
                if (this.dialogName === 'taskListenerDialog') {
                    this.computedTaskListenerLength();
                }
                this.dialogName = '';
            },
            finishMultiInstance() {
                if (this.dialogName === 'multiInstanceDialog') {
                    this.computedHasMultiInstance();
                }
                this.dialogName = '';
            },
        },
    };
</script>

<style lang="less" scoped>
.task {
  ::v-deep {
    .ant-btn {
      margin-right: 0;
    }
    .ant-form-item {
      margin-bottom: 8px;
    }
    .ant-calendar-picker-input.ant-input {
      font-size: 13px;
      padding: 4px 6px;
    }
    .ant-calendar-picker-icon {
      font-size: 13px;
    }
  }
}
</style>
