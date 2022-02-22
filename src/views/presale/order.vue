<template>
    <div>
        <formList
            :config="searchConfig"
            :itemList="searchList"
            :formInitData="searchData"
            :buttons="buttons"
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
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {funList, getListHtml, presaleOrderList} from "@/utils/enum/select";
import {tabelFormConfig, tabelFormConfig2, tabelFormConfigMini} from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
import { ElMessage, ElMessageBox } from "element-plus";
import {presellorderList} from '@/api/presell'
import {salesList} from '@/api/common'

// template
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    code: "like",
                    label: "关键词",
                },
                {
                    el:'select',
                    code: "type",
                    label: "订单类型",
                    list:presaleOrderList
                },
                {
                    el:'select',
                    code: "salesmanId",
                    label: "销售",
                    optionsFn: salesList,
                    filterable: true,
                },
                {
                    el:'date',
                    type:'daterange',
                    code: "create",
                    label: "下单日期",
                    otherCodeArr:['createdAtStart','createdAtEnd'],// 开始和结束
                    valueStyle:{
                        width:'300px'
                    }
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig2,
            },
            // 搜索表格--数据
            searchData: {},
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
            // table表单
            getList: presellorderList,
            column: [
                {
                    label: '预售活动',
                    prop: 'presellActivityName',
                },
                {
                    label: '会员',
                    prop: 'memberName',
                },
                {
                    label: '会员电话',
                    prop: 'mobile',
                },
                {
                    label: '订单金额',
                    prop: 'total',
                },
                {
                    label: '支付金额',
                    prop: 'actualTotal',
                },
                {
                    label: '订单类型',
                    prop: 'type',
                    html: (row, val) => getListHtml(presaleOrderList, val),

                },
                {
                    label: '销售人',
                    prop: 'salesmanName',
                },
                {
                    label: '下单时间',
                    prop: 'createdAt',
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
