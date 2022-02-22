<!--
 * @Author: 郑晶
 * @Date: 2021-12-27 17:27:33
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-10 16:22:09
 * @Description: 会员详情-会籍更换记录
-->
<template>
    <div>
        <formList
            :config="searchConfig"
            :buttons="buttons"
            :itemList="searchList"
            :formInitData="searchData"
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
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { tabelFormConfig } from "@/utils/config";
import { useRoute } from "vue-router";
import { hallMemberSalesmanChangeLog } from "@/api/hall";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 搜索表格--数据
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "关键词",
                    code: "keyword",
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {
                memberId: id,
            },
            // table表单
            getList: hallMemberSalesmanChangeLog,
            details: {},
            column: [
                {
                    label: "原销售",
                    prop: "oldSalesmanName",
                },
                {
                    label: "原场馆",
                    prop: "oldHallName",
                },
                {
                    label: "转入销售",
                    prop: "newSalesmanName",
                },
                {
                    label: "转入场馆",
                    prop: "newHallName",
                },
                {
                    label: "备注",
                    prop: "remark",
                },
                {
                    label: "操作人",
                    prop: "operatorName",
                },
                {
                    label: "创建时间",
                    prop: "createdAt",
                    width: 180,
                },
            ],
            detailsModal: false,
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
.find {
    margin-left: 10px;
    cursor: pointer;
    color: #2e8de6;
}
</style>
