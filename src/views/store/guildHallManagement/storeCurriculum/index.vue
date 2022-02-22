<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-01-18 13:55:09
 * @Descripttion: 开卡申请订单
-->
<template>
   <div>
      <Form :formDatas="formDatas"
            :formList="formList"
            onSubmits="搜索"
            :inline="true"
            @onSubmit="onSubmits"
            :isOnInfos="true"
            onInfos="重置"
            @onInfo="reset"
            :formItemStyle="{ width: '249px' }"
            :iconSelect="false"
            labelWidth="80px"></Form>
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
import { courseList, cardTransformStatus } from "@/api/city";
import { isShow } from "@/utils/index";
export default defineComponent({
   components: { Table, Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const hallIdObj = reactive({ hallId: store.getters.activeHallId });
      const optionsList = [
         { name: "否", id: 0 },
         { name: "是", id: 1 },
      ];
      const state = reactive({
         formDatas: {},
         newFormDatas: {},
         formList: [
            {
               label: "模糊查询",
               code: "name",
               suffix_icon: "el-icon-search",
               labelWidth: "91px",
               placeholder: "请输入名字",
            },
            {
               el: "select",
               label: "课程种类",
               code: "type",
               labelWidth: "120px",
               options: [
                  { id: 1, name: "团课" },
                  { id: 2, name: "私教课" },
                  { id: 3, name: "企业课" },
               ],
            },
            {
               el: "select",
               label: "是否显示在小程序",
               code: "display",
               labelWidth: "147px",
               options: [
                  { id: 0, name: "隐藏" },
                  { id: 1, name: "显示" },
               ],
            },
            {
               el: "select",
               label: "状态",
               code: "status",
               options: [
                  { id: 0, name: "禁用" },
                  { id: 1, name: "启用" },
               ],
            },
         ],
         column: [
            { prop: "name", label: "名称" },
            { prop: "nameEn", label: "英文名称" },
            { prop: "typeName", label: "课程种类" },
            { prop: "duration", label: "时长（分钟）" },
            { prop: "maxNumber", label: "单节课可约人数" },
            { prop: "minNumber", label: "最少上课人数" },
            {
               prop: "display",
               label: "是否显示在小程序",
               html: (val) => isShow(val.display, ["显示", "隐藏"]),
            },
            {
               prop: "status",
               label: "状态",
               html: (val) => {
                  let htmlStr = "";
                  switch (true) {
                     case val.status == 0:
                        htmlStr = `<span class="red">禁用</span>`;
                        break;
                     case val.status == 1:
                        htmlStr = `<span class="green">启用</span>`;
                        break;
                     default:
                        break;
                  }
                  return htmlStr;
               },
            },
            {
               prop: "action",
               label: "操作",
               actives: [
                  {
                     name: "详情",
                     method: (val) => {
                        router.push({
                           name: "storeCurriculumDetail",
                           query: { id: val.id },
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
         TableList.value.update({ ...state.newFormDatas, ...hallIdObj });
      };
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => { });
      onBeforeUnmount(() => { });

      const getList = computed(() => {
         return courseList;
      });
      const onSubmits = (event) => {
         state.newFormDatas = { ...event };
         TableList.value.update({ ...event, ...hallIdObj });
      };
      const reset = () => {
         state.formDatas = {};
         TableList.value.update({ ...hallIdObj });
      };
      return {
         ...toRefs(state),
         getList,
         TableList,
         onSubmits,
         hallIdObj,
         reset,
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
