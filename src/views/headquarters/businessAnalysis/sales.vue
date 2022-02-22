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
        />
        <el-dialog
            v-if="show"
            title="销售业绩详情"
            v-model="show"
            width="80%"
            top="50px"
            destroy-on-close
            ref="refDialog"
        >
            <formList
                :config="popCofig"
                :itemList="popList"
                :formInitData="popData"
                :buttons="popButtons"
            />
            <Table
                ref="popTable"
                :loadData="getList"
                :column="popColumn"
                :params="popData"
                :bottomSize="100"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </el-dialog>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import {enableDisable, funList, getListHtml, testList} from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
// template
export default {
    components: {
        formList,
        Table
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const popTable = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    el:'select',
                    code: "aaa4151",
                    label: "销售",
                    list:testList
                },
                {
                    el:'date',
                    code: "aaa41251",
                    type:'date',
                    label: "日期",
                }
            ],
            // 搜索表格--配置
            searchConfig: {...tabelFormConfig,},
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "查 询",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
                {
                    funType: "confirm",
                    name: "导出",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {},
            // table表单
            getList: staffAllStaffList,
            column: [
                {
                    label: '姓名',
                    prop: 'aaa34669',
                },
                {
                    label: '开卡',
                    prop: 'aaa75150',
                },
                {
                    label: '转卡',
                    prop: 'aaa54568',
                },
                {
                    label: '储值',
                    prop: 'aaa32027',
                },
                {
                    label: '卡余额调整',
                    prop: 'aaa17018',
                },
                {
                    label: '业绩总和',
                    prop: 'aaa40399',
                },
                {
                    label: '提成比率',
                    prop: 'aaa31727',
                },
                {
                    label: '提成',
                    prop: 'aaa54067',
                },
                {
                    prop: "action",
                    label: "操作",
                    width: '80',
                    actives: [
                        {
                            perCode: "a0601b",
                            name:'详情',
                            method: (row, val) => {
                                state.show=true
                                // state.popData={...row}
                            },
                        },
                    ]
                }
            ],
            show:false,
            popCofig:{...tabelFormConfig,default:{colon:':'}},
            popList:[
                {
                    el:'slot',
                    code: "name",
                    label: "销售员",
                    valueStyle:{
                        width:'140px'
                    },
                    inSlot:{
                        el:'div',
                    }
                },
                {
                    el:'slot',
                    code: "aaaa121",
                    label: "手机号",
                    valueStyle:{
                        width:'140px'
                    },
                    inSlot:{
                        el:'div',
                    },
                },
                {
                    el:'slot',
                    code: "aaaa1211",
                    label: "业绩总额",
                    valueStyle:{
                        width:'140px'
                    },
                    inSlot:{
                        el:'div',
                    },
                },
                {
                    el:'slot',
                    code: "aaaa1sdd211",
                    label: "提成",
                    valueStyle:{
                        width:'140px'
                    },
                    inSlot:{
                        el:'div',
                    },
                },
                {
                    el:'slot',
                    code: "aaad2211",
                    label: "提成额",
                    valueStyle:{
                        width:'140px'
                    },
                    inSlot:{
                        el:'div',
                    },
                },
                {
                    el:'date',
                    code: "aaa41251",
                    type:'date',
                    label: "日期",
                },
                {
                    el:'select',
                    code: "aaa4151",
                    label: "销售",
                    list:testList
                },
                {
                    el:'select',
                    code: "aaa415251",
                    label: "订单类型",
                    list:testList
                },
                {
                    code: "aaa4152sd51",
                    label: "会员姓名",
                },
                {
                    code: "aaa41sd51",
                    label: "会员手机号",
                },
            ],
            popData:{
                name:'严恒'
            },
            popButtons:[
                {
                    funType: "confirm",
                    type: "primary",
                    name: "查 询",
                    click: ({ value }) => {
                        popTable.value.update(value);
                    },
                },
            ],
            popColumn:[
                {
                    label: '类型',
                    prop: 'aaa56723',
                },
                {
                    label: '时间',
                    prop: 'aaa39580',
                },
                {
                    label: '会员名',
                    prop: 'aaa44485',
                },
                {
                    label: '手机号',
                    prop: 'aaa58374',
                },
                {
                    label: '会员会籍',
                    prop: 'aaa73063',
                },
                {
                    label: '跟进状态',
                    prop: 'aaa74078',
                },
                {
                    label: '绑卡销售',
                    prop: 'aaa23840',
                },
                {
                    label: '卡号',
                    prop: 'aaa99904',
                },
                {
                    label: '对半分成',
                    prop: 'aaa8639',
                },
                {
                    label: '业绩',
                    prop: 'aaa23304',
                },

            ],
        });
        return {
            ...toRefs(state),
            TableList,
            popTable
        };
    }
};
</script>

<style lang="scss" scoped></style>
