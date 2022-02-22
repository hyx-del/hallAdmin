/*
 * @Author: zx
 * @Date: 2021-11-18 15:02:08
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-20 13:39:34
 * @Descripttion:
 * 赵鑫补充一下 ，正则表达式的 demo   // TODO
 */
// 新加编辑和详情共用数据
import { couponList, couponListMixin } from "@/api/common";
import { couponBoxList } from "@/api/coupon";

export const itemList = [
    {
        label: "活动名称",
        code: "name",
        maxlength: 100,
    },
    {
        el: "date",
        type: "daterange",
        label: "报名日期",
        code: "date",
        otherCodeArr: ["startDate", "endDate"], // 开始和结束
    },
    {
        label: "活动地址",
        code: "activeAddress",
        maxlength: 100,
    },
    {
        label: "联系人",
        code: "contactPerson",
        required: false,
        maxlength: 50,
    },
    {
        label: "联系电话",
        code: "contactNumber",
        // checkType: "landline",
        // maxlength: 12,
        checkType: "phone",
        maxlength: 11,
        required: false,
        // tips:'手机号或者400-xxx-xxxx格式的座机'
    },
    {
        label: "会馆经纬度",
        code: "latitudeAndLongitude",
        required: false,
        checkType: "numbers",
        append: {
            text: "",
            class: "iconfont icon-31sousuo",
            click: () => {
                window.open("https://lbs.qq.com/getPoint/");
            },
        },
    },
    {
        el: "textArea",
        label: "活动简介",
        code: "introduction",
        required: false,
    },
    {
        el: "img",
        label: "活动图片",
        code: "images",
        // ratio:'200/200',
        required: false,
        default: [],
        backType: "Array",
    },
    {
        label: "预售金额",
        code: "presaleAmount",
        backType: "number",
        type: "number",
        maxlength: 100,
        checkType: "numberPoint2",
    },
    {
        el: "select",
        label: "优惠券",
        code: "couponId",
        fun: couponBoxList,
        required: false,
        query: {
            accessChannel: 4,
        },
    },
    {
        label: "推广奖励金额",
        code: "bonus",
        type: "number",
        maxlength: 100,
        checkType: "numberPoint2",
        backType: "number",
    },
    {
        label: "浏览次数",
        code: "pageViews",
        type: "number",
        checkType: "number",
        maxlength: 100,
        required: false,
    },
    {
        label: "排序",
        code: "orders",
        type: "number",
        checkType: "number",
        maxlength: 100,
        required: false,
    },
    {
        el: "editer",
        label: "活动内容",
        code: "content",
        required: false,
    },
];
