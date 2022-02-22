<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 13:59:25
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-27 09:37:49
 * @Descripttion: 排课
-->
<template>
    <div class="">
        <formList
            :config="searchConfig"
            :buttons="buttons"
            :itemList="searchList"
            :formInitData="searchData"
            :form-state="formState"
        />
        <el-tabs v-model="mode" @tab-click="tabClick">
            <el-tab-pane label="表格" name="1">
                <Table
                    v-if="mode == 1"
                    ref="TableList"
                    :loadData="getList"
                    :column="column"
                    :params="searchData"
                    :showSortIndex="{ show: true, lable: '序号' }"
                >
                </Table>
            </el-tab-pane>
            <el-tab-pane label="周排列" name="2">
                <calendarCard
                    v-if="mode == 2"
                    :list="weekData"
                    @changeTime="changeTime"
                    @details="details"
                    @headItem="headItem"
                />
            </el-tab-pane>
            <el-tab-pane label="月排列" name="3">
                <div v-if="mode == 3" class="calendar_user">
                    <el-config-provider :locale="locale">
                        <el-calendar v-model="month" ref="calendar">
                            <template #dateCell="{ data }">
                                <div
                                    class="calendar_slot"
                                    :class="data.isSelected ? 'choose' : ''"
                                >
                                    <div class="day" @click="addDay(data)">
                                        {{ getDateData(data).day }}
                                        <span
                                            class="add iconfont icon-jiahao"
                                        ></span>
                                    </div>
                                    <div
                                        class="calendar_list"
                                        v-if="getDateData(data).list.length > 0"
                                    >
                                        <template
                                            v-for="(it, index) in getDateData(
                                                data
                                            ).list"
                                        >
                                            <div
                                                :key="index"
                                                class="calendar_item"
                                                v-if="index < 2"
                                                @click="
                                                    changeItem(data, it, index)
                                                "
                                                :class="{
                                                    noState: it.state == 0,
                                                }"
                                            >
                                                <div class="calendar_name">
                                                    {{ it.courseName }}
                                                </div>
                                                <div class="calendar_time">
                                                    {{ it.startAtTime }} -
                                                    {{ it.endAtTime }}
                                                </div>
                                                <div class="calendar_coach">
                                                    {{ it.coachName }} 【{{
                                                        it.classroomName
                                                    }}】
                                                </div>
                                                <div class="calendar_mode">
                                                    {{ it.mode }}
                                                </div>
                                                <div
                                                    class="calendar_audit"
                                                    v-if="it.state == 0"
                                                >
                                                    未审核
                                                </div>
                                            </div>
                                        </template>
                                        <div
                                            class="calendar_more"
                                            v-if="
                                                getDateData(data).list.length >
                                                3
                                            "
                                            @click="
                                                moreDate(getDateData(data).list)
                                            "
                                        >
                                            +{{
                                                getDateData(data).list.length -
                                                2
                                            }}
                                            更多
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-calendar>
                    </el-config-provider>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--团课-->
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            :title="popTitle"
            :itemList="popItemList"
            :formConfig="popFormConfig"
            :buttons="popButtons"
        />
        <!--私教，企业课-->
        <popupForm
            v-model:show="privateShow"
            v-model:formInitData="privateData"
            :title="privateTitle"
            :itemList="privateList"
            :buttons="privateButtons"
            :formConfig="popFormConfig"
        />
        <popup v-model:show="popTableShow" :title="popTableTitle">
            <Table
                :headHight="600"
                :data="popTableData"
                :column="popTableColumn"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </popup>
    </div>
</template>

