<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-19 10:57:20
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-28 17:38:54
 * @Descripttion:操作退卡
-->
<template>
    <div>
        <div>
            <div class="title">原卡信息</div>
            <Form
                :formDatas="formDatas"
                :formList="formList"
                :formItemStyle="{ width: '300px' }"
                :iconSelect="false"
                labelWidth="138px"
                :isBut="false"
            >
            </Form>
        </div>
        <div>
            <div class="title">退卡信息</div>
            <Form
                :formDatas="formDatasOut"
                ref="formDataInfo"
                :formList="formListOut"
                :isOnSubmits="dialog"
                onSubmits="确认提交"
                @onSubmit="onSubmitsCheckCard"
                :formItemStyle="{ width: '300px' }"
                :iconSelect="false"
                labelWidth="138px"
            >
                <template #img>
                    <div
                        class="image-slot"
                        v-if="
                            formDatasOut.appendixes &&
                            formDatasOut.appendixes.length
                        "
                    >
                        <el-image
                            style="width: 162px; height: 100px; display: flex"
                            v-for="(item, index) in formDatasOut.appendixes"
                            :key="index"
                            :src="item"
                            fit="cover"
                        >
                        </el-image>
                    </div>
                    <div class="null_img" v-else>暂无图片</div>
                </template>
            </Form>
        </div>
        <div>
            <div class="title">支付信息</div>
            <!-- 支付信息 -->
            <div class="contract">
                <!-- 支付类型 -->
                <div class="typePay">
                    <!-- 支付类型组件 -->
                    <payType
                        :formDatas="formDatasTypePay"
                        :dialog="false"
                        ref="formDatasTypePayRef"
                    ></payType>
                    <div class="but_pay">
                        <el-button size="small" @click="back">返回 </el-button>
                        <el-button
                            size="small"
                            v-if="formDatasOut.status == 10"
                            type="primary"
                            @click="submitAll"
                            >确定支付
                        </el-button>
                    </div>
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
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import Form from "@/components/Form";
import payType from "@/views/store/membershipCourseCard/cardPayType";
import {
    addCheckUpCard,
    CheckUpCardDetails,
    memberCourseCardsDetail,
    payCheckUpCard,
} from "@/api/membershipCourseCard";

