//
import { checkType, checkTypeArr } from "@/components/FormList/config";

export const els = [
    {
        label: "input",
        value: "input",
    },
    {
        label: "textArea",
        value: "textArea",
    },
    {
        label: "Input Number 数字输入框",
        value: "inputNumber",
    },
    {
        label: "select 下拉选择",
        value: "select",
    },
    {
        label: "Cascader 级联选择器",
        value: "cascader",
    },
    {
        label: "radio",
        value: "radio",
    },
    {
        label: "checkBox",
        value: "checkBox",
    },
    {
        label: "date 日期",
        value: "date",
    },
    {
        label: "datePicker 日期选择器",
        value: "datePicker",
    },
    {
        label: "TimePicker 时间选择器",
        value: "timePicker",
    },
    {
        label: "TimeSelect 时间选择",
        value: "timeSelect",
    },
    {
        label: "img 图片上传",
        value: "img",
    },
    {
        label: "editer 富文本编辑器",
        value: "editer",
    },
    {
        label: "Rate 评分",
        value: "rate",
    },
    {
        label: "Slider 滑块",
        value: "slider",
    },
    {
        label: "Switch 开关",
        value: "switch",
    },
    {
        label: "ColorPicker 颜色选择器",
        value: "colorPicker",
    },
];
let checkTypeList = checkTypeArr.map((v) => ({
    value: v,
    label: checkType[v].name,
}));
let baseCofig = {
    required: false,
    size: "mini",
    labelShow: false,
};
let inputConfig = {
    ...baseCofig,
    valueStyle: {
        width: "100px",
    },
};
let textConfig = {
    el: "textArea",
    ...baseCofig,
    row: 3,
    valueStyle: {
        width: "200px",
    },
};
let selectConfig = {
    el: "select",
    ...baseCofig,
    valueStyle: {
        width: "100px",
    },
};
let switchConfig = {
    el: "switch",
    activeValue:true,
    inactiveValue:false,
    ...baseCofig,
    valueStyle: {
        width: "80px",
    },
};
let colorConfig = {
    el: "colorPicker",
    ...baseCofig,
    valueStyle: {
        width: "200px",
    },
};
//

