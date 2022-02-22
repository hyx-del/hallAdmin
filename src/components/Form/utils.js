/*
 * @Author: jiu yin
 * @Date: 2021-11-17 17:17:26
 * @LastEditTime: 2022-01-24 13:14:50
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \hall-admin\src\components\Form\utils.js
 * jiu
 */
import {isCardID} from './idCardCheck'
export const regCheck = {
    doubleBit: {
        name: "双字节匹配",
        regular: /[\u4e00-\u9fa5]+/gi,
        error: "",
    },
    number: {
        name: "数字检查",
        regular: /^[0-9]*$/,
        correctRegular: /[^0-9]{1,}/gi, //纠正正则
        error: "请输入正整数",
    },
    numberPoint: {
        name: "无限制小数点的数字检查",
        regular: /^([0-9]{1,})*([\.][0-9]{1,})?$/,
        correctRegular: /[^0-9.]{1,}/gi, //纠正正则
        error: "请输入数字",
    },
    numberPoint2: {
        name: "不要小数点或两个小数点的数字检查",
        regular: /^([0-9]{1,5})([\.][0-9]{2})?$/,
        correctRegular: /[^0-9.]{1,}/gi, //纠正正则
        error: "最大5位数或携带两位小数点",
    },
    numberPoint27: {
        name: "不要小数点或两个小数点的数字检查",
        regular: /^([0-9]{1,8})([\.][0-9]{2})?$/,
        correctRegular: /[^0-9.]{1,}/gi, //纠正正则
        error: "最大7位数或携带两位小数点",
    },
    numberPoint3: {
        name: "两个小数点的数字检查",
        regular: /^([0-9]{1,5})([\.][0-9]{2})$/,
        error: "请输入最多两个小数点的数字",
    },
    phone: {
        name: "手机号检查",
        regular: /^[1]([3-9])[0-9]{9}$/,
        correctRegular: /[^0-9]{1,}/gi,
        error: "请输入正确的手机号",
    },
    phones: {
        name: "电话号检查",
        regular: /^[1]([3-9])[0-9]{9}$/,
        correctRegular: /[^0-9]{1,}/gi,
        error: "请输入正确的电话号码",
    },
    landline: {
        name: "手机号和电话检查",
        regular:
            /(^[1]([3-9])[0-9]{9}$)|(^(0[0-9]{2,3}[\-]{0,})([2-9][0-9]{4,7})+([\-]{0,}[0-9]{1,4})?$)|(^(400)([\-]{0,})(\d{3})([\-]{0,})(\d{4}$))/,
        correctRegular: /[^0-9\-]{1,}/gi,
        error: "请输入正确的手机号或者电话号码",
    },
    email: {
        name: "邮箱验证",
        regular: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,
        error: "请输入正确的邮箱",
    },
    zh: {
        name: "中文检查",
        regular: /^[\u4e00-\u9fa5]+$/,
        correctRegular: /[^\u4e00-\u9fa5]{1,}/gi,
        error: "请输入中文",
    },
    password: {
        name: "密码数字加特殊字符",
        regular:
            /^(?![0-9]+$)(?![a-zA-Z\.!@#$%^&*()_+|{}?><\-\]\\[\/'"\:\;\,\<\>]+$)[0-9A-Za-z\.!@#$%^&*()_+|{}?><\-\]\\[\/'"\:\;\,\<\>]{6,20}$/,
        error: "请输入密码数字加特殊字符",
    },
    password2: {
        name: "密码数字加特殊字符",
        regular: /^[a-zA-Z0-9,.*#@!~]{6,18}$/,
        correctRegular: /[^a-zA-Z0-9,.*#@!~]{1,}/gi,
        error: "请输入6到18位的数字或字母或,.*#@!~",
    },
    letter: {
        name: "字母检查",
        regular: /^[A-Za-z]+$/,
        correctRegular: /[^A-Za-z\.]{1,}/gi,
        error: "请输入英文字母",
    },
    en: {
        name: "字母检查",
        regular: /^[A-Za-z]+$/,
        correctRegular: /[^A-Za-z\.]{1,}/gi,
        error: "请输入英文字母",
    },
    letterNum: {
        name: "数字加字母检查",
        regular: /^[A-Za-z0-9]{4,40}$/,
        correctRegular: /[^A-Za-z0-9]{1,}/gi,
        error: "请输入英文字母加数字",
    },
    goodsCode: {
        name: "数字加字母检查",
        regular: /^[A-Za-z0-9]{3,40}$/,
        error: "请输入长度不少于三位的英文字母加数字",
    },
    identity: {
        name: "身份证",
        regular:
            /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
        fn: isCardID,
        correctRegular: /[^0-9Xx]{1,}/gi,
        error: "请输入正确身份证号",
    },
};


