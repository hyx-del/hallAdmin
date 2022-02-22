<!--
 * @Author: jiu yin
 * @Date: 2022-02-18 14:00:05
 * @LastEditTime: 2022-02-18 15:45:29
 * @LastEditors: jiu yin zhen jing
 * @FilePath: \hall-admin\src\views\headquarters\secondaryData\gift\index.vue
 * jiu
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
            onAdds="添加"
            @onAdd="addTitle"
            :isAdd='true'
            :formItemStyle="{width:'249px'}"
            :iconSelect="false"
            labelWidth="80px"></Form>
      <Table :showSortIndex="{ show: true, lable: '序号' }"
             :loadData="getList"
             :column="column"
             ref="TableList"
             :params="cityIdObj"></Table>
      <el-dialog v-model="dialogFormVisible"
                 width="500px"
                 :title="title">
         <div id='gift'>
            名称：<el-input v-model="giftData.name"
                      autocomplete="off"
                      size="mini"></el-input>
         </div>
         <template #footer>
            <span class="dialog-footer">
               <el-button @click="dialogFormVisible = false">取消</el-button>
               <el-button type="primary"
                          @click="add"
                          v-if="title=='新建赠品'">确定</el-button>
               <el-button type="primary"
                          @click="edit"
                          v-else>确定</el-button>
            </span>
         </template>
      </el-dialog>
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
   import { getGiftList, getGiftStatus, getGiftDelete, getGiftEdit, getGiftAdd, } from "@/api/baseSet";
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
            dialogFormVisible: false,
            giftData: {},
            title: "新建赠品",
            formList: [
               {
                  label: "名称", code: "name",
                  suffix_icon: "el-icon-search", placeholder: "请输入赠品名称",
                  labelWidth: "91px",
               },
               {
                  el: "select", label: "状态", code: "status",
                  options: [
                     { id: 0, name: "禁用" },
                     { id: 1, name: "启用" }
                  ]
               },
            ],
            column: [
               { prop: 'name', label: "名称", },
               {
                  prop: 'status', label: "状态",
                  html: (val) => isShow(val.status, ['启用', '禁用'])
               },
               {
                  prop: 'action',
                  label: "操作",
                  actives: [
                     {
                        name: (val) => val.status == 1 ? '禁用' : '启用',
                        method: (val) => {
                           getGiftStatus({ id: val.id, status: val.status == 1 ? 0 : 1 }).then(res => {
                              if (res.code == 200) {
                                 ElMessage.success(`${val.status == 1 ? '禁' : '启'}用成功`)
                                 upData();
                              }
                           })
                        },
                     }, {
                        name: (val) => '删除',
                        method: (val) => {
                           getGiftDelete({ id: val.id }).then(res => {
                              if (res.code == 200) {
                                 ElMessage.success("删除成功")
                                 upData();
                              }
                           })
                        },
                     },
                     {
                        name: (val) => '编辑',
                        method: (val) => {
                           state.title = '编辑赠品'
                           state.dialogFormVisible = true
                           state.giftData = { ...val }
                        }
                     },
                  ]
               },
            ]
         });
         const TableList = ref(null);
         const upData = () => {
            TableList.value.update({ ...state.newFormDatas, ...cityIdObj });
         };
         //count或book.name改变了
         // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
         computed(() => { });
         onMounted(() => { });
         onBeforeUnmount(() => { });

         const getList = computed(() => {
            return getGiftList;
         });
         const onSubmits = (event) => {
            state.newFormDatas = { ...event };
            TableList.value.update({ ...event, ...cityIdObj });
         };
         const reset = () => {
            state.formDatas = {};
            TableList.value.update({ ...cityIdObj });
         };

         const thenUtils = (src) => {
            ElMessage.success(src)
            upData();
            state.giftData = {}
            state.dialogFormVisible = false
         }
         const addTitle = () => {
            state.dialogFormVisible = true
            state.title = '新建赠品'
         }
         const add = (type) => {
            if (!state.giftData.name) return ElMessage.error("请输入赠品名称")
            getGiftAdd(state.giftData).then(res => {
               if (res.code == 200) {
                  thenUtils("新建赠品成功")
               }
            })

         }
         const edit = () => {
            if (!state.giftData.name) return ElMessage.error("请输入赠品名称")
            getGiftEdit(state.giftData).then(res => {
               if (res.code == 200) {
                  thenUtils("编辑赠品成功")
               }
            });
         }
         return {
            ...toRefs(state),
            getList,
            TableList,
            onSubmits,
            cityIdObj,
            reset,
            add,
            edit,
            addTitle
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
   #gift {
      &:before {
         content: "*";
         color: var(--el-color-danger);
         margin-right: 4px;
         display: inline-block;
      }
      .el-input {
         width: 285px;
      }
   }
</style>
