<template>
    <div>
        <formList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="formListButtons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />

        <!-- 导出选择时间范围模块 -->
        <popupForm
            v-model:show="exportDatePop"
            v-model:formInitData="exportDatePopInitData"
            title="选择时间范围"
            :itemList="exportDatePopItemList"
            height="130px"
            :buttons="exportDatePopButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    exportCourseCommentListAPI,
    getCourseCommentListAPI,
} from "@/api/course";
import {
    getSelectHallListAPI,
    getSelectCoachListAPI,
    getSelectCourseListAPI,
} from "@/api/common";
import { exportCourseEvaluationAPI } from "@/api/exportURL";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { deleteItem, operation } from "@/utils/tools";
import { coachScoreList } from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm";
import { tabelFormConfig } from "@/utils/config";
import { dayDif } from "@/utils/formaData";
import { log } from "@/utils";

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
            exportDatePop: false,
            exportDatePopInitData: { startAt: new Date(), endAt: new Date() },

            exportDatePopItemList: [
                {
                    el: "date",
                    code: "betweenDate",
                    type: "daterange",
                    label: "时间范围",
                    maxDate: new Date(),

                    valueStyle: {
                        //input框样式，css
                        width: "100%",
                    },
                },
            ],

            exportDatePopButtons: [
                {
                    text: "取消",
                    click: () => (state.exportDatePop = false),
                },
                {
                    funType: "confirm",
                    type: "primary",
                    text: "确定",
                    click: ({ value }) => {
                        let _tempPar = { ...value };
                        // betweenDate
                        if (_tempPar.betweenDate) {
                            // TODO 做时间限制 时间不能超过一个月
                            const _parBetweenDate =
                                _tempPar.betweenDate.split(",");

                            if (
                                dayDif(
                                    new Date(_parBetweenDate[1]),
                                    new Date(_parBetweenDate[0])
                                ) > 31
                            ) {
                                ElMessage.warning("时间跨度不能超过31天");
                                return false;
                            }
                            _tempPar.startAt = `${_parBetweenDate[0]} 00:00:00`;
                            _tempPar.endAt = `${_parBetweenDate[1]} 23:59:59`;
                            delete _tempPar.betweenDate;
                            exportCourseEvaluationAPI({ ..._tempPar });
                            state.exportDatePop = false;
                        } else {
                            ElMessage.warning("时间必选");
                        }
                    },
                },
            ],
            // -----------------------
            getList: getCourseCommentListAPI,
            column: [
                {
                    label: "课程",
                    prop: "courseName",
                },
                {
                    label: "场馆",
                    prop: "hallName",
                },
                {
                    label: "教练",
                    prop: "coachName",
                },
                {
                    label: "教练手机号",
                    prop: "coachMobile",
                },
                {
                    label: "上课日期",
                    prop: "startAt",
                    html: (item, val) => {
                        // console.log(val, item);
                        // debugger;
                        const _endAt = item.endAt
                            ? item.endAt.split(" ")[1]
                            : "";
                        return `${item.startAt} - ${_endAt}`;
                    },
                },

                {
                    label: "教练评分",
                    prop: "coachScore",
                    html: (val) => {
                        return `${val.coachScore}分`;
                    },
                },
                {
                    label: "用户评价",
                    prop: "content",
                },
                {
                    label: "评价时间",
                    prop: "commentAt",
                },
                {
                    label: "会员",
                    prop: "replierName",
                },
                {
                    label: "会员手机号",
                    prop: "memberMobile",
                },
                {
                    label: "运营回复",
                    prop: "replyContent",
                },

                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 80,
                    actives: [
                        {
                            // perCode:'',
                            name: "回复",
                            path: "/storeClassEvaluationm/storeClassEvaluation/details",
                        },
                    ],
                },
            ],
            formInitData: {},
            itemList: [
                {
                    label: "评价内容",
                    code: "content",
                },
                {
                    label: "会员手机号",
                    code: "memberMobile",
                },

                {
                    el: "select",
                    label: "教练",
                    code: "coachId",
                    back: true, // 从后台返回结果
                    labelCode: "name", // 指定的label名
                    valueCode: "id", // 指定的value名
                    fun: getSelectCoachListAPI,
                    funMode: "one",
                    filterable: true,
                },
                {
                    el: "select",
                    label: "评分",
                    code: "coachScore",
                    list: coachScoreList,
                },
                {
                    el: "select",
                    label: "课程",
                    code: "courseId",
                    back: true, // 从后台返回结果
                    labelCode: "name", // 指定的label名
                    valueCode: "id", // 指定的value名
                    fun: getSelectCourseListAPI,
                    funMode: "one",
                    filterable: true,
                },
            ],
            config: tabelFormConfig,
            formListButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        console.log(value);
                        TableList.value.update({ ...value });
                    },
                },
                {
                    funType: "confirm",
                    name: "导出",
                    click: ({ value }) => {
                        state.exportDatePopInitData = {};
                        state.exportDatePop = true;
                        state.exportDatePopInitData = {
                            ...state.exportDatePopInitData,
                            ...value,
                        };
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

<style lang="scss" scoped></style>
