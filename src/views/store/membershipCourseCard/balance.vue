<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-18 10:57:20
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-28 17:38:49
 * @Descripttion:操作余额调整
-->

<template>
    <div v-if="formDatas">
        <Form
            :formDatas="formDatas"
            :formList="formList"
            :isBut="false"
            :iconSelect="false"
            :formItemStyle="{ width: '400px' }"
            labelWidth="138px"
            ref="formDataInfo"
        >
        </Form>

        <!-- 支付信息 -->
        <div class="contract">
            <!-- 支付类型 -->
            <div class="typePay">
                <!-- 支付类型组件 -->
                <payType
                    :formDatas="formDatasTypePay"
                    :dialog="dialog"
                    ref="formDatasTypePayRef"
                ></payType>
                <div class="but_pay">
                    <el-button size="small" @click="back">返回 </el-button>
                    <el-button
                        size="small"
                        v-if="dialog"
                        type="primary"
                        @click="submitAll"
                        >确定
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    toRefs,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import Form from "@/components/Form";
import Table from "@/components/Table";
import UploadImgDrag from "@/components/uploadImg";
import payType from "@/views/store/membershipCourseCard/cardPayType";
import {
    addBalanceAdjustment,
    addBalanceAdjustmentDetails,
    memberCourseCardsDetail,
} from "@/api/membershipCourseCard";

export default defineComponent({
    components: { Form, Table, payType, UploadImgDrag },
    setup() {
        const router = useRouter();
        const route = useRoute();
        //逻辑层主体
        const formDataInfo = ref(null);
        const queryObj = reactive(route.query);
        let details=null
        const state = reactive({
            dialog: queryObj.dialog == "true",
            formDatas: {},
            sell: null,
            /* 数组基础逻辑 会员是否首次开卡
                           卡规格 次卡自定义(次数) 单价：价格/次数 期限卡自定义(天数)
            */
            formList: [
                { label: "会员", code: "memberName", disabled: true },
                { label: "课程卡", code: "courseCardName", disabled: true },
                { label: "余额", code: "balance", disabled: true },
                {
                    label: "剩余价值",
                    code: "surplusValue",
                    disabled: true,
                } /*actualPrice*/,
                {
                    el: "radioButton",
                    code: "type",
                    label: "调整数量",
                    radios: [
                        { name: "增加", id: "1" },
                        { name: "减少", id: "-1" },
                    ],
                    disabled: queryObj.dialog == "false",
                    required: true,
                    change: (val, item, data) => {
                        data.type = val;
                        if (data.adjustAmount) {
                            data.payMoney = mathNumberTwo(
                                parseFloat(data.price) *
                                    data.adjustAmount *
                                    val
                            );
                            formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                data.payMoney;
                        }
                    },
                },
                {
                    type: "Number",
                    labelShow: false,
                    code: "adjustAmount",
                    suffix:``,
                    maxlength: 10,
                    class: "",
                    rules: "number",
                    disabled: queryObj.dialog == "false",
                    change: (val, item, data) => {
                        //单独触发校验
                        console.log("dddddddd",data);
                        formDataInfo.value.formDataInfo.validateField(
                            "adjustAmount",
                            (err) => {
                                if (err) {
                                    return false;
                                } else {
                                    data.adjustAmount = val;
                                    if (data.type) {
                                        data.payMoney = mathNumberTwo(
                                            parseFloat(data.price) *
                                                val *
                                                data.type
                                        );
                                        formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                            data.payMoney;
                                    }
                                }
                            }
                        );
                    },
                },
                {
                    disabled: queryObj.dialog == "false",
                    label: "支付金额",
                    code: "payMoney",
                    suffix: "元",
                    maxlength: 10,
                    class: "",
                    change: (val) => {
                        formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                            val;
                    },
                },
                {
                    el: "textarea",
                    label: "备注",
                    code: "remark",
                    disabled: false,
                },
            ],

            //支付修改弹框
            dialogVisibleLog: false,
            dialogVisiblePay: false,
            //支付类型数据双向绑定
            formDatasTypePay: {},
            payTypeUpDom: false,
        });
        const mathNumberTwo = (val = 0) => {
            return Math.round(val * 100) / 100;
        };
        //count或book.name改变了
        // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
        computed(() => {});

        onMounted(() => {
            memberCourseCardsDetail({ id: queryObj.id }).then((res) => {
                details=res.data
                let index=state.formList.findIndex((item)=>item.code=='adjustAmount')
                state.formList[index].suffix=res.data.type==1?'次':'天'

                state.formDatas = {
                    courseCardName: res.data.courseCardName,
                    courseCardId: res.data.courseCardId,
                    memberName: res.data.memberName,
                    memberId: res.data.memberId,
                    balance: res.data.balance,
                    surplusValue: res.data.surplusValue,
                    type: "1",
                    price:res.data.price
                };
                console.log("ssss",details);
                if (queryObj.balanceId) {
                    detail();
                }
            });
        });

        onBeforeUnmount(() => {});

        const back = () => {
            router.go(-1);
        };

        //详情
        const detail = () => {
            addBalanceAdjustmentDetails({ id: queryObj.balanceId }).then(
                (res) => {
                    if (res.data.payMoney < 0) {
                        state.formDatas.type = "-1";
                    }
                    state.formDatas.payMoney = res.data.payMoney;
                    state.formDatas.adjustAmount = res.data.adjustAmount;
                    nextTick(() => {
                        state.formDatasTypePay = res.data;
                        if (state.formDatasTypePay) {
                            state.formDatasTypePay.status = 20;
                        }
                        state.formDatasTypePay.actualPrice = res.data.payMoney;
                        state.formDatasTypePay.orderPaymentLogList =
                            res.data.paymentList;
                    });
                }
            );
        };

        const dialogVisibleSellFn = () => {
            state.dialogVisibleSell = true;
        };

        const formDatasTypePayRef = ref(null);
        const formDatasTypePayRefDialog = ref(null);

        let options = {};
        //支付数据处理
        const processingData = (formDate) => {
            let { orderPaymentLogList, collectionTime, paymentType } = formDate;
            //单一处理
            if (paymentType == 1) {
                let { actualPrice, tradeNo, channel } = formDate;
                orderPaymentLogList = [
                    { amount: actualPrice, tradeNo, channel },
                ];
            }
            options = {
                memberCourseCardId: queryObj.id,
                collectionTime,
                paymentList: orderPaymentLogList,
                payType: 1,
            };
            return options;
        };
        let subBut = false;
        //数据汇总提交
        const submitAll = async () => {
            let balanceData;
            let options;
            let OneForm;
            await formDataInfo.value.formDataInfo.validate((val) => {
                if (val) {
                    OneForm = val;
                    balanceData = formDataInfo.value.formDataInfo.model;
                }
            });
            await formDatasTypePayRef.value.formDataInfoPayType.scrollIntoViewFn(
                "onSubmit",
                (formDate) => {
                    if (OneForm) {
                        options = {
                            ...processingData(formDate),
                            ...balanceData,
                        };
                        if (!subBut) {
                            subBut = true;
                            addBalanceAdjustment({ ...options })
                                .then((res) => {
                                    if (res.data) {
                                        ElMessage.success("调整成功");
                                        back();
                                    } else {
                                        ElMessageBox.confirm(
                                            `当前余额少于会员已分配次数，继续调整将清除分配次数，是否继续?`,
                                            "确认提示",
                                            {
                                                confirmButtonText: "确定",
                                                cancelButtonText: "取消",
                                                type: "warning",
                                            }
                                        ).then(() => {
                                            options.confirm = true;
                                            addBalanceAdjustment({
                                                ...options,
                                            }).then((res) => {
                                                res.data
                                                    ? ElMessage.success(
                                                          "调整成功"
                                                      ) && back()
                                                    : ElMessage.success(
                                                          "调整失败"
                                                      );
                                            });
                                        });
                                    }
                                    subBut = false;
                                })
                                .catch(() => {
                                    subBut = false;
                                });
                        }
                    }

                    // courseOrderPay(options).then(res => {
                    //     if (res.code == 200) {
                    //         ElMessage({
                    //             message: '支付成功', type: 'success',
                    //             duration: 1000,
                    //             onClose: () => {
                    //             }
                    //         });
                    //     }
                    // });
                }
            );
        };
        return {
            ...toRefs(state),
            formDataInfo,
            print,
            router,
            submitAll,
            formDatasTypePayRef,
            formDatasTypePayRefDialog,
            dialogVisibleSellFn,
            queryObj,
            back,
        };
    },
});
</script>
<style lang="scss" scoped>
.but_pay {
    margin-left: 60px;
}