export const elProps = {
    input: {
        list: [
            {
                ...selectConfig,
                code: "type",
                tips: "type属性",
                list: [
                    {
                        label: "number",
                        value: "number",
                    },
                    {
                        label: "textarea",
                        value: "textarea",
                    },
                    {
                        label: "text",
                        value: "text",
                    },
                ],
            },
            {
                ...selectConfig,
                label: "验证规则",
                code: "checkType",
                tips: "checkType 选择",
                list: checkTypeList,
            },
            {
                ...inputConfig,
                code: "maxlength",
                label: "最大输入长度",
                type: "number",
                tips: "最大输入长度",
            },
            {
                ...inputConfig,
                code: "minlength",
                type: "number",
                tips: "最小输入长度",
            },
            {
                ...inputConfig,
                code: "max",
                type: "number",
                tips: "最大值",
            },
            {
                ...inputConfig,
                code: "min",
                type: "number",
                tips: "最小值",
            },
            {
                ...inputConfig,
                code: "step",
                type: "number",
                tips: "数字间隔输入",
            },
            {
                ...switchConfig,
                code: "showWordLimit",
                tips: "开启字数统计",
            },
            {
                ...switchConfig,
                code: "showPassword",
                tips: "切换密码图标",
            },
        ],
    },
    textArea: {
        list: [
            {
                ...inputConfig,
                code: "maxlength",
                label: "最大输入长度",
                type: "number",
                tips: "最大输入长度",
            },
            {
                ...inputConfig,
                code: "minlength",
                type: "number",
                tips: "最小输入长度",
            },
            {
                ...inputConfig,
                code: "rows",
                type: "number",
                tips: "输入框行数",
            },
            {
                ...inputConfig,
                code: "minRows",
                type: "number",
                tips: "输入框最小行数",
            },
            {
                ...inputConfig,
                code: "maxRows",
                type: "number",
                tips: "输入框最大行数",
            },
            {
                ...switchConfig,
                code: "showWordLimit",
                tips: "开启字数统计",
            },
        ],
    },

    inputNumber: {
        list: [
            {
                ...switchConfig,
                code: "controls",
                tips: "显示控制按钮",
            },
            {
                ...selectConfig,
                code: "controlsPosition",
                tips: "控制按钮位置",
                list: [
                    {
                        label: "默认(两边)",
                        value: null,
                    },
                    {
                        label: "右边",
                        value: "right",
                    },
                ],
            },
            {
                ...inputConfig,
                code: "maxlength",
                label: "最大输入长度",
                type: "number",
                tips: "最大输入长度",
            },
            {
                ...inputConfig,
                code: "minlength",
                type: "number",
                tips: "最小输入长度",
            },
            {
                ...inputConfig,
                code: "max",
                type: "number",
                tips: "最大值",
            },
            {
                ...inputConfig,
                code: "min",
                type: "number",
                tips: "最小值",
            },
            {
                ...inputConfig,
                code: "step",
                type: "number",
                tips: "步长",
            },
            {
                ...inputConfig,
                code: "precision",
                type: "number",
                tips: "步长数值精度",
            },
            {
                ...switchConfig,
                code: "stepStrictly",
                tips: "是否只能是步长倍数",
            },
        ],
    },
    select: {
        list: [
            {
                ...switchConfig,
                code: "remote",
                tips: "是否远程搜索",
                default: false,
                valueChange: (val) => [
                    {
                        code: "remoteMethod",
                        show: val,
                    },
                ],
            },
            {
                ...textConfig,
                show: false,
                code: "remoteMethod",
                default: "(val)=>({aaa:val})",
                tips: "远程搜索函数",
            },
            {
                ...switchConfig,
                code: "filterable",
                tips: "是否可以筛选",
            },
            {
                ...switchConfig,
                code: "multiple",
                tips: "是否多选",
            },
            {
                ...inputConfig,
                code: "multipleLimit",
                type: "number",
                tips: "多选时用最多选中多少个",
            },
            {
                ...switchConfig,
                code: "reserveKeyword",
                tips: "保留当前的搜索关键词",
            },
        ],
    },
    cascader: {
        list: [
            {
                ...switchConfig,
                code: "filterable",
                tips: "是否可搜索选项",
                valueChange: (val) => [
                    {
                        code: "filterMethod",
                        show: val,
                    },
                ],
            },
            {
                show: false,
                ...textConfig,
                code: "filterMethod",
                default: "(node,val)=>val",
                tips: "远程搜索函数",
            },
            {
                ...switchConfig,
                code: "showAllLevels",
                tips: "否显示选中值的完整路径",
            },
            {
                ...switchConfig,
                code: "collapseTags",
                tips: "多选模式下是否折叠Tag",
            },
            {
                ...textConfig,
                code: "props",
                tips: "配置选项,在Cascader里找",
            },
            {
                ...inputConfig,
                code: "separator",
                tips: "选项分隔符",
            },
        ],
    },
    radio: {
        list: [
            {
                ...switchConfig,
                code: "isButton",
                default: false,
                tips: "是否是按钮模式",
            },
            {
                ...switchConfig,
                code: "border",
                default: false,
                tips: "是否有边框",
            },
            {
                ...colorConfig,
                el: "colorPicker",
                code: "textColor",
                default: "#fff",
                tips: "按钮形式的 Radio 激活时的文本颜色",
            },
            {
                ...colorConfig,
                el: "colorPicker",
                code: "fill",
                default: "#409EFF",
                tips: "按钮形式的 Radio 激活时的填充色和边框色",
            },
        ],
    },
    checkBox: {
        list: [
            {
                ...inputConfig,
                code: "min",
                type: "number",
                tips: "可勾选最小数量",
            },
            {
                ...inputConfig,
                code: "max",
                type: "number",
                tips: "可勾选最大数量",
            },
            {
                ...switchConfig,
                code: "isButton",
                default: false,
                tips: "是否是按钮模式",
            },
            {
                ...switchConfig,
                code: "border",
                default: false,
                tips: "是否有边框",
            },
            {
                ...colorConfig,
                el: "colorPicker",
                code: "textColor",
                default: "#fff",
                tips: "按钮形式的 Radio 激活时的文本颜色",
            },
            {
                ...colorConfig,
                el: "colorPicker",
                code: "fill",
                default: "#409EFF",
                tips: "按钮形式的 Radio 激活时的填充色和边框色",
            },
        ],
    },
    date: {
        list: [
            {
                ...switchConfig,
                code: "aaa2",
                default: false,
                tips: "限制时间",
                valueChange: (val) => [
                    {
                        code: "minDate",
                        show: val,
                    },
                    {
                        code: "maxDate",
                        show: val,
                    },
                ],
            },
            {
                show: false,
                ...textConfig,
                code: "minDate",
                default: "new Date().getTime()-n*24*60*60*60*1000",
                tips: "最小日期",
            },
            {
                show: false,
                ...textConfig,
                code: "maxDate",
                default: "new Date().getTime()+n*24*60*60*60*1000",
                tips: "最大日期",
            },
            {
                ...textConfig,
                code: "disabledDate",
                tips: "自定义限制日期",
            },
            {
                ...selectConfig,
                code: "type",
                tips: "type属性",
                valueChange:(val)=>[
                    {
                        code:'otherCodeArr',
                        show:val.includes('range')
                    }
                ],
                list: [
                    {
                        label: "年",
                        value: "year",
                    },
                    {
                        label: "月",
                        value: "month",
                    },
                    {
                        label: "日期",
                        value: "date",
                    },
                    {
                        label: "日期多选",
                        value: "dates",
                    },
                    {
                        label: "日期+时间",
                        value: "datetime",
                    },
                    {
                        label: "周",
                        value: "week",
                    },
                    {
                        label: "日期+时间 范围选择",
                        value: "datetimerange",
                    },
                    {
                        label: "日期 范围选择",
                        value: "daterange",
                    },
                    {
                        label: "月 范围选择",
                        value: "monthrange",
                    },
                ],
            },
            {
                show: false,
                ...textConfig,
                code: "otherCodeArr",
                default: "['aaa','bbb']",
                tips: "['start','end']",
            },
            {
                ...selectConfig,
                code: "format",
                tips: "format格式",
                filterable: true,
                allowCreate: true,
                valueStyle: {
                    width: "200px",
                },
                list: [
                    {
                        label: "YYYY",
                        value: "YYYY",
                    },
                    {
                        label: "YYYY-MM",
                        value: "YYYY-MM",
                    },
                    {
                        label: "YYYY-MM-DD",
                        value: "YYYY-MM-DD",
                    },
                    {
                        label: "YYYY-MM-DD HH:mm",
                        value: "YYYY-MM-DD HH:mm",
                    },
                    {
                        label: "YYYY-MM-DD HH:mm:ss",
                        value: "YYYY-MM-DD HH:mm:ss",
                    },
                    {
                        label: "YYYY/MM",
                        value: "YYYY/MM",
                    },
                    {
                        label: "YYYY/MM/DD",
                        value: "YYYY/MM/DD",
                    },
                    {
                        label: "YYYY/MM/DD HH:mm",
                        value: "YYYY/MM/DD HH:mm",
                    },
                    {
                        label: "YYYY/MM/DD HH:mm:ss",
                        value: "YYYY/MM/DD HH:mm:ss",
                    },
                ],
            },
            {
                ...switchConfig,
                code: "aaa",
                default: false,
                tips: "设置默认",
                valueChange: (val) => [
                    {
                        code: "defaultValue",
                        show: val,
                    },
                    {
                        code: "defaultTime",
                        show: val,
                    },
                ],
            },
            {
                show: false,
                ...textConfig,
                code: "defaultValue",
                default: "new Date()",
                tips: "默认显示时间",
            },
            {
                show: false,
                ...textConfig,
                    code: "defaultTime",
                default: "[new Date(),new Date().getTime()+n*24*60*60*60*1000]",
                tips: "范围选择时选中日期",
            },
            {
                ...switchConfig,
                code: "editable",
                default: true,
                tips: "文本框可输入",
            },
            {
                ...switchConfig,
                code: "unlinkPanels",
                default: false,
                tips: "取消两个日期的联动",
            },
            {
                ...inputConfig,
                code: "startPlaceholder",
                tips: "开始日期的占位内容",
            },
            {
                ...inputConfig,
                code: "endPlaceholder",
                tips: "结束日期的占位内容",
            },
        ],
    },
    datePicker: {
        list: [
            {
                ...textConfig,
                code: "disabledDate",
                tips: "自定义限制日期",
            },
            {
                ...selectConfig,
                code: "type",
                tips: "type属性",
                list: [
                    {
                        label: "年",
                        value: "year",
                    },
                    {
                        label: "月",
                        value: "month",
                    },
                    {
                        label: "日期",
                        value: "date",
                    },
                    {
                        label: "日期多选",
                        value: "dates",
                    },
                    {
                        label: "日期+时间",
                        value: "datetime",
                    },
                    {
                        label: "周",
                        value: "week",
                    },
                    {
                        label: "日期+时间 范围选择",
                        value: "datetimerange",
                    },
                    {
                        label: "日期 范围选择",
                        value: "daterange",
                    },
                    {
                        label: "月 范围选择",
                        value: "monthrange",
                    },
                ],
            },
            {
                ...selectConfig,
                code: "format",
                tips: "format格式",
                filterable: true,
                allowCreate: true,
                valueStyle: {
                    width: "200px",
                },
                list: [
                    {
                        label: "YYYY",
                        value: "YYYY",
                    },
                    {
                        label: "YYYY-MM",
                        value: "YYYY-MM",
                    },
                    {
                        label: "YYYY-MM-DD",
                        value: "YYYY-MM-DD",
                    },
                    {
                        label: "YYYY-MM-DD HH:mm",
                        value: "YYYY-MM-DD HH:mm",
                    },
                    {
                        label: "YYYY-MM-DD HH:mm:ss",
                        value: "YYYY-MM-DD HH:mm:ss",
                    },
                    {
                        label: "YYYY/MM",
                        value: "YYYY/MM",
                    },
                    {
                        label: "YYYY/MM/DD",
                        value: "YYYY/MM/DD",
                    },
                    {
                        label: "YYYY/MM/DD HH:mm",
                        value: "YYYY/MM/DD HH:mm",
                    },
                    {
                        label: "YYYY/MM/DD HH:mm:ss",
                        value: "YYYY/MM/DD HH:mm:ss",
                    },
                ],
            },
            {
                ...switchConfig,
                code: "aaa",
                default: false,
                tips: "设置默认",
                valueChange: (val) => [
                    {
                        code: "defaultValue",
                        show: val,
                    },
                    {
                        code: "defaultTime",
                        show: val,
                    },
                ],
            },
            {
                show: false,
                ...textConfig,
                code: "defaultValue",
                default: "new Date()",
                tips: "默认显示时间",
            },
            {
                show: false,
                ...textConfig,
                code: "defaultTime",
                default: "[new Date(),new Date().getTime()+n*24*60*60*60*1000]",
                tips: "范围选择时选中日期",
            },
            {
                ...switchConfig,
                code: "editable",
                default: true,
                tips: "文本框可输入",
            },
            {
                ...switchConfig,
                code: "unlinkPanels",
                default: false,
                tips: "取消两个日期的联动",
            },
            {
                ...inputConfig,
                code: "startPlaceholder",
                tips: "开始日期的占位内容",
            },
            {
                ...inputConfig,
                code: "endPlaceholder",
                tips: "结束日期的占位内容",
            },
        ],
    },
    timePicker: {
        list: [
            {
                ...switchConfig,
                code: "isRange",
                default: false,
                tips: "是否为时间范围选择",
            },
            {
                ...switchConfig,
                code: "arrowControl",
                default: false,
                tips: "是否使用箭头选择",
            },
            {
                ...inputConfig,
                code: "rangeSeparator",
                default: '-',
                tips: "选择范围时的分隔符",
            },
            {
                ...textConfig,
                code: "defaultValue",
                default: "new Date()",
                tips: "默认显示时间",
            },
            {
                ...textConfig,
                code: "disabledHours",
                default: "new Date()",
                tips: "禁止选择部分-小时",
            },
            {
                ...textConfig,
                code: "disabledMinutes",
                default: "new Date()",
                tips: "禁止选择部分-分钟",
            },
            {
                ...textConfig,
                code: "disabledSeconds",
                default: "new Date()",
                tips: "禁止选择部分-秒",
            },
            {
                ...selectConfig,
                code: "align",
                tips: "对齐方式",
                list:[
                    {
                        label:'left',
                        value:'left',
                    },
                    {
                        label:'center',
                        value:'center',
                    },
                    {
                        label:'right',
                        value:'right',
                    },
                ]
            },
            {
                ...inputConfig,
                code: "startPlaceholder",
                tips: "开始日期的占位内容",
            },
            {
                ...inputConfig,
                code: "endPlaceholder",
                tips: "结束日期的占位内容",
            },
        ],
    },
    timeSelect: {
        list: [
            {
                ...switchConfig,
                code: "editable",
                default: true,
                tips: "文本框可输入",
            },
            {
                ...inputConfig,
                code: "step",
                default: '00:30',
                tips: "间隔时间",
            },
            {
                ...inputConfig,
                code: "start",
                default: '09:00',
                tips: "开始时间",
            },
            {
                ...inputConfig,
                code: "end",
                default: '18:00',
                tips: "结束时间",
            },
            {
                ...inputConfig,
                code: "minTime",
                default: '00:00',
                tips: "最小时间",
            },
            {
                ...inputConfig,
                code: "maxTime",
                tips: "最大时间",
            },

        ],
    },
    img: {
        list: [
            {
                ...textConfig,
                code: "defaultUrl",
                default: "",
                tips: "默认图片",
            },
            {
                ...inputConfig,
                code: "ratio",
                tips: "尺寸n/n2",
            },
            {
                ...inputConfig,
                el:'inputNumber',
                code: "limit",
                default: "1024",
                type:'number',
                checkType:'number',
                tips: "最多传几张",
            },
            {
                ...inputConfig,
                code: "size",
                default: "1024",
                tips: "每张图片最大尺寸",
            },
            {
                ...inputConfig,
                code: "ImgType",
                default: "[\"png\", \"jpg\", \"jpeg\"]",
                tips: "限制图片格式",
                valueStyle: {
                    width: "150px",
                },
            },
            {
                ...switchConfig,
                code: "isGif",
                default: false,
                tips: "是不是gif",
            },
        ],
    },
    editer: {
        list: [
            {
                ...inputConfig,
                code: 'height',
                type: "number",
                default: 600,
                tips: "富文本高度",
            },
        ],
    },
    rate: {
        list: [
            {
                ...textConfig,
                code: 'scoreTemplate',
                default: '',
                tips: '分数显示模板 例如：{value}分',
            },
            {
                ...switchConfig,
                code: "allowHalf",
                default: false,
                tips: "是否允许半选",
            },
            {
                ...inputConfig,
                el:'rate',
                code: 'lowThreshold',
                type: "number",
                default: 2,
                tips: "低分和中等分数的界限值",
                valueStyle: {
                    width: "160px",
                },
            },
            {
                ...inputConfig,
                el:'rate',
                code: 'highThreshold',
                type: "number",
                default: 4,
                tips: "高分和中等分数的界限值",
                valueStyle: {
                    width: "160px",
                },
            },
            {
                ...textConfig,
                code: 'colors',
                default: '[\'#F7BA2A\', \'#F7BA2A\', \'#F7BA2A\']',
                tips: "icon 的颜色",
            },

            {
                ...textConfig,
                code: 'icons',
                default: '',
                tips: "图标组件:共有3个元素",
            },
            {
                ...colorConfig,
                code: 'voidColor',
                type: "number",
                default: '#C6D1DE',
                tips: "未选中 icon 的颜色",
            },
            {
                ...colorConfig,
                code: 'disabledVoidColor',
                type: "number",
                default: '#EFF2F7',
                tips: "只读时未选中的颜色",
            },
            {
                ...switchConfig,
                code: "showText",
                default: false,
                tips: "显示辅助文字",
                valueChange:(val)=>[
                    {
                        code:'texts',
                        show:val
                    },
                    {
                        code:'textColor',
                        show:val
                    }
                ]
            },
            {
                show:false,
                ...textConfig,
                code: 'texts',
                default: '',
                tips: "辅助文字数组:共有5个元素",
            },
            {
                show:false,
                ...colorConfig,
                code: 'textColor',
                default: '#1F2D3D',
                tips: "辅助文字数组:共有5个元素",
            },
            {
                ...switchConfig,
                code: "showScore",
                default: false,
                tips: "是否显示当前分数,和辅助文字不能共存",
                valueChange:(val)=>[
                    {
                        code:'showText',
                        show:!val
                    }
                ]
            },

        ],
    },
    slider: {
        list: [

            {
                ...switchConfig,
                code: "showStops",
                default: false,
                tips: "是否显示间断点",
            },
            {
                ...switchConfig,
                code: "showTooltip",
                default: true,
                tips: "是否显示头顶那个",
            },

            {
                ...switchConfig,
                code: "range",
                default: false,
                tips: "是否为范围选择",
            },
            {
                ...inputConfig,
                code: "min",
                type: "number",
                tips: "最小值",
            },
            {
                ...inputConfig,
                code: "max",
                type: "number",
                tips: "最大值",
            },
            {
                ...inputConfig,
                code: "step",
                type: "number",
                tips: "步长",
            },
            {
                ...switchConfig,
                code: "showInput",
                tips: "是否显示输入框，仅在非范围选择时有效",
                valueChange:(val)=>[
                    {
                        code:'showInputControls',
                        show:val,
                    },
                    {
                        code:'debounce',
                        show:val,
                    },
                    {
                        code:'inputSize',
                        show:val,
                    },
                ]
            },
            {
                show:false,
                ...switchConfig,
                code: "showInputControls",
                default: true,
                tips: "在显示输入框的情况下，是否显示输入框的控制按钮",
            },
            {
                show:false,
                ...inputConfig,
                type:'number',
                code: "debounce",
                default: 300,
                tips: "输入时的防抖延迟",
            },
            {
                show: false,
                ...selectConfig,
                code: "inputSize",
                tips: "输入框的尺寸",
                default: 'small',
                list:[
                    {
                        value:'large',
                        label:'large',
                    },
                    {
                        value:'medium',
                        label:'medium',
                    },
                    {
                        value:'small',
                        label:'small',
                    },
                    {
                        value:'mini',
                        label:'mini',
                    },
                ]
            },
            {
                ...switchConfig,
                code: "vertical",
                tips: "是否竖向模式",
                default: false,
                valueChange:(val)=>[
                    {
                        code:'height',
                        show:val,
                    },
                ]
            },
            {
                show:false,
                ...inputConfig,
                code: "height",
                tips: "Slider 高度",
                required:true,
            },

        ],
    },
    switch: {
        list: [
            {
                ...switchConfig,
                code: "loading",
                default: true,
                tips: "是否显示加载中",
            },
            {
                ...inputConfig,
                code: "width",
                default: '40px',
                tips: "switch 的宽度",
            },
            {
                ...switchConfig,
                code: "inlinePrompt",
                default: false,
                tips: "图标或文本是否显示在点内",
            },
            {
                ...inputConfig,
                code: "activeIcon",
                tips: "选中图标",
            },
            {
                ...inputConfig,
                code: "inactiveIcon",
                tips: "未选中图标",
            },
            {
                ...inputConfig,
                code: "activeText",
                tips: "选中文字",
            },
            {
                ...inputConfig,
                code: "inactiveText",
                tips: "未选中文字",
            },
            {
                ...colorConfig,
                code: "activeColor",
                tips: "选中颜色",
                default: '#409EFF'
            },
            {
                ...colorConfig,
                code: "inactiveColor",
                tips: "未选中颜色",
                default: '#C0CCDA'
            },
            {
                ...colorConfig,
                code: "borderColor",
                tips: "边框颜色",
            },
        ],
    },
    colorPicker: {
        list: [
            {
                ...switchConfig,
                code: "showAlpha",
                default: false,
                tips: "是否支持透明度选择",
            },
            {
                ...selectConfig,
                code: "colorFormat",
                tips: "颜色的格式",
                list:[
                    {
                        label:'hsl',
                        value:'hsl',
                    },
                    {
                        label:'hsv',
                        value:'hsv',
                    },
                    {
                        label:'hex',
                        value:'hex',
                    },
                    {
                        label:'rgb',
                        value:'rgb',
                    },
                ]
            },
            {
                ...textConfig,
                code: "predefine",
                tips: "预定义颜色(颜色的数组)",
            },


        ],
    },
    aaa: {
        list: [],
    },
};

//
export const sizeList = [
    {
        label: "small",
        value: "small",
    },
    {
        label: "medium",
        value: "medium",
    },
    {
        label: "mini",
        value: "mini",
    },
];
