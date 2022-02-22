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
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { funList, getListHtml, presaleStatusList } from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    downStatus,
    presellactivityList,
    presellPresellactivityDelete,
    upStatus,
} from "@/api/presell";
import { deleteItem, messageBox } from "@/utils/tools";

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
                    code: "name",
                    label: "活动名称",
                },
                ///aaaaaaaaaaaa
                // {
                //     el:'timePicker',
                //     code: "name21",
                //     label: "活动名称",
                //     isRange:true,
                //     otherCodeArr: ["start", "end"],
                // },

                // {
                //     el: "file",
                //     code: "name32",
                //     label: "活动名称3",
                //     fileType: ["txt", "pdf", "xls"],
                //     inSlot: {
                //         el: "button",
                //         size: "small",
                //         text: "1231",
                //         click: (val) => [
                //             {
                //                 code: "name32",
                //                 disabled: true,
                //             },
                //         ],
                //     },
                // },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--数据
            searchData: {},
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
                            path: "/presale/add",
                        });
                    },
                },
            ],
            // table表单
            getList: presellactivityList,
            column: [
                {
                    label: "活动名称",
                    prop: "name",
                },
                {
                    label: "创建时间",
                    prop: "createdAt",
                },
                {
                    label: "状态",
                    prop: "status",
                    html: (row, val) => getListHtml(presaleStatusList, val),
                },
                {
                    label: "排序",
                    prop: "orders",
                    html: (row, val) => +val,
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
                            path: "/presale/add",
                        },
                        {
                            // 权限
                            // perCode:'',
                            name: "查看",
                            path: "/presale/detail",
                        },
                        {
                            // 上下线
                            perCode: (row) => (row.status ? "aaa" : "bbb"),
                            name: (row) => (row.status ? "下线" : "上线"),
                            method: (row) => {
                                messageBox(
                                    row,
                                    row.status ? downStatus : upStatus,
                                    TableList,
                                    {
                                        title: `是否${
                                            row.status ? "下线" : "上线"
                                        }`,
                                    }
                                );
                            },
                        },
                        {
                            // 权限
                            // perCode:'',
                            name: "删除",
                            method: (row) => {
                                deleteItem(
                                    row,
                                    presellPresellactivityDelete,
                                    TableList
                                );
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

<style lang="scss" scoped></style>
