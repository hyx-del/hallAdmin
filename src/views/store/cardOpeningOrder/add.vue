<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-21 17:28:08
 * @Descripttion: 开卡申请订单
-->
<template>
   <div>
      <h3>开卡</h3>
      <Form :formDatas="formDatas"
            :formList="formList"
            onSubmits="确定"
            @onSubmit="onSubmits"
            labelWidth="138px"
            ref="formDataInfo">
         <template #first>
            <div v-if="first"
                 class="first">用户首次开卡</div>
         </template>
         <template #market={data}>
            <div class="dialog">
               <!-- <el-button type="primary"
                          size="mini"
                          @click.stop="dialogVisible=true">修改记录</el-button> -->
               <el-dialog v-model="dialogVisible"
                          title="修改记录"
                          width="790px">
                  <Table :showSortIndex="{ show: true, lable: '序号' }"
                         v-if="dialogVisible"
                         :loadData="getList"
                         :column="column"
                         :params="{orderId :data.formData.courseCardId,type:5}"
                         :hidden="false"></Table>
               </el-dialog>
            </div>
         </template>
         <template #tips>
            <div style="color:red"
                 v-if="defined">该订单提交后需由城市审核</div>
         </template>
      </Form>
   </div>
</template>
<script>
   import {
      computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref,
      toRefs, watch
   } from 'vue';
   import { ElMessageBox, ElMessage } from 'element-plus';
   import { useStore } from 'vuex';
   import { useRouter, useRoute } from 'vue-router';
   import Form from "@/components/Form";
   import Table from "@/components/Table";
   import { salesList, boxList, courseCard, memberCoupon, memberList, giftBoxListFn, memberCourse } from "@/api/common";
   // 是否首次开卡
   import { firstSign, salesmanChanges, courseOrdesAdd } from "@/api/city";


   export default defineComponent({
      components: { Form, Table },
      setup(props, context) {
         const store = useStore();
         const router = useRouter();
         const route = useRoute();
         //逻辑层主体
         const formDataInfo = ref(null);
         const hallIdObj = reactive({ hallId: store.getters.activeHallId });
         const cityIdObj = reactive({ cityId: store.getters.activeCityId });
         let giftBoxList = reactive([]);

         //优惠券查找 并赋值计算
         const privilegesFind = (data, state) => {
            let privileges = state.privileges.find
               (item => item.id == data.privileges);
            state.dataComputed = data;
            state.privilegesObj = privileges;
         };

         const state = reactive({
            formDatas: { startDate: new Date().toLocaleDateString(), cardType: 1 },
            dataComputed: {},
            privilegesObj: {},
            /* 数组基础逻辑 会员是否首次开卡
                           卡规格 次卡自定义(次数) 单价：价格/次数 期限卡自定义(天数)
            */
            first: false,
            //课程卡
            courseCard: [],
            //优惠券
            privileges: [],
            //defined
            defined: false,

            formList: [
               {
                  el: "select", label: "会员", code: "memberId", required: true, slotName: 'first', options: [], filterable: true,
                  remote: true, placeholder: "请搜索会员",
                  remoteMethod: (e) => {
                     e &&
                        memberList({ size: 20, keyword: e }).then(res => {
                           if (res.code == 200) {
                              state.formList[0].options = res.data || [];
                           }
                        });
                  },
                  change: (val, item, data, list) => {
                     firstSignFn(data);

                     if (val) {
                        //优惠券
                        memberCoupon({ ...hallIdObj, memberId: val }).then(res => {
                           if (res.code == 200) {
                              let privilegesIndex =
                                 list.findIndex(item => item.code == 'privileges');
                              console.log(list[privilegesIndex]);
                              list[privilegesIndex].options =
                                 state.privileges = res.data;
                              data.privileges = null;
                           }
                        });

                        //赠卡关联卡
                        memberCourse({ id: val }).then(res => {
                           if (res.code == 200) {
                              let relationIdIndex =
                                 list.findIndex(item => item.code == 'relationId');
                              list[relationIdIndex].options = res.data;
                              data.relationId = null;
                           }
                        });
                     }
                  }
               },
               {
                  el: "select", label: "课程卡", code: "courseCardId", required: true, optionsFn: courseCard, filterable: true, params: hallIdObj,
                  change: (val, item, data, list) => {
                     firstSignFn(data);
                     //卡规格
                     boxList({ courseCardId: val, ...cityIdObj }).then(res => {
                        if (res.code == 200) {
                           res.data.push({ id: 'defined', name: "自定义" });
                           state.formList[2].options = res.data;
                           data.courseCardSpecId = null;
                        }
                     });
                  }
               },
               {
                  el: "select", label: "卡规格", code: "courseCardSpecId", required: true, options: [], iconOff: true,
                  change: (val, item, data, list) => {
                     //自定义
                     if (data.courseCardSpecId == 'defined') {
                        state.defined = true;

                        let item = state.courseCard.find(
                           (item) => item.id == data.courseCardId);
                        let amount = {
                           label: item.type == 1 ? "次数" : '天数', code: "amount", required: true, rules: "number", maxlength: 5,
                           change: (val, items, data, list) => {
                              //期限卡相等天数
                              item.type == 2 && (data.effectiveDays = val);
                              //计算
                              val && data.price &&
                                 (data.unitPrice = (+data.price / +val).toFixed(2));
                           }
                        };

                        //取消调整价格
                        let adjustPriceItem =
                           list.find((item) => item.code == "adjustPrice");
                        adjustPriceItem.class = 'none';

                        //初始置空有效天数
                        item.type == 2 && (data.effectiveDays = '');

                        let num = list.findIndex((item) => item.code == 'amount');
                        list.splice(3, num == -1 ? 0 : 1, amount,);
                        data.amount = null;

                        //价格 有效期
                        let priceIndex =
                           list.findIndex(item => item.code == 'price');
                        let effectiveDaysIndex =
                           list.findIndex(item => item.code == 'effectiveDays');
                        list[priceIndex].disabled = false;
                        list[effectiveDaysIndex].disabled = item.type == 1 ? false : true;
                     } else {
                        state.defined = false;
                        data.amount = null;

                        let num = list.findIndex((item) => item.code == 'amount');
                        if (num != -1) {
                           list.splice(num, 1,);
                        }

                        let priceIndex =
                           list.findIndex(item => item.code == 'price');
                        let effectiveDaysIndex =
                           list.findIndex(item => item.code == 'effectiveDays');
                        list[priceIndex].disabled = true;
                        list[effectiveDaysIndex].disabled = true;

                        let adjustPriceItem =
                           list.find(item => item.code == 'adjustPrice');
                        adjustPriceItem.class = '';

                        //计算
                        let courseCardIdArr = list[2].options;
                        let courseCardSpecIdItem = courseCardIdArr.find(item => item.id == data.courseCardSpecId);
                        let { amount, price, validDays } = courseCardSpecIdItem;
                        data.price = price.toFixed(2);
                        data.unitPrice = (price / amount).toFixed(2);
                        data.effectiveDays = validDays || amount;
                        privilegesFind(data, state);
                        data.actualPrice = actualPriceComputed;
                        console.log(courseCardSpecIdItem);
                     }

                     //调整价格置空
                     data.adjustPrice = null;

                     //总优惠
                     privilegesFind(data, state);
                     (data.privilegeTotal = privilegeTotalComputed);

                     //重走校验
                     formDataInfo.value.regValidator();
                  }
               },
               {
                  label: "价格", code: "price", required: true, disabled: true, rules: "numberPoint27", maxlength: 10,
                  change: (val, item, data, list) => {
                     //单独触发校验
                     formDataInfo.value.formDataInfo.validateField('price',
                        (err) => {
                           if (err) { return; }
                           state.dataComputed = data;
                           //计算单价
                           val && data.amount &&
                              (data.unitPrice = (+val / +data.amount).toFixed(2));
                           //实际支付
                           privilegesFind(data, state);
                           data.actualPrice = actualPriceComputed;
                        });
                  }
               },
               { label: "单价", code: "unitPrice", required: true, disabled: true, maxlength: 10, rules: "numberPoint27", },
               {
                  el: "select", label: "销售员", code: "salesmanId", optionsFn: salesList, params: hallIdObj, iconOff: true, slotName: 'market', filterable: true,
               },
               {
                  label: "调整价格", code: "adjustPrice", suffix: "元",
                  maxlength: 10, class: "",
                  rules: "numberPoint27",
                  change: (val, item, data, list) => {
                     //单独触发校验
                     formDataInfo.value.formDataInfo.validateField('adjustPrice', (err) => {
                        if (err) { return; }
                        privilegesFind(data, state);
                        //总优惠和实际支付 等于调整否者价格
                        data.privilegeTotal = privilegeTotalComputed;
                        data.actualPrice = actualPriceComputed;
                     });
                  }
               },
               {
                  el: "select", label: "优惠券", code: "privileges", options: [],
                  change: (val, item, data, list) => {
                     privilegesFind(data, state);
                     data.privilegeTotal = privilegeTotalComputed;
                  }
               },
               { label: "总优惠", code: "privilegeTotal", suffix: "元", disabled: true },
               {
                  label: "实际支付", code: "actualPrice", suffix: "元", disabled: true, maxlength: 10,
                  rules: "numberPoint27",
               },
               { label: "有效天数", code: "effectiveDays", disabled: true, maxlength: 5 },
               { el: "date", label: "生效时间", code: "startDate", width: "261px" },
               { label: "咨询方式", code: "consultMode", maxlength: 50 },
               {
                  el: "select", label: "新赠品", code: "giftId", options: [],
               },
               {
                  el: "radio", label: "卡属性",
                  code: "cardType",
                  radios: [{ name: '办理卡', id: 1 }, { name: '赠送卡', id: 2 }],
                  change: (val, item, data, list) => {
                     let relationIdItem =
                        list.find((item => item.code == 'relationId'));
                     relationIdItem.class = val == 1 ? 'none' : '';
                     val == 1 && (data.relationId = null);
                  }
               },
               { el: "select", label: "赠卡关联卡", code: "relationId", options: [], class: 'none' },
               { el: "textarea", label: "备注", code: "remark", width: "400px", maxlength: 300 },
               {
                  el: "radio", label: "用户是否首次开卡",
                  code: "a11",
                  radios: [{ name: '是', id: 1 }, { name: '否', id: 0 }],
                  disabled: true,
                  slotName: 'tips'
               },
            ],
            //销售修改弹框
            dialogVisible: false,
            column: [
               { prop: 'oldSalesmanName', label: "修改前", html: (val) => 1 },
               { prop: 'newSalesmanName', label: "修改后", html: (val) => 1 },
               { prop: 'operatorName', label: "操作人", },
               { prop: 'updatedAt', label: "操作时间", },
            ]
         });
         //count或book.name改变了
         // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
         computed(() => { });

         //总优惠依赖计算
         const privilegeTotalComputed = computed(() => {
            let { dataComputed, privilegesObj } = state;
            let data = {
               price: dataComputed.price ? Number(dataComputed.price) : 0,
               adjustPrice:
                  dataComputed.adjustPrice ? Number(dataComputed.adjustPrice) : 0,
               discount: privilegesObj ? Number(privilegesObj.discount) : 0,
            };
            let num;
            switch (true) {
               //有调整金额和优惠券 总优惠=原价-调整金额+优惠券金额
               case (data.price && data.adjustPrice && data.discount) ? true : false:
                  num = (data.price - data.adjustPrice + data.discount).toFixed(2);
                  break;
               //只有调整金额 总优惠=原价-调整金额。
               case (data.price && data.adjustPrice) ? true : false:
                  num = (data.price - data.adjustPrice).toFixed(2);
                  break;
               //只有优惠券  总优惠=优惠券
               case data.discount ? true : false:
                  num = (data.discount).toFixed(2);
                  break;

               default:
                  num = '0.00';
                  break;
            }
            return num;
         });


         //实际支付依赖计算
         const actualPriceComputed = computed(() => {
            let { dataComputed, privilegesObj } = state;
            let data = {
               price: dataComputed.price ? Number(dataComputed.price) : 0,
               adjustPrice:
                  dataComputed.adjustPrice ? Number(dataComputed.adjustPrice) : 0,
               discount: privilegesObj ? Number(privilegesObj.discount) : 0,
            };
            let num;
            switch (true) {
               //有优惠券和调整价格  实际支付=调整价格-优惠券
               case (data.adjustPrice && data.discount) ? true : false:
                  num = (data.adjustPrice - data.discount).toFixed(2);
                  break;
               //有调整价格无优惠券  实际支付=调整价格 
               case data.adjustPrice ? true : false:
                  num = data.adjustPrice.toFixed(2);
                  break;
               //无调整价格有优惠券  实际支付=原价-优惠券
               case (data.price && data.discount) ? true : false:
                  num = (data.price - data.discount).toFixed(2);
                  break;
               //只有原价 实际支付=原价
               case data.price ? true : false:
                  num = data.price.toFixed(2);
                  break;

               default: 
                 num = '0.00';
                  break;
            }
            console.log(num);
            return num;
         });



         onMounted(() => {
            //会员初始
            memberList({ size: 20 }).then(res => {
               if (res.code == 200) {
                  state.formList[0].options = res.data || [];
               }
            });

            //课程卡初始
            courseCard(hallIdObj).then(res => {
               if (res.code == 200) {
                  state.courseCard = res.data;
               }
            });
            //赠品下拉初始
            giftBoxListFn().then(res => {
               if (res.code == 200) {
                  let giftIdIndex =
                     state.formList.findIndex((item) => item.code == 'giftId');
                  state.formList[giftIdIndex].options = giftBoxList = res.data;

               }
            });
         });

         onBeforeUnmount(() => { });


         const onSubmits = (event) => {
            console.log(event, "确定");
            event.courseCardSpecId = event.courseCardSpecId == 'defined' ? null : event.courseCardSpecId;
            if (event.privileges) {
               let privileges = state.privileges.find
                  (item => item.id == event.privileges);
               event.privileges = [privileges.id];
            } else {
               event.privileges = null;
            }
            if (event.giftId) {
               let giftBoxListItem =
                  giftBoxList.find((item) => item.id == event.giftId);
               event.gift = giftBoxListItem.name;
            }
            event.startDate = event.startDate.replace(/\//g, '-');
            event.hallId = hallIdObj.hallId;

            courseOrdesAdd(event).then(res => {
               if (res.code == 200) {
                  ElMessage.success("开卡成功");
                  ElMessageBox.confirm(
                     '是否跳转回开卡订单首页',
                     {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                     }
                  )
                     .then(() => { router.push({ name: "cardOpeningOrderName" }); });
               } else {
                  ElMessage.error("开卡失败");
               }
            });
         };
         const getList = computed(() => {
            return salesmanChanges;
         });

         //是否首次开卡
         const firstSignFn = (data) => {
            let { memberId, courseCardId } = data;
            memberId && courseCardId &&
               firstSign({ memberId, courseCardId }).then(res => {
                  if (res.code == 200) {
                     state.first = res.data;
                     data.a11 = state.first ? 1 : 0;
                  }
               });
         };

         return {
            ...toRefs(state),
            onSubmits,
            formDataInfo,
            getList,
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
   .first {
      position: absolute;
      top: 0;
      right: -129px;
      color: red;
   }
   .dialog {
      display: inline-block;
      position: absolute;
      top: 0;
      right: -100px;
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
   .none {
      display: none;
   }
</style>
