<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:43:50
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-26 13:43:48
 * @Descripttion: 支付方式
-->
<template>
    <div>
        <div class="title">
            <formList
                :config="config"
                :itemList="queryList"
                :formInitData="formInitData"
                @buttonClick="buttonCallBack"
            />
        </div>
        <div class="table">
            <Table
                ref="TableList"
                :loadData="getList"
                :column="column"
                :params="formInitData"
            />
        </div>
        <popupForm
            v-model:show="dialogFormVisible"
            v-model:formInitData="form"
            :title="dialogTitle"
            :itemList="[{ label: '名称', code: 'name', maxlength: 30 }]"
            :fun="popFun"
            :height="100"
            :tabelRef="TableList"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    payMannerListAPI,
    addPayMannerAPI,
    editPayMannerAPI,
    deletePayMannerAPI,
    statusPayMannerAPI,
} from "@/api/baseSet";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { enableDisable, enableStatus } from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm";

export default {
    components: {
        formList,
        Table,
        popupForm,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const queryList = [
            {
                el: "select",
                label: "状态",
                code: "status",
                list: [...enableDisable],
            },
        ];
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
                    name: "查 询",
                    click: (val) => {
                        TableList.value.update({ ...val.value });
                        console.log(val, "val");
                    },
                },
                {
                    name: "新 增",
                    click: (val) => {
                        state.dialogTitle = "添加支付方式";
                        state.dialogFormVisible = true;
                        console.log(val, "val");
                    },
                },
            ],
        };

        const state = reactive({
            dialogTitle: "添加支付方式",
            formInitData: {},
            dialogFormVisible: false,
            form: {
                label: "",
            },
            popFun: computed(() =>
                state.dialogTitle == "添加支付方式"
                    ? addPayMannerAPI
                    : editPayMannerAPI
            ),
            column: [
                { prop: "name", label: "名称" },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => {
                        if (enableStatus[val]) {
                            return `<span style='color:${
                                enableStatus[val].color
                            }'>${enableStatus[val].label || ""}</span>`;
                        } else {
                            ("");
                        }
                    },
                },
                {
                    prop: "action",
                    label: "操作",
                    actives: [
                        {
                            name: (val) => {
                                return "编辑";
                            },
                            method: (val, row) => {
                                state.dialogTitle = "编辑支付方式";
                                state.form = JSON.parse(JSON.stringify(val));
                                state.dialogFormVisible = true;
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
                                        deletePayMannerAPI({ id: val.id }).then(
                                            (res) => {
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
                                            }
                                        );
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            },
                        },
                        {
                            name: (val) => {
                                if (val.status == 0) {
                                    return "启用";
                                }
                            },
                            method: (val) => {
                                statusPayMannerAPI({
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
                                statusPayMannerAPI({
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
                    ],
                },
            ],
        });

        const getList = computed(() => {
            return payMannerListAPI;
        });

        const buttonCallBack = (val) => {};

        return {
            ...toRefs(state),
            queryList,
            config,
            getList,
            buttonCallBack,
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped></style>
