<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:02:49
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-13 15:11:22
 * @Description: 会馆管理
-->

<template>
    <div>
        <formList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            title="新加课程"
            :itemList="popItemList"
            :buttons="buttonsPop"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { studentGraduationList, updateHallStatus } from "@/api/hall";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { stateList, getListHtml, testList } from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            popShow: false,
            popFormInitData: {},
            buttonsPop: [
                {
                    text: "取消",
                    click: () => (state.popShow = false),
                },
                {
                    funType: "confirm",
                    text: "保存",
                    type: "primary",
                    click: ({ value }) => {
                        console.log(value);
                    },
                },
            ],
            popItemList: [
                {
                    el: "select",
                    label: "课程类型",
                    code: "aaa19041",
                    list: testList,
                },
                {
                    label: "课程名称",
                    code: "aaa72723",
                },
                {
                    label: "英文名称",
                    code: "aaa23155",
                    required: false,
                },
                {
                    el: "img",
                    label: "照片",
                    code: "aaa89346",
                    required: false,
                },
                {
                    label: "时长",
                    code: "aaa85001",
                    suffix: "分",
                    type: "number",
                    checkType: "number",
                },
                {
                    label: "可约人数",
                    code: "aaa83405",
                    type: "number",
                    checkType: "number",
                },
                {
                    label: "最少上课人数",
                    code: "aaa95652",
                    type: "number",
                    checkType: "number",
                },
                {
                    label: "权重",
                    code: "aaa15511",
                    type: "number",
                    checkType: "number",
                    required: false,
                },
                {
                    el: "textArea",
                    label: "课程介绍",
                    code: "aaa77777",
                },
            ],
            getList: studentGraduationList,
            column: [
                {
                    prop: "name",
                    label: "名称",
                },
                {
                    prop: "phone",
                    label: "电话",
                    width: 150,
                },
                {
                    prop: "fullAddress",
                    label: "地址",
                    width: 400,
                },
                {
                    prop: "email",
                    label: "邮箱",
                },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, value) => getListHtml(stateList, value),
                },

                {
                    prop: "action",
                    label: "操作",
                    width: 200,
                    actives: [
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/hallManagementz/add",
                                    query: { id: val.id, type: "details" },
                                });
                            },
                        },
                        {
                            name: "编辑",
                            method: (val) => {
                                router.push({
                                    path: "/hallManagementz/add",
                                    query: { id: val.id },
                                });
                            },
                        },
                        {
                            name: (e) =>
                                +e.status === 10
                                    ? "开始运营"
                                    : +e.status === 20
                                    ? "暂停运营"
                                    : "恢复运营",
                            method: ({ id, status }) => {
                                const params = {
                                    id,
                                    status: +status === 20 ? -20 : 20,
                                };
                                updateHallStatus(params).then(
                                    ({ code, msg }) => {
                                        if (code === 200) {
                                            ElMessage.success(
                                                `${
                                                    status === 10
                                                        ? "开始运营"
                                                        : +status === 20
                                                        ? "暂停运营"
                                                        : "恢复运营"
                                                }成功`
                                            );
                                            TableList.value.update();
                                        } else {
                                            ElMessage.error(msg || "操作失败");
                                        }
                                    }
                                );
                            },
                        },
                    ],
                },
            ],
            formInitData: {},
            itemList: [
                {
                    code: "name",
                    label: "会馆名称",
                },
                {
                    el: "area",
                    code: "mergerRegion",
                    label: "地址",
                    areaCode: "province,provinceId,city,cityId,area,areaId",
                    placeholder: "请选择地址",
                },
                {
                    el: "select",
                    code: "status",
                    label: "状态",
                    list: stateList,
                },
            ],
            config: {
                allRequired: false, // 是否全部必填
                inline: true, //行内
                colon: "",
                inputStyle: {
                    width: "200px",
                },
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
                {
                    name: "新增",
                    click: () => {
                        router.push({
                            path: "/hallManagementz/add",
                        });
                    },
                },
            ],
        });
        return {
            ...toRefs(state),
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped>
.name {
    cursor: pointer;
    color: #2e8de6;
}
</style>
