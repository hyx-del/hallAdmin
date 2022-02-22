<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 16:03:11
 * @Descripttion: 课程卡
-->
<template>
   <div>
      <h2>课程卡详情</h2>
      <el-tabs v-model="activeName"
               @tab-click="tabClick">
         <el-tab-pane label="基本信息"
                      name="0">
            <transition name="bounce">
               <div v-if="activeName==0"
                    style="height:650px;overflow:auto">
                  <Form :formDatas="formDatas"
                        :formList="formList"
                        :iconSelect="false"
                        labelWidth="138px"
                        :isBut="false" />
                  <h2 style="margin-left:32px">使用限制</h2>
                  <hr>
                  <ul class="ul">
                     <li>最大同行人数：
                        <span>{{formDatas.maxCompanion}}</span> 人
                     </li>
                     <li>可提前预约：<span>{{formDatas.maxOrder}}</span>节课</li>
                     <li><span>{{cycle_type(classLimit.cycle_type)}}</span>
                        共计可上：<span>{{classLimit.count}}</span>节课</li>
                     <li>每个会员限购：
                        <span>{{formDatas.maxPurchase}}</span>张
                     </li>
                     <li class="timeLimit">限制
                        <span>{{cycle_type(timeLimit.cycle_type)}}</span>
                        <span v-if="timeLimit.cycle_type=='week'">
                           {{weekArr[timeLimit.week_day-1]}}
                        </span>
                        <span v-if="timeLimit.cycle_type=='month'">
                           {{timeLimit.month_day+"号"}}</span>
                        <span>{{timeLimit.start_time}}</span>到
                        <span>{{timeLimit.end_time}}</span>使用
                     </li>
                  </ul>
               </div>
            </transition>
         </el-tab-pane>

         <el-tab-pane label="规格"
                      name="1">
            <transition name="bounce">
               <div v-if="activeName==1"
                    style="height:650px;overflow:auto">
                  <Form :formDatas="formDatasSpec"
                        :formList="formListSpec"
                        onSubmits="搜索"
                        :inline='true'
                        @onSubmit="onSubmits"
                        :isOnInfos="true"
                        onInfos="重置"
                        @onInfo="reset"
                        :formItemStyle="{width:'267px'}"
                        :iconSelect="false"
                        labelWidth="85px"></Form>
                  <Table :showSortIndex="{ show: true, lable: '序号' }"
                         :loadData="getList"
                         :column="column"
                         :params="courseCardId"
                         :headHight="530"
                         ref='TableList'></Table>
               </div>
            </transition>
         </el-tab-pane>

         <el-tab-pane label="城市/场馆"
                      name="2">
            <transition name="bounce">
               <div v-if="activeName==2"
                    class="wrap">
                  <div class="left">
                     <dl v-for='item in courseHallList'
                         :key='item.cityId'>
                        <dt>{{item.cityName}}</dt>
                        <dd v-for="(i) in item.halls"
                            :key="i.hallId"
                            @click="halls(i)"
                            :class="i.hallId==activeId.hallId?'actives':''">
                           {{i.hallName}}</dd>
                     </dl>

                  </div>
                  <div class="right">
                     <dl>
                        <dt>设置规格价格</dt>
                        <dd class="dd dt">选择场馆：
                           <span>{{activeId.hallName}}</span>
                        </dd>
                        <dd v-if="courseHallDetail.length">
                           <div v-for="item in courseHallDetail"
                                :key="item.courseCardSpecId"
                                class="dd"> 规格：<span>{{courseCardSpecs(item.courseCardSpecs)}}</span>
                              <p>当前价格：<span>{{item.price}}元</span></p>
                           </div>
                        </dd>
                        <dd v-else
                            class="dd"><span class="span">暂无数据</span></dd>
                     </dl>
                  </div>
               </div>
            </transition>
         </el-tab-pane>
      </el-tabs>
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
import Form from "@/components/Form";
import Table from "@/components/Table";
import { courseCardDetail, courseCardSpecsList, courseHall, courseHallPrice } from "@/api/city";
import { isShow, switchIsShow } from "@/utils/index";
import { boxList, boxListType } from "@/api/common";
export default defineComponent({
   components: { Table, Form },
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const idObj = route.query;
      const courseCardId = reactive({ courseCardId: idObj.id });
      const state = reactive({
         activeName: "0",
         //基本信息
         formDatas: {},
         formList: [
            { label: "名称", code: "name", disabled: true },
            {
               el: "radio", label: "类型", code: "type",
               radios: [{ name: "次卡", id: 1 }, { name: "期限卡", id: 2 }], disabled: true
            },
            {
               el: "radio", label: "可上课类型", code: "courseType",
               radios: [{ name: "团课", id: 1 }, { name: "私教课", id: 2 }, { name: "企业课", id: 3 }],
               disabled: true, width: "300px"
            },
            {
               el: "radio", label: "体验卡", code: "isExperienceCard",
               radios: [{ name: "是", id: 1 }, { name: "否", id: 0 }], disabled: true
            },//
            {
               el: "select", label: "通用类型", code: "generalType",
               options: [{ name: "全国通", id: 1 }, { name: "城市通", id: 2 },
               { name: "单店", id: 3 }, { name: "通店", id: 4 },],
               disabled: true, placeholder: '暂无数据'
            },
            // {
            //    el: "select", label: "开卡电子合同模板", code: "b", optionsFn: selectTest, disabled: true,placeholder:'暂无数据'
            // },//
            // {
            //    el: "select", label: "开卡纸质合同模板", code: "b", optionsFn: selectTest, disabled: true,placeholder:'暂无数据'
            // },//
            { label: "最大绑定会员", code: "maxBind", disabled: true },
            { label: "权重", code: "weight", disabled: true, },
            { el: "textarea", label: "简介", code: "introduction", disabled: true, width: "400px" },
         ],
         classLimit: {},
         timeLimit: {},
         weekArr: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日',],
         //规格
         formDatasSpec: {},
         formListSpec: [
            { el: "select", label: "规格类别", code: "categoryId", options: [], filterable: true, },
            {
               el: "select", label: "状态", code: "status",
               options: [{ name: "启用", id: 1 }, { name: "禁用", id: 0 }]
            },
         ],
         column: [
            { prop: 'amount', label: "次数", },
            { prop: 'price', label: "价格", },
            { prop: 'operatorName', label: "操作人", },
            {
               prop: 'status', label: "状态",
               html: (val) => isShow(val.status, ["启用", "禁用"]),
            },
            { prop: 'createdAt', label: "创建时间", },
         ],
         //城市/场馆
         courseHallList: [],
         activeId: {},
         courseHallDetail: []
      });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => {
         courseCardDetailFn();
         boxListType({ size: 1000 }).then(res => {
            if (res.code == 200) {
               state.formListSpec[0].options = res.data.records;
            }
         });
      });
      onBeforeUnmount(() => { });
      const TableList = ref(null);

      const getList = computed(() => {
         return courseCardSpecsList;
      });
      //基本信息
      const courseCardDetailFn = () => {
         courseCardDetail(idObj).then(res => {
            if (res.code == 200) {
               let { type } = state.formDatas = res.data;
               state.column[0].label = type == 1 ? '次数' : '天数';
               state.formDatas.classLimit &&
                  (state.classLimit = JSON.parse(state.formDatas.classLimit));
               state.formDatas.timeLimit &&
                  (state.timeLimit = JSON.parse(state.formDatas.timeLimit));
               console.log(state.classLimit, state.timeLimit);
            }
         });
      };
      //城市场馆
      const courseHallFn = async () => {
         let result = await courseHall();
         state.courseHallList = result.data;
         let [{ halls }] = state.courseHallList;
         state.activeId = halls[0];
         let resultPrice =
            await courseHallPrice(
               { hallId: state.activeId.hallId, ...courseCardId });
         state.courseHallDetail = resultPrice.data.filter(item => item.price);
      };

      const onSubmits = (event) => {
         TableList.value.update({ ...event, ...courseCardId });
      };
      const reset = () => {
         state.formDatasSpec = {};
         TableList.value.update({ ...courseCardId });
      };

      //tab
      const tabClick = (tab, event) => {
         if (tab.index == 0) {
            courseCardDetailFn();
         } else if (tab.index == 2) {
            courseHallFn();
         }
      };

      //城市场馆单个查询
      const halls = (i) => {
         state.activeId = i;
         courseHallPrice({ hallId: i.hallId, ...courseCardId }).then(res => {
            if (res.code == 200) {
               state.courseHallDetail = res.data.filter(item => item.price);
               state.courseHallDetail.hallName = i.hallName;
            }
         });
      };

      const courseCardSpecs = (item) => {
         let isDay = state.formDatas.type == 1 ? '次' : '天';
         return `${item.amount}${isDay}/${item.price.toFixed(2)}元`;
      };

      const cycle_type = (val) => {
         let text;
         switch (true) {
            case val == "day":
               text = '每天';
               break;
            case val == "week":
               text = '每周';
               break;
            case val == "month":
               text = '每月';
               break;
            default:
               break;
         }
         return text;
      };
      return {
         ...toRefs(state),
         getList,
         TableList,
         onSubmits,
         cycle_type,
         tabClick,
         courseCardId,
         halls,
         courseCardSpecs,
         reset
      };
   },
});
</script>
<style lang='scss' scoped>
.box {
   height: auto;
}
.timeLimit {
   span {
      display: inline-block;
      padding: 0 3px;
   }
}
.bounce-enter-active {
   animation: bounce-in 0.5s;
}
@keyframes bounce-in {
   0% {
      transform: translate3d(2000px, 0, 0);
   }

   100% {
      transform: translate3d(0, 0, 0);
   }
}
.ul {
   color: rgba(0, 0, 0, 0.65);
   font-size: 14px;
   list-style: none;
   li {
      margin-bottom: 28px;
      span {
         font-weight: bold;
         color: red;
      }
   }
}
.wrap {
   display: flex;
   padding: 3px;
   .left {
      min-width: 210px;
      height: 650px;
      box-sizing: border-box;
      padding: 10px 0;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
      overflow-y: auto;
      dl {
         list-style: none;
         margin: 0;
         padding: 0;
         margin-top: 4px;
         margin-left: 3px;
         text-indent: 20px;
         dt {
            font: bold 16px "微软雅黑";
            color: #333333;
            margin-bottom: 3px;
         }
         dd {
            margin: 0;
            font: 13px/34px "微软雅黑";
            cursor: pointer;
            padding: 4px 0;
         }
         .actives {
            transition: 0.1s;
            font-size: 15px;
            color: var(--el-color-primary);
            text-decoration: underline;
            border-right: 4px solid #2e8de6;
            font-weight: bold;
            background: #e4f2ff repeat;
            animation: activesTranslates 0.5s;
            @keyframes activesTranslates {
               0% {
                  transform: translateX(-50%);
               }
               100% {
                  transform: translateX(0);
               }
            }
         }
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
      min-width: 960px;
      dl {
         border: 1px solid #e8e8e8cc;
         color: rgba(0, 0, 0, 0.85);
         font-size: 14px;
         dt {
            padding-left: 24px;
            line-height: 45px;
            border-bottom: 1px solid #e8e8e8cc;
            background: var(--el-color-primary);
            color: #fafafa;
         }

         .dd {
            display: flex;
            padding: 0 24px;
            border-bottom: 1px solid #e8e8e8cc;
            line-height: 68px;
            p {
               padding: 0;
               margin: 0;
            }
            span {
               width: 247px;
               font-weight: bold;
               color: red;
            }
         }
         .dt {
            margin-left: 11px;
            line-height: 57px;
         }
         .span {
            width: 100% !important;
            text-align: center;
         }
      }
   }
}
</style>