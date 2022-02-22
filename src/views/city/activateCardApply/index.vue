<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 16:00:19
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
            onAdds="导出"
            @onAdd="out"
            :inline="true"
            :formItemStyle="{ width: '370px' }"
            :iconSelect="false"
            :butStyle="{ marginLeft: '25px' }"
            labelWidth="140px"></Form>
      <Table :showSortIndex="{ show: true, lable: '序号' }"
             :loadData="getList"
             :column="column"
             ref="TableList"
             :params="cityIdObj"></Table>
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
import { courseOrdesList, courseOrdesStatus } from "@/api/city";
import { salesList, getSelectHallListAPI } from "@/api/common";
export default defineComponent({
   components: { Table, Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //store.getters.activeSchoolId,store.getters.activeClassId,
      const cityIdObj = reactive({ cityId: store.getters.activeCityId });
      //逻辑层主体
      const state = reactive({
         formDatas: {},
         newFormDatas: {},
         formList: [
            {
               label: "模糊查询",
               code: "keyword",
               suffix_icon: "el-icon-search",
               placeholder: "请输入名字或手机号",
            },
            {
               el: "select",
               label: "特价审批",
               code: "adjustPrice",
               options: [
                  { id: "", name: "全部" },
                  { id: false, name: "否" },
                  { id: true, name: "是" },
               ],
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
               label: "门店",
               code: "hallId",
               optionsFn: getSelectHallListAPI,
               filterable: true,
            },
            {
               el: "select",
               label: "状态",
               code: "status",
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
               filterable: true,
            },
            {
               el: "select",
               label: "课程卡类型",
               code: "courseCardType",
               options: [
                  { id: 1, name: "次卡" },
                  { id: 2, name: "期限卡" },
               ],
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
               options: [
                  { id: 0, name: "否" },
                  { id: 1, name: "是" },
               ],
            },
            {
               el: "select",
               label: "是否开通纸质合同",
               code: "allowPaperContract",
               options: [
                  { id: 0, name: "否" },
                  { id: 1, name: "是" },
               ],
            },
         ],
         column: [
            { prop: "hallName", label: "场馆" },
            { prop: "memberName", label: "会员" },
            { prop: "phone", label: "手机号" },
            { prop: "courseCardName", label: "课程卡名" },
            {
               prop: "courseCardType",
               label: "课程卡类型",
               html: (val) => { return val.courseCardType == 1 ? "次卡" : "期限卡"; },
            },
            { prop: "cardNo", label: "卡号" },
            { prop: "amount", label: "规格(次/天)" },
            { prop: "price", label: "价格" },
            { prop: "actualPrice", label: "申请价格" },
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
            { prop: "collectionTime", label: "提交时间" },
            {
               prop: "action",
               label: "操作",
               width: 260,
               actives: [
                  {
                     name: "详情",
                     method: (val) => {
                        router.push({
                           name: "activateCardApplyDetail",
                           query: { id: val.id, isEdit: true, courseCardId: val.courseCardId },
                        });
                     },
                  },
                  {
                     name: (val) => (val.status == 0 ? "编辑" : ""),
                     method: (val) => {
                        router.push({
                           name: "activateCardApplyDetail",
                           query: { id: val.id, isEdit: false, courseCardId: val.courseCardId },
                        });
                     },
                  },
                  {
                     name: (val) => (val.status == 0 ? "通过" : ""),
                     method: (val) => {
                        courseOrdesStatus({
                           id: val.id,
                           status: 10,
                        }).then((res) => {
                           if (res.code == 200) {
                              upData();
                           }
                        });
                     },
                  },
                  {
                     name: (val) => (val.status == 0 ? "不通过" : ""),
                     method: (val) => {
                        courseOrdesStatus({
                           id: val.id,
                           status: -10,
                        }).then((res) => {
                           if (res.code == 200) {
                              upData();
                           }
                        });
                     },
                  },
                  {
                     name: (val) =>
                        [0, 10].includes(val.status) ? "作废" : "",
                     method: (val) => {
                        courseOrdesStatus({
                           id: val.id,
                           status: -30,
                        }).then((res) => {
                           if (res.code == 200) {
                              upData();
                           }
                        });
                     },
                  },
               ],
            },
         ],
      });
      const TableList = ref(null);
      const upData = () => {
         ElMessage.success("操作成功");
         TableList.value.update({ ...state.newFormDatas, ...cityIdObj });
      };
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => { 
         console.log( `#${Math.floor(Math.random() * 0xffffff).toString(16)}`);
      });
      onBeforeUnmount(() => { });

      const getList = computed(() => {
         return courseOrdesList;
      });
      const onSubmits = (event) => {
         state.newFormDatas = { ...event };
         TableList.value.update({ ...event, ...cityIdObj });
      };
      const reset = () => {
         state.formDatas = {};
         TableList.value.update({ ...cityIdObj });
      };
      const out = (event) => {
         console.log('导出', event);
      };
      return {
         ...toRefs(state),
         getList,
         TableList,
         onSubmits,
         cityIdObj,
         reset,
         out
      };
   },
});
</script>
<style lang="scss" scoped></style>
<style lang="scss">
</style>
