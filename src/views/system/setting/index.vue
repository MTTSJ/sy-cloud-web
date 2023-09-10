<template>
    <a-card :bordered="false">
        <a-tabs default-active-key="basic" tabPosition="left" :style="{ height: '650px' }" @change="callback">
            <a-tab-pane key="basic" tab="基础信息设置" icon="edit">
                基础信息设置,功能待完善
            </a-tab-pane>
            <a-tab-pane key="oss" tab="OSS资源配置">
                <oss-form />
            </a-tab-pane>
            <a-tab-pane key="sms" tab="短信配置" force-render>
                <sms-form />
            </a-tab-pane>
            <a-tab-pane key="mail" tab="邮件配置">
                邮件配置,功能待完善
            </a-tab-pane>
        </a-tabs>
    </a-card>
</template>
<script>
    import ossForm from './ossForm';
    import smsForm from './smsForm';
    export default {
        components: {
            ossForm,
            smsForm,
        },
        data() {
            return {};
        },
        methods: {
            callback(key) {
                console.log(key);
            },
        },
    };
</script>
