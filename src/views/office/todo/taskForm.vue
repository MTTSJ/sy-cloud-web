<template>
    <a-card :bordered="false" :loading="cardLoading">
        <a-spin :spinning="spinningLoading">
            <div>
                <a-button
                    class="but_item"
                    type="dashed"
                    @click="returnPage"
                    icon="rollback"
                    :loading="butLoading"
                >
                    返回
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenSubmit"
                    :disabled="buttonList.submitBtn === 'N'"
                    type="primary"
                    icon="check"
                >
                    提交
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleSave"
                    :disabled="buttonList.saveBtn === 'N'"
                >
                    保存
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenBack"
                    :disabled="buttonList.backBtn === 'N'"
                >
                    退回
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenTurn"
                    :disabled="buttonList.turnBtn === 'N'"
                >
                    转办
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenEntrust"
                    :disabled="buttonList.entrustBtn === 'N'"
                >
                    委托
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenEnd"
                    :disabled="buttonList.endBtn === 'N'"
                >
                    终止
                </a-button>
                <a-button
                    class="but_item"
                    @click="$refs.tracking.tracking(recordData.procIns.id)"
                    :disabled="buttonList.traceBtn === 'N'"
                >
                    追踪
                </a-button>
                <a-popconfirm
                    placement="top"
                    :title="'确定挂起该任务？'"
                    @confirm="() => handleSuspend()"
                    :disabled="buttonList.suspendBtn === 'N'"
                >
                    <a-button class="but_item" :disabled="buttonList.suspendBtn === 'N'">
                        挂起
                    </a-button>
                </a-popconfirm>
                <a-button
                    class="but_item"
                    @click="handleOpenJump"
                    :disabled="buttonList.jumpBtn === 'N'"
                >
                    跳转
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenAddSign"
                    :disabled="buttonList.addSignBtn === 'N'"
                >
                    加签
                </a-button>
                <a-button
                    class="but_item"
                    @click="handleOpenDeleteSign"
                    :disabled="buttonList.deleteSignBtn === 'N'"
                >
                    减签
                </a-button>
                <a-button class="but_item" @click="handlePrintRow">打印</a-button>
            </div>
            <div>
                <submit
                    ref="submit"
                    @close="returnPage"
                    v-if="buttonList.submitBtn === 'Y'"
                />
                <back
                    ref="back"
                    @close="returnPage"
                    v-if="buttonList.backBtn === 'Y'"
                />
                <turn
                    ref="turn"
                    @close="returnPage"
                    v-if="buttonList.turnBtn === 'Y'"
                />
                <entrust
                    ref="entrust"
                    @close="returnPage"
                    v-if="buttonList.entrustBtn === 'Y'"
                />
                <end ref="end" @close="returnPage" v-if="buttonList.endBtn === 'Y'" />
                <tracking ref="tracking" v-if="buttonList.traceBtn === 'Y'" />
                <jump
                    ref="jump"
                    @close="returnPage"
                    v-if="buttonList.jumpBtn === 'Y'"
                />
                <add-sign
                    ref="addSign"
                    @close="returnPage"
                    v-if="buttonList.addSignBtn === 'Y'"
                />
                <delete-sign
                    ref="deleteSign"
                    @close="returnPage"
                    v-if="buttonList.deleteSignBtn === 'Y'"
                />
            </div>
            <div id="printDiv">
                <component
                    v-if="isCustomForm"
                    ref="customFormRef"
                    :is="allCustomFormComps[formCompKey]"
                ></component>

                <k-form-build v-else ref="kfb" :value="jsonData" />
            </div>
        </a-spin>
    </a-card>
</template>

