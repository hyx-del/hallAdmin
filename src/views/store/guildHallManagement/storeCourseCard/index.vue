<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-01-18 13:52:39
 * @Descripttion: 门店课程卡
-->
<template>
   <div>
      <Form :formDatas="formDatas"
            :formList="formList"
            onSubmits="搜索"
            :inline='true'
            @onSubmit="onSubmits"
            :isOnInfos="true"
            onInfos="重置"
            @onInfo="reset"
            :formItemStyle="{width:'267px'}"
            :iconSelect="false"
            labelWidth="65px"></Form>
      <Table :showSortIndex="{ show: true, lable: '序号' }"
             :loadData="getList"
             :column="column"
             :params="hallIdObj"
             ref="TableList"></Table>
   </div>
</template>
<script>
import {
   computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref,
   toRefs, watch
} from 'vue';
//import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Table from "@/components/Table";
import Form from "@/components/Form";
import { courseCardList, cardTransformStatus } from "@/api/city";
import { isShow, switchIsShow } from "@/utils/index";
export default defineComponent({
   components: { Table, Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const hallIdObj = reactive({ hallId: store.getters.activeHallId });
      const state = reactive({
         formDatas: {},
         formList: [
            { label: "名称", code: "name", suffix_icon: "el-icon-search",labelWidth: "91px", placeholder: "请输入名称" },
            {
               el: "select", label: "类型", code: "type",
               options: [{ name: "次数卡", id: 1 }, { name: "期限卡", id: 2 },]
            },
            {
               el: "select", label: "可上课类型", code: "courseType", labelWidth: "100px",
               options: [{ name: "团课", id: 1 }, { name: "私教课", id: 2 }, { name: "企业课", id: 3 }]
            },
            {
               el: "select", label: "通用类型", code: "generalType", labelWidth: "100px",
               options: [{ name: "全国通", id: 1 }, { name: "城市通", id: 2 },
               { name: "单店", id: 3 }, { name: "通店", id: 4 },]
            },
            {
               el: "select", label: "状态", code: "status",
               options: [{ name: "启用", id: 1 }, { name: "禁用", id: 2 },]
            },
         ],
         column: [
            { prop: 'id', label: "id", },
            { prop: 'name', label: "名称", },
            {
               prop: 'type', label: "类型",
               html: (val) =>
                  switchIsShow(val.type,
                     [{ isVal: 1, str: "次卡" }, { isVal: 2, str: "期限卡" }]),
            },
            {
               prop: 'generalType', label: "通用类型",
               html: (val) =>
                  switchIsShow(val.generalType,
                     [
                        { isVal: 1, str: "全国通" }, { isVal: 2, str: "城市通" },
                        { isVal: 3, str: "单店" }, { isVal: 4, str: "通店" }
                     ]),
            },
            { prop: 'maxBind', label: "可绑定会员数", },
            { prop: 'weight', label: "权重", },
            {
               prop: 'courseType', label: "可上课类型",
               html: (val) =>
                  switchIsShow(val.courseType,
                     [{ isVal: 1, str: "团课" },
                     { isVal: 2, str: "私教课" }, { isVal: 3, str: "企业课" }]),
            },
            {
               prop: 'status', label: "状态",
               html: (val) => isShow(val.status == 1, ["启用", "禁用"]),
            },
            { prop: 'operatorName', label: "创建人", },
            { prop: 'createdAt', label: "创建时间", },
            {
               prop: 'action',
               label: "操作",
               actives: [{
                  name: '详情',
                  method: (val) => {
                     router.push({ name: "storeCourseCardDetail",
                      query: { id: val.id, } });
                  },
               },]
            },
         ]
      });
      const TableList = ref(null);
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => { });
      onBeforeUnmount(() => { });

      const getList = computed(() => {
         return courseCardList;
      });
      const onSubmits = (event) => {
         TableList.value.update({ ...event, ...hallIdObj });
         console.log(event, "搜索");
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
         reset,
         hallIdObj
      };
   },
});
</script>
<style lang='scss' scoped>
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
