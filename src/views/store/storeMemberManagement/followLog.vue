<!--
 * @Author: 郑晶
 * @Date: 2021-12-27 14:34:21
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-20 16:26:58
 * @Description: 会员详情-跟进记录
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
        <!-- 生成兑换码 -->
        <popupForm
            v-model:show="addExchangeCodeModal"
            v-model:formInitData="popFormInitData"
            title="添加记录"
            :itemList="popItemList"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import { hallMemberFollowLog, addHallMemberFollowLog } from "@/api/hall";
import { useStore } from "vuex";
import popupForm from "@/components/FormList/popupForm.vue";
import popup from "@/components/popup/index.vue";
import { ElMessage } from "element-plus";
// template
export default {
    components: {
        formList,
        Table,
        popupForm,
        popup,
    },
    setup() {
        const store = useStore();
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            addExchangeCodeModal: false,
            popFormInitData: {},
            popItemList: [
                {
                    el: "textArea",
                    label: "记录内容",
                    code: "log",
                    required: false,
                    maxlength: 60,
                    row: 10,
                },
            ],
            popButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.addExchangeCodeModal = false;
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        // 添加跟进记录
                        addHallMemberFollowLog({
                            ...value,
                            ...state.searchData,
                        }).then(({ code, msg }) => {
                            if (code === 200) {
                                ElMessage.success({
                                    message: msg || "操作成功",
                                    duration: 300,
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
                        state.addExchangeCodeModal = false;
                    },
                },
            ],
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "关键词",
                    code: "keyword",
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
                    funType: "confirm",
                    type: "primary",
                    name: "添加",
                    click: ({ value }) => {
                        state.addExchangeCodeModal = true;
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {
                memberId: id,
                hallId: store.getters.activeHallId,
            },
            // table表单
            getList: hallMemberFollowLog,
            details: {},
            column: [
                {
                    label: "记录内容",
                    prop: "log",
                },
                {
                    label: "记录人",
                    prop: "createdName",
                    width: 100,
                },
                {
                    label: "记录时间",
                    prop: "createdAt",
                    width: 160,
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

<style lang="scss" scoped></style>
