<!--
 * @Author: 郑晶
 * @Date: 2021-12-15 14:52:51
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-15 14:45:22
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
import {
    addHall,
    hallDetails,
    updateHall,
    hallPushNodePoint,
} from "@/api/hall";
import { ElMessage } from "element-plus";

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
            formInitData: {},
            config: {
                ...addFormBottom,
                pure: false,
                valueStyle: {
                    width: "600px",
                },
            },
            itemList: [
                {
                    label: "会馆名称",
                    code: "name",
                    maxlength: 50,
                },
                {
                    label: "英文名称",
                    code: "nameEn",
                    maxlength: 50,
                    required: false,
                },
                {
                    el: "img",
                    code: "pictures",
                    label: "图片",
                    size: 1024,
                    limit: 5,
                    backType: "ArrayString",
                },
                {
                    label: "联系电话",
                    code: "phone",
                    maxlength: 11,
                    checkType: "phone",
                },
                {
                    label: "客服电话",
                    code: "phoneExt",
                    required: false,
                    maxlength: 100,
                    checkType: "numbers",
                },
                {
                    label: "微信",
                    code: "weChat",
                    required: false,
                    maxlength: 30,
                },
                {
                    label: "邮箱地址",
                    code: "email",
                    required: false,
                    maxlength: 30,
                },
                {
                    el: "area",
                    code: "mergerRegion",
                    label: "地址",
                    placeholder: "请选择地址",
                    areaCode: "province,provinceId,city,cityId,area,areaId",
                },
                {
                    label: "详细地址",
                    code: "address",
                    maxlength: 255,
                },
                {
                    label: "英文详细地址",
                    code: "addressEn",
                    required: false,
                    maxlength: 255,
                },
                {
                    label: "二维码失效时间",
                    code: "qrcodeExpireTime",
                    suffix: "分钟",
                    required: false,
                    checkType: "number",
                    maxlength: 5,
                },
                {
                    el: "timePicker",
                    code: "time",
                    otherCodeArr: ["startTime", "endTime"],
                    label: "营业时间",
                    isRange: true,
                    required: false,
                },
                {
                    code: "openTimeIntro",
                    el: "textArea",
                    maxlength: 255,
                    label: "营业时间说明",
                    required: false,
                    placeholder:
                        "周一至周五6:30-21:00，周末及公众假期8:00-18:00",
                    // default: "",
                },
                {
                    label: "会馆经纬度",
                    code: "mapPoint",
                    required: false,
                    regularError: "只能输入数字",
                    checkFun: (value) => {
                        if (RegExp(/^[0-9,.]*$/).test(value)) {
                            return;
                        } else {
                            return "只能输入数字";
                        }
                    },
                    append: {
                        text: "&#xe600;",
                        class: "iconfont",
                        click: () => {
                            window.open("https://lbs.qq.com/getPoint/");
                        },
                    },
                    maxlength: 255,
                },
                {
                    code: "description",
                    el: "textArea",
                    maxlength: 500,
                    label: "会馆描述",
                    required: false,
                    placeholder: "请输入会馆描述",
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
                        const { province, city, area, address } = value;
                        const params = {
                            ...value,
                            fullAddress: value.city
                                ? province +
                                  "-" +
                                  city +
                                  "-" +
                                  area +
                                  "-" +
                                  address
                                : value.fullAddress,
                        };
                        console.log(params, "value确认");
                        // 编辑
                        if (state.id) {
                            params.orderPushOption = {};
                            params.qrcodeExpireTime =
                                params.qrcodeExpireTime == ""
                                    ? 0
                                    : params.qrcodeExpireTime;
                            updateHall(params).then(({ code, msg }) => {
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
                            addHall(params).then(({ code, msg }) => {
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
                        hallDetails({ id: state.id }).then(({ data, code }) => {
                            if (code === 200) {
                                state.formInitData = {
                                    ...data,
                                    ...data.orderPushOption,
                                };
                            }
                        });
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
