<template>
    <div style="background-color: #f3f3f3" class="material material-dialog">
        <a-card :bordered="false">
            <a-tabs v-model="tabs" @change="dialogOpened" default-active-key="image">
                <a-tab-pane v-for="v in tab_list" :key="v.name" :tab="v.label">
                    <div style="margin-bottom: 12px" class="left-panel">
                        <a-row>
                            <a-col :span="5">
                                <a-button type="primary" @click="$refs.groupAddForm.add(v.name)">
                                    添加分组
                                </a-button>
                            </a-col>
                            <a-col :span="7">全部</a-col>
                            <a-col :span="12" style="text-align: right">
                                <a-input-search
                                    placeholder="请输入名称搜索"
                                    style="width: 200px; margin-right: 20px"
                                    @search="dialogOpened"
                                />
                                <a-checkbox
                                    v-model="selectAll"
                                    size="small"
                                    style="margin-right: 12px; margin-bottom: 0"
                                    @change="selectAllChange"
                                >
                                    全选
                                </a-checkbox>
                                <a-button
                                    v-if="isRecycle"
                                    :loading="deleteLoading"
                                    size="small"
                                    style="margin-right: 12px"
                                    @click="deleteItems(2)"
                                >
                                    还原
                                </a-button>
                                <a-button :loading="deleteLoading" style="margin-right: 12px" @click="deleteItems(isRecycle ? 3 : 1)">
                                    删除
                                </a-button>
                                <a-dropdown-button v-if="!isRecycle" v-loading="moveLoading" :split-button="true" @command="moveItems">
                                    <span>移动至</span>
                                    <a-menu slot="dropdown" style="height: 250px; overflow-y: scroll">
                                        <a-menu-item v-for="(item, index1) in groupList" :key="index1" :command="index1">
                                            {{ item.name }}
                                        </a-menu-item>
                                    </a-menu>
                                    <a-icon slot="icon" type="down" />
                                </a-dropdown-button>
                            </a-col>
                        </a-row>
                        <a-row style="margin-bottom: 10px">
                            <a-col :span="5">
                                <!-- <div style="min-height: 68vh;margin-right: 15px;margin-top: 15px; border: 1px solid #e3e3e3"> -->
                                <a-card style="min-height: 68vh; margin-right: 15px; margin-top: 15px;" class="left-menu">
                                    <a-menu mode="inline">
                                        <a-menu-item>
                                            <a-icon type="profile" />
                                            全部
                                        </a-menu-item>
                                        <a-menu-item v-for="(item, index1) in groupList" :key="index1" class="space-between">
                                            <span>
                                                <a-icon type="profile" />
                                                {{ item.name }}
                                            </span>
                                            <span>
                                                <a @click="$refs.groupEditForm.edit(item)">编辑</a>
                                                <a-divider type="vertical" />
                                                <a-popconfirm title="确认要删除吗？" @confirm="() => deleteGroup(item)">
                                                    <a href="javascript:">删除</a>
                                                </a-popconfirm>
                                                <!-- <a-button size="small" type="link" @click="$refs.groupEditForm.edit(item)">
                          编辑
                        </a-button>
                        <template style="margin: 0 1px; color: #409eff">|</template>
                        <a-button size="small" type="link">
                          <a-popconfirm title="确认要删除吗？" @confirm="() => deleteGroup(item)">
                            <a href="javascript:">删除</a>
                          </a-popconfirm>
                        </a-button> -->
                                            </span>
                                        </a-menu-item>
                                    </a-menu>
                                    <!-- </div> -->
                                </a-card>
                            </a-col>
                            <a-col :span="19">
                                <a-card style="margin-top: 15px;">
                                    <div style="margin-bottom: 15px;" flex="main:left cross:center">
                                        <a-upload
                                            name="file"
                                            :multiple="true"
                                            action="http://localhost:10001/mate-system/material/upload"
                                            :headers="headers"
                                            @change="handleChange"
                                        >
                                            <a-button type="primary">
                                                <a-icon type="upload" />
                                                上传图片
                                            </a-button>
                                        </a-upload>
                                        <span style="margin-left: 15px; margin-right: 5px">大小不要超过10M</span>
                                        <a-tooltip placement="top">
                                            <a-icon type="read" />
                                            <template slot="title">
                                                <span>大小不要超过10M，支持图片类型如：jpg、png、gif、jpeg等</span>
                                            </template>
                                        </a-tooltip>
                                    </div>
                                    <div flex="dir:top" class="box">
                                        <div class="material-list">
                                            <a-table
                                                ref="table"
                                                size="middle"
                                                :rowKey="rowKey"
                                                :dataSource="dataSource"
                                                :pagination="pagination"
                                                :loading="loading"
                                                @change="handleTableChange"
                                                :alert="{ show: true, clear: true }"
                                            ></a-table>
                                            <div v-for="(item, index) in dataSource" class="material-item" :key="index">
                                                <a-tooltip placement="top">
                                                    <div
                                                        :key="index"
                                                        :class="'material-item' + (item.selected ? ' selected' : ' unselected')"
                                                        @click="selectItem(item)"
                                                    >
                                                        <!-- 图片 -->
                                                        <img class="material-img" :src="item.url" style="width: 140px; height: 140px" />
                                                        <!-- 名称 -->
                                                        <div flex="dir:left cross:center" style="margin-top: 5px; height: 20px">
                                                            <div class="material-name">{{ item.name }}</div>
                                                            <div style="margin: 0 5px">|</div>
                                                            <a-button type="link" size="small" style="padding: 0">
                                                                更名
                                                            </a-button>
                                                        </div>
                                                    </div>
                                                    <template slot="title">
                                                        <span>{{ item.name }}</span>
                                                    </template>
                                                </a-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </a-card>
                            </a-col>
                        </a-row>
                    </div>
                </a-tab-pane>
            </a-tabs>
            <group-add-form ref="groupAddForm" @ok="handleOk" />
            <group-edit-form ref="groupEditForm" @ok="handleOk" />
        </a-card>
    </div>
