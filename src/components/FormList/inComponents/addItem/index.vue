<template>
    <div
        ref="formListMadia"
        v-resize="resize"
        class="listShow"
        :class="{ column: inConfig.inline }"
    >
        <div
            class="add_list_item"
            v-for="(form, index) in inDataList"
            :key="index"
            :style="{ paddingRight: rightButtonShow ? '45px' : 0 }"
        >
            <el-checkbox
                v-if="item.listCheck"
                class="formCheck"
                @change="checkListCheck(index)"
                v-model="listCheck[index]"
            ></el-checkbox>
            <formLists
                :ref="'formListRef' + index"
                :itemList="inItemList"
                v-model:formInitData="inDataList[index]"
                :config="inConfig"
                @buttonClick="buttonForm"
            />
            <div
                class="add_right"
                v-if="rightButtonShow"
                :style="{ ...rightButtonStyle }"
            >
                <i
                    v-if="inDataList.length != max"
                    class="el-icon-circle-plus-outline addItem"
                    @click="addItem(form, index)"
                ></i>
                <i
                    v-if="inDataList.length > 1"
                    class="el-icon-delete removeItem"
                    @click.prevent="removeItem(form, index)"
                ></i>
            </div>
        </div>
    </div>
</template>

<script>
/*
 * index组件说明
 *
 * */

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
import formLists from "./formLists";
import {backType, diffSame} from "@/components/FormList/utils";

export default {
    name: "addItem",
    emits: {
        changValue: null,
        modelValue: null,
        upLoad: null,
        "update:modelValue": null,
        "update:valid": null,
    },
    components: {
        formLists,
    },
    props: {
        // 数据
        modelValue: {
            type: Array,
        },
        item: {
            default: {},
        },
        list: {
            type: [Array],
            default: [],
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
        const { emit, slots, attrs } = context;
        onMounted(() => {
            allDom.value = getCurrentInstance().proxy;
        });
        const formListMadia = ref(null);
        const allDom = ref(null);
        const state = reactive({
            inItem: {
                // 对于表单的设置
                config: {
                    inline: true,
                    allDisabled: props.item.disabled,
                },
                max: 100,
                disabled: false,
                rightButtonShow: true,
                rightButtonStyle: {},
                ...props.item,
            },
            // 禁用
            disabled: computed(() => state.inItem.disabled),
            // 列的是否选中
            listCheck: [],
            // 选中变化
            checkListCheck: (val) => {
                let checkVlaue = [];
                state.listCheck.forEach((v, ind) => {
                    if (v) {
                        checkVlaue.push(state.inDataList[ind]);
                    }
                });
                let changeObj = {
                    code: props.item.code,
                    value: state.inDataList,
                    formObj: {},
                    allList: checkVlaue,
                };
                emit("update:modelValue", state.inDataList);
                emit("changValue", changeObj);
            },
            // 最多多少个
            max: computed(() => state.inItem.max),
            // rightButton样式
            rightButtonStyle: computed(() => state.inItem.rightButtonStyle),
            rightButtonShow: computed(
                () => !state.disabled && state.inItem.rightButtonShow
            ),
            initData: computed(() => {
                let obj = {};
                props.item.itemList.map((item) => (obj[item.code] = ""));
                return obj;
            }),
            dataValid: [false], // 数据每条的验证状态
            allValid: computed(() => state.dataValid.every((v) => v)),
            inDataList: [{}],
            inItemList: [],
            inConfig: {},
            addItem: (form, index) => {
                state.confirm();
                allDom.value.$refs["formListRef" + index].confirm(
                    { name: "add" },
                    () => {
                        if (
                            state.inDataList.length <= state.max &&
                            state.allValid
                        ) {
                            state.inDataList.splice(index + 1, 0, {
                                ...state.initData,
                            });
                            state.listCheck.splice(index + 1, 0, false);
                            state.dataValid.splice(index + 1, 0, false);
                        }
                    }
                );
            },
            removeItem: (form, index) => {
                if (state.inDataList.length > 1) {
                    state.inDataList.splice(index, 1);
                    state.listCheck.splice(index, 1);
                    state.dataValid.splice(index, 1);
                }
            },
            // 获取验证结果
            confirm: (index) => {
                state.inDataList.forEach((item, index) => {
                    allDom.value.$refs[`formListRef${index}`]
                        .confirm({ name: "add" }, null, { index })
                        .then((res) => {});
                });
            },
            getValue: () => {
                return new Promise((resolve, reject) => {
                    state.inDataList.forEach((item, index) => {
                        let Dom,beforeDom=allDom.value.$refs[`formListRef${index}`];
                        if (backType(beforeDom,'Array')) {
                            Dom=beforeDom[0]
                        }
                        if (backType(beforeDom,'Object')) {
                            Dom=beforeDom
                        }
                        Dom.confirm({ name: "confirm" }, null, { index })
                            .then((res) => {
                                state.dataValid[res.index] = res.valid;
                                emit("update:valid", state.allValid);
                                if ( state.inDataList.length == index + 1) {
                                    if (res.valid) {
                                        state.inDataList[res.index] = res.value;
                                        let checkVlaue = [];
                                        if (state.inItem.listCheck) {
                                            state.listCheck.forEach((v, ind) => {
                                                if (v) {
                                                    checkVlaue.push(
                                                        state.inDataList[ind]
                                                    );
                                                }
                                            });
                                        }
                                        resolve({
                                            valid: true,
                                            value: state.inDataList,
                                            checkVlaue,
                                        });
                                    }
                                }
                            }).catch((err)=>{
                            reject({
                                valid: false,
                            })
                        })
                    });
                });
            },
            // 表单的验证事件
            buttonForm: (val) => {
                state.dataValid[val.index] = val.valid;
                emit("update:valid", state.allValid);
                if (val.valid) {
                    state.inDataList[val.index] = val.value;
                    emit("update:modelValue", state.inDataList);
                }
            },
        });
        // 获取元素变化
        const resize = (val) => {
            formSize();
        };
        onMounted(() => {
            if (state.inDataList.length == 0) {
                state.inDataList = [{}];
            }
            formSize();
        });
        const formSize = () => {};
        // 初始化组件
        const setForm = () => {
            state.inConfig = {
                countList: props.item.countList,
                ...state.inItem.config,
            };
        };
        watch(
            () => props.modelValue,
            (newV, oldV) => {
                // 防止有些数字导致无限循环
                if (!diffSame(newV, oldV)) {
                    if (newV.length > 0) {
                        state.inDataList = [...newV];
                    } else {
                        state.inDataList = [{}];
                    }
                    setForm();
                }
            },
            { immediate: true, deep: true }
        );
        watch(
            () => props.item.itemList,
            (newV, oldV) => {
                // 防止有些数字导致无限循环
                if (newV != oldV) {
                    state.inItemList = [...newV];
                    setForm();
                }
            },
            { immediate: true, deep: true }
        );

        setForm();
        return {
            resize,
            confirm: state.confirm,
            formListMadia,
            ...toRefs(state),
            ...toRefs(props),
        };
    },
};
</script>

<style lang="scss" scoped>
.add_list_item {
    display: flex;
    position: relative;
    box-sizing: border-box;
    padding-right: 45px;
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
    .formCheck {
        margin-right: 10px;
    }
}
.add_right {
    position: absolute;
    right: 0%;
    top: 10px;
    display: flex;
    font-size: 24px;
    .addItem {
        margin-right: 6px;
        color: blue;
    }
    .removeItem {
        color: red;
    }
}
</style>
