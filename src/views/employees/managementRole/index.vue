<!--
-->
<template>
    <div>
        <formList
            ref="formListRef"
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            @buttonClick="formButton"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
        >
        </Table>
        <div v-if="dialogVisible">
            <el-dialog
                v-model="dialogVisible"
                :title="popTitle"
                @close="dialogClose"
                top="15px"
                width="750px"
                :destroy-on-close="true"
            >
                <formList
                    ref="formListPop"
                    @buttonClick="buttonPop"
                    :formInitData="formInitDataPop"
                    @formChange="formChange"
                    :config="formConfigPop"
                    :itemList="itemListPop"
                />
                <div class="userHead">权限配置</div>
                <div class="userCheck">
                    <el-checkbox-group
                        @change="checkRoleChange"
                        :disabled="roleTreeDisabled"
                        v-model="checkRoleList"
                    >
                        <el-checkbox
                            v-for="item in roleLists"
                            :key="item.id"
                            :label="item.id"
                            >{{ item.roleName }}</el-checkbox
                        >
                    </el-checkbox-group>
                </div>
                <roleTree
                    :disabled="roleTreeDisabled"
                    :tableData="tableData"
                    listCode="BUTTON"
                    ref="refRoleTree"
                    :maxHeight="380"
                />
                <template #footer>
                    <el-button size="small" @click="dialogBtton(false)">取 消</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        v-if="!roleTreeDisabled"
                        @click="dialogBtton(true)"
                        >确 定</el-button
                    >
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { toRefs, reactive, ref, computed } from "vue";
import roleTree from "@/components/roleTree/index";
import formList from "@/components/FormList/index";
import { ElMessage, ElMessageBox } from "element-plus";

import {
    roleDetail,
    roleList, staffRoleDelete, staffRolePost, staffRolePut,
} from "@/api/role";
import { tabelFormConfig } from "@/utils/config";
import Table from "@/components/Table";
import { deleteItem } from "@/utils/tools";
import { roleInfo } from "@/api/admin";
import store from "@/store";
import { log } from "@/utils";
import { menuType } from "@/api/menuTop";
import { testApi } from "@/api/managerStaff";
import {roleStatusList} from '@/utils/enum/select'
import {orCount, orCountAdd} from '@/utils/util'

