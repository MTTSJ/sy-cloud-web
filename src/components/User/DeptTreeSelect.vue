<template>
    <a-card class="tree-card" :bordered="false" :loading="loading">
        <a-input-search
            v-model="searchValue"
            style="margin-bottom: 8px"
            placeholder="Search"
        />
        <a-tree
            v-if="treeData.length"
            class="tree"
            blockNode
            defaultExpandAll
            autoExpandParent
            :treeData="treeData"
            :replaceFields="{ title: 'title', key: 'id', value: 'id' }"
            @select="$emit('select', $event[0])"
        />
        <a-empty v-else :image="simpleImage" />
    </a-card>
</template>

<script>
    import { cloneDeep } from 'lodash-es';
    import { message, Empty } from 'ant-design-vue';
    import { getOrgTree } from '@/api/modular/system/orgManage';

    export default {
        name: 'DeptTreeSelect',
        data() {
            return {
                searchValue: '',
                data: [],
                loading: false,
                simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
            };
        },
        computed: {
            treeData() {
                const query = this.searchValue;
                const reg = new RegExp(query, 'g');
                const filter = (data) => {
                    const result = [];
                    for (const item of Array.isArray(data) ? data : [data]) {
                        const { title, children = [] } = item;
                        if (reg.test(title)) {
                            result.push(item);
                            item.children = filter(children);
                            item.title = this.$createElement('span', {
                                domProps: {
                                    innerHTML: query
                                        ? title.replace(query, `<span style="color: #f50">${query}</span>`)
                                        : title,
                                },
                            });
                        } else {
                            result.push(...filter(children));
                        }
                    }
                    return result;
                };
                return filter(cloneDeep(this.data));
            },
        },
        created() {
            this.loading = true;
            getOrgTree().then(({ data }) => {
                this.data = data;
            }).catch(e => {
                console.error(e);
                message.error('部门数据获取失败');
            }).finally(() => {
                this.loading = false;
            });
        },
    };
</script>

<style lang="less" scoped>
.tree-card {
  &::v-deep .ant-card-body {
    padding: 10px;
  }
}
.tree::v-deep {
  .ant-tree-node-content-wrapper {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
