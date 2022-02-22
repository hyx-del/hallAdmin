<!--
 * @Author: 刘帝君
 * @Date: 2022-01-13 14:15:04
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-17 11:16:41
 * @Descripttion: 操作
-->
<template>
    <div>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="title">请假记录</span>
                </div>
            </template>
            <div class="text item">
                <Table
                    ref="TableList"
                    :data="askLeaveDatas"
                    :column="askLeaveColumn"
                    :params="askLeaveData"
                    :showSortIndex="{ show: true, lable: '序号' }"
                >
                </Table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="title">转卡记录</span>
                </div>
            </template>
            <div class="text item">
                <Table
                    ref="TableList"
                    :data="turnCardDatas"
                    :column="turnCardColumn"
                    :params="turnCardData"
                    :showSortIndex="{ show: true, lable: '序号' }"
                >
                </Table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="title">余额调整记录</span>
                </div>
            </template>
            <div class="text item">
                <Table
                    ref="TableList"
                    :data="balanceDatas"
                    :column="balanceColumn"
                    :params="balanceData"
                    :showSortIndex="{ show: true, lable: '序号' }"
                >
                </Table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="title">有效期调整记录</span>
                </div>
            </template>
            <div class="text item">
                <Table
                    ref="TableList"
                    :data="periodValidityDatas"
                    :column="periodValidityColumn"
                    :params="periodValidityData"
                    :showSortIndex="{ show: true, lable: '序号' }"
                >
                </Table>
            </div>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="title">停卡记录</span>
                </div>
            </template>
            <div class="text item">
                <Table
                    ref="TableList"
                    :data="stopCardDatas"
                    :column="stopCardColumn"
                    :params="stopCardData"
                    :showSortIndex="{ show: true, lable: '序号' }"
                >
                </Table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { toRefs, ref, reactive, computed, onMounted } from "vue";
import Table from "@/components/Table/index";
import { hallUserOperationList, eliminateAPI } from "@/api/hall";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
export default {
    components: {
        Table,
    },
    setup() {
        const TableList = ref(null);
        const state = reactive({
            // 请假记录
            askLeaveData: {},
            askLeaveDatas: [],
            askLeaveColumn: [
                {
                    label: "开始时间",
                    prop: "startDate",
                },
                {
                    label: "结束时间",
                    prop: "endDate",
                },
                {
                    label: "天数", //1
                    prop: "lastUseTime",
                },
                {
                    label: "事由",
                    prop: "reason",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    label: "创建时间",
                    prop: "createdAt",
                },
                {
                    label: "修改时间",
                    prop: "updatedAt",
                },
                {
                    label: "操作人",
                    prop: "operatorName",
                },
                {
                    prop: "action",
                    label: "操作",
                    actives: [
                        {
                            // name: "销假",
                            name: (e) => (e.status !== 20 ? "销假" : ""),
                            method: (val) => {
                                eliminateAPI({
                                    id: val.id,
                                }).then((res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update();
                                    }
                                });
                            },
                        },
                    ],
                },
            ],
            // 转卡记录
            turnCardData: {},
            turnCardDatas: [],
            turnCardColumn: [
                {
                    label: "类型",
                    prop: "toCourseCardType",
                    html: (row, val) => {
                        if (val == "1") return "次卡";
                        else if (val == "2") return "期限卡";
                    },
                },
                {
                    label: "课程卡名称",
                    prop: "courseCardName",
                },
                {
                    label: "场馆",
                    prop: "hallName",
                },
                {
                    label: "会员",
                    prop: "memberName",
                },
                {
                    label: "费率",
                    prop: "rate",
                },
                {
                    label: "手续费",
                    prop: "commission",
                },
                {
                    label: "时间",
                    prop: "createdAt",
                },
                {
                    label: "状态",
                    prop: "status",
                    html: (row, val) => {
                        if (val == "0") return "待审核";
                        else if (val == "1") return "未付款";
                        else if (val == "-1") return "未通过审核";
                        else if (val == "2") return "已付款";
                    },
                },
                {
                    label: "操作人",
                    prop: "operatorName",
                },
            ],
            // 余额调整记录
            balanceData: {},
            balanceDatas: [],
            balanceColumn: [
                {
                    label: "调整次数/天数",
                    prop: "amount",
                },
                {
                    label: "金额",
                    prop: "payMoney",
                },
                {
                    label: "调整时间",
                    prop: "updatedAt",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    label: "操作人",
                    prop: "operatorName",
                },
            ],
            // 有效期调整记录
            periodValidityData: {},
            periodValidityDatas: [],
            periodValidityColumn: [
                {
                    label: "调整前",
                    prop: "startDateBefore",
                },
                {
                    label: "调整后",
                    prop: "startDateAfter",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    label: "操作人",
                    prop: "operatorName",
                },
                {
                    label: "操作时间",
                    prop: "updatedAt",
                },
            ],
            // 停卡记录
            stopCardData: {},
            stopCardDatas: [],
            stopCardColumn: [
                {
                    label: "调整时间",
                    prop: "updatedAt",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    label: "操作类型",
                    prop: "type",
                    html: (row, val) => {
                        if (val == "-10") return "停卡";
                        else if (val == "10") return "恢复";
                    },
                },
                {
                    label: "操作人",
                    prop: "operatorName",
                },
            ],
        });

        onMounted(() => {
            hallUserOperationList({
                id: useRoute().query.id,
            }).then((res) => {
                console.log(res, "操作详情");
                state.askLeaveDatas = res.data.leave; //请假记录
                state.turnCardDatas = res.data.transform; //转卡记录
                state.balanceDatas = res.data.balance; //余额调整记录
                state.periodValidityDatas = res.data.validate; //有效期调整记录
                state.stopCardDatas = res.data.stopped; //停卡记录
            });
        });

        return {
            ...toRefs(state),
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.title {
    font-weight: bold;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}
.box-card {
    margin-top: 10px;
}
</style>
