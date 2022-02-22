<template>
    <emptyBox bottom="30">
        <div class="workList_top">
            <div class="workList_top_head">{{formInitData.startAt}} - {{formInitData.endAt}} {{formInitData.courseName}}    {{formInitData.classroomName}}</div>
            <div class="workList_top_li">
                <div class="workList_top_in">教练：{{formInitData.coachName}}</div>
                <div class="workList_top_in">签到时间：{{formInitData.coachSignInTime||'没有签到'}}</div>
            </div>
            <div class="workList_top_li" v-if="formInitData.assistantList">
                <div class="workList_top_in">
                    <div class="workList_top_b">助教：</div>
                    <div class="workList_top_bd">
                        <div class="workList_top_ass" v-for="assist in formInitData.assistantList">
                            <div class="workList_top_name">{{assist.name}}</div>
                            {{assist.assistantSignInTime}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="workList_top_li">
                <div class="workList_top_in">预约人数:{{formInitData.hasOrder}}/{{formInitData.maxOrder}}</div>
            </div>
        </div>
        <Table
            ref="TableRef"
            :data="tableList"
            :column="column"
            :params="params"
        />
    </emptyBox>
</template>

<script>
/*
 * 上课确认
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import Table from '@/components/Table'
import {courseList} from '@/api/school'
import popupForm from '@/components/FormList/popupForm'
import {getListHtml, testList, volumeStatusList} from '@/utils/enum/select'
import {testApi} from '@/api/managerStaff'
import {
    coursePlanOrderRegisterPost, coursePlanOrderStatusPost,
    planDetailWorkbench,
    planStaffSignInPost,
    planStaffSignOutPost
} from '@/api/coursePlan'
import {courseCard, membeCourseCards, memberOptions} from '@/api/common'
import {hallCourseCardBoxList} from '@/api/hall'
import {messageBox} from '@/utils/tools'

export default {
    components: {
        formList,
        emptyBox,
        Table,
        popupForm,
    },
    setup() {
        const router = useRouter();
        const TableRef = ref('');
        const formListRef = ref(null);
        const state = reactive({
            num:1,
            id: "",
            config: { ...addFormBottom },
            params:{
                id:computed(()=>state.id)
            },
            tableList:[],
            column:[
                {
                    label: '排队号',
                    prop: 'queueNum',
                },
                {
                    label: '会员',
                    prop: 'memberName',
                },
                {
                    label: '手机号',
                    prop: 'phone',
                },
                {
                    label: '时间',
                    prop: 'time',
                },
                {
                    label: '状态',
                    prop: 'status',
                    html:({status})=>getListHtml(volumeStatusList,status)
                },
                {
                    label: '备注',
                    prop: 'status',
                },
            ],
            formInitData: {},
            // 初始化
            start: () => {
                if ( state.id||(useRoute().query && useRoute().query.id)) {
                    state.id =state.id|| useRoute().query.id;
                    // 查询详情
                    planDetailWorkbench({id:state.id}).then(({data}) => {
                        state.formInitData=data
                        state.tableList=data.coursePlanOrderItemsListVOList||[]
                    });
                }
            }
        });
        state.start();
        return {
            formListRef,
            TableRef,
            ...toRefs(state)
        };
    }
};
</script>

<style lang="scss" scoped>
.workList_top{
    .workList_top_head{
        margin-bottom: 10px;
        font-size: 15px;
        color: #333;
    }
    .workList_top_li{
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &:last-child{
            margin-bottom: 0;
        }
    }
    .workList_top_in{
        //display: flex;
        margin-right: 30px;
    }
    .workList_top_b{
        display: inline-block;
        vertical-align: top;
    }
    .workList_top_bd{
        display: inline-block;
        position: relative;
        top: -5px;
    }
    .workList_top_ass{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .workList_top_name{
        margin-left: 10px;
        margin-right: 10px;
    }
    .workList_top_right{
        position: absolute;
        right: 30px;
        bottom: 0;
    }
}
</style>
