<!--
 * @Author: 郑晶
 * @Date: 2021-12-23 15:09:14
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-16 10:56:58
 * @Description: 会员管理-详情
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
    </div>
</template>

<script>
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { ElMessage } from "element-plus";
import {
    travelList,
    courseDemandList,
    testList,
    maritalStatusList,
} from "@/utils/enum/select";
import { sourceList } from "@/api/memberSource";
import { hallSalesList } from "@/api/hall";
import {
    hallMemberPost,
    hallMemberPut,
    hallMemberDetail,
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
    getSelectHallListAPI,
    getSelectCoachListAPI,
} from "@/api/common";
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
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
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
                    maxlength: 32,
                },
                {
                    label: "姓名",
                    code: "name",
                    placeholder: "请输入真实姓名",
                    maxlength: 32,
                },
                {
                    label: "微信号",
                    code: "wechatId",
                    required: false,
                    maxlength: 30,
                },
                {
                    label: "身份证号",
                    code: "idCard",
                    required: false,
                    checkFun: "idcard",
                    maxlength: 18,
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
                },
                {
                    label: "手机号",
                    code: "contact",
                    maxlength: 11,
                    checkType: "phone",
                },
                {
                    code: "receiveSms",
                    el: "switch",
                    label: "是否接收短信",
                    required: false,
                    activeValue: "1",
                    inactiveValue: "-1",
                },
                {
                    el: "area",
                    code: "mergerRegion",
                    label: "地址",
                    placeholder: "请选择地址",
                    areaCode: "province,provinceId,city,cityId,area,areaId",
                },
                {
                    el: "date",
                    code: "birthday",
                    type: "date",
                    label: "生日",
                    minDate: new Date("1900-01-01"),
                    maxDate: new Date(),
                    required: false,
                },
                {
                    label: "公司名",
                    code: "companyName",
                    required: false,
                    maxlength: 32,
                },

                {
                    label: "兴趣爱好",
                    code: "hobbies",
                    required: false,
                    maxlength: 32,
                },

                {
                    el: "select",
                    label: "婚姻状况",
                    code: "maritalStatus",
                    list: maritalStatusList,
                    required: false,
                },
                {
                    el: "select",
                    label: "出行习惯",
                    code: "tripMode",
                    list: travelList,
                    required: false,
                },
                {
                    el: "select",
                    label: "课程需求",
                    code: "courseRequirements",
                    list: courseDemandList,
                    required: false,
                },

                {
                    el: "textArea",
                    code: "address",
                    maxlength: 255,
                    label: "住址",
                    required: false,
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
                },
                {
                    el: "select",
                    label: "所属场馆",
                    code: "hallId",
                    fun: getSelectHallListAPI,
                    required: false,
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
                if (useRoute().query) {
                    const { id, type } = useRoute().query;
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
        return {
            formListRef,
            ...toRefs(state),
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
