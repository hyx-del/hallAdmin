<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-14 16:45:12
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-28 17:38:44
 * @Descripttion: 会员课程操作
-->
<template>
    <div v-if="columnData" class="bodyBox">
        <el-card class="box-card" v-for="item in columnData" :key="item.id">
            <div class="flex justify_between">
                <div class="fontWB">{{ item.title }}</div>
                <div v-if="item.buttonShow && butShow == '1'">
                    <el-button
                        type="primary"
                        size="small"
                        @click="item.method"
                        :disabled="item.disabled"
                        >{{ item.buttonText }}</el-button
                    >
                </div>
            </div>
            <Table
                ref="TableList"
                :data="item.getList"
                :column="item.column"
                :hidden="false"
                :head-hight="300"
                :showSortIndex="{ show: true, lable: '序号' }"
            >
            </Table>
        </el-card>

        <!--请假-->
        <popupForm
            v-model:show="formShow"
            v-model:formInitData="topUpData"
            :title="formTitle"
            :itemList="leaveFormList"
            :buttons="topUpButtons"
        />
        <!--剩余价值调整-->
        <popupForm
            v-model:show="remainingShow"
            v-model:formInitData="remainingData"
            :title="formTitle"
            :itemList="remainingList"
            :buttons="remainingButtons"
        />
        <!--有效期调整-->
        <popupForm
            v-model:show="validityShow"
            v-model:formInitData="topUpData"
            :title="formTitle"
            :itemList="validityList"
            :buttons="validityButtons"
        />
    </div>
</template>

