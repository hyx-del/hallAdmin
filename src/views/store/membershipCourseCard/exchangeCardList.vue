<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-14 16:45:12
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-14 16:45:12
 * @Descripttion: 兑换卡弹出列表
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
import { toRefs, ref, reactive, watchEffect } from "vue";
import { tabelFormConfig } from "@/utils/config";
import {redemptionCodeList } from "@/api/membershipCourseCard";

// template
export default {
    components: {
        formList,
        Table,
    },
    props:{
        id: {
            type: [String,Number],
            default: "",
        },
    },
    setup(props) {
        const TableList = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    code: "redeemCode",
                    label: "兑换码",
                },
                {
                    el: "select",
                    code: "status",
                    label: "兑换状态",
                    list: [
                        {value:6,label:"已兑换"},
                        {value:4,label:"未兑换"},
                    ],
                },

            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--数据
            searchData: {
                id:props.id
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({...value,id: props.id});
                    },
                }
            ],
            // table表单
            getList: redemptionCodeList,
            column: [
                { prop: "batch_number", label: "批号" },
                {
                    prop: "redeemCode",
                    label: "兑换码",
                },
                {
                    prop: "exchangeableAmount",
                    label: "可兑换优惠券数量",
                },
                {
                    prop: "redeemedAmount",
                    label: "已兑券数量",
                },
                {
                    prop: "status",
                    label: "兑换状态",
                    html:(val)=>val.status==4?"未兑换":"已兑换",
                },

            ],
        });
        watchEffect(()=>{
            state.searchData.id= props.id
        })

        return {
            ...toRefs(state),
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped></style>
