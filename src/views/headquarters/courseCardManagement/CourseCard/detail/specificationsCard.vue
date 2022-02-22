<!--
 * @Author: 刘帝君
 * @Date: 2022-01-21 10:23:20
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-26 17:29:59
 * @Descripttion: 
-->
<template>
    <div>
        <div class="title">
            <formList
                :config="config"
                :itemList="itemList"
                :formInitData="formInitData"
                @buttonClick="button"
            />
        </div>
        <div class="table">
            <Table
                ref="TableList"
                :loadData="getList"
                :column="column"
                :params="formInitData"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </div>
        <el-dialog v-model="dialogVisible" :title="title" width="40%">
            <formList
                :config="addFormConfig"
                :itemList="itemListDialog"
                :formInitData="formInitDataDialog"
                @buttonClick="buttonDialog"
            >
            </formList>
        </el-dialog>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed, onMounted } from "vue";
import {
    specificationsAPI,
    specificationsAddAPI,
    specificationsDetailAPI,
    specificationsDeleteAPI,
    specificationsStateAPI,
} from "@/api/courseCardManagement";
import { addFormConfig } from "@/utils/config";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import { selectTest } from "@/api/test";
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const dialogVisible = ref(false);
        const TableList = ref(null);
        const state = reactive({
            formInitData: {
                courseCardId: useRoute().query.id,
            },
            formInitDataDialog: {},
            title: "",
            used: null,
            form: {
                discountName: "",
                discountRatio: "",
            },
            selectTests: [],
        });
        // 表单按钮
        const config = {
            allRequired: false, // 是否全部必填
            inline: true, //行内
            colon: "",
            inputStyle: {
                width: "200px",
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                },
                {
                    funType: "add",
                    name: "添加",
                },
            ],
        };
        // 表单状态
        const itemList = [
            {
                el: "select",
                label: "状态",
                code: "status",
                list: [
                    { value: "0", label: "禁用" },
                    { value: "1", label: "启用" },
                ],
            },
            {
                el: "select",
                label: "规格",
                code: "categoryId",
                fun: selectTest,
            },
        ];
        // 表单点击
        const button = (val) => {
            switch (val.text) {
                case "添加":
                    state.title = "新增";
                    state.formInitDataDialog = {
                        amount: "",
                        price: "",
                        categoryId: "",
                    };
                    dialogVisible.value = true;
                    break;
                case "搜索":
                    TableList.value.update({ ...val.value });
                    break;
                default:
                    break;
            }
        };
        // 表格数据
        const getList = computed(() => {
            return specificationsAPI;
        });
        // 表格表头
        const column = reactive([
            { prop: "id", label: "ID" },
            { prop: "amount", label: "天数" },
            { prop: "categoryName", label: "规格类别" },
            { prop: "price", label: "价格" },
            { prop: "operatorName", label: "操作人" },
            {
                prop: "status",
                label: "状态",
                html: (row, val) =>
                    `<span style="color:${val === 0 && "red"}">${
                        val === 1 ? "启用" : "禁用"
                    }</span>`,
            },
            {
                prop: "createdAt",
                label: "创建时间",
            },
            {
                prop: "action",
                label: "操作",
                width: 200,
                actives: [
                    {
                        name: "编辑",
                        method: (val) => {
                            state.title = "编辑";
                            state.formInitDataDialog = JSON.parse(
                                JSON.stringify(val)
                            );
                            dialogVisible.value = true;
                        },
                    },
                    {
                        name: (val) => {
                            if (val.status == 0) {
                                return "启用";
                            }
                        },
                        method: (val) => {
                            specificationsStateAPI({
                                id: val.id,
                                status: val.status == 0 ? 1 : 0,
                            }).then((res) => {
                                const { code } = res;
                                if (code == 200) {
                                    ElMessage.success("操作成功");
                                    TableList.value.update({
                                        ...state.formInitData,
                                    });
                                }
                            });
                        },
                    },
                    {
                        name: (val) => {
                            if (val.status !== 0) {
                                return "禁用";
                            }
                        },
                        method: (val) => {
                            specificationsStateAPI({
                                id: val.id,
                                status: val.status == 0 ? 1 : 0,
                            }).then((res) => {
                                const { code } = res;
                                if (code == 200) {
                                    ElMessage.success("操作成功");
                                    TableList.value.update({
                                        ...state.formInitData,
                                    });
                                }
                            });
                        },
                    },
                    {
                        name: "删除",
                        method: (val) => {
                            ElMessageBox.confirm(
                                `确认删除这条数据?`,
                                "确认提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    if (state.used == 1) {
                                        ElMessage.success("已引用不可删除！");
                                    } else {
                                        specificationsDeleteAPI({
                                            id: val.id,
                                        }).then((res) => {
                                            if (res.code == 200) {
                                                ElMessage({
                                                    type: "success",
                                                    message: `操作成功`,
                                                });
                                                TableList.value.update({
                                                    ...state.formInitData,
                                                });
                                            } else {
                                                ElMessage({
                                                    type: "error",
                                                    message: `操作失败`,
                                                });
                                            }
                                        });
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        },
                    },
                ],
            },
        ]);
        const dataDialogs = dataDialog(dialogVisible, TableList, state);

        onMounted(() => {
            selectTest().then((res) => {
                state.selectTests = res.data;
            });
        });
        return {
            ...toRefs(state),
            TableList,
            config,
            button,
            column,
            getList,
            itemList,
            dialogVisible,
            ...dataDialogs,
            addFormConfig,
        };
    },
};

// 表单
const dataDialog = (dialogVisible, TableList, state) => {
    // 表单状态
    const itemListDialog = [
        {
            el: "select",
            label: "规格",
            code: "categoryId",
            fun: selectTest,
        },
        {
            code: "price",
            label: "价格",
            placeholder: "请输入价格",
            suffix: "元",
            maxlength: 8,
            checkType: "numbers",
            lessCode: -1,
        },
    ];
    // 表单点击
    const buttonDialog = (val) => {
        switch (val.text) {
            case "取消":
                dialogVisible.value = false;
                break;
            case "确认":
                if (state.title == "新增") {
                    val.value.courseCardId = state.formInitData.courseCardId;
                    state.selectTests.forEach((e) => {
                        if (e.id == val.value.categoryId) {
                            val.value.amount = e.days;
                        }
                    });
                    console.log(val.value, "val.value");
                    specificationsAddAPI({ ...val.value }).then((res) => {
                        const { code } = res;
                        if (code == 200) {
                            ElMessage.success("操作成功");
                            dialogVisible.value = false;
                            TableList.value.update();
                        }
                    });
                } else {
                    specificationsDetailAPI({ ...val.value }).then((res) => {
                        const { code } = res;
                        if (code == 200) {
                            ElMessage.success("操作成功");
                            dialogVisible.value = false;
                            TableList.value.update();
                        }
                    });
                }
                break;
            default:
                break;
        }
    };

    return {
        itemListDialog,
        buttonDialog,
    };
};
</script>

<style lang="scss" scoped></style>
