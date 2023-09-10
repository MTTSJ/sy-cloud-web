<template>
    <div class="app-container">
        <a-col v-for="(i, index) in pages" :key="index" :xs="12" :sm="6">
            <a-card class="box-card" @click.native="open(i.url)">
                <div class="text item">
                    <div class="left">
                        <img :src="i.icon" />
                    </div>
                    <div class="right">
                        <span class="headers" :style="{ color: i.c }">{{ i.name }}</span>
                        <br />
                        <span>{{ i.description }}</span>
                    </div>
                </div>
            </a-card>
        </a-col>
    </div>
</template>

<script>
    export default {
        name: 'MonitorDashboard',
        data() {
            return {
                pages: [
                    {
                        icon: require('@/assets/svg/monitor/nacos.svg'),
                        name: 'Nacos控制台',
                        url: 'http://gateway.mate.vip:8848/nacos',
                        description: '微服务注册中心&配置中心',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/sentinel.svg'),
                        name: 'Sentinel控制台',
                        url: '#',
                        description: '高可用流量管理框架,待上线',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/rocketmq.svg'),
                        name: 'RocketMQ控制台',
                        url: '#',
                        description: '消息队列管理和查看，待上线',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/dubbo.svg'),
                        name: 'Dubbo控制台',
                        url: '#',
                        description: 'Dubbo业务管理后台，待上线',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/swagger.svg'),
                        name: 'Swagger控制台',
                        url: 'http://gateway.mate.vip/doc.html',
                        description: 'Knife4j微服务API接口文档中心',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/admin.svg'),
                        name: 'Spring Boot Admin面板',
                        url: 'http://gateway.mate.vip:30001',
                        description: '基于SBA的微服务监控中心',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/skywalking.svg'),
                        name: '链路跟踪控制台',
                        url: '#',
                        description: '采用skywalking实现链路跟踪',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                    {
                        icon: require('@/assets/svg/monitor/elk.svg'),
                        name: 'ELK面板',
                        url: '#',
                        description: '统一日志管理业务，待上线',
                        c: '#1890ff',
                        bgc: 'rgba(236,251,252,0.3)',
                    },
                ],
            };
        },
        methods: {
            resolveIcon(icon) {
                return `@/assets/svg/monitor/${icon}`;
            },
            open(url) {
                window.open(url, '_blank');
            },
        },
    };
</script>
<style scoped>
html body .ant-card-body {
  padding: 20px;
  height: 10rem;
}
@media screen and (min-width: 1600px) {
  html body .ant-card-body {
    height: 6rem;
  }
}
.svg-icon {
  width: 3.4rem;
  height: 3.4rem;
}
.item {
  display: flex;
  flex-wrap: wrap;
}
.app-container {
  display: inline-block;
  width: 98.6%;
}
.box-card {
  margin: 13px;
  cursor: pointer;
}
.headers {
  display: inline-flex;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
}
.left {
  height: 100%;
}
img {
  display: inline-block;
  width: 3.4rem;
}
.right {
  margin-left: 10px;
}
</style>
