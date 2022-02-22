<!--
 * @Author: 郑晶
 * @Date: 2021-12-23 15:09:14
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-16 11:25:00
 * @Description: 门店-会员管理-详情
-->
<template>
    <div class="studentDetails">
        <h2>学员详情</h2>
        <div class="info">
            <el-row style="height: 100%">
                <el-col :span="4" class="border-right">
                    <div class="infoLeft">
                        <div>
                            <img :src="formInitData.avatar" alt="" />
                        </div>
                        <div>姓名：{{ formInitData.name }}</div>
                        <div>电话：{{ formInitData.contact }}</div>
                        <div>账户储值：{{ formInitData.balance }}</div>
                        <div>使用折扣：{{ formInitData.discountRate }}</div>
                        <div v-if="!type">
                            <el-button class="w90" @click="topUpModal = true">
                                充值
                            </el-button>
                        </div>
                        <div v-if="!type">
                            <el-button class="w90" @click="openRollOut">
                                调整余额
                            </el-button>
                        </div>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="infoRight">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="basicInfo">
                                <emptyBox
                                    :bottom="30"
                                    :style="{ paddingBottom: '70px' }"
                                >
                                    <formList
                                        ref="formListRef"
                                        :formInitData="formInitData"
                                        :itemList="itemList"
                                        :buttons="buttons"
                                        :config="config"
                                        @formChange="formChange"
                                    >
                                        <template #afterSlot2>
                                            <el-button
                                                type="primary"
                                                size="small"
                                                @click="membershipChanges"
                                                >会籍更改</el-button
                                            >
                                        </template>
                                    </formList>
                                </emptyBox>
                            </el-tab-pane>
                            <el-tab-pane label="体测数据" name="indicator">
                                <Indicator v-if="activeName == 'indicator'" />
                            </el-tab-pane>
                            <el-tab-pane label="课程卡" name="card">
                                <CourseCard v-if="activeName == 'card'" />
                            </el-tab-pane>
                            <el-tab-pane label="账户余额" name="balance">
                                <AccountBalance
                                    v-if="activeName == 'balance'"
                                />
                            </el-tab-pane>
                            <el-tab-pane label="跟进记录" name="follow">
                                <FollowLog v-if="activeName == 'follow'" />
                            </el-tab-pane>
                            <el-tab-pane label="到访记录" name="access">
                                <AccessLog v-if="activeName == 'access'" />
                            </el-tab-pane>
                            <el-tab-pane label="上课记录" name="class">
                                <ClassLog v-if="activeName == 'class'" />
                            </el-tab-pane>
                            <el-tab-pane label="会籍更换记录" name="salesman">
                                <SalesmanLog v-if="activeName == 'salesman'" />
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 充值 -->
        <popupForm
            v-model:show="topUpModal"
            v-model:formInitData="topUpData"
            title="充值"
            :itemList="topUpList"
            :buttons="topUpButtons"
        />
        <!-- 调整余额 -->
        <popupForm
            v-model:show="rollOutModal"
            v-model:formInitData="rollOutData"
            title="调整余额"
            :itemList="rollOutList"
            :buttons="rollOutButtons"
        />
        <!-- 会籍更改 -->
        <popupForm
            v-model:show="dialogFormVisible"
            v-model:formInitData="form"
            title="会籍更改"
            :itemList="salesList"
            :formConfig="popFormConfig"
            :buttons="salesButtons"
        />
    </div>
</template>

