<!--
 * @Author: 郑晶
 * @Date: 2021-12-27 13:30:21
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-20 10:58:15
 * @Description: 会员详情-账户余额
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
        <el-dialog
            v-model="detailsModal"
            title="详情"
            width="40%"
            :before-close="handleClose"
        >
            <div v-if="details">
                <p>门店：{{ details.hallName }}</p>
                <p>课程时间：{{ details.startAt }} - {{ details.endAt }}</p>
                <p>课程名字：{{ details.courseName }}</p>
                <p>
                    课程类型：{{
                        details.courseType === 1
                            ? "团课"
                            : details.courseType === 2
                            ? "私教课"
                            : "企业课"
                    }}
                </p>
                <p>教练：{{ details.coachName }}</p>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="detailsModal = false"
                        >关闭</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import { hallBalanceList, hallCourseByOrder } from "@/api/hall";
import { getListHtml, TransactionType } from "@/utils/enum/select";
import { useStore } from "vuex";
// template
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const store = useStore();
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "场馆名称",
                    code: "hallName",
                },
                {
                    el: "select",
                    label: "变更途径",
                    code: "from",
                    list: [
                        { label: "门店", value: 1 },
                        { label: "小程序", value: 2 },
                        { label: "APP", value: 3 },
                    ],
                },
                {
                    el: "select",
                    label: "类型",
                    code: "type",
                    list: TransactionType,
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
            ],
            // 搜索表格--数据
            searchData: {
                memberId: id,
                hallId: store.getters.activeHallId,
            },
            // table表单
            getList: hallBalanceList,
            details: {},
            column: [
                {
                    label: "场馆",
                    prop: "hallName",
                },
                {
                    label: "变动金额",
                    prop: "amount",
                },
                {
                    label: "类型",
                    prop: "type",
                    html: (row, val) => getListHtml(TransactionType, val),
                },
                {
                    label: "课程",
                    prop: "courseName",
                },
                {
                    label: "创建时间",
                    prop: "createdAt",
                },
                {
                    label: "变动途径",
                    prop: "from",
                    html: (row, val) => (+val === 1 ? "门店" : "小程序"),
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 160,
                    actives: [
                        {
                            name: ({ coursePlanOrderId }) =>
                                coursePlanOrderId && "课程详情",
                            method: ({ coursePlanOrderId }) => {
                                hallCourseByOrder({ coursePlanOrderId }).then(
                                    ({ code, data }) => {
                                        if (code === 200) {
                                            state.details = data;
                                            state.detailsModal = true;
                                        }
                                    }
                                );
                            },
                        },
                    ],
                },
            ],
            detailsModal: false,
        });
        const handleClose = () => {
            state.detailsModal = false;
        };
        return {
            ...toRefs(state),
            TableList,
            handleClose,
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
