<template>
    <a-modal
        width="0px"
        class="preview-box"
        v-model="visible"
        :footer="null"
        centered
        :closable="false"
    >
        <img v-if="type === 'image'" :src="source" />
        <video v-else-if="type === 'video'" :src="source" autoplay controls />
    </a-modal>
</template>

<script>
    export default {
        name: 'PreviewBox',
        props: {
            src: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                validator(val) {
                    return ['video', 'image'].includes(val);
                },
                default: 'image',
            },
            value: Boolean,
        },
        data() {
            return {
                defaultSrc: '',
            };
        },
        computed: {
            visible: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit('input', val);
                },
            },
            source() {
                return this.visible ? this.src : this.defaultSrc;
            },
        },
    };
</script>

<style scoped lang="less">
  .preview-box ::v-deep .ant-modal-content{
    background-color: rgba(0, 0, 0, 0);
    box-shadow: none;
    display: flex;
    justify-content: center;
    img, video{
      max-height: 80vh;
      max-width: 80vw;
    }
    .ant-modal-body{
      padding: 0;
    }
  }
</style>
