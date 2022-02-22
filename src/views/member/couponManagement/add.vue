<!--
 * @Author: 郑晶
 * @Date: 2021-12-28 16:33:01
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-29 10:26:00
 * @Description: 会员-优惠券管理
-->
<template>
    <emptyBox bottom="70">
        <formList
            ref="formListRef"
            :formInitData="formInitData"
            :itemList="itemList"
            :buttons="buttons"
            :config="config"
            @formChange="formChange"
        >
        </formList>
    </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";
import { toRefs, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { ElMessage } from "element-plus";
import { accessChannelLists, couponsLimit } from "@/utils/enum/select";
import {
    addMemberCoupon,
    MemberCouponDetail,
    updateMemberCoupon,
} from "@/api/member";

export default {
    components: {
        formList,
        emptyBox,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            formInitData: {},
            config: { ...addFormBottom },
            itemList: [
                {
                    label: "名称",
                    code: "name",
                    maxlength: 50,
                },
                {
                    el: "select",
                    label: "类型",
                    code: "type",
                    list: [{ label: "代金券", value: "1" }],
                    default: "1",
                },
                {
                    el: "select",
                    label: "获取渠道",
                    code: "accessChannel",
                    list: accessChannelLists,
                    valueChange: (item, row) => {
                        let list = [
                            {
                                code: "purchaseLimit",
                                show: +item === 6 || +item === 3,
                                label: +item === 6 ? "限购数量" : "限兑数量",
                            },
                            {
                                code: "price",
                                required: +item === 6 ? true : false,
                                show: +item === 6 ? true : false,
                            },
                            // { code: "buyTime", show: +item === 6 },
                        ];
                        return {
                            list,
                        };
                    },
                },
                {
                    el: "select",
                    label: "使用限制",
                    code: "useLimit",
                    list: couponsLimit,
                    multiple: true,
                    backType: "ArrayString",
                },
                {
                    label: "优惠券面额",
                    code: "discount",
                    maxlength: 50,
                    checkType: "numberPoint2",
                    suffix: "元",
                },
                {
                    label: "价格",
                    code: "price",
                    maxlength: 50,
                    checkType: "numberPoint2",
                    suffix: "元",
                    show: false,
                },
                {
                    el: "date",
                    code: "buyTime",
                    type: "datetimerange",
                    otherCodeArr: ["sellStartAt", "sellEndAt"],
                    label: "购买时间",
                    // isRange: true,
                    // show: false,
                },
                {
                    label: "有效天数",
                    code: "effectiveDays",
                    checkType: "numbers",
                    valueChange: (val, data) => {
                        let list = [
                            {
                                code: "effectiveTime",
                                required: val > 0 || val ? false : true,
                            },
                            {
                                code: "expirationTime",
                                required: val > 0 || val ? false : true,
                            },
                            {
                                code: "effectiveDays",
                                required: true,
                            },
                        ];
                        return {
                            list,
                            formObj: {
                                ...data,
                                effectiveTime: "",
                                expirationTime: "",
                            },
                        };
                    },
                },
                {
                    el: "date",
                    code: "effectiveTime",
                    label: "生效时间",
                    required: false,
                    valueChange: (val, data) => {
                        let list = [
                            {
                                code: "effectiveDays",
                                required: val ? false : true,
                            },
                            {
                                code: "effectiveTime",
                                required: true,
                            },
                            {
                                code: "expirationTime",
                                required: true,
                            },
                        ];
                        return {
                            list,
                            formObj: {
                                ...data,
                                effectiveDays: "",
                            },
                        };
                    },
                },
                {
                    el: "date",
                    code: "expirationTime",
                    label: "过期时间",
                    checkFun: (val, { effectiveTime }) => {
                        if (effectiveTime) {
                            let data = new Date(val).getTime() / 1000;
                            let datas =
                                new Date(effectiveTime).getTime() / 1000;
                            if (data < datas) {
                                return "过期时间必须大于生效时间";
                            }
                        } else {
                            return "请输入生效时间";
                        }
                    },
                    required: false,
                },
                {
                    label: "数量",
                    code: "amount",
                    required: false,
                    type: "number",
                },
                {
                    label: "限购数量",
                    code: "purchaseLimit",
                    show: false,
                    required: false,
                    type: "number",
                },
                {
                    el: "textArea",
                    label: "备注",
                    code: "remark",
                    required: false,
                    maxlength: 60,
                    row: 10,
                },
            ],
            formState: [],
            id: "",
            // 表单变化
            formChange: (val) => {
                let { code, value } = val;
                state.formInitData[code] = value;
            },
            // 按钮
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        if (state.id) {
                            updateMemberCoupon(value).then(
                                ({ code, data, msg }) => {
                                    if (code === 200 && data) {
                                        ElMessage.success({
                                            message: msg || "操作成功",
                                            duration: 500,
                                            onClose: () => {
                                                router.go(-1);
                                            },
                                        });
                                    } else {
                                        ElMessage.error({
                                            message: msg || "操作失败",
                                        });
                                    }
                                }
                            );
                        } else {
                            // 新增
                            addMemberCoupon(value).then(
                                ({ code, data, msg }) => {
                                    if (code === 200 && data) {
                                        ElMessage.success({
                                            message: msg || "操作成功",
                                            duration: 500,
                                            onClose: () => {
                                                router.go(-1);
                                            },
                                        });
                                    } else {
                                        ElMessage.error({
                                            message: msg || "操作失败",
                                        });
                                    }
                                }
                            );
                        }
                    },
                },
            ],
            // 初始化
            start: () => {
                if (useRoute().query) {
                    const { id, type } = useRoute().query;
                    state.id = id;
                    // 详情页面禁用
                    if (type) {
                        state.config = {
                            ...state.config,
                            default: {
                                disabled: true,
                            },
                        };
                        state.buttons = [
                            {
                                name: "返回",
                                click: () => {
                                    router.go(-1);
                                },
                            },
                        ];
                    }
                    // 查询详情
                    id &&
                        MemberCouponDetail({ id: state.id }).then(
                            ({ data, code }) => {
                                if (code === 200) {
                                    console.log(data, "查询详情");
                                    state.formInitData = data;
                                    state.formInitData.useLimit =
                                        state.formInitData.useLimitList;
                                }
                            }
                        );
                }
            },
        });
        state.start();
        return {
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
