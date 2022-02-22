<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:23:47
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-13 16:18:35
 * @Description: 总部客服
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
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            :title="popTitle"
            :itemList="popItemList"
            :formConfig="popFormConfig"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    birthdayTypeList,
    genderList,
    getListHtml,
    hallStateList,
    hallTypeList,
    testList,
} from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { memberSourcePost } from "@/api/memberSource";
import { memberList } from "@/api/hallMember";
import { hallSalesList } from "@/api/hall";
import { getSelectHallListAPI } from "@/api/common";
// template
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const TableList = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "姓名",
                    code: "name",
                },

                {
                    label: "联系方式",
                    code: "contact",
                },
                {
                    el: "select",
                    label: "场馆",
                    code: "hallId",
                    fun: getSelectHallListAPI,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id,
                        })),
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
                    label: "会员状态",
                    code: "status",
                    list: [
                        {
                            label: "潜在会员",
                            value: "10",
                        },
                        {
                            label: "普通会员",
                            value: "20",
                        },
                    ],
                },
                {
                    el: "select",
                    label: "会员类型",
                    code: "type",
                    list: hallTypeList,
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
                {
                    funType: "confirm",
                    name: "导出",
                    click: ({ value }) => {
                        console.log(value);
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {
                sourceId: 45,
            },
            // table表单
            getList: memberList,
            column: [
                {
                    label: "所属场馆",
                    prop: "hallName",
                },
                {
                    label: "姓名",
                    prop: "name",
                },
                {
                    label: "昵称",
                    prop: "nickname",
                },
                {
                    label: "性别",
                    prop: "gender",
                    html: (row, val) => getListHtml(genderList, val),
                },
                {
                    label: "联系方式",
                    prop: "contact",
                },
                {
                    label: "生日",
                    prop: "birthday",
                },
                {
                    label: "入会来源",
                    prop: "sourceName",
                    width: 180,
                },
                {
                    label: "推荐人",
                    prop: "referrerName",
                },
                {
                    label: "销售员",
                    prop: "salesmanName",
                },
                {
                    label: "会员状态",
                    prop: "statusName",
                },
                {
                    label: "会员类型",
                    prop: "typeName",
                },
                {
                    width: "200",
                    label: "注册时间",
                    prop: "createdAt",
                },
            ],
            // 新加编辑弹窗
            popTitle: computed(() => state.showStateObj[state.showState].title),
            buttonConfirm: computed(
                () => state.showStateObj[state.showState].buttonConfirm
            ),
            popFormConfig: {
                default: {
                    disabled: computed(() =>
                        state.showState == 3 ? true : false
                    ),
                },
                buttons: [],
            },
            showState: 1,
            showStateObj: {
                1: {
                    title: "新加",
                    buttonConfirm: "确认",
                },
                2: {
                    title: "编辑",
                    buttonConfirm: "确认",
                },
                3: {
                    title: "查看",
                    buttonConfirm: "",
                },
            },
            popShow: false,
            popFormInitData: {},
            popButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.popShow = false;
                    },
                },
                {
                    show: computed(() => (state.showState != 3 ? true : false)),
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        console.log("value", value);
                        return;

                        state.popShow = false;
                        if (state.showState == 1) {
                            memberSourcePost(value).then(({ code, data }) => {
                                if (code == 200) {
                                    TableList.value.update();
                                }
                            });
                        }
                    },
                },
            ],
            popItemList: [
                {
                    code: "name",
                    label: "来源名称",
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
