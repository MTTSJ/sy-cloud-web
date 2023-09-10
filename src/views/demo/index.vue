<template>
    <a-card :bordered="false">
        <a-form-item label="商品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
                placeholder="请输入商品名称"
                v-decorator="['goods_name', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
            />
        </a-form-item>
        <a-form-item
            label="商品图片"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            extra="建议尺寸：750*750像素, 最多上传10张, 可拖拽图片调整顺序, 第1张将作为商品首图"
        >
            <MultiImage
                multiple
                :maxNum="10"
                v-decorator="['imagesIds', { rules: [{ required: true, message: '请至少上传1张商品图片' }] }]"
            />
        </a-form-item>
        <a-form-item label="服务标识" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="单选功能测试">
            <MultiImage
                :maxNum="2"
                v-decorator="['serviceIds', { rules: [{ required: true, message: '请至少上传1张商品图片' }] }]"
            />
        </a-form-item>
    </a-card>
</template>

<script>
    import { MultiImage } from '@/components';
    export default {
        components: {
            MultiImage,
        },
        data() {
            return {
                // 标签布局属性
                labelCol: { span: 3 },
                // 输入框布局属性
                wrapperCol: { span: 10 },
            };
        },
    };
</script>

<style></style>
