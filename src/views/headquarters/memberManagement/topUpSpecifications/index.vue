<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:25:55
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-14 09:30:06
 * @Descripttion: 充值规格
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
                {
                    label: '充值金额',
                    code: 'amount',
                    checkType: 'numberPoint2',
                    maxlength: 8, //最大长度
                    minlength: 1, // 最小长度
                },
                {
                    label: '打折率',
                    code: 'discountRate',
                    checkType: 'numberPoint2',
                    lessCode: 0,
                    maxCode: 1,
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
    getRegCliqueListAPI,
    changeStateItemAPI,
    addRegCliqueAPI,
    editRegCliqueAPI,
    deleteItemAPI,
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
                el: "select",
                label: "状态",
                code: "status",
                list: [
                    { value: "1", label: "有效" },
                    { value: "0", label: "无效", color: "#f00" },
                ],
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
                },
                {
                    funType: "add",
                    name: "新 增",
                },
            ],
        };
        const state = reactive({
            dialogTitle: "添加充值规格",
            formInitData: {},
            dialogFormVisible: false,
            form: {},
            popFun: computed(() =>
                state.dialogTitle == "添加充值规格"
                    ? addRegCliqueAPI
                    : editRegCliqueAPI
            ),
        });
        const column = [
            { prop: "amount", label: "充值金额" },
            { prop: "discountRate", label: "折扣率" },
            {
                prop: "status",
                label: "状态",
                html: (row, val) => {
                    if (val == "1") return "有效";
                    else if (val == "0") return "无效";
                },
            },
            { prop: "createdAt", label: "创建时间" },
            {
                prop: "action",
                label: "操作",
                actives: [
                    {
                        name: (val) => {
                            return "编辑";
                        },
                        method: (val, row) => {
                            state.dialogTitle = "编辑充值规格";
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
                                    console.log(val, "val");
                                    deleteItemAPI(val.id).then((res) => {
                                        if (res.code == 200) {
                                            ElMessage({
                                                type: "success",
                                                message: `操作成功`,
                                            });
                                            TableList.value.update();
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
            return getRegCliqueListAPI;
        });
        const buttonCallBack = (val) => {
            if (val.name == "add") {
                // 弹窗 todo
                state.dialogTitle = "添加充值规格";
                state.dialogFormVisible = true;
            } else if (val.name == "confirm") {
                if (val.value) {
                    TableList.value.update({ ...val.value });
                }
            }
        };

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
