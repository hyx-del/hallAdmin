<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-14 16:45:12
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-14 16:45:12
 * @Descripttion:
-->
<template>
    <div >
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
import { toRefs, ref, reactive,  } from "vue";
import {  useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import {  transferHistoryList } from "@/api/membershipCourseCard";

// template
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const type = ['转卡类', '转会员', '转场馆']
        const {id}=useRoute().query
        const TableList = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [


            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--数据
            searchData: {
                memberCourseCardId:id,
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({...value,memberCourseCardId: id});
                    },
                }
            ],
            // table表单
            getList: transferHistoryList,
            column: [
                { prop: "oldSalesmanName", label: "原会籍" },
                {
                    prop: "newSalesmanName",
                    label: "更换会籍",
                },
                {
                    prop: "operatorName",
                    label: "操作人",
                },
                {
                    prop: "createdAt",
                    label: "操作时间",
                },

            ],
        });
        return {
            ...toRefs(state),
            TableList,type
        };
    },
};
</script>

<style lang="scss" scoped></style>
