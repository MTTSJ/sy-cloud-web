export default {
  data() {
    return {
      dataSource: [],
      loading: false,
      pagination: {
        total: 0,
        current: 1,
        pageSize: 18,
        showSizeChanger: true,
        onChange: this.onPageChange,
        onShowSizeChange: this.onPageChange,
        showTotal: (total, range) => {
          return '第' + range[0] + '-' + range[1] + '条，共' + total + '条记录';
        },
      },
      queryParam: {},
    };
  },
  methods: {
    getPage() {},
    onPageChange(current, pageSize) {
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      const { pageSize, current } = this.pagination;
      this.getPage({ ...this.queryParam, current, size: pageSize })
        .then(res => {
          const { success, data } = res;
          if (success) {
            const { total, current, records } = data;
            if (records.length === 0 && current > 1) {
              this.pagination.current -= 1;
              this.loadData();
            } else {
              this.dataSource = records;
              this.pagination.current = current;
              this.pagination.total = total;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
