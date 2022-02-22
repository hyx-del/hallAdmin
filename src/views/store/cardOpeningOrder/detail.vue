<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-01-28 10:57:59
 * @Descripttion: 开卡申请订单
-->
<template>
   <div v-if="formDatas">
      <h3>开卡详情</h3>
      <Form :formDatas="formDatas"
            :formList="formList"
            :isBut="false"
            :iconSelect="false"
            :formItemStyle="{width:'315px'}"
            labelWidth="138px"
            ref="formDataInfo">
      </Form>

      <!-- 支付信息 -->
      <div class="contract" v-if="formDatas.orderStatus!=0">
         <hr>
         <h4>支付信息:</h4>
         <b>合同签订方式：</b>
         <el-radio-group v-model="contract.radio">
            <el-radio :label="0"
                      :disabled="contract.isPaper">电子合同</el-radio>
            <el-radio :label="1"
                      :disabled="contract.isElec">纸质合同</el-radio>
         </el-radio-group>

         <div v-if="contract.radio==0"
              style="margin-left:141px">
            <div v-for="(item,index) in contract.elec"
                 :key="index">

               <p>合同Id：{{item.id}} &emsp;签署状态:<span>{{contractStatus(item.status)}}</span><a :href="item.viewUrl"
                     target="_blank">预览</a></p>
            </div>

         </div>

  
         <div v-else
              style="margin-left:141px;">
            <div v-for="(item,index) in contract.paper"
                 :key="index">

               <p>合同Id：{{item.id}} &emsp;<span v-if="item.status==-1">签署状态:已作废</span><a :href="item.viewUrl"
                     target="_blank">预览</a></p>

               <div v-if="item.status!=-1">
                  <el-button type="primary"
                             size="mini"
                             @click="contractFn">刷新</el-button>

                  <!-- 卡规格为自定义的合同则需要审核 -->
                  <!-- <p style=" transform:translateX(-139px)"><b>签署状态：</b><span>{{contractStatus(item.status)}}</span>
                     <el-button size="mini"
                                v-if="item.status==1"
                                @click="checkContractFn(item.id)">审核</el-button>
                  </p> -->
               </div>
            </div>
         </div>

         <!--图片上传ImgType["png", "jpg", "jpeg"] limit张数 tips自定义提示 ratio尺寸-->
         <p style="display:flex"><b class="required">合同附件：</b>
            <UploadImgDrag v-model="appendixes"
                           :size=" 500"
                           :limit="6"
                           :disabled="true" />
         </p>

         <!-- 支付类型 -->
         <div class="typePay"
              v-if="payTypeUpDom">
            <!-- 支付类型组件 -->
            <payType :formDatas="formDatasTypePay"
                     ref="formDatasTypePayRef"></payType>
         </div>
      </div>

   </div>
</template>
<script>
import {
   computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref,
   toRefs, watch, nextTick
} from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Form from "@/components/Form";
import Table from "@/components/Table";
import UploadImgDrag from "@/components/uploadImg";
import payType from "./payType.vue";
import { salesList, boxList, courseCard, memberCoupon, memberList } from "@/api/common";
import { courseOrdesDetail, salesmanChanges, contractUrl, saleManChange, courseOrderPay, editCourseOrderPay, editCourseOrderPayList, memberDetail, generateContracts, appendixesUpdate, printContract, destoryContract, checkContract } from "@/api/city";
import printJs from 'print-js';
import QRCode from 'qrcodejs2';



