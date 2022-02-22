<template>
    <!-- 省市区  -->
    <!--checkbox 多选-->
    <el-checkbox-group
        v-bind="{ ...inInherit }"
        v-model="inValue"
        @change="change"
    >
        <template v-if="item.isButton">
            <el-checkbox-button
                v-for="it in list"
                v-bind="getInherit(it, 'elCheckbox')"
                :key="it.value"
                :label="it.value"
            >
                {{ it.label }}
            </el-checkbox-button>
        </template>
        <template v-else>
            <el-checkbox
                v-for="it in list"
                v-bind="getInherit(it, 'elCheckbox')"
                :key="it.value"
                :label="it.value"
                :border="item.border"
            >
                {{ it.label }}
            </el-checkbox>
        </template>
    </el-checkbox-group>
</template>

<script>
/*
 * provinces 组件说明 ：省市区
 * */
import { toRefs, ref, reactive, onMounted, watch, computed } from "vue";
import { inheritObj } from "@/components/FormList/config";
import { getInherit } from "@/components/FormList/selfTools";
import {backType} from '@/components/FormList/utils'
export default {
    name: "checkboxs",
    emits: {
        changValue: null,
        modelValue: null,
        "update:modelValue": null,
        upLoad: null,
    },
    props: {
        modelValue: {
            type: [String,Number, Array],
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
                let formObj = {};
                let { code } = props.item;
                let item = props.item;
                let choseList =
                    props.list.filter((v) => val.includes(v.value)) || [];
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
            },
            inInherit: computed(() =>
                props.item ? getInherit(props.item, "elCheckbox") : {}
            ),
        });
        watch(
            () => props.modelValue,
            (val, old) => {
                if (val != old) {
                    if (backType(val,['String','Number'])) {
                        let str=val+''
                        state.inValue = str.split(',');
                    }else{
                        state.inValue = val;
                    }
                }
            },
            {deep:true,immediate: true}
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
