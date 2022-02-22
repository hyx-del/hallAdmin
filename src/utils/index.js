/*
 * @Author: aa
 * @Date: 2021-08-20 09:41:42
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-12-29 14:57:48
 * @Descripttion:
 */

import { isRef, isReactive } from "vue";

// d
export const log = (obj) => {
    if (isReactive(obj)) {
        console.log(JSON.parse(JSON.stringify(obj)));
    } else if (isRef(obj)) {
        console.log(obj.value);
    } else {
        console.log(obj);
    }
};
// 检测数组子集
export const array = (arr1, arr2) => {
    if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
        return false;
    }
    let flag = false;
    let result = arr1.map((item) => {
        return arr2.includes(item);
    });
    flag = result.some((item) => item);
    return flag;
};

//表格val=[0,1] 红绿色显示正反
export const isShow = (val, arr = ["是", "否"], color = true) => {
    if (val) return `<span class="${color ? "green" : ""}">${arr[0]}</span>`;
    else return `<span class="${color ? "red" : ""}">${arr[1]}</span>`;
};

//表格switch html 多个反显
export const switchIsShow = (val, json) => {
    let htmlStr = "";
    json.forEach((item) => {
        if (val == item.isVal) 
            htmlStr = `<span class="${item.color || ""}">${item.str}</span>`;
    });
    return htmlStr;
};
