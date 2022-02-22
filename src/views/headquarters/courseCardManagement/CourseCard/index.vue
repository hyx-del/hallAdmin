<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:29:53
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-09 11:07:02
 * @Descripttion: 课程卡管理
-->
<template>
    <div>
        <div class="title">
            <formList
                :config="config"
                :itemList="itemList"
                :formInitData="formInitData"
                @buttonClick="button"
            />
        </div>
        <div class="table">
            <Table
                ref="TableList"
                :loadData="getList"
                :column="column"
                :params="formInitData"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </div>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    courseCardManagementList,
    addCourseCardManagement,
    detailCourseCardManagement,
    deleteCourseCardManagement,
    statusCourseCardManagement,
} from "@/api/courseCardManagement";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { deleteItem } from "@/utils/tools";
import { tabelFormConfig } from "@/utils/config";
import {
    courseStateList,
    examineList,
    genderList,
    getListHtml,
} from "@/utils/enum/select";
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            itemList: [
                {
                    code: "name",
                    label: "名称",
                    placeholder: "请输入名称",
                },
                {
                    el: "select",
                    label: "类型",
                    code: "type",
                    list: [
                        { value: "1", label: "次卡" },
                        { value: "2", label: "期限卡" },
                    ],
                },
                {
                    el: "select",
                    label: "可上课类型",
                    code: "courseType",
                    list: [
                        { value: "1", label: "团课" },
                        { value: "2", label: "私教课" },
                    ],
                },
                {
                    el: "select",
                    label: "通用类型",
                    code: "generalType",
                    list: [
                        { value: "1", label: "全国通" },
                        { value: "2", label: "城市通" },
                        { value: "3", label: "单店" },
                        { value: "4", label: "通店" },
                    ],
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
            ],
            config: {
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
                    {
                        funType: "add",
                        type: "primary",
                        name: "新 增",
                    },
                ],
            },
            formInitData: {},
            // 添加课程
            button: (val) => {
                switch (val.text) {
                    case "新 增":
                        router.push({
                            path: "/courseCardManagementz/add",
                        });
                        break;
                    case "查 询":
                        TableList.value.update({ ...val.value });
                        break;
                    default:
                        break;
                }
            },
            getList: courseCardManagementList,
            column: [
                { prop: "id", label: "ID", width: "80" },
                { prop: "name", label: "名称", width: 220 },
                {
                    prop: "type",
                    label: "类型",
                    html: (row, val) => {
                        if (val == "1") return "次卡";
                        else if (val == "2") return "期限卡";
                    },
                },
                {
                    prop: "generalType",
                    label: "通用类型",
                    html: (row, val) => {
                        if (val == "1") return "全国通";
                        else if (val == "2") return "城市通";
                        else if (val == "3") return "单店";
                        else if (val == "4") return "通店";
                    },
                },
                { prop: "maxBind", label: "可绑定会员数" },
                { prop: "weight", label: "权重" },
                {
                    prop: "courseType",
                    label: "可上课类型",
                    html: (row, val) => {
                        if (val == "1") return "团课";
                        else if (val == "2") return "私教课";
                    },
                },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => {
                        if (val == "1") return "启用";
                        else if (val == "0")
                            return `<span style="color:red"}">禁用</span>`;
                    },
                },
                { prop: "operatorName", label: "创建人" },
                { prop: "createdAt", label: "创建时间", width: 200 },
                {
                    prop: "action",
                    label: "操作",
                    width: 200,
                    actives: [
                        {
                            name: "编辑",
                            method: (val) => {
                                router.push({
                                    path: "/courseCardManagementz/add",
                                    query: { id: val.id },
                                });
                            },
                        },
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/courseCardManagementz/detail",
                                    query: {
                                        id: val.id,
                                        type: val.type,
                                        generalType: val.generalType,
                                    },
                                });
                            },
                        },
                        {
                            name: (e) => (e.status === 1 ? "禁用" : ""),
                            method: (val) =>
                                statusCourseCardManagement({
                                    id: val.id,
                                    status: 0,
                                }).then(({ code }) => {
                                    if (code === 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update();
                                    }
                                }),
                        },
                        {
                            name: (e) => (e.status !== 1 ? "启用" : ""),
                            method: (val) =>
                                statusCourseCardManagement({
                                    id: val.id,
                                    status: 1,
                                }).then(({ code }) => {
                                    if (code === 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update();
                                    }
                                }),
                        },
                        {
                            name: "删除",
                            method: (val) =>
                                deleteItem(
                                    val,
                                    deleteCourseCardManagement,
                                    TableList
                                ),
                        },
                    ],
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
