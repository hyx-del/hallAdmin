<template>
    <div>
        <div class="title">
            <formList
                :config="config"
                :itemList="itemList"
                :formInitData="formInitData"
                :buttons="buttons"
            />
        </div>
        <div class="table">
            <Table
                ref="TableList"
                :loadData="getList"
                :column="column"
                :params="formInitData"
                :showSortIndex="{ show: true, lable: '序号' }"
            >
            </Table>
        </div>
        <popupForm
            v-model:show="dialogNumber"
            v-model:formInitData="formInitDataNumber"
            title="绑定会员"
            :itemList="itemListNumber"
            :buttons="privateButtons"
        />
        <popupForm
            v-model:show="dialogPos"
            v-model:formInitData="formInitDataPos"
            title="转正"
            :itemList="itemListPos"
            :buttons="buttonPos"
        />
        <!--        <el-dialog-->
        <!--            v-if="dialogPos"-->
        <!--            v-model="dialogPos"-->
        <!--            title="转正"-->
        <!--            width="500px"-->
        <!--        >-->
        <!--            <formList-->
        <!--                :config="configPos"-->
        <!--                :itemList="itemListPos"-->
        <!--                :formInitData="formInitDataPos"-->
        <!--                @buttonClick="buttonPos"-->
        <!--            >-->
        <!--            </formList>-->
        <!--        </el-dialog>-->
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { templateList, deltemplate } from "@/api/headquarters";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    enableList,
    funList,
    genderList,
    getListHtml,
    jobsStateList,
    staffEnableList,
    staffEnableList2,
    staffStateList,
    studentStatusList2,
    testList,
} from "@/utils/enum/select";
import { deleteItem, messageBox } from "@/utils/tools";
import { tabelFormConfig } from "@/utils/config";

import { testApi } from "@/api/managerStaff";
import { roleList, staffRoleRolesInfo, userinfoByMobile } from "@/api/role";
import store from "@/store";
import { farmatDate } from "@/utils/formaData";
import {
    memberMemberContact,
    staffAllStaffList,
    staffBindingMemberPost,
    staffEmptyRoleDelete,
    staffEnabledStaffPost,
    staffFindMemberByMobile,
    staffGetStaffList,
    staffRemoveStaffDelete,
    staffStaffConversionPost,
} from "@/api/staff";
import popupForm from "@/components/FormList/popupForm";
import { memberList } from "@/api/common";

