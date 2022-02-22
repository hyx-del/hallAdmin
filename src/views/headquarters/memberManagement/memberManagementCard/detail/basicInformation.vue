<!--
 * @Author: 刘帝君
 * @Date: 2022-01-13 14:14:19
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-17 11:34:40
 * @Descripttion: 基本信息
-->
<template>
    <div>
        <formList
            :config="searchConfig"
            :buttons="buttons"
            :itemList="searchList"
            :formInitData="searchData"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import { reactive, toRefs, onMounted } from "vue";
import { addFormConfig } from "@/utils/config";
import { useRoute, useRouter } from "vue-router";
import { courseCardStatus, getListHtml } from "@/utils/enum/select";
import { hallSalesList } from "@/api/hall";
import { memberCourseCardsDetail } from "@/api/membershipCourseCard";
export default {
    components: {
        formList,
    },
    setup() {
        const router = useRouter();
        const state = reactive({
            searchData: {},
            // 配置
            searchConfig: {
                ...addFormConfig,
                default: {
                    disabled: true,
                },
            },
            // 按钮
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.go(-1);
                    },
                },
            ],
            searchList: [
                {
                    label: "卡名",
                    code: "courseCardName",
                },
                {
                    label: "卡号",
                    code: "cardNo",
                },
                {
                    el: "select",
                    label: "类型",
                    code: "type",
                    list: [
                        { value: 1, label: "次卡" },
                        { value: 2, label: "期限卡" },
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
                    label: "会员",
                    code: "memberName",
                },
                {
                    label: "昵称",
                    code: "memberNickName",
                },
                {
                    label: "销售员",
                    code: "salesmanName",
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: [
                        { value: "10", label: "正常" },
                        { value: "-10", label: "停卡" },
                        { value: "-20", label: "关卡" },
                        { value: "30", label: "转卡" },
                        { value: "-30", label: "请假" },
                    ],
                },
                {
                    label: "原价",
                    code: "price",
                },
                {
                    label: "原始数量",
                    code: "originalAmount",
                },
                {
                    label: "单价",
                    code: "unitPrice",
                },
                {
                    label: "剩余价值",
                    code: "surplusValue",
                },
                {
                    label: "有效期",
                    code: "Date",
                },
                {
                    label: "咨询方式",
                    code: "consultMode",
                },
                {
                    label: "老赠品",
                    code: "giftOld",
                },
                {
                    label: "新赠品",
                    code: "gift",
                },
                {
                    label: "开卡人",
                    code: "cardIssuerName",
                },
                {
                    label: "备注",
                    code: "remark",
                },
            ],
        });
        onMounted(() => {
            memberCourseCardsDetail({ id: useRoute().query.id }).then(
                ({ code, data }) => {
                    console.log(data, "详情数据");
                    if (code == 200) {
                        data.giftId ? (data.giftOld = data.gift) : "";
                        state.searchData = data;
                        state.searchData.Date =
                            state.searchData.startDate +
                            "-" +
                            state.searchData.endDate;
                    }
                }
            );
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
