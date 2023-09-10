<template>
    <div class="process-panel">
        <a-form-model
            :model="formData"
            ref="xForm"
            :label-col="{ span: 7 }"
            :wrapper-col="{ offset: 1, span: 16 }"
        >
            <a-form-model-item
                label="流程分类"
                prop="processCategory"
            >
                <a-select
                    style="width: 100%"
                    placeholder="请选择流程分类"
                    v-model="formData.processCategory"
                >
                    <a-select-option
                        v-for="(item, index) in categorys"
                        :key="index"
                        :value="item.code"
                    >
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </a-form-model-item>
            <a-form-model-item
                label="流程标识"
                prop="id"
                :rules="[{ required: true, message: 'Id 不能为空！' }]"
            >
                <a-input placeholder="请输入流程标识" v-model="formData.id"/>
            </a-form-model-item>
            <a-form-model-item
                label="流程名称"
                prop="name"
            >
                <a-input placeholder="请输入流程名称" v-model="formData.name"/>
            </a-form-model-item>
            <a-form-model-item
                label="节点描述"
                prop="documentation"
            >
                <a-textarea :rows="2" placeholder="请输入节点描述" v-model="formData.documentation"/>
            </a-form-model-item>
            <a-form-model-item
                label="执行监听器"
                prop="executionListener"
            >
                <a-badge class="edit-badge" :count="executionListenerLength" show-zero>
                    <a-button @click="dialogName = 'executionListenerDialog'">编辑</a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item
                label="信号定义"
                prop="signal"
            >
                <a-badge class="edit-badge" :count="signalLength" show-zero>
                    <a-button @click="dialogName = 'signalDialog'">编辑</a-button>
                </a-badge>
            </a-form-model-item>
        </a-form-model>
        <executionListenerDialog
            v-if="dialogName === 'executionListenerDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishExecutionListener"
        />
        <signalDialog
            v-if="dialogName === 'signalDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishSignal"
        />
    </div>
</template>

<script>
    import mixinPanel from '../../common/mixinPanel';
    import mixinExecutionListener from '../../common/mixinExecutionListener';
    import signalDialog from './property/signal';
    import { commonParse } from '../../common/parseElement';
    export default {
        components: {
            signalDialog,
        },
        mixins: [mixinPanel, mixinExecutionListener],
        data() {
            return {
                signalLength: 0,
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
                            xType: 'select',
                            name: 'processCategory',
                            label: '流程分类',
                            dic: { data: _this.categorys, label: 'name', value: 'id' },
                        },
                        {
                            xType: 'input',
                            name: 'id',
                            label: '流程标识key',
                            rules: [{ required: true, message: 'Id 不能为空' }],
                        },
                        {
                            xType: 'input',
                            name: 'name',
                            label: '流程名称',
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
                            name: 'signal',
                            label: '信号定义',
                        },
                    ],
                };
            },
        },
        watch: {
            'formData.processCategory': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:processCategory': val });
            },
        },
        created() {
            this.formData = commonParse(this.element);
        },
        methods: {
            computedSignalLength() {
                this.signalLength =
                this.element.businessObject.extensionElements?.values?.length ?? 0;
            },
            finishSignal() {
                if (this.dialogName === 'signalDialog') {
                    this.computedSignalLength();
                }
                this.dialogName = '';
            },
        },
    };
</script>

<style lang="less" scoped>
  .process-panel {
    .edit-badge {
    }
    ::v-deep {
      .ant-btn {
        margin-right: 0;
      }
      .ant-form-item {
        margin-bottom: 8px;
      }
    }
  }
</style>
