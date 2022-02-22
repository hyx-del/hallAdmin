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
            <emptyBox v-resize="resize" :bottom="inBottom" :height="height">
                <slot></slot>
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
            </span>
        </template>
    </el-dialog>
</template>

<script>
/*
 * popupForm组件说明
 * 弹窗的form表单
 * fun 非必填 确认按钮后的提交事件
 * show 弹窗显示
 * dialogConfig
 * */
import { ElMessage, ElMessageBox } from "element-plus";
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
const inheritObj={
    button: {
        el: "el-button",
        name: "按钮",
        list: [
            "size",
            "type",
            "plain",
            "round",
            "circle",
            "loading",
            "disabled",
            "icon",
            "autofocus",
            "ativeType",
            "autoInsertSpace",
        ],
    },
    span: {
        el: "span",
        name: "aaaa",
        list: [],
    },
    div: {
        el: "div",
        name: "aaaa",
        list: [],
    },
    slot: {
        name: "aaaa",
        list: [],
    },
}
// 属性返回值有 Undefined Null
const backType=(cc, string) =>{
    var typeName = Object.prototype.toString.call(cc);
    if (typeName == "[object Object]") {
        typeName = "[object " + cc.constructor.name;
    }
    typeName = typeName.replace("]", "").slice(8);
    if (typeof string == "string") {
        return typeName == string;
    } else if (string) {
        return string.some((key) => key == typeName);
    }
    return typeName;
}
const getInherit = (item, el, obj = {}) => {
    let list =
        el && inheritObj[el]
            ? [...(inheritObj[el].list || []), "class", "style"]
            : ["class", "style"];
    let defaltObj = el && inheritObj[el] ? inheritObj[el].default || {} : {};
    let backObj = { ...defaltObj };
    backObj = { ...backObj, ...obj };

    if ((backType(item), "Object")) {
        list.forEach((key) => {
            if (item[key]) {
                backObj[key] = item[key];
            }
        });
    }
    backObj.ref = item.code;
    backObj.placeholder = item.placeholder;
    return backObj;
};
export default {
    name: "popupForm",
    emits: {
        "update:show": {
            type: Boolean,
        },
    },
    components: {
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
            // default: 600,
        },
        // 宽度
        width: {
            required: false,
            default: '600px',
        },
        // 标题
        title: {
            default: "弹窗名称",
        },
        //表格的按钮
        buttons: {
            type: Array,
        },
    },
    setup(props, context) {
        const refEmptyBox = ref(null);
        const { emit, slots, attrs } = context;
        const state = reactive({
            inBottom: null,
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
            buttonsClick: (bt) => {
                if (backType(bt.click, "Function")) {
                    bt.click();
                }
            },
            // 取消按钮
            cancel: () => {
                emit("update:show", false);
            },
        });
        const resize = (val) => {
            try {
                changStyle();
            } catch (err) {
                // console.log(err);
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
            if (props.height=='max') {
                top=props.spacing
                state.inBottom=props.spacing+92
            }
            state.inDialogConfig = {
                ...props.dialogConfig,
                width:props.width,
                top: top  + "px",
            };
        };
        watch(
            () => props.show,
            (val, oldVal) => {
                if (val != oldVal) {
                }
            }
        );
        return {
            resize,
            refEmptyBox,
            ...toRefs(props),
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
