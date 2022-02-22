<template>
  <emptyBox :bottom="10">
    <formList
      ref="formListRef"
      :formInitData="formInitData"
      :itemList="itemList"
      :buttons="buttons"
      :config="config"
      :form-state="formState"
    >
        <template #tables>
            <Table
                ref="TableRef"
                :data="tableList"
                :column="column"
                :headHight="600"
                :params="params"
            />
        </template>
    </formList>
  </emptyBox>
</template>

<script>
/*
 * 上课确认
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import Table from '@/components/Table'
import {courseList} from '@/api/school'
import {confirmedPut, confirmedRecord, planDetailWorkbench} from '@/api/coursePlan'
import { ElMessage, ElMessageBox } from "element-plus";


export default {
  components: {
    formList,
    emptyBox,
      Table,
  },
  setup() {
    const router = useRouter();
    const formListRef = ref(null);
    const TableRef = ref();
    const state = reactive({
        id: "",
        config: { ...addFormBottom },
        getList:courseList,
        params:{
            id:computed(()=>state.id)
        },
        tableList:[],
        column:[
            {
                label: '教练',
                prop: 'coachName',
            },
            {
                label: '操作时间',
                prop: 'createdAt',
            },
            {
                label: '确认人数',
                prop: 'attendAmount',
            },
            {
                label: '课时费（系统计算）',
                prop: 'sysCourseFee',
            },
            {
                label: '课时费',
                prop: 'courseFee',
            },
            {
                label: '操作人',
                prop: 'operatorName',
            },
            {
                label: '备注',
                prop: 'remark',
            },

        ],
        formInitData: {},
        formState:[],
        itemList:[
            {
                el: "itemSlot",
                code: "itemSlot",
                inItemSlot: {
                    el:'div',
                    text: "上课确认",
                    style: {
                        fontSize:'16px',
                        fontWeight:'600',
                        marginBottom: '10px',
                    },
                },
            },
            {
                label: '上课人数',
                code: 'attendAmount',
                type:'number',
                checkType:'number',
            },
            {
                label: '课时费用',
                code: 'coachCourseFee',
                type:'number',
                checkType:'number',
            },
            {
                el:'textArea',
                label: '备注',
                code: 'remark',
            },
            {
                el: "itemSlot",
                show: computed(() =>state.formInitData.assistantFeeList&&state.formInitData.assistantFeeList.length>0),
                label: '助教课时费',
                code: 'itemSlot',
                inItemSlot: {
                    el:'div',
                    text: "助教课时费",
                    style: {
                        fontSize:'16px',
                        fontWeight:'600',
                        marginBottom: '10px',
                    },
                },
            },
            {
                el: "addItem",
                show:false,
                label: '助教列表',
                code: 'addItem',
                rightButtonShow:false,
                itemList:[]
            },
            {
                el: "line",
                code: 'line',
            },
            {
                el: "slot",
                slotName:'tables',
                label: '确认记录',
                code: 'slot',
                valueStyle:{
                    width:'1200px'
                }
            },
        ],
      // 按钮
        buttons:[
            {
                name: "取消",
                click:()=>{
                    router.go(-1);
                }
            },
            {
                funType: "confirm",
                type: "primary",
                name: "确认",
                click:({value})=>{
                    let data = value;
                    // if (state.formInitData?.assistantFeeList.length>0) {
                    //     data.assistantFeeList=[]
                    //     let add=data.addItem[0]
                    //     for (let key in add) {
                    //         data.assistantFeeList.push({
                    //             coachId:parseInt(key.replace('id','')),
                    //             assistantCourseFee:parseInt(add[key])
                    //         })
                    //     }
                    // }
                    console.log(data)
                    // 编辑
                    confirmedPut({ ...data}).then(res => {
                      ElMessage.success("编辑成功，即将返回列表");
                      setTimeout(() => {
                        router.go(-1);
                      }, 500);
                    });
                }
            }
        ],
      // 初始化
      start: () => {
          if ( state.id||(useRoute().query && useRoute().query.id)) {
              state.id =state.id|| useRoute().query.id;
              // 查询详情
              confirmedRecord({coursePlanId:state.id}).then(({data}) => {
                  state.formInitData=data
                  //助教
                  if (data.assistantFeeList&&data.assistantFeeList.length>0) {
                      let assis={},itemList;
                      itemList=data.assistantFeeList.map(item=>{
                          assis[`id${item.coachId}`]=item.assistantCourseFee
                          return {
                              label:item.coachName,
                              code: `id${item.coachId}`,
                              type:'number',
                              checkType:'numberPoint2',
                              placeholder:`请输入${item.coachName}的结算`,
                              valueStyle:{
                                  marginBottom:'15px'
                              }
                          }
                      })
                      state.formInitData={...state.formInitData,addItem:[{...assis}]}
                      state.formState=[
                          {
                              code:'addItem',
                              show:true,
                              backType:'number',
                              itemList:itemList
                          }
                      ]
                  }
                  // 确认记录
                  state.tableList=data.confirmRecordList||[]
              });
          }
      }
    });
    state.start();
    return {
        TableRef,
      formListRef,
      ...toRefs(state)
    };
  }
};
</script>

<style lang="scss" scoped></style>
