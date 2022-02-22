<!--
 * @Author: 郑晶
 * @Date: 2022-01-05 16:26:20
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-15 14:45:13
 * @Description: 会员-会员管理-编辑/详情页面
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
            <template #afterSlot2>
                <el-button
                    type="primary"
                    size="small"
                    @click="unbundling"
                    v-if="!typeDetails"
                    >微信解绑</el-button
                >
            </template>
            <template #afterSlot>
                <el-button
                    type="primary"
                    size="small"
                    @click="linkObtain"
                    v-if="!typeDetails"
                    >获取链接</el-button
                >
            </template>
        </formList>
    </emptyBox>
</template>

<script>
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { ElMessage } from "element-plus";
import {
    memberDetail,
    updateMember,
    unbundlingWX,
    obtainLinkAPI,
} from "@/api/member";

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
            typeDetails: useRoute().query.type,
            userId: useRoute().query.id,
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
                    label: "姓名",
                    code: "name",
                    placeholder: "请输入真实姓名",
                },
                {
                    label: "昵称",
                    code: "nickname",
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
                },
                {
                    label: "手机号",
                    code: "contact",
                    maxlength: 11,
                    checkType: "phone",
                },
                {
                    label: "微信号",
                    code: "wechatId",
                    afterSlot: "afterSlot2",
                    required: false,
                },
                {
                    label: "邮箱",
                    code: "email",
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
                    el: "textArea",
                    code: "address",
                    maxlength: 255,
                    label: "住址",
                    required: false,
                },
                {
                    label: "注册时间",
                    code: "registerAt",
                    disabled: true,
                    show: computed(() => state.type),
                },
                // {
                //     label: "开通服务",
                //     code: "registerAt",
                //     required: false,
                // },
                {
                    label: "重新实名认证链接",
                    code: "obtainLink",
                    afterSlot: "afterSlot",
                    required: false,
                    placeholder: " ",
                },
            ],
            // 解绑
            unbundling: () => {
                unbundlingWX({ id: state.formInitData.id }).then(({ code }) => {
                    console.log(code, "解绑");
                    if (code == 200) {
                        ElMessage.success({
                            message: "操作成功",
                            duration: 1000,
                        });
                    }
                });
            },
            // 获取链接
            linkObtain: () => {
                console.log("获取链接", state.userId);
                obtainLinkAPI({ userId: state.userId }).then(({ code }) => {
                    console.log(code, "获取链接");
                    if (code == 200) {
                        ElMessage.success({
                            message: "操作成功",
                            duration: 1000,
                        });
                    }
                });
            },
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
                        // 编辑
                        if (state.id) {
                            updateMember({
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
                    state.type = id ? true : false;
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
                        memberDetail({ id: state.id }).then(
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
