<script>
    import T from 'ant-design-vue/es/table/Table';
    import get from 'lodash.get';
    import screenfull from 'screenfull';
    import columnSetting from './columnSetting';

    export default {
        name: 'STable',
        components: {
            columnSetting,
        },
        data() {
            return {
                needTotalList: [],

                selectedRows: [],
                selectedRowKeys: [],

                localLoading: false,
                localDataSource: [],
                localPagination: Object.assign({}, this.pagination),
                isFullscreen: false,
                customSize: this.size,

                // 列配置
                indeterminate: true,
                checkAll: false,
                checkedList: [],
                columnsSetting: [],
            };
        },
        props: Object.assign({}, T.props, {
            size: {
                type: String,
                default: 'default',
            },
            rowKey: {
                type: [String, Function],
                default: 'id',
            },
            data: {
                type: Function,
                required: true,
            },
            current: {
                type: Number,
                default: 1,
            },
            pageSize: {
                type: Number,
                default: 10,
            },
            showSizeChanger: {
                type: Boolean,
                default: true,
            },
            alert: {
                type: [Object, Boolean],
                default: null,
            },
            showTools: {
                type: Boolean,
                default: true,
            },
            rowSelection: {
                type: Object,
                default: null,
            },
            /** @Deprecated */
            showAlertInfo: {
                type: Boolean,
                default: false,
            },
            showPagination: {
                type: String | Boolean,
                default: 'auto',
            },
            pageURI: {
                type: Boolean,
                default: false,
            },
            extraTool: {
                type: Array,
                default: () => [],
            },
            immediate: {
                type: Boolean,
                default: true,
            },
        }),
        watch: {
            'localPagination.current'(val) {
                this.pageURI &&
                    this.$router.push({
                        ...this.$route,
                        name: this.$route.name,
                        params: Object.assign({}, this.$route.params, {
                            pageNo: val,
                        }),
                    });
            },
            current(val) {
                Object.assign(this.localPagination, {
                    current: val,
                });
            },
            pageSize(val) {
                Object.assign(this.localPagination, {
                    pageSize: val,
                });
            },
            showSizeChanger(val) {
                Object.assign(this.localPagination, {
                    showSizeChanger: val,
                });
            },
            columns: {
                immediate: true,
                handler(columns) {
                    this.columnsSetting = columns;
                },
            },
        },
        created() {
            const { pageNo } = this.$route.params;
            const localPageNum = (this.pageURI && pageNo && parseInt(pageNo)) || this.current;
            this.localPagination =
                (['auto', true].includes(this.showPagination) &&
                Object.assign({}, this.localPagination, {
                    current: localPageNum,
                    pageSize: this.pageSize,
                    showSizeChanger: this.showSizeChanger,
                    showTotal: (total, range) => {
                        return range[0] + '-' + range[1] + '共' + total + '条';
                    },
                })) ||
                false;

            this.needTotalList = this.initTotalList(this.columns);
            this.immediate && this.loadData();
        },
        methods: {
            /**
             * 表格重新加载方法
             * 如果参数为 true, 则强制刷新到第一页
             * @param Boolean bool
             */
            refresh(bool = false) {
                bool &&
                    (this.localPagination = Object.assign(
                        {},
                        {
                            current: 1,
                            pageSize: this.pageSize,
                        },
                    ));
                this.loadData();
            },
            /**
             * 加载数据方法
             * @param {Object} pagination 分页选项器
             * @param {Object} filters 过滤条件
             * @param {Object} sorter 排序条件
             */
            loadData(pagination, filters, sorter) {
                this.localLoading = true;
                const parameter = Object.assign(
                    {
                        current:
                            (pagination && pagination.current) || (this.showPagination && this.localPagination.current) || this.current,
                        size:
                            (pagination && pagination.pageSize) ||
                            (this.showPagination && this.localPagination.pageSize) ||
                            this.pageSize,
                    },
                    (sorter &&
                        sorter.field && {
                            sortField: sorter.field,
                        }) ||
                        {},
                    (sorter &&
                        sorter.order && {
                            sortOrder: sorter.order,
                        }) ||
                        {},
                    {
                        ...filters,
                    },
                );
                const result = this.data(parameter);

                // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
                // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
                    result.then(r => {
                        if (r == null) {
                            this.localLoading = false;
                            return;
                        }
                        this.localPagination =
                            (this.showPagination &&
                            Object.assign({}, this.localPagination, {
                                current: r.current, // pageNo, // 返回结果中的当前分页数
                                total: r.total, // totalCount, // 返回结果中的总记录数
                                showSizeChanger: this.showSizeChanger,
                                pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize,
                            })) ||
                            false;
                        // 后端数据rows为null保存修复
                        if (r.records == null) {
                            r.records = [];
                        }
                        // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
                        if (r.records.length === 0 && this.showPagination && this.localPagination.current > 1) {
                            this.localPagination.current--;
                            this.loadData();
                            return;
                        }

                        // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
                        // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
                        try {
                            if (
                                ['auto', true].includes(this.showPagination) &&
                                r.totalCount <= r.totalPage * this.localPagination.pageSize
                            ) {
                                this.localPagination.hideOnSinglePage = true;
                            }
                        } catch (e) {
                            this.localPagination = false;
                        }
                        this.localDataSource = r.records; // 返回结果中的数组数据
                        this.localLoading = false;
                    });
                }
            },
            initTotalList(columns) {
                const totalList = [];
                for (const item of columns || []) {
                    if (item.needTotal) {
                        totalList.push({
                            ...item,
                            total: 0,
                        });
                    }
                }
                return totalList;
            },
            /**
             * 用于更新已选中的列表数据 total 统计
             * @param selectedRowKeys
             * @param selectedRows
             */
            updateSelect(selectedRowKeys, selectedRows) {
                this.selectedRows = selectedRows;
                this.selectedRowKeys = selectedRowKeys;
                const list = this.needTotalList;
                this.needTotalList = list.map(item => {
                    return {
                        ...item,
                        total: selectedRows.reduce((sum, val) => {
                            const total = sum + parseInt(get(val, item.dataIndex));
                            return isNaN(total) ? 0 : total;
                        }, 0),
                    };
                });
            },
            /**
             * 清空 table 已选中项
             */
            clearSelected() {
                if (this.rowSelection) {
                    this.rowSelection.onChange([], []);
                    this.updateSelect([], []);
                }
            },
            renderAlert() {
                // 绘制统计列数据
                const needTotalItems = this.needTotalList.map(item => {
                    return (
          <span style="margin-right: 12px">
            {item.title}总计{' '}
            <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
          </span>
                    );
                });

                const clear = this.alert || this.alert?.clear;
                const clearSelected = () => {
                    this.clearSelected();
                    typeof clear === 'function' && clear();
                };

                // 绘制 alert 组件
                return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">
              <span style="margin-right: 5px">已选择:</span>
              <a style="font-weight: 600">
                {this.selectedRows.length}
              </a>
            </span>
            {needTotalItems}
            {/* 绘制清空按钮 */}
            {clear && this.selectedRowKeys.length > 0 && <a onClick={clearSelected}>清空</a>}
          </template>
        </a-alert>
                );
            },
            renderHeader() {
                let tools = [
                    {
                        icon: 'reload',
                        title: '刷新',
                        onClick: () => {
                            this.refresh();
                        },
                    },
                    {
                        icon: 'column-height',
                        title: '密度',
                        isDropdown: true,
                        menu: () => {
                            const onClick = ({ key }) => {
                                this.customSize = key;
                            };
                            return (
              <a-menu slot="overlay" onClick={onClick} selectable defaultSelectedKeys={[this.customSize]}>
                <a-menu-item key="default">默认</a-menu-item>
                <a-menu-item key="middle">中等</a-menu-item>
                <a-menu-item key="small">紧凑</a-menu-item>
              </a-menu>
                            );
                        },
                        onClick: () => {},
                    },
                    {
                        icon: 'setting',
                        title: '列设置',
                        isDropdown: true,
                        menu: () => {
                            return <column-setting
              slot="overlay"
              columns={this.columns}
              onColumnChange={v => { this.columnsSetting = v; }}
                            />;
                        },
                        onClick: () => {},
                    },
                    {
                        icon: this.isFullscreen ? 'fullscreen-exit' : 'fullscreen',
                        title: '全屏',
                        onClick: () => {
                            if (screenfull.isEnabled) {
                                const table = document.querySelector('.table-wrapper');
                                const antdCard = table.parentNode.parentNode;
                                if (antdCard.classList.contains('ant-card')) {
                                    screenfull.toggle(antdCard);
                                    this.isFullscreen = !this.isFullscreen;
                                }
                            }
                        },
                    },
                ];
                if (this.extraTool.length) {
                    tools = tools.concat(this.extraTool);
                }

                return (
        <div class="s-table-tool">
          <div class="s-table-tool-left"> {this.$scopedSlots.operator && this.$scopedSlots.operator()}</div>
          <div class="s-table-tool-right">
            {tools.map(tool => {
              if (tool.isDropdown) {
                return (
                  <a-dropdown trigger={['click']}>
                    <a-tooltip title={tool.title} class="s-tool-item" onClick={tool.onClick}>
                      <a-icon type={tool.icon} />
                    </a-tooltip>
                    {tool.menu()}
                  </a-dropdown>
                );
              }
              return (
                <a-tooltip title={tool.title} class="s-tool-item" onClick={tool.onClick}>
                  <a-icon type={tool.icon} />
                </a-tooltip>
              );
            })}
          </div>
        </div>
                );
            },
        },

        render() {
            let props = {};
            const localKeys = Object.keys(this.$data);
            const showAlert = typeof this.alert === 'boolean'
                ? this.alert
                : this.alert?.show && this.rowSelection?.selectedRowKeys;

            Object.keys(T.props).forEach(k => {
                const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`;
                if (localKeys.includes(localKey)) {
                    props[k] = this[localKey];
                    return props[k];
                }
                if (k === 'rowSelection') {
                    if (showAlert && this.rowSelection) {
                        // 如果需要使用alert，则重新绑定 rowSelection 事件
                        const rowSelection = {
                            ...this.rowSelection,
                            selectedRows: this.selectedRows,
                            selectedRowKeys: this.selectedRowKeys,
                            onChange: (selectedRowKeys, selectedRows) => {
                                this.updateSelect(selectedRowKeys, selectedRows);
              // eslint-disable-next-line no-unused-expressions
              this.rowSelection.onChange?.(selectedRowKeys, selectedRows);
                            },
                        };
                        return (props[k] = rowSelection);
                    } else if (!this.rowSelection) {
                        // 如果没打算开启 rowSelection 则清空默认的选择项
                        props[k] = null;
                        return props[k];
                    }
                }
                this[k] && (props[k] = this[k]);
                // 此处配置表格大小与要显示的列
                props = {
                    ...props,
                    size: this.customSize,
                    columns: this.columnsSetting.filter(value => value.checked === undefined || value.checked),
                };
                return props[k];
            });

            return (
      <div class="table-wrapper">
        {this.showTools ? this.renderHeader() : null}
        {showAlert ? this.renderAlert() : null}
        <a-table
          {...{ props, scopedSlots: { ...this.$scopedSlots } }}
          onChange={this.loadData}
          onExpand={(expanded, record) => {
            this.$emit('expand', expanded, record);
          }}>
          {Object.keys(this.$slots).map(name => (
            <template slot={name}>{this.$slots[name]}</template>
          ))}
        </a-table>
      </div>
            );
        },
    };
</script>

<style lang="stylus" scoped>
.table-wrapper
  background white
  & >>> .ant-table-scroll
    overflow-x scroll

.s-table-tool
  display flex
  margin-bottom 16px
  .s-table-tool-left
    flex 1
  .s-table-tool-right
    display inline-flex
    align-items center
    .s-tool-item
      font-size 16px
      margin-left 16px
      cursor pointer
</style>
