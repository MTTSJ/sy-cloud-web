<template>
    <div :class="'gh-p-card' + (nobg ? ' nobg' : '') + (smallpd ? ' smallpd' : '') + (nomg ? ' nomg' : '') + (nopd ? ' nopd' : '')">
        <slot></slot>
    </div>
</template>

  <script>
    export default {
        props: {
            // 两种内填充风格
            // 默认上下左右内填充24px
            // 为true时，上下边的内填充会更窄一些（变成16px），左右边不变
            smallpd: {
                type: Boolean,
                default: false,
            },
            // no margin（无margin）
            nomg: {
                type: Boolean,
                default: false,
            },
            // no padding（无padding）
            nopd: {
                type: Boolean,
                default: false,
            },
            // no background（无背景色）
            nobg: {
                type: Boolean,
                default: false,
            },
        },
    };
  </script>

  <style lang="less" scoped>
  .gh-p-card {
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    margin: 16px 16px 0px 16px;

    &:last-of-type {
      margin-bottom: 16px;
    }
  }

  .nobg {
    background: none !important;
  }

  .nomg {
    margin: 0 !important;
  }

  .nopd {
    padding: 0 !important;
  }

  .smallpd {
    padding: 16px 24px !important;
  }
  </style>