export default {
    components: {
        roleTree,
        Table,
        formList,
    },
    setup() {
        const formListRef = ref(null);
        const TableList = ref(null);
        const refRoleTree = ref(null);
        const formListPop = ref(null);
        const getCode = (list) => {
            let index = store.getters.menuType - 1 || 0;
            return list[index];
        };
        const state = reactive({
            test: () => {
                refRoleTree.value && refRoleTree.value.setDisabled();
            },
            getRowKeys: (row) => {
                return row.id;
            },
            // aaaaaaaaaaaappppppppppppp
            // getList: roleList,
            getList: roleList,
            itemList: [
                {
                    code: "roleName",
                    label: "角色名",
                },
            ],
            config: {
                ...tabelFormConfig,
                buttons: [
                    {
                        funType: "confirm",
                        type: "primary",
                        name: "查 询",
                        size: "small",
                    },
                    {
                        perCode: getCode(["a0502a", "s0902a", "c0402a"]),
                        funType: "add",
                        name: "新 增",
                        size: "small",
                    },
                ],
            },
            formInitData: {},
            column: [
                {
                    prop: "roleName",
                    label: "角色名称",
                },
                {
                    prop: "remarks",
                    label: "角色描述",
                },
                {
                    prop: "createTime",
                    label: "创建时间",
                },
                {
                    prop: "action",
                    label: "操作",
                    actives: [
                        {
                            perCode: getCode(["a0502c", "s0902c", "c0402c"]),
                            name: "详情",
                            method: (val) => {
                                getRoleList();
                                state.add = 3;
                                getDetail(val,true)
                            },
                        },
                        {
                            perCode: getCode(["a0502b", "s0902b", "c0402b"]),
                            name: (row)=>row.optState.write&&'编辑',
                            method: (val) => {
                                getRoleList();
                                state.add = 2;
                                getDetail(val,false)
                            },
                        },
                        {
                            perCode: getCode(["a0502d", "s0902d", "c0402d"]),
                            name: (row)=>row.optState.write&&'移除',
                            method: (val) => {
                                deleteItem(val, staffRoleDelete, TableList);
                            },
                        },
                    ],
                },
            ],
            formInitDataPop: {},
            dialogVisible: false,
            checkRoleList: [],
            checkIds: [],
            roleLists: [],
            roleIds: [],
            tableData: [],
            roleTreeDisabled: true,
            itemListPop: [
                {
                    label: "角色名",
                    code: "roleName",
                    maxlength: 60,
                },
                {
                    el: "textArea",
                    label: "备注",
                    code: "remarks",
                    required: false,
                    maxlength: 60,
                    row: 10,
                },
                {
                    el: "checkBox",
                    label: "角色状态",
                    code: "status",
                    default:['32','16'],
                    list:roleStatusList
                },
            ],
            formConfigPop: {
                valueStyle:{
                    width:'500px'
                },
                buttons: [],
                allDisabled: false,
            },
            add: 1,
            detail: false,
            editId: "",
            popTitle: computed(() =>
                state.add == 1
                    ? "新加角色"
                    : state.add == 2
                    ? "编辑角色"
                    : "查看详情"
            ),
        });
        // 弹窗关闭
        const dialogClose = () => {
            state.dialogVisible = false;
            state.formInitDataPop = {};
            state.checkRoleList = [];
            TableList.value.update();
            refRoleTree.value && refRoleTree.value.setTreeJion([]);
        };
        // 搜索的按钮
        const formButton = (val) => {
            if (val.name == "confirm") {
                TableList.value.update({ ...val.value });
            }
            if (val.name == "add") {
                getRoleList();
                state.add = 1;
                state.roleTreeDisabled = false;
                state.formConfigPop = {
                    ...state.formConfigPop,
                    allDisabled: false,
                };
                state.dialogVisible = true;
            }
        };
        const formChange = (val) => {};
        // 弹窗里的确认事件
        const buttonPop = (val) => {
            let roleData = refRoleTree.value.getValue("id");
            // aaaaaaaaaaa TODO
            // if (roleData && roleData.length == 0) {
            //     ElMessage.error("至少选择一个权限");
            //     return;
            // }
            if (val.valid) {
                let formData = val.value;
                formData.rolePermissions = roleData;
                formData.status = orCountAdd(formData.status);
                if (state.add == 1) {
                    // 新加
                    staffRolePost({ ...formData }).then(res => {
                        ElMessage.success("添加成功！");
                        state.dialogVisible = false;
                        dialogClose();
                    });
                }
                if (state.add == 2) {
                    formData.id = state.editId;
                    // 编辑
                    staffRolePut({ ...formData }).then(res => {
                        ElMessage.success("编辑成功！");
                        state.dialogVisible = false;
                        dialogClose();
                    });
                }
            }
        };
        // 弹窗的按钮
        const dialogBtton = (submit = false) => {
            if (submit) {
                // 触发
                formListPop.value.confirm();
            } else {
                dialogClose();
            }
        };
        const getListTree = () => {
            // aaaaaaaaaa
            // let scope = menuType[store.getters.menuType].scope;
            let scope = 12;
            // ppppppppppp
            // permissionListTree({ scope }).then(res => {
            //     state.tableData = res.data;
            // });
        };
        getListTree();
        // 角色列表
        const getRoleList = () => {
            // aaaaaaaaaaaappppppppppppp
            // roleList({ size: 1000 }).then(res => {
            //     state.roleLists = res.data.records;
            // });
        };
        // 获取角色详情
        const getDetail = (val,disabled) => {
            state.dialogVisible = true;
            state.editId = val.id;
            state.roleTreeDisabled = disabled;
            state.formConfigPop = {
                ...state.formConfigPop,
                allDisabled: disabled,
            };
            // 获取详情
            roleDetail({ roleId: val.id }).then(({data}) => {
                let checkIds = Array.from(
                    new Set(
                        [...data.buttons, ...data.menus].map(
                            item => item.id
                        )
                    )
                ).filter(v => v);
                data.status =orCount(data.status)
                state.formInitDataPop = data;
                refRoleTree &&
                refRoleTree.value &&
                refRoleTree.value.setTreeJion(checkIds, false);
            });
        }
        getRoleList();

        // 角色詳情
        const getRoleRoleInfo = (ids) => {
            if (ids.length > 0) {
                // aaaaaaaaaaaappppppppppppp
                // roleRoleInfos({ roleIds: ids.join(",") }).then(res => {
                //     let midarr = [];
                //     res.data.forEach(item => {
                //         midarr = [...midarr, ...item.buttons, ...item.menus];
                //     });
                //     state.checkIds = Array.from(
                //         new Set([...midarr].map(item => item.id))
                //     );
                //     refRoleTree.value.setTreeJion(state.checkIds, true);
                // });
            } else {
                refRoleTree.value.setTreeJion([], true);
            }
        };
        // 选择角色的变化
        const checkRoleChange = (val) => {
            getRoleRoleInfo(val);
        };

        // 查询权限列表
        const getPermissionList = () => {
            // permissionList.list
        };
        //
        const getIds = () => {
            console.log(refRoleTree);
            console.log(refRoleTree.value.getValue());
        };
        return {
            ...toRefs(state),
            formListRef,
            refRoleTree,
            formListPop,
            TableList,
            dialogClose,
            formButton,
            buttonPop,
            getIds,
            dialogBtton,
            formChange,
            checkRoleChange,
        };
    },
};
</script>

<style lang="scss" scoped>
.userHead {
    padding-bottom: 16px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
}
.userCheck {
    margin-bottom: 20px;
}
/deep/ {
    .el-tree-node__expand-icon {
        display: none;
    }
    .el-tree-node {
        display: flex;
    }
    .el-tree-node__content {
        display: flex;
    }
}
</style>
