<template>
    <div>
        <a-button @click="showManager">弹窗显示</a-button>
        <material-use select-mode="multi" @confirm="onConfirm" />
        <material-use
            v-model="visible"
            modal
            size="large"
            :active-categories="['image', 'video']"
            select-mode="multi"
            @confirm="onConfirm"
        />
    </div>
</template>

<script>
    import { MaterialUse } from '@/components/MaterialManager';
    export default {
        name: 'Manager',
        components: { MaterialUse },
        data() {
            return {
                visible: false,
            };
        },
        methods: {
            showManager() {
                this.visible = true;
            },
            onConfirm(list) {
                console.log(list);
                this.visible = false;
            },
        },
    };
</script>

<style scoped></style>
