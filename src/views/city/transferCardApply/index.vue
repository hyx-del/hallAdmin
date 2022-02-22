<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-17 11:10:33
 * @Descripttion: 开卡申请订单
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
            :formItemStyle="{width:'249px'}"
            :iconSelect="false"
            labelWidth="80px"></Form>
      <Table :showSortIndex="{ show: true, lable: '序号' }"
             :loadData="getList"
             :column="column"
             ref="TableList"
             :params="cityIdObj"></Table>
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
import Table from "@/components/Table";
import Form from "@/components/Form";
import { cardTransformList, cardTransformStatus } from "@/api/city";
import { isShow } from "@/utils/index";
export default defineComponent({
   components: { Table, Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const cityIdObj = reactive({ cityId: store.getters.activeCityId });
      const optionsList = [{ name: "否", id: 0 }, { name: "是", id: 1 }];
      const state = reactive({
         formDatas: {},
         newFormDatas: {},
         formList: [
            {
               label: "模糊查询", code: "keyword",
               suffix_icon: "el-icon-search", placeholder: "请输入名字或手机号",
               labelWidth: "91px",
            },
            {
               el: "select", label: "状态", code: "status",
               options: [
                  { id: 0, name: "待审核" },
                  { id: 1, name: "未付款(通过审核)" },
                  { id: -1, name: "未通过" },
                  { id: 2, name: "已付款" },
                  { id: -2, name: "已取消" },
               ]
            },
            {
               el: "select", label: "转场馆", code: "isTransformHall", options: optionsList
            },
            {
               el: "select", label: "转会员", code: "isTransformMember", options: optionsList
            },
            {
               el: "select", label: "转卡", code: "isTransformCard", options: optionsList
            }
         ],
         column: [
            { prop: 'memberName', label: "转卡人(会员)", },
            { prop: 'phone', label: "手机号", },
            {
               prop: 'isTransformHall', label: "转场馆",
               html: (val) => isShow(val.isTransformHall)
            },
            {
               prop: 'gender', label: "转会员",
               html: (val) => isShow(val.isTransformMember)
            },
            {
               prop: 'gender', label: "转卡",
               html: (val) => isShow(val.isTransformCard)
            },
            { prop: 'commission', label: "手续费", },
            { prop: 'payMoney', label: "支付补差", },
            { prop: 'createdAt', label: "申请时间", },
            {
               prop: 'status', label: "状态",
               html: (val) => {
                  let htmlStr = '';
                  switch (true) {
                     case val.status == 0:
                        htmlStr = `<span class="orange">待审核</span>`;
                        break;
                     case val.status == 1:
                        htmlStr = `<span class="blue">未付款(通过审核)</span>`;
                        break;
                     case val.status == -1:
                        htmlStr = `<span class="red">未通过审核</span>`;
                        break;
                     case val.status == 2:
                        htmlStr = `<span class="green">已付款(通过审核)</span>`;
                        break;
                     case val.status == -2:
                        htmlStr = `<span class="red">已取消</span>`;
                        break;
                     default:
                        break;
                  }
                  return htmlStr;
               }
            },
            {
               prop: 'action',
               label: "操作",
               actives: [
                  {
                     name: '详情',
                     method: (val) => {
                        sessionStorage.setItem("transferCardApplyDetail", JSON.stringify(val));
                        router.push({ name: "transferCardApplyDetail" });
                     },
                  }, {
                     name: (val) => val.status == 0 ? '审核' : '',
                     method: (val) => {
                        cardTransformStatus({ id: val.id, status: 1 }).then(res => {
                           if (res.code == 200) {
                              upData();
                           }
                        });
                     },
                  },
                  {
                     name: (val) => val.status == 0 ? '驳回' : '',
                     method: (val) => {
                        cardTransformStatus({ id: val.id, status: -1 }).then(res => {
                           if (res.code == 200) {
                              upData();
                           }
                        });
                     }
                  },
                  {
                     name: (val) => val.status == 1 ? '审核作废' : '',
                     method: (val) => {
                        cardTransformStatus({ id: val.id, status: 0 }).then(res => {
                           if (res.code == 200) {
                              upData();
                           }
                        });
                     },
                  },]
            },
         ]
      });
      const TableList = ref(null);
      const upData = () => {
         ElMessage.success("操作成功");
         TableList.value.update({ ...state.newFormDatas, ...cityIdObj });
      };
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => { });
      onBeforeUnmount(() => { });

      const getList = computed(() => {
         return cardTransformList;
      });
      const onSubmits = (event) => {
         state.newFormDatas = { ...event };
         TableList.value.update({ ...event, ...cityIdObj });
      };
      const reset = () => {
         state.formDatas = {};
         TableList.value.update({ ...cityIdObj });
      };
      return {
         ...toRefs(state),
         getList,
         TableList,
         onSubmits,
         cityIdObj,
         reset
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
