<!--
 * @Author: 刘帝君
 * @Date: 2022-01-13 14:16:15
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-17 11:04:51
 * @Descripttion: 使用记录
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
import { usingRecordList } from "@/api/hall";
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
                    code: "keyword",
                    label: "场馆名称",
                    placeholder: "请输入场馆名称",
                },
                {
                    code: "keyword",
                    label: "备注",
                    placeholder: "请输入备注",
                },
                {
                    el: "select",
                    label: "类型",
                    code: "type",
                    list: [
                        { value: "10", label: "购卡" },
                        { value: "20", label: "约课" },
                        { value: "-20", label: "取消约课" },
                        { value: "30", label: "转卡" },
                        { value: "40", label: "权益调整" },
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
                ],
            },
            formInitData: {},
            // 添加课程
            button: (val) => {
                switch (val.text) {
                    case "查 询":
                        TableList.value.update({ ...val.value });
                        break;
                    default:
                        break;
                }
            },
            getList: usingRecordList,
            column: [
                { prop: "hallName", label: "场馆", width: "80" },
                // { prop: "id", label: "课程id", width: 220 },
                // {
                //     prop: "paper",
                //     label: "课程名称",
                // },
                { prop: "amount", label: "数量" },
                { prop: "balance", label: "剩余次数/天数" },
                {
                    prop: "type",
                    label: "类型",
                    html: (row, val) => {
                        if (val == "10") return "购卡";
                        else if (val == "20") return "约课";
                        else if (val == "-20") return "取消约课";
                        else if (val == "30") return "转卡";
                        else if (val == "40") return "权益调整";
                    },
                },
                { prop: "remark", label: "备注" },
                { prop: "operatorName", label: "操作人" },
                { prop: "createdAt", label: "时间" },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => {
                        if (val == "0") return "启用";
                        else if (val == "1")
                            return `<span style="color:red"}">禁用</span>`;
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
