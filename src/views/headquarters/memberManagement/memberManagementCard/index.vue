<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:26:58
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-20 15:38:47
 * @Description: 会员课程卡
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
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { courseCardStatus, getListHtml } from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { memberSourcePost } from "@/api/memberSource";
import { ElMessage } from "element-plus";
import { hallUserCourseList, hallSalesList } from "@/api/hall";
import { selectTest } from "@/api/test";
// template
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
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "关键字",
                    code: "cardNo",
                },
                {
                    el: "date",
                    code: "endDate",
                    type: "date",
                    label: "失效日期",
                    // maxDate: new Date(),
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: courseCardStatus,
                },
                {
                    el: "select",
                    label: "销售员",
                    code: "salesmanId",
                    fun: hallSalesList,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        })),
                },
                {
                    el: "select",
                    label: "规格",
                    code: "courseCardSpecCategoryId",
                    fun: selectTest,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        })),
                },
                {
                    el: "select",
                    label: "课程卡类型",
                    code: "type",
                    list: [
                        { label: "次卡", value: 1 },
                        { label: "期限卡", value: 2 },
                    ],
                },
                {
                    el: "select",
                    label: "上课类型",
                    code: "courseType",
                    list: [
                        { label: "团课", value: 1 },
                        { label: "私教课", value: 2 },
                    ],
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
            searchData: {},
            // table表单
            getList: hallUserCourseList,
            column: [
                {
                    label: "课程卡名",
                    prop: "courseCardName",
                },
                {
                    label: "卡号",
                    prop: "cardNo",
                    width: 110,
                },
                {
                    label: "绑定会员",
                    prop: "memberName",
                    width: 120,
                },
                {
                    label: "手机号",
                    prop: "phone",
                    width: 120,
                },
                {
                    label: "销售员",
                    prop: "salesmanName",
                },
                {
                    label: "会员类型",
                    prop: "memberType",
                    html: ({ memberType }) =>
                        memberType === 1 ? "个人" : "企业",
                },
                {
                    label: "生效时间",
                    prop: "startDate",
                    width: 180,
                },
                {
                    label: "失效时间",
                    prop: "endDate",
                    width: 180,
                },
                {
                    label: "余额次数",
                    prop: "balance",
                    html: ({ type, balance }) =>
                        `${balance}${type === 1 ? "次" : "天"}`,
                },
                {
                    label: "状态",
                    prop: "status",
                    html: (row, val) => getListHtml(courseCardStatus, val),
                },
                {
                    label: "最近上课日期",
                    prop: "lastUseTime",
                    width: 180,
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 160,
                    actives: [
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/memberManagementz/memberManagementCardDetail",
                                    query: { id: val.id },
                                });
                            },
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
.find {
    margin-left: 10px;
    cursor: pointer;
    color: #2e8de6;
}
</style>
