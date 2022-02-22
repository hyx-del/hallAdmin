<template>
    <emptyBox bottom="70">
        <formList
            ref="formListRef"
            :formInitData="privateData"
            :itemList="privateList"
            :buttons="privateButtons"
            :config="config"
        >
        </formList>
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
            config: { ...addFormBottom },
            privateData: {},
            privateList:[
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
                    el:'select',
                    label: '助教',
                    code: 'aaa462502',
                    list:testList,
                    required: false
                },
                {
                    el:'select',
                    label: '会员',
                    code: 'aaa462df502',
                    list:testList,
                },
                {
                    el:'select',
                    label: '选卡',
                    code: 'aaa462df52502',
                    list:testList,
                },
                {
                    label: '扣费',
                    code: 'aaa2346502',
                    type:'number',
                    checkType:'numberPoint2',
                    suffix:'元'
                },
                {
                    el:'textArea',
                    label: '备注',
                    code: 'aaa426502',
                    required: false
                },
                {
                    el:'date',
                    label: '日期',
                    code: 'aaa17510',
                    type:'date'
                },
                {
                    label:'时间',
                    el:'timePicker',
                    isRange:true,
                    code:'timeB',
                    startPlaceholder:'开始时间',
                    endPlaceholder:'结束时间',
                },
            ],
            privateButtons:[
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
            // 手动隐藏
            hideList: [],
            // 手动显示
            showList: [],
            formState: [],
            id: "",
            // 按钮
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