</template>

<script>
    import groupAddForm from './groupAddForm';
    import groupEditForm from './groupEditForm';
    import { deleteMaterialGroup, getMaterialGroupList, getPage } from '@/api/modular/system/materialManage';
    import { TablePageMixin } from '@/mixins/';
    // const dataSource = []
    // for (let i = 0; i < 10; i++) {
    //   dataSource.push({
    //     id: i,
    //     selected: false,
    //     title: 'Alipay',
    //     avatar: 'https://cdn.mate.vip/matecloud.svg',
    //     content:
    //       '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
    //   })
    // }
    export default {
        components: {
            groupAddForm,
            groupEditForm,
        },
        mixins: [TablePageMixin],
        data() {
            return {
                getPage: getPage,
                imageUrl: '',
                tab_list: [
                    { label: '图片', name: 'image' },
                    { label: '视频', name: 'video' },
                ],
                tabs: 'image',
                isRecycle: 0,
                keyword: '',
                fileType: 0,
                canvas: null,
                uploading: false,
                dialogVisible: false,
                loading: false,
                loadingMore: false,
                noMore: false,
                materials: [],
                checkedMaterials: [],
                uploadParams: {},
                uploadFields: {},
                uploadCompleteFilesNum: 0,
                uploadFilesNum: 0,
                page: 0,
                addGroupVisible: false,
                noMall: true,
                groupList: [],
                groupItem: [],
                groupListLoading: false,
                groupForm: {
                    id: null,
                    name: '',
                },
                groupFormRule: {
                    name: [{ required: true, message: '请填写分组名称' }],
                },
                groupFormLoading: false,
                selectAll: false,
                deleteLoading: false,
                moveLoading: false,
                currentAttachmentGroupId: null,
                video: null,
                // 查询参数
                search: {
                    current: 1,
                    size: 10,
                    isRecycle: 0,
                    type: undefined,
                    name: undefined,
                    attachmentGroupId: undefined,
                },
                total: 0,

                addPicVisible: false,
                picForm: {
                    id: null,
                    name: '',
                },
                picFormRule: {
                    name: [{ required: true, message: '请填写名称' }],
                },
                picFormLoading: false,
                // TODO headers
                headers: {
                    authorization: 'authorization-text',
                },
            };
        },
        mounted() {
            this.dialogOpened();
        },
        methods: {
            recoverClick() {
                this.isRecycle = 1;
                this.dialogOpened();
            },
            dialogOpened() {
                this.page = 1;
                this.loading = true;
                this.loadGroups();
                // this.loadList({})
            },
            deleteItems(type) {
                const itemIds = [];
                for (const i in this.attachments) {
                    if (this.attachments[i].selected) {
                        itemIds.push(this.attachments[i].id);
                    }
                }
                if (!itemIds.length) {
                    this.$message.warning('请先选择需要处理的图片。');
                    return;
                }

                let title;
                switch (type) {
                case 1:
                    title = '是否确认将选中素材放入回收站中？删除的素材可通过回收站还原';
                    break;
                case 2:
                    title = '确认还原选择素材？';
                    break;
                case 3:
                    title = '素材删除后将无法恢复，您确认要彻底删除所选素材吗？';
                    break;
                default:
                    title = '';
                    break;
                }
                this.$confirm(title, '提示', {
                    type: 'warning',
                })
                    .then(() => {
                        this.deleteLoading = true;
                        // this.$request({
                        //   params: {
                        //     r: 'common/attachment/delete',
                        //   },
                        //   method: 'post',
                        //   data: {
                        //     ids: itemIds,
                        //     //type 1回收 2还原 3删除
                        //     type,
                        //   },
                        // })
                        //   deleteAttachment(itemIds.join(','), type)
                        //     .then(e => {
                        //       this.deleteLoading = false
                        //       if (e.code === 200) {
                        //         this.$message.success(e.msg)
                        //         for (let i in itemIds) {
                        //           for (let j in this.attachments) {
                        //             if (this.attachments[j].id == itemIds[i]) {
                        //               this.attachments.splice(j, 1)
                        //               break
                        //             }
                        //           }
                        //         }
                        //       } else {
                        //         this.$message.error(e.msg)
                        //       }
                        //     })
                        //     .catch(e => {
                        //       this.deleteLoading = false
                        //     })
                    })
                    .catch(() => {});
            },
            selectAllChange(value) {
                console.log('====mateP====selectAllChange');
                for (const i in this.materials) {
                    this.materials[i].selected = value.target.checked;
                }
            },
            selectItem(item) {
                item.selected = !item.selected;
                console.log('====mateP====' + item.selected);
            },
            moveItems(index) {
                const itemIds = [];
                for (const i in this.attachments) {
                    if (this.attachments[i].selected) {
                        itemIds.push(this.attachments[i].id);
                    }
                }
                if (!itemIds.length) {
                    this.$message.warning('请先选择需要移动的图片。');
                    return;
                }
                this.$confirm('确认移动所选的' + itemIds.length + '张图片？', '提示', {
                    type: 'warning',
                })
                    .then(() => {
                        this.moveLoading = true;
                        // this.$request({
                        //   params: {
                        //     r: 'common/attachment/move',
                        //   },
                        //   method: 'post',
                        //   data: {
                        //     ids: itemIds,
                        //     attachmentGroupId: this.groupItem[index].id,
                        //   },
                        // })
                        //   moveAttachment(itemIds.join(','), this.groupItem[index].id)
                        //     .then(e => {
                        //       this.moveLoading = false
                        //       if (e.code === 200) {
                        //         this.$message.success(e.msg)
                        //         this.switchGroup(index)
                        //       } else {
                        //         this.$message.error(e.msg)
                        //       }
                        //     })
                        //     .catch(e => {
                        //       this.moveLoading = false
                        //     })
                    })
                    .catch(() => {});
            },
            /**
             * 根据tabs判断fileType
             */
            getType() {
                if (this.tabs === 'video') {
                    this.fileType = 1;
                } else {
                    this.fileType = 0;
                }
            },
            loadGroups() {
                this.groupListLoading = true;
                this.getType();
                getMaterialGroupList({ type: this.fileType }).then(res => {
                    this.groupListLoading = false;
                    if (!res.success) {
                        return;
                    }
                    this.groupList = res.data;
                });
            },
            deleteGroup(record) {
                deleteMaterialGroup({ ids: record.id })
                    .then(res => {
                        if (res.success) {
                            this.$message.success('删除成功');
                            this.reloadTable();
                        } else {
                            this.$message.error('删除失败：' + res.message);
                        }
                    })
                    .catch(err => {
                        this.$message.error('删除错误：' + err.message);
                    });
            },
            showPicModel(index) {
                this.picForm = {
                    id: this.attachments[index].id,
                    name: this.attachments[index].name,
                    edit_index: index,
                };
                this.addPicVisible = true;
            },

            picFormSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.picFormLoading = true;
                        // this.$request({
                        //   params: {
                        //     r: 'common/attachment/rename',
                        //   },
                        //   method: 'post',
                        //   data: Object.assign({}, this.picForm),
                        // })
                        //   renameAttachment(this.picForm.id, this.picForm.name)
                        //     .then(e => {
                        //       this.picFormLoading = false
                        //       if (e.code === 200) {
                        //         this.$message.success(e.msg)
                        //         this.addPicVisible = false
                        //         this.attachments[this.picForm.edit_index].name = this.picForm.name
                        //       } else {
                        //         this.$message.error(e.msg)
                        //       }
                        //     })
                        //     .catch(e => {
                        //       this.picFormLoading = false
                        //     })
                    }
                });
            },

            groupFormSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.groupFormLoading = true;
                        // this.$request({
                        //   params: {
                        //     r: 'common/attachment/group-update',
                        //   },
                        //   method: 'post',
                        //   data: Object.assign({}, this.groupForm, { type: this.tabs }),
                        // })
                        //   setAttachmentGroup(this.groupForm.id, this.groupForm.name, this.tabs)
                        //     .then(e => {
                        //       this.groupFormLoading = false
                        //       if (e.code === 200) {
                        //         this.$message.success(e.msg)
                        //         this.addGroupVisible = false
                        //         if (this.groupForm.edit_index > -1) {
                        //           this.groupItem[this.groupForm.edit_index] = e.data
                        //         } else {
                        //           this.groupList.push(e.data)
                        //         }
                        //       } else {
                        //         this.$message.error(e.msg)
                        //       }
                        //     })
                        //     .catch(e => {
                        //       this.groupFormLoading = false
                        //     })
                    }
                });
            },
            switchGroup(index) {
                this.attachments = [];
                this.page = 0;
                this.noMore = false;
                this.loading = true;
                this.uploadParams = {
                    attachmentGroupId: index > -1 ? this.groupItem[index].id : null,
                };
                this.currentAttachmentGroupId = index > -1 ? this.groupItem[index].id : null;
                // this.loadList({})
            },
            // loadList(params) {
            //   this.noMore = false
            //   this.selectAll = false
            //   this.getType()
            //   this.search.type = this.tabs
            //   this.search.name = this.keyword
            //   this.search.materialGroupId = this.currentAttachmentGroupId
            //   getMaterialList(this.search).then(res => {
            //     for (const i in res.data.records) {
            //       res.data.records[i].checked = false
            //       res.data.records[i].selected = false
            //       res.data.records[i].duration = null
            //     }
            //     this.materials = res.data.records
            //     this.total = res.data.total
            //   })
            //   getAttachmentList(this.search)
            //     .then(e => {
            //       // debugger
            //       if (e.code === 200) {
            //         // if (!e.data.length) {
            //         //   this.noMore = true
            //         // }
            //         for (let i in e.data.records) {
            //           e.data.records[i].checked = false
            //           e.data.records[i].selected = false
            //           e.data.records[i].duration = null
            //         }
            //         //this.attachments = this.attachments.concat(e.data.data.list);
            //         this.attachments = e.data.records
            //         this.total = e.data.total
            //         this.checkedAttachments = []
            //         this.loading = false
            //         this.loadingMore = false
            //         this.updateVideo()
            //       } else {
            //         this.$message.error(e.data.msg)
            //         this.dialogVisible = false
            //       }
            //     })
            //     .catch(e => {})
            // },
            confirm() {
                this.$emit('selected', this.checkedAttachments, this.params);
                this.dialogVisible = false;
                const urls = [];
                for (const i in this.checkedAttachments) {
                    urls.push(this.checkedAttachments[i].url);
                }
                for (const i in this.attachments) {
                    this.attachments[i].checked = false;
                }
                this.checkedAttachments = [];
                if (!urls.length) {
                    return;
                }
                if (this.multiple) {
                    this.$emit('input', urls);
                } else {
                    this.$emit('input', urls[0]);
                }
            },
            handleStart(files) {
                console.log('start', files);
                this.uploading = true;
                this.uploadFilesNum = files.length;
                this.uploadCompleteFilesNum = 0;
            },
            handleSuccess(file) {
                console.log('handleSuccess', file, file.response.data);
                if (file.response && file.response.data && file.response.code === 200) {
                    // 视频：video/map4, 图片 images/jpeg
                    const fileType = file.rawFile.type;
                    let type;
                    if (fileType.includes('image')) {
                        type = 1;
                    } else if (fileType.includes('video')) {
                        type = 2;
                    } else {
                        type = 3;
                    }
                    const newItem = {
                        checked: false,
                        selected: false,
                        name: file.rawFile.name,
                        type: type,
                        url: file.response.data.url,
                        fileName: file.response.data.fileName,
                        duration: null,
                        cover_pic_src: null,
                    };
                    // const newItem = {
                    //   checked: false,
                    //   selected: false,
                    //   created_at: file.response.data.data.created_at,
                    //   deleted_at: file.response.data.data.deleted_at,
                    //   id: `${file.response.data.data.id}`,
                    //   is_delete: file.response.data.data.is_delete,
                    //   mall_id: file.response.data.data.mall_id,
                    //   name: file.response.data.data.name,
                    //   size: file.response.data.data.size,
                    //   storage_id: file.response.data.data.storage_id,
                    //   thumb_url: file.response.data.data.thumb_url,
                    //   type: file.response.data.data.type,
                    //   updated_at: file.response.data.data.updated_at,
                    //   url: file.response.data.data.url,
                    //   user_id: file.response.data.data.user_id,
                    //   duration: null,
                    //   cover_pic_src: null,
                    // }

                    this.attachments.unshift(newItem);
                    this.uploadCompleteFilesNum++;
                    this.updateVideo();
                }
            },
            handleComplete(files) {
                console.log('handleComplete', files);
                this.uploading = false;
                if (this.simple) {
                    const urls = [];
                    const attachments = [];
                    for (const i in files) {
                        if (files[i].response.data && files[i].response.data.code === 0) {
                            urls.push(files[i].response.data.data.url);
                            attachments.push(files[i].response.data.data);
                        }
                    }
                    if (!urls.length) {
                        return;
                    }
                    this.dialogVisible = false;
                    this.$emit('selected', attachments, this.params);
                    if (this.multiple) {
                        this.$emit('input', urls);
                    } else {
                        this.$emit('input', urls[0]);
                    }
                }
            },
            handleLoadMore(currentPage) {
                if (this.noMore) {
                    return;
                }
                this.search.current = currentPage;
                this.loading = true;
                this.loadingMore = true;
                this.loadList({});
            },
            updateVideo() {
                if (!this.canvas) {
                    this.canvas = document.getElementById('material-canvas');
                }
                for (const i in this.attachments) {
                    if (this.attachments[i].type === 2) {
                        if (this.attachments[i].duration) {
                            continue;
                        }
                        let times = 0;
                        let video = null;
                        const maxRetry = 10;
                        const id = 'app_material_' + this._uid + '_' + i;
                        const timer = setInterval(() => {
                            times++;
                            if (times >= maxRetry) {
                                clearInterval(timer);
                            }
                            if (!video) {
                                video = document.getElementById(id);
                            }
                            if (!video) {
                                return;
                            }
                            try {
                                const zoom = 0.15;
                                this.canvas.width = video.videoWidth * zoom;
                                this.canvas.height = video.videoHeight * zoom;
                                this.canvas.getContext('2d').drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
                                this.attachments[i].cover_pic_src = this.canvas.toDataURL('image/jpg');
                            } catch (e) {
                                console.warn('获取视频封面异常: ', e);
                            }

                            if (video.duration && !isNaN(video.duration)) {
                                let m = Math.trunc(video.duration / 60);
                                let s = Math.trunc(video.duration) % 60;
                                m = m < 10 ? `0${m}` : `${m}`;
                                s = s < 10 ? `0${s}` : `${s}`;
                                this.attachments[i].duration = `${m}:${s}`;
                                clearInterval(timer);
                            }
                        }, 500);
                    }
                }
            },
            handleOk() {
                this.reloadTable();
            },
            handleChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    this.$message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    this.$message.error(`${info.file.name} file upload failed.`);
                }
            },
        },
    };
