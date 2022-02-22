<template>
    <emptyBox bottom="70">
        <el-button @click="addItemList" type="primary">buttonCont</el-button>
        <formList
            ref="formListRef"
            :formInitData="formInitData"
            :itemList="itemList"
            :buttons="buttons"
            :config="config"
            :formState="formState"
            @formChange="formChange"
        >
        </formList>
        <addFormList :itemList="itemList2" :formInitData="formInitData2">
        </addFormList>
    </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import addFormList from "@/components/FormList/addFormList";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom, shortcutsList } from "@/utils/config";
import { staffGetStaffInfoByMobile } from "@/api/managerStaff";
import { testList } from "@/utils/enum/select";
import { editPayTypeAPI, getPayTypeListAPI } from "@/api/baseSet";
import { nearDay } from "@/utils/formaData";
import { coursePage } from "@/api/course";
import { getMenuInfo } from "@/api/user";
import { coachBoxlist } from "@/api/coach";

export default {
    components: {
        formList,
        addFormList,
        emptyBox,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);

        // 从后台拿到值改变表单，
        let getInfo = async (val, obj) => {
            console.log(val);
            if (val) {
                let res = await staffGetStaffInfoByMobile({ mobile: val });
                let list = [];
                console.log("res", res);
                if (res.data) {
                    // 后台返回数字变成字符串
                    ["functions", "gender", "type"].forEach((key) => {
                        res.data[key] = res.data[key] + "";
                    });

                    // 批量改变元素的禁用
                    list = ["code"].map((item) => ({
                        disabled: true,
                        code: item.code,
                        required: false,
                    }));
                    res.data.addItem = [{}];
                }
                let back = {
                    formObj: res.data || { mobile: val }, //改变表单的值
                    // 没有值就清空表单，mobile是需要保留的值
                    reset: res.data ? false : { mobile: val, addItem: [] },
                    // list对表单内某些元素禁用或者显示隐藏
                    list,
                };
                return back;
            }
        };
        const state = reactive({
            addItemList: () => {
                state.formState = [
                    {
                        code: "sda",
                        show: true,
                    },
                ];
            },
            value4: "",
            formInitData: {
                datePick5: "",
                adds: [
                    {
                        ph: "12",
                        name: "12",
                    },
                    {
                        ph: "1752312",
                        name: "5641233136",
                    },
                ],
            },
            itemList2: [
                {
                    label: "姓名",
                    code: "name",
                },
            ],
            formInitData2: [{}],
            config: {
                ...addFormBottom,
                countList: [
                    "add+add2+add3*add4=end",
                    "add5+add6+add7*add8=end2",
                ],
            },
            buttons: [
                {
                    name: "取消",
                    click: ({ value }) => {
                        console.log(value);
                    },
                },
                {
                    funType: "confirm",
                    name: "确定",
                    type: "primary",
                    click: ({ value }) => {
                        console.log(value);
                    },
                },
            ],
            itemList: [
                {
                    el: "itemSlot",
                    code: "itemSlot",
                    inItemSlot: {
                        el: "button", // 指定使用el的组件，div，span都可以
                        text: "21345",
                        size: "small",
                        type: "danger",
                        icon: "Delete",
                        class: "iconfont icon-31sousuo",
                        click: (val, obj) => [
                            {
                                code: "mobile",
                                show: false,
                            },
                        ],
                    },
                    // 点击后的值，返回一个数组可以改变表单的排布
                },
                // value那部分slot
                {
                    show: false,
                    el: "slot",
                    label: "整体slot",
                    code: "sda",
                    inSlot: {
                        el: "button", // 指定使用el的组件，div，span都可以
                        text: "隐藏手机号",
                        size: "small",
                        type: "danger",
                        icon: "Delete",
                        round: true,
                        click: (val, obj) => [
                            {
                                code: "mobile",
                                show: false,
                            },
                        ],
                    },
                    // 点击后的值，返回一个数组可以改变表单的排布
                },
                {
                    el: "select",
                    label: "刷新",
                    code: "refresh",
                    multiple: true,
                    refresh: "icon-update",
                    fun: coachBoxlist,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            value: v.id + "",
                            label: v.name,
                        })),
                },
                // 挂在后面的slot
                {
                    label: "dfsf",
                    code: "sdfsdf",
                    inSlot: {
                        el: "button",
                        text: "显示手机号",
                        size: "small",
                        type: "primary",
                        class: "iconfont icon-update slotRight",
                        // 可以添加样式和class名
                        style: {
                            color: "#f00",
                        },
                        click: (val, obj) => [
                            {
                                code: "mobile",
                                show: true,
                            },
                        ],
                    },
                },
                {
                    label: "手机号",
                    code: "mobile",
                    maxlength: 11,
                    type: "number",
                    checkType: "phone",
                    append: "查找",
                    appendClick: getInfo,
                    // disabled: true,
                },
                {
                    label: "姓名",
                    code: "name",
                    disabled: true,
                },
                {
                    el: "addItem",
                    label: "addItem",
                    code: "adds",
                    // inline: true,
                    listCheck: true, // 显示选中列
                    disabled: true,
                    // rightButtonShow:false,//加减按钮显示
                    countList: ["pc+zc=all"],
                    valueStyle: {
                        width: "1200px",
                    },
                    itemList: [
                        {
                            el: "select",
                            labelShow: false,
                            label: "姓名",
                            code: "ph",
                            colon: "",
                            valueStyle: {
                                width: "100px",
                            },
                            // disabled: false,
                            valueChange: (val) => [
                                {
                                    code: "drink",
                                    show: val == 1,
                                },
                            ],
                            list: [
                                {
                                    value: 1,
                                    label: "显示饮料",
                                },
                            ],
                        },
                        {
                            labelShow: false,
                            show: false,
                            label: "饮料",
                            code: "drink",
                            colon: "",
                            valueStyle: {
                                width: "150px",
                            },
                        },

                        {
                            labelShow: false,
                            label: "配菜",
                            code: "pc",
                            colon: "",
                            valueStyle: {
                                width: "150px",
                            },
                        },
                        {
                            labelShow: false,
                            label: "主菜",
                            code: "zc",
                            colon: "",
                            valueStyle: {
                                width: "150px",
                            },
                        },
                        {
                            label: "共计",
                            code: "all",
                            colon: "",
                            // tips:'配菜+主菜',
                            valueStyle: {
                                width: "150px",
                            },
                        },

                        {
                            el: "select",
                            label: "状态",
                            code: "name",
                            style: {
                                width: "100px",
                            },
                            list: [
                                {
                                    value: "12",
                                    label: "d范德萨范德萨",
                                },
                                {
                                    value: 1,
                                    label: "dsadaserqwf",
                                },
                            ],
                        },
                    ],
                },
                {
                    preCheck: true,
                    label: "加",
                    code: "add",
                    type: "number",
                    tips: "+",
                },
                {
                    preCheck: true,
                    label: "加",
                    code: "add2",
                    type: "number",
                    tips: "+",
                },
                {
                    preCheck: true,
                    label: "乘",
                    code: "add3",
                    type: "number",
                    tips: "*",
                },
                {
                    preCheck: true,
                    label: "乘",
                    code: "add4",
                    type: "number",
                    tips: "=",
                },
                {
                    label: "结果",
                    code: "end",
                    type: "number",
                },
                {
                    label: "加",
                    code: "add5",
                    type: "number",
                    tips: "+",
                },
                {
                    preCheck: true,
                    label: "加",
                    code: "add6",
                    type: "number",
                    tips: "+",
                },
                {
                    label: "乘",
                    code: "add7",
                    type: "number",
                    tips: "*",
                },
                {
                    label: "乘",
                    code: "add8",
                    type: "number",
                    tips: "=",
                },
                {
                    label: "结果",
                    code: "end2",
                    type: "number",
                },
                {
                    label: "后缀名",
                    code: "hou",
                    suffix: "元", // 传入字符串时默认是span 没有内联样式和class，点击事件单独写也可以传入对象
                    suffixClick: (val) => {
                        console.log(val);
                    },
                    // suffix: {
                    //     text:'元',
                    //     click: (val) => {
                    //         console.log(val);
                    //     },
                    // },
                    prefix: {
                        text: "",
                        class: "iconfont icon-jiahao",
                        click: (val) => {
                            console.log(val);
                        },
                    },
                    tips: "前后缀都可以有点击事件",
                },
                {
                    label: "icon",
                    code: "icon",
                    prepend: "https//",
                    append: {
                        text: "搜索", // 也可以unicode
                        class: "iconfont icon-31sousuo",
                    },
                    tips: "在iconfont 里找icon的class名称，text必填",
                },
                {
                    el: "inputNumber",
                    label: "number",
                    code: "inputNumber",
                    default: 1,
                    tips: "在iconfont 里找icon的class名称，text必填",
                },

                {
                    el: "checkbox",
                    label: "checkBox",
                    code: "checkBox",
                    default: ["1"],
                    list: [
                        {
                            label: "显示1",
                            value: "1",
                        },
                        {
                            label: "显示2",
                            value: "2",
                        },
                    ],
                },
                {
                    el: "radio",
                    label: "radio",
                    code: "radio",
                    default: "2",
                    valueChange: (val) => [
                        {
                            code: "show1",
                            show: val == 1,
                        },
                        {
                            code: "show2",
                            show: val == 2,
                        },
                    ],
                    list: [
                        {
                            label: "显示1",
                            value: "1",
                        },
                        {
                            label: "显示2",
                            value: "2",
                        },
                    ],
                },
                {
                    code: "show1",
                    label: "显示1",
                },
                {
                    code: "show2",
                    label: "显示2",
                },
                {
                    el: "select",
                    code: "select",
                    label: "下拉",
                    list: testList,
                },
                {
                    el: "select",
                    code: "select2",
                    label: "多选",
                    multiple: true,
                    multipleLimit: 2,
                    list: testList,
                    tips: "多选，限制最多选中2个",
                },
                {
                    el: "select",
                    code: "filterable",
                    label: "筛选",
                    filterable: true,
                    list: testList,
                    tips: "筛选,从结果筛选",
                },
                {
                    el: "select",
                    code: "remote",
                    label: "后端获取",
                    filterable: true,
                    refresh: "icon-update",
                    remote: true,
                    remoteMethod: (val) => ({ name: val }), //拿到输入结果，组装数据
                    query: { type: "pay_type", useFlag: 1 },
                    fun: getPayTypeListAPI,
                    tips: "筛选,从后端获取结果",
                },
                {
                    el: "timePicker",
                    code: "timePicker",
                    label: "timePicker",
                },
                {
                    el: "timeSelect",
                    code: "timeSelect",
                    label: "timeSelect",
                    start: "9:00",
                    end: "23:00",
                    step: "00:05",
                },
                {
                    el: "datePicker",
                    code: "datePicker2",
                    label: "日期",
                },
                {
                    el: "date",
                    code: "datePicker",
                    label: "日期时间",
                },
                {
                    el: "date",
                    code: "datePicker3",
                    label: "限制选中",
                    maxDate: nearDay(2),
                    minDate: nearDay(-3),
                },
                {
                    el: "date",
                    code: "datePicker4",
                    type: "daterange",
                    unlinkPanels: true,
                    label: "日期区域",
                },
                {
                    el: "date",
                    code: "datePick5",
                    type: "datetimerange",
                    label: "时间区域",
                },
                {
                    el: "date",
                    code: "datePick12",
                    type: "datetimerange",
                    label: "快捷面板",
                    shortcuts: shortcutsList,
                },
                {
                    el: "slider",
                    code: "slider",
                    label: "滑块",
                    default: 10,
                },
                {
                    el: "rate",
                    code: "rate",
                    label: "评分",
                    default: 2,
                },
                {
                    el: "switch",
                    code: "switch",
                    label: "开关",
                    activeText: "关",
                    inactiveText: "开",
                    "inline-prompt": true,
                    // inline-prompt active-text="是" inactive-text="否"
                    default: true,
                },
            ],
            // 手动隐藏
            hideList: [],
            // 手动显示
            formState: [],
            // formState: [],
            id: "",
            // 表单变化
            formChange: (val) => {
                console.log("formChange", val);
                let { code, value } = val;
                state.formInitData[code] = value;
            },
            // 初始化
            start: () => {
                if (useRoute().query && useRoute().query.id) {
                    state.id = useRoute().query.id;
                    // 查询详情
                    // postFun({id:state.id}).then(({data}) => {
                    //   state.formInitData=data
                    // });
                }
            },
        });
        state.start();
        return {
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
