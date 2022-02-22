<!--
 * @Author: zx
 * @Date: 2021-11-22 11:25:58
 * @LastEditors: zx
 * @LastEditTime: 2021-12-29 13:13:12
 * @Descripttion:
-->
<template>
    <!--日期选择-->
    <el-date-picker
        v-bind="{ ...inInherit }"
        v-model="inValue"
        @change="change"
        :disabled-date="getDateDisabledDate"
    />
</template>

<script>
/*
 *
 * */
import { toRefs, ref, reactive, onMounted, watch, computed } from "vue";
import { inheritObj } from "@/components/FormList/config";
import { getFunData, getInherit } from "@/components/FormList/selfTools";
export default {
    name: "dates",
    emits: {
        changValue: null,
        modelValue: null,
        upLoad: null,
        "update:modelValue": null,
    },
    props: {
        modelValue: {
            type: [String, Array, Date],
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
        const provinces = ref(null);
        const { emit, slots, attrs } = context;
        const state = reactive({
            inValue: props.modelValue,
            inStyle: { ...props.item.style },
            // 监听多选
            change: (val) => {
                emit("update:modelValue", state.inValue);
                let changeObj = {
                    code:props.item.code,
                    value: val,
                };
                emit("changValue", changeObj);
            },
            inInherit: computed(() =>
                props.item ? getInherit(props.item, "datePicker") : {}
            ),
            // 限制时间
            getDateDisabledDate: (time) => {
                let minDate = props.item.minDate || "1900-12-30";
                let maxDate = props.item.maxDate || "2200-12-30";
                return (
                    time.getTime() < new Date(minDate).getTime() ||
                    time.getTime() > new Date(maxDate).getTime()
                );
            },
        });
        watch(
            () => props.modelValue,
            (val, old) => {
                if (val != old) {
                    state.inValue = val;
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
