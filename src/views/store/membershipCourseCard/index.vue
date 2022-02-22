<!--
 * @Author: 吴欣欣
 * @Date: 2021-11-23 14:01:43
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-28 17:38:29
 * @Descripttion: 会员课程卡
-->
<template>
    <div>
        <formList
            :formInitData="hallIdObj"
            :itemList="formList"
            :config="config"
            ref="Form"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :select="tableSelect"
            :column="column"
            :params="hallIdObj"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
        <!--有效期调整-->
        <popupForm
            v-model:show="validityShow"
            v-model:formInitData="topUpData"
            title="批量有效期调整"
            :itemList="validityList"
            :buttons="validityButtons"
        />
        <!-- 修改销售 -->
        <popupForm
            v-model:show="SalesModal"
            v-model:formInitData="SalesData"
            title="修改销售"
            :itemList="SalesList"
            :buttons="SalesButtons"
        />
    </div>
</template>

<script>
import popupForm from "@/components/FormList/popupForm";
import Form from "@/components/Form";
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { reactive, ref, toRefs } from "vue";
import { salesList } from "@/api/common";
import {
    batchAdjustmentValidityPeriod,
    courseCardEnabled,
    memberChangeSale,
    memberCourseCardsList,
} from "@/api/membershipCourseCard";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { tabelFormConfig } from "@/utils/config";
export default {
    components: {
        Form,
        formList,
        Table,
        popupForm,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        //store.getters.activeSchoolId,store.getters.activeClassId,
        const hallIdObj = reactive({ hallId: store.getters.activeHallId });
        const TableList = ref(null);
        const state = reactive({
            /*销售*/
            SalesModal: false,
            SalesData: {},
            SalesBut: false, //防止重复
            SalesList: [
                {
                    el: "select",
                    label: "销售",
                    code: "salesId",
                    fun: salesList,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            label: v.name,
                            value: v.id + "",
                        })),
                },
            ],
            SalesButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        if (!state.SalesBut) {
                            state.SalesBut = true;
                            memberChangeSale({
                                saleManId: value.salesId,
                                memberCourseCardIds: state.tableSelectData,
                            })
                                .then(() => {
                                    ElMessage.success("修改成功");
                                    state.SalesModal = false;
                                    TableList.value.update();
                                    state.SalesBut = false;
                                })
                                .catch(() => {
                                    state.SalesBut = false;
                                });
                        }
                    },
                },
            ],
            /*有效期*/
            validityShow: false,
            topUpData: {},
            validityList: [
                {
                    type: "Number",
                    label: "有效期延长天数",
                    code: "day",
                    checkType: "number",
                    required: true,
                    disabled: false,
                    valueChange: (val, obj) => {
                        obj.day = Math.round(val);
                    },
                },

                {
                    label: "延长理由",
                    type: "textarea",
                    code: "reason",
                    maxlength: 500,
                    required: false,
                },
                {
                    required: false,
                    el: "checkbox",
                    label: "包含类型",
                    code: "includeType",
                    default: ["10", "-10", "-20", "30", "-30"],
                    list: [
                        { value: "10", label: "正常" },
                        { value: "-10", label: "停卡" },
                        { value: "-20", label: "关卡" },
                        { value: "30", label: "转卡" },
                        { value: "-30", label: "请假" },
                    ],
                },
            ],
            validityBut: false, //防止重复点击
            validityButtons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        if (value.includeType) {
                            value.includeType = value.includeType
                                .split(",")
                                .map((item) => {
                                    item = Math.round(item);
                                    return item;
                                });
                        }
                        console.log(state.tableSelectData);
                        let data = {
                            day: value.day,
                            includeType: value.includeType,
                            memberCourseCardIds: state.tableSelectData,
                            reason: value.reason,
                        };
                        if (!state.validityBut) {
                            state.validityBut = true;
                            batchAdjustmentValidityPeriod(data)
                                .then((res) => {
                                    ElMessage.success("批量调整成功");
                                    state.validityShow = false;
                                    TableList.value.update();
                                    state.validityBut = false;
                                })
                                .catch(() => {
                                    state.validityBut = false;
                                });
                        }

                        // ValidityPeriodAdjustment({
                        //     ...value,
                        //     startDateAfter: value.validityDate[0]+' '+"00:00:00",
                        //     endDateAfter: value.validityDate[1]+' '+"00:00:00",
                        //     memberCourseCardId:id
                        // })
                        //     .then(() => {
                        //         ElMessage.success("操作成功");
                        //         state.validityShow = false;
                        //     });
                    },
                },
            ],
            //
            config: {
                ...tabelFormConfig,
                inputStyle: {
                    width: "200px",
                },
            },
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
                    name: "批量调整有效期",
                    click: (value) => {
                        if (state.tableSelectData.length > 0) {
                            state.validityShow = true;
                            state.tableSelectData = state.tableSelectData.map(
                                (item) => {
                                    item = item.id;
                                    return item;
                                }
                            );
                        } else {
                            ElMessage.warning("请先勾选数据！");
                        }
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "批量修改销售",
                    click: (value) => {
                        if (state.tableSelectData.length > 0) {
                            state.SalesModal = true;
                            state.tableSelectData = state.tableSelectData.map(
                                (item) => {
                                    item = item.id;
                                    return item;
                                }
                            );
                        } else {
                            ElMessage.warning("请先勾选数据！");
                        }
                    },
                },
            ],
            tableSelectData: [], //多选
            count: 0,
            formList: [
                {
                    label: "模糊查询",
                    code: "keyword",
                    suffix_icon: "el-icon-search",
                    // labelWidth: "91px",
                    placeholder: "会员名字或手机号或卡号或卡名",
                },
                {
                    el: "date",
                    label: "失效日期",
                    code: "endDate",
                    width: "100%",
                    // labelWidth: "72px",
                },
                {
                    el: "select",
                    label: "课程卡类型",
                    code: "type",
                    // labelWidth: "97px",
                    list: [
                        { value: "1", label: "次卡" },
                        { value: "2", label: "期限卡" },
                    ],
                },
                {
                    el: "select",
                    label: "上课类型",
                    code: "courseType",
                    list: [
                        { label: "团课", value: "1" },
                        { label: "私教课", value: "2" },
                        { label: "小班课", value: "4" },
                    ],
                },
                {
                    el: "select",
                    label: "状态",
                    code: "status",
                    list: [
                        { value: "10", label: "正常" },
                        { value: "-10", label: "停卡" },
                        { value: "-20", label: "关卡" },
                        { value: "30", label: "转卡" },
                        { value: "-30", label: "请假" },
                    ],
                },
                {
                    el: "select",
                    label: "销售",
                    code: "salesmanId",
                    fun: salesList,
                    filterable: true,
                },
            ],
            formInitData: {},
            formDatas: {},
            column: [
                { label: "课程卡名", prop: "courseCardName" },
                { label: "卡号", prop: "cardNo" },
                { label: "绑定会员", prop: "memberName" },
                { label: "手机号", prop: "phone" },
                { label: "销售员", prop: "salesmanName" },
                { label: "生效日", prop: "startDate" },
                { label: "失效日", prop: "endDate" },
                { label: "余额次数", prop: "balance",html:(val)=>val.courseCardType===1?val.balance+"次":val.balance+"天" },
                {
                    label: "状态",
                    prop: "status",
                    html: (val) => {
                        let htmlStr = "";
                        switch (true) {
                            case val.status == 10:
                                htmlStr = `<span>正常</span>`;
                                break;
                            case val.status == -10:
                                htmlStr = `<span>停卡</span>`;
                                break;
                            case val.status == -20:
                                htmlStr = `<span>关卡</span>`;
                                break;
                            case val.status == 30:
                                htmlStr = `<span>转卡</span>`;
                                break;
                            case val.status == -30:
                                htmlStr = `<span >请假</span>`;
                                break;
                            default:
                                break;
                        }
                        return htmlStr;
                    },
                },
                { label: "最近上课时间", prop: "lastUseTime" },
                {
                    prop: "action",
                    label: "操作",
                    fixed: "right",
                    width: 180,
                    actives: [
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/membershipCourseCardm/details",
                                    query: {
                                        id: val.id,
                                        type: "basicInfo",
                                        mobile: val.phone,
                                        vipName: val.memberName,
                                        courseCardId: val.courseCardId,
                                        coursePlanId: val.coursePlanId,
                                    },
                                });
                            },
                        },
                        {
                            // perCode:'',
                            name: "编辑",
                            method: (val) => {
                                router.push({
                                    path: "/membershipCourseCardm/details",
                                    query: {
                                        id: val.id,
                                        type: "basicInfo",
                                        mobile: val.phone,
                                        vipName: val.memberName,
                                        courseCardId: val.courseCardId,
                                        coursePlanId: val.coursePlanId,
                                        butShow: 1,
                                        status: val.status,
                                    },
                                });
                            },
                        },
                        {
                            // perCode:'',
                            name: (val) => (val.status == -10 ? "启用" : ""),
                            method: (val) => {
                                ElMessageBox.confirm(
                                    `确认启用课程卡名为： ${val.courseCardName} 这条数据?`,
                                    "确认提示",
                                    {
                                        confirmButtonText: "确定",
                                        cancelButtonText: "取消",
                                        type: "warning",
                                    }
                                ).then(() => {
                                    courseCardEnabled({ id: val.id }).then(
                                        (res) => {
                                            ElMessage.success("设置成功");
                                            TableList.value.update({
                                                ...hallIdObj,
                                            });
                                        }
                                    );
                                });
                            },
                        },
                    ],
                },
            ],
            getList: memberCourseCardsList,
        });
        //多选
        const tableSelect = (val) => {
            state.tableSelectData = val;
        };
        const onSubmits = (event) => {
            state.newFormDatas = { ...event, ...dateStartEnd, ...hallIdObj };
            TableList.value.update(state.newFormDatas);
        };
        let dateStartEnd = reactive({});
        const reset = () => {
            state.formDatas = dateStartEnd = {};
            TableList.value.update({ ...hallIdObj });
        };
        return {
            TableList,
            hallIdObj,
            reset,
            ...toRefs(state),
            onSubmits,
            tableSelect,
        };
    },
};
</script>

<style lang="scss" scoped></style>
