/*
 * @Author: jiu yin
 * @Date: 2021-09-02 09:26:12
 * @LastEditTime: 2021-12-28 15:55:04
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \school_admin\src\utils\config.js
 *  “jiu”
 */
// 在表格上方的表单配置
export const tabelFormConfig = {
    allRequired: false, // 是否全部必填
    pureList: ["", undefined, null], //净化列表
    pure: true, //纯净模式，会删除pureList数组中的
    inline: true, //行内
    default: {
        colon: "",
    },
    valueStyle: {
        width: "340px",
        marginBottom: "10px",
    },
};
export const tabelFormConfig2 = {
    allRequired: false, // 是否全部必填
    inline: true, //行内
    colon: ":",
    valueStyle: {
        width: "240px",
    },
};
export const tabelFormConfigMini = {
    inline: true, //行内
    colon: ":",
    default: {
        required: false,
        labelShow: false,
    },
    valueStyle: {
        width: "120px",
    },
};
//新加的表单配置
export const addFormConfig = {
    inline: false, //行内
    allRequired: true, // 是否全部必填
    colon: "：",
    inputStyle: {
        width: "360px",
    },
    buttons: [
        {
            funType: "cancel",
            name: "取消",
            size: "small",
        },
        {
            funType: "confirm",
            type: "primary",
            name: "确认",
            size: "small",
        },
    ],
};
//新加的表单配置
export const addFormBottom = {
    inline: false, //行内
    allRequired: true, // 是否全部必填
    colon: "：",
    valueStyle:{
        width:'600px'
    },
    button: {
        el: "div",
        style: {
            position: "absolute",
            bottom: "10px",
            marginBottom: "0px",
            left: "10px",
        },
    },
};
//新加的表单配置
export const addFormTabsBottom = {
    inline: false, //行内
    allRequired: true, // 是否全部必填
    colon: "：",
    inputStyle: {
        width: "360px",
    },
    button: {
        el: "div",
        style: {
            position: "absolute",
            bottom: "0px",
            marginBottom: "0px",
            left: "0px",
        },
    },
};
//新加的弹窗的表单配置
export const popConfig = {
    inline: false, //不是行内
    allRequired: true, // 是否全部必填
    colon: "：",
    inputStyle: {
        width: "300px",
    },
    buttons: [
        {
            funType: "cancel",
            type: null,
            name: "取消",
            size: "small",
        },
        {
            funType: "confirm",
            type: "primary",
            name: "保存",
            size: "small",
        },
    ],
};

// 快捷面板数据
export const shortcutsList = [
    {
        text: "过去一周",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
        },
    },
    {
        text: "未来一周",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            return [start, end];
        },
    },
    {
        text: "过去一个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
        },
    },
    {
        text: "未来一个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
            return [start, end];
        },
    },
    {
        text: "过去三个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
        },
    },
    {
        text: "未来三个月",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
            return [start, end];
        },
    },
    {
        text: "过去半年",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            return [start, end];
        },
    },
    {
        text: "未来半年",
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            return [start, end];
        },
    },
];
