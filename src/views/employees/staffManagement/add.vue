<!--
 * @Author: zx
 * @Date: 2021-09-02 14:05:19
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 14:18:13
 * @Descripttion:
-->
<template>
    <emptyBox bottom="70">
        <formList
            ref="formListRef"
            :formInitData="formInitData"
            :itemList="itemList"
            @buttonClick="buttonClick"
            :config="config"
            :formState="formState"
            @formChange="formChange"
            :hideList="hideList"
            :showList="showList"
            :buttons="buttons"
        >
            <template #cancelMobile>
                <el-button
                    size="small"
                    class="cancelMobile"
                    @click="cancelMobile"
                >
                    取消
                </el-button>
            </template>
            <template #resetPassword>
                <el-button type="primary" size="small" @click="resetPass">
                    重置密码
                </el-button>
            </template>
        </formList>
    </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑 学期
 *
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, inject, computed } from "vue";
import { disabledArr, itemList } from "./itemList";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom, addFormConfig } from "@/utils/config";
import {
    staffAddStaffPost,
    staffUpdateStaffPost,
    staffGetStaffInfo,
    staffResetPasswordPost,
} from "@/api/staff";
import { ElMessage, ElMessageBox } from "element-plus";
import { menuType } from "@/api/menuTop";
import store from "@/store";
import { orCount, orCountAdd } from "@/utils/util";

export default {
    components: {
        formList,
        emptyBox,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            formInitData: {},
            config: { ...addFormBottom, watchList: ["staffType"] },
            itemList,
            add: false,
            edit: false,
            hideList: [],
            showList: [],
            formState: [],
            buttons: [
                {
                    name: "返回",
                    size: "small",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "新 增",
                    size: "small",
                    click: () => {
                        router.push({
                            path: "/employeesy/staffManagement/add",
                        });
                    },
                },
            ],
            resetPass: () => {
                staffResetPasswordPost({
                    staffId: state.id,
                }).then((res) => {
                    ElMessage.success("重置成功");
                });
            },
            cancelMobile: () => {
                state.formState = disabledArr.map((item) => ({
                    code: item.code,
                    required: item.required,
                    disabled: false,
                }));
                formListRef.value.reset();
            },
            id: "",
        });
        // 初始化
        const start = () => {
            let id = "";
            if (useRoute().query && useRoute().query.id) {
                id = useRoute().query.id;
                const updateLastTitle = inject("updateLastTitle");
                updateLastTitle("编辑员工");
                state.edit = true;
                state.id = id;
                state.edit = true;
                state.showList = ["resetPassword"];
                setTimeout(() => {
                    state.hideList = ["password"];
                }, 100);
                state.add = false;
                staffGetStaffInfo({ id: useRoute().query.id }).then(
                    ({ code, data }) => {
                        if (code == 200) {
                            data.staffType = data.type;
                            let { functions = "" } = data;
                            data.functions = orCount(functions);
                            state.formInitData = data;
                            state.formState = [
                                {
                                    code: "mobile",
                                    append: null,
                                    disabled: true,
                                    afterSlot: null,
                                },
                            ];
                        }
                    }
                );
            } else {
                state.showList = ["password"];
                setTimeout(() => {
                    state.hideList = ["resetPassword"];
                }, 100);
                state.add = true;
            }
        };
        // 表单变化
        const formChange = (val) => {};
        const buttonClick = (val) => {
            if (val.name == "cancel") {
                router.go(-1);
            }
            if (val.name == "confirm" && val.valid) {
                let data = val.value;
                data.roleType = menuType[store.getters.menuType].type;
                data.functions = orCountAdd(data.functions);
                console.log("data.functions", data.functions);
                if (val.value.id) {
                    staffUpdateStaffPost({
                        ...data,
                        staffId: val.value.id,
                    }).then((res) => {
                        ElMessage.success({
                            message: "编辑成功，即将返回列表",
                            duration: 1000,
                            onClose: () => {
                                router.push("/employeesy/staffManagement");
                            },
                        });
                    });
                } else {
                    staffAddStaffPost(data).then((res) => {
                        ElMessage.success({
                            message: "新加成功，即将返回列表",
                            duration: 1000,
                            onClose: () => {
                                router.push("/employeesy/staffManagement");
                            },
                        });
                    });
                }
            }
        };
        start();
        return {
            buttonClick,
            formChange,
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped>
.cancelMobile {
    position: absolute;
    margin-left: 10px;
    z-index: 100;
}
</style>
