<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-14 16:45:12
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-14 16:45:12
 * @Descripttion:
-->
<template>
    <div class="studentDetails">
        <h2>会员课程详情</h2>
        <div class="info">
            <el-row style="height: 100%">
                <el-col :span="3" class="border-right">
                    <div class="infoLeft">
                        <div>
                            <img :src="detailData.avatar" alt=""/>
                        </div>
                        <div>姓名：{{ vipName }}</div>
                        <div>电话：{{ detailData.mobile }}</div>

                    </div>
                </el-col>
                <el-col :span="21">
                    <div class="infoRight">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="basicInfo">
                                <emptyBox :bottom="70">
                                    <div v-if="activeName=='basicInfo'">
                                        <!-- 基础信息-->
                                        <formList
                                            ref="formListRef"
                                            :formInitData="detailData"
                                            :itemList="itemList"
                                            :buttons="buttons"
                                            :config="config"
                                            class="border_bottom"
                                            @formChange="formChange"
                                            :form-state="itemListSHow"
                                        >
                                        </formList>
                                        <!-- 多会员关联-->
                                        <div class="info border_bottom ">
                                            <div class="fontWeightBold">多会员关联</div>
                                            <div class="m-t-20" v-if="butShow=='1'">
                                                <el-button type="primary" size="small" @click="addMemberShow=true">
                                                    添加会员绑定
                                                </el-button>
                                            </div>
                                            <div class="m-t-20" style="color:#333333;">
                                                可绑定人数{{ people }}人，已绑定{{ alreadyPeople }}人，还可绑定{{ remainingPeople }}人
                                            </div>
                                            <div class="m-b-20">
                                                <Table
                                                    v-if="detailData.memberCourseCardRelationVOList"
                                                    ref="TableList"
                                                    :data="detailData.memberCourseCardRelationVOList"
                                                    :column="column"
                                                    :hidden="false"
                                                    :head-hight="300"
                                                    :showSortIndex="{ show: true, lable: '序号' }"
                                                />
                                            </div>
                                        </div>
                                        <!--                                -->
                                        <div class="info">
                                            <div class="fontWeightBold">联卡设置</div>

                                            <div class="m-t-20" style="color:#333333;" v-if="couponName">名称: {{couponName||"无"}}</div>
                                            <div>
                                                <Table
                                                    ref="UnionCardTableList"
                                                    :data="UnionCardData"
                                                    :column="UnionCardColumn"
                                                    :hidden="false"
                                                    :head-hight="300"
                                                    :showSortIndex="{ show: true, lable: '序号' }"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </emptyBox>
                            </el-tab-pane>
                            <el-tab-pane label="操作" name="action">
                                <emptyBox :bottom="70">
                                    <Action v-if="activeName=='action'"/>
                                </emptyBox>
                            </el-tab-pane>
                            <el-tab-pane label="使用记录" name="usageRecord">
                                <emptyBox :bottom="70">
                                    <usageRecord v-if="activeName=='usageRecord'"/>
                                </emptyBox>
                            </el-tab-pane>

                            <el-tab-pane label="转会记录" name="transferHistory">
                                <emptyBox class="heightBlod" :bottom="70">
                                    <transferHistory v-if="activeName=='transferHistory'"/>
                                </emptyBox>
                            </el-tab-pane>
                            <!-- -->
                            <!--                            <el-tab-pane label="单价调整记录" name="priceHistory">-->
                            <!--                                <emptyBox :bottom="60">-->
                            <!--                                    <priceAdjustment />-->
                            <!--                                </emptyBox>-->
                            <!--                            </el-tab-pane>-->

                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 修改销售 -->
        <popupForm
            v-model:show="topUpModal"
            v-model:formInitData="topUpData"
            title="修改销售"
            :itemList="topUpList"
            :buttons="topUpButtons"
        />
        <!--添加会员绑定-->
        <el-dialog v-model="addMemberShow" title="添加会员绑定" :close-on-click-modal="false">
            <memberList v-if="addMemberShow" @onSubmits="getDetail"/>
        </el-dialog>
        <!--次数分配 -->
        <popupForm
            v-model:show="frequencyModal"
            v-model:formInitData="frequencyData"
            title="次数分配"
            :itemList="frequencyList"
            :buttons="frequencyButtons"
        />
        <!--联卡详情-->
        <el-dialog v-model="unionCardShow" title="兑换码详情" :close-on-click-modal="false">
            <exchangeCardList v-if="unionCardShow" :id="unionCardId"/>
        </el-dialog>
    </div>
</template>

