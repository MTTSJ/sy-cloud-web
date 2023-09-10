<template>
    <div>
        <a-card :bordered="false" class="page-header" style="margin-bottom: 16px">
            <div class="avatar-container">
                <a-avatar style="margin-right: 16px" :size="64" icon="user" />
                <div class="content">
                    <h3>杨幂</h3>
                    <div class="desc">2021-07-12, 晴， 20℃ ~ 30℃</div>
                </div>
            </div>
            <div class="functions">
                <div class="item" v-for="(item, index) in functions" :key="index">
                    <a-avatar :icon="item.src" />
                    <span>{{ item.label }}</span>
                </div>
            </div>
        </a-card>
        <div class="page-body">
            <div class="content">
                <a-card :border="false" class="notice" title="通知公告" size="small">
                    <template #extra>
                        <a-button type="link">更多</a-button>
                    </template>
                    <a-list class="notice">
                        <a-list-item
                            class="item"
                            v-for="(item, index) in notices"
                            :key="index"
                        >
                            <span>{{ item.title }}</span>
                            <span style="color: lightgrey">
                                {{ item.time }}
                            </span>
                        </a-list-item>
                    </a-list>
                </a-card>
                <a-card
                    class="frequently-used-system"
                    :border="false"
                    title="常用系统"
                    size="small"
                >
                    <template #extra>
                        <a-button type="link">更多</a-button>
                    </template>
                    <div class="sys-item" v-for="(item, index) in systems" :key="index">
                        <a-avatar :size="48" :icon="item.src" />
                        <span>{{ item.label }}</span>
                    </div>
                </a-card>
            </div>
            <div class="sider-bar">
                <a-carousel arrows class="custom-carousel" style="margin-bottom: 16px">
                    <template #prevArrow>
                        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                            <a-icon type="left-circle" />
                        </div>
                    </template>
                    <template #nextArrow>
                        <div class="custom-slick-arrow" style="right: 10px">
                            <a-icon type="right-circle" />
                        </div>
                    </template>

                    <div><h3>1</h3></div>
                    <div><h3>2</h3></div>
                    <div><h3>3</h3></div>
                    <div><h3>4</h3></div>
                </a-carousel>
                <a-card :border="false" title="新闻动态" size="small">
                    <template #extra>
                        <a-button type="link">更多</a-button>
                    </template>
                    <a-list class="notice">
                        <a-list-item
                            class="item"
                            v-for="(item, index) in news"
                            :key="index"
                        >
                            <span class="ellipsis">{{ item.title }}</span>
                            <span style="color: lightgrey; width: 150px">
                                {{ item.time }}
                            </span>
                        </a-list-item>
                    </a-list>
                </a-card>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'WorkBranch',
        data() {
            return {
                functions: [
                    { label: '日程', src: 'user' },
                    { label: '通讯录', src: 'user' },
                    { label: '待办事项', src: 'user' },
                    { label: '流程中心', src: 'user' },
                    { label: '我和邮箱', src: 'user' },
                ],
                notices: [
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                ],
                news: [
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                    { title: '上海石化1000吨年碳纤维装置进入开车准备阶段', time: '2021-5-20' },
                ],
                systems: [
                    { label: '综合管理平台', src: 'user' },
                    { label: '财务系统', src: 'user' },
                    { label: 'HR系统', src: 'user' },
                    { label: '资产系统', src: 'user' },
                    { label: 'CRM系统', src: 'user' },
                    { label: 'MDM系统', src: 'user' },
                ],
            };
        },
    };
</script>

<style scoped lang="less">
.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.page-header {
  &::v-deep .ant-card-body {
    display: flex;
    align-items: center;
  }
  .avatar-container {
    display: flex;
    align-items: center;
    margin-right: 10px;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .functions {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
      cursor: pointer;
      & > *:last-child {
        margin-top: 10px;
      }
    }
  }
}

.page-body {
  display: flex;
  .sider-bar {
    width: 300px;
  }
  .content {
    flex-grow: 1;
    margin-right: 16px;
  }
  .notice {
    margin-bottom: 16px;
    &::v-deep .ant-card-body {
      padding: 0 10px;
    }
  }
  .frequently-used-system {
    &::v-deep .ant-card-body {
      display: flex;
      justify-content: space-between;
    }
    .sys-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;
      cursor: pointer;
      & > *:last-child {
        margin-top: 10px;
      }
    }
  }
}

.sider-bar {
  &::v-deep .ant-card-body {
    padding: 0 10px;
  }
  .custom-carousel::v-deep {
    .slick-slide {
      text-align: center;
      height: 160px;
      line-height: 160px;
      background: #364d79;
      overflow: hidden;
    }
    .slick-slide h3 {
      color: #fff;
    }
    .custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
      &::before {
        display: none;
      }
      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>