export default defineComponent({
   components: { Form, Table, payType, UploadImgDrag },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const formDataInfo = ref(null);
      const hallIdObj = reactive({ hallId: store.getters.activeHallId });
      const queryObj = reactive(route.query);
      const state = reactive({
         formDatas: {},
         sell: null,
         /* 数组基础逻辑 会员是否首次开卡
                        卡规格 次卡自定义(次数) 单价：价格/次数 期限卡自定义(天数)
         */
         formList: [
            { label: "会员", code: "memberName", disabled: true, required: true },
            {
               el: "select", label: "课程卡", code: "courseCardId", required: true, options: [], disabled: true
            },
            {
               label: "卡规格", code: "courseCardSpecName", required: true, disabled: true,
            },
            { label: "价格", code: "price", required: true, disabled: true },
            { label: "单价", code: "unitPrice", required: true, disabled: true },
            {
               el: "select", label: "销售员", code: "salesmanId", options: [], slotName: 'market', disabled: true,
            },
            {
               label: "调整价格", code: "adjustPrice", suffix: "元",
               disabled: true
            },
            { label: "优惠券", code: "privilegeName", disabled: true },
            { label: "总优惠", code: "privilegeTotal", suffix: "元", disabled: true },
            { label: "实际支付", code: "actualPrice", suffix: "元", disabled: true },
            { label: "有效天数", code: "effectiveDays", disabled: true },
            { el: "date", label: "生效时间", code: "startDate", width: "177px", disabled: true },
            { label: "咨询方式", code: "consultMode", disabled: true },
            { label: "新赠品", code: "gift", disabled: true },
            {
               el: "radio", label: "卡属性",
               code: "cardType", disabled: true,
               radios: [{ name: '办理卡', id: 1 }, { name: '赠送卡', id: 2 }],
            },
            { label: "赠卡关联卡", code: "relationCardName", class: 'none', disabled: true },
            { el: "textarea", label: "备注", code: "remark", width: "400px", disabled: true },
            {
               el: "radio", label: "用户是否首次开卡",
               code: "isFirstSign", disabled: true,
               radios: [{ name: '是', id: 1 }, { name: '否', id: 0 }],
            },
         ],
         //销售修改弹框
         dialogVisible: false,
         dialogVisibleSell: false,
         //支付修改弹框
         dialogVisibleLog: false,
         dialogVisiblePay: false,
         //合同模板弹框
         dialogVisibleTemplate: false,
         testSelect: [],
         column: [
            { prop: 'oldSalesmanName', label: "修改前", },
            { prop: 'newSalesmanName', label: "修改后", },
            { prop: 'operatorName', label: "操作人", },
            { prop: 'updatedAt', label: "操作时间", },
         ],
         columnPay: [
            { prop: 'oldSalesmanName', label: "修改前金额", },
            { prop: 'newSalesmanName', label: "修改后金额", },
            { prop: 'operatorName', label: "操作人", },
            { prop: 'updatedAt', label: "操作时间", },
         ],
         formDatasTemplate: { getMsg: 0 },
         formListTemplate: [
            { label: "真实姓名", code: "memberName", required: true, rules: "zh" },
            { label: "证件号码", code: "idCard", required: true, rules: "identity" },
            {
               el: "switch", label: "是否接收短信", code: "getMsg",
               slotName: "switchSpan",
               change: (val) => {
                  val ? ElMessage.success("打开接收短信")
                     : ElMessage.error("关闭接收短信");
               }
            },
            { label: "公司名称", code: "companyNme", },
            { label: "公司地址", code: "companyAddress", },
            { label: "公司职位", code: "customerName", },
            { label: "紧急联系方式", code: "emergencyContact", },
            { label: "疾病", code: "diseases", },
            { el: "textarea", label: "合同备注", code: "remark", width: "400px", },
         ],
         contract: { radio: 0, elec: [], paper: [], isElec: false, isPaper: false },
         type: 1,
         appendixes: null,
         //支付类型数据双向绑定
         formDatasTypePay: {},
         payTypeUpDom: false,
      });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });

      onMounted(async () => {
         salesListRes();
         detail();
         contractFn();
      });

      onBeforeUnmount(() => { });

      //销售修改表格
      const getList = computed(() => {
         return salesmanChanges;
      });
      //支付修改表格
      const getListPay = computed(() => {
         return editCourseOrderPayList;
      });

      //销售获取
      const salesListRes = () => {
         salesList(hallIdObj).then(res => {
            if (res.code == 200) {
               let salesListIndex = state.formList.findIndex(
                  item => item.code == 'salesmanId');
               state.formList[salesListIndex].options =
                  state.testSelect = res.data;
            }
         });
      };

      //详情
      const detail = async () => {
         let result = await courseCard(hallIdObj);
         state.formList[1].options = result.data;
         courseOrdesDetail(queryObj).then(res => {
            if (res.code == 200) {
               //自定义
               if (res.data.courseCardId && !res.data.courseCardSpecId) {
                  let item = result.data.find(
                     (item) => item.id == res.data.courseCardId);
                  let amount = {
                     label: item.type == 1 ? "次数" : '天数', code: "amount", required: true, disabled: true
                  };
                  let { courseCardSpecName } = res.data;
                  res.data.courseCardSpecName =
                     courseCardSpecName ? courseCardSpecName : '自定义';
                  state.formList.splice(3, 0, amount);
               }
               //新老赠品
               let giftItem = state.formList.find(
                  (item) => item.code == 'gift');
               giftItem.label = res.data.giftId ? '新赠品' : '老赠品';

               //卡属性关联
               if (res.data.cardType == 2) {
                  let relationCardNameItem = state.formList.find(
                     (item) => item.code == 'relationCardName');
                  relationCardNameItem.class = '';
               }


               state.formDatas = res.data;
               res.data.appendixes &&
                  (state.appendixes = JSON.parse(res.data.appendixes));
               state.formDatasTypePay = { ...state.formDatas };
               let { orderStatus, actualPrice } = state.formDatas;
               if (orderStatus == 20)
                  state.payTypeUpDom = true;
            }
         });
      };

      //合同信息
      const contractFn = () => {
         let options = { transactionId: queryObj.id };
         contractUrl(options).then(res => {
            if (res.code == 200) {
               let { elec, paper } = res.data;
               state.contract.elec = elec;
               state.contract.paper = paper;

               state.contract.isElec = elec.some((item) => item.status != -1);
               state.contract.isPaper = paper.some((item) => item.status != -1);
               if (state.contract.isElec) {
                  return state.contract.radio = 0;
               } else if (state.contract.isPaper) {
                  return state.contract.radio = 1;
               }

            }
         });
      };

      //合同附件change
      const appendixesUpdateFn = () => {
         console.log(state.appendixes);
         let options = {
            transactionId: queryObj.id,
            appendixes: state.appendixes ? JSON.stringify(state.appendixes) : null
         };
         appendixesUpdate(options).then(res => {
            res.code == 200 ?
               ElMessage.success("更新附件成功") :
               ElMessage.error(res.msg || "更新附件失败");
         });
      };

      const contractStatus = (status) => {
         let str = null;
         switch (true) {
            case status == 0:
               str = '未签署';
               break;
            case status == 1:
               str = '签署完成（带审核）';
               break;
            case status == 2:
               str = '签署完成';
               break;
            case status == -1:
               str = '已作废';
               break;

            default:
               break;
         }
         return str;
      };

      const dialogVisibleSellFn = () => {
         state.dialogVisibleSell = true;
      };

      //开区模板获取会员信息
      const contractModel = (type) => {
         state.type = type;
         state.dialogVisibleTemplate = true;
         memberDetail({ id: state.formDatas.memberId }).then(res => {
            if (res.code == 200) {
               let { name, idCard, } = res.data;
               state.formDatasTemplate = { memberName: name, idCard, getMsg: 1 };
            }
         });
      };

      //合同模板生成
      const TemplateSubmit = (event) => {
         event.transactionId = queryObj.id;
         event.contractType = state.type;
         generateContracts(event).then(res => {
            if (res.code == 200) {
               ElMessage.success("模板生成成功");
               state.dialogVisibleTemplate = false;
            }
         });
      };

      //生成二维码
      const creatQrcode = (url) => {
         nextTick(() => {
            let qrcodeId = document.querySelector("#qrcode");
            qrcodeId.innerHTML = '';
            let qrcode = new QRCode(qrcodeId, {
               width: 150,
               correctLevel: QRCode.CorrectLevel.H,
               height: 150,
            });
            qrcode.clear(); //清除二维码 
            qrcode.makeCode(url);
         });
      };

      //销售弹框修改
      const sellSubmit = () => {
         let { memberCourseCardId, orderStatus } = state.formDatas;
         if (!memberCourseCardId)
            return ElMessage.error(`没有会员课程卡id，不能修改销售`);
         if (!orderStatus == 20)
            return ElMessage.error(`订单为未完成状态，不能修改销售`);
         let options = {
            newSalesmanId: state.sell,
            memberCourseCardId: state.formDatas.memberCourseCardId,
            orderId: queryObj.id
         };
         saleManChange(options).then(res => {
            if (res.code == 200) {
               ElMessage.success("销售员修改成功");
               state.dialogVisibleSell = false;
               state.formDatas.salesmanId = state.sell;
            } else {
               ElMessage.error("销售员修改失败");
            }
         });
         console.log("销售修改");
      };

      const formDatasTypePayRef = ref(null);
      const formDatasTypePayRefDialog = ref(null);
      //支付类型弹框修改
      const paySubmit = () => {
         formDatasTypePayRefDialog.value.formDataInfoPayType.scrollIntoViewFn('onSubmit', (formDate) => {
            state.payTypeUpDom = false;
            state.formDatasTypePay = formDate;
            state.formDatasTypePay.edit = true;
            let options = processingData(formDate);
            editCourseOrderPay(options).then(res => {
               if (res.code == 200) {
                  ElMessage({
                     message: '修改支付成功', type: 'success',
                     duration: 500,
                     onClose: () => {
                        state.payTypeUpDom = true;
                        state.dialogVisiblePay = false;
                     }
                  });
               }
            });
         });
      };


      //支付数据处理
      const processingData = (formDate) => {
         let { disable, payAppendixes, orderPaymentLogList, collectionTime, paymentType } = formDate;
         //单一处理
         if (paymentType == 1) {
            let { actualPrice, tradeNo, channel } = formDate;
            orderPaymentLogList = [{ amount: actualPrice, tradeNo, channel }];
         }
         payAppendixes ? (payAppendixes = JSON.stringify(payAppendixes)) : null;
         let options = { id: queryObj.id, disable, payAppendixes, collectionTime, paymentList: orderPaymentLogList, type: 1 };
         return options;
      };

      //数据汇总提交
      const submitAll = () => {
         formDatasTypePayRef.value.formDataInfoPayType.scrollIntoViewFn('onSubmit', (formDate) => {
            let options = processingData(formDate);
            courseOrderPay(options).then(res => {
               if (res.code == 200) {
                  ElMessage({
                     message: '修改支付成功', type: 'success',
                     duration: 1000,
                     onClose: () => {
                     }
                  });
               }
            });
         });
      };
      return {
         ...toRefs(state),
         getList,
         formDataInfo,
         print,
         sellSubmit,
         paySubmit,
         router,
         submitAll,
         formDatasTypePayRef,
         formDatasTypePayRefDialog,
         TemplateSubmit,
         dialogVisibleSellFn,
         getListPay,
         queryObj,
         contractModel,
         appendixesUpdateFn,
         contractStatus,
         creatQrcode,
         contractFn
      };
   },
});
</script>
<style lang='scss' scoped>
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
      top: 0px;
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
