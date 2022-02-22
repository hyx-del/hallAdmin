<template>
  <emptyBox bottom="30">
      <div class="workList_top">
          <div class="workList_top_head">{{formInitData.startAt}} - {{formInitData.endAt}} {{formInitData.courseName}}    {{formInitData.classroomName}}</div>
          <div class="workList_top_li">
              <div class="workList_top_in">教练：{{formInitData.coachName}}</div>
              <div class="workList_top_in">签到时间：{{formInitData.coachSignInTime||'没有签到'}}</div>
              <el-button size="small"
                         type="primary"
                         @click="signPost(formInitData.coachId,formInitData.coachSignInTime?2:1)"
              >{{formInitData.coachSignInTime?'签出':'签到'}}</el-button>
          </div>
          <div class="workList_top_li" v-if="formInitData.assistantList">
              <div class="workList_top_in">
                  <div class="workList_top_b">助教：</div>
                  <div class="workList_top_bd">
                      <div class="workList_top_ass" v-for="assist in formInitData.assistantList">
                          <div class="workList_top_name">{{assist.name}}</div>
                          {{assist.assistantSignInTime}}
                          <el-button size="small" type="primary"
                                     @click="signPost(assist.id,assist.assistantSignInTime?4:3)">
                              {{assist.assistantSignInTime?'签出':'签到'}}
                          </el-button>
                      </div>
                  </div>
              </div>
          </div>
          <div class="workList_top_li">
              <div class="workList_top_in">预约人数:{{formInitData.hasOrder}}/{{formInitData.maxOrder}}</div>
              <div class="workList_top_right">
                  <el-button size="small" type="primary" @click="orderOut(1)">添加预约</el-button>
                  <el-button size="small" type="primary" @click="orderOut(2)">添加排队</el-button>
              </div>
          </div>
      </div>
      <Table
          ref="TableRef"
          :data="tableList"
          :column="column"
          :params="params"
      />
      <!--教练和助教的签到、签出-->
      <popupForm
          v-model:show="signShow"
          v-model:formInitData="signData"
          :title="signTitle"
          :itemList="signList"
          :buttons="signButtons"
      />
      <!--添加预约、排队-->
      <popupForm
          v-model:show="orderShow"
          v-model:formInitData="orderFormInitData"
          :title="orderTitle"
          :itemList="orderList"
          :buttons="orderButtons"
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
import {courseCard, membeCourseCards, memberHallBoxList, memberOptions} from '@/api/common'
import {hallCourseCardBoxList} from '@/api/hall'
import {messageBox} from '@/utils/tools'
import { ElMessage, ElMessageBox } from "element-plus";

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
            {
                prop: "action",
                label: "操作",
                fixed: "right",
                width: 220,
                actives: [
                    {
                        // 权限
                        name: ({status})=>status==20&&"上课",
                        method: (row)=>{
                            messageBox(row,coursePlanOrderStatusPost,TableRef,{
                                title:'确定上课？',
                                params:{
                                    status:40
                                }
                            },()=>{
                                state.start()
                            })
                            console.log(row)
                        },
                    },
                    {
                        // 权限
                        name: ({status})=>status==20&&"取消预约",
                        method: (row)=>{
                            messageBox(row,coursePlanOrderStatusPost,TableRef,{
                                title:'确定取消预约？',
                                params:{
                                    status: -20
                                }
                            },()=>{
                                state.start()
                            })
                            console.log(row)
                        },
                    },
                    {
                        // 权限
                        name: ({status})=>status==20&&"爽约",
                        method: (row)=>{
                            messageBox(row,coursePlanOrderStatusPost,TableRef,{
                                title:'确定爽约？',
                                params:{
                                    status:-40
                                }
                            },()=>{
                                state.start()
                            })
                            console.log(row)
                        },
                    },
                    {
                        // 权限
                        name: ({status})=>status==40&&"取消上课",
                        method: (row)=>{
                            messageBox(row,coursePlanOrderStatusPost,TableRef,{
                                title:'确定取消上课？',
                                params:{
                                    status:-20
                                }
                            },()=>{
                                state.start()
                            })
                            console.log(row)
                        },
                    },
                    {
                        // 权限
                        name: ({status})=>status==10&&"取消排队",
                        method: (row)=>{
                            messageBox(row,coursePlanOrderStatusPost,TableRef,{
                                title:'确定取消排队？',
                                params:{
                                    status:-10
                                }
                            },()=>{
                                state.start()
                            })
                            console.log(row)
                        },
                    },
                    {
                        // 权限
                        name: ({status})=>status==10&&"排队转预约",
                        method: (row)=>{
                            messageBox(row,coursePlanOrderStatusPost,TableRef,{
                                title:'确定转预约？',
                                params:{
                                    status:20
                                }
                            },()=>{
                                state.start()
                            })
                        },
                    },
                ]
            }
        ],
        formInitData: {},
        // 助教签出弹窗 签到true，签出false
        signPost:(id,status)=>{
            state.signStatus=status
            state.signId=id
            state.signShow=true
        },
        signShow: false,
        signStatus: 1,// 1 教练签到 2 教练签出 3 助教签到 4 助教签出
        signStatusObj:{
            1:'教练签到',
            2:'教练签出',
            3:'助教签到',
            4:'助教签出',
        },
        signId:'',
        signData: {},
        signTitle: computed(() =>state.signStatusObj[state.signStatus]),
        signList: [
            {
                el:'textArea',
                label: '备注',
                code: 'remark',
            },
        ],
        signButtons:[
            {
                name: "取消",
                click:()=>{
                    state.signShow=false
                }
            },
            {
                funType: "confirm",
                type: "primary",
                name: "确定",
                click:({value})=>{
                    let sign=state.signStatus%2 //奇数签到 偶数签出
                    let par={...value,coursePlanId:state.id}
                    par.coachId=state.signId
                    if (sign) {
                        planStaffSignInPost(par).then(res => {
                            ElMessage.success('签到成功')
                        }).finally(()=>{
                            state.signShow=false
                            state.start()
                        })
                    }else{
                        planStaffSignOutPost(par).then(res => {
                            ElMessage.success('签出成功')
                        }).finally(()=>{
                            state.signShow=false
                            state.start()
                        })
                    }

                }
            },
        ],
        orderStatus:1,
        // 添加预约弹窗
        orderOut:(status)=>{
            state.orderStatus=status
            state.orderShow=true
        },
        orderTitle: computed(() => state.orderStatus==1?'添加预约':'添加排队'),
        orderShow: false,
        orderFormInitData: {},
        orderList: [
            {
                el:'select',
                label: '会员',
                code: "memberId",
                filterable: true,
                remote: true,
                remoteMethod: (keyword) => ({ keyword }),
                funMode:(res)=>res.data.records.map(v=>({value:v.id,label:v.name+'---'+ v.contact})),
                fun: memberOptions,
                tips: "输入搜索，下拉选中",
                // 下拉联动
                seriesCode: "memberCourseCardId", // 联动的下拉code
                seriesFun: (memberId) => ({
                    memberId,
                    coursePlanId:state.id
                }), //组装参数
            },
            {
                el:'select',
                code: "memberCourseCardId",
                label: "课程卡",
                filterable: true, // 可搜索
                fun: memberHallBoxList,
                firstRequest: false, //第一次不请求
            },
            {
                code:'quantity',
                label: computed(() => state.orderStatus==1?'预约人数':'排队人数'),
                type:'number'
            },
            {
                el:'textArea',
                label: '备注',
                code: 'remark',
            },
        ],
        orderButtons:[
            {
                name: "取消",
                click:()=>{
                    state.orderShow=false
                }
            },
            {
                funType: "confirm",
                type: "primary",
                name: "确定",
                click:({value})=>{
                    console.log(value)
                    let par={...value,coursePlanId:state.id,orderType:state.orderStatus,channel:10}
                    coursePlanOrderRegisterPost(par).then(res => {
                        console.log(res)
                        state.orderShow=false
                        state.start()
                    })
                    // state.orderShow=false
                }
            },
        ],
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