<script>
import { addFormConfig } from "../../../utils/config";
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import { toRefs, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { ElMessage } from "element-plus";
import {
    travelList,
    courseDemandList,
    maritalStatusList,
} from "@/utils/enum/select";
import { sourceList } from "@/api/memberSource";
import {
    hallCoachList,
    hallSalesList,
    hallMemberAccountCharge,
    membershipChangesAPI,
} from "@/api/hall";
import {
    hallMemberPost,
    hallMemberPut,
    hallMemberDetail,
    hallMemberAccountAdjust,
} from "@/api/hallMember";
import Indicator from "./indicator.vue";
import CourseCard from "./courseCard.vue";
import AccountBalance from "./accountBalance.vue";
import FollowLog from "./followLog.vue";
import AccessLog from "./accessLog.vue";
import ClassLog from "./classLog.vue";
import SalesmanLog from "./salesmanLog.vue";
import {
    memberOptions,
    hallPaymentList,
    getSelectHallListAPI,
    getSelectCoachListAPI,
} from "@/api/common";
import { getRegCliqueListAPI } from "@/api/baseSet";
export default {
    components: {
        formList,
        emptyBox,
        Indicator,
        CourseCard,
        AccountBalance,
        FollowLog,
        AccessLog,
        ClassLog,
        SalesmanLog,
        popupForm,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const { id, type } = useRoute().query;
        const state = reactive({
            type,
            // 余额调整
            topUpModal: false,
            topUpData: {},
            topUpList: [
                {
                    el: "select",
                    label: "充值规格",
                    code: "chargeSpecId",
                    fun: getRegCliqueListAPI,
                    funMode: (res) =>
                        res.data.records.map((v) => ({
                            label: v.amount,
                            value: v.id + "",
                        })),
                },
                {
                    el: "select",
                    label: "充值方式",
                    code: "channel",
                    fun: hallPaymentList,
                    funMode: (res) => {
                        return res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        }));
                    },
                },
            ],
            topUpButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        hallMemberAccountCharge({
                            ...value,
                            memberId: id,
                        }).then(({ code, msg, data }) => {
                            if (code === 200) {
                                ElMessage.success({
                                    message: msg || "操作成功",
                                    duration: 300,
                                    onClose: () => {
                                        state.topUpModal = false;
                                        state.formInitData = {
                                            ...state.formInitData,
                                            ...data,
                                        };
                                    },
                                });
                            } else {
                                ElMessage.error({
                                    message: msg || "操作失败",
                                });
                            }
                        });
                    },
                },
                {
                    name: "取消",
                    click: () => {
                        state.topUpModal = false;
                    },
                },
            ],
            // 调整余额
            rollOutModal: false,
            rollOutData: {},
            rollOutList: [
                {
                    label: "当前余额",
                    code: "balance",
                    required: false,
                    disabled: true,
                    placeholder: " ",
                    suffix: "元",
                },
                {
                    el: "radio",
                    code: "type",
                    label: "调整方式",
                    list: [
                        { label: "增加", value: "1" },
                        { label: "减少", value: "-1" },
                    ],
                    default: "1",
                    valueChange: (item, row) => ({
                        formObj: {
                            amount: "",
                        },
                        list: [
                            {
                                code: "amount",
                                label: item == 1 ? "增加金额" : "减少金额",
                            },
                        ],
                    }),
                },
                {
                    label: "调整金额",
                    code: "amount",
                    valueChange: (item, { type, balance }) => {
                        // 增加
                        if (type == 1) {
                            return {
                                formObj: {
                                    amountAfter:
                                        Math.round((+balance + +item) * 100) /
                                        100,
                                },
                            };
                        } else {
                            // 减少
                            return {
                                formObj: {
                                    amountAfter:
                                        item > balance
                                            ? "0"
                                            : Math.round(+balance * 100) / 100,
                                },
                            };
                        }
                    },
                    checkType: "numbers",
                },
                {
                    el: "select",
                    label: "支付方式",
                    code: "channel",
                    fun: hallPaymentList,
                    funMode: (res) => {
                        return res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        }));
                    },
                },
                {
                    label: "调整后余额",
                    code: "amountAfter",
                    required: false,
                    disabled: true,
                    placeholder: " ",
                    suffix: "元",
                },
                {
                    code: "remark",
                    el: "textArea",
                    maxlength: 255,
                    label: "备注",
                    required: false,
                },
            ],
            rollOutButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        const { amount, channel, remark, type } = value;
                        let params = {
                            amount: type == 1 ? +amount : -amount,
                            channel,
                            memberId: id,
                            remark,
                        };
                        hallMemberAccountAdjust(params).then(
                            ({ code, data, msg }) => {
                                if (code === 200) {
                                    ElMessage.success({
                                        message: msg || "操作成功",
                                        duration: 300,
                                        onClose: () => {
                                            state.formInitData = {
                                                ...state.formInitData,
                                                ...data,
                                            };
                                            state.rollOutModal = false;
                                        },
                                    });
                                } else {
                                    ElMessage.error({
                                        message: msg || "操作失败",
                                        duration: 300,
                                    });
                                }
                            }
                        );
                    },
                },
                {
                    name: "取消",
                    click: () => {
                        state.rollOutModal = false;
                    },
                },
            ],
            formInitData: {},
            config: {
                ...addFormBottom,
                button: {
                    style: {
                        position: "absolute",
                        bottom: "20px",
                        marginBottom: "0",
                        left: "24px",
                    },
                },
            },
            itemList: [
                {
                    el: "radio",
                    label: "类型",
                    code: "type",
                    list: [
                        { label: "个人", value: "1" },
                        { label: "企业", value: "2" },
                    ],
                    default: "1",
                },
                {
                    label: "昵称",
                    code: "nickname",
                    maxlength: 20,
                },
                {
                    label: "姓名",
                    code: "name",
                    placeholder: "请输入真实姓名",
                    maxlength: 20,
                },
                {
                    label: "微信号",
                    code: "wechatId",
                    required: false,
                    maxlength: 32,
                    disabled: true,
                },
                {
                    label: "身份证号",
                    code: "idCard",
                    required: false,
                    maxlength: 18,
                    checkFun: "idcard",
                },
                {
                    el: "radio",
                    label: "性别",
                    code: "gender",
                    list: [
                        { label: "男", value: "1" },
                        { label: "女", value: "2" },
                    ],
                    default: "1",
                },
                {
                    el: "img",
                    code: "avatar",
                    label: "照片",
                    size: 1024,
                    limit: 1,
                    required: false,
                    disabled: true,
                },
                {
                    label: "手机号",
                    code: "contact",
                    maxlength: 11,
                    disabled: true,
                },
                {
                    code: "receiveSms",
                    el: "switch",
                    label: "是否接收短信",
                    required: false,
                    activeValue: "1",
                    inactiveValue: "-1",
                    disabled: true,
                },
                {
                    el: "area",
                    code: "mergerRegion",
                    label: "地址",
                    placeholder: "请选择地址",
                    areaCode: "province,provinceId,city,cityId,area,areaId",
                    disabled: true,
                },
                {
                    el: "date",
                    code: "birthday",
                    type: "date",
                    label: "生日",
                    minDate: new Date("1900-01-01"),
                    maxDate: new Date(),
                    required: false,
                    disabled: true,
                },
                {
                    label: "公司名",
                    code: "companyName",
                    required: false,
                    maxlength: 32,
                    disabled: true,
                },

                {
                    label: "兴趣爱好",
                    code: "hobbies",
                    required: false,
                    maxlength: 32,
                    disabled: true,
                },

                {
                    el: "select",
                    label: "婚姻状况",
                    code: "maritalStatus",
                    list: maritalStatusList,
                    required: false,
                    disabled: true,
                },
                {
                    el: "select",
                    label: "出行习惯",
                    code: "tripMode",
                    list: travelList,
                    required: false,
                    disabled: true,
                },
                {
                    el: "select",
                    label: "课程需求",
                    code: "courseRequirements",
                    list: courseDemandList,
                    required: false,
                    disabled: true,
                },

                {
                    el: "textArea",
                    code: "address",
                    maxlength: 255,
                    label: "住址",
                    required: false,
                    disabled: true,
                },
                {
                    el: "select",
                    label: "来源",
                    code: "sourceId",
                    fun: sourceList,
                    funMode: (res) =>
                        res.data.records.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        })),
                    disabled: true,
                },
                {
                    el: "select",
                    label: "销售员",
                    code: "salesmanId",
                    fun: hallSalesList,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        })),
                    disabled: true,
                    afterSlot: "afterSlot2",
                    required: false,
                },
                {
                    el: "select",
                    label: "教练",
                    code: "coachIds",
                    multiple: true,
                    backType: "ArrayNumber",
                    fun: getSelectCoachListAPI,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        })),
                    required: false,
                    disabled: true,
                },
                {
                    el: "select",
                    code: "referrerId",
                    label: "推荐人",
                    multiple: false, // 多选
                    filterable: true, // 可搜索
                    remote: true, // 可接收
                    reserveKeyword: true, //保留搜索关键词
                    remoteMethod: (keyword) => ({ keyword }),
                    fun: memberOptions,

                    tips: "输入搜索，下拉选中",
                    required: false,
                    disabled: true,
                },
                {
                    label: "注册时间",
                    code: "registerAt",
                    disabled: true,
                },
                {
                    code: "isTestAccount",
                    el: "switch",
                    label: "允许作为测试账号",
                    required: false,
                    activeValue: "1",
                    inactiveValue: "0",
                    disabled: true,
                },
            ],
            // 会籍更改
            form: {},
            dialogFormVisible: false,
            membershipChanges: () => {
                state.dialogFormVisible = true;
            },
            salesList: [
                {
                    el: "radio",
                    label: "类型",
                    code: "type",
                    list: [
                        { label: "转入场馆", value: "1" },
                        { label: "转入销售", value: "2" },
                    ],
                    default: "1",
                    required: false,
                    valueChange: (val, data) => {
                        let list = [
                            {
                                code: "newHallId",
                                required: val == "1" ? true : false,
                                disabled: val == "1" ? false : true,
                            },
                            {
                                code: "newSalemanId",
                                required: val == "2" ? true : false,
                                disabled: val == "2" ? false : true,
                            },
                        ];
                        return {
                            list,
                            formObj: {
                                ...data,
                                newHallId: val == "1" ? data.newHallId : "",
                                newSalemanId:
                                    val == "2" ? data.newSalemanId : "",
                            },
                        };
                    },
                },
                {
                    el: "select",
                    code: "newHallId",
                    label: "场馆",
                    fun: getSelectHallListAPI,
                },
                {
                    el: "select",
                    code: "newSalemanId",
                    label: "销售",
                    fun: hallSalesList,
                    required: false,
                    disabled: true,
                },
                {
                    el: "textArea",
                    code: "remark",
                    maxlength: 500,
                    label: "备注",
                    required: false,
                },
            ],
            popFormConfig: {
                default: {
                    disabled: false,
                },
                buttons: [],
            },
            salesButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.dialogFormVisible = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        value.memberId = id;
                        console.log("确定", value);
                        membershipChangesAPI({ ...value }).then((res) => {
                            console.log(res, "res");
                            if (res.code == 200) {
                                ElMessage.success({
                                    message: "操作成功",
                                    duration: 1000,
                                    onClose: () => {
                                        state.dialogFormVisible = false;
                                        router.go(-1);
                                    },
                                });
                            }
                        });
                    },
                },
            ],
            // 手动隐藏
            hideList: [],
            // 手动显示
            showList: [],
            formState: [],
            id: "",
            activeName: "basicInfo",
            // 表单变化
            formChange: (val) => {
                let { code, value } = val;
                state.formInitData[code] = value;
            },
            // 按钮
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        // 编辑
                        if (state.id) {
                            hallMemberPut({
                                ...value,
                            }).then(({ code, msg }) => {
                                if (code === 200) {
                                    ElMessage.success({
                                        message: msg || "操作成功",
                                        duration: 1000,
                                        onClose: () => {
                                            router.go(-1);
                                        },
                                    });
                                } else {
                                    ElMessage.error({
                                        message: msg || "操作失败",
                                    });
                                }
                            });
                        } else {
                            // 新加
                            hallMemberPost({
                                ...value,
                            }).then(({ code, msg }) => {
                                if (code === 200) {
                                    ElMessage.success({
                                        message: msg || "操作成功",
                                        duration: 1000,
                                        onClose: () => {
                                            router.go(-1);
                                        },
                                    });
                                } else {
                                    ElMessage.error({
                                        message: msg || "操作失败",
                                    });
                                }
                            });
                        }
                    },
                },
            ],
            // 初始化
            start: () => {
                if (id) {
                    state.id = id;
                    // 详情页面禁用
                    if (type) {
                        state.config = {
                            ...state.config,
                            default: {
                                disabled: true,
                            },
                        };
                        state.buttons = [
                            {
                                name: "返回",
                                click: () => {
                                    router.go(-1);
                                },
                            },
                        ];
                    }
                    // 查询详情
                    id &&
                        hallMemberDetail({ id: state.id }).then(
                            ({ data, code }) => {
                                if (code === 200) {
                                    state.formInitData = data;
                                }
                            }
                        );
                }
            },
        });
        state.start();
        const openRollOut = () => {
            state.rollOutData = {
                ...state.rollOutData,
                balance: state.formInitData?.balance,
            };
            state.rollOutModal = true;
        };
        return {
            formListRef,
            ...toRefs(state),
            addFormConfig,
            openRollOut,
        };
    },
};
</script>

<style lang="scss" scoped>
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
    }
}
</style>
