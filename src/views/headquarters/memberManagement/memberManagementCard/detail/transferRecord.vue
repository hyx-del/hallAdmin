<!--
 * @Author: 刘帝君
 * @Date: 2022-01-13 14:17:07
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-14 14:52:28
 * @Descripttion: 转会记录
-->
<template>
    <div>
        <div class="table">
            <Table
                ref="TableList"
                :loadData="getList"
                :column="column"
                :params="formInitData"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </div>
    </div>
</template>

<script>
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { usingRecordList } from "@/api/hall";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
    components: {
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            formInitData: {},
            // 添加课程
            button: (val) => {
                switch (val.text) {
                    case "查 询":
                        TableList.value.update({ ...val.value });
                        break;
                    default:
                        break;
                }
            },
            getList: usingRecordList,
            column: [
                { prop: "oldSalesmanName", label: "原会籍", width: "80" },
                { prop: "newSalesmanName", label: "更换会籍" },
                { prop: "operatorName", label: "操作人" },
                { prop: "updatedAt", label: "时间" },
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
</style>
