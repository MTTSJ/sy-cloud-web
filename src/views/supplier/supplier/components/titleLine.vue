<template>
    <!-- 模块标题组件 -->
    <div class="gh-p-title-line">
        <!-- 标题左侧竖线 -->
        <div class="gh-p-title-line-line" v-if="showLine"></div>
        <!-- 标题 -->
        <div class="gh-p-title-line-title" v-text="titleName" :style="titleStyle"></div>
        <!-- 右侧插槽 -->
        <div class="gh-p-title-line-right-wraper" :style="contentStyle">
            <slot></slot>
        </div>
    </div>
</template>
  <script>
    export default {
        props: {
            // 标题宽度
            titleStyle: String,
            // 内容（插槽）样式
            contentStyle: String,
            // 标题名称
            titleName: {
                type: String,
                default: '',
            },
            // 标题左侧是否有竖线
            showLine: {
                type: Boolean,
                default: true,
            },
        },
    };
  </script>
  <style lang="less" scoped>
  // 标题样式
  .gh-p-title-line {
    display: flex;
    align-items: center;
    height: 36px;
    line-height: 36px;
    padding: 0 0 16px 0;

    // 竖线样式
    .gh-p-title-line-line {
      width: 6px;
      height: 16px;
      margin: 8px 10px 8px 0;
      line-height: 16px;
      background: #409eff;
      border-radius: 3px 0px 3px 0px;
      flex-shrink: 0;
    }

    // 标题
    .gh-p-title-line-title {
      line-height: 16px;
      height: 16px;
      margin: 8px 16px 8px 0;
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      position: relative;
      flex-shrink: 0;
    }

    .gh-p-title-line-right-wraper {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      text-align: right;
      justify-content: space-between;
      flex-grow: 1;
      div {
        display: flex;
        align-items: center;
      }
    }
  }
  </style>
