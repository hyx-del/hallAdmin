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
            title="统计详情"
            v-model="show"
            width="80%"
            top="50px"
            destroy-on-close
            ref="refDialog"
        >
            <formList
                :config="searchConfig"
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
import {
    enableDisable,
    funList,
    getListHtml,
    testList,
} from "@/utils/enum/select";
import { tabelFormConfig } from "@/utils/config";
import { staffAllStaffList } from "@/api/managerStaff";
// template
export default {
    components: {
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const popTable = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    code: "name",
                    label: "关键字",
                },
                {
                    el: "select",
                    code: "aaa415451",
                    label: "入会来源",
                    list: [...enableDisable],
                },
                {
                    el: "date",
                    code: "aaa41251",
                    type: "date",
                    label: "消费日期",
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "查 询",
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
                    label: "会员名",
                    prop: "name",
                },
                {
                    label: "手机号",
                    prop: "aaa15335",
                },
                {
                    label: "所属场馆",
                    prop: "aaa81859",
                },
                {
                    label: "微信支付约课",
                    prop: "aaa81621",
                },
                {
                    label: "储值余额",
                    prop: "aaa94606",
                },
                {
                    label: "开卡",
                    prop: "aaa27213",
                },
                {
                    label: "课程卡权益调整",
                    prop: "aaa55947",
                },
                {
                    label: "转卡补差",
                    prop: "aaa94657",
                },
                {
                    label: "私教其他支付",
                    prop: "aaa28156",
                },
                {
                    label: "最近消费时间",
                    prop: "aaa17010",
                },
                {
                    label: "总计",
                    prop: "aaa28699",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: "80",
                    actives: [
                        {
                            perCode: "a0601b",
                            name: "详情",
                            method: (row, val) => {
                                state.show = true;
                                // state.popData={...row}
                            },
                        },
                    ],
                },
            ],
            show: false,
            popList: [
                {
                    el: "select",
                    code: "aaa4151",
                    label: "销售",
                    list: testList,
                },
                {
                    el: "date",
                    code: "aaa41251",
                    type: "date",
                    label: "日期",
                },
            ],
            popData: {},
            popButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "查 询",
                    click: ({ value }) => {
                        popTable.value.update(value);
                    },
                },
            ],
            popColumn: [
                {
                    label: "时间",
                    prop: "aaa98028",
                },
                {
                    label: "消费类型",
                    prop: "aaa51587",
                },
                {
                    label: "金额",
                    prop: "aaa91994",
                },
                {
                    label: "支付方式",
                    prop: "aaa60401",
                },
                {
                    label: "课程卡",
                    prop: "aaa45578",
                },
                {
                    label: "课程",
                    prop: "aaa27061",
                },
            ],
        });
        return {
            ...toRefs(state),
            TableList,
            popTable,
        };
    },
};
</script>

<style lang="scss" scoped></style>
