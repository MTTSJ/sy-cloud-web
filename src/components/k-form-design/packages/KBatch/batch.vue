<!--
 * @Description: 动态表格 用于批量填入数据
 * @Author: kcz
 * @Date: 2020-03-27 18:36:56
 * @LastEditors: kcz
 * @LastEditTime: 2020-07-09 20:53:57
 -->
<template>
    <a-form-model
        ref="dynamicValidateForm"
        layout="inline"
        :model="dynamicValidateForm"
    >
        <a-table
            class="batch-table"
            :pagination="false"
            :rowKey="record => record.key"
            :columns="columns"
            :dataSource="dynamicValidateForm.domains"
            bordered
            :scroll="{
                x: listLength * 190 + 80 + (!record.options.hideSequence ? 60 : 0),
                y: record.options.scrollY
            }"
        >
            // eslint-disable-next-line vue/no-template-shadow
            <template
                v-for="item in record.list"
                :slot="item.key"
                slot-scope="text, recordItem, index"
            >
                <KFormModelItem
                    :key="item.key + '1'"
                    :record="item"
                    :config="config"
                    :parentDisabled="disabled"
                    :index="index"
                    :domains="dynamicValidateForm.domains"
                    :dynamicData="dynamicData"
                    v-model="recordItem[item.model]"
                    @input="handleInput"
                />
            </template>
            // eslint-disable-next-line vue/no-template-shadow
            <template slot="dynamic-delete-button" slot-scope="text, recordD">
                <a-icon
                    v-if="!disabled"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    @click="removeDomain(recordD)"
                />
            </template>
        </a-table>
        <a-button type="dashed" :disabled="disabled" @click="addDomain">
            <a-icon type="plus" />
            增加
        </a-button>
    </a-form-model>
</template>

<script>
    import KFormModelItem from './module/KFormModelItem';
    export default {
        name: 'KBatch',
        // eslint-disable-next-line vue/require-prop-types
        props: ['record', 'value', 'dynamicData', 'config', 'parentDisabled'],

        components: {
            KFormModelItem,
        },
        watch: {
            value: {
                // value 需要深度监听及默认先执行handler函数
                handler(val) {
                    this.dynamicValidateForm.domains = val || [];
                },
                immediate: true,
                deep: true,
            },
        },
        data() {
            return {
                dynamicValidateForm: {
                    domains: [],
                },
            };
        },
        computed: {
            listLength() {
                return this.record.list.filter(item => !item.options.hidden).length;
            },
            columns() {
                const columns = [];
                if (!this.record.options.hideSequence) {
                    columns.push({
                        title: '序号',
                        dataIndex: 'sequence_index_number',
                        width: '60px',
                        align: 'center',
                        customRender: (text, record, index) => {
                            return index + 1;
                        },
                    });
                }

                columns.push(
                    ...this.record.list
                        .filter(item => !item.options.hidden)
                        .map((item, index) => {
                            return {
                                title: item.label,
                                dataIndex: item.key,
                                width: index === this.record.list.length - 1 ? '' : '190px',
                                scopedSlots: { customRender: item.key },
                            };
                        }),
                );

                columns.push({
                    title: '操作',
                    dataIndex: 'dynamic-delete-button',
                    fixed: 'right',
                    width: '80px',
                    align: 'center',
                    scopedSlots: { customRender: 'dynamic-delete-button' },
                });

                return columns;
            },
            disabled() {
                return this.record.options.disabled || this.parentDisabled;
            },
        },
        methods: {
            validationSubform() {
                let verification;
                this.$refs.dynamicValidateForm.validate(valid => {
                    verification = valid;
                });
                return verification;
            },
            resetForm() {
                this.$refs.dynamicValidateForm.resetFields();
            },
            removeDomain(item) {
                const index = this.dynamicValidateForm.domains.indexOf(item);
                if (index !== -1) {
                    this.dynamicValidateForm.domains.splice(index, 1);
                }
            },
            addDomain() {
                const data = {};
                this.record.list.forEach(item => {
                    data[item.model] = item.options.defaultValue;
                });

                this.dynamicValidateForm.domains.push({
                    ...data,
                    key: Date.now(),
                });
                this.handleInput();
            },
            handleInput() {
                this.$emit('change', this.dynamicValidateForm.domains);
            },
        },
    };
</script>
<style scoped>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #e89;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
