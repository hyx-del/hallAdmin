<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-18 10:57:20
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-28 17:38:41
 * @Descripttion:
-->
<template>
    <div>
        <div>
            <!--            <Form :formDatas="originalData"-->
            <!--                  :formList="formListData"-->
            <!--                  :formItemStyle="{width:'300px'}"-->
            <!--                  :iconSelect="false"-->
            <!--                  labelWidth="138px"-->
            <!--                  :isBut="false">-->
            <!--            </Form>-->
            <div>
                <div class="title">原卡信息</div>
                <Form
                    :formDatas="formDatas"
                    :formList="formList"
                    :formItemStyle="{ width: '360px' }"
                    :iconSelect="false"
                    labelWidth="138px"
                    :isBut="false"
                >
                </Form>
            </div>
            <formList
                ref="formListDataRef"
                :config="originalConfig"
                :itemList="formListData"
                :formInitData="originalData"
                :buttons="originalButtons"
                :formState="formState"
            />
            <div class="title">支付</div>
            <payType
                :formDatas="formDatasTypePay"
                :dialog="originalData.status == 1"
                ref="formDatasTypePayRef"
            ></payType>
            <div class="but_pay">
                <el-button @click="back" size="small">返回</el-button>
                <el-button
                    @click="onsubmit"
                    type="primary"
                    size="small"
                    v-if="originalData.status == 1"
                    >确定支付</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import payType from "@/views/store/membershipCourseCard/cardPayType";
