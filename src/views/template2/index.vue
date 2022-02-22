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
import {funList, getListHtml, testList} from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import {testApi} from "@/api/managerStaff";
import {deleteItem} from '@/utils/tools'
import { ElMessage, ElMessageBox } from "element-plus";

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
                    code: "name",
                    label: "关键词",
                },
                {
                    code: "mobile",
                    label: "手机号",
                    maxlength: 11,
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
            getList: testApi,
            column: [
                { prop: "name", label: "姓名" },
                {
                    prop: "functions",
                    label: "职能",
                    html: (row, val) => getListHtml(funList, val),
                },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 220,
                    actives: [
                        {
                            // 权限
                            // perCode:'',
                            name: "编辑",
                            method: (row) => {
                                state.popShow = true;
                                state.showState = 2;
                                state.popFormInitData = row;
                            },
                        },
                        {
                            // 权限
                            // perCode:'',
                            name: "查看",
                            method: (row) => {
                                state.popShow = true;
                                state.showState = 3;
                                state.popFormInitData = row;
                            },
                        },
                        {
                            // 权限
                            // perCode:'',
                            name: "删除",
                            method: (row) => {
                                // deleteItem(row, staffRemoveStaffDelete, TableList, {
                                //   params: { staffId: row.id }
                                // })
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
                        state.popShow = false;
                        TableList.value.update();
                    },
                },
            ],
            popItemList: [
                {
                    code: "name",
                    label: "员工",
                },
                {
                    code: "mobile",
                    label: "手机号",
                    maxlength: 11,
                    checkType: "",
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