</script>

<style lang="less" scoped>
.material-list {
  // width: 100px;
  padding: 5px;
}

.material-list * {
  box-sizing: border-box;
}

.material-list:after {
  display: block;
  clear: both;
  content: ' ';
}

.material-item {
  position: relative;
  display: inline-block;
  // float: left;
  width: 160px;
  height: 180px;
  padding: 10px 10px 0;
  margin: 7.5px;
  text-align: center;
  cursor: pointer;
}
// .material-item {
//   position: relative;
//   display: inline-block;
//   height: 180px;
//   padding: 10px 10px 0;
//   margin: 7.5px;
//   text-align: center;
//   cursor: pointer;
//   // width: 100%;
// }
.material-item .material-name {
  display: -webkit-box;
  margin-top: 0px;
  margin-right: auto;
  overflow: hidden;
  font-size: 13px;
  color: #666666;
  text-overflow: ellipsis;
  width: 90px;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.material-item.checked,
.material-item.selected {
  background: #daf5ff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px #1ed0ff;
}

.material-item.unselected {
  background: #fafafa;
  border-radius: 5px;
  box-shadow: 0 0 0 1px #e8e8e8;
}

.material-item .material-img {
  display: block;
  margin: auto;
}
.space-between {
  display: flex;
  justify-content: space-between;
}
.left-menu /deep/ .ant-card-body {
  padding-right: 0;
  padding-left: 0;
}
.left-menu /deep/ .ant-menu-inline {
  border-right: 0;
}
.ant-menu-item {
  padding-left: 8px !important;
  padding-right: 8px;
}
.ant-divider,
.ant-divider-vertical {
  margin: 0 3px;
}
</style>
