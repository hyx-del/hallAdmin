<!--
 * @Author: zx
 * @Date: 2021-11-16 15:28:03
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 14:17:54
 * @Descripttion:
-->
<template>
    <el-select
        v-bind="{ ...inInherit }"
        v-model="inValue"
        @change="change"
        :remote-method="item.remoteMethod ? remoteMethodSelect : null"
    >
        <el-option
            v-for="it in list"
            :key="it.value + it.label"
            :label="it.value"
            v-bind="getInherit(it, 'option')"
        ></el-option>
    </el-select>
</template>

<script>
/*
 * 内部的下拉会传出 allList：所有选中的值
 * */
import { toRefs, ref, reactive, onMounted, watch, inject, computed } from "vue";
import { inheritObj } from "@/components/FormList/config";
import { getFunData, getInherit } from "@/components/FormList/selfTools";
import { backType } from "@/components/FormList/utils";
export default {
    name: "selects",
    emits: {
        changValue: null,
        modelValue: null,
        "update:modelValue": null,
        upLoad: null,
    },
    props: {
        modelValue: {
            type: [String, Array,Number],
            default: "",
        },
        item: {
            default: {},
        },
        list: {
            type: [Array],
            default: [],
        },
    },
    setup(props, context) {
        let formState = inject("formState");

        const provinces = ref(null);
        const { emit, slots, attrs } = context;
        const state = reactive({
            inValue: props.modelValue,
            inStyle: { ...props.item.style },
            // 监听多选
            change: (val) => {
                let vals = backType(val, "Array") ? val : [val + ""];
                let formObj = {};
                let { code } = props.item;
                let item = props.item;
                let choseList =
                    props.list.filter((v) => vals.includes(v.value)) || [];
                formObj[item.otherBack || code + "Label"] = choseList
                    .map((i) => i.label)
                    .join(",");
                if (item.allSelectCode) {
                    formObj[item.allSelectCode] = choseList;
                }
                let changeObj = {
                    code,
                    value: val,
                    formObj,
                    allList: choseList,
                };
                emit("update:modelValue", state.inValue);
                emit("changValue", changeObj);
                if (!val && props.item.fun && props.item.remoteMethod) {
                    state.remoteMethodSelect("");
                }
            },
            inInherit: computed(() =>
                props.item
                    ? getInherit(props.item, "select", props.item.inherit)
                    : {}
            ),
            remoteMethodSelect: (value) => {
                let item = props.item;
                if (item.fun) {
                    let par = item.remoteMethod(value);
                    emit("upLoad", {
                        item,
                        query: { ...item.query, ...par },
                    });
                }
            },
        });
        watch(
            () => props.modelValue,
            (val, old) => {
                if (val != old) {
                    if (props.item.multiple) {
                        state.inValue =backType(val,'String')? val.split(','):val
                    }else{
                        state.inValue = val
                    }
                }
            },
            {immediate: true}
        );
        return {
            provinces,
            getInherit,
            ...toRefs(props),
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
