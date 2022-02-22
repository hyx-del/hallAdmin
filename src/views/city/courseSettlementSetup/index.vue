<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:20:22
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-22 09:31:41
 * @Descripttion: 课程结算设置
-->
<template>
   <div class="wrap">
      <div class="left">
         <p v-for="(item,index) in courseList"
            :key="item.id"
            @click="course(item.id,index)"
            :class="activeIndex== index?'active':''">{{item.name}}</p>
      </div>
      <div class="right">
         <div class="payConfig">
            <h3>支付配置</h3>
            <Form :formDatas="payConfig"
                  :formList="payConfigList"
                  onSubmits="保存"
                  @onSubmit="onSubmitsPayConfig"></Form>
         </div>

         <div class="hourConfig">
            <h3>课时费配置</h3>
            <el-form :model="item"
                     label-width="100px"
                     v-for="(item,index) in hourConfig.detail"
                     :key="index"
                     :inline="true">
               <el-form-item label="教练组">
                  <el-input v-model="item.name"
                            :disabled="true" />
               </el-form-item>
               <el-form-item label="课时费：">
                  <el-input v-model.number="item.feeRule.course_fee"
                            maxlength="8"
                            @blur="isRules(item,1,item.feeRule.course_fee)" />
                  <p v-show="item.isRulesCl">最大5位数或携带两位小数点</p>
               </el-form-item>
               <el-form-item label="人头费">
                  <el-input v-model="item.feeRule.unit_price"
                            maxlength="8"
                            @blur="isRules(item,2)" />
                  <p v-show="item.isRulesPr">最大5位数或携带两位小数点</p>
               </el-form-item>
            </el-form>
            <el-button type="primary"
                       @click="onSubmitsHourConfig"
                       size="mini"
                       style="margin-left:110px">保存</el-button>
         </div>

         <div class="tutor">
            <h3>助教课时费配置</h3>
            <Form :formDatas="hourConfig"
                  :formList="[{code:'assistantCourseFee',label:'课时费', suffix:'元', rules: 'numberPoint2',maxlength:8  }]"
                  onSubmits="保存"
                  @onSubmit="onSubmitsTutorConfig"></Form>
         </div>
      </div>
   </div>
</template>
<script>
import {
   computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref,
   toRefs, watch
} from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Form from '@/components/Form/index.vue';
import { courseFeeList, courseFeePayDetail, courseFeeDetail, courseFeePayEdit, courseFeeEdit, courseFeeDetailGroup } from "@/api/city";
import { getSelectCoachListAPI } from "@/api/common";


export default defineComponent({
   components: { Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const cityIdObj = reactive({ cityId: store.getters.activeCityId });
      const state = reactive({
         courseList: [],
         payConfig: {},
         activeIndex: 0,
         coachList: [],
         payConfigList: [{ label: "微信价", code: "price", suffix: "元", rules: "numberPoint2", maxlength: 8 }, { label: "余额价", code: "balancePrice", suffix: "元", rules: "numberPoint2", maxlength: 8 }],
         hourConfig: {},
      });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(async () => {
         //列表
         let result = await courseFeeList();
         state.courseList = result.data;
         //教练
         // let resultCoach = await getSelectCoachListAPI();
         // state.coachList = resultCoach.data;
         apiDetail(state.courseList[0].id);
      });

      onBeforeUnmount(() => { });

      //课程点击
      const course = (id, index) => {
         state.activeIndex = index;
         apiDetail(id);
      };

      const apiDetail = (id) => {
         let options = { courseId: id, cityId: cityIdObj.cityId };
         //支付配置
         courseFeePayDetail(options).then((res) => {
            if (res.code == 200) {
               state.payConfig = res.data || {};
            } else {
               state.payConfig = {};
            }
         });
         //课时费
         courseFeeDetail(options).then(async (res) => {
            if (res.code == 200) {
               state.hourConfig.assistantCourseFee = res.data ?
                  res.data.assistantCourseFee : null;
               let { data } = await courseFeeDetailGroup(options);
               if (Array.isArray(data)) {
                  state.hourConfig.detail = data || [];
                  state.hourConfig.detail.forEach((item) => {
                     item.isRulesCl = false;
                     item.isRulesPr = false;
                  });
                  state.hourConfig = { ...state.hourConfig, ...options };
               }
            }
         });
      };


      //支付配置
      const onSubmitsPayConfig = (event) => {
         let { courseId, cityId } = state.hourConfig;
         event.courseId = courseId;
         event.cityId = cityId;
         courseFeePayEdit(event).then(res => {
            if (res.code == 200) {
               ElMessage.success("支付配置保存成功");
            }
         });
      };


      //课时费校验
      const isRules = (item, type, val) => {
         let reg = /^([0-9]{1,5})([\.][0-9]{2})?$/;
         if (val && !reg.test(val)) {
            type == 1 ? (item.isRulesCl = true) : (item.isRulesPr = true);
         } else {
            type == 1 ? (item.isRulesCl = false) : (item.isRulesPr = false);
         }
      };

      const onSubmitsHourConfig = () => {
         let isRulesCl =
            state.hourConfig.detail.every(item => item.isRulesCl == false);
         let isRulesPr =
            state.hourConfig.detail.every(item => item.isRulesPr == false);
         if (isRulesCl && isRulesPr) {
            let hourConfig = { ...state.hourConfig, };
            hourConfig.detail =
               hourConfig.detail.map(item => {
                  let { id, feeRule } = item;
                  return item = {
                     coach_group_id: id,
                     course_fee: feeRule.course_fee,
                     unit_price: feeRule.unit_price
                  };
               });
            delete hourConfig.assistantCourseFee;
            courseFeeEditFn(hourConfig, '课时费配置保存成功');
         } else {
            ElMessage.error("请查看校验");
         }
      };


      const onSubmitsTutorConfig = (event) => {
         delete event.detail;
         courseFeeEditFn(event, '助教课时费配置保存成功');
      };

      const courseFeeEditFn = (data, msg,) => {
         courseFeeEdit(data).then(res => {
            if (res.code == 200) {
               ElMessage.success(msg);
            }
         });
      };
      return {
         ...toRefs(state),
         onSubmitsPayConfig,
         onSubmitsHourConfig,
         onSubmitsTutorConfig,
         course,
         isRules
      };
   },
});
</script>
<style lang='scss' scoped>
.wrap {
   display: flex;
   .left {
      min-width: 230px;
      height: 760px;
      box-sizing: border-box;
      padding-left: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
      overflow-y: auto;

      p {
         cursor: pointer;
         margin: 0;
         padding: 14px 5px;
         font-size: 14px;
         color: var(--el-menu-item-font-color);
         text-indent: 2px;
      }
      .active {
         background: #e4f2ff;
         transition: 0.1s;
         font-size: 15px;
         color: var(--el-color-primary);
         text-decoration: underline;
         border-right: 4px solid #2e8de6;
         font-weight: bold;
      }

      &::-webkit-scrollbar {
         width: 10px;
         height: 14px;
      }
      &::-webkit-scrollbar-thumb {
         border-radius: 10px;
         -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
         background: #ccc;
      }
      //外层轨道
      &::-webkit-scrollbar-track {
         -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
         border-radius: 0;
         background: #fafafa;
      }
   }
   .right {
      padding-left: 40px;
      min-width: 1008px;
      .hourConfig {
         margin: 80px 0;
         p {
            margin: 0;
            padding: 0;
            color: red;
            line-height: 20px;
         }
      }
   }
}
</style>
<style lang="scss">
.hourConfig {
   .el-form-item {
      height: 42px;
   }
}
</style>
