<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-14 16:45:12
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-28 17:38:36
 * @Descripttion:
-->
<template>
    <div>
        <formList
            :config="searchConfig"
            :itemList="searchList"
            :formInitData="searchData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="searchData"
            :showSortIndex="{ show: true, lable: '序号' }"
        >
        </Table>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import { courseCardUsageRecordList } from "@/api/membershipCourseCard";

// template
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const { id } = useRoute().query;
        const TableList = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    el: "select",
                    code: "type",
                    label: "状态",
                    list: [
                        { value: 10, label: "购卡" },
                        { value: 20, label: "约课" },
                        { value: -20, label: "取消约课" },
                        { value: 30, label: "转卡" },
                        { value: 40, label: "权益调整" },
                    ],
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--数据
            searchData: {
                memberCourseCardId: id,
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({
                            ...value,
                            memberCourseCardId: id,
                        });
                    },
                },
            ],
            // table表单
            getList: courseCardUsageRecordList,
            column: [
                { prop: "hallName", label: "单价" },
                {
                    prop: "c",
                    label: "余额",
                },
                {
                    prop: "c",
                    label: "剩余价值",
                },
                {
                    prop: "operatorName",
                    label: "操作人",
                },
                {
                    prop: "status",
                    label: "状态",
                    html: (val) => {
                        let htmlStr = "";
                        switch (true) {
                            case val.type == 10:
                                htmlStr = `<span>购卡</span>`;
                                break;
                            case val.type == 20:
                                htmlStr = `<span>约课</span>`;
                                break;
                            case val.type == -20:
                                htmlStr = `<span>取消约课</span>`;
                                break;
                            case val.type == 30:
                                htmlStr = `<span>转卡</span>`;
                                break;
                            case val.type == 40:
                                htmlStr = `<span>权益调整</span>`;
                                break;
                            default:
                                break;
                        }
                        return htmlStr;
                    },
                },
                {
                    prop: "amount",
                    label: "审核人",
                },
                {
                    prop: "balance",
                    label: "修改时间",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 120,
                    actives: [
                        {
                            name: "取消调整",
                            method: () => {},
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

<style lang="scss" scoped></style>
