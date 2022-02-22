<!--
 * @Author: 刘帝君
 * @Date: 2021-12-20 11:52:12
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-26 14:40:01
 * @Descripttion: 课程管理卡/合同管理
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
import { contractListAPI, contractStatusAPI } from "@/api/contractManagement";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
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
                    code: "contractName",
                    label: "名称",
                    placeholder: "请输入名称",
                },
                {
                    el: "select",
                    label: "合同类型",
                    code: "paper",
                    list: [
                        { value: "1", label: "纸子合同" },
                        { value: "2", label: "电子合同" },
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
                            path: "/courseCardManagementz/ContractManagementAdd",
                        });
                        break;
                    case "查 询":
                        TableList.value.update({ ...val.value });
                        break;
                    default:
                        break;
                }
            },
            getList: contractListAPI,
            column: [
                { prop: "id", label: "合同ID", width: "80" },
                { prop: "title", label: "合同名称", width: 220 },
                {
                    prop: "paper",
                    label: "合同类型",
                    html: (row, val) => {
                        if (val == "1") return "纸质合同";
                        else if (val == "2") return "电子合同";
                    },
                },
                { prop: "operatorName", label: "创建人" },
                { prop: "remark", label: "备注" },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => {
                        if (val == "1") return "启用";
                        else if (val == "0")
                            return `<span style="color:red"}">禁用</span>`;
                    },
                },
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
                                    path: "/courseCardManagementz/ContractManagementAdd",
                                    query: { id: val.id },
                                });
                            },
                        },
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/courseCardManagementz/ContractManagementDetail",
                                    query: { id: val.id },
                                });
                            },
                        },
                        {
                            name: (e) => (e.status === 0 ? "启用" : ""),
                            method: (val) =>
                                contractStatusAPI({
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
                            name: (e) => (e.status !== 0 ? "禁用" : ""),
                            method: (val) =>
                                contractStatusAPI({
                                    id: val.id,
                                    status: 0,
                                }).then(({ code }) => {
                                    if (code === 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update();
                                    }
                                }),
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
