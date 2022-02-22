<!--
 * @Author: 郑晶
 * @Date: 2021-12-27 14:34:21
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-06 17:35:47
 * @Description: 会员详情-跟进记录
-->
<template>
    <div>
        <formList
            :config="[]"
            :buttons="[]"
            :itemList="[]"
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
import Table from "@/components/Table/index";
import { toRefs, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { hallMemberFollowLog } from "@/api/hall";
// template
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 搜索表格--数据
            searchData: {
                memberId: id,
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
