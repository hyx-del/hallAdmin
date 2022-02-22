<!--
 * @Author: 郑晶
 * @Date: 2021-12-27 14:50:10
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-10 17:01:07
 * @Description: 会馆-会员详情-访问记录
-->
<template>
    <div>
        <formList
            :config="searchConfig"
            :buttons="buttons"
            :itemList="searchList"
            :formInitData="searchData"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="searchData"
            :showSortIndex="{ show: true, lable: '序号' }"
        >
        </Table>
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            title="新增"
            :itemList="popItemList"
            :formConfig="popFormConfig"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import {
    hallMemberVisitLog,
    addHallMemberVisitLog,
    updateHallMemberVisitLog,
} from "@/api/hall";
import { getListHtml, accessStatus } from "@/utils/enum/select";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const TableList = ref(null);
        const store = useStore();
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 当前门店
            activeHallId: store.getters.activeHallId,
            // 搜索表单--搜索项
            searchList: [
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: accessStatus,
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
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
                    funType: "add",
                    type: "primary",
                    name: "新增",
                    click: () => {
                        state.popShow = true;
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {
                memberId: id,
                hallId: store.getters.activeHallId,
            },
            popShow: false,
            popFormInitData: {},
            popItemList: [
                {
                    el: "date",
                    code: "appointDate",
                    type: "date",
                    label: "预约时间",
                    minDate: new Date("1900-01-01"),
                },
                {
                    el: "textArea",
                    code: "log",
                    label: "内容记录",
                },
            ],
            popFormConfig: {
                buttons: [],
            },
            popButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.popShow = false;
                    },
                },
                {
                    show: true,
                    name: "确认",
                    funType: "confirm",
                    type: "primary",
                    click: ({ value }) => {
                        addHallMemberVisitLog({
                            ...value,
                            hallId: state.activeHallId,
                            memberId: id,
                        }).then(({ code, msg }) => {
                            if (code === 200) {
                                ElMessage.success({
                                    message: msg || "操作成功",
                                    duration: 500,
                                    onClose: () => {
                                        TableList.value.update();
                                        state.popShow = false;
                                    },
                                });
                            } else {
                                ElMessage.error({
                                    message: msg || "操作失败",
                                });
                            }
                        });
                    },
                },
            ],
            // table表单
            getList: hallMemberVisitLog,
            details: {},
            column: [
                {
                    label: "记录内容",
                    prop: "log",
                },
                {
                    label: "记录人",
                    prop: "createdName",
                },
                {
                    label: "到付状态",
                    prop: "status",
                    html: (row, val) => getListHtml(accessStatus, val),
                },
                {
                    label: "预约时间",
                    prop: "appointDate",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 160,
                    actives: [
                        {
                            name: ({ status }) => !status && "到访",
                            method: ({ id }) => {
                                updateHallMemberVisitLog({
                                    id,
                                }).then(({ code, msg }) => {
                                    if (code === 200) {
                                        ElMessage.success({
                                            message: msg || "操作成功",
                                            duration: 500,
                                            onClose: () => {
                                                TableList.value.update();
                                            },
                                        });
                                    } else {
                                        ElMessage.error({
                                            message: msg || "操作失败",
                                        });
                                    }
                                });
                            },
                        },
                    ],
                },
            ],
            detailsModal: false,
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
