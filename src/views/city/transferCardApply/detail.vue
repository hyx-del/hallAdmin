<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-17 13:36:34
 * @Descripttion: 开卡申请订单
-->
<template>
   <div>
      <h2 id="submitTime">{{detail.toCourseCardName}}卡</h2>
      <span class="spanTime">提交时间：{{detail.createdAt}}</span>
      <div v-if="detail.status==0"
           style="display:inline-block">
         <el-button type="primary"
                    size="mini"
                    @click="audit">审核</el-button>
         <el-button type="primary"
                    size="mini"
                    @click="reject">驳回</el-button>
      </div>
      <div style="width:620px">
         <Table :loadData="getLists"
                :column="column"
                :hidden="false"
                :params="{size:2}"></Table>
      </div>
      <ul class="detal">
         <li><span>手续费：</span> {{(detail.commission||0) +'元'}}</li>
         <li><span>转卡补差：</span> {{(detail.adjustShortfall||0) +'元'}}</li>
         <li><span>总补差价：</span> {{(detail.payMoney||0) +'元'}}</li>
         <li><span>备注：</span> {{(detail.remark||0) +'元'}}</li>
         <li><span>附件：</span>
            <div class="image-slot"
                 v-if="detail.appendixes&&detail.appendixes.length">
               <img style=""
                    v-for="(item,index) in detail.appendixes"
                    :key="index"
                    :src="item" />
            </div>
            <div class="null_img"
                 v-else>暂无图片
            </div>
         </li>
      </ul>
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
   import { cardTransformStatus } from "@/api/city";
   export default defineComponent({
      components: { Table, },
      setup(props, context) {
         const store = useStore();
         const router = useRouter();
         const route = useRoute();
         //逻辑层主体
         const state = reactive({
            detail: JSON.parse(sessionStorage.getItem("transferCardApplyDetail")),
            // getList: [],
            column: [
               { prop: 'name', label: "#", width: 120 },
               { prop: 'hallName', label: "场馆", },
               { prop: 'memberName', label: "会员", },
               { prop: 'courseCardName', label: "卡种", },
               { prop: 'balance', label: "剩余天数", },
            ],
         });
         //count或book.name改变了
         // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
         computed(() => { });
         onMounted(() => {
            state.detail.appendixes &&
               (state.detail.appendixes = JSON.parse(state.detail.appendixes));
            state.column[4].label = `剩余${state.detail.courseCardType == 1 ? '次' : '天'}数`
            console.log(state.detail);
         });
         onBeforeUnmount(() => { });

         const getLists = computed(() => {
            let { hallName, toHallName, memberName, toMemberName, courseCardName, toCourseCardName, oldBalance, newBalance } = state.detail;
            return [
               {
                  name: "转入", hallName, memberName, courseCardName,
                  balance: oldBalance + ''
               },
               {
                  name: "转出", hallName: toHallName, memberName: toMemberName, courseCardName: toCourseCardName, balance: newBalance + ''
               }];
         });

         const audit = () => {
            let { id } = state.detail;
            cardTransformStatus({ id, status: 1 }).then(res => {
               if (res.code == 200) {
                  state.detail.status = 1;
                  ElMessage.success("审核成功");
               }
            });
         };
         const reject = () => {
            let { id } = state.detail;
            cardTransformStatus({ id, status: -1 }).then(res => {
               if (res.code == 200) {
                  state.detail.status = -1;
                  ElMessage.success("驳回成功");
               }
            });
         };
         return {
            ...toRefs(state),
            getLists,
            audit,
            reject
         };
      },
   });
</script>
<style lang='scss' scoped>
   #submitTime {
      display: inline-block;
      padding-right: 70px;
   }
   .detal {
      list-style: none;
      font: bold 15px/30px "微软雅黑";
      margin: 20px 0;
      margin-left: -52px;
      span {
         display: inline-block;
         width: 80px;
         text-align: right;
         margin-right: 9px;
      }
      .image-slot {
         display: inline-block;
         vertical-align: top;
         width: 70%;
         height: auto;
         text-align: left;
         img {
            margin-top: 10px;
            width: 162px;
            margin-right: 5px;
            height: 150px;
            object-fit: cover;
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
   }
   .spanTime {
      display: inline-block;
      margin-right: 125px;
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
