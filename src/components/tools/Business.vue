<template>
    <a-modal
        v-model="visible"
        maskClosable
        class="route-search"
        :closable="false"
        :footer="false"
        :afterClose="reset"
        @keydown.native="onKeydown"
    >
        <div style="text-align:center">
            请加微信联系，微信号：<span style="color: #1890FF">舍羽农信</span>
            <br />
            <img :src="weixin" width="200px" />
            <br />
            备注建议：咨询
        </div>
    </a-modal>
</template>

<script>
    export default {
        name: 'Business',
        data() {
            return {
                visible: false,
                query: '',
                result: [],
                curIndex: 0,
                weixin: require('@/assets/weixin.jpg'),
            };
        },
        computed: {},
        watch: {},
        methods: {
            show() {
                this.visible = true;
            },
            reset() {
                this.query = '';
                this.result = [];
                this.curIndex = 0;
            },
        },
    };
</script>

<style lang="less" scoped>
.route-search::v-deep .ant-modal-content {
  border-radius: 10px;
}
.result-container {
  margin-top: 10px;
  max-height: 300px;
  overflow: auto;
  .result-item {
    cursor: pointer;
    border-color: #f6f6f6;
    &.active {
      background-color: #f6f6f6;
    }
    .content {
      flex-grow: 1;
      .description {
        font-size: 12px;
      }
    }
  }
}
</style>
