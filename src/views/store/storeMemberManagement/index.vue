<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 14:01:21
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-26 15:07:34
 * @Description: 门店-会员管理
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
            :select="selectArr"
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

        <!-- 批量修改销售 -->

        <popupForm
            v-model:show="dialogFormVisible"
            v-model:formInitData="form"
            title="修改销售"
            :itemList="salesList"
            :formConfig="popFormConfig"
            :buttons="salesButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
    birthdayTypeList,
    genderList,
    getListHtml,
    hallStateList,
    hallTypeList,
    testList,
} from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import {
    memberSourcePost,
    sourceList,
    bulkChangesSalesAPI,
} from "@/api/memberSource";
import { ElMessage } from "element-plus";
import { memberList } from "@/api/hallMember";
import { hallMemberStatusPut, hallSalesList } from "@/api/hall";
import { getSelectHallListAPI } from "@/api/common";
import store from "@/store";
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
                    label: "姓名",
                    code: "name",
                },

                {
                    label: "联系方式",
                    code: "contact",
                },
                {
                    el: "select",
                    code: "hallId",
                    label: "场馆",
                    multiple: false, // 多选
                    filterable: true, // 可搜索
                    remote: true, // 可接收
                    reserveKeyword: true, //保留搜索关键词
                    remoteMethod: (keyword) => ({ name: keyword }),
                    fun: getSelectHallListAPI,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            value: v.id,
                            label: `${v.name}`,
                        })),
                    tips: "输入搜索，下拉选中",
                    required: false,
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
                    label: "入会来源",
                    code: "sourceId",
                    fun: sourceList,
                    funMode: (res) =>
                        res.data.records.map((v) => ({
                            label: v.name,
                            value: v.id,
                        })),
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
                    name: "新增",
                    click: () => {
                        router.push({
                            path: "/memberManagementz/add",
                            query: { hallId: store.getters.activeHallId },
                        });
                    },
                },
                {
                    funType: "confirm",
                    name: "批量修改销售",
                    click: ({ value }) => {
                        if (state.bulkChanges.length !== 0) {
                            console.log(value, "value");
                            state.dialogFormVisible = true;
                        } else {
                            ElMessage.warning("请选择要修改的数据！");
                        }
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {},
            // 批量修改
            form: {
                salemanId: "",
            },
            dialogFormVisible: false,
            bulkChanges: [],
            selectArr: (val) => {
                console.log(val, "val");
                let arrData = [];
                val.forEach((e) => {
                    arrData.push(e.id);
                });
                state.bulkChanges = arrData;
            },
            salesList: [
                {
                    el: "select",
                    label: "销售员",
                    code: "salemanId",
                    fun: hallSalesList,
                },
            ],
            salesButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.dialogFormVisible = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        console.log("确定", value);
                        let objData = {
                            salemanId: value.salemanId * 1,
                            memberIds: state.bulkChanges,
                        };

                        bulkChangesSalesAPI({ ...objData }).then(
                            ({ code, data }) => {
                                if (code == 200) {
                                    TableList.value.update();
                                    state.dialogFormVisible = false;
                                    ElMessage.success("保存成功！");
                                }
                            }
                        );
                    },
                },
            ],
            // table表单
            getList: memberList,
            column: [
                {
                    label: "所属场馆",
                    prop: "hallName",
                    width: 110,
                },
                {
                    label: "姓名",
                    prop: "name",
                    width: 110,
                },
                {
                    label: "昵称",
                    prop: "nickname",
                },
                {
                    label: "性别",
                    prop: "gender",
                    html: (row, val) => getListHtml(genderList, val),
                    width: 60,
                },
                {
                    label: "联系方式",
                    prop: "contact",
                    width: 120,
                },
                {
                    label: "生日",
                    prop: "birthday",
                    width: 100,
                },
                {
                    label: "入会来源",
                    prop: "sourceName",
                    width: 150,
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
                    label: "开卡状态",
                    prop: "statusName",
                },
                {
                    label: "会员状态",
                    prop: "memberStatus",
                    html: ({ memberStatus }) =>
                        memberStatus === 1 ? "正常" : "禁用",
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
                {
                    prop: "action",
                    label: "操作",
                    width: 160,
                    actives: [
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/storeMemberManagementm/details",
                                    query: { id: val.id },
                                });
                            },
                        },
                        // {
                        //     name: "编辑",
                        //     method: (val) => {
                        //         router.push({
                        //             path: "/storeMemberManagementm/details",
                        //             query: { id: val.id },
                        //         });
                        //     },
                        // },
                        {
                            name: ({ memberStatus }) =>
                                memberStatus === 1 ? "禁用" : "启用",
                            method: ({ id, memberStatus }) => {
                                hallMemberStatusPut({
                                    id,
                                    status: memberStatus === -1 ? 1 : -1,
                                }).then(({ code, msg }) => {
                                    if (code === 200) {
                                        ElMessage.success(
                                            `${
                                                memberStatus === -1
                                                    ? "启用"
                                                    : "禁用"
                                            }成功`
                                        );
                                        TableList.value.update();
                                    } else {
                                        ElMessage.error(msg || "操作失败");
                                    }
                                });
                            },
                        },
                    ],
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