export default defineComponent({
    components: { Form, payType },
    setup() {
        const router = useRouter();
        const formDataInfo = ref(null);
        const formDatasTypePayRef = ref(null);
        const route = useRoute();
        //逻辑层主体

        const queryObj = route.query;
        const state = reactive({
            dialog: queryObj.dialog == "true",
            formDatasTypePay: {},
            formDatas: {},
            formList: [
                { label: "卡类", code: "courseCardName", disabled: true },
                { label: "绑定会员", code: "memberName", disabled: true },
                {
                    label: "原卡余额",
                    code: "balance",
                    disabled: true,
                    suffix: "次/元",
                },
                { label: "原价", code: "price", disabled: true, suffix: "元" },
                {
                    label: "剩余价值",
                    code: "surplusValue",
                    disabled: true,
                    suffix: "元",
                },
            ],

            formDatasOut: {},
            formListOut: [
                {
                    label: "课程卡剩余价值",
                    code: "surplusPrice",
                    disabled: queryObj.dialog == "false",
                    suffix: "元",
                    rules: "numberPoint",
                    change: (val,obj) => {
                        //单独触发校验
                        formDataInfo.value.formDataInfo.validateField(
                            "surplusPrice",
                            (err) => {
                                if (err) {
                                    return false;
                                } else {
                                    state.formDatasOut.surplusPrice = val;
                                    if(!val){
                                        val=0
                                        state.formDatasOut.surplusPrice=0
                                    }
                                    state.formDatasOut.commission =
                                        mathNumberTwo(
                                            parseFloat(val) *
                                                parseFloat(
                                                    state.formDatasOut.rate
                                                )
                                        );
                                    state.formDatasOut.payMoney = mathNumberTwo(
                                        parseFloat(val) -
                                            parseFloat(
                                                state.formDatasOut.commission
                                            )
                                    );
                                    formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                        state.formDatasOut.payMoney;
                                }
                            }
                        );
                    },
                },
                {
                    label: "费率",
                    code: "rate",
                    disabled: queryObj.dialog == "false",
                    rules: "numberPoint",
                    change: (val) => {
                        //单独触发校验
                        formDataInfo.value.formDataInfo.validateField(
                            "rate",
                            (err) => {
                                state.formDatasOut.rate=val
                                if (!val){
                                    val=0
                                    state.formDatasOut.rate=0
                                }
                                if (err) {
                                    return false;
                                } else {
                                    if(val||val==0){
                                        state.formDatasOut.rate = val;
                                        state.formDatasOut.commission =
                                            mathNumberTwo(
                                                parseFloat(val) *
                                                parseFloat(
                                                    state.formDatasOut
                                                        .surplusPrice
                                                )
                                            );
                                        state.formDatasOut.payMoney = mathNumberTwo(
                                            parseFloat(
                                                state.formDatasOut.surplusPrice
                                            ) -
                                            parseFloat(
                                                state.formDatasOut.commission
                                            )
                                        );
                                        formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                            state.formDatasOut.payMoney;
                                    }

                                }
                            }
                        );
                    },
                },
                {
                    label: "手续费",
                    code: "commission",
                    disabled: queryObj.dialog == "false",
                    suffix: "元",
                    rules: "numberPoint",
                    change: (val) => {
                        //单独触发校验
                        formDataInfo.value.formDataInfo.validateField(
                            "commission",
                            (err) => {
                                if (err) {
                                    return false;
                                } else {
                                    state.formDatasOut.commission = val;
                                    state.formDatasOut.rate = mathNumberTwo(
                                        parseFloat(val) /
                                            parseFloat(
                                                state.formDatasOut.surplusPrice
                                            )
                                    );
                                    state.formDatasOut.payMoney = mathNumberTwo(
                                        parseFloat(
                                            state.formDatasOut.surplusPrice
                                        ) - parseFloat(val)
                                    );
                                    formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                        state.formDatasOut.payMoney;
                                }
                            }
                        );
                    },
                },
                {
                    label: "实际退款金额",
                    code: "payMoney",
                    disabled: true,
                    suffix: "元",
                    rules: "numberPoint",
                    change: () => {
                        //单独触发校验
                        formDataInfo.value.formDataInfo.validateField(
                            "payMoney",
                            (err) => {
                                if (err) {
                                    return false;
                                }
                            }
                        );
                    },
                },
                {
                    el: "upImg",
                    label: "附件",
                    code: "appendixes",
                    disabled: queryObj.dialog == "false",
                    limit: 6,
                    size: 1024,
                },
                {
                    el: "date",
                    label: "退卡日期",
                    code: "date",
                    disabled: queryObj.dialog == "false",
                    width: "162px",
                    required: true,
                },
                {
                    el: "textarea",
                    label: "备注",
                    code: "remark",
                    disabled: queryObj.dialog == "false",
                    width: "260px",
                    maxlength: "500",
                },
            ],
        });
        //支付数据处理
        let options = {};
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
                id: queryObj.detailsId,
                collectionTime,
                paymentList: orderPaymentLogList,
                payType: 1,
            };
            return options;
        };
        let payBut = false;
        //支付
        const submitAll = async () => {
            await formDatasTypePayRef.value.formDataInfoPayType.scrollIntoViewFn(
                "onSubmit",
                (formDate) => {
                    let options = { ...processingData(formDate) };
                    if (!payBut) {
                        payBut = true;
                        payCheckUpCard(options)
                            .then((res) => {
                                if (res.code == 200) {
                                    ElMessage({
                                        message: "支付成功",
                                        type: "success",
                                        duration: 1000,
                                        onClose: () => {},
                                    });
                                    back();
                                    payBut = false;
                                }
                            })
                            .catch(() => {
                                payBut = false;
                            });
                    }
                }
            );
        };
        //count或book.name改变了
        // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
        computed(() => {});
        onMounted(() => {
            memberCourseCardsDetail({ id: queryObj.id }).then((res) => {
                if (res.code == 200) {
                    state.formDatas = res.data;
                    if (!queryObj.detailsId) {
                        state.formDatasOut.surplusPrice = res.data.surplusValue;
                        state.formDatasOut.rate = 0.05;
                        state.formDatasOut.commission = mathNumberTwo(
                            parseFloat(res.data.surplusValue) *
                                state.formDatasOut.rate
                        );
                        state.formDatasOut.payMoney = mathNumberTwo(
                            parseFloat(res.data.surplusValue) -
                                state.formDatasOut.commission
                        );
                        nextTick(() => {
                            console.log("zhifu",state.formDatasOut.payMoney);
                            formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                state.formDatasOut.payMoney;
                        });
                    } else {
                        details();
                    }
                }
            });
        });

        //退卡信息
        const details = () => {
            if (queryObj.detailsId) {
                CheckUpCardDetails({ id: queryObj.detailsId }).then((res) => {
                    res.data.surplusPrice = res.data.surplusValue;
                    res.data.appendixes = JSON.parse(res.data.appendixes);
                    state.formDatasOut = res.data;
                    console.log('111111',state.formDatasOut.payMoney);
                    formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                        state.formDatasOut.payMoney;
                    if (res.data.orderPaymentLogList) {
                        nextTick(() => {
                            state.formDatasTypePay = res.data;
                            state.formDatasTypePay.actualPrice =
                                res.data.payMoney;
                        });
                    }
                    //  nextTick(()=>{
                    //     if (res.data.orderPaymentLogList) {
                    //         state.formDatasTypePay = res.data;
                    //         state.formDatasTypePay.actualPrice = res.data.payMoney
                    //         state.formDatasTypePay.collectionTime = "2022-01-24"
                    //         console.log(state.formDatasTypePay);
                    //     }
                    // })
                });
            }
        };
        let checkBut = false;
        //退卡信息提交
        const onSubmitsCheckCard = (event) => {
            if (event.appendixes && event.appendixes.length > 0) {
                event.appendixes = JSON.stringify(event.appendixes);
            }
            event.date = event.date + " " + "00:00:00";
            event = {
                ...event,
                memberCourseCardId: queryObj.id,
                refundPrice: event.payMoney,
            };
            if (!checkBut) {
                checkBut = true;
                addCheckUpCard({ ...event })
                    .then(() => {
                        ElMessage.success("退卡成功");
                        back();
                        checkBut = false;
                    })
                    .catch(() => {
                        checkBut = false;
                    });
            }
        };
        onBeforeUnmount(() => {});
        const mathNumberTwo = (val = 0) => {
            return Math.round(val * 100) / 100;
        };
        const back = () => {
            router.go(-1);
        };
        return {
            ...toRefs(state),
            back,
            submitAll,
            queryObj,
            formDatasTypePayRef,
            formDataInfo,
            mathNumberTwo,
            onSubmitsCheckCard,
        };
    },
});
</script>
<style lang="scss" scoped>
.but_pay {
    margin-left: 68px;
}

.title {
    width: 100%;
    padding: 10px 0;
    padding-left: 30px;
    border-bottom: 1px solid #d2cccc;
    font-weight: bold;
    margin-bottom: 20px;
}

.image-slot {
    display: inline-block;
    vertical-align: top;
    width: 60vh;
    height: auto;
    text-align: left;

    .el-image {
        margin-right: 5px;
        height: 150px;
    }
}

.null_img {
    vertical-align: top;
    line-height: 150px;
    text-align: center;
    width: 150px;
    height: 150px;
    display: inline-block;
    background: #f5f7fa;
    color: var(--el-text-color-placeholder);
}
</style>
<style lang="scss"></style>
