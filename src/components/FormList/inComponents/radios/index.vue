<template>
    <!--radio 单选-->
    <el-radio-group
        v-bind="{ ...inInherit }"
        v-model="inValue"
        @change="change"
    >
        <template v-if="item.isButton">
            <el-radio-button
                v-for="it in list"
                v-bind="getInherit(it, 'radio')"
                :key="it.value"
                :label="it.value"
            >
                {{ it.label }}
            </el-radio-button>
        </template>
        <template v-else>
            <el-radio
                v-for="it in list"
                v-bind="getInherit(it, 'radio')"
                :key="it.value"
                :label="it.value"
                :border="item.border"
            >
                {{ it.label }}
            </el-radio>
        </template>
    </el-radio-group>
</template>

<script>
/*
 *
 * */
import { toRefs, ref, reactive, onMounted, watch, computed } from "vue";
import { inheritObj } from "@/components/FormList/config";
import { getInherit } from "@/components/FormList/selfTools";
import {backType} from '@/components/FormList/utils'
export default {
    name: "radios",
    emits: {
        changValue: null,
        modelValue: null,
        upLoad: null,
        "update:modelValue": null,
    },
    props: {
        modelValue: {
            // type: [String, Number],
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
            inValue: '',
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
                props.item ? getInherit(props.item, "radioGroup") : {}
            ),
        });
        watch(
            () => props.modelValue,
            (val, old) => {
                if (val != old) {
                    state.inValue = backType(val,'Array')? val[0]:val;
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
