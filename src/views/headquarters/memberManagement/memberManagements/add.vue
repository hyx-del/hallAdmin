<!--
 * @Author: 郑晶
 * @Date: 2021-12-21 15:19:08
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-16 11:47:30
 * @Description: 
-->
<template>
    <emptyBox bottom="70">
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
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
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
import { hallCoachList, hallSalesList } from "@/api/hall";
import {
    hallMemberPost,
    hallMemberPut,
    hallMemberDetail,
} from "@/api/hallMember";
import {
    memberOptions,
    getSelectHallListAPI,
    getSelectCoachListAPI,
} from "@/api/common";

export default {
    components: {
        formList,
        emptyBox,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            type: false,
            formInitData: {},
            config: {
                ...addFormBottom,
                valueStyle: {
                    width: "600px",
                },
            },
            itemList: [
                {
                    label: "手机号",
                    code: "contact",
                    maxlength: 11,
                    checkType: "phone",
                    required: false,
                },
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
                // {
                //     el: "select",
                //     label: "所属场馆",
                //     code: "hallId",
                //     fun: getSelectHallListAPI,
                //     required: false,
                // },
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
                    show: computed(() => state.type),
                },
            ],
            // 手动隐藏
            hideList: [],
            // 手动显示
            showList: [],
            formState: [],
            id: "",
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
                        if (!value.contact && !value.wechatId) {
                            ElMessage.error("手机号或微信号至少填一个");
                            return false;
                        }
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
                            if (state.hallId) {
                                value.hallId = state.hallId;
                            }
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
            hallId: useRoute().query.hallId,
            // 初始化
            start: () => {
                if (useRoute().query) {
                    const { id, type } = useRoute().query;
                    state.type = type;
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

<style lang="scss" scoped></style>
