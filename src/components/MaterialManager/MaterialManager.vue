<script type="text/jsx">
    import { Modal } from 'ant-design-vue';
    import Manager from './Manager';
    export default {
        name: 'MaterialManager',
        model: {
            prop: 'visible',
            event: 'change',
        },
        props: {
            visible: Boolean,
            modal: {
                type: Boolean,
                default: false,
            },
            size: {
                type: String,
                validator(val) {
                    return ['large', 'middle', 'small'].includes(val);
                },
                default: 'middle',
            },
            materialLoading: Boolean,
            groupList: {
                type: Array,
                default: () => [],
            },
            materialList: {
                type: Array,
                default: () => [],
            },
            pagination: {
                type: [Object, Boolean],
                default: false,
            },
            progress: {
                type: [Boolean, Object],
                default: false,
            },
            selectMode: {
                type: String,
                validator(val) {
                    return ['radio', 'multi'].includes(val);
                },
                default: 'multi',
            },
            activeCategories: {
                type: Array,
                default: () => ['image', 'video'],
            },
        },
        computed: {
            sVisible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit('change', val);
                },
            },
            width() {
                switch (this.size) {
                case 'small': return '600px';
                case 'middle': return '1000px';
                case 'large': return '1400px';
                default: return '960px';
                }
            },
        },
        provide() {
            return {
                materialContext: this,
            };
        },
        data() {
            return {
                selectedKeys: [],
            };
        },
        methods: {
            emitEvent(event, ...params) {
                this.$emit(event, ...params);
            },
        },
        render() {
            const {
                groupList,
                materialList,
                pagination,
                materialLoading,
                progress,
                emitEvent,
                selectMode,
                activeCategories,
            } = this;
            const manager = <Manager
      ref="manager"
      groupList={groupList}
      materialList={materialList}
      materialLoading={materialLoading}
      pagination={pagination}
      progress={progress}
      selectMode={selectMode}
      activeCategories={activeCategories}
      on={{
        'group:add': (...params) => emitEvent('group:add', ...params),
        'group:rename': (...params) => emitEvent('group:rename', ...params),
        'group:delete': (...params) => emitEvent('group:delete', ...params),
        'group:select': (...params) => emitEvent('group:select', ...params),
        'material:move': (...params) => emitEvent('material:move', ...params),
        'material:upload': (...params) => emitEvent('material:upload', ...params),
        'material:search': (...params) => emitEvent('material:search', ...params),
        'material:rename': (...params) => emitEvent('material:rename', ...params),
        'material:delete': (...params) => emitEvent('material:delete', ...params),
        'material:select': selectedKeys => { this.selectedKeys = selectedKeys; },
        'category:change': (...params) => emitEvent('category:change', ...params),
      }}
            />;
            const modal = <Modal
      visible={this.sVisible}
      class="material-modal"
      width={this.width}
      title="素材管理"
      getContainer={ target => manager.context.$el }
      bodyStyle= {
        { maxHeight: '65vh' }
      }
      on={{
        change: val => { this.sVisible = val; },
        ok: () => {
          const list = this.materialList.filter(item => this.selectedKeys.includes(item.id));
          this.$emit('confirm', this.selectMode === 'radio' ? list[0] : list);
        },
      }}
    >
      { manager }
    </Modal>;
            return (
      <div class="material-manager">
        { this.modal ? modal : manager }
      </div>
            );
        },
    };
</script>
<style scoped lang="less">
.material-modal ::v-deep {
  .ant-modal-body {
    padding: 0;
    max-height: 76vh;
    overflow-y: scroll;
  }
  .ant-modal-footer {
    text-align: center;
    .ant-btn:not(:first-child) {
      margin-left: 32px;
    }
  }
}
.material-manager {
  background-color: white;
  border-radius: 4px;
  margin-top: 24px;
}
</style>
