<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:42:12
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-24 10:48:27
 * @Descripttion: 体测项目
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
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </div>
        <popupForm
            v-model:show="dialogFormVisible"
            v-model:formInitData="form"
            :title="dialogTitle"
            :height="200"
            :itemList="[
                { label: '项目名称', code: 'name', maxlength: 20 },
                { label: '项目英文名', code: 'nameEn', maxlength: 20 },
                { label: '单位', code: 'unit', required: false, maxlength: 10 },
            ]"
            :fun="popFun"
            :tabelRef="TableList"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    sideProjectListAPI,
    addSideProjectAPI,
    editSideProjectAPI,
    deleteSideProjectAPI,
    statusSideProjectAPI,
} from "@/api/baseSet";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { enableDisable, enableStatus } from "@/utils/enum/select";

export default {
    components: {
        formList,
        popupForm,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null); // this.$refs.TableList
        const queryList = [
            {
                label: "项目名称",
                code: "name",
                placeholder: "请输入项目名称",
            },
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
                        state.dialogTitle = "添加体测项目";
                        state.dialogFormVisible = true;
                        console.log(val, "val");
                    },
                },
            ],
        };
        const state = reactive({
            dialogTitle: "添加体测项目",
            formInitData: {},
            dialogFormVisible: false,
            form: {
                label: "",
            },
            popFun: computed(() =>
                state.dialogTitle == "添加体测项目"
                    ? addSideProjectAPI
                    : editSideProjectAPI
            ),
        });
        const column = [
            { prop: "name", label: "项目名称" },
            { prop: "nameEn", label: "项目英文名" },
            { prop: "unit", label: "单位" },
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
            { prop: "createdAt", label: "创建时间" },
            { prop: "createdName", label: "创建人" },
            { prop: "updatedName", label: "最后修改人" },
            {
                prop: "action",
                label: "操作",
                actives: [
                    {
                        name: (val) => {
                            return "编辑";
                        },
                        method: (val, row) => {
                            state.dialogTitle = "编辑体测项目";
                            state.form = JSON.parse(JSON.stringify(val));
                            state.dialogFormVisible = true;
                        },
                    },
                    {
                        name: "删除",
                        method: (val) => {
                            ElMessageBox.confirm(
                                `确认删除${val.name}?`,
                                "确认提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    deleteSideProjectAPI({ id: val.id }).then(
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
                            statusSideProjectAPI({
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
                            statusSideProjectAPI({
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
        ];
        const getList = computed(() => {
            return sideProjectListAPI;
        });
        const buttonCallBack = (val) => {};

        return {
            ...toRefs(state),
            queryList,
            config,
            column,
            getList,
            buttonCallBack,
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped></style>
