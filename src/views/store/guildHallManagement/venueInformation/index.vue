<!--
 * @Author: jiu yin
 * @Date: 2021-11-25 16:43:29
 * @LastEditTime: 2022-01-21 15:29:30
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \hall-admin\src\views\store\guildHallManagement\venueInformation\index.vue
 * jiu
-->
<template>
   <div>
      <ul class="ul">
         <li>场馆名称：{{formDatas.name ||'无'}}</li>
         <li>英文名称：{{formDatas.nameEn ||'无'}}</li>
         <li>场馆图片:
            <div v-if="formDatas.pictures&&formDatas.pictures.length"
                 class="image-slot">
               <el-image style="width: 162px; height: 100px,display:flex"
                         v-for="(item,index) in formDatas.pictures"
                         :key="index"
                         :src="item"
                         fit="cover">
               </el-image>
            </div>
            <div class="null_img"
                 v-else>暂无图片
            </div>
         </li>
         <li>联系电话：{{formDatas.phone ||'无'}}</li>
         <li>邮箱地址：{{formDatas.email ||'无'}}</li>
         <li>&emsp;&emsp;地址：{{formDatas.fullAddress||'无'}}</li>
         <li>场馆描述：<span>{{formDatas.description||'无'}}</span> </li>
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
import { hallDetail, } from "@/api/city";
export default defineComponent({
   components: {},
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      //逻辑层主体
      const state = reactive({
         formDatas: {}
      });
      const hallIdObj = reactive({ id: store.getters.activeHallId });
      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      computed(() => { });
      onMounted(() => {
         console.log(hallIdObj.id == true);
         if (hallIdObj.id)
            hallDetail(hallIdObj).then(res => {
               if (res.code == 200) {
                  state.formDatas = res.data;
                  let { pictures } = state.formDatas;
                  pictures && (state.formDatas.pictures = JSON.parse(pictures));
               }
            });
         else return ElMessage.error("请选择场馆");
      });
      onBeforeUnmount(() => { });
      return {
         ...toRefs(state)
      };
   },
});
</script>
<style lang='scss' scoped>
.ul {
   color: rgba(0, 0, 0, 0.65);
   font-size: 14px;
   list-style: none;
   :last-child {
      span {
         display: inline-block;
         max-width: 500px;
         vertical-align: top;
      }
   }
   li {
      margin-bottom: 28px;
      .image-slot {
         display: inline-flex;
         flex-wrap: wrap;
         vertical-align: top;
         width: 680px;
         height: auto;
         text-align: left;
         .el-image {
            height: 150px;
            margin-right: 5px;
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
}
</style>
