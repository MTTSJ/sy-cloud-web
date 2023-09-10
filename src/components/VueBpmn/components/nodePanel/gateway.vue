<template>
    <div class="gateway">
        <a-form-model
            :model="formData"
            ref="xForm"
            :label-col="{ span: 7 }"
            :wrapper-col="{ offset: 1, span: 16 }"
        >
            <a-form-model-item
                prop="id"
                label="节点 id"
                :rules="[{ required: true, message: 'Id 不能为空' }]"
            >
                <a-input placeholder="请输入节点id" v-model="formData.id" />
            </a-form-model-item>
            <a-form-model-item
                prop="name"
                label="节点名称"
            >
                <a-input placeholder="请输入节点名称" v-model="formData.name" />
            </a-form-model-item>
            <a-form-model-item
                prop="documentation"
                label="节点描述"
            >
                <a-input placeholder="请输入节点描述" v-model="formData.documentation" />
            </a-form-model-item>
            <a-form-model-item
                prop="executionListener"
                label="执行监听器"
            >
                <a-badge show-zero class="edit-badge" :count="executionListenerLength">
                    <a-button @click="dialogName = 'executionListenerDialog'">编辑</a-button>
                </a-badge>
            </a-form-model-item>
            <a-form-model-item
                prop="async"
                label="异步"
            >
                <a-switch size="small" v-model="formData.async" />
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
                            xType: 'switch',
                            name: 'async',
                            label: '异步',
                            activeText: '是',
                            inactiveText: '否',
                        },
                    ],
                };
            },
        },
        watch: {
            'formData.async': function(val) {
                if (val === '') val = null;
                this.updateProperties({ 'flowable:async': val });
            },
        },
        created() {
            this.formData = commonParse(this.element);
        },
    };
</script>

<style scoped lang="less">
  .gateway {
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
