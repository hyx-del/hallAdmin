<template>
    <div>
        <formList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :select="tableSelect"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            title="发券"
            :itemList="popItemList"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { ElMessage, ElMessageBox } from "element-plus";

import { toRefs, ref, reactive, computed } from "vue";
import {
    courseListClass,
    updateCourseStatus,
    deleteCourse,
    courseList,
} from "@/api/school";
import { useRouter } from "vue-router";
import { confirmBox, deleteItem, messageBox } from "@/utils/tools";
import { coursePage, replierCourseCommentAPI } from "@/api/course";
import {
    accessChannelList,
    couponStatusList,
    courseTypeList,
    displayList,
    enableDisable,
    getListHtml,
    isNot,
    testList,
    usedList,
} from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm";
import { testApi } from "@/api/managerStaff";
import {
    memberCouponBoxList,
    memberCouponInvalidPut,
    memberCouponIssueCouponPost,
    memberCouponList,
    memberCouponWriteOffPut,
} from "@/api/memberCoupon";
import {
    getAllCityAndHallList,
    getSelectHallListAPI,
    memberOptions,
} from "@/api/common";
import { couponBoxList } from "@/api/coupon";
import { tabelFormConfig } from "@/utils/config";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            popShow: false,
            popFormInitData: {},
            // 确认
            popButtons: [
                {
                    text: "取消",
                    click: () => (state.popShow = false),
                },
                {
                    funType: "confirm",
                    type: "primary",
                    text: "确定",
                    click: ({ value }) => {
                        console.log(value);
                        memberCouponIssueCouponPost({ ...value }).then(
                            (res) => {
                                if (res.code == 200) {
                                    state.popShow = false;
                                    TableList.value.update();
                                }
                            }
                        );
                    },
                },
            ],
            popItemList: [
                {
                    el: "select",
                    code: "couponId",
                    label: "优惠券",
                    fun: couponBoxList,
                },
                {
                    el: "select",
                    code: "memberIds",
                    label: "搜索会员",
                    multiple: true, // 多选
                    filterable: true, // 可搜索
                    remote: true, // 可接收
                    reserveKeyword: true, //保留搜索关键词
                    remoteMethod: (keyword) => ({ keyword }),
                    fun: memberOptions,
                    tips: "输入搜索，下拉选中",
                    backType: "Array",
                },
                {
                    code: "amount",
                    label: "发券数量",
                    type: "number",
                    checkType: "number",
                    maxlength: 6,
                },
                {
                    el: "select",
                    code: "hallId",
                    label: "适用场馆",
                    filterable: true, // 可搜索
                    fun: getSelectHallListAPI,
                    required: false,
                },
            ],
            getList: memberCouponList,
            tableSelect: (val) => {
                state.tableSelectData = val;
            },
            tableSelectData: [],
            couponWriteOffPut: (list) => {
                let data = list.map((v) => v.id);
                memberCouponWriteOffPut({ memberCouponIds: data }).then(
                    (res) => {
                        console.log(res);
                    }
                );
            },
            column: [
                {
                    prop: "memberName",
                    label: "会员",
                },
                {
                    prop: "phone",
                    label: "会员手机号",
                },
                {
                    prop: "couponName",
                    label: "优惠券",
                },
                {
                    prop: "discount",
                    label: "优惠金额",
                },
                {
                    prop: "actualTotal",
                    label: "支付金额",
                },
                {
                    prop: "accessChannel",
                    label: "获取渠道",
                    html: (row, val) => getListHtml(accessChannelList, val),
                },
                {
                    prop: "operatorName",
                    label: "发放人",
                },
                {
                    prop: "couponStatus",
                    label: "优惠券状态",
                    html: (row, val) => getListHtml(couponStatusList, val),
                },
                {
                    prop: "used",
                    label: "使用状态",
                    html: (row, val) => getListHtml(usedList, val),
                },
                {
                    prop: "hallName",
                    label: "适用场馆",
                },
                {
                    prop: "effectiveTime",
                    label: "生效时间",
                },
                {
                    prop: "expirationTime",
                    label: "到期时间",
                },
                {
                    prop: "expired",
                    label: "是否过期",
                    html: (row, val) => (val ? "是" : "否"),
                },
                {
                    prop: "invalid",
                    label: "是否作废",
                    html: (row, val) => {
                        return val ? "是" : "否";
                    },
                },
                {
                    prop: "collectionTime",
                    label: "获取时间",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 200,
                    actives: [
                        {
                            name: (row, value) => (row.invalid ? "" : "作废"),
                            method: (row) => {
                                confirmBox(
                                    memberCouponInvalidPut,
                                    { memberCouponIds: [row.id] },
                                    TableList,
                                    { title: "是否作废" }
                                );
                            },
                        },
                        {
                            name: (row, value) => (row.used == 2 ? "核销" : ""),
                            method: (row) => {
                                confirmBox(
                                    memberCouponWriteOffPut,
                                    { memberCouponIds: [row.id] },
                                    TableList,
                                    { title: "是否核销" }
                                );
                            },
                        },
                    ],
                },
            ],
            formInitData: {},
            config: {
                ...tabelFormConfig,
                inputStyle: {
                    width: "200px",
                },
            },
            itemList: [
                {
                    lableShow: false,
                    code: "name",
                    label: "会员名称",
                },
                {
                    lableShow: false,
                    code: "phone",
                    label: "会员电话",
                },
                {
                    lableShow: false,
                    code: "couponName",
                    label: "优惠券名称",
                },
                {
                    el: "select",
                    code: "used",
                    label: "使用情况",
                    list: usedList,
                },
                {
                    el: "select",
                    code: "accessChannel",
                    label: "获取渠道",
                    list: accessChannelList,
                },
                {
                    el: "select",
                    code: "couponStatus",
                    label: "优惠券状态",
                    list: couponStatusList,
                },
                {
                    el: "select",
                    code: "expired",
                    label: "是否过期",
                    list: isNot,
                },
                {
                    el: "select",
                    code: "invalid",
                    label: "是否作废",
                    list: isNot,
                },
            ],
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({ ...value });
                    },
                },
                {
                    name: "发券",
                    click: (value) => {
                        state.popShow = true;
                    },
                },
                {
                    name: "批量发券",
                    click: (value) => {},
                },
                {
                    name: "下载模板",
                    click: (value) => {},
                },
                {
                    name: "导入excle",
                    click: (value) => {},
                },
                {
                    name: "批量核销",
                    disabled: computed(() => state.tableSelectData.length == 0),
                    click: (value) => {
                        let list = state.tableSelectData.map((v) => v.id);
                        confirmBox(
                            memberCouponWriteOffPut,
                            { memberCouponIds: list },
                            TableList,
                            { title: "是否批量核销" }
                        );
                    },
                },
                {
                    name: "批量作废",
                    disabled: computed(() => state.tableSelectData.length == 0),
                    click: (value) => {
                        let list = state.tableSelectData.map((v) => v.id);
                        confirmBox(
                            memberCouponInvalidPut,
                            { memberCouponIds: list },
                            TableList,
                            { title: "是否批量作废" }
                        );
                    },
                },
                {
                    name: "导出",
                    click: (value) => {},
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

<style lang="scss" scoped>
.name {
    cursor: pointer;
    color: #2e8de6;
}
</style>
