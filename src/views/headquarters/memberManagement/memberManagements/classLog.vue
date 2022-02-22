<!--
 * @Author: 郑晶
 * @Date: 2021-12-27 17:07:27
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-12-27 17:23:37
 * @Description: 会员详情-上课记录
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
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import { hallMemberClassLog } from "@/api/hall";
import { courseTypeList } from "@/utils/enum/select";
import { payMannerListAPI } from "@/api/baseSet";
// template
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "关键词",
                    code: "keyword",
                },
                {
                    el: "select",
                    label: "课程类型",
                    code: "courseType",
                    list: courseTypeList,
                },
                {
                    el: "select",
                    label: "支付类型",
                    code: "channel",
                    fun: payMannerListAPI,
                    funMode: (res) =>
                        res.data.records.map((v) => ({
                            label: v.name,
                            value: v.id,
                        })),
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
            },
            // table表单
            getList: hallMemberClassLog,
            details: {},
            column: [
                {
                    label: "场馆",
                    prop: "hallName",
                },
                {
                    label: "课程",
                    prop: "courseCardName",
                },
                {
                    label: "课程类型",
                    prop: "courseName",
                },
                {
                    label: "教练",
                    prop: "coachName",
                },
                {
                    label: "约课人数",
                    prop: "hasOrder",
                },
                {
                    label: "支付信息",
                    prop: "paymentInfo",
                },
                {
                    label: "上课时间",
                    prop: "dateTime",
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