<script>
import { reactive, toRefs, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import zhCn from "element-plus/lib/locale/lang/zh-cn";
import popupForm from "@/components/FormList/popupForm";
import popup from "@/components/popup/index";
import formList from "@/components/FormList";
import calendarCard from "@/components/calendarCard";
import Table from "@/components/Table";
import {
    arrangingList,
    classroomTypeList,
    courseTypeList,
    getListHtml,
    statusList,
    weekList,
} from "@/utils/enum/select";
import {
    tabelFormConfigMini,
} from "@/utils/config";
import {
    getClassroomListAPI,
} from "@/api/classroom";
import { deleteItem, messageBox } from "@/utils/tools";
import {
    planAddPost,
    planList,
    planMonth,
    planStatusPut,
    planWeek,
} from "@/api/coursePlan";
import {distanceMonth, parseTime} from "@/utils/formaData";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    getSelectClassroomListAPI,
    getSelectCoachAllListAPI,
    getSelectCoachListAPI,
    getSelectCourseLableListAPI,
    getSelectCourseListAPI,
    membeCourseCards,
    memberOptions,
    planCourse,
} from "@/api/common";
import store from "@/store";

export default {
    components: {
        popupForm,
        formList,
        Table,
        popup,
        calendarCard,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const calendar = ref(null);
        const state = reactive({
            tabClick: (val) => {
                state.formState = [
                    {
                        code: "dateT",
                        show: val.index == 0,
                    },
                ];
                if (state.mode==2) {
                    state.getWeek(0);
                }
                if (state.mode==3) {
                    state.getMonth(0);
                }
            },
            formState: [],
            onLine: false,
            popupShow: true,
            // 新加团课编辑弹窗
            popTitle: computed(() => state.showStateObj[state.showState].title),
            popFormConfig: {
                default: {
                    disabled: computed(() =>
                        state.showState == 3 ? true : false
                    ),
                },
                buttons: [],
            },
            showState: 1,
            showStateObj: {
                1: {
                    title: "新加",
                    buttonConfirm: "确认",
                },
                2: {
                    title: "编辑",
                    buttonConfirm: "确认",
                },
                3: {
                    title: "查看",
                    buttonConfirm: "",
                },
            },
            popShow: false,
            popFormInitData: {},
            popButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.popShow = false;
                        state.popupShow = false;
                    },
                },
                {
                    show: computed(() => (state.showState != 3 ? true : false)),
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        let par = { ...value };
                        // 单日
                        if (value.timeType == 2) {
                            let {
                                endDate,
                                endTime,
                                startDate,
                                startTime,
                                weekday,
                            } = value;
                            par.coursePlanCycleDTO = {
                                endDate,
                                endTime,
                                startDate,
                                startTime,
                                weekday,
                            };
                        }
                        if (store.getters.activeCityId==820303) {
                            par.classroomType = 1;
                        }
                        par.coursePlanType = 1;
                        planAddPost(par).then(({ code, data }) => {
                            if (code == 200) {
                                ElMessage.success("新加成功");
                                state.popShow = false;
                                TableList.value.update();
                            }
                        });
                    },
                },
            ],
            popItemList: [
                {
                    el: "select",
                    label: "课程名称",
                    code: "courseId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: planCourse,
                    query: {
                        type: 1,
                    },
                },
                {
                    el: "select",
                    label: "教练",
                    code: "coachId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachListAPI,
                },
                {
                    el: "radio",
                    show: computed(() => store.getters.activeCityId!=820303),
                    label: "教室类型",
                    code: "classroomType",
                    default: "0",
                    list: classroomTypeList,
                    required: false,
                },
                {
                    el: "select",
                    label: "教室",
                    show: computed(() => store.getters.activeCityId!=820303),
                    code: "classroomId",
                    fun: getClassroomListAPI,
                    query: {
                        courseType: 1,
                    },
                },
                {
                    el: "select",
                    label: "助教",
                    default: [],
                    code: "assistants",
                    required: false,
                    filterable: true,
                    multiple: true,
                    backType: "ArrayNumber",
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachListAPI,
                },
                {
                    el: "select",
                    label: "标签",
                    code: "courseLabelsIds",
                    default: [],
                    fun: getSelectCourseLableListAPI,
                    multiple: true,
                    backType: "ArrayNumber",
                    required: false,
                },
                {
                    label: "可约人数",
                    code: "maxOrder",
                    checkType: "number",
                    type: "number",
                    maxlength: 6,
                    // maxCode:50
                },
                {
                    label: "旁听人数",
                    show: computed(() => store.getters.online),
                    code: "auditorNumber",
                    required: false,
                    checkType: "number",
                    type: "number",
                    maxlength: 6,
                    // maxCode:50
                },
                {
                    el: "radio",
                    label: "模式",
                    code: "timeType",
                    required: false,
                    default: "1",
                    list: arrangingList,
                    valueChange: (val) => [
                        {
                            code: "dates",
                            show: val == 1,
                        },
                        {
                            code: "weekday",
                            show: val != 1,
                        },
                        {
                            code: "dateB",
                            show: val != 1,
                        },
                        {
                            code: "timeB",
                            show: val != 1,
                        },
                    ],
                },
                {
                    show: false,
                    el: "addItem",
                    label: "选择时间",
                    code: "dates",
                    required: false,
                    valueStyle: {
                        width: "510px",
                    },
                    itemList: [
                        {
                            labelShow: false,
                            label: "日期",
                            code: "date",
                            size: "mini",
                            el: "date",
                            type: "date",
                            valueStyle: {
                                width: "150px",
                            },
                        },
                        {
                            labelShow: false,
                            label: "时间",
                            size: "mini",
                            el: "timePicker",
                            isRange: true,
                            code: "timePicker",
                            otherCodeArr: ["startTime", "endTime"],
                            startPlaceholder: "开始时间",
                            endPlaceholder: "结束时间",
                            valueStyle: {
                                width: "180px",
                            },
                        },
                    ],
                },
                {
                    el: "date",
                    code: "dateB",
                    label: "日期范围",
                    type: "daterange",
                    otherCodeArr: ["startDate", "endDate"],
                },
                {
                    label: "时间",
                    el: "timePicker",
                    isRange: true,
                    code: "timeB",
                    otherCodeArr: ["startTime", "endTime"],
                    startPlaceholder: "开始时间",
                    endPlaceholder: "结束时间",
                },
                {
                    el: "select",
                    label: "设置周期",
                    code: "weekday",
                    backType: "ArrayNumber",
                    multiple: true,
                    list: weekList,
                },
            ],
            // 私教2，企业3，弹窗
            privates: 2,
            privateTitle: computed(
                () => state.privateObj[state.privates].title
            ),
            privateObj: {
                2: {
                    title: "添加私教课",
                    type: 2,
                    type2: 1,
                    type3: 2, //1团课2私教，用于请求教室
                },
                3: {
                    title: "添加企业课",
                    type: 3,
                    type2: 2,
                    type3: 1, //1团课2私教，用于请求教室
                },
            },
            privateShow: false,
            privateData: {},
            choseCard: {},
            privateList: [
                {
                    el: "select",
                    label: "课程名称",
                    code: "courseId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: planCourse,
                    query: {
                        type: computed(
                            () => state.privateObj[state.privates].type
                        ),
                    },
                },
                {
                    el: "select",
                    label: "教练",
                    code: "coachId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachListAPI,
                },
                {
                    el: "select",
                    label: "教室",
                    show: computed(() => store.getters.activeCityId!=820303),
                    code: "classroomId",
                    fun: getSelectClassroomListAPI,
                    query: {
                        courseType: computed(
                            () => state.privateObj[state.privates].type3
                        ),
                    },
                },
                {
                    el: "select",
                    label: "助教",
                    code: "assistants",
                    default: [],
                    multiple: true,
                    backType: "ArrayNumber",
                    required: false,
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachListAPI,
                },
                {
                    el: "select",
                    label: "会员",
                    code: "memberId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (keyword) => ({ keyword }),
                    fun: memberOptions,
                    funMode: (res) =>
                        res.data.records.map((v) => ({
                            value: v.id,
                            label: v.name,
                        })),
                    query: {
                        type: computed(
                            () => state.privateObj[state.privates].type2
                        ),
                    },
                    tips: "",
                    // 下拉联动
                    seriesCode: "memberCourseCardId", // 联动的下拉code
                    seriesFun: (memberId, formObj) => ({
                        memberId,
                        courseId: formObj.courseId,
                    }), //组装参数
                },
                {
                    el: "select",
                    label: "选卡",
                    code: "memberCourseCardId",
                    fun: membeCourseCards,
                    firstRequest: false, //第一次不请求
                },
                {
                    label: "扣费",
                    code: "amount",
                    type: "number",
                    checkType: "number",
                    suffix: "次",
                    maxlength: 6,
                },
                {
                    el: "date",
                    label: "日期",
                    code: "date",
                    type: "date",
                },
                {
                    label: "时间",
                    el: "timePicker",
                    isRange: true,
                    code: "timeB",
                    otherCodeArr: ["startTime", "endTime"],
                    startPlaceholder: "开始时间",
                    endPlaceholder: "结束时间",
                },
                {
                    el: "textArea",
                    label: "备注",
                    code: "remark",
                    required: false,
                },
            ],
            privateButtons: [
                {
                    name: "取消",
                    click: ({ value }) => {
                        state.privateShow = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        let par = value;
                        let {
                            memberCourseCardId,
                            total,
                            date,
                            endTime,
                            startTime,
                        } = value;
                        par.coursePlanType =
                            state.privateObj[state.privates].type;
                        par.classroomType = 1;
                        if (store.getters.activeCityId==820303) {
                            par.classroomType = 1;
                        }else{
                            par.classroomType = 0;
                        }
                        par.timeType = 1;
                        par.dates = [{ date, endTime, startTime }];
                        par.paymentDTO = {
                            memberCourseCardId,
                            total,
                        };
                        planAddPost(par).then(({ code, data }) => {
                            TableList.value.update();
                            ElMessage.success("新加成功");
                            state.privateShow = false;
                        });
                    },
                },
            ],
            mode: "1", //模式1 表格
            locale: zhCn,
            // 搜索表单--搜索项
            // 搜索表格--数据
            searchData: {
                startAt:parseTime(new Date(new Date().getTime()-7*24*60*60*1000),'{y}-{m}-{d}'),
                endAt:parseTime(new Date(),'{y}-{m}-{d}'),
            },
            searchList: [
                {
                    el: "select",
                    label: "课程",
                    code: "courseId",
                    fun: getSelectCourseListAPI,
                },
                {
                    el: "select",
                    label: "教练",
                    code: "coachId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachAllListAPI,
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: statusList,
                },
                {
                    el: "select",
                    label: "教室",
                    show: computed(() => store.getters.activeCityId!=820303),
                    code: "classroomId",
                    fun: getSelectClassroomListAPI,
                },
                {
                    el: "select",
                    label: "课程类型",
                    code: "courseType",
                    list: courseTypeList,
                },
                {
                    labelShow: true,
                    labelWidth: "6em",
                    el: "date",
                    label: "课程日期",
                    type: "daterange",
                    otherCodeArr: ["startAt", "endAt"],
                    code: "dateT",
                    valueStyle: {
                        width: "300px",
                    },
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfigMini,
                button: {
                    el: "span",
                },
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        state.weekPar={... state.weekPar,...value}
                        if (state.mode==1) {
                            TableList.value.update(value);
                        }
                        if (state.mode==2) {
                            state.getWeek(null, value)
                        }
                        if (state.mode==3) {
                            state.getMonth(null, value)
                        }
                    },
                },
                {
                    name: "批量排课导入",
                    click: () => {},
                },
                {
                    name: "导出",
                    click: () => {},
                },
                {
                    name: "排团课",
                    click: () => {
                        state.popShow = true;
                        state.showState = 1;
                        // router.push(
                        //     "/workOutATeachingSchedulem/workOutATeachingSchedule/addGroup"
                        // );
                    },
                },
                {
                    name: "排私教课",
                    click: () => {
                        state.privates = 2;
                        state.privateShow = true;
                    },
                },
                {
                    name: "排企业课",
                    click: () => {
                        state.privates = 3;
                        state.privateShow = true;
                    },
                },
            ],

            // table表单
            getList: planList,
            column: [
                {
                    label: "课程",
                    prop: "courseName",
                },
                {
                    label: "教室",
                    prop: "classroomName",
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
                    label: "标签",
                    prop: "courseLabelsName",
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
                    prop: "action",
                    label: "操作",
                    width: "200",
                    actives: [
                        {
                            perCode: "a0601b",
                            name: (val) => {
                                return "编辑";
                            },
                            method: (row, val) => {
                                router.push({
                                    path: "/workOutATeachingSchedulem/workOutATeachingSchedule/editGroup",
                                    query: { id: row.id },
                                });
                            },
                        },
                        // {
                        //     perCode: "a0601b",
                        //     name: (row) =>  "详情",
                        //     method: (row) => {
                        //         let form={...row}
                        //         form.courseId=row.courseId+''
                        //         form.classroomId=row.classroomId+''
                        //         form.hallId=row.hallId+''
                        //         form.classroomType=row.classroomType==null?'0':row.classroomType
                        //         form.courseLabelsIds=JSON.parse(row.courseLabelsIds)
                        //         state.showState = 3;
                        //         state.popShow = true;
                        //         state.popFormInitData = { ...form };
                        //     },
                        // },
                        {
                            perCode: "a0601e",
                            // perCode: (row) => (row.status ? "aaa" : "bbb"),
                            name: (row) => (row.status != -1 ? "取消" : ""),
                            method: (row) => {
                                messageBox(row, planStatusPut, TableList, {
                                    title: "是否取消",
                                    params: {
                                        status: -1,
                                    },
                                });
                            },
                        },
                    ],
                },
            ],
            calendarData: [],
            // 天--加
            addDay: (date) => {
                state.popFormInitData = { dates: [{ date: date.day }] };
                state.popShow = true;
            },
            // 课程修改
            changeItem: (data, it, index) => {
                router.push({
                    path: "/workOutATeachingSchedulem/workOutATeachingSchedule/editGroup",
                    query: { id: it.id },
                });
            },
            selectDate: (val) => {
                if (val == "prev-month") {
                    state.getMonth(-1);
                }
                if (val == "today") {
                    state.getMonth(0);
                }
                if (val == "next-month") {
                    state.getMonth(1);
                }
                calendar.value.selectDate(val);
            },
            count: 0,
            getDateData: (date) => {
                let day = date.day.split("-")[2];
                let find = state.calendarData.filter(
                    (v) => v.weekDate == date.day
                );
                let list = find.length > 0 ? find[0].coursePlanWeekVOS : [];
                let back = {
                    day,
                    list,
                };
                return back;
            },
            // 更多数据
            moreDate: (data) => {
                state.popTableData = data;
                state.popTableShow = true;
                state.popTableTitle = data[0].date;
            },
            popTableTitle: "",
            popTableShow: false,
            popTableData: [],
            popTableColumn: [
                {
                    label: "开始时间",
                    prop: "startAtTime",
                },
                {
                    label: "结束时间",
                    prop: "endAtTime",
                },
                {
                    label: "课程名称",
                    prop: "courseName",
                },
                {
                    label: "教练",
                    prop: "coachName",
                },
                {
                    label: "场地",
                    prop: "classroomName",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: "80",
                    actives: [
                        {
                            perCode: "a0601b",
                            name: (val) => {
                                return "详情";
                            },
                            method: (row, val) => {
                                router.push({
                                    path: "/workOutATeachingSchedulem/workOutATeachingSchedule/editGroup",
                                    query: { id: row.id },
                                });
                            },
                        },
                    ],
                },
            ],
            month: new Date(),
            monthSize: 0,
            // 获取每月排课
            getMonth: (size,par) => {
                let monthSize=size!=null?size:state.weekPar.monthSize
                state.weekPar={...state.weekPar,...par,monthSize}
                planMonth(state.weekPar).then((res) => {
                    state.calendarData = res.data;
                });
            },
            weekData: [],
            weekPar:{},
            getWeek: (size,par) => {
                let weekSize=size!=null?size:state.weekPar.weekSize
                state.weekPar={...state.weekPar,...par,weekSize}
                planWeek(state.weekPar).then((res) => {
                    state.weekData = res.data.map((v) => v.coursePlanWeekVOS);
                });
            },
            // 周的日历
            // 改变事件
            changeTime: (val) => {
                state.getWeek(val.diffWeek);
            },
            headItem: ({ date }) => {
                state.popFormInitData = { dates: [{ date }] };
                state.popShow = true;
            },
            // 详情
            details: (val) => {
                router.push({
                    path: "/workOutATeachingSchedulem/workOutATeachingSchedule/editGroup",
                    query: { id: val.id },
                });
            },
            // 获取
            getCalendar: () => {},
        });
        watch(
            () => state.month,
            (val, old) => {
                if (
                    distanceMonth(val, new Date()) !=
                    distanceMonth(old, new Date())
                ) {
                    state.getMonth(distanceMonth(val, new Date()));
                }
            }
        );


        return {
            TableList,
            calendar,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped>
.calendar_user {
    & /deep/ .el-calendar-day {
        height: auto !important;
        padding: 0;
    }
    & /deep/ tbody {
        display: block;
        height: calc(100vh - 410px);
        width: calc(100vw - 300px);
        overflow-y: scroll;
        tr {
            display: table;
            width: 100%;
            table-layout: fixed;
        }
    }
    .day {
        display: flex;
        justify-content: space-between;
        padding: 12px 9px;
        font-size: 18px;
        border-bottom: 1px solid #ebeef5;
    }
    .add {
        color: #999;
    }
    .calendar_slot {
        //text-align: center;
        font-size: 12px;
        color: #555;
        &.choose {
            color: #009ead;
        }
    }
    .calendar_list {
        //margin-top: 6px;

        .calendar_item {
            position: relative;
            padding: 9px 10px;
            overflow: hidden;
            border-bottom: 3px solid #fff;
            background: rgba(#26d477, 0.2);
            color: #848484;
            &:before {
                position: absolute;
                top: -6px;
                left: -6px;
                z-index: 1;
                content: "";
                width: 12px;
                height: 12px;
                transform: rotate(45deg);
                background: #26d477;
            }
            &.noState {
                background: rgba(#fda322, 0.1);
                &:before {
                    background: #fda322;
                }
            }
            &.red {
                color: red;
            }
            &:last-child {
                //padding-bottom: 0;
                border-bottom: 0;
            }
            .calendar_name,
            .calendar_time,
            .calendar_coach {
                margin-bottom: 6px;
            }
            .calendar_name {
                color: #333;
            }
            .calendar_time {
            }
            .calendar_coach {
                margin-bottom: 0;
            }
            .calendar_mode {
            }
            .calendar_audit {
                position: absolute;
                top: 0px;
                right: 0;
                padding: 0px 4px;
                font-size: 8px;
                background: rgba(#faac2c, 0.15);
                color: #f09a1e;
            }
        }
        .calendar_more {
            width: 100%;
            padding: 6px 0;
            color: #333;
            background: #fff;
            text-align: center;
        }
    }
}
</style>
