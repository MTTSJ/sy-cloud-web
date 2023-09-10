<template>
    <div :class="['flow-containers', { 'view-mode': isView }]">
        <div class="page-header">
            <a-space class="left">
                <a-button icon="rollback" size="small" @click="$router.back()">返回</a-button>
                <a-upload
                    action=""
                    accept=".xml"
                    name="file"
                    style="display: inline-block"
                    :before-upload="openBpmn"
                    :showUploadList="false"
                >
                    <a-button size="small">
                        <a-icon type="upload" />
                        加载xml
                    </a-button>
                </a-upload>
                <a-tooltip title="新建">
                    <a-button size="small" icon="plus" @click="newDiagram" />
                </a-tooltip>
                <a-tooltip title="自适应屏幕">
                    <a-button size="small" icon="shrink" @click="fitViewport" />
                </a-tooltip>
                <a-tooltip title="放大">
                    <a-button size="small" icon="zoom-in" @click="zoomViewport(true)" />
                </a-tooltip>
                <a-tooltip title="缩小">
                    <a-button size="small" icon="zoom-out" @click="zoomViewport(false)" />
                </a-tooltip>
                <a-tooltip title="后退">
                    <a-button
                        icon="arrow-left"
                        size="small"
                        @click="modeler.get('commandStack').undo()"
                    />
                </a-tooltip>
                <a-tooltip title="前进">
                    <a-button
                        icon="arrow-right"
                        size="small"
                        @click="modeler.get('commandStack').redo()"
                    />
                </a-tooltip>
            </a-space>
            <a-space class="right">
                <a-button size="small" icon="download" @click="saveXML(true)">
                    下载xml
                </a-button>
                <a-button size="small" icon="picture" @click="saveImg('svg', true)">
                    下载svg
                </a-button>
                <a-button size="small" icon="save" type="primary" @click="save">
                    保存模型
                </a-button>
            </a-space>
        </div>
        <a-layout class="editor-section">
            <a-layout-content>
                <div ref="canvas" class="canvas" />
            </a-layout-content>
            <a-layout-sider
                width="300px"
                theme="light"
                style="width: 400px; min-height: 650px; background-color: #f0f2f5"
            >
                <panel
                    v-if="modeler"
                    :modeler="modeler"
                    :users="users"
                    :groups="groups"
                    :categorys="categorys"
                />
            </a-layout-sider>
        </a-layout>
    </div>
</template>

