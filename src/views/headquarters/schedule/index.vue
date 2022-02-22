<template>
    <div>
        <formList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { deleteItem, operation } from "@/utils/tools";
import {
    courseTypeList,
    displayList,
    enableDisable,
    getListHtml,
    statusList,
    testList,
} from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm";
import { tabelFormConfig, tabelFormConfigMini } from "@/utils/config";
import { planList } from "@/api/coursePlan";
import { coursePage } from "@/api/course";
import {
    getSelectCoachListAPI,
    getSelectCourseLableListAPI,
    hallHallList,
} from "@/api/common";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            // -----------------------
            getList: planList,
            column: [
                {
                    label: "场馆",
                    prop: "hallName",
                },
                {
                    label: "教室",
                    prop: "classroomName",
                },
                {
                    label: "课程",
                    prop: "courseName",
                },
                {
                    label: "教练",
                    prop: "coachName",
                },
                {
                    label: "助教",
                    prop: "assistantName",
                },
                {
                    label: "标签",
                    prop: "courseLabelsName",
                },
                {
                    label: "可约人数",
                    prop: "maxOrder",
                },
                {
                    label: "日期",
                    prop: "date",
                },
                {
                    label: "开始时间",
                    prop: "startAtTime",
                },
                {
                    label: "结束时间",
                    prop: "endAtTime",
                },
                {
                    label: "状态",
                    prop: "status",
                    html: (row, val) => getListHtml(statusList, val),
                },
                {
                    label: "课程类型",
                    prop: "type",
                    html: (row, val) => getListHtml(courseTypeList, val),
                },
                {
                    label: "教练状态",
                    prop: "coachStatusName",
                },
                {
                    label: "实际上课人数",
                    prop: "attendAmount",
                    default: "0",
                },
            ],
            formInitData: {},
            itemList: [
                {
                    el: "select",
                    label: "教练名称",
                    placeholder: "教练名称",
                    code: "coachId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachListAPI,
                },
                {
                    label: "教练电话",
                    code: "mobile",
                    placeholder: "教练电话",
                },
                {
                    el: "select",
                    label: "场馆",
                    code: "hallId",
                    fun: hallHallList,
                    funMode: (res) =>
                        res.data.map((v) => ({ value: v.id, label: v.name })),
                },
                {
                    el: "select",
                    label: "课程",
                    code: "courseId",
                    fun: coursePage,
                },
                {
                    el: "select",
                    label: "标签",
                    code: "courseLabelsId",
                    fun: getSelectCourseLableListAPI,
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: statusList,
                },
                {
                    el: "select",
                    label: "课程种类",
                    code: "courseType",
                    list: courseTypeList,
                },
                {
                    el: "select",
                    label: "助教",
                    code: "assistant",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachListAPI,
                },
                {
                    labelShow: true,
                    el: "date",
                    label: "课程日期",
                    code: "dateT",
                    type: "daterange",
                    backType: "Date",
                    otherCodeArr: ["startAt", "endAt"],
                    // valueStyle: {
                    //     width: "280px",
                    // },
                },

                {
                    el: "addItem",
                    label: "上课人数范围",
                    labelShow: true,
                    code: "itemList",
                    rightButtonShow: false,
                    // inline: true,
                    valueStyle: {
                        width: "400px",
                    },
                    itemList: [
                        {
                            label: "最少人数",
                            placeholder: "最少人数",
                            tips: "最少人数",
                            labelShow: false,
                            code: "attendClassMin",
                            type: "number",
                            maxlength: 6,
                            checkType: "number",
                            required: false,
                            valueStyle: {
                                width: "120px",
                            },
                            valueChange: (val, formObj) => ({
                                formObj: {
                                    pre2:
                                        Number(val) > Number(formObj.pre2)
                                            ? operation(formObj, "pre+1")
                                            : formObj.pre2,
                                },
                            }),
                        },
                        {
                            label: "最多人数",
                            placeholder: "最多人数",
                            tips: "最多人数",
                            labelShow: false,
                            code: "attendClassMax",
                            type: "number",
                            maxlength: 6,
                            checkType: "number",
                            required: false,
                            valueStyle: {
                                width: "121px",
                            },
                            valueChange: (val, formObj) => ({
                                formObj: {
                                    pre:
                                        val < formObj.pre
                                            ? parseInt(val - 1)
                                            : formObj.pre,
                                },
                            }),
                        },
                    ],
                },
            ],
            config: tabelFormConfig,
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({
                            ...value,
                            ...value.itemList[0],
                        });
                    },
                },
            ],
        });
        return {
            ...toRefs(state),
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped>
.name {
    cursor: pointer;
    color: #2e8de6;
}
</style>
