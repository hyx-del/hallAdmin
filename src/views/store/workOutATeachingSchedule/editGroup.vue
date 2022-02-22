<template>
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane
                label="基本信息"
                name="1"
                style="height: calc(100vh - 230px)"
            >
                <emptyBox :bottom="30">
                    <formList
                        ref="formListRef"
                        :formInitData="formInitData"
                        :itemList="itemList"
                        :buttons="buttons"
                        :config="config"
                    />
                </emptyBox>
            </el-tab-pane>

            <el-tab-pane
                label="结算配置"
                name="2"
                style="height: calc(100vh - 230px)"
            >
                <formList
                    :formInitData="priceData"
                    :itemList="priceList"
                    :buttons="priceButtons"
                    :config="priceConfig"
                />
                <emptyBox bottom="70" :style="{ paddingBottom: '15px' }">
                    <formList
                        :formInitData="formInitData2"
                        :itemList="itemList2"
                        :buttons="buttons2"
                        :config="config2"
                        :preCheck="preCheck"
                    />
                </emptyBox>
            </el-tab-pane>
        </el-tabs>
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            title="替课"
            :itemList="popItemList"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import popupForm from "@/components/FormList/popupForm";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed, inject } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import {
    arrangingList,
    classroomTypeList,
    testList,
    weekList,
} from "@/utils/enum/select";
import {
    planAddPost,
    planDetail,
    planUpdatePut,
    priceAllocationPut,
    replaceAssistantPut,
    replaceCoachPut,
} from "@/api/coursePlan";
import { coachList } from "@/api/coach";
import { getClassroomListAPI } from "@/api/classroom";
import { getSelectCourseLableListAPI, planCourse } from "@/api/common";
import {
    planSettlementsDetail,
    planSettlementsPreservePost,
    settlementsCardList,
} from "@/api/planSettlements";
let defaultPage = [
    {
        el: "switch",
        label: "是否开启",
        code: "isSetting",
    },
];
export default {
    components: {
        formList,
        emptyBox,
        popupForm,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            courseId: "",
            popShow: false,
            popFormInitData: {},
            popButtons: [
                {
                    name: "取消",
                    click: ({ value }) => {
                        state.popShow = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        let par = { ...value, id: state.id };
                        replaceCoachPut(par).then((res) => {
                            state.popShow = false;
                            state.start();
                        });
                    },
                },
            ],
            popItemList: [
                {
                    el: "select",
                    label: "教练替换",
                    code: "coachId",
                    fun: coachList,
                },
                {
                    el: "textArea",
                    code: "remark",
                    label: "原因",
                    required: false,
                },
            ],
            activeName: "1",
            id: "",
            config: {
                ...addFormBottom,
            },
            config2: {
                ...addFormBottom,
                valueStyle: {
                    width: "420px",
                },
                default: {
                    required: false,
                },
            },
            formInitData: {},
            assistantTf: true,
            buttons: [
                {
                    name: "返回",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        let data = value;
                        let { date, endTime, startTime } = value,
                            { id } = state;
                        data.dates = [{ date, endTime, startTime, id }];
                        // 编辑
                        planUpdatePut({ ...data }).then((res) => {
                            ElMessage({
                                type: "success",
                                message: "编辑成功",
                                duration: 1000,
                            });
                            state.start();
                        });
                    },
                },
            ],
            itemList: [
                {
                    el: "select",
                    label: "课程名称",
                    code: "courseId",
                    fun: planCourse,
                    backType: "Number",
                    query: {
                        type: 1,
                    },
                },
                {
                    el: "select",
                    label: "教练",
                    code: "coachId",
                    fun: coachList,
                    disabled: true,
                    inSlot: {
                        el: "button",
                        size: "small",
                        class: "slotRight",
                        text: "替课",
                        click: (val) => {
                            state.popShow = true;
                            state.popFormInitData = {
                                coachId: val,
                            };
                        },
                    },
                },
                {
                    el: "radio",
                    label: "教室类型",
                    code: "classroomType",
                    default: "1",
                    list: classroomTypeList,
                    required: false,
                    disabled: true,
                },
                {
                    el: "select",
                    label: "教室",
                    code: "classroomId",
                    fun: getClassroomListAPI,
                    disabled: true,
                },
                {
                    el: "select",
                    label: "助教",
                    code: "assistants",
                    defaultValueSort: "assistant",
                    default: [],
                    required: false,
                    disabled: true,
                    multiple: true,
                    backType: "ArrayNumber",
                    fun: coachList,
                    inSlot: {
                        el: "button",
                        size: "small",
                        class: "slotRight",
                        text: computed(() =>
                            state.assistantTf ? "修改助教" : "保存修改"
                        ),
                        click: async (val, obj) => {
                            let res = {};
                            if (!state.assistantTf) {
                                let par = { assistants: val, id: state.id };
                                res = await replaceAssistantPut(par);
                                if (res.code == 200) {
                                    ElMessage.success("修改成功");
                                }
                            }
                            state.assistantTf = !state.assistantTf;
                            return {
                                list: [
                                    {
                                        code: "assistants",
                                        disabled: state.assistantTf,
                                    },
                                ],
                            };
                        },
                    },
                },
                {
                    el: "select",
                    label: "标签",
                    code: "courseLabelsIds",
                    defaultValueSort: "courseLabelsId",
                    setValue: (obj, val) => {
                        let arr = [];
                        if (obj.courseLabelsId) {
                            let str = obj.courseLabelsId.replace(
                                /[\[|\]]+/gi,
                                ""
                            );
                            arr = str.split(",").map((v) => v + "");
                        }
                        return val ? val : arr;
                    },
                    fun: getSelectCourseLableListAPI,
                    multiple: true,
                    backType: "ArrayNumber",
                    required: false,
                    // courseLabelsId
                },
                {
                    label: "可约人数",
                    code: "maxOrder",
                    type: "number",
                    maxlength: 6,
                    checkType: "number",
                    minCode: 0,
                    required: false,
                },
                {
                    label: "旁听人数",
                    code: "auditorNumber",
                    show: computed(() => false),
                    type: "number",
                    maxlength: 6,
                    checkType: "number",
                    minCode: 0,
                    required: false,
                },
                {
                    el: "date",
                    label: "日期",
                    code: "date",
                    type: "date",
                    disabled: true,
                },
                {
                    label: "时间",
                    el: "timePicker",
                    isRange: true,
                    disabled: true,
                    code: "timeB",
                    otherCodeArr: ["startAtTime", "endAtTime"],
                    startPlaceholder: "开始时间",
                    endPlaceholder: "结束时间",
                },
            ],
            // 价格配置
            priceData: {},
            priceList: [
                {
                    el: "itemSlot",
                    label: "价格配置",
                    code: "pagesin",
                    inItemSlot: {
                        el: "div",
                        text: "价格配置",
                        style: {
                            width: "100%",
                            padding: "10px 0",
                            // borderBottom:'1px solid #eee',
                            marginBottom: "10px",
                        },
                    },
                },
                {
                    label: "价格",
                    code: "price",
                    type: "number",
                    checkType: "numberPoint2",
                    suffix: "元",
                    maxlength: 6,
                },
                {
                    label: "余额价",
                    code: "balancePrice",
                    type: "number",
                    checkType: "numberPoint2",
                    suffix: "元",
                    maxlength: 6,
                },
                {
                    el: "itemSlot",
                    label: "价格配置",
                    code: "line",
                    inItemSlot: {
                        el: "div",
                        text: "卡配置",
                        style: {
                            width: "100%",
                            padding: "10px 0",
                            borderBottom: "1px solid #eee",
                            marginBottom: "10px",
                        },
                    },
                },
            ],
            priceButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "保存",
                    click: ({ value }) => {
                        let data = value;
                        let { id } = state;
                        data = { ...data, id };
                        priceAllocationPut(data).then((res) => {
                            ElMessage.success("价格配置修改成功");
                            state.start();
                        });
                    },
                },
            ],
            priceConfig: {
                ...addFormBottom,
                button: {
                    el: "div",
                    style: {
                        position: "absolute",
                        top: "165px",
                        marginBottom: "0px",
                        left: "305px",
                    },
                },
            },
            formInitData2: {},
            preCheck: {},
            itemList2: [...defaultPage],
            buttons2: [
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
                            coursePlanId: state.id,
                            id: state.id,
                            isSetting: value.isSetting ? 1 : 0,
                            settlements,
                        };
                        planSettlementsPreservePost(data).then(
                            ({ data, code }) => {
                                ElMessage.success("保存成功");
                            }
                        );
                    },
                },
            ],
            // 结算配置 详情
            getCardList: (courseId) => {
                settlementsCardList({ courseId }).then((res) => {
                    let arr = res.data.map((v) => {
                        return {
                            required: false,
                            el: v.type == 1 ? "input" : "span",
                            colon: v.type == 1 ? ":" : "",
                            code: `id${v.id}`,
                            label: v.name,
                            preCheck: true,
                            checkType:'number',
                            type:'number',
                            placeholder: "勾选后方可输入",
                            preCheckLinkage: true, //必填联动
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
                    state.itemList2 = [...defaultPage, ...arr];
                });
            },
            // 获取设置信息
            getSettlements() {
                planSettlementsDetail({ coursePlanId: state.id }).then(
                    (res) => {
                        let { isSetting = false, settlementsVOList } = res.data;
                        let settlements = {},
                            preCheck = {};
                        settlementsVOList.map((v) => {
                            settlements[`id${v.card_id}`] = v.amount;
                            preCheck[`id${v.card_id}`] = true;
                        });
                        state.preCheck = preCheck;
                        state.formInitData2 = {
                            isSetting: isSetting ? true : false,
                            ...settlements,
                        };
                    }
                );
            },
            // 初始化
            start: () => {
                if (state.id) {
                    // 查询详情
                    planDetail({ id: state.id }).then(({ data }) => {
                        state.formInitData = data;
                        let { price, balancePrice } = data;
                        state.priceData = { price, balancePrice };
                        state.courseId = data.courseId;
                        state.getCardList(data.courseId);
                        state.getSettlements();
                    });
                }
            },
        });
        state.id = useRoute().query.id;
        state.start();

        return {
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped>
/deep/ .el-tabs__content {
    padding-bottom: 20px;
}
</style>
