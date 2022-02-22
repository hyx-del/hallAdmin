<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 15:55:07
 * @Descripttion: 开卡申请订单
-->
<template>
   <div>
      <h2 style="padding-bottom:20px">退卡详情</h2>
      <div>
         <h3 class="title">原卡信息</h3>
         <Form :formDatas="formDatas"
               :formList="formList"
               :iconSelect="false"
               labelWidth="138px"
               :isBut="false">
         </Form>
      </div>
      <div>
         <h3 class="title">退卡信息</h3>
         <Form :formDatas="formDatasOut"
               :formList="formListOut"
               :iconSelect="false"
               labelWidth="138px"
               :isBut="false">
            <template #img>
               <div class="image-slot "
                    v-if="formDatasOut.appendixes&&formDatasOut.appendixes.length">
                  <el-image style="width: 162px; height: 100px,display:flex"
                            v-for="(item,index) in formDatasOut.appendixes"
                            :key="index"
                            :src="item"
                            fit="cover">
                  </el-image>
               </div>
               <div class="null_img"
                    v-else>暂无图片
               </div>
            </template>
         </Form>
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
import Form from "@/components/Form";
import { cardRefundDetail } from "@/api/city";
export default defineComponent({
   components: { Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const idObj = route.query;
      const state = reactive({
         formDatas: {},
         formList: [
            { label: "卡类", code: "courseCardName", disabled: true },
            { label: "绑定会员", code: "memberName", disabled: true },
            { label: "原卡余额", code: "balance", disabled: true, suffix: "元" },
            { label: "原价", code: "originalPrice", disabled: true, suffix: "元" },
            { label: "剩余价值", code: "surplusValue", disabled: true, suffix: "元" },
         ],

         formDatasOut: {},
         formListOut: [
            { label: "会员卡剩余价值", code: "surplusValue", disabled: true },
            { label: "费率", code: "rate", disabled: true },
            { label: "手续费", code: "commission", disabled: true, suffix: "元" },
            { label: "实际退款金额", code: "payMoney", disabled: true, suffix: "元" },
            { el: "blank", label: "附件", code: "a1", slotName: "img" },
            {
               el: "date", label: "退卡日期", code: "date",
               disabled: true, width: "162px"
            },
            {
               el: "textarea", label: "备注", code: "remark",
               disabled: true, width: "260px"

            },
         ],
      });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => {
         cardRefundDetail(idObj).then(res => {
            if (res.code == 200) {
               state.formDatasOut = state.formDatas = res.data;
               state.formDatasOut.appendixes &&
                  (state.formDatasOut.appendixes = JSON.parse(state.formDatasOut.appendixes));
            }
         });
      });
      onBeforeUnmount(() => { });
      const onSubmits = (event) => {
         console.log(event, "搜索");
      };
      return {
         ...toRefs(state),
         onSubmits
      };
   },
});
</script>
<style lang='scss' scoped>
.title {
   width: 70%;
   padding: 10px 0;
   padding-left: 30px;
   border-bottom: 1px solid #eee;
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
<style lang="scss">
</style>