<script>
    import { formTaskFormData } from '@/api/modular/flowable/formManage';
    import {
        handleTaskSave,
        handleTaskTaskData,
        handleTaskSuspend,
    } from '@/api/modular/flowable/handleTaskManage';
    import { buttonTrace } from '@/api/modular/flowable/buttonManage';
    // 导入全部自定义表单
    import allCustomForm from '@/views/main/customForm/index.js';
    import Print from 'print-js';
    // 导入按钮功能的界面
    import submit from '../task/submit';
    import back from '../task/back';
    import turn from '../task/turn';
    import entrust from '../task/entrust';
    import end from '../task/end';
    // import trackingForm from '../todoTask/trackingForm'
    import tracking from '@/views/flow/tracking/tracking';
    import jump from '../task/jump';
    import addSign from '../task/addSign';
    import deleteSign from '../task/deleteSign';

    export default {
        components: {
            submit,
            back,
            turn,
            entrust,
            end,
            tracking,
            jump,
            addSign,
            deleteSign,
        },
        data() {
            return {
                allCustomFormComps: allCustomForm,
                jsonData: {},
                visible: false,
                confirmLoading: false,
                spinningLoading: false,
                cardLoading: false,
                processDefinitionId: '',
                butLoading: false,
                buttonList: {},
                recordData: [],
                // 是否为自行开发表单
                isCustomForm: false,
                formCompKey: '',
            };
        },
        methods: {
            /**
             * 初始化方法
             */
            open(record) {
                this.recordData = record;
                this.formTaskFormDataTaskData(record);
                this.buttonTrace(record);
            },
            /*
             * 判断字符串是否为 JSON
             * return Boolean
             */
            isJSON(str) {
                if (typeof str === 'string') {
                    try {
                        const obj = JSON.parse(str);
                        if (typeof obj === 'object' && obj) {
                            return true;
                        } else {
                            return false;
                        }
                    } catch (e) {
                        // console.log('error：' + str + '!!!' + e)
                        return false;
                    }
                }
                console.log('It is not a string!');
            },
            /**
             * 当前任务的任务表单及数据
             */
            formTaskFormDataTaskData(record) {
                this.cardLoading = true;
                const values = {};
                values.processDefinitionId = record.procIns.procDef.id;
                values.actId = record.activityId;
                formTaskFormData(values)
                    .then((res) => {
                        this.cardLoading = false;
                        if (!res.success) {
                            this.$message.error(res.message);
                            this.returnPage();
                            return;
                        }

                        this.isCustomForm = !this.isJSON(res.data);

                        if (this.isCustomForm) {
                            this.jsonData = {};
                            this.formCompKey = res.data;
                            this.getTaskData(record);
                        } else {
                            this.jsonData = JSON.parse(res.data);
                            this.getTaskData(record);
                        }

                        // eslint-disable-next-line handle-callback-err
                    })
                    .catch(() => {
                        this.jsonData = {};
                    });
            },
            /**
             * 获取表单数据接口
             */
            getTaskData(params) {
                this.spinningLoading = true;

                handleTaskTaskData({ taskId: params.id }).then((res) => {
                    this.spinningLoading = false;
                    if (!res.success) {
                        this.$message.error(res.message);
                        return;
                    }

                    if (this.isCustomForm) {
                        this.$refs.customFormRef.init(res.data.formData);
                    } else {
                        this.$refs.kfb.setData(JSON.parse(res.data.formData));
                    }

                    // if (res.success) {
                    //   this.$refs.kfb.setData(JSON.parse(res.data.formData))
                    // } else {
                    //   this.$message.error(res.message)
                    // }
                });
            },
            /**
             * 获取当前任务的按钮
             */
            buttonTrace(record) {
                buttonTrace({
                    actId: record.activityId,
                    processDefinitionId: record.procIns.procDef.id,
                }).then((res) => {
                    this.buttonList = res.data;
                });
            },
            /**
             * 返回并清空已生成的表单
             */
            returnPage() {
                this.$emit('close');
                this.jsonData = {};
            },
            // TODO: 自定义列表处理
            handleOpenSubmit() {
                if (this.isCustomForm) {
                    // 自定义表单 do something
                    this.$refs.customFormRef
                        .getDataForSubmit()
                        .then((values) => {
                            const formData = {};
                            formData.formData = JSON.stringify(values);
                            this.$refs.submit.open(this.recordData, this.buttonList, formData);
                        })
                        .catch(() => {});
                } else {
                    this.$refs.kfb
                        .getData()
                        .then((values) => {
                            const formData = {};
                            formData.formData = JSON.stringify(values);
                            this.$refs.submit.open(this.recordData, this.buttonList, formData);
                        })
                        .catch(() => {});
                }
            },

            /**
             * 保存
             */
            handleSave() {
                if (this.isCustomForm) {
                    this.$refs.customFormRef
                        .getDataForDraft()
                        .then((values) => {
                            this.postHandleSave(values);
                        })
                        .catch(() => {
                            this.$message.error('获取表单数据失败');
                        });
                } else {
                    this.$refs.kfb
                        .getData()
                        .then((values) => {
                            this.postHandleSave(values);
                        })
                        .catch(() => {
                            this.$message.error('获取表单数据失败');
                        });
                }
            },
            /*
             * 保存操作接口
             */
            postHandleSave(values) {
                values.processDefinitionId = this.recordData.processDefinitionId;
                const formData = {};
                formData.formData = JSON.stringify(values);
                const req = {};
                req.taskId = this.recordData.id;
                req.variables = formData;

                this.spinningLoading = true;
                handleTaskSave(req)
                    .then((res) => {
                        this.spinningLoading = false;
                        if (res.success) {
                            this.$message.success('保存成功');
                            this.returnPage();
                        } else {
                            this.$message.error('保存失败：' + res.message);
                        }
                    })
                    .catch(() => {
                        this.spinningLoading = false;
                    });
            },
            handleOpenBack() {
                this.$refs.back.open(this.recordData);
            },
            handleOpenTurn() {
                this.$refs.turn.open(this.recordData);
            },
            handleOpenEntrust() {
                this.$refs.entrust.open(this.recordData);
            },
            handleOpenEnd() {
                this.$refs.end.open(this.recordData);
            },
            handleSuspend() {
                this.spinningLoading = true;
                handleTaskSuspend({ taskId: this.recordData.id }).then((res) => {
                    this.spinningLoading = false;
                    if (res.success) {
                        this.$message.success('挂起成功');
                        this.returnPage();
                    } else {
                        this.$message.error('挂起失败：' + res.message);
                    }
                });
            },
            handleOpenJump() {
                this.$refs.jump.open(this.recordData);
            },
            handleOpenAddSign() {
                this.$refs.addSign.open(this.recordData);
            },
            handleOpenDeleteSign() {
                this.$refs.deleteSign.open(this.recordData);
            },
            handlePrintRow(index, row) {
                Print({ printable: 'printDiv', type: 'html', targetStyles: ['*'] });
            },
        },
    };
</script>
<style>
.but_item {
  margin-right: 10px;
  margin-bottom: 20px;
}
</style>
