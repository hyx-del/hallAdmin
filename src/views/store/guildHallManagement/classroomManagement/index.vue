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
import { useRouter, useRoute } from "vue-router";
import {
    booleanList,
    enableDisable,
    enableStatus,
    funList,
    genderList,
    getListHtml,
    groupLessons,
    privateState,
    testList,
} from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
import {
    addClassroomAPI,
    classroomStatusPut,
    delClassroomAPI,
    editClassroomAPI,
    getClassroomListAPI,
} from "@/api/classroom";
import { deleteItem, messageBox } from "@/utils/tools";
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
                    label: "教室名称",
                    code: "name",
                    placeholder: "请输入教室名称",
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list:enableDisable
                },
                {
                    el: "select",
                    label: "是否可上团课",
                    code: "supportGroup",
                    list:booleanList,
                },
                {
                    el: "select",
                    label: "是否可上私课",
                    code: "supportPrivate",
                    list: booleanList
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
                        state.popShow = true;
                        state.showState = 1;
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {},
            // table表单
            getList: getClassroomListAPI,
            column: [
                { prop: "name", label: "名称" },
                { prop: "maxNumber", label: "可容纳人数" },
                {
                    prop: "supportGroup",
                    label: "是否上团课",
                    html: (row, val) => {
                        return getListHtml(booleanList, val);
                    },
                },
                {
                    prop: "supportPrivate",
                    label: "是否上私教",
                    html: (row, val) => {
                        return getListHtml(booleanList, val);
                    },
                },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => getListHtml(enableDisable, val),
                },
                {
                    prop: "action",
                    label: "操作",
                    width: "200",
                    actives: [
                        {
                            perCode: "a0601b",
                            name: (val) => {
                                return "编辑";
                            },
                            method: (row, val) => {
                                state.showState = 2;
                                state.popShow = true;
                                state.popFormInitData = { ...row };
                            },
                        },
                        {
                            perCode: "a0601b",
                            name: (val) => {
                                return "详情";
                            },
                            method: (row, val) => {
                                state.showState = 3;
                                state.popShow = true;
                                state.popFormInitData = { ...row };
                            },
                        },
                        {
                            perCode: (row) => (row.status ? "aaa" : "bbb"),
                            name: (row) => (row.status ? "禁用" : "启用"),
                            method: (row) => {
                                messageBox(row, classroomStatusPut, TableList, {
                                    title: row.status ? "是否禁用" : "是否启用",
                                    params: {
                                        ...row,
                                        status: row.status ? 1 : 0,
                                    },
                                });
                            },
                        },
                        {
                            perCode: "a0601e",
                            name: "删除",
                            method: (row) => {
                                deleteItem(row, delClassroomAPI, TableList);
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
                        // 新加
                        if (state.showState == 1) {
                            addClassroomAPI(value).then((res) => {
                                state.popShow = false;
                                TableList.value.update();
                            });
                        } else {
                            editClassroomAPI(value).then((res) => {
                                state.popShow = false;
                                TableList.value.update();
                            });
                        }
                    },
                },
            ],
            popItemList: [
                {
                    label: "教室名称",
                    code: "name",
                    valueChange: (v, obj) => {
                        console.log(obj);
                    },
                },
                {
                    label: "容纳人数",
                    code: "maxNumber",
                    type: "number",
                    checkType: "number",
                    maxlength: 6,
                    minCode: 0,
                },
                {
                    el: "radio",
                    label: "可上团课",
                    code: "supportGroup",
                    required: false,
                    default: "1",
                    list: [...booleanList],
                },
                {
                    el: "radio",
                    label: "可上私课",
                    code: "supportPrivate",
                    required: false,
                    default: "1",
                    list: privateState,
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
</style>
