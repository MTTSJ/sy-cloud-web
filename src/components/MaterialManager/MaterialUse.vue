<template>
    <material-manager
        :size="size"
        :modal="modal"
        v-model="sVisible"
        :group-list="groupList"
        :material-list="dataSource"
        :material-loading="loading"
        :pagination="pagination"
        :progress="progress"
        :select-mode="selectMode"
        :active-categories="activeCategories"
        @group:add="addGroup"
        @group:rename="renameGroup"
        @group:delete="deleteGroup"
        @group:select="onGroupChange"
        @material:move="onMove"
        @material:search="onSearch"
        @material:rename="onMaterialRename"
        @material:upload="onUpload"
        @material:delete="onDelete"
        @category:change="onCategoryChange"
        @confirm="onConfirm"
    />
</template>

<script>
    import MaterialManager from '@/components/MaterialManager/MaterialManager';
    import listMixin from '@/mixins/listMixin';
    import generateThumb from '@/components/MaterialManager/thum-image';
    import {
        deleteMaterialGroup,
        addMaterialGroup,
        getMaterialGroupList,
        getPage,
        deleteMaterial,
        moveMaterialToGroup,
        renameMaterialGroup,
        renameMaterial,
        uploadMaterial,
        uploadMaterialThumb,
    } from '@/api/modular/system/materialManage';
    const FILE_TYPE = {
        image: 1,
        video: 2,
    };
    export default {
        name: 'MaterialUse',
        components: { MaterialManager },
        mixins: [listMixin],
        model: {
            prop: 'visible',
            event: 'change',
        },
        props: {
            size: {
                type: String,
                default: 'middle',
            },
            modal: {
                type: Boolean,
                default: false,
            },
            visible: {
                type: Boolean,
                default: false,
            },
            selectMode: {
                type: String,
                default: 'multi',
            },
            activeCategories: {
                type: Array,
                default: () => ['image', 'video'],
            },
        },
        data() {
            return {
                groupList: [],
                dataSource: [],
                category: this.activeCategories[0],
                progress: false,
                pagination: {
                    total: 0,
                    current: 1,
                    pageSize: 18,
                    pageSizeOptions: ['6', '18', '24'],
                    showSizeChanger: true,
                    onChange: this.onPageChange,
                    onShowSizeChange: this.onPageChange,
                    showTotal: (total, range) => {
                        return '第' + range[0] + '-' + range[1] + '条，共' + total + '条记录';
                    },
                },
            };
        },
        computed: {
            sVisible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit('change', val);
                },
            },
        },
        created() {
            this.queryParam.type = FILE_TYPE[this.category];
            this.getGroupList();
            this.loadData();
        },
        methods: {
            getPage,
            showManager() {
                this.visible = true;
            },
            deleteGroup(item) {
                deleteMaterialGroup({ ids: item.id })
                    .then(res => {
                        const { success, message } = res;
                        if (success) {
                            this.$message.success('删除成功');
                            this.getGroupList();
                        } else {
                            this.$message.error('删除失败：' + message);
                        }
                    })
                    .catch(e => {
                        this.$message.error('删除错误：' + e.message);
                    });
            },
            addGroup(item, category) {
                addMaterialGroup({ name: item.name, type: FILE_TYPE[category] }).then(res => {
                    const { success } = res;
                    if (success) {
                        this.$message.success('新增分组成功');
                        this.getGroupList();
                    }
                });
            },
            renameGroup(groupId, name) {
                renameMaterialGroup(groupId, name).then(res => {
                    const { success, msg } = res;
                    if (success) {
                        this.getGroupList();
                    }
                    this.$message.info(msg);
                });
            },
            getGroupList() {
                getMaterialGroupList({ type: FILE_TYPE[this.category] }).then(res => {
                    const { success, data } = res;
                    if (success) {
                        this.groupList = data;
                    }
                });
            },
            onCategoryChange(category) {
                this.category = category;
                this.queryParam.type = FILE_TYPE[category];
                this.queryParam.materialGroupId = undefined;
                this.getGroupList();
                this.loadData();
            },
            onUploadProgress(event) {
                const percent = Math.ceil((event.loaded / event.total) * 100);
                this.progress = {
                    type: percent < 100 ? 'progress' : 'loading',
                    text: percent < 100 ? '上传素材中...' : '上传完成，准备生成缩略图',
                    percent,
                };
            },
            onThumbProgress() {
                this.progress = {
                    type: 'loading',
                    text: '正在生成缩略图',
                };
            },
            onUpload(file, group) {
                const groupId = group === 'all' ? undefined : group;
                uploadMaterial(file, groupId, this.onUploadProgress)
                    .then(res => {
                        const { success, data } = res;
                        if (success) {
                            this.onThumbProgress();
                            return [data.materialId, file];
                        }
                    })
                    .then(async ([materialId, file]) => {
                        // 生成缩略图
                        const objUrl = URL.createObjectURL(file);
                        const thumbConfig = {
                            maxWidth: 400,
                            fileType: this.category,
                            fileName: file.name.split('.')[0] + '.png',
                        };
                        const thumbFile = await generateThumb(objUrl, thumbConfig);
                        return [materialId, thumbFile];
                    })
                    .then(async ([materialId, thumbFile]) => {
                        // 上传缩略图
                        const response = await uploadMaterialThumb(thumbFile, materialId, this.onUploadThumbProgress);
                        return response;
                    })
                    //   .then(res => { // 上传结果
                    //   const { success } = res
                    //   if (!success) {
                    //     this.$message.success('上传成功')
                    //   }
                    // })
                    .finally(() => {
                        this.progress = false;
                        this.$message.success('上传成功');
                        this.loadData();
                    });
            },
            onGroupChange(group) {
                this.queryParam.materialGroupId = group === 'all' ? undefined : group;
                this.queryParam.keyword = undefined;
                this.loadData();
            },
            onSearch(keyword, groupId, category) {
                this.queryParam.materialGroupId = groupId === 'all' ? undefined : groupId;
                this.queryParam.type = FILE_TYPE[category];
                this.queryParam.keyword = keyword;
                this.loadData();
            },
            onDelete(materialIds) {
                const ids = materialIds.join(',');
                deleteMaterial(ids).then(res => {
                    const { success } = res;
                    if (success) {
                        this.$message.success('删除成功');
                        this.loadData();
                    }
                });
            },
            onMove(groupId, ids) {
                const idsStr = ids.join(',');
                moveMaterialToGroup(groupId, idsStr).then(res => {
                    const { success, msg } = res;
                    if (success) {
                        this.loadData();
                    }
                    this.$message.info(msg);
                });
            },
            onMaterialRename(id, name) {
                renameMaterial(id, name).then(res => {
                    const { success } = res;
                    if (success) {
                        this.loadData();
                        this.$message.success('修改成功');
                    }
                });
            },
            onConfirm(data) {
                this.$emit('confirm', data);
            },
        },
    };
</script>
