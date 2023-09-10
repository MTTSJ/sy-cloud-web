<template>
    <div
        slot="overlay"
        class="ant-dropdown-menu s-tool-column ant-dropdown-content"
    >
        <div class="s-tool-column-header s-tool-column-item">
            <a-checkbox
                :indeterminate="indeterminate"
                :checked="checkAll"
                @change="onCheckAllChange"
            >
                列展示
            </a-checkbox>
            <a @click="init">重置</a>
        </div>
        <a-divider />
        <div class="ant-checkbox-group">
            <draggable
                v-model="columnSetting"
                animation="300"
            >
                <div
                    class="s-tool-column-item"
                    v-for="item in columnSetting"
                    :key="item.dataIndex"
                >
                    <div class="s-tool-column-handle">
                        <a-icon type="more" />
                        <a-icon type="more" />
                    </div>
                    <a-checkbox v-model="item.checked">
                        {{ item.title }}
                    </a-checkbox>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';

    export default {
        name: 'ColumnSetting',
        components: {
            draggable,
        },
        props: {
            columns: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                columnSetting: [],
            };
        },
        computed: {
            checkedList() {
                return this.columnSetting.filter(v => v.checked);
            },
            indeterminate() {
                return this.checkedList.length > 0 && this.checkedList.length < this.columnSetting.length;
            },
            checkAll() {
                return this.checkedList.length === this.columnSetting.length;
            },
        },
        watch: {
            checkedList(value) {
                this.$emit('columnChange', value);
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.columnSetting = this.columns.map(value => ({ ...value, checked: true }));
            },
            onCheckAllChange(e) {
                const checked = e.target.checked;
                this.columnSetting = this.columns.map(value => ({ ...value, checked }));
            },
        },
    };
</script>

<style lang="less" scoped>
.s-tool-column-item {
  display: flex;
  align-items: center;
  padding: 4px 16px 4px 4px;
  .ant-checkbox-wrapper {
    flex: 1;
  }
  .s-tool-column-handle {
    opacity: 0.8;
    cursor: move;
    .anticon-more {
      font-size: 12px;
      margin-top: 2px;
      & + .anticon-more {
        margin: 2px 4px 0 -8px;
      }
    }
  }
}
.s-tool-column-header {
  padding: 5px 16px 10px 24px;
  min-width: 180px;
}
.s-tool-column {
  .ant-divider {
    margin: 0;
  }
  .ant-checkbox-group {
    padding: 4px 0;
    display: block;
  }
}
</style>
