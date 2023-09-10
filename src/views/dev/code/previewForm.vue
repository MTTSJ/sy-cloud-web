<template>
    <a-card :bordered="false" v-show="indexConfigShow">
        <div class="table-operator">
            <a-button type="primary">代码生成预览</a-button>
            <a-button class="but_item" type="default" @click="handleCancel" icon="rollback">返回</a-button>
        </div>
        <a-tabs type="card">
            <a-tab-pane v-for="item in loadData" :key="item.k" :tab="item.k">
                <Java :value="item.v" :height="height" />
            </a-tab-pane>
        </a-tabs>
    </a-card>
</template>
<script>
    import { codePreview } from '@/api/modular/gen/codeGenerateManage';
    import Java from '@/components/JavaEdit/index';
    export default {
        components: { Java },
        data() {
            return {
                indexConfigShow: false,
                tableLoading: false,
                visible: false,
                loadData: [],
                height: '',
            };
        },
        methods: {
            /**
             * 打开界面
             */
            open(data) {
                this.height = document.documentElement.clientHeight - 180 + 'px';
                this.indexConfigShow = true;
                this.tableLoading = true;
                const params = {
                    id: data.id,
                };
                codePreview(params).then(res => {
                    const map = res.data;
                    for (const key in map) {
                        const k = key.replace(/^templates\/|.vm$/g, '');
                        const v = map[key];
                        const obj = { k, v };
                        this.loadData.push(obj);
                    }
                    this.tableLoading = false;
                });
            },
            handleCancel() {
                this.$emit('ok');
                this.loadData = [];
                this.indexConfigShow = false;
            },
        },
    };
</script>
