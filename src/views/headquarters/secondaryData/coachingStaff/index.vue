<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:41:10
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-13 10:14:17
 * @Descripttion: 教练组
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
            :height="130"
            :itemList="[
                { label: '名称', code: 'name', maxlength: 15 },
                {
                    label: '等级',
                    code: 'grade',
                    type: 'number',
                    maxlength: 4,
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
    getStudyGoalListAPI,
    addStudyGoalAPI,
    editStudyGoalAPI,
    deleteCoachingStaffAPI,
} from "@/api/baseSet";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { enableList, enableStatus } from "@/utils/enum/select";

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
                label: "名称",
                code: "name",
                placeholder: "请输入名称",
            },
            {
                label: "等级",
                code: "grade",
                type: "number",
                placeholder: "请输入等级",
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
                        console.log(val, "val");
                        TableList.value.update({ ...val.value });
                    },
                },
                {
                    name: "新 增",
                    click: (val) => {
                        state.dialogTitle = "添加教练组";
                        state.dialogFormVisible = true;
                        console.log(val, "val");
                    },
                },
            ],
        };
        const state = reactive({
            dialogTitle: "添加教练组",
            formInitData: {},
            dialogFormVisible: false,
            form: {
                label: "",
            },
            popFun: computed(() =>
                state.dialogTitle == "添加教练组"
                    ? addStudyGoalAPI
                    : editStudyGoalAPI
            ),
        });
        const column = [
            { prop: "id", label: "ID" },
            { prop: "name", label: "名称" },
            { prop: "grade", label: "等级" },
            {
                prop: "action",
                label: "操作",
                actives: [
                    {
                        name: (val) => {
                            return "编辑";
                        },
                        method: (val, row) => {
                            state.dialogTitle = "编辑教练组";
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
                                    deleteCoachingStaffAPI(val.id).then(
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
                ],
            },
        ];
        const getList = computed(() => {
            return getStudyGoalListAPI;
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
