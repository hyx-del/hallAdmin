<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="1">
            <emptyBox bottom="50" :style="{ paddingBottom: '45px' }">
                <formList
                    ref="formListRef"
                    :formInitData="formInitData"
                    :itemList="itemList"
                    :buttons="buttons"
                    :config="config"
                >
                </formList>
            </emptyBox>
        </el-tab-pane>
        <el-tab-pane label="结算" name="2">
            <emptyBox
                bottom="60"
                :fixed="true"
                :style="{ paddingBottom: '45px' }"
            >
                <formList
                    :formInitData="formInitCalculate"
                    :itemList="itemListCalculate"
                    :buttons="buttonsCalculate"
                    :preCheck="preCheckCalculate"
                    :config="config2"
                />
            </emptyBox>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { itemList } from "./itemList";
import { useRoute, useRouter } from "vue-router";
import { addFormTabsBottom } from "@/utils/config";
import { courseDetail, courseUpdatePut } from "@/api/course";
import {
    cardList,
    settlementsDetail,
    settlementsPreservePost,
} from "@/api/settlements";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
    components: {
        formList,
        emptyBox,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            activeName: "1",
            formInitData: {},
            config: { ...addFormTabsBottom },
            config2: {
                ...addFormTabsBottom,
                valueStyle: {
                    width: "420px",
                },
                default: {
                    required: false,
                },
            },
            itemList,
            // 手动隐藏
            hideList: [],
            // 手动显示
            showList: [],
            formState: [],
            id: "",
            // 按钮
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        console.log(value);
                        let data = value;
                        // 编辑
                        if (state.id) {
                            data.id = state.id;
                            courseUpdatePut({ ...data }).then((res) => {
                                ElMessage.success("编辑成功");
                            });
                        }
                    },
                },
            ],
            // 结算
            formInitCalculate: {},
            preCheckCalculate: {},
            itemListCalculate: [
                {
                    el: "switch",
                    label: "是否开启配置",
                    code: "isSetting",
                    default: false,
                },
            ],
            buttonsCalculate: [
                {
                    name: "返回",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "保存",
                    click: ({ value, checkValue, checkItem }) => {
                        console.log(value, checkValue, checkItem);
                        let settlements = [];
                        for (let key in checkValue) {
                            settlements.push({
                                amount: checkValue[key],
                                card_id: parseFloat(
                                    key.replace(/[^0-9]{1,}/gi, "")
                                ),
                            });
                        }
                        let data = {
                            courseId: state.id,
                            isSetting: value.isSetting ? 1 : 0,
                            settlements,
                        };
                        settlementsPreservePost(data).then(({ data, code }) => {
                            ElMessage.success("保存成功");
                        });
                    },
                },
            ],
            // 初始化
            start: () => {
                if (useRoute().query && useRoute().query.id) {
                    state.id = useRoute().query.id;
                    // 查询详情
                    courseDetail({ id: state.id }).then(({ data }) => {
                        state.formInitData = data;
                    });
                    settlementsDetail({ courseId: state.id }).then(
                        ({ data }) => {
                            let obj = {},
                                check = {},
                                settlementsVOList = data.settlementsVOList;
                            obj.isSetting = data.isSetting == 1 ? true : false;
                            settlementsVOList.map((item) => {
                                obj[`id${item.card_id}`] = item.amount;
                                check[`id${item.card_id}`] = true;
                            });
                            state.formInitCalculate = obj;
                            state.preCheckCalculate = check;
                        }
                    );
                }
            },
            getCardList: () => {
                cardList({ courseId: useRoute().query.id }).then((res) => {
                    let arr = res.data.map((v) => {
                        return {
                            el: v.type == 1 ? "input" : "span",
                            colon: v.type == 1 ? ":" : "",
                            code: `id${v.id}`,
                            label: v.name,
                            preCheck: true,
                            placeholder: "勾选后方可输入",
                            preCheckLinkage: true, //必填联动
                            checkType:'number',
                            type:'number',
                            inSlot:{
                                el:'div',
                                text:v.type == 1 ? "次" : "",
                                class: "slotRight",
                                style:{
                                    top:'0px'
                                }
                            }
                        };
                    });
                    state.itemListCalculate = [
                        {
                            el: "switch",
                            label: "是否开启配置",
                            code: "isSetting",
                            default: false,
                        },
                        ...arr,
                    ];
                });
            },
        });
        state.start();
        state.getCardList();
        return {
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
