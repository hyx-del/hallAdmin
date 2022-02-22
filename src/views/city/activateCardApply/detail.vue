<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 15:54:39
 * @Descripttion: 开卡申请订单
-->
<template>
   <div>
      <h3>开卡申请订单详情</h3>
      <Form :formDatas="formDatas"
            :formList="formList"
            onSubmits="保存"
            @onSubmit="onSubmits"

            :iconSelect="false"
            labelWidth="138px"
            :isBut="false">
         <template #switchSpan>
            <div id="edit">签署纸质合同可编辑</div>
         </template>
      </Form>
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
import { courseOrdesDetail, courseOrdesEdit } from "@/api/city";
import { salesList, boxList } from "@/api/common";
export default defineComponent({
   components: { Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const idObj = route.query;
      const state = reactive({
         formDatas: { allowPaperContract: 1 },
         formList: [
            { label: "会员", code: "memberName", disabled: true },
            { label: "课程卡", code: "courseCardName", disabled: true },
            {
               el: "select", label: "卡规格", code: "courseCardSpecId", optionsFn: boxList, disabled: true, params: idObj
            },
            { label: "天数", code: "amount", disabled: true, suffix: "元" },
            { label: "价格", code: "price", disabled: true },
            { label: "单价", code: "unitPrice", disabled: true },
            {
               el: "select", label: "销售员", code: "salesmanId", optionsFn: salesList, disabled: true
            },
            { label: "调整价格", code: "adjustPrice", disabled: true },
            { label: "优惠券", code: "privilegeName", disabled: true, },
            { label: "总优惠", code: "privilegeTotal", disabled: true, suffix: "元" },
            { label: "实际支付", code: "actualPrice", disabled: true, suffix: "元" },
            { label: "有效天数", code: "effectiveDays", disabled: true },
            {
               el: "date", label: "收款时间", code: "collectionTime",
               disabled: true, width: "261px"
            },
            { label: "咨询方式", code: "consultMode", disabled: true },
            { label: "赠品", code: "gift", disabled: true },
            {
               el: "textarea", label: "备注", code: "remark	", disabled: true,
               width: "400px"
            },
            {
               el: "radio", label: "用户是否首次开卡",
               code: "isFirstSign", disabled: true,
               radios: [{ name: '否', id: 0 }, { name: '是', id: 1 }]
            },
            {
               el: "switch", label: "允许签署纸质合同",
               code: "allowPaperContract", slotName: "switchSpan",
               disabled: JSON.parse(idObj.isEdit),
               change: (val) => {
                  courseOrdesEdit({ allowPaperContract: val, id: idObj.id }).then(res => {
                     if (res.code == 200) {
                        ElMessage.success(`${val == 0 ? '关闭' : '打开'}成功`);
                     }
                  });
               }
            },
         ],
      });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => {
         courseOrdesDetail(idObj).then(res => {
            if (res.code == 200) {
               state.formDatas = res.data;
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
#edit {
   font-size: 14px;
   color: red;
   margin-left: -27px;
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
