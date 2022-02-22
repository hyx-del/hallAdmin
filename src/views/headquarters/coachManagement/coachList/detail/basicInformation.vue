<!--
 * @Author: 刘帝君
 * @Date: 2021-12-02 09:54:25
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-24 17:41:11
 * @Descripttion: 教练详情/基本信息
-->
<template>
    <emptyBox bottom="40">
        <formList
            :config="addFormConfig"
            :itemList="itemList"
            :formInitData="formInitData"
            @buttonClick="button"
        />
    </emptyBox>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { genderList } from "@/utils/enum/select";
import formList from "@/components/FormList/index.vue";
import store from "@/store";
import emptyBox from "@/components/emptyBox";
import {
    getSelectCoachGroupListAPI,
    getSelectCityListAPI,
    getSelectHallListAPI,
} from "@/api/common";
import { detailSaveAPI } from "@/api/coach";
export default defineComponent({
    components: {
        formList,
        emptyBox,
    },
    name: "basicInfo",
    props: {
        formInitData: {
            type: Object,
            defalt: "",
        },
    },
    setup(props) {
        const router = useRouter();
        const state = reactive({
            formInitData: props.formInitData,
            itemList: [
                {
                    code: "name",
                    maxlength: 60,
                    label: "姓名",
                    disabled: true,
                    placeholder: " ",
                },
                {
                    code: "nameEn",
                    required: false,
                    maxlength: 60,
                    label: "英文名",
                    placeholder: " ",
                    disabled: true,
                },
                {
                    el: "img",
                    code: "avatar",
                    label: "照片",
                    size: 2048,
                    limit: 1,
                    required: false,
                    disabled: true,
                },
                {
                    el: "radio",
                    code: "gender",
                    label: "性别",
                    required: false,
                    list: genderList,
                    disabled: true,
                },
                {
                    code: "mobile",
                    type: "phone",
                    maxlength: 11,
                    label: "手机号",
                    disabled: true,
                },
                {
                    el: "date",
                    label: "入职日期",
                    code: "entryTime",
                    dataFormat: "{y}-{m}-{d} {h}:{i}:{s}", //时间返回格式
                    required: false,
                    placeholder: " ",
                    disabled: true,
                },
                {
                    el: "select",
                    label: "教练组",
                    code: "coachGroupId",
                    back: true, // 从后台返回结果
                    labelCode: "name", // 指定的label名
                    valueCode: "id", // 指定的value名
                    fun: getSelectCoachGroupListAPI,
                    filterable: true,
                },
                {
                    el: "select",
                    label: "授课城市",
                    code: "residentCityId",
                    back: true, // 从后台返回结果
                    labelCode: "name", // 指定的label名
                    valueCode: "id", // 指定的value名
                    fun: getSelectCityListAPI,
                    filterable: true,
                },
                {
                    el: "select",
                    label: "常驻场馆",
                    code: "residentHallId",
                    back: true, // 从后台返回结果
                    labelCode: "name", // 指定的label名
                    valueCode: "id", // 指定的value名
                    fun: getSelectHallListAPI,
                    filterable: true,
                },
                {
                    el: "area",
                    code: "address",
                    label: "地址",
                    areaCode: "province,provinceId,city,cityId,area,areaId",
                    placeholder: "请选择地址",
                    disabled: true,
                },
                {
                    code: "address",
                    el: "textArea",
                    maxlength: 255,
                    label: "住址",
                    required: false,
                    placeholder: " ",
                    disabled: true,
                },
                {
                    code: "profile",
                    el: "textArea",
                    maxlength: 255,
                    label: "个人简介",
                    required: false,
                    placeholder: " ",
                    disabled: true,
                },
                {
                    code: "remark",
                    el: "textArea",
                    maxlength: 500,
                    label: "详情介绍",
                    required: false,
                    disabled: true,
                },
            ],
            addFormConfig: {
                inline: false, //行内
                allRequired: true, // 是否全部必填
                colon: "：",
                inputStyle: {
                    width: "400px",
                },
                buttons: [
                    {
                        funType: "cancel",
                        type: null,
                        name: "取 消",
                    },
                    {
                        funType: "confirm",
                        type: "primary",
                        name: "确 认",
                    },
                ],
            },
            button: (val) => {
                console.log(val, "123");
                switch (val.text) {
                    case "确 认":
                        let dataObj = {
                            coachGroupId: val.value.coachGroupId,
                            residentCityId: val.value.residentCityId,
                            residentHallId: val.value.residentHallId,
                            id: val.value.id,
                        };
                        detailSaveAPI(dataObj).then((res) => {
                            console.log(res, "保存");
                            let { code } = res;
                            ElMessage({
                                message: `操作${
                                    code === 200 ? "成功" : "失败"
                                }`,
                                duration: 1000,
                                type: "success",
                                onClose: () => code === 200 && router.back(),
                            });
                        });
                        break;
                    case "取 消":
                        router.back();
                        break;
                    default:
                        break;
                }
            },
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style lang="scss" scoped>
.el-cascader {
    display: inline !important;
}
</style>
