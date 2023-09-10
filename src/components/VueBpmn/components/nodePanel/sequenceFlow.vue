<template>
    <div class="seq-flow">
        <a-form-model
            :model="formData"
            ref="xForm"
            :label-col="{ span: 7 }"
            :wrapper-col="{ offset: 1, span: 16 }"
        >
            <a-form-model-item
                label="节点 id"
                prop="id"
                :rules="{required: true, message: 'Id 不能为空'}"
            >
                <a-input v-model="formData.id" />
            </a-form-model-item>
            <a-form-model-item
                label="节点名称"
                prop="name"
            >
                <a-input placeholder="请输入节点名称" v-model="formData.name" />
            </a-form-model-item>
            <a-form-model-item
                label="节点描述"
                prop="documentation"
            >
                <a-textarea placeholder="请输入节点描述" v-model="formData.documentation" />
            </a-form-model-item>
            <a-form-model-item
                label="执行监听器"
                prop="executionListener"
            >
                <a-badge class="edit-badge" :count="executionListenerLength" show-zero>
                    <a-button  @click="dialogName = 'executionListenerDialog'" >编辑</a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item
                label="跳转条件"
                prop="conditionExpression"
            >
                <a-input placeholder="请输入跳转条件" v-model="formData.conditionExpression" />
            </a-form-model-item>
            <a-form-model-item
                label="跳过表达式"
                prop="skipExpression"
            >
                <a-input placeholder="请输入跳过表达式" v-model="formData.skipExpression" />
            </a-form-model-item>
        </a-form-model>
        <executionListenerDialog
            v-if="dialogName === 'executionListenerDialog'"
            :element="element"
            :modeler="modeler"
            @close="finishExecutionListener"
        />
    </div>
</template>

<script>
    import mixinPanel from '../../common/mixinPanel';
    import mixinExecutionListener from '../../common/mixinExecutionListener';
    import { commonParse, conditionExpressionParse } from '../../common/parseElement';
    export default {
        mixins: [mixinPanel, mixinExecutionListener],
        data() {
            return {
                formData: {},
            };
        },
        computed: {
            formConfig() {
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
                            xType: 'input',
                            name: 'conditionExpression',
                            label: '跳转条件',
                        },
                        {
                            xType: 'input',
                            name: 'skipExpression',
                            label: '跳过表达式',
                        },
                    ],
                };
            },
        },
        watch: {
            'formData.conditionExpression': function(val) {
                if (val) {
                    const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val });
                    this.updateProperties({ conditionExpression: newCondition });
                } else {
                    this.updateProperties({ conditionExpression: null });
                }
            },
            'formData.skipExpression': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:skipExpression': val });
            },
        },
        created() {
            let cache = commonParse(this.element);
            cache = conditionExpressionParse(cache);
            this.formData = cache;
        },
    };
</script>

<style lang="less" scoped>
  .seq-flow {
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
