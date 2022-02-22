<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 15:13:28
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-19 17:06:37
 * @Description: 会员-会员管理
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
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { birthdayTypeList, genderList, getListHtml } from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { memberList } from "@/api/member";
// template
export default {
    components: {
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
                    code: "keyword",
                },
                {
                    el: "select",
                    label: "性别",
                    code: "gender",
                    list: genderList,
                },
                {
                    el: "select",
                    label: "生日",
                    code: "birthdayType",
                    list: birthdayTypeList,
                },
                {
                    el: "date",
                    label: "注册时间",
                    code: "date",
                    type: "datetimerange",
                    otherCodeArr: ["registerStartAt", "registerEndAt"],
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
            getList: memberList,
            column: [
                {
                    label: "姓名",
                    prop: "name",
                    width: 110,
                },
                {
                    label: "昵称",
                    prop: "nickname",
                    width: 110,
                },
                {
                    label: "邮箱",
                    prop: "email",
                },
                {
                    label: "性别",
                    prop: "gender",
                    html: (row, val) => getListHtml(genderList, val),
                    width: 60,
                },
                {
                    label: "手机号",
                    prop: "contact",
                    width: 120,
                },
                {
                    label: "生日",
                    prop: "birthday",
                    width: 100,
                },
                {
                    width: "200",
                    label: "注册时间",
                    prop: "createdAt",
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
                                    path: "/membersViph/operation",
                                    query: { id: val.id, type: "details" },
                                });
                            },
                        },
                        {
                            name: "编辑",
                            method: (val) => {
                                router.push({
                                    path: "/membersViph/operation",
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
