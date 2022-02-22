<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:47:58
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-24 11:08:53
 * @Descripttion: 规格类别
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
            :height="140"
            :itemList="[
                { label: '规格类别名称', code: 'name', maxlength: 15 },
                {
                    label: '规格类别天数',
                    code: 'days',
                    minlength: 1,
                    maxlength: 4,
                    type: 'number',
                    checkType: 'number',
                },
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
    getCardSpecificationsCategListAPI,
    // editStatusCourseLabelAPI,
    addCardSpecificationsCategAPI,
    editCardSpecificationsCategAPI,
    delCardSpecificationsCategAPI,
} from "@/api/baseSet";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { courseDisable, courseStatus } from "@/utils/enum/select";

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
                label: "规格类别",
                code: "name",
                placeholder: "请输入规格类别名称",
            },
        ];
        const config = {
            allRequired: false, // 是否全部必填
            inline: true, //行内
            colon: "",
            inputStyle: {
                width: "230px",
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
                        state.dialogTitle = "添加规格类别";
                        state.dialogFormVisible = true;
                        console.log(val, "val");
                    },
                },
            ],
        };
        const state = reactive({
            dialogTitle: "添加规格类别",
            formInitData: {},
            dialogFormVisible: false,
            form: {
                label: "",
            },
            popFun: computed(() =>
                state.dialogTitle == "添加规格类别"
                    ? addCardSpecificationsCategAPI
                    : editCardSpecificationsCategAPI
            ),
        });
        const column = [
            { prop: "name", label: "名称" },
            { prop: "days", label: "天数" },

            {
                prop: "action",
                label: "操作",
                actives: [
                    {
                        perCode: "a0601b",
                        name: (val) => {
                            return "编辑";
                        },
                        method: (val, row) => {
                            state.dialogTitle = "编辑规格类别";
                            state.form = JSON.parse(JSON.stringify(val));
                            state.dialogFormVisible = true;
                        },
                    },
                    // {
                    //     perCode: "a0601d",
                    //     name: (val) => {
                    //         if (val.status == 0) {
                    //             return "启用";
                    //         }
                    //     },
                    //     method: (val) => {
                    //         editStatusCourseLabelAPI({
                    //             id: val.id,
                    //             status: val.status == 0 ? 1 : 0,
                    //         }).then((res) => {
                    //             const { code } = res;
                    //             if (code == 200) {
                    //                 ElMessage.success("操作成功");
                    //                 TableList.value.update({
                    //                     ...state.formInitData,
                    //                 });
                    //             }
                    //         });
                    //     },
                    // },
                    // {
                    //     perCode: "a0601c",
                    //     name: (val) => {
                    //         if (val.status !== 0) {
                    //             return "禁用";
                    //         }
                    //     },
                    //     method: (val) => {
                    //         editStatusCourseLabelAPI({
                    //             id: val.id,
                    //             status: val.status == 0 ? 1 : 0,
                    //         }).then((res) => {
                    //             const { code } = res;
                    //             if (code == 200) {
                    //                 ElMessage.success("操作成功");
                    //                 TableList.value.update({
                    //                     ...state.formInitData,
                    //                 });
                    //             }
                    //         });
                    //     },
                    // },
                    {
                        perCode: "a0601e",
                        name: "删除",
                        method: (val) => {
                            ElMessageBox.confirm(
                                `确认删除: ${val.name}?`,
                                "确认提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning",
                                }
                            )
                                .then(() => {
                                    delCardSpecificationsCategAPI({
                                        ...val,
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
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        },
                    },
                ],
            },
        ];
        const getList = computed(() => {
            return getCardSpecificationsCategListAPI;
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
