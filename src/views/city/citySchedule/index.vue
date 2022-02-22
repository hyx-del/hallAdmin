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
import { updateCourseStatus, deleteCourse, courseList } from "@/api/school";


import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { confirmBox, deleteItem, operation } from "@/utils/tools";
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
import { planList, planStatusPut } from "@/api/coursePlan";
import {
    getSelectCourseLableListAPI,
    getSelectHallListAPI,
    planCourse,
} from "@/api/common";
import { coachList } from "@/api/coach";
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
                    label: "课程",
                    prop: "courseName",
                },
                {
                    label: "课程类型",
                    prop: "courseTypeName",
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
                    label: "日期",
                    prop: "date",
                },
                {
                    label: "开始时间",
                    prop: "startAt",
                },
                {
                    label: "结束时间",
                    prop: "endAt",
                },
                {
                    label: "状态",
                    prop: "status",
                    html: (row, val) => getListHtml(statusList, val),
                },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 120,
                    actives: [
                        {
                            // perCode:'',
                            name: ({ status }) => status == 0 && "审核",
                            method: (row) => {
                                confirmBox(
                                    planStatusPut,
                                    { id: row.id, status: 1 },
                                    TableList,
                                    {
                                        title: "确定通过审核？",
                                    }
                                );
                            },
                        },
                        {
                            // perCode:'',
                            name: ({ status }) => status == 0 && "取消",
                            method: (row) => {
                                confirmBox(
                                    planStatusPut,
                                    { id: row.id, status: -1 },
                                    TableList,
                                    {
                                        title: "确定取消课程？",
                                    }
                                );
                            },
                        },
                    ],
                },
            ],
            formInitData: {},
            itemList: [
                // {
                //     label: "教练电话",
                //     code: "aaa97833",
                // },
                {
                    el: "select",
                    label: "场馆",
                    code: "hallId",
                    fun: getSelectHallListAPI,
                },
                {
                    el: "select",
                    label: "课程",
                    code: "courseId",
                    fun: planCourse,
                },
                {
                    el: "select",
                    label: "教练",
                    code: "coachId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: coachList,
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
                    code: "assistants",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: coachList,
                },
                {
                    el: "date",
                    code: "dateB",
                    label: "课程日期",
                    type: "daterange",
                    otherCodeArr: ["startDate", "endDate"],
                    valueStyle: {
                        width: "240px",
                    },
                },
            ],
            config: tabelFormConfigMini,
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({ ...value });
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
