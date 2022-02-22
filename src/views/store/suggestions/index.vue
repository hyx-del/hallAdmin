<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-05 17:38:19
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-05 17:38:36
 * @Descripttion: 投诉建议
-->
<template>
    <div>
        <FormList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="formListButtons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
        <!-- 导出选择时间范围模块 -->
        <popupForm
            v-model:show="exportDatePop"
            v-model:formInitData="exportDatePopInitData"
            title="选择时间范围"
            :itemList="exportDatePopItemList"
            height="130px"
            :buttons="exportDatePopButtons"
        />
    </div>
</template>

<script>
import FormList from "@/components/FormList/index";
import Table from "@/components/Table/index";
import popupForm from "@/components/FormList/popupForm";
import { reactive, ref, toRefs } from "vue";
import { suggestionsList } from "@/api/suggestions";
import { tabelFormConfig } from "@/utils/config";
import { replyStatusList } from "@/utils/enum/select";
import { dayDif } from "@/utils/formaData";
import { ElMessage } from "element-plus";
import { suggestionsExport } from "@/api/exportURL";

export default {
    components: { Table, FormList, popupForm },
    props: [],
    setup() {
        const TableList = ref(null);
        const state = reactive({
            //=======导出
            exportDatePop: false,
            exportDatePopInitData: { startAt: new Date(), endAt: new Date() },

            exportDatePopItemList: [
                {
                    el: "date",
                    code: "betweenDate",
                    type: "daterange",
                    label: "时间范围",
                    maxDate: new Date(),

                    valueStyle: {
                        //input框样式，css
                        width: "100%",
                    },
                },
            ],

            exportDatePopButtons: [
                {
                    text: "取消",
                    click: () => (state.exportDatePop = false),
                },
                {
                    funType: "confirm",
                    type: "primary",
                    text: "确定",
                    click: ({ value }) => {
                        let _tempPar = { ...value };
                        // betweenDate
                        if (_tempPar.betweenDate) {
                            // TODO 做时间限制 时间不能超过一个月
                            const _parBetweenDate =
                                _tempPar.betweenDate.split(",");

                            if (
                                dayDif(
                                    new Date(_parBetweenDate[1]),
                                    new Date(_parBetweenDate[0])
                                ) > 31
                            ) {
                                ElMessage.warning("时间跨度不能超过31天");
                                return false;
                            }
                            _tempPar.startAt = `${_parBetweenDate[0]} 00:00:00`;
                            _tempPar.endAt = `${_parBetweenDate[1]} 23:59:59`;
                            delete _tempPar.betweenDate;
                            suggestionsExport({ ..._tempPar });
                            state.exportDatePop = false;
                        } else {
                            ElMessage.warning("时间必选");
                        }
                    },
                },
            ],
            //===
            formInitData: {},
            column: [
                { label: "会员", prop: "memberName" },
                { label: "会员电话", prop: "vipPhone" },
                { label: "建议", prop: "content" },
                { label: "留言时间", prop: "replyAt" },
                { label: "回复人", prop: "replierName" },
                { label: "回复内容", prop: "replyContent" },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 80,
                    actives: [
                        {
                            // perCode:'',
                            name: "回复",
                            path: "/suggestions/details",
                        },
                    ],
                },
            ],
            getList: suggestionsList,
            hasReplier: "",
            formListButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        let { coachScore } = value;
                        console.log(coachScore);
                        TableList.value.update({
                            ...value,
                            hasReplier: coachScore,
                        });
                    },
                },
                {
                    funType: "confirm",
                    name: "导出",
                    click: ({ value }) => {
                        state.exportDatePopInitData = {};
                        state.exportDatePop = true;
                        state.exportDatePopInitData = {
                            ...state.exportDatePopInitData,
                            ...value,
                        };
                    },
                },
            ],
            itemList: [
                {
                    el: "select",
                    label: "回复状态",
                    code: "coachScore",
                    list: replyStatusList,
                },
            ],
            config: tabelFormConfig,
        });
        return {
            TableList,
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
