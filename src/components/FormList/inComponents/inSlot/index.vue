<template>
    <slot></slot>
    <template v-if="isComponentArr">
        <template v-for="(cp, index) in componentArr" :key="index">
            <component
                :is="getComponent(cp)"
                v-bind="inGetInherit(cp)"
                @click="slotClick(cp)"
            >
                {{getHtmlStr(cp)}}
                <template v-if="cp.children" v-for="child in cp.children">
                    <selfGen :item="child"/>
                </template>
            </component>
        </template>
    </template>
    <template v-if="!isComponentArr">
        <component
            :is="getComponent()"
            v-bind="inGetInherit()"
            @click="slotClick(item)"
        >
            {{getHtmlStr(item)}}
            <template v-if="mode=='layout'&&item.children" v-for="child in item.children">
                <selfGen :item="child"/>
            </template>
            <template v-else-if="item[mode]&&item[mode].children" v-for="child in item[mode].children">
                <selfGen :item="child"/>
            </template>
        </component>
    </template>
</template>
<script>
/*
 * 可以自我调用循环的dom
 * */
import { toRefs, ref, reactive, onMounted, watch, inject, computed } from "vue";
import { highInherit2, inheritObj } from "@/components/FormList/config";
import { getInherit } from "@/components/FormList/selfTools";
import { backType } from "@/components/FormList/utils";
export default {
    name: "selfGen",
    emits: {
        changValue: null,
        value: null,
        upLoad: null,
    },
    props: {
        value: {
            default: "",
        },
        item: {
            default: {},
        },
        isForm:{
            default: true,
        },
        // 普通元素
        mode: {
            default: "layout",
        },
        el: {
            default: "",
        },
    },
    setup(props, context) {
        let  formState={}
        if (props.isForm) {
            formState= inject("formState");
        }
        const provinces = ref(null);
        const { emit, slots, attrs } = context;
        const state = reactive({
            // 是否是多个
            isComponentArr: computed(() =>
                backType(props.item[props.mode], "Array")
            ),
            componentArr: computed(() =>
                state.isComponentArr ? props.item[props.mode] : []
            ),
            // 获取组件el
            getComponent: (obj) => {
                let check = "span";
                if (props.mode == "layout") {
                    check = props.item.el;
                } else {
                    check = obj
                        ? obj.el || "span"
                        : props.item[props.mode].el || "span";
                }
                check = highInherit2[check] ? highInherit2[check] : check;
                let el = 'div'
                if (inheritObj[check]) {
                    el = inheritObj[check].el||'div';
                }
                return el;
            },
            // 获取单个的文本内容
            getHtmlStr:(obj)=>{
                console.log('--------',obj,obj.children)
                let bacKObj={}
                let mode=props.mode||'layout'
                if (mode=='layout') {
                    bacKObj=obj
                }else{
                    bacKObj=obj[props.mode]||obj
                }
                if (backType(bacKObj,'String')) {
                    return bacKObj
                }
                if(backType(bacKObj.text,'Function')){
                    return bacKObj.text()
                }
                return bacKObj.text
            },
            // 获取单个的el
            el: computed(() => {
                if (props.mode == "layout") {
                    return props.item.el || "span";
                } else {
                    return props.item.el || "span";
                }
            }),
            // 获取可继承属性
            inGetInherit: (obj) => {
                return obj
                    ? getInherit(obj, obj.el || "span")
                    : getInherit(
                        props.item[props.mode] || props.item,
                        state.el
                    );
            },
        });
        // 点击事件回调
        const slotClick = (obj) => {
            let click;
            if (obj) {
                click = obj.click;
            } else if (props.mode == "layout") {
                click = props.item.click;
            } else {
                click =
                    props.item[props.mode + "Click"] ||
                    props.item[props.mode].click;
            }
            if (backType(click, "Function")) {
                if (props.isForm) {
                    formState.slotClick(props.item, click);
                }else{
                    click()
                }
            }
        };

        return {
            slotClick,
            ...toRefs(props),
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