<script>
import popupForm from "@/components/FormList/popupForm";
import Table from "@/components/Table/index";
import { reactive, ref, toRefs, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

import { hallUserOperationList } from "@/api/hall";
import {
    addResidualValueAdjustmentRecord,
    cancellationResidualValue,
    cardTransferCancellation,
    courseCardCancelRefund,
    memberCourseCardLeave,
    memberCourseCardLeaveOff, memberCourseCardsDetail,
    ValidityPeriodAdjustment
} from "@/api/membershipCourseCard";

// template
export default {
    components: {
        Table,
        popupForm,
    },

    setup() {
        const { id, courseCardId, coursePlanId, butShow, status } =
            useRoute().query;
        let getData = {};
        const getDetails=(val)=> {
            memberCourseCardsDetail({ id: id }).then(res=>{
                if(!val){
                    state.remainingData={originalSurplusValue:res.data.surplusValue}
                    state.remainingShow = true;
                    state.formTitle = "剩余价值调整";
                }
                if(val==="date"&&res.data.startDate){
                    state.topUpData= { startDate:res.data.startDate.split(" ")[0] + " ~ " + res.data.endDate.split(" ")[0],balance:''+res.data.balance}

                }
            })
        }
        onMounted( () => {
            getDateList();
        });

        const getDateList = () => {
            hallUserOperationList({ id: id }).then((res) => {
                nextTick(() => {
                    getData = res.data;
                    state.columnData[0].getList = getData.leave;
                    state.columnData[1].getList = getData.transform;
                    state.columnData[2].getList = getData.balance;
                    state.columnData[3].getList = getData.surplusValue;
                    state.columnData[4].getList = getData.validate;
                    state.columnData[5].getList = getData.stopped;
                    getData.refund.forEach(item=>{
                        item.commission=`${item.commission}`
                        item.rate=`${item.rate}`
                    })
                    state.columnData[6].getList = getData.refund;
                    console.log(state.columnData[6].getList);
                });
            });
        };
        const remainingButtons = [
            {
                funType: "confirm",
                type: "primary",
                name: "确认",
                click: ({ value }) => {
                    value.memberCourseCardId = id;
                    addResidualValueAdjustmentRecord({ ...value }).then(() => {
                        ElMessage.success("操作成功");
                        getDateList();
                        state.remainingShow = false;
                    });
                    console.log(value);
                },
            },
        ];
        const validityButtons = [
            {
                funType: "confirm",
                type: "primary",
                name: "确认",
                click: ({ value }) => {
                    ValidityPeriodAdjustment({
                        ...value,
                        startDateAfter:
                            value.validityDate[0] + " " + "00:00:00",
                        endDateAfter: value.validityDate[1] + " " + "00:00:00",
                        memberCourseCardId: id,
                    }).then(() => {
                        ElMessage.success("操作成功");
                        getDateList();
                        state.validityShow = false;
                    });
                },
            },
        ];
        const topUpButtons = [
            {
                funType: "confirm",
                type: "primary",
                name: "确认",
                click: ({ value }) => {
                    console.log(value);
                    let obj = {
                        memberCourseCardId: id,
                        ...value,
                        startDate: value.leaveDate[0],
                        endDate: value.leaveDate[1],
                    };
                    memberCourseCardLeave(obj).then(() => {
                        ElMessage.success("请假成功");
                        getDateList();
                        state.formShow = false;
                    });
                },
            },
        ];
        /*调整弹框list*/
        const leaveFormList = [
            {
                label: "请假事由",
                code: "reason",
                required: true,
            },
            {
                label: "请假天数",
                code: "leaveNum",
                required: true,
                disabled: true,
            },
            {
                label: "时间",
                el: "datePicker",
                type: "daterange",
                isRange: true,
                backType: "Array",
                code: "leaveDate",
                valueChange: (val, obj) => {
                    obj.leaveNum = Math.ceil(
                        Math.abs(
                            new Date(val[0]).getTime() -
                                new Date(val[1]).getTime()
                        ) / 86400000
                    );
                    return {
                        formObj: { leaveNum: obj.leaveNum+1 },
                    };
                },
                valueFormat: "YYYY-MM-DD",
                valueStyle: {
                    width: "360px",
                },
            },
        ];
        /*剩余价值调整*/
        const remainingList = [
            {
                type: "Number",
                label: "当前剩余价值",
                code: "originalSurplusValue",
                required: false,
                disabled: true,
            },
            {
                type: "Number",
                label: "调整后剩余价值",
                code: "adjustSurplusValue",
                required: true,
                checkType: "numberPoint2",
                maxlength: 6,
            },
            {
                label: "调整原因",
                type: "textarea",
                code: "remark",
                required: false,
                maxlength: 500,
            },
        ];
        /*有效期调整*/
        const validityList = [
            {
                label: "原有效期实际",
                code: "startDate",
                required: false,
                disabled: true,
            },
            {
                label: "原有效天数",
                code: "balance",
                required: false,
                disabled: true,
            },

            {
                required: true,
                label: "修改有效时间",
                el: "datePicker",
                type: "daterange",
                isRange: true,
                backType: "Array",
                code: "validityDate",
                // valueChange: (val, obj) => {
                //     obj.leaveNum = Math.ceil(Math.abs(new Date(val[0]).getTime() - new Date(val[1]).getTime()) / 86400000);
                //     return {
                //         formObj: { leaveNum: obj.leaveNum }
                //     };
                // },
                valueFormat: "YYYY-MM-DD",
                valueStyle: {
                    width: "360px",
                },
            },
            {
                label: "调整原因",
                type: "textarea",
                code: "remark",
                maxlength: 500,
                required: false,
            },
        ];
        /*请假记录*/
        const leaveColumn = [
            { prop: "startDate", label: "开始时间" ,html:(val)=>val.startDate.split(" ")[0]},
            { prop: "endDate", label: "结束时间",html:(val)=>val.endDate.split(" ")[0] },
            { prop: "postponed", label: "天数" ,html:(val)=>Math.ceil(
                    Math.abs(
                        new Date(val.startDate).getTime() -
                        new Date(val.endDate).getTime()
                    ) / 86400000
                )},
            { prop: "reason", label: "事由" },
            { prop: "remark", label: "备注" },
            { prop: "createdAt", label: "创建时间" },
            { prop: "updatedAt", label: "修改时间" },
            { prop: "operatorName", label: "操作人" },
            {
                prop: "status",
                label: "状态",
                html: (val) => {
                    let htmlStr = "";
                    switch (true) {
                        case val.status == 10:
                            htmlStr = `<span>正常</span>`;
                            break;
                        case val.status == 20:
                            htmlStr = `<span>已销假</span>`;
                            break;
                        case val.status == 11:
                            htmlStr = `<span>已结束</span>`;
                            break;
                        default:
                            break;
                    }
                    return htmlStr;
                },
            },
            {
                prop: "action",
                label: "操作",
                fixed: "right",
                width: 80,
                actives:
                    butShow == "1"
                        ? [
                              {
                                  // 权限
                                  // perCode:'',
                                  name: (val) =>
                                      val.status == 10 ? "销假" : "",
                                  method: (val) => {
                                      ElMessageBox.confirm(
                                          `确认销假这条数据?`,
                                          "确认提示",
                                          {
                                              confirmButtonText: "确定",
                                              cancelButtonText: "取消",
                                              type: "warning",
                                          }
                                      )
                                          .then(() => {
                                              memberCourseCardLeaveOff({
                                                  id: val.id,
                                              }).then((res) => {
                                                  if (res.code == 200) {
                                                      ElMessage({
                                                          type: "success",
                                                          message: `操作成功`,
                                                      });
                                                      getDateList();
                                                      state.formShow = false;
                                                  } else {
                                                      ElMessage({
                                                          type: "error",
                                                          message: `操作失败`,
                                                      });
                                                  }
                                              });
                                          })
                                          .catch((error) => {
                                              console.log(error);
                                          });
                                  },
                              },
                          ]
                        : [],
            },
        ];
        /*转卡记录*/
        const transferCardColumn = [
            {
                prop: "courseCardType",
                label: "类型",
                html: (val) => (val.type === 1 ? "转出" : "转入"),
            },
            { prop: "courseCardName", label: "课程卡名" },
            { prop: "hallName", label: "场馆" },
            { prop: "memberName", label: "会员" },
            { prop: "oldBalance", label: "剩余价值" },
            { prop: "newBalance", label: "转卡后价值", width: 120 },
            { prop: "payMoney", label: "转卡补差" },
            { prop: "rate", label: "费率" },
            { prop: "commission", label: "手续费" },
            { prop: "adjustCompensation", label: "调整转卡补差", width: 120 },
            { prop: "createdAt", label: "创建时间" },
            {
                prop: "status",
                label: "状态",
                html: (val) => {
                    let htmlStr = "";
                    // 0:待审核 1:未付款（通过审核）-1:未通过审核 2:已付款(通过审核)
                    switch (true) {
                        case val.status == 0:
                            htmlStr = `<span>待审核</span>`;
                            break;
                        case val.status == 1:
                            htmlStr = `<span>未付款</span>`;
                            break;
                        case val.status == -1:
                            htmlStr = `<span>未通过审核</span>`;
                            break;
                        case val.status == 2:
                            htmlStr = `<span>已付款</span>`;
                            break;
                        case val.status == -2:
                            htmlStr = `<span>已取消</span>`;
                            break;
                        default:
                            break;
                    }
                    return htmlStr;
                },
            },
            { prop: "operatorName", label: "操作人" },
            {
                prop: "action",
                label: "操作",
                fixed: "right",
                width: 120,
                actives:
                    butShow == "1"
                        ? [
                              {
                                  // 权限
                                  // perCode:'',
                                  name: "详情",
                                  method: (val) => {
                                      router.push({
                                          path: "/membershipCourseCardm/transferCard",
                                          query: {
                                              id: id,
                                              addType: 0,
                                              courseCardId: courseCardId,
                                              coursePlanId: coursePlanId,
                                              detailId: val.id,
                                          },
                                      });
                                  },
                              },
                              {
                                  // 权限
                                  // perCode:'',
                                  name: (val) =>
                                      val.status == 1 || val.status == 0
                                          ? "取消"
                                          : "",

                                  method: (val) => {
                                      ElMessageBox.confirm(
                                          "确认取消转卡吗?",
                                          "确认提示",
                                          {
                                              confirmButtonText: "确定",
                                              cancelButtonText: "取消",
                                              type: "warning",
                                          }
                                      )
                                          .then(() => {
                                              cardTransferCancellation({
                                                  id: val.id,
                                                  status: -2,
                                              }).then(() => {
                                                  ElMessage.success("取消成功");
                                                  getDateList();
                                              });
                                          })
                                          .catch(() => {});
                                  },
                              },
                          ]
                        : [],
            },
        ];
        /*余额调整*/
        const balanceColumn = [
            { prop: "amount", label: "调整次数/天数" },
            { prop: "payMoney", label: "金额" },
            { prop: "updatedAt", label: "调整时间" },
            { prop: "remark", label: "备注" },
            { prop: "operatorName", label: "操作人" },
            {
                prop: "action",
                label: "操作",
                fixed: "right",
                width: 80,
                actives:
                    butShow == "1"
                        ? [
                              {
                                  // 权限
                                  // perCode:'',
                                  name: "详情",
                                  method: (val) => {
                                      router.push({
                                          path: "/membershipCourseCardm/balanceAdjustment",
                                          query: {
                                              balanceId: val.id,
                                              id: id,
                                              type: "basicInfo",
                                              dialog: false,
                                          },
                                      });
                                  },
                              },
                          ]
                        : [],
            },
        ];
        /*剩余价值调整记录*/
        const remainingColumn = [
            { prop: "originalSurplusValue", label: "调整前" },
            { prop: "adjustSurplusValue", label: "调整后" },
            { prop: "remark", label: "调整原因" },
            {
                prop: "status",
                label: "状态",
                html: (val) => {
                    let htmlStr = "";
                    // 0待审核，1审核通过，-1已取消，-2已驳回
                    switch (true) {
                        case val.status == 0:
                            htmlStr = `<span>待审核</span>`;
                            break;
                        case val.status == 1:
                            htmlStr = `<span>审核通过</span>`;
                            break;
                        case val.status == -1:
                            htmlStr = `<span>已取消</span>`;
                            break;
                        case val.status == -2:
                            htmlStr = `<span>已驳回</span>`;
                            break;
                        default:
                            break;
                    }
                    return htmlStr;
                },
            },
            { prop: "operatorName", label: "操作人" },
            {
                prop: "action",
                label: "操作",
                fixed: "right",
                width: 80,
                actives:
                    butShow == "1"
                        ? [
                              {
                                  // 权限
                                  // perCode:'',
                                  name:(val)=>val.status===0?"取消":"",
                                  method: (val) => {
                                      ElMessageBox.confirm(
                                          "确认取消调整吗?",
                                          "确认提示",
                                          {
                                              confirmButtonText: "确定",
                                              cancelButtonText: "取消",
                                              type: "warning",
                                          }
                                      )
                                          .then(() => {
                                              cancellationResidualValue({
                                                  id: val.id,
                                                  status: -1,
                                              }).then(() => {
                                                  ElMessage.success("取消成功");
                                                  getDateList();
                                              });
                                          })
                                          .catch(() => {});
                                  },
                              },
                          ]
                        : [],
            },
        ];
        /*有效期调整记录*/
        const validityColumn = [
            {
                prop: "before",
                label: "调整前",
                html: (val) =>
                    val.startDateBefore
                        ? (val.before =val.startDateBefore.split(" ")[0]
                               + " ~ " + val.endDateBefore.split(" ")[0])
                        : "-",
            },
            {
                prop: "after",
                label: "调整后",
                html: (val) =>
                    (val.startDateAfter?val.after = val.startDateAfter.split(" ")[0] + " ~ " + val.endDateAfter.split(" ")[0]:'-'),
            },
            { prop: "remark", label: "备注" },
            { prop: "operatorName", label: "操作人" },
            { prop: "updatedAt", label: "操作时间" },
        ];
        /*停卡记录*/
        const stopCardColumn = [
            { prop: "createdAt", label: "时间" },
            { prop: "remark", label: "备注" },
            { prop: "type", label: "操作类型",html:(val)=>val.type===-10?"停卡":val.type===10?"退卡":"-" },
            { prop: "operatorName", label: "操作人" },
        ];
        /*退卡记录*/
        const checkOutColumn = [
            { prop: "courseCardName", label: "课程卡名称" },
            { prop: "hallName", label: "场馆" },
            { prop: "memberName", label: "会员" },
            { prop: "rate", label: "费率" },
            { prop: "commission", label: "手续费" },
            { prop: "date", label: "时间" },
            {
                prop: "status",
                label: "状态",
                html: (val) => {
                    let htmlStr = "";
                    switch (true) {
                        case val.status == 0:
                            htmlStr = `<span>待审核</span>`;
                            break;
                        case val.status == 10:
                            htmlStr = `<span>待支付</span>`;
                            break;
                        case val.status == -10:
                            htmlStr = `<span>未通过审核</span>`;
                            break;
                        case val.status == 20:
                            htmlStr = `<span>已完成 </span>`;
                            break;
                        case val.status == -20:
                            htmlStr = `<span>已取消</span>`;
                            break;
                        default:
                            break;
                    }
                    return htmlStr;
                },
            },
            { prop: "operatorName", label: "操作人" },
            {
                prop: "action",
                label: "操作",
                fixed: "right",
                width: 120,
                actives:
                    butShow == "1"
                        ? [
                              {
                                  // 权限
                                  // perCode:'',
                                  name: "详情",
                                  method: (val) => {
                                      router.push({
                                          path: "/membershipCourseCardm/checkCard",
                                          query: {
                                              id: id,
                                              type: "basicInfo",
                                              dialog: false,
                                              detailsId: val.id,
                                          },
                                      });
                                  },
                              },
                              {
                                  // 权限
                                  // perCode:'',
                                  name: (val)=>(val.status===0||val.status===10)?"取消":'',
                                  method: (val) => {
                                      ElMessageBox.confirm(
                                          `确认取消课程卡名为：${val.courseCardName} 的这条数据?`,
                                          "确认提示",
                                          {
                                              confirmButtonText: "确定",
                                              cancelButtonText: "取消",
                                              type: "warning",
                                          }
                                      ).then(() => {
                                          courseCardCancelRefund({
                                              id: val.id,
                                              status: -20,
                                          }).then(() => {
                                              ElMessage.success("取消成功");
                                              getDateList();
                                          });
                                      });
                                  },
                              },
                          ]
                        : [],
            },
        ];
        let topUpList = [];

        // table表单
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            remainingData: {},
            /*控制弹出框显示类容*/
            validityShow: false,
            remainingShow: false,
            formShow: false,
            formTitle: "",
            topUpData: {},
            /*页面循环展示*/
            columnData: [
                {
                    id: 1,
                    column: leaveColumn,
                    getList: [],
                    title: "请假记录",
                    buttonShow: true,
                    buttonText: "请假",
                    method: () => {
                        state.formShow = true;
                        state.formTitle = "请假";
                    },
                },
                {
                    id: 2,
                    column: transferCardColumn,
                    getList: [],
                    title: "转卡记录",
                    buttonShow: true,
                    buttonText: "转卡",
                    method: () => {
                        router.push({
                            path: "/membershipCourseCardm/transferCard",
                            query: {
                                id: id,
                                addType: 1,
                                courseCardId: courseCardId,
                                coursePlanId: coursePlanId,
                            },
                        });
                    },
                },
                {
                    id: 3,
                    column: balanceColumn,
                    getList: [],
                    title: "余额调整记录",
                    buttonShow: true,
                    buttonText: "调整",
                    method: () => {
                        router.push({
                            path: "/membershipCourseCardm/balanceAdjustment",
                            query: { id: id, type: "basicInfo", dialog: true },
                        });
                    },
                },
                {
                    id: 4,
                    column: remainingColumn,
                    getList: [],
                    title: "剩余价值调整记录",
                    buttonShow: true,
                    buttonText: "调整",
                    method:  () => {
                         getDetails()

                    },
                },
                {
                    id: 5,
                    column: validityColumn,
                    getList: [],
                    title: "有效期调整记录",
                    buttonShow: true,
                    buttonText: "调整",
                    method: () => {
                        state.validityShow = true;
                        state.formTitle = "有效期调整";
                        getDetails("date")
                    },
                },
                {
                    id: 6,
                    column: stopCardColumn,
                    getList: [],
                    title: "停卡记录",
                    buttonShow: false,
                    buttonText: "",
                    method: () => {},
                },
                {
                    id: 7,
                    column: checkOutColumn,
                    getList: [],
                    title: "退卡记录",
                    buttonShow: true,
                    buttonText: "退卡",
                    disabled: status != "10",
                    method: () => {
                        // checkCard
                        router.push({
                            path: "/membershipCourseCardm/checkCard",
                            query: { id: id, type: "basicInfo", dialog: true },
                        });
                    },
                },
            ],
            columnDataList: [],
        });

        return {
            ...toRefs(state),
            TableList,
            topUpList,
            topUpButtons,
            leaveFormList,
            remainingList,
            validityList,
            remainingButtons,
            validityButtons,
            getData,
            butShow,
            status,
        };
    },
};
</script>

<style lang="scss" scoped>
.box-card {
    margin-bottom: 20px;
}
.divBox {
    padding: 10px;
}
.flex {
    display: flex;
}

.justify_between {
    justify-content: space-between;
    align-items: center;
}

.fontWB {
    font-weight: bold;
}

.border_bottom {
    border-bottom: 1px solid #d2cccc;
}

.m-t-20 {
    margin-top: 20px;
}
</style>
