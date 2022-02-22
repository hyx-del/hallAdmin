<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-01-14 17:11:36
 * @Descripttion: 开卡申请订单
-->
<template>
   <div>
      <Form :formDatas="formDatas"
            :formList="formList"
            onSubmits="搜索"
            @onSubmit="onSubmits"
            :isOnInfos="true"
            onInfos="重置"
            @onInfo="reset"
            :isAdd="true"
            onAdds="开卡"
            @onAdd="add"
            :inline="true"
            butSlotName="educe"
            :formItemStyle="{ width: '300px' }"
            :iconSelect="false"
            :butStyle="{ marginLeft: '26px' }"
            labelWidth="100px"
            ref="Form">
         <template #educe>
            <el-button @click="educe">导出</el-button>
         </template>
      </Form>
      <Table :showSortIndex="{ show: true, lable: '序号' }"
             :loadData="getList"
             :column="column"
             ref="TableList"
             :params="hallIdObj"></Table>
   </div>
</template>
<script>
import {
   computed,
   defineComponent,
   onBeforeUnmount,
   onMounted,
   reactive,
   ref,
   toRefs,
   watch,
} from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Table from "@/components/Table";
import Form from "@/components/Form";
import { courseOrdesList, courseOrdesStatus, } from "@/api/city";
import { salesList, boxListAll, payment } from "@/api/common";
export default defineComponent({
   components: { Table, Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //store.getters.activeSchoolId,store.getters.activeClassId,
      const hallIdObj = reactive({ hallId: store.getters.activeHallId });
      let dateStartEnd = reactive({});
      //逻辑层主体
      const state = reactive({
         formDatas: {},
         newFormDatas: {},
         formList: [
            {
               label: "模糊查询",
               code: "keyword",
               suffix_icon: "el-icon-search",
               placeholder: "名字或手机号或卡号",
               // labelWidth: "91px",
            },
            {
               el: "select",
               label: "状态",
               code: "status",
               // labelWidth: "72px",
               options: [
                  { id: 0, name: "待确认" },
                  { id: 10, name: "待付款" },
                  { id: 20, name: "已完成" },
                  { id: -10, name: "未通过" },
                  { id: -20, name: "已取消" },
                  { id: -30, name: "已作废" },
               ],
            },
            {
               el: "select",
               label: "销售",
               code: "salesmanId",
               optionsFn: salesList,
               params: { status: 1 },
               filterable: true,
               // labelWidth: "72px",
            },
            {
               el: "select",
               label: "合同形式",
               code: "contractType",
               options: [
                  { id: 0, name: "无合同" },
                  { id: 1, name: "电子合同" },
                  { id: 2, name: "纸质合同" },
               ],
            },
            {
               el: "select",
               label: "合同状态",
               code: "contractStatus",
               options: [
                  { id: 0, name: "未签署" },
                  { id: 1, name: "签署中" },
                  { id: 2, name: "签署完成" },
               ],
            },
            {
               el: "select",
               label: "规格",
               code: "courseCardSpecCategoryId",
               optionsFn: boxListAll,
               filterable: true,
               // labelWidth: "72px",
            },
            {
               el: "select",
               label: "课程卡类型",
               code: "courseCardType",
               // labelWidth: "97px",
               options: [
                  { id: 1, name: "次卡" },
                  { id: 2, name: "期限卡" },
               ],
            },
            {
               el: "select",
               label: "支付方式",
               code: "paymentModeId",
               optionsFn: payment,
               filterable: true,
            },
            {
               el: "select",
               label: "卡属性",
               code: "cardType",
               options: [
                  { id: 1, name: "办理卡" },
                  { id: 2, name: "赠送卡" },
               ],
            },
            {
               el: "select",
               label: "是否首张开卡",
               code: "isFirstSign",
               labelWidth: "113px",
               options: [
                  { id: 0, name: "否" },
                  { id: 1, name: "是" },
               ],
            },
            {
               el: "select",
               label: "是否开通纸质合同",
               code: "allowPaperContract",
               labelWidth: "140px",
               options: [
                  { id: 0, name: "否" },
                  { id: 1, name: "是" },
               ],
            },
            {
               el: "date",
               label: "收款时间",
               type: "daterange",
               code: "ssss",
               optionsFn: salesList,
               labelWidth: "100px",
               width: "220px",
               change: (val) => {
                  dateStartEnd =
                     { collectionTimeStart: val[0], collectionTimeEnd: val[1] };
               }
            },
         ],
         column: [
            { prop: "memberName", label: "会员" },
            { prop: "courseCardName", label: "课程卡名" },
            {
               prop: "courseCardType",
               label: "课程卡类型",
               html: (val) =>
                  val.courseCardType == 1 ? "次卡" : "期限卡",
            },
            { prop: "cardNo", label: "卡号" },
            { prop: "amount", label: "规格(次/天)" },
            { prop: "price", label: "价格" },
            { prop: "adjustPrice", label: "调整价格" },
            { prop: "privilegeTotal", label: "总优惠" },
            { prop: "actualPrice", label: "实际价格" },
            { prop: "phone", label: "手机号" },
            {
               prop: "status",
               label: "状态",
               html: (val) => {
                  let htmlStr = "";
                  switch (true) {
                     case val.status == 0:
                        htmlStr = `<span class="orange">待确认</span>`;
                        break;
                     case val.status == 10:
                        htmlStr = `<span>待付款</span>`;
                        break;
                     case val.status == 20:
                        htmlStr = `<span class="green">已完成</span>`;
                        break;
                     case val.status == -10:
                        htmlStr = `<span>未通过</span>`;
                        break;
                     case val.status == -20:
                        htmlStr = `<span>已取消</span>`;
                        break;
                     case val.status == -30:
                        htmlStr = `<span class="red">已作废</span>`;
                        break;
                     default:
                        break;
                  }
                  return htmlStr;
               },
            },
            {
               prop: "isFirstSign",
               label: "是否首次开卡",
               html: (val) => {
                  if (val.isFirstSign)
                     return `<span class="green">是</span>`;
                  else return `<span class="red">否</span>`;
               },
            },
            {
               prop: "cardType", label: "卡属性",
               html: (val) => {
                  if (val.cardType == 1)
                     return `办理卡`;
                  else return `赠送卡`;
               },
            },
            { prop: "salesmanName", label: "销售" },
            { prop: "operatorName", label: "操作人" },
            { prop: "paymentModeName", label: "支付方式" },
            { prop: "collectionTime", label: "收款时间" },
            {
               prop: 'action',
               label: "操作",
               width: 240,
               actives: [
                  {
                     name: '详情',
                     method: (val) => {
                        router.push({
                           name: "cardOpeningOrderDetail",
                           query: { id: val.id }
                        });
                     },
                  }, {
                     name: '编辑',
                     method: (val) => {
                        router.push({
                           name: "cardOpeningOrderEdit",
                           query: { id: val.id }
                        });
                     },
                  },
                  {
                     name: (val) => (val.status == 0 ? "取消" : ""),
                     method: (val) => {
                        courseOrdesStatus({ id: val.id, status: -20, })
                           .then((res) => {
                              if (res.code == 200) {
                                 upData();
                              }
                           });
                     },
                  },]
            },
         ],
      });
      const TableList = ref(null);
      const upData = () => {
         ElMessage.success("操作成功");
         TableList.value.update({ ...state.newFormDatas });
      };
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => { });
      onBeforeUnmount(() => { });

      const getList = computed(() => {
         return courseOrdesList;
      });
      const onSubmits = (event) => {
         delete event.ssss;
         state.newFormDatas = { ...event, ...dateStartEnd, ...hallIdObj };
         TableList.value.update(state.newFormDatas);
      };
      const reset = () => {
         state.formDatas = dateStartEnd = {};
         TableList.value.update({ ...hallIdObj });
      };
      const add = () => {
         router.push({ name: "cardOpeningOrderAdd" });
      };
      const Form = ref(null);
      const educe = () => {
         Form.value.scrollIntoViewFn('onSubmit', (formDate) => {
            let formDates = { ...formDate, ...dateStartEnd };
            console.log(formDates);
         });
      };
      return {
         ...toRefs(state),
         getList,
         TableList,
         onSubmits,
         hallIdObj,
         reset,
         add,
         Form,
         educe
      };
   },
});
</script>
<style lang="scss" scoped></style>
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