#edit {
    font-size: 14px;
    color: red;
    margin-left: -27px;
}

#qrcode {
    width: 150px;
    height: 150px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 87px;
}

.first {
    position: absolute;
    top: 0;
    right: -129px;
    color: #38f;
}

.dialog {
    display: inline-block;
    position: absolute;
    top: 0;
    right: -206px;

    button {
        margin-right: 10px;
    }
}

.contract {
    min-width: 620px;

    .typePay {
        position: relative;
    }

    .amend {
        z-index: 2021;
        position: absolute;
        top: 0;
        left: 343px;

        button {
            margin-right: 10px;
        }
    }

    h4 {
        text-indent: 54px;
    }

    b {
        display: inline-block;
        font-weight: normal;
        width: 125px;
        text-align: right;
        margin-right: 16px;
    }

    .required {
        &::before {
            content: "*";
            color: var(--el-color-danger);
            margin-right: 4px;
        }
    }

    .appendixesUpdateFn {
        height: 20%;
    }

    .tipsContract {
        display: inline-block;
        margin-left: 42px;
        font-size: 14px;
        color: #999;
    }

    .paperId {
        display: inline-block;
        margin-right: 20px;
    }

    p {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;

        span {
            display: inline-block;
            color: red;
            margin-right: 8px;
        }

        a {
            color: blue;
        }
    }

    img {
        width: 150px;
        height: 150px;
        vertical-align: top;
        margin-right: 20px;
    }
}

.but {
    display: flex;
    position: fixed;
    bottom: 29px;
    left: 50%;
}
</style>
<style lang="scss">
.clearColon {
    position: relative;
}

.clearColon::after {
    content: "";
    position: absolute;
    top: 0;
    left: -26px;
    width: 10px;
    height: 29px;
    background: white;
}
</style>
