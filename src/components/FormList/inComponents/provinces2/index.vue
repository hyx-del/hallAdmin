<template>
    <!-- 省市区  -->
    <el-cascader
        v-bind="inInherit"
        ref="provinces"
        v-model="inValue"
        :style="{ ...inStyle }"
        :ref="item.code"
        :options="inList"
        @change="change"
        clearable
    />
</template>

<script>
/*
 * provinces 组件说明 ：省市区
 * */
import { toRefs, ref, reactive, onMounted, watch, inject, computed } from "vue";
import { inheritObj } from "@/components/FormList/config";
import { getInherit } from "@/components/FormList/selfTools";
export default {
    name: "provinces2",
    emits: {
        changValue: null,
        modelValue: null,
        "update:modelValue": null,
        upLoad: null,
    },
    props: {
        modelValue: {
            type: [String, Array],
            default: "",
        },
        item: {
            default: {},
        },
        list: {
            default: [],
        },
    },
    setup(props, context) {
        const provinces = ref(null);
        const { emit, slots, attrs } = context;
        const state = reactive({
            inList: schoolAreaData2,
            inValue: props.modelValue,
            inStyle: { ...props.item.style },
            // 地区选择 item.areaCode province(省),provinceId(省id),city(市),cityId(市ID),county(区),countyId(区ID)
            change: (val) => {
                let formObj = {};
                let value = val;
                let nameArr = provinces.value.presentText.split(" / ");
                let areaCode =
                    props.item.areaCode ||
                    "province,provinceId,city,cityId,county,countyId";
                let areaCodeArr = areaCode.split(",");
                if (value) {
                    formObj[areaCodeArr[0]] = nameArr[0];
                    formObj[areaCodeArr[1]] = value[0];
                    formObj[areaCodeArr[2]] = nameArr[1];
                    formObj[areaCodeArr[3]] = value[1];
                } else {
                    formObj[areaCodeArr[0]] = "";
                    formObj[areaCodeArr[1]] = "";
                    formObj[areaCodeArr[2]] = "";
                    formObj[areaCodeArr[3]] = "";
                }
                let changeObj = {
                    code: props.item.code,
                    ids: value,
                    names: nameArr,
                    value: val,
                    formObj,
                };
                emit("update:modelValue", state.inValue);
                emit("changValue", changeObj);
            },
            inInherit: computed(() =>
                props.item ? getInherit(props.item, "cascader") : {}
            ),
        });
        watch(
            () => props.modelValue,
            (val, old) => {
                if (val != old) {
                    state.inValue = val;
                }
            },
            {immediate: true,deep:true}
        );
        return {
            provinces,
            ...toRefs(props),
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
