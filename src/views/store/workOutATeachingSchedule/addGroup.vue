<template>
    <emptyBox bottom="70">
        <formList
            ref="formListRef"
            :formInitData="formInitData"
            :itemList="itemList"
            :buttons="buttons"
            :config="config"
        />
    </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed,inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import {arrangingList, testList, weekList} from '@/utils/enum/select'

export default {
    components: {
        formList,
        emptyBox
    },
    porps: [],
    setup() {
        // const updateLastTitle= inject('updateLastTitle')
        // updateLastTitle(456)
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            formInitData: {},
            config: { ...addFormBottom },
            itemList:[
                {
                    label: '课程名称',
                    code: 'aaa6073',
                },
                {
                    el:'select',
                    label: '教练',
                    code: 'aaa46502',
                    list:testList
                },
                {
                    el:'radio',
                    label: '教室类型',
                    code: 'aaa83195',
                    default:'1',
                    list:testList,
                    required:false,
                },
                {
                    el:'select',
                    label: '教室',
                    code: 'aaa26313',
                    list:testList,
                },
                {
                    el:'select',
                    label: '助教',
                    code: 'aaa903',
                    list:testList,
                    required:false,
                },
                {
                    el:'select',
                    label: '标签',
                    code: 'aaa16633',
                    required:false,
                },
                {
                    el:'inputNumber',
                    label: '可约人数',
                    code: 'aaa6388',
                    required:false,
                },
                {
                    el:'inputNumber',
                    label: '旁听人数',
                    code: 'aaa95252',
                    required:false,
                },
                {
                    el:'date',
                    label: '日期',
                    code: 'aaa17510',
                },
                {
                    el:'radio',
                    label: '模式',
                    code: 'aaa9141201',
                    required: false,
                    default: '1',
                    list:arrangingList,
                    valueChange:(val)=>[
                        {
                            code:'chooseDate',
                            show:val==1
                        },
                        {
                            code:'cycle',
                            show:val!=1
                        },
                        {
                            code:'dateB',
                            show:val!=1
                        },
                        {
                            code:'timeB',
                            show:val!=1
                        },
                    ]
                },
                {
                    show:false,
                    el:'addItem',
                    label: '选择时间',
                    code: 'chooseDate',
                    required: false,
                    valueStyle:{
                        width:'510px'
                    },
                    itemList:[
                        {
                            labelShow:false,
                            label:'日期',
                            code:'aaaaa967',
                            size:'mini',
                            el:'date',
                            type:'date',
                            valueStyle:{
                                width:'150px'
                            },
                        },
                        {
                            labelShow:false,
                            label:'时间',
                            size:'mini',
                            el:'timePicker',
                            isRange:true,
                            code:'aaaaa279',
                            startPlaceholder:'开始时间',
                            endPlaceholder:'结束时间',
                            valueStyle:{
                                width:'200px'
                            },
                        },
                    ],
                    list:arrangingList
                },
                // 、、、
                {
                    el:'date',
                    code:'dateB',
                    label:'日期范围',
                    type:'daterange',
                    otherCodeArr:['start','end'],
                },
                {
                    label:'时间',
                    el:'timePicker',
                    isRange:true,
                    code:'timeB',
                    startPlaceholder:'开始时间',
                    endPlaceholder:'结束时间',
                },
                {
                    el:'select',
                    label: '设置周期',
                    code: 'cycle',
                    multiple:true,
                    list:weekList
                },
            ],
            // 手动隐藏
            hideList: [],
            // 手动显示
            showList: [],
            formState: [],
            id: "",

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
                        console.log(value)
                        let data = value;
                        // 编辑
                        if (state.id) {
                            // postFun({ ...data}).then(res => {
                            //   ElMessage.success("编辑成功，即将返回列表");
                            //   setTimeout(() => {
                            //     router.go(-1);
                            //   }, 500);
                            // });
                        } else {
                            // 新加
                            // postFun(data).then(res => {
                            //   ElMessage.success("新加成功，即将返回列表");
                            //   setTimeout(() => {
                            //     router.go(-1);
                            //   }, 500);
                            // });
                        }
                    }
                }
            ],
            // 初始化
            start: () => {
                if (useRoute().query && useRoute().query.id) {
                    state.id = useRoute().query.id;
                    // 查询详情
                    // postFun({id:state.id}).then(({data}) => {
                    //   state.formInitData=data
                    // });
                }
            }
        });
        state.start();
        return {
            formListRef,
            ...toRefs(state)
        };
    }
};
</script>

<style lang="scss" scoped></style>
