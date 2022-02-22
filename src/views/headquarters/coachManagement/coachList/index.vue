<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:34:00
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-29 15:28:31
 * @Descripttion: 教练列表
-->
<template>
    <div>
        <div class="title">
            <formList
                :config="config"
                :itemList="queryList"
                :formInitData="formInitData"
                @buttonClick="buttonCallBack"
            />
        </div>
        <div class="table">
            <Table
                ref="TableList"
                :showSortIndex="{ show: true, lable: '序号' }"
                :loadData="getTableData"
                :column="column"
                :params="formInitData"
            />
        </div>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    getCoachLevelListAPI,
    isShowWebsiteAPI,
    displayWebsiteAPI,
} from "@/api/coach";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { genderList, showGender } from "@/utils/enum/select";
import {
    getSelectCoachGroupListAPI,
    getSelectCourseListAPI,
} from "@/api/common";
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null); // this.$refs.TableList
        const queryList = [
            {
                el: "input",
                label: "教练名称",
                code: "name",
            },
            {
                el: "input",
                label: "教练手机号",
                code: "mobile",
            },
            {
                el: "select",
                label: "性别",
                code: "gender",
                list: [
                    { value: "1", label: "男" },
                    { value: "2", label: "女" },
                ],
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
                label: "状态",
                code: "status",
                list: [
                    { value: "1", label: "启用" },
                    { value: "0", label: "禁用" },
                ],
            },
            {
                el: "select",
                label: "是否显示在小程序",
                code: "display",
                list: [
                    { value: "1", label: "是" },
                    { value: "0", label: "否" },
                ],
            },
            {
                el: "select",
                label: "是否显示在官网",
                code: "showOnWeb",
                list: [
                    { value: "1", label: "是" },
                    { value: "0", label: "否" },
                ],
            },
            {
                el: "select",
                label: "授课课程",
                code: "courseId",
                back: true, // 从后台返回结果
                labelCode: "name", // 指定的label名
                valueCode: "id", // 指定的value名
                fun: getSelectCourseListAPI,
                filterable: true,
            },
        ];
        const config = {
            allRequired: false, // 是否全部必填
            inline: true, //行内
            colon: "",
            inputStyle: {
                width: "200px",
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "查 询",
                },
            ],
        };
        const state = reactive({
            formInitData: {},
            form: {
                label: "",
            },
            column: [
                { prop: "name", label: "姓名" },
                {
                    prop: "gender",
                    label: "性别",
                    html: (row, val) => {
                        if (val == "1") return "男";
                        else if (val == "2") return "女";
                    },
                },
                { prop: "mobile", label: "联系方式" },
                { prop: "groupName", label: "教练组" },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => {
                        if (val == "1") return "启用";
                        else if (val == "0")
                            return `<span style='color:red'>禁用</span>`;
                    },
                },
                {
                    prop: "display",
                    label: "是否显示在小程序",
                    html: (row, val) => {
                        if (val) return "是";
                        else return "否";
                    },
                },
                {
                    prop: "showOnWeb",
                    label: "是否显示在官网",
                    html: (row, val) => {
                        if (val == "1") return "是";
                        else if (val == "0") return "否";
                    },
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 240,
                    actives: [
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/coachManagementz/detail",
                                    query: { id: val.id },
                                });
                            },
                        },
                        {
                            name: (val) => {
                                if (val.display) {
                                    return "小程序隐藏";
                                }
                            },
                            method: (val) => {
                                console.log(val, "小程序隐藏");
                                displayWebsiteAPI({
                                    id: val.id,
                                    display: 0,
                                }).then((res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update({
                                            ...state.formInitData,
                                        });
                                    }
                                });
                            },
                        },
                        {
                            name: (val) => {
                                if (!val.display) {
                                    return "小程序显示";
                                }
                            },
                            method: (val) => {
                                console.log(val, "小程序显示");
                                displayWebsiteAPI({
                                    id: val.id,
                                    display: 1,
                                }).then((res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update({
                                            ...state.formInitData,
                                        });
                                    }
                                });
                            },
                        },
                        {
                            name: (val) => {
                                if (val.showOnWeb == 0) {
                                    return "官网显示";
                                }
                            },
                            method: (val) => {
                                console.log(val, "官网显示");
                                isShowWebsiteAPI({
                                    id: val.id,
                                    showOnWeb: 0,
                                }).then((res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update({
                                            ...state.formInitData,
                                        });
                                    }
                                });
                            },
                        },
                        {
                            name: (val) => {
                                if (val.showOnWeb == 1) {
                                    return "官网隐藏";
                                }
                            },
                            method: (val) => {
                                console.log(val, "官网隐藏");
                                isShowWebsiteAPI({
                                    id: val.id,
                                    showOnWeb: 1,
                                }).then((res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update({
                                            ...state.formInitData,
                                        });
                                    }
                                });
                            },
                        },
                    ],
                },
            ],
        });

        const getTableData = computed(() => {
            return getCoachLevelListAPI;
        });
        const buttonCallBack = (val) => {
            console.log(val, "val");
            TableList.value.update({ ...val.value });
        };

        return {
            ...toRefs(state),
            queryList,
            config,
            getTableData,
            buttonCallBack,
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped></style>
