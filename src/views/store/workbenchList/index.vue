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
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            title="导出"
            :itemList="popItemList"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    deleteCourse, courseList,
} from "@/api/school";


import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {deleteItem, operation} from "@/utils/tools";
import {courseTypeList, displayList, enableDisable, getListHtml, statusList, testList} from '@/utils/enum/select'
import popupForm from '@/components/FormList/popupForm'
import {tabelFormConfig} from '@/utils/config'
import {planList} from '@/api/coursePlan'
import {getSelectClassroomListAPI, getSelectCoachAllListAPI, getSelectCourseListAPI} from '@/api/common'
import {parseTime} from '@/utils/formaData'
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
            getList:planList,
            column:[
                {
                    label: '日期',
                    prop: 'date',
                },
                {
                    label: '开始时间',
                    prop: 'startAtTime',
                },
                {
                    label: '结束时间',
                    prop: 'endAtTime',
                },
                {
                    label: '课程',
                    prop: 'courseName',
                },
                {
                    label: '课程类型',
                    prop: 'courseTypeName',
                },
                {
                    label: '教练',
                    prop: 'coachName',
                },
                {
                    label: '标签',
                    prop: 'courseLabelsName',
                },
                {
                    label: '教室',
                    prop: 'classroomName',
                },
                {
                    label: '实际上课人数',
                    prop: 'attendAmount',
                },
                {
                    label: '预约课人数',
                    prop: 'maxOrder',
                    html:({hasOrder,maxOrder})=>`${hasOrder}/${maxOrder}`
                },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 240,
                    actives: [
                        {
                            // 权限
                            // perCode:'',
                            name: "上课确认",
                           path:'/workbenchListm/workbenchList/confirm'
                        },
                        {
                            // 权限
                            // perCode:'',
                            name: "课程编辑",
                            path:'/workbenchListm/workbenchList/edit'
                        },
                        {
                            // perCode:'',
                            name: "课程详情",
                            path:'/workbenchListm/workbenchList/details'
                        },
                    ]
                }
            ],
            formInitData: {
                startAt:parseTime(new Date(new Date().getTime()-7*24*60*60*1000),'{y}-{m}-{d}'),
                endAt:parseTime(new Date(),'{y}-{m}-{d}'),
            },
            itemList:[
                {
                    el:'select',
                    label: '课程',
                    code: "courseId",
                    fun: getSelectCourseListAPI,
                },
                {
                    el:'select',
                    label: '教练',
                    code: "coachId",
                    filterable: true,
                    remote: true,
                    remoteMethod: (name) => ({ name }),
                    fun: getSelectCoachAllListAPI,
                },
                {
                    el:'select',
                    label: '教室',
                    code: "classroomId",
                    fun: getSelectClassroomListAPI,
                },
                {
                    el:'select',
                    label: '状态',
                    code: "status",
                    list: statusList,
                },
                {
                    el:'select',
                    label: '课程类型',
                    code: "courseType",
                    list: courseTypeList,
                },
                {
                    el:'date',
                    label: '课程日期',
                    type: "daterange",
                    otherCodeArr: ["startAt", "endAt"],
                    code: "dateT",
                },
            ],
            config : tabelFormConfig,
            buttons:[
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click:({value})=>{
                        TableList.value.update({...value})
                    }
                },
                {
                    name: "导出",
                    click:({value})=>{
                        state.popShow=true
                    }
                },
            ],
            // 弹窗
            popShow: false,
            popFormInitData: {},
            popItemList: [
                {
                    el:'date',
                    label: '选择月份',
                    code: 'aaa6069',
                    type:'month',
                },
            ],
            popButtons:[
                {
                    name: "取消",
                    click:()=>{
                       state.popShow=false
                    }
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click:({value})=>{
                        console.log(value)
                        state.popShow=false
                    }
                },
            ]
        });
        return {
            ...toRefs(state),
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped>
</style>