<script>
import popupForm from "@/components/FormList/popupForm.vue";
import popup from "@/components/popup/index";
import Table from "@/components/Table/index";
import { nextTick, onMounted, reactive, ref, toRefs, watchEffect } from "vue";
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";
import {
    couplingSettingsList,
    memberChangeSale,
    memberCourseCardsDetail, previewContract,
    setAsPrimaryCardholder, unbindCardholder,
    updateFrequencyAllocation
} from "@/api/membershipCourseCard";
import { useRoute } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { salesList } from "@/api/common";
import { ElMessage, ElMessageBox } from "element-plus";

import Action from "@/views/store/membershipCourseCard/action";
import usageRecord from "@/views/store/membershipCourseCard/usageRecord";
import transferHistory from "@/views/store/membershipCourseCard/transferHistory";
import priceAdjustment from "@/views/store/membershipCourseCard/priceAdjustment";
import memberList from "@/views/store/membershipCourseCard/memberList";
import { hallUserOperationList } from "@/api/hall";
import exchangeCardList from "@/views/store/membershipCourseCard/exchangeCardList";
import { MemberCouponDetail } from "@/api/member";
import { appendixesUpdate } from "@/api/city";

export default {
    components: {
        emptyBox,
        formList,
        popupForm,
        Table, popup,
        Action, usageRecord, transferHistory, priceAdjustment, memberList, exchangeCardList
    },
    setup() {
        let showCard=true
        const actionData = hallUserOperationList;
        const formListRef = ref("");
        const { id, mobile, vipName, butShow } = useRoute().query;
        let frequencyId = "";
        let AppendixBut=false //附件按钮
        const state = reactive({
            couponName:"",
            itemListSHow:[],
            /*联卡弹窗*/
            unionCardShow: false,
            unionCardId: "",
            /*联卡list*/
            UnionCardData: [],
            /*可绑定人数*/
            people: 0,
            /*已绑定人数*/
            alreadyPeople: 0,
            /*剩余绑定人数*/
            remainingPeople: 0,
            /*次数分配弹框*/
            frequencyModal: false,
            frequencyData: {},
            frequencyList: [
                {
                    label: "次数",
                    rules: "number",
                    code: "allocationsTimes",
                    type: "number",
                    maxlength: 6,
                    checkType: "number"
                }
            ],
            frequencyButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        value = { ...value, id: frequencyId };
                        updateFrequencyAllocation({ ...value }).then(() => {
                            ElMessage.success("分配成功");
                            state.frequencyModal = false;
                            state.getDetail();
                        });
                    }
                }
            ],
            /*添加会员*/
            addMemberShow: false,

            /*联卡设置*/
            UnionCardColumn: [
                { prop: "batchNumber", label: "批号" },
                { prop: "amount", label: "数量" },
                { prop: "notes", label: "备注" },
                { prop: "createdAt", label: "创建时间" },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 80,
                    actives: butShow == "1" ? [
                        {

                            name: "详情",
                            method: (val) => {
                                state.unionCardId = val.id;
                                state.unionCardShow = true;
                            }
                        }
                    ] : []

                }
            ],
            /*多会员关联表*/
            column: [
                { prop: "memberName", label: "会员" },
                { prop: "phone", label: "手机号" },
                { prop: "createdAt", label: "绑定时间" },
                { prop: "deletedAt", label: "解绑时间" },
                {
                    prop: "bind",
                    label: "绑定状态",
                    html: (val) =>
                        val.bind ? "已绑定" : "未绑定"
                },
                { prop: "usedTimes", label: "累计扣次数" },
                { prop: "allocationsTimes", label: "分配次数" },
                { prop: "availableTimes", label: "剩余可用次数" },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 250,
                    actives: butShow == "1" ? [
                        {
                            name: (val) => val.bind && (val.main ? "" : "解绑") || "",
                            method: (val) => {
                                ElMessageBox.confirm(
                                    `确定将会员${val.memberName}解除绑定吗?`,
                                    "确认提示",
                                    {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning"
                                    }).then(() => {
                                    unbindCardholder({ id: val.id }).then(() => {
                                        ElMessage.success("解除成功");
                                        state.getDetail();
                                    });
                                });
                            }
                        },
                        {
                            name: (val) => val.bind && (val.main ? "" : "设为主卡人") || "",
                            method: (val) => {
                                ElMessageBox.confirm(
                                    `确定将会员${val.memberName}设为主卡人吗?`,
                                    "确认提示",
                                    {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning"
                                    }).then(() => {
                                    let data = {
                                        memberCourseCardId: val.memberCourseCardId,
                                        memberId: val.memberId,
                                        id: val.id
                                    };
                                    setAsPrimaryCardholder({ ...data }).then(() => {
                                        ElMessage.success("设置成功");
                                        state.getDetail();
                                    });
                                });

                            }
                        },
                        {
                            show: true,
                            name: (val) => val.bind ? "次数分配" : "",
                            method: (val) => {
                                state.frequencyModal = true;
                                frequencyId = val.id;
                            }
                        }
                    ] : []
                }
            ],
            /*修改销售*/
            topUpModal: false,
            topUpData: {},
            topUpList: [
                {
                    el: "select",
                    label: "销售",
                    code: "salesId",
                    fun: salesList,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id + ""
                        }))
                }
            ],
            topUpButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        console.log(value);
                        state.topUpModal = false;
                        memberChangeSale({
                            saleManId: value.salesId,
                            memberCourseCardIds: [ id ]
                        }).then(() => {
                            ElMessage.success("修改成功");
                            state.getDetail();
                        });
                    }
                }
            ],
            /*表单配置*/
            config: {
                ...addFormBottom,
                button: {
                    style: {
                        position: "absolute",
                        bottom: "20px",
                        marginBottom: "0",
                        left: "24px"
                    }
                }
            },
            count: 0,
            activeName: "",
            detailData: {
                contractTypeName:"无",
                contractId:"无"
            },
            buttons: [],
            /*次数分配 */
            itemList: [
                {
                    label: "卡名",
                    code: "courseCardName",
                    default: "",
                    disabled: true
                },
                {
                    label: "卡号",
                    code: "cardNo",
                    disabled: true
                },
                {
                    el: "select",
                    label: "类型",
                    code: "type",
                    placeholder: "请输入类型",
                    list: [
                        { value: 1, label: "次卡" },
                        { value: 2, label: "期限卡" }
                    ],
                    disabled: true
                },
                {
                    el: "select",
                    label: "通用类型",
                    code: "generalType",
                    list: [
                        { value: 1, label: "全国通" },
                        { value: 2, label: "城市通" },
                        { value: 3, label: "单店" },
                        { value: 4, label: "通店" }
                    ],
                    disabled: true

                },
                {
                    label: "销售会籍",
                    code: "salesmanName",
                    disabled: true,
                    inSlot: {
                        el: "button",
                        text: "修改销售",
                        size: "small",
                        type: "primary",
                        class: "slotRight",
                        disabled: butShow != "1",
                        // 可以添加样式和class名
                        click: (val, obj) => {
                            state.topUpData = {
                                salesId: obj.salesmanId + "",
                                salesIdLabel: obj.salesmanName
                            };
                            state.topUpModal = true;
                        }
                    }
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: [
                        { value: 10, label: "正常" },
                        { value: -10, label: "停卡" },
                        { value: -20, label: "关卡" },
                        { value: -30, label: "转卡" },
                        { value: 30, label: "请假" }
                    ],
                    disabled: true
                },
                {
                    label: "余额",
                    code: "balance",
                    disabled: true
                },
                {
                    label: "原价",
                    code: "price",
                    disabled: true
                },
                {
                    label: "单价",
                    code: "unitPrice",
                    disabled: true
                },
                {
                    label: "剩余价值",
                    code: "surplusValue",
                    disabled: true
                },
                {
                    label: "有效期",
                    code: "Date",
                    disabled: true
                },
                {
                    label: "咨询方式",
                    code: "consultMode",
                    disabled: true
                },
                {
                    label: "赠品",
                    code: "gift",
                    disabled: true
                },
                {
                    label: "开卡人",
                    code: "cardIssuerName",
                    disabled: true,
                    show:true
                },
                {
                    label: "备注",
                    code: "remark",
                    disabled: true
                },
                {
                    el: "img",
                    code: "avatar",
                    label: "附件",
                    size: 1024,
                    limit: 5,
                    required: false,
                    disabled: false,
                    show:true,
                    inSlot: {
                        el: "button",
                        text: "附件上传",
                        size: "small",
                        type: "primary",
                        class: "slotRight",
                        disabled: butShow != "1",
                        // 可以添加样式和class名
                        click: (val) => {
                            console.log(val);
                            if(state.detailData.contractId!='无'){
                                appendixesUpdate({transactionId:state.detailData.transactionId,appendixes:JSON.stringify(val)}).then(res=>{
                                    ElMessage.success("更新成功")
                                    state.getDetail()
                                })
                            }else {
                                ElMessage.warning("暂无开卡信息")
                            }
                        }
                    }
                },
                {
                    show:true,
                    label: "合同",
                    code: "contractTypeName",
                    disabled: true,

                },
                {
                    show:true,
                    label: "合同ID",
                    code: "contractId",
                    disabled: true,
                    inSlot: {
                        el: "button",
                        text: "预览合同",
                        size: "small",
                        type: "primary",
                        class: "slotRight",
                        disabled: butShow != "1",
                        // 可以添加样式和class名
                        click: (val) => {
                            if(val&&val!="无"){
                                previewContract({ contractId: val }).then(res => {
                                    const link = document.createElement("a"); //创建下载a标签
                                    link.target = "view_window"; //新窗口打开
                                    link.href = res.data.viewUrl;
                                    document.body.appendChild(link); // body中添加元素
                                    link.click(); // 执行点击事件
                                });
                            }

                            // contractUrl
                        }
                    }
                }


            ],
            /*获取初始数据*/

            getDetail: () => {
                state.addMemberShow = false;
                // type ? state.activeName = type : state.activeName = "basicInfo";
                if (!state.activeName) {
                    state.activeName = "basicInfo";
                }
                id && memberCourseCardsDetail({ id: id }).then( (res) => {
                    state.detailData = res.data;
                    state.detailData.avatar = JSON.parse(state.detailData.appendixes);
                    state.detailData.mobile = mobile || "";
                    state.detailData.cardIssuerName = res.data.cardIssuerName || "无";
                    state.detailData.Date = state.detailData.startDate ? state.detailData.startDate + "-" + state.detailData.endDate : "";
                    state.detailData.contractType && (state.detailData.contractTypeName=state.detailData.contractType===1?'电子合同':'纸质合同')
                    state.detailData.couponId?  MemberCouponDetail({id:state.detailData.couponId}).then(({data})=>{
                        state.couponName=data.name
                    }):()=>state.detailData.contractTypeName="无";
                    if(!state.detailData.transactionId){
                            let index=[]
                            index.push(
                                state.itemList.findIndex((item)=>item.code=='cardIssuerName'),
                                state.itemList.findIndex((item)=>item.code=="avatar"),
                                state.itemList.findIndex((item)=>item.code=="contractTypeName"),
                                state.itemList.findIndex((item)=>item.code=="contractId"),
                            )
                        console.log(index);
                        index.forEach(item=>{
                                state.itemList[item].show=false
                        })
                        state.itemListSHow=[
                            {code:"cardIssuerName",show:false},
                            { code :"avatar" ,show:false},
                            { code :"contractTypeName",show:false },
                            { code :"contractId" ,show:false}
                        ]

                        // state.itemList=[]



                    }

                    !state.detailData.contractId?state.detailData.contractId="无":state.detailData.contractId=state.detailData.contractId
                });

            }
        });

        const formChange = (val) => {
            console.log(val)
        };
        onMounted(async () => {
            await state.getDetail();

        });
        watchEffect(() => {
            if (state.detailData) {
                state.people = state.detailData.maxBind;
                state.detailData.memberCourseCardRelationVOList ? state.alreadyPeople = state.detailData.memberCourseCardRelationVOList.length : 0;
                state.remainingPeople = state.people - state.alreadyPeople;

                couplingSettingsList({ couponId: state.detailData.couponId }).then(res => {
                    state.UnionCardData = res.data;
                });
            }
        });
        return {
            formListRef,
            formChange,
            vipName,
            ...toRefs(state),
            actionData,
            butShow,
        };
    }
};
</script>

<style lang="scss" scoped>
.heightBlod {
    height: 100% !important;
}

.w90 {
    width: 90px;
}

.cf {
    cursor: pointer;
    color: #409eff;
}

.studentDetails {
    height: calc(100% - 30px);
    display: flex;
    flex-direction: column;
}

.info {
    flex: 1;
    padding-top: 10px;
    color: #333;
    border-top: 1px solid #ccc;

    .border-right {
        border-right: 1px solid #ccc;
    }

    .infoLeft {
        height: 100%;
        text-align: center;
        line-height: 30px;
        padding-top: 14px;

        div {
            margin-top: 10px;
        }

        img {
            max-width: 100px;
            max-height: 100px;
        }
    }

    .infoRight {
        height: 100%;
        padding-left: 10px;

        .border_bottom {
            border-bottom: 1px solid #d2cccc;
        }
    }

    .fontWeightBold {
        font-weight: bold;
        color: black;
    }

    .m-t-20 {
        margin-top: 20px;
    }

    .m-b-20 {
        margin-bottom: 20px;
    }
}
</style>