import Form from "@/components/Form";
import formList from "@/components/FormList/index.vue";
import { toRefs, reactive, ref, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { addFormConfig } from "@/utils/config";
import { ElMessage } from "element-plus";
import {
    boxList,
    getSelectHallListAPI,
    memberOptions,
    salesList,
} from "@/api/common";
import {
    AddConversionRecord,
    conversionRecordDetails,
    memberCourseCardsDetail,
    transferCardPayment,
} from "@/api/membershipCourseCard";
import { hallCourseCardBoxList } from "@/api/hall";

// template
export default {
    components: {
        formList,
        Form,
        payType,
    },
    setup() {
        // const setList=
        const formListDataRef = ref(null);
        const formDatasTypePayRef = ref(null);
        const { id, addType, detailId } = useRoute().query;
        const router = useRouter();
        const state = reactive({
            //xialaList
            formState:[],
            xialaList:[],
            formDatas: {},
            formList: [
                { label: "卡类", code: "courseCardName", disabled: true },
                { label: "绑定会员", code: "memberName", disabled: true },
                {
                    label: "原卡余额",
                    code: "balance",
                    disabled: true,
                    suffix: "元",
                },
                { label: "原价", code: "price", disabled: true, suffix: "元" },
                {
                    label: "剩余价值",
                    code: "surplusValue",
                    disabled: true,
                    suffix: "元",
                },
            ],

            formDatasTypePay: {},
            // 搜索表单--搜索项
            originalList: [],
            // 搜索表格--配置
            originalConfig: {
                ...addFormConfig,
                button: {
                    style: {
                        marginLeft: "60px",
                    },
                },
            },
            // 搜索表格--数据
            originalData: {},
            // 搜索表格--按钮
            btnBool: false, //确认提交防止多次点击
            originalButtons:
                addType == "1"
                    ? [
                          {
                              name: "返回",
                              click: () => {
                                  router.back();
                              },
                          },
                          {
                              funType: "confirm",
                              type: "primary",
                              name: "确认提交",
                              click: ({ value }) => {
                                  let data;
                                  formListDataRef.value.ruleForm.validate(
                                      (val) => {
                                          if (val) {
                                              data = value;
                                              data.newBalance = parseFloat(
                                                  data.amount
                                              );
                                              data.oldBalance = parseFloat(data.oldBalance);
                                              if (
                                                  data.changeCardType.indexOf(
                                                      "1"
                                                  ) >= 0
                                              ) {
                                                  data.isTransformHall = 1;
                                              } else {
                                                  data.isTransformHall = 0;
                                              }
                                              if (
                                                  data.changeCardType.indexOf(
                                                      "2"
                                                  ) >= 0
                                              ) {
                                                  data.isTransformMember = 1;
                                              } else {
                                                  data.isTransformMember = 0;
                                              }
                                              if (
                                                  data.changeCardType.indexOf(
                                                      "3"
                                                  ) >= 0
                                              ) {
                                                  data.isTransformCard = 1;
                                              } else {
                                                  data.isTransformCard = 0;
                                              }
                                              // data.appendixes=''
                                              if (
                                                  data.toCourseCardSpecId ==
                                                  "自定义"
                                              ) {
                                                  data.toCourseCardSpecId = "";
                                              }
                                              //防止多次点击
                                              if (!state.btnBool) {
                                                  state.btnBool = true;
                                                  AddConversionRecord({
                                                      ...data,
                                                      memberId:
                                                          state.formDatas
                                                              .memberId,
                                                      memberCourseCardId:
                                                          state.formDatas.id,
                                                  })
                                                      .then(() => {
                                                          ElMessage.success(
                                                              "新增成功"
                                                          );
                                                          back();
                                                          state.btnBool = false;
                                                      })
                                                      .catch(() => {
                                                          state.btnBool = false;
                                                      });
                                              }
                                          }
                                      }
                                  );
                              },
                          },
                      ]
                    : [],
            formListData: [
                {
                    el: "itemSlot",
                    code: "sssaaa",
                    label: "卡类",
                    inItemSlot: {
                        el: "div",
                        text: "转卡信息",
                        style: {
                            borderBottom: "1px solid #d2cccc",
                            fontWeight: "bold",
                            paddingBottom: "20px",
                            marginBottom: "20px",
                        },
                    },
                },
                {
                    el: "checkBox",
                    code: "changeCardType",
                    label: "转卡类型",
                    valueStyle: {
                        width: "100%",
                    },
                    default: ["1", "2", "3"],
                    required: false,
                    disabled: addType == "0",
                    list: [
                        {
                            label: "转场馆",
                            value: "1",
                        },
                        {
                            label: "转会员",
                            value: "2",
                        },
                        {
                            label: "转卡种",
                            value: "3",
                        },
                    ],
                    valueChange: (val, obj) => {
                        //置空
                        if (val.indexOf("1") < 0) {
                            obj.toHallId = "";
                        }
                        if (val.indexOf("2") < 0) {
                            obj.toMemberId = "";
                        }
                        if (val.indexOf("3") < 0) {
                            obj.toCourseCardSpecId = "";
                            obj.toCourseCardId = "";
                            obj.amount = state.formDatas.balance;
                            obj.valuesPrice = state.formDatas.surplusValue || 0;
                        }
                        return [
                            {
                                code: "toHallId",
                                show: val.indexOf("1") >= 0,
                                required: true,
                                seriesCode:
                                    val.indexOf("3") >= 0
                                        ? "toCourseCardId"
                                        : 0,
                                seriesFun:
                                    val.indexOf("3") >= 0
                                        ? (memberId) => ({
                                              otherHallId: memberId,
                                          })
                                        : null,
                                valueChange:
                                    val.indexOf("3") >= 0
                                        ? (val, obj) => {
                                              obj.toCourseCardId = "";
                                              obj.toCourseCardSpecId = "";
                                              if (!val) {
                                                  obj.amount =
                                                      state.formDatas.balance;
                                                  obj.valuesPrice =
                                                      state.formDatas
                                                          .surplusValue || 0;
                                              }
                                          }
                                        : null,
                            },
                            {
                                code: "toMemberId",
                                show: val.indexOf("2") >= 0,
                                required: true,
                            },
                            {
                                code: "toCourseCardId",
                                show: val.indexOf("3") >= 0,
                                required: true,
                            },
                            {
                                code: "toCourseCardSpecId",
                                show: val.indexOf("3") >= 0,
                                required: true,
                            },
                        ];
                    },
                },
                {
                    disabled: addType == "0",
                    el: "select",
                    label: "场馆",
                    code: "toHallId",
                    show: false,
                    // seriesCode: "toCourseCardId",
                    // seriesFun: (memberId,formObj) => ({
                    //     otherHallId: memberId
                    // }),
                    fun: getSelectHallListAPI,
                    remoteMethod: (val) => ({ hallId: val }),
                    // valueChange:(val,obj)=>{
                    // if (obj.changeCardType.indexOf("3") < 0){
                    //     singleSpecification(val)
                    // }
                    // }
                },
                {
                    disabled: addType == "0",
                    el: "select",
                    label: "会员",
                    show: false,
                    code: "toMemberId",
                    fun: memberOptions,
                },
                {
                    filterable: true,
                    disabled: addType == "0",
                    show: false,
                    required: false,
                    el: "select",
                    label: "卡类",
                    code: "toCourseCardId",
                    valueChange:  (val,obj,se) => {
                        let type=""
                        state.xialaList.forEach(item=>{
                            if(item.id==val)type=item.type
                        })


                        console.log(type);
                        return  type==1?[
                                {
                                    code: "amount",
                                    label: "转卡后次数",
                                    suffix:"次"
                                }
                            ]: [{
                            code: "amount",
                            label: "转卡后天数",
                            suffix:"天"

                        }
                    ]



                    },
                    seriesCode: "toCourseCardSpecId", // 联动的下拉code
                    seriesFun: (memberId, formObj) => ({
                        courseCardId: memberId,
                        otherHallId: formObj.toHallId,
                    }),
                    fun: hallCourseCardBoxList,

                    remoteMethod: (val) => ({ courseCardId: val }),
                },

                {
                    firstRequest: false,
                    show: false,
                    required: false,
                    el: "select",
                    label: "规格",
                    funMode: (res) =>
                        res.data.push({ id: "自定义", name: "自定义" }) &&
                        res.data.map((v) => ({
                            value: "" + v.id,
                            label: `${v.name}`,
                        })),
                    code: "toCourseCardSpecId",
                    fun: boxList,
                    // remoteMethod: (val) => ({ ddd: val }),
                    valueChange: (val, obj) => {
                        if (addType != "0") {
                            if (val == "自定义") {
                                obj.amount = "";
                                obj.valuesPrice = "";
                                obj.price = state.formDatas.price;
                                return [
                                    {
                                        code: "amount",
                                        // label: "转卡后次数",
                                        required: true,
                                        disabled: false,
                                    },
                                    {
                                        code: "valuesPrice",
                                        // label: "转卡后总价",
                                        required: true,
                                        disabled: false,
                                    },
                                ];
                            } else {
                                boxList({
                                    courseCardId: obj.toCourseCardId,
                                }).then((res) => {
                                    res.data.forEach((item) => {
                                        if (item.id == val) {
                                            obj.amount = item.amount;
                                            obj.valuesPrice = item.price;
                                            obj.price = item.price;
                                            obj.validDays
                                                ? (obj.validDays =
                                                      obj.validDays)
                                                : (obj.validDays =
                                                      item.validDays);
                                            obj.actualPrice = item.price;
                                            obj.compensatioCard = mathNumberTwo(
                                                parseFloat(obj.actualPrice) -
                                                    parseFloat(obj.surplusValue)
                                            );
                                            obj.payMoney = mathNumberTwo(
                                                parseFloat(
                                                    obj.compensatioCard
                                                ) + parseFloat(obj.commission)
                                            );
                                            formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                                mathNumberTwo(
                                                    parseFloat(
                                                        obj.compensatioCard
                                                    ) +
                                                        parseFloat(
                                                            obj.commission
                                                        )
                                                ) || 0;
                                        }
                                    });
                                });
                                return [
                                    {
                                        code: "amount",
                                        required: true,
                                        disabled: true,
                                    },
                                    {
                                        code: "valuesPrice",
                                        required: true,
                                        disabled: true,
                                    },
                                ]
                            }
                        }
                    },
                    // list: [
                    //     { value: 1, label: "次卡" },
                    //     { value: 2, label: "期限卡" }
                    // ],
                    disabled: addType == "0",
                },
                {
                    disabled: addType == "0",
                    el: "select",
                    label: "销售",
                    code: "toSalesmanId",
                    fun: salesList,
                    filterable: true,
                    required: false,
                },
                {
                    code: "rate",
                    label: "费率",
                    type: "Number",
                    valueChange: (val, obj) => {
                        if (addType != "0") {
                            obj.rate = mathNumberTwo(val);
                            if (addType) {
                                formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                    mathNumberTwo(
                                        parseFloat(obj.compensatioCard || 0) +
                                            mathNumberTwo(
                                                parseFloat(obj.rate) *
                                                    parseFloat(
                                                        state.formDatas.price
                                                    )
                                            )
                                    ) || 0;
                                obj.payMoney =
                                    mathNumberTwo(
                                        parseFloat(obj.compensatioCard || 0) +
                                            mathNumberTwo(
                                                parseFloat(obj.rate) *
                                                    parseFloat(
                                                        state.formDatas.price
                                                    )
                                            )
                                    ) || 0;
                            }
                            return {
                                formObj: {
                                    commission: mathNumberTwo(
                                        parseFloat(obj.rate) *
                                            parseFloat(state.formDatas.price)
                                    ),
                                },
                            };
                        }
                    },
                    required: false,
                    disabled: addType == "0",
                },
                {
                    suffix:"元",
                    valueChange: (val, obj) => {
                        if (addType != "0") {
                            obj.commission = mathNumberTwo(val);
                            if (addType) {
                                formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                    mathNumberTwo(
                                        parseFloat(obj.adjustShortfall || 0) +
                                            parseFloat(obj.commission)
                                    ) || 0;
                            }
                            return addType
                                ? {
                                      formObj: {
                                          rate:
                                              mathNumberTwo(
                                                  parseFloat(obj.commission) /
                                                      parseFloat(
                                                          state.formDatas.price
                                                      )
                                              ) || 0,
                                          payMoney: mathNumberTwo(
                                              parseFloat(
                                                  obj.adjustShortfall || 0
                                              ) + parseFloat(obj.commission)
                                          ),
                                      },
                                  }
                                : null;
                        }
                    },
                    type: "Number",
                    code: "commission",
                    maxlength: 10,
                    class: "",
                    label: "手续费",
                    required: false,
                    disabled: addType == "0",
                },
                {
                    type: "Number",
                    code: "amount",
                    label: "转卡后次数",
                    required: true,
                    disabled: true,
                    suffix:"次",
                },
                {
                    type: "Number",
                    code: "valuesPrice",
                    label: "转卡后总价",
                    required: true,
                    valueChange: (val, obj) => {
                        if (addType != "0") {
                            obj.compensatioCard = mathNumberTwo(
                                parseFloat(val) - parseFloat(obj.surplusValue)
                            );
                            obj.actualPrice = val;
                            obj.payMoney = mathNumberTwo(
                                parseFloat(obj.compensatioCard) +
                                    parseFloat(obj.commission)
                            );
                            formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                mathNumberTwo(
                                    parseFloat(obj.compensatioCard) +
                                        parseFloat(obj.commission)
                                ) || 0;
                        }
                    },
                    suffix:"元",
                    disabled: true,
                },
                {
                    type: "Number",
                    code: "validDays",
                    label: "剩余有效天",
                    required: false,
                    disabled: addType == "0",
                    suffix:"天",
                    valueChange: (val, obj) => {
                        val >= 0
                            ? (obj.validDays = Math.round(val))
                            : (obj.validDays = Math.abs(val));
                    },
                },
                {
                    type: "Number",
                    code: "adjustPrice",
                    label: "调整价格",
                    valueChange: (val, obj) => {
                        if (addType != "0") {
                            obj.adjustPrice = mathNumberTwo(val);
                            val = mathNumberTwo(val);
                            if (val) {
                                obj.actualPrice = val;
                                obj.compensatioCard =
                                    mathNumberTwo(
                                        parseFloat(val) -
                                            parseFloat(obj.surplusValue)
                                    ) || 0;
                            } else {
                                obj.actualPrice = obj.valuesPrice;
                                obj.compensatioCard =
                                    mathNumberTwo(
                                        parseFloat(obj.valuesPrice) -
                                            parseFloat(obj.surplusValue)
                                    ) || 0;
                            }
                            if (!obj.adjustShortfall) {
                                obj.compensatioCard
                                    ? (obj.payMoney =
                                          mathNumberTwo(
                                              parseFloat(obj.compensatioCard) +
                                                  parseFloat(obj.commission)
                                          ) || 0)
                                    : null;
                            }
                            if (!obj.adjustShortfall) {
                                formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                    mathNumberTwo(
                                        parseFloat(obj.compensatioCard) +
                                            parseFloat(obj.commission)
                                    ) || 0;
                            }
                        }
                    },
                    required: false,
                    disabled: addType == "0",
                    suffix:"元",
                },
                {
                    code: "surplusValue",
                    label: "原卡剩余价值",
                    required: false,
                    disabled: true,
                    suffix:"元",
                },
                {
                    code: "actualPrice",
                    label: "新卡实际价格",
                    required: false,
                    disabled: true,
                    suffix:"元",
                },
                {
                    code: "compensatioCard",
                    label: "转卡补差价",
                    required: false,
                    disabled: true,
                    suffix:"元",
                },
                {
                    code: "adjustShortfall",
                    type: "Number",
                    label: "调整转卡补差",
                    disabled: addType == "0",
                    rules: "numberPoint2",
                    maxlength: 8,
                    required: false,
                    valueChange: (val, obj) => {
                        if (addType != "0") {
                            obj.adjustShortfall = mathNumberTwo(val);
                            val = mathNumberTwo(val);
                            val
                                ? (formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                      mathNumberTwo(
                                          parseFloat(val) +
                                              parseFloat(obj.commission)
                                      ) || 0)
                                : (formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                                      mathNumberTwo(
                                          parseFloat(obj.compensatioCard) +
                                              parseFloat(obj.commission)
                                      ) || 0);
                            return {
                                formObj: {
                                    payMoney: val
                                        ? mathNumberTwo(
                                              parseFloat(val) +
                                                  parseFloat(obj.commission)
                                          ) || 0
                                        : mathNumberTwo(
                                              parseFloat(obj.compensatioCard) +
                                                  parseFloat(obj.commission)
                                          ) || 0,
                                },
                            };
                        }
                    },
                    suffix:"元",
                },
                {
                    code: "payMoney",
                    label: "总支付补差",
                    required: false,
                    disabled: true,
                    suffix:"元",
                    valueChange: (val) => {
                        formDatasTypePayRef.value.formDataInfoPayType.formDatas.actualPrice =
                            val;
                    },
                },
                {
                    el: "textArea",
                    label: "备注",
                    code: "remark",
                    required: false,
                    disabled: addType == "0",
                    maxlength: 500,
                },
                {
                    el: "img",
                    label: "附件",
                    backType: "ArrayString",
                    disabled: addType == "0",
                    code: "appendixes",
                    required: false,
                },
            ],
        });

        const detail = async () => {
            await conversionRecordDetails({ id: detailId }).then((res) => {
                state.originalData = res.data;
                state.originalData.changeCardType = [];
                state.originalData.isTransformCard == 1
                    ? state.originalData.changeCardType.push("3")
                    : null;
                state.originalData.isTransformHall == 1
                    ? state.originalData.changeCardType.push("1")
                    : null;
                state.originalData.isTransformMember == 1
                    ? state.originalData.changeCardType.push("2")
                    : null;

                state.originalData.valuesPrice = state.originalData.actualPrice;
                state.originalData.compensatioCard = mathNumberTwo(
                    state.originalData.valuesPrice -
                        state.originalData.oldBalance
                );
                nextTick(() => {
                    state.formDatasTypePay = state.originalData;
                    state.formDatasTypePay.actualPrice =
                        state.originalData.payMoney;
                });
            });
        };
        // watchEffect(()=>{
        //     console.log(state.originalData.newBalance);
        // })
        onMounted( () => {
            let data;
            memberCourseCardsDetail({ id: id }).then( (res) => {
                data = res.data;
                state.formDatas = data;
                if (addType == "1") {
                    console.log("元数据", state.formDatas);
                    let arr=[]

                    arr=state.formDatas.type==1?[
                        {
                            code: "amount",
                            label: "转卡后次数",
                            suffix:"次"
                        }
                    ]: [{
                        code: "amount",
                        label: "转卡后天数",
                        suffix:"天"


                    }]
                    state.formState=arr

                    state.originalData = {
                        rate: 0.05,
                        amount: data.balance || 0,
                        valuesPrice: data.surplusValue || 0,
                        commission: mathNumberTwo(
                            parseFloat(data.price) * 0.05
                        ),
                        validDays: data.balance,
                        surplusValue: data.surplusValue,
                        oldBalance: parseFloat(data.balance),
                        actualPrice: 0,
                        compensatioCard: 0,
                        price: data.price,
                        payMoney: mathNumberTwo(parseFloat(data.price) * 0.05),
                    };
                } else {
                     detail();
                }
            });
             hallCourseCardBoxList().then(res=>{
                state.xialaList=res.data
            })
        });
        //获取默认规格
        const singleSpecification = () => {
            // CourseCardSpecifications({otherHallId:id,courseCardId:state.formDatas.courseCardId,courseCardSpecsId:state.formDatas.courseCardSpecId}).then(res=>{
            //     console.log('获取初次规格',res.data);
            // })
        };
        const mathNumberTwo = (val = 0) => {
            return Math.round(val * 100) / 100;
        };
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
                id: detailId,
                collectionTime,
                paymentList: orderPaymentLogList,
                payType: 1,
            };
            return options;
        };
        let payBut = false; //支付防止多次点击
        //支付
        const onsubmit = () => {
            formDatasTypePayRef.value.formDataInfoPayType.scrollIntoViewFn(
                "onSubmit",
                (formDate) => {
                    console.log(state.formDatas.id);
                    let options = {
                        ...processingData(formDate),
                        memberId: state.formDatas.memberId,
                    };
                    if (!payBut) {
                        payBut = true;
                        transferCardPayment({ ...options })
                            .then(() => {
                                ElMessage.success("支付成功");
                                back();
                                payBut = false;
                            })
                            .catch(() => {
                                payBut = false;
                            });
                    }
                }
            );
        };
        const back = () => {
            router.back();
        };
        return {
            ...toRefs(state),
            onsubmit,
            formListDataRef,
            formDatasTypePayRef,
            back,
            mathNumberTwo,
            singleSpecification,
        };
    },
};
</script>

<style lang="scss" scoped>
.title {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid #d2cccc;
    font-weight: bold;
    margin-bottom: 20px;
}

.but_pay {
    margin-left: 58px;
}

.pad-b-20 {
    padding-bottom: 20px;
}

.border_bottom {
    border-bottom: 1px solid #333333;
}

.fontWB {
    font-weight: bold;
}

.m-b-20 {
    margin-bottom: 20px;
}
</style>
