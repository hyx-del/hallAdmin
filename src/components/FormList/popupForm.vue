<template>
    <el-dialog
        v-if="show"
        v-bind="{ ...inDialogConfig }"
        :title="title"
        v-model="show"
        destroy-on-close
        @close="cancel"
        ref="refEmptyBox"
    >
        <div>
            <emptyBox v-resize="resize" :height="height">
                <formList
                    ref="popFormList"
                    :config="formConfig"
                    :itemList="itemList"
                    :formInitData="inFormInitData"
                />

            </emptyBox>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <template v-if="inButtons">
                    <template v-for="bt in inButtons">
                        <el-button
                            v-if="bt.show"
                            v-bind="bt.inherit"
                            :key="bt"
                            @click="buttonsClick(bt)"
                            >{{ bt.text || bt.name }}</el-button
                        >
                    </template>
                </template>
                <template v-else>
                    <el-button
                        v-if="buttonCancel"
                        size="small"
                        @click="cancel"
                        >{{ buttonCancel }}</el-button
                    >
                    <el-button
                        v-if="buttonConfirm"
                        size="small"
                        type="primary"
                        @click="confirm()"
                    >
                        {{ buttonConfirm }}
                    </el-button>
                </template>
            </span>
        </template>
    </el-dialog>
</template>

<script>
/*
 * popupForm组件说明
 * 弹窗的form表单
 * import popupForm from "@/components/FormList/popupForm.vue";
 * tabelRef 非必填 弹窗关闭后更新的table
 * fun 非必填 确认按钮后的提交事件
 * show 弹窗显示
 * dialogConfig
 * */
import { ElMessage, ElMessageBox } from "element-plus";

import formList from "./index";
import {
    toRefs,
    ref,
    reactive,
    toRef,
    isRef,
    isReactive,
    watchEffect,
    watch,
    onMounted,
    computed,
    getCurrentInstance,
    onBeforeUnmount,
} from "vue";
import emptyBox from "@/components/emptyBox";
import { getInherit } from "@/components/FormList/selfTools";
import { backType } from "@/components/FormList/utils";
export default {
    name: "popupForm",
    emits: {
        cancel: null,
        confirm: null,
        "update:show": {
            type: Boolean,
        },
        "update:formInitData": null,
        formInitData: null,
    },
    components: {
        formList,
        emptyBox,
    },

    directives: {
        resize: {
            // 指令的定义
            mounted(el, binding) {
                let width = "",
                    height = "";
                function get() {
                    const style = document.defaultView.getComputedStyle(el);
                    if (width !== style.width || height !== style.height) {
                        binding.value({ width, height });
                    }
                    width = style.width;
                    height = style.height;
                }
                el.__vueReize__ = setInterval(get, 200);
            },
            unmounted(el) {
                clearInterval(el.__vueReize__);
            },
        },
    },
    props: {
        // 间距
        spacing: {
            required: false,
            default: 50,
        },
        // 联动的表格
        tabelRef: {
            required: false,
            type: Object,
        },
        // 点击确认的事件
        fun: {
            required: false,
            type: Function,
        },
        // 显示
        show: {
            type: Boolean,
        },
        // 弹窗的设置
        dialogConfig: {
            default: {
                width: "600px",
                top: "50px",
            },
        },
        // 弹窗高度的设置
        height: {
            default: "auto",
        },
        // 表格的设置
        formConfig: {
            default: {
                buttons: [],
            },
        },
        // 标题
        title: {
            default: "弹窗名称",
        },
        //表格的list
        itemList: {
            type: Array,
            default: [],
        },
        //表格的按钮

        buttons: {
            type: Array,
        },
        // 表格数据
        formInitData: {
            type: Object,
            default: {},
        },
        // 取消按钮文字
        buttonCancel: {
            type: String,
            default: "取消",
        },
        // 确认按钮文字
        buttonConfirm: {
            type: String,
            default: "确定",
        },
    },
    setup(props, context) {
        const popFormList = ref(null);
        const refEmptyBox = ref(null);

        const { emit, slots, attrs } = context;

        const state = reactive({
            inDialogConfig: {},
            inButtons: computed(() => {
                if (props.buttons && props.buttons.length > 0) {
                    return props.buttons.map((bt) => ({
                        show: bt.show == undefined ? true : bt.show,
                        ...bt,
                        inherit: getInherit(bt, "button", { size: "small" }),
                    }));
                }
                return null;
            }),
            inFormInitData: {},
            buttonsClick: (bt) => {
                if (backType(bt.click, "Function")) {
                    if (bt.funType == "confirm") {
                        state.confirm(bt.click);
                    } else {
                        popFormList.value.reset();
                        bt.click({ value: null, valid: false });
                    }
                }
            },
            reset: () => {
                state.inFormInitData = {};
                popFormList && popFormList.value && popFormList.value.reset();
            },
            // 取消按钮
            cancel: () => {
                emit("update:show", false);
                state.reset();
            },
            // 确认按钮
            confirm: (callBack) => {
                popFormList.value.confirm().then(({ value }) => {
                    emit("update:formInitData", { ...value });
                    emit("confirm", { ...value });
                    callBack && callBack({ value, valid: true });
                    props.fun &&
                        props.fun({ ...value }).then((res) => {
                            if (res.code === 200) {
                                state.reset();
                                emit("update:show", false);
                                ElMessage.success("操作成功");
                                props.tabelRef && props.tabelRef.update();
                            } else {
                                ElMessage.success(res.msg);
                            }
                        });
                });
            },
        });
        const resize = (val) => {
            try {
                changStyle();
            } catch (err) {
                console.log(err);
            }
        };
        //
        const changStyle = () => {
            let spacing = parseInt(props.spacing || 50);
            let popHeight = refEmptyBox.value.$refs.dialogRef.scrollHeight;
            //窗口高
            let windowHeight = document.documentElement.clientHeight;
            let top =
                parseInt((windowHeight - popHeight) / 2) < spacing
                    ? spacing
                    : parseInt((windowHeight - popHeight) / 2);
            state.inDialogConfig = {
                ...props.dialogConfig,
                top: top + "px",
            };
        };
        watch(
            () => props.show,
            (val, oldVal) => {
                if (val != oldVal) {
                    state.reset();
                }
                if (!val) {
                    emit("update:formInitData", {});
                }
            }
        );
        watch(
            () => props.formInitData,
            (val, oldVal) => {
                if (val != oldVal) {
                    state.inFormInitData = val;
                }
            }
        );
        watch(
            () => props.formConfig,
            (val, oldVal) => {
                if (val != oldVal) {
                    state.inFormInitData = val;
                }
            }
        );
        return {
            resize,
            refEmptyBox,
            popFormList,
            ...toRefs(props),
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
