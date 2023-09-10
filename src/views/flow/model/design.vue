<template>
    <a-spin :spinning="loading">
        <vue-bpmn
            :xml="xml"
            :users="users"
            :groups="groups"
            :categorys="categorys"
            :isView="false"
            @save="save"
        />
    </a-spin>
</template>
<script>
    import {
        saveBpmnModel,
        modelPreview,
    } from '@/api/modular/flowable/modelManage';
    import { flowableCategoryList } from '@/api/modular/flowable/categoryManage';
    import { flowUserList } from '@/api/modular/system/userManage.js';
    import VueBpmn from '@/components/VueBpmn';

    export default {
        name: 'ModalDesign',
        components: {
            VueBpmn,
        },
        data() {
            return {
                visible: false,
                loading: false,
                srcUrl: '',
                xml: '', // 后端查询到的xml
                users: [],
                groups: [
                    { name: 'web组', id: 'web' },
                    { name: 'java组', id: 'java' },
                    { name: 'python组', id: 'python' },
                ],
                categorys: [],
            };
        },
        computed: {
            id() {
                return this.$route.query.id;
            },
        },
        created() {
            this.getModelDetail();
            /**
             * 获取到分类列表
             */
            flowableCategoryList().then((res) => {
                this.categorys = res.data;
            });
            this.getFlowUserList();
        },
        methods: {
            jumpToModelList() {
                this.$router.push({ name: 'flow_model' });
            },
            getModelDetail() {
                modelPreview({ id: this.id }).then((res) => {
                    if (res.success) {
                        this.xml = res.data;
                    } else {
                        this.$message.error('获取xml文件失败：' + res.message);
                    }
                });
            },
            getFlowUserList() {
                flowUserList().then((res) => {
                    if (res.success) {
                        this.users = res.data;
                    } else {
                        this.$message.error('获取用户列表失败' + res.message);
                    }
                });
            },
            save(data) {
                console.log(data); // { process: {...}, xml: '...', svg: '...' }
                this.loading = true;
                saveBpmnModel({
                    modelId: this.id,
                    modelXml: data.xml,
                    svg: data.svg,
                })
                    .then((res) => {
                        if (res.success) {
                            this.$message.success('编辑成功');
                            this.jumpToModelList();
                        } else {
                            this.$message.error('编辑失败：' + res.message);
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
        },
    };
</script>
