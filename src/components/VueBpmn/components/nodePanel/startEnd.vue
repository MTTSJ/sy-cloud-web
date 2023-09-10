<template>
    <div class="start-end">
        <a-form-model
            ref="xForm"
            :model="formData"
            :label-col="{ span: 7 }"
            :wrapper-col="{ offset: 1, span: 16 }"
        >
            <a-form-model-item
                prop="id"
                label="节点 id"
                :rules="{required: true, message: 'Id 不能为空'}"
            >
                <a-input placeholder="请输入节点ID" v-model="formData.id" />
            </a-form-model-item>
            <a-form-model-item
                prop="name"
                label="节点名称"
            >
                <a-input placeholder="请输入节点名称" v-model="formData.name" />
            </a-form-model-item>
            <a-form-model-item
                prop="name"
                label="节点描述"
            >
                <a-textarea placeholder="请输入节点描述" v-model="formData.documentation" />
            </a-form-model-item>
            <a-form-model-item
                prop="executionListener"
                label="执行监听器"
            >
                <a-badge class="edit-badge" :count="executionListenerLength" show-zero>
                    <a-button @click="dialogName = 'executionListenerDialog'" >编辑</a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item
                v-if="showConfig.initiator"
                prop="initiator"
                label="发起人"
            >
                <a-input placeholder="请输入发起人"  v-model="formData.initiator" />
            </a-form-model-item>
            <a-form-model-item
                v-if="showConfig.formKey"
                prop="formKey"
                label="表单标识key"
            >
                <a-input placeholder="请输入表单标识key" v-model="formData.formKey" />
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
    import { commonParse } from '../../common/parseElement';
    export default {
        mixins: [mixinPanel, mixinExecutionListener],
        data() {
            return {
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
                            xType: 'input',
                            name: 'initiator',
                            label: '发起人',
                            show: !!_this.showConfig.initiator,
                        },
                        {
                            xType: 'input',
                            name: 'formKey',
                            label: '表单标识key',
                            show: !!_this.showConfig.formKey,
                        },
                    ],
                };
            },
        },
        watch: {
            'formData.initiator': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:initiator': val });
            },
            'formData.formKey': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:formKey': val });
            },
        },
        created() {
            this.formData = commonParse(this.element);
        },
    };
</script>

<style scoped lang="less">
  .start-end {
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