<script>
// 汉化
    import customTranslate from './common/customTranslate';
    import Modeler from 'bpmn-js/lib/Modeler';
    import panel from './PropertyPanel';
    import BpmData from './BpmData';
    import getInitStr from './flowable/init';
    // 引入flowable的节点文件
    import flowableModdle from './flowable/flowable.json';
    export default {
        name: 'VueBpmn',
        components: {
            panel,
        },
        props: {
            xml: {
                type: String,
                default: '',
            },
            users: {
                type: Array,
                default: () => [],
            },
            groups: {
                type: Array,
                default: () => [],
            },
            categorys: {
                type: Array,
                default: () => [],
            },
            isView: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                modeler: null,
                taskList: [],
                zoom: 1,
            };
        },
        watch: {
            xml: function(val) {
                if (val) {
                    this.createNewDiagram(val);
                }
            },
        },
        mounted() {
            // 生成实例
            this.modeler = new Modeler({
                container: this.$refs.canvas,
                additionalModules: [
                    {
                        translate: ['value', customTranslate],
                    },
                ],
                moddleExtensions: {
                    flowable: flowableModdle,
                },
            });
            // 新增流程定义
            if (!this.xml) {
                this.newDiagram();
            } else {
                this.createNewDiagram(this.xml);
            }
        },
        methods: {
            newDiagram() {
                this.createNewDiagram(getInitStr());
            },
            // 让图能自适应屏幕
            fitViewport() {
                this.zoom = this.modeler.get('canvas').zoom('fit-viewport');
                const bbox = document
                    .querySelector('.flow-containers .viewport')
                    .getBBox();
                const currentViewbox = this.modeler.get('canvas').viewbox();
                const elementMid = {
                    x: bbox.x + bbox.width / 2 - 65,
                    y: bbox.y + bbox.height / 2,
                };
                this.modeler.get('canvas').viewbox({
                    x: elementMid.x - currentViewbox.width / 2,
                    y: elementMid.y - currentViewbox.height / 2,
                    width: currentViewbox.width,
                    height: currentViewbox.height,
                });
                this.zoom = (bbox.width / currentViewbox.width) * 1.8;
            },
            // 放大缩小
            zoomViewport(zoomIn = true) {
                this.zoom = this.modeler.get('canvas').zoom();
                this.zoom += zoomIn ? 0.1 : -0.1;
                this.modeler.get('canvas').zoom(this.zoom);
            },
            async createNewDiagram(data) {
                // 将字符串转换成图显示出来
                // data = data.replace(/<!\[CDATA\[(.+?)]]>/g, '&lt;![CDATA[$1]]&gt;')
                data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function(match, str) {
                    return str.replace(/</g, '&lt;');
                });
                try {
                    await this.modeler.importXML(data);
                    this.adjustPalette();
                    this.fitViewport();
                    // this.fillColor()
                } catch (err) {
                    console.error(err.message, err.warnings);
                }
            },
            // 调整左侧工具栏排版
            adjustPalette() {
                try {
                    // 获取 bpmn 设计器实例
                    const canvas = this.$refs.canvas;
                    const djsPalette = canvas.children[0].children[1].children[4];
                    const djsPalStyle = {
                        width: '130px',
                        padding: '5px',
                        background: 'white',
                        left: '20px',
                        borderRadius: 0,
                    };
                    for (var key in djsPalStyle) {
                        djsPalette.style[key] = djsPalStyle[key];
                    }
                    const palette = djsPalette.children[0];
                    const allGroups = palette.children;
                    allGroups[0].style['display'] = 'none';
                    // 修改控件样式
                    for (var gKey in allGroups) {
                        const group = allGroups[gKey];
                        for (var cKey in group.children) {
                            const control = group.children[cKey];
                            const controlStyle = {
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                padding: '5px',
                            };
                            if (
                                control.className &&
                                control.dataset &&
                                control.className.indexOf('entry') !== -1
                            ) {
                                const controlProps = new BpmData().getControl(
                                    control.dataset.action,
                                );
                                control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${controlProps['title']}</div>`;
                                for (var csKey in controlStyle) {
                                    control.style[csKey] = controlStyle[csKey];
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            fillColor() {
                const canvas = this.modeler.get('canvas');
                this.modeler._definitions.rootElements[0].flowElements.forEach(n => {
                    if (n.$type === 'bpmn:UserTask') {
                        const completeTask = this.taskList.find(m => m.key === n.id) || {
                            completed: true,
                        };
                        const todoTask = this.taskList.find(m => !m.completed);
                        const endTask = this.taskList[this.taskList.length - 1];
                        if (completeTask) {
                            canvas.addMarker(
                                n.id,
                                completeTask.completed ? 'highlight' : 'highlight-todo',
                            );
            // eslint-disable-next-line no-unused-expressions
            n.outgoing?.forEach(nn => {
              const targetTask = this.taskList.find(
                m => m.key === nn.targetRef.id,
              );
              if (targetTask) {
                canvas.addMarker(
                  nn.id,
                  targetTask.completed ? 'highlight' : 'highlight-todo',
                );
              } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
                // canvas.addMarker(nn.id, 'highlight');
                canvas.addMarker(
                  nn.id,
                  completeTask.completed ? 'highlight' : 'highlight-todo',
                );
                canvas.addMarker(
                  nn.targetRef.id,
                  completeTask.completed ? 'highlight' : 'highlight-todo',
                );
              } else if (nn.targetRef.$type === 'bpmn:EndEvent') {
                if (!todoTask && endTask.key === n.id) {
                  canvas.addMarker(nn.id, 'highlight');
                  canvas.addMarker(nn.targetRef.id, 'highlight');
                }
                if (!completeTask.completed) {
                  canvas.addMarker(nn.id, 'highlight-todo');
                  canvas.addMarker(nn.targetRef.id, 'highlight-todo');
                }
              }
            });
                        }
                    } else if (n.$type === 'bpmn:ExclusiveGateway') {
                        n.outgoing.forEach(nn => {
                            const targetTask = this.taskList.find(
                                m => m.key === nn.targetRef.id,
                            );
                            if (targetTask) {
                                canvas.addMarker(
                                    nn.id,
                                    targetTask.completed ? 'highlight' : 'highlight-todo',
                                );
                            }
                        });
                    }
                    if (n.$type === 'bpmn:StartEvent') {
                        n.outgoing.forEach(nn => {
                            const completeTask = this.taskList.find(
                                m => m.key === nn.targetRef.id,
                            );
                            if (completeTask) {
                                canvas.addMarker(nn.id, 'highlight');
                                canvas.addMarker(n.id, 'highlight');
                            }
                        });
                    }
                });
            },
            // 对外 api
            getProcess() {
                const element = this.getProcessElement();
                return {
                    id: element.id,
                    name: element.name,
                    category: element.$attrs['flowable:processCategory'],
                };
            },
            getProcessElement() {
                const rootElements = this.modeler.getDefinitions().rootElements;
                for (let i = 0; i < rootElements.length; i++) {
                    if (rootElements[i].$type === 'bpmn:Process') return rootElements[i];
                }
            },
            async saveXML(download = false) {
                try {
                    const { xml } = await this.modeler.saveXML({ format: true });
                    if (download) {
                        this.downloadFile(
                            `${this.getProcessElement().name}.bpmn20.xml`,
                            xml,
                            'application/xml',
                        );
                    }
                    return xml;
                } catch (err) {
                    console.log(err);
                }
            },
            async saveImg(type = 'svg', download = false) {
                try {
                    const { svg } = await this.modeler.saveSVG({ format: true });
                    if (download) {
                        this.downloadFile(
                            this.getProcessElement().name,
                            svg,
                            'image/svg+xml',
                        );
                    }
                    return svg;
                } catch (err) {
                    console.log(err);
                }
            },
            async save() {
                const process = this.getProcess();
                const xml = await this.saveXML();
                const svg = await this.saveImg();
                const result = { process, xml, svg };
                this.$emit('save', result);
                window.parent.postMessage(result, '*');
            },
            openBpmn(file) {
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    this.createNewDiagram(reader.result);
                };
                return false;
            },
            downloadFile(filename, data, type) {
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(new Blob([data], { type: type }));
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            },
        },
    };
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
.view-mode {
  .page-header,
  .el-aside,
  .djs-palette,
  .bjs-powered-by {
    display: none;
  }
  .el-loading-mask {
    background-color: initial;
  }
  .el-loading-spinner {
    display: none;
  }
}
.flow-containers {
  //background-color: #ffffff;
  width: 100%;
  height: 100%;
  .canvas {
    background-color: #fff;
    width: 100%;
    height: 100%;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .load {
    margin-right: 10px;
  }
  .el-form-item__label {
    font-size: 13px;
  }

  .djs-palette {
    left: 0px !important;
    top: 0px;
    border-top: none;
  }

  .djs-container svg {
    min-height: 650px;
  }
  .editor-section {
    border-top: 1px solid #cccccc;
    margin-top: 16px;
  }
}
</style>

<style lang="less" scoped>
.page-header {
  display: flex;
  padding: 0;
  .left {
    flex-grow: 1;
  }
}
</style>