export default {
    components: {
        formList,
        Table,
        popupForm,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const someCofig = {
            allRequired: false, // 是否全部必填
            inline: false, //行内
            inputStyle: {
                width: "340px",
            },
            buttons: [
                {
                    funType: "cancel",
                    type: "primary",
                    name: "取消",
                    size: "small",
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    size: "small",
                },
            ],
        };

        const getCode = (list) => {
            let index = store.getters.menuType - 1 || 0;
            return list[index];
        };
        const state = reactive({
            // 会员绑定
            configNumber: someCofig,
            findNumber: (keyword) => {
                memberMemberContact({ keyword }).then((res) => {
                    if (res.data && res.data.name) {
                        ElMessage.success("查找成功");
                        state.formInitDataNumber = {
                            mobile: keyword,
                            memberId: res.data.id,
                            nickname: res.data.nickname,
                            name: res.data.name,
                        };
                    } else {
                        ElMessage.error("查找失败");
                        state.formInitDataNumber = {
                            mobile: keyword,
                            nickname: "",
                            name: "",
                        };
                    }
                });
            },
            itemListNumber: [
                {
                    label: "手机号",
                    code: "mobile",
                    maxlength: 11,
                    type: "phone",
                    required: true,
                    inSlot: {
                        el: "button",
                        text: computed(() =>
                            state.formInitDataNumber?.bindMember
                                ? "重置"
                                : "查找"
                        ),
                        size: "small",
                        class: "slotRight",
                        click: (keyword) => {
                            console.log(keyword);
                            if (keyword) {
                                state.findNumber(keyword);
                            } else {
                                ElMessage.error("请输入手机号");
                            }
                        },
                    },
                },
                {
                    code: "name",
                    label: "姓名",
                    disabled: true,
                    errTip: "请点击查找",
                    tips: "输入手机号查找绑定会员,否则无法绑定",
                },
                {
                    code: "nickname",
                    label: "昵称",
                    disabled: true,
                    required: true,
                    errTip: "请点击查找",
                    tips: "输入手机号查找绑定会员,否则无法绑定",
                },
            ],
            formInitDataNumber: {},
            dialogNumber: false,
            privateButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.dialogNumber = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        let data = {
                            ...value,
                        };
                        if (!value.memberId) {
                            ElMessage.error("请查找到用户再来");
                            return;
                        }
                        staffBindingMemberPost(data).then((res) => {
                            ElMessage.success("绑定成功");
                            state.dialogNumber = false;
                            TableList.value.update();
                        });
                    },
                },
            ],
            // 会员绑定----
            // 转正
            configPos: someCofig,
            itemListPos: [
                {
                    el: "date",
                    code: "conversionDate",
                    label: "转正日期",
                },
            ],
            dialogPosId: "",
            formInitDataPos: {},
            dialogPos: false,
            buttonPos: [
                {
                    name: "取消",
                    click: () => {
                        state.dialogPos = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        staffStaffConversionPost(value).then((res) => {
                            ElMessage.success("转正成功");
                            state.dialogPos = false;
                            TableList.value.update();
                        });
                    },
                },
            ],
            // 搜索表单
            itemList: [
                {
                    code: "name",
                    label: "员工",
                },
                {
                    code: "mobile",
                    label: "手机号",
                    maxlength: 11,
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: staffEnableList2,
                },
                {
                    el: "select",
                    label: "性别",
                    code: "gender",
                    list: genderList,
                },
                {
                    el: "select",
                    label: "岗位状态",
                    code: "staffType",
                    list: staffStateList,
                },
                {
                    el: "select",
                    label: "职能",
                    code: "functions",
                    list: funList,
                },
                {
                    el: "select",
                    label: "角色",
                    code: "roleId",
                    labelCode: "roleName",
                    fun: roleList,
                },
            ],
            config: {
                ...tabelFormConfig,
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "查 询",
                    size: "small",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
                {
                    perCode: getCode(["a0501a", "s0901a", "c0401a"]),
                    funType: "add",
                    name: "新 增",
                    size: "small",
                    click: () => {
                        router.push({
                            path: "/employeesy/staffManagement/add",
                        });
                    },
                },
            ],
            formInitData: {
                provinceId: 120000,
                cityId: 120100,
                countyId: 120101,
            },
            // table表单
            getList:
                store.getters.menuType == "s"
                    ? staffAllStaffList
                    : staffGetStaffList,
            column: [
                // { prop: "id", label: "序号" },
                { prop: "name", label: "姓名" },
                { prop: "nameEn", label: "英文名" },
                { prop: "mobile", label: "手机" },
                {
                    prop: "gender",
                    label: "性别",
                    html: (row, val) => getListHtml(genderList, val),
                },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, val) => getListHtml(staffEnableList2, val),
                },
                {
                    prop: "entryTime",
                    label: "入职日期",
                    html: (row) =>
                        row.entryTime && farmatDate(row.entryTime).date,
                },
                { prop: "address", label: "地址" },
                {
                    prop: "functions",
                    label: "职能",
                    html: (row, val) => getListHtml(funList, val),
                },
                {
                    prop: "type",
                    label: "岗位状态",
                    // html: (row, val) => getListHtml(staffStateList, val)
                    html: (row, val) => getListHtml(staffStateList, val),
                },
                {
                    prop: "bindMember",
                    label: "是否绑定会员",

                    html: ({bindMember}) =>bindMember?'已绑定':'未绑定' ,
                },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 320,
                    actives: [
                        {
                            perCode: getCode(["a0501b", "s0901b", "c0401b"]),
                            name: "编辑",
                            method: (val) =>
                                router.push({
                                    path: "/employeesy/staffManagement/add",
                                    query: { id: val.id },
                                }),
                        },
                        {
                            perCode: getCode(["a0501c", "s0901c", "c0401c"]),
                            name: "查看",
                            method: (val) =>
                                router.push({
                                    path: "/employeesy/staffManagement/detail",
                                    query: { id: val.id },
                                }),
                        },
                        {
                            perCode: getCode(["a0501d", "s0901d", "c0401d"]),
                            name: "绑定会员",
                            method: (row) => {
                                let {
                                    mobile,
                                    bindMember = false,
                                    id,
                                    name,
                                } = row;
                                state.formInitDataNumber = {
                                    mobile,
                                    bindMember,
                                    staffId: id,
                                };
                                if (bindMember) {
                                    state.findNumber(mobile);
                                }
                                state.dialogNumber = true;
                            },
                        },
                        {
                            perCode: getCode(["a0501e", "s0901e", "c0401e"]),
                            name: (row) => (row.type == 1 ? "转正" : ""),
                            method: (val) => {
                                state.dialogPos = true;
                                state.formInitDataPos = {
                                    id: val.id,
                                };
                            },
                        },
                        {
                            perCode: getCode(["a0501h", "s0901h", "c0401h"]),
                            name: (row) => (row.status == 1 ? "" : "启用"),
                            method: (row) => {
                                messageBox(
                                    row,
                                    staffEnabledStaffPost,
                                    TableList,
                                    {
                                        params: {
                                            staffId: row.id,
                                            status: row.status == 1 ? -1 : 1,
                                        },
                                        title: `是否${
                                            row.status ? "禁用" : "启用"
                                        }`,
                                        success: "操作成功",
                                    }
                                );
                            },
                        },
                        {
                            perCode: getCode(["a0501g", "s0901g", "c0401g"]),
                            name: (row) => (row.status == 1 ? "禁用" : ""),
                            method: (row) => {
                                messageBox(
                                    row,
                                    staffEnabledStaffPost,
                                    TableList,
                                    {
                                        params: {
                                            staffId: row.id,
                                            status: row.status == 1 ? -1 : 1,
                                        },
                                        title: `是否${
                                            row.status ? "禁用" : "启用"
                                        }`,
                                        success: "操作成功",
                                    }
                                );
                            },
                        },
                        {
                            perCode: getCode(["a0501f", "s0901f", "c0401f"]),
                            name: "删除",
                            method: (row) =>
                                deleteItem(
                                    row,
                                    store.getters.menuType == "s"
                                        ? staffRemoveStaffDelete
                                        : staffEmptyRoleDelete,
                                    TableList,
                                    {
                                        params: { staffId: row.id },
                                    }
                                ),
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
