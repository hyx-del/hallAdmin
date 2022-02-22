<template>
    <div class="generate">
        <div class="generate_left">
            <emptyBox bottom="70">
                <formList
                    :formInitData="formInitData"
                    :itemList="itemList"
                    :buttons="buttons"
                    :config="config"
                >
                </formList>
            </emptyBox>
        </div>
        <div class="generate_mid">
            <emptyBox bottom="70">
                <formList
                    :formInitData="formInitData2"
                    :itemList="itemList2"
                    :buttons="buttons2"
                    :config="config2"
                    :formState="formState2"
                >
                </formList>
            </emptyBox>
        </div>

        <div class="generate_right">
            <el-input
                class="showData"
                v-model="showData"
                :rows="30"
                type="textarea"
                placeholder="数据"
            />
        </div>
        <popupForm
            v-model:show="popShow"
            :formInitData="popData"
            :itemList="itemList"
            :buttons="popButtons"
        />
    </div>

</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import popupForm from "@/components/FormList/popupForm";
import addFormList from "@/components/FormList/addFormList";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { addFormBottom, shortcutsList } from "@/utils/config";
import { elProps, els, sizeList } from "./index";

export default {
    components: {
        formList,
        addFormList,
        emptyBox,
        popupForm
    },
    porps: [],
    setup() {
        const formListRef = ref(null);
        const state = reactive({
            showData:computed(()=>{
                let back=''
                if (state.itemList2.length>0) {
                    let noY=['false','true','testList']
                    let noKey=['adds','inSlot']
                    // back =JSON.stringify(state.itemList2)
                    state.itemList2.map(item=>{
                        back+=`{`
                        for (let key in item) {
                            if (!noKey.includes(key)) {
                                let str=noY.includes(item[key]+'')?item[key]:`'${item[key]}'`
                                        back+= `
    ${key}:${str},`
                            }
                        }
                        back+=`
},
`
                    })
                }
                return back
            }),
            deatalItem:(value)=>{
                console.log('value',1212)
                let propsValue={}
                let outValue={}
                let endValue={}
                let propsObj=value.adds[0]
                let itemList=elProps[value.el].list
                itemList.map(v=>{
                    if (propsObj[v.code]=='true') {
                        propsObj[v.code]=true
                    }
                    if (propsObj[v.code]=='false') {
                        propsObj[v.code]=false
                    }
                    if (propsObj[v.code]&&propsObj[v.code]!=v.default) {
                        propsValue[v.code]=propsObj[v.code]
                    }
                })
                state.itemList.map(v=>{
                    let {code}=v
                    if (v.el!='addItem') {
                        if (value[code]=='true') {
                            value[code]=true
                        }
                        if (value[code]=='false') {
                            value[code]=false
                        }
                        if (value[code]==undefined) {
                            value[code]=v.default
                        }
                        if (value[code]!=v.default) {
                            outValue[code]=value[code]
                        }
                    }
                })
                endValue={...outValue,...propsValue}
                endValue.inSlot=state.pushArr
                if (!endValue.code) {
                    endValue.code=`aaaaa${parseInt(Math.random()*1000)}`
                }
                if (!endValue.label) {
                    endValue.label=`label${parseInt(Math.random()*1000)}`
                }
                return endValue
            },
            pushArr:[
                {
                    el: "button", // 指定使用el的组件，div，span都可以
                    text: "修改",
                    size: "mini",
                    class: "slotRight",
                    type: "primary",
                    click:(val,obj,item,index)=>{
                        console.log(123)
                        console.log('------',item)
                        state.popData={...item}
                        state.changeIndex=index
                        state.popShow=true
                    }
                },
                {
                    el: "button", // 指定使用el的组件，div，span都可以
                    text: "删除",
                    size: "mini",
                    type: "danger",
                    class: "slotRight",
                    style:{
                        marginLeft: '72px'
                    },
                    click:(val,obj,item,index)=>{
                        console.log(val,obj,item,index)
                        state.itemList2.splice(index,1)
                        state.itemList2=state.itemList2.length==0?[]:[...state.itemList2]
                        console.log('state.itemList2',state.itemList2.length,state.itemList2)
                    }
                },
            ],
            changeIndex:0,
            popShow:false,
            popData: {},
            popButtons:[
                {
                    name: "取消",
                    click: ({ value }) => {
                       state.popShow=false
                    }
                },
                {
                    funType: "confirm",
                    name: "确定",
                    type: "primary",
                    click: ({ value }) => {
                        state.popShow=false
                        console.log(value)
                        value.inSlot=state.pushArr
                        let  endValue =state.deatalItem(value)
                        console.log('endValue',endValue)
                        let inputArr=['input','textArea'],pla;
                        pla=inputArr.includes(endValue.el||'input')?'请输入':'请选择'
                        pla+=endValue.label
                        console.log('++++++++++',pla,endValue.placeholder)
                        if (pla==endValue.placeholder || endValue.placeholder=='') {
                            delete endValue.placeholder
                        }
                        console.log('endValue',endValue)
                        state.itemList2.splice(state.changeIndex,1,endValue)
                        state.itemList2=[...state.itemList2]
                    }
                }
            ],
            showIndex:-1,
            formInitData2:{},
            formState2:[],
            config2:{
                inline: false, //行内
                allRequired: true, // 是否全部必填
                colon: "：",
                inputStyle: {
                    width: "100px"
                },
                buttonStyle: {
                    position: "absolute",
                    bottom: "10px",
                    marginBottom: "0",
                    right: "300px"
                }
            },
            buttons2:[
                {
                    funType: "confirm",
                    name: "确定",
                    type: "primary",
                    click: ({ value }) => {

                    }
                }
            ],
            itemList2:[],
            formInitData: {
                // el: "colorPicker",
                adds: [{}],
            },
            config: {
                ...addFormBottom,
            },
            buttons: [
                {
                    name: "取消",
                    click: ({ value }) => {
                        let propsValue=value.adds[0]
                        console.log(value,propsValue);
                    },
                },
                {
                    funType: "confirm",
                    name: "确定",
                    type: "primary",
                    click: ({ value }) => {
                        console.log(value)
                       let  endValue =state.deatalItem(value)
                        state.itemList2=[...state.itemList2,endValue]
                        console.log( state.itemList2)
                    },
                },
            ],
            itemList: [
                {
                    el: "select",
                    label: "el",
                    code: "el",
                    default: "input",
                    valueChange: (val) => {
                        console.log((elProps[val] && elProps[val].list) || []);
                        return [
                            {
                                code: "adds",
                                itemList:
                                    (elProps[val] && elProps[val].list) || [],
                            },
                        ];
                    },
                    list: els,
                },

                {
                    el: "addItem",
                    label: "属性配置",
                    code: "adds",
                    rightButtonShow: false, //加减按钮显示
                    valueStyle: {
                        width: "100%",
                    },
                    config: {
                        default: {
                            required: false,
                        },
                    },
                    itemList: [],
                },
                {
                    el: "itemSlot",
                    code: "commonRule",
                    inItemSlot: {
                        el: "div",
                        text: "通用配置",
                        style: {
                            fontSize: "16px",
                            marginBottom: "20px",
                            textIndent: "1em",
                            paddingBottom: "10px",
                            borderBottom: "1px solid #f00",
                        },
                    },
                },
                {
                    label: "code",
                    code: "code",
                    required: false,
                    checkType:'letterNum'
                },
                {
                    label: "label",
                    code: "label",
                    required: false,
                },
                {
                    el: "switch",
                    label: "label显示",
                    code: "labelShow",
                    default: true,
                },
                {
                    el: "switch",
                    label: "是否必填",
                    code: "required",
                    default: true,
                },
                {
                    el: "switch",
                    label: "是否禁用",
                    code: "disabled",
                    default: false,
                },
                {
                    label: "placeholder",
                    code: "placeholder",
                    tips: "placeholder提示",
                    required: false,
                },
                {
                    label: "tips",
                    code: "tips",
                    tips: "底部提示",
                    required: false,
                },
                {
                    el: "select",
                    label: "size",
                    code: "size",
                    tips: "尺寸",
                    default: "small",
                    required: false,
                    list: sizeList,
                },
                {
                    el: "switch",
                    label: "前缀选择",
                    code: "preCheck",
                    default: false,
                    tips: "前面的勾选，默认没有",
                    required: false,
                },
                {
                    el: "switch",
                    label: "清空内容",
                    code: "clearable",
                    default: true,
                    tips: "clearable 是否可以清空",
                    required: false,
                },
            ],
        });
        return {
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped>
.generate{
    display: flex;
}
.generate_left{
    width: 100%;
}
.generate_mid{
    flex-shrink: 0;
    width: 500px;
}
.generate_right{
    flex-shrink: 0;
    width: 200px;
    height: 100vh;
}
.showData{
    height: 100% !important;
}
.showData textarea{
    height: 100% !important;
}
</style>
