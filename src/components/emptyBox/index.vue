<template>
    <div
        class="emptyBox"
        ref="emptyBox"
        v-resize="resize"
        :style="emptyBoxStyle"
    >
        <div class="emptyBoxIn">
            <div ref="refSlot" v-resize="inResize">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import {
    watch,
    reactive,
    ref,
    toRefs,
    onMounted,
    getCurrentInstance,
} from "vue";
// 空盒子
// import emptyBox from "@/components/emptyBox/index.vue";

export default {
    props: {
        // 是否固定在窗口
        fixed: {
            type: Boolean,
            default: false,
        },
        // 距离窗口头部位置
        top: {
            type: Number,
        },
        // 距离窗口底部位置
        bottom: {
            type: [Number, String],
            default: 150,
        },
        style: {
            default: {},
        },

        // 距离窗口底部位置
        paddingBottom: {
            type: Number,
            default: 0,
        },
        // 高度设置
        height: {
            type: [Number, String],
            default: "auto",
        },
        // 是否铺满
        full: {
            type: Boolean,
            default: true,
        },
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
    setup(props, context) {
        const emptyBox = ref(null);
        const refSlot = ref(null);
        const state = reactive({
            emptyBoxStyle: {
                height: props.height + "px",
                ...props.style,
            },
        });
        onMounted(() => {});
        //
        const inResize = (val) => {
            changPop();
        };
        // 获取元素变化
        const resize = (val) => {
            // console.log(val);
            changPop();
        };
        //
        const changPop = () => {
            if (!props.full || !emptyBox) return;
            //窗口高
            let windowHeight = document.documentElement.clientHeight;
            let emptyBoxInfo = {
                top: 50,
            };
            let slotHeight = 0;
            let top = 50;
            let bottom = props.bottom;

            try {
                slotHeight = refSlot.value && refSlot.value.scrollHeight;
                emptyBoxInfo =
                    emptyBox &&
                    emptyBox.value &&
                    emptyBox.value.getBoundingClientRect();
                top = props.top || emptyBoxInfo.top;
                slotHeight =
                    slotHeight > emptyBoxInfo.height
                        ? slotHeight
                        : emptyBoxInfo.height;
                bottom = props.bottom || emptyBoxInfo.bottom;
            } catch (err) {}

            let maxHeight = windowHeight - bottom - top;

            let propsHeight =
                props.height == "auto" || props.height > 10
                    ? slotHeight
                    : parseInt(props.height);
            let endHeight = propsHeight > maxHeight ? maxHeight : propsHeight;
            if (props.fixed) {
                endHeight = maxHeight;
            }
            let height = "";
            if (props.height == "auto") {
                height = endHeight + "px";
            }
            if (props.height == "max") {
                height = windowHeight - props.bottom - top + "px";
            }
            state.emptyBoxStyle = {
                height,
                ...props.style,
            };
        };
        return {
            ...toRefs(state),
            resize,
            inResize,
            emptyBox,
            refSlot,
        };
    },
};
</script>

<style lang="scss" scoped>
.emptyBox {
    width: 100%;
    .emptyBoxIn {
        height: 100%;
        overflow: auto;
    }
}
</style>
