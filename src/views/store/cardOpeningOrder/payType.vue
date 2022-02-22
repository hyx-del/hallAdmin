<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 15:57:26
 * @Descripttion: 支付类型插件
-->
<template>
   <div>
      <Form :formDatas="copyFormDatas"
            :formList="formList"
            onSubmits="确定"
            @onSubmit="onSubmits"
            labelWidth="138px"
            :isBut="false"
            ref="formDataInfoPayType">
         <template #tips={data}>
            <span class="tipsSpan">支付金额:
               <span class="red">{{data.formData.actualPrice}}</span>元</span>
         </template>
         <!-- 组合支付插槽 -->
         <template #orderPaymentLogList>
            <div class="orderPaymentLogList">
               <div v-for="(item,index) in copyFormDatas.orderPaymentLogList"
                    :key="index"
                    style="padding-top:18px">
                  <span class="is-requirers">支付方式：</span>
                  <el-select v-model="item.channel"
                             placeholder="请选择支付方式"
                             size="mini"
                             :disabled="disabled">
                     <el-option v-for="i in paySelect"
                                :key="i.value"
                                :label="i.name"
                                :value="i.id">
                     </el-option>
                  </el-select>
                  <span class="is-requirers">支付金额：</span>
                  <el-input v-model="item.amount"
                            :disabled="disabled"
                            size="mini" />
                  <span>交易号：</span>
                  <el-input v-model="item.tradeNo"
                            :disabled="disabled"
                            size="mini" />
               </div>
               <p v-if="!disabled">
                  <i class="el-icon-circle-plus-outline aqua"
                     @click="copyFormDatas.orderPaymentLogList.push({})"></i>
                  <i class="el-icon-delete f44"
                     @click="copyFormDatas.orderPaymentLogList.pop()"
                     v-if="copyFormDatas.orderPaymentLogList.length-1"></i>
               </p>
            </div>
         </template>
      </Form>
   </div>
</template>
<script>
import {
   computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref,
   toRefs, watch, nextTick, getCurrentInstance
} from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Form from "@/components/Form";
import Table from "@/components/Table";
import { payment } from "@/api/common";

export default defineComponent({
   components: { Form, Table },
   props: {
      formDatas: { type: Object, default: {} },
      dialog: { type: Boolean, default: false }
   },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const instance = getCurrentInstance();
      //逻辑层主体
      const formDataInfoPayType = ref(null);
      //支付方式下拉
      let paySelect = ref([]);
      const state = reactive({
         copyFormDatas: {},
         disabled: false,
         //测试组合支付类型下拉
         //组合支付数组
         odd: [
            { el: "select", label: "支付方式", code: "channel", required: true, options: paySelect, slotName: 'tips' },
            { label: "交易号", code: "tradeNo" }],
         formList: [
            {
               el: "radioButton", label: "支付类型", code: "paymentType", required: true,
               radios: [{ name: '单一支付', id: 1 }, { name: '组合支付', id: 2 }], change: (val, item, data, list) => {
                  if (val == 1) {
                     let isChannel = list.find(item => item.code == "channel");
                     item.slotName = "";
                     if (!isChannel) list.splice(1, 0, ...state.odd);
                  } else {
                     list.splice(1, 2,);
                     item.slotName = "orderPaymentLogList";
                  }
                  //重走校验
                  formDataInfoPayType.value.regValidator();
               }
            },
            { el: "select", label: "支付方式", code: "channel", required: true, options: paySelect, slotName: 'tips' },
            { label: "交易号", code: "tradeNo" },
            { el: "date", label: "付款时间", code: "collectionTime", width: "261px", required: true, type: "datetime", format: "YYYY-MM-DD HH:mm:ss" },
            { el: "upImg", label: "支付附件", code: "payAppendixes", limit: 6, size: 1024 },
            {
               el: "radio", label: "启用状态", code: "disable", required: true,
               width: "300px",
               radios: [{ name: '暂不启用', id: 'true' }, { name: '立即启用', id: 'false' }],
            },
         ],
      });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => {
         //手动更新节点
         initData();
         paySelectFn();

      });
      onBeforeUnmount(() => { });
      const onSubmits = (event) => {
         console.log(event, "确定");
      };

      //支付下拉
      const paySelectFn = () => {
         payment({ status: 1 }).then(res => {
            if (res.code == 200) {
               paySelect.value = res.data;
            }
         });
      };

      // 初始化数据
      const initData = () => {
         if (props.formDatas.orderStatus == 20) {
            if (!props.dialog) {
               state.formList.forEach(item => item.disabled = true);
               state.disabled = true;
               formDataInfoPayType.value.regValidator();
               state.formList.splice(- 1, 1);
            }
            //单一支付处理并且不是修改的
            if (props.formDatas.paymentType == 1 && !props.formDatas.edit) {
               let payObj = props.formDatas.orderPaymentLogList[0];
               props.formDatas.channel = payObj.channel;
               props.formDatas.tradeNo = payObj.tradeNo;
            }

            state.copyFormDatas = { ...props.formDatas };
            console.log(state.copyFormDatas);

            //附件
            let { copyFormDatas } = state;
            let orderPaymentLogList = copyFormDatas.orderPaymentLogList;
            orderPaymentLogList &&
               (typeof orderPaymentLogList[0].appendixes == 'string') &&
               (state.copyFormDatas.payAppendixes = JSON.parse(orderPaymentLogList[0].appendixes));

            //单一和组合节点
            nextTick(() => {
               let isEven = state.copyFormDatas.paymentType == 2;
               if (isEven)
                  state.formList.splice(1, 2,),
                     state.formList[0].slotName = "orderPaymentLogList";
               else state.formList[0].slotName = "";
            });
         } else {
            if (!props.formDatas.orderPaymentLogList)
               state.copyFormDatas.orderPaymentLogList = [{}];
            state.copyFormDatas.actualPrice = props.formDatas.actualPrice;
            console.log(state.copyFormDatas);
         }
      };

      return {
         ...toRefs(state),
         onSubmits,
         formDataInfoPayType,
         paySelect,
      };
   },
});
</script>
<style lang='scss' scoped>
.is-requirers {
   &::before {
      content: "*";
      color: red;
   }
}
.tipsSpan {
   position: absolute;
   top: 0;
   right: -170px;
   color: rgba(0, 0, 0, 0.65);
}
.orderPaymentLogList {
   transform: translateX(-86px);
   height: auto;
   position: relative;
   p {
      position: absolute;
      bottom: -19px;
      right: -120px;
      width: 120px;
      i {
         display: inline-block;
         padding: 0 10px;
         margin: 0 7px;
         font-size: 26px;
         cursor: pointer;
      }
      .aqua {
         color: aqua;
      }
      .f44 {
         color: #f44;
      }
   }
   div {
      width: 786px;
      display: flex;
      justify-content: space-between;
      span {
         text-indent: 10px;
         display: inline-block;
         width: 390px;
         text-align: left;
      }

      input {
         flex: 1;
      }
   }
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
