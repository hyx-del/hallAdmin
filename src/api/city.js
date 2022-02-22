/*
 * @Author: jiu yin
 * @Date: 2021-12-23 15:40:28
 * @LastEditTime: 2022-02-15 10:58:46
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \hall-admin\src\api\city.js
 * jiu
 */
import request from "./request";
let admin = "/admin/hall";
/* 城市 */
//===========城市门店公用开卡申请订单

// 列表
export const courseOrdesList = (data) => {
    return request({
        url: `${admin}/member-course-card-orders/list`,
        method: "get",
        data,
    });
};

// 详情
export const courseOrdesDetail = (data) => {
    return request({
        url: `${admin}/member-course-card-orders/detail`,
        method: "get",
        data,
    });
};

// 表格修改状态
export const courseOrdesStatus = (data) => {
    return request({
        url: `${admin}/member-course-card-orders/status`,
        method: "PUT",
        data,
    });
};

// 修改数据
export const courseOrdesEdit = (data) => {
    return request({
        url: `${admin}/member-course-card-orders`,
        method: "PUT",
        data,
    });
};

// 是否首次开卡
export const firstSign = (data) => {
    return request({
        url: `${admin}/member-course-card-orders/firstSign`,
        method: "GET",
        data,
    });
};

// 销售流转记录
export const salesmanChanges = (data) => {
    return request({
        url: `${admin}/data-change-log/list-by-order-id`,
        method: "GET",
        data,
    });
};

// 修改销售
export const saleManChange = (data) => {
    return request({
        url: `${admin}/member-course-card-orders/sale-man-change`,
        method: "POST",
        data,
    });
};

// 支付
export const courseOrderPay = (data) => {
    return request({
        url: `${admin}/member-course-card-orders/pay`,
        method: "POST",
        data,
    });
};

// 修改支付
export const editCourseOrderPay = (data) => {
    return request({
        url: `${admin}/data-change-log/pay-change`,
        method: "POST",
        data,
    });
};

// 修改支付记录
export const editCourseOrderPayList = (data) => {
    return request({
        url: `${admin}/data-change-log/list-by-order-id`,
        method: "get",
        data,
    });
};

// 新增开卡
export const courseOrdesAdd = (data) => {
    return request({
        url: `${admin}/member-course-card-orders`,
        method: "POST",
        data,
    });
};

// 开卡订单合同信息
export const contractUrl = (data) => {
    return request({
        url: `${admin}/order-contracts/view-contract-url`,
        method: "GET",
        data,
    });
};

// 生成合同
export const generateContracts = (data) => {
    return request({
        url: `${admin}/order-contracts/generate`,
        method: "post",
        data,
    });
};

// 更新-合同附件
export const appendixesUpdate = (data) => {
    return request({
        url: `${admin}/order-contracts/update-appendixes`,
        method: "POST",
        data,
    });
};

// 打印合同
export const printContract = (data) => {
    return request({
        url: `/admin/contract/print-contract`,
        method: "GET",
        data,
    });
};

// 作废合同
export const destoryContract = (data) => {
    return request({
        url: `${admin}/order-contracts/destory`,
        method: "GET",
        data,
    });
};

// 审核合同
export const checkContract = (data) => {
    return request({
        url: `/admin/contract/merchant-seal`,
        method: "POST",
        data,
    });
};

// 会员详情查询id
export const memberDetail = (data) => {
    return request({
        url: `/admin/member/member/detail`,
        method: "get",
        data,
    });
};

//===========城市转卡记录

// 列表
export const cardTransformList = (data) => {
    return request({
        url: `${admin}/member-course-card-transform-orders/list`,
        method: "get",
        data,
    });
};

// 表格修改状态
export const cardTransformStatus = (data) => {
    return request({
        url: `${admin}/member-course-card-transform-orders/status`,
        method: "PUT",
        data,
    });
};
//详情
export const cardTransformDetail = (data) => {
    return request({
        url: `${admin}/member-course-card-transform-orders/detail`,
        method: "get",
        data,
    });
};
//===========城市退卡记录

// 列表
export const cardRefundList = (data) => {
    return request({
        url: `${admin}/member-course-card-refund-orders/list`,
        method: "get",
        data,
    });
};

// 表格修改状态
export const cardRefundStatus = (data) => {
    return request({
        url: `${admin}/member-course-card-refund-orders/status`,
        method: "PUT",
        data,
    });
};
//详情
export const cardRefundDetail = (data) => {
    return request({
        url: `${admin}/member-course-card-refund-orders/detail`,
        method: "get",
        data,
    });
};

//===========城市剩余价值调整申请

// 列表
export const surplusList = (data) => {
    return request({
        url: `${admin}/member-course-card-surplus-value-adjust-log/list`,
        method: "get",
        data,
    });
};

// 表格修改状态
export const surplusStatus = (data) => {
    return request({
        url: `${admin}/member-course-card-surplus-value-adjust-log/status`,
        method: "PUT",
        data,
    });
};

//===========城市课程结算设置

// 列表
export const courseFeeList = (data) => {
    return request({
        url: `${admin}/initial/data/course`,
        method: "get",
        data,
    });
};

//支付详情
export const courseFeePayDetail = (data) => {
    return request({
        url: `${admin}/course/payment/rules/detail`,
        method: "get",
        data,
    });
};

//支付编辑
export const courseFeePayEdit = (data) => {
    return request({
        url: `${admin}/course/payment/rules`,
        method: "put",
        data,
    });
};

//课时费详情
export const courseFeeDetail = (data) => {
    return request({
        url: `${admin}/course/fee/rules/detail`,
        method: "GET",
        data,
    });
};

//课时费详情
export const courseFeeDetailGroup = (data) => {
    return request({
        url: `${admin}/coach/group/get-group-fee-rules`,
        method: "GET",
        data,
    });
};

//课时费编辑
export const courseFeeEdit = (data) => {
    return request({
        url: `${admin}/course/fee/rules`,
        method: "put",
        data,
    });
};

//===========门店会馆管理

//----课程
// 列表
export const courseList = (data) => {
    return request({
        url: `${admin}/course/page`,
        method: "get",
        data,
    });
};

//详情
export const courseDetail = (data) => {
    return request({
        url: `${admin}/course/detail`,
        method: "get",
        data,
    });
};

//----场馆信息
export const hallDetail = (data) => {
    return request({
        url: `/admin/hall/hall/detail`,
        method: "get",
        data,
    });
};
//----课程卡
// 列表
export const courseCardList = (data) => {
    return request({
        url: `${admin}/course-card/list`,
        method: "get",
        data,
    });
};

//详情Tabs 基础信息
export const courseCardDetail = (data) => {
    return request({
        url: `${admin}/course-card/detail`,
        method: "get",
        data,
    });
};
//详情Tabs 规格列表
export const courseCardSpecsList = (data) => {
    return request({
        url: `${admin}/course-card-specs/list`,
        method: "get",
        data,
    });
};

//详情Tabs 城市场馆列表
export const courseHall = (data) => {
    return request({
        url: `${admin}/hall/list-area`,
        method: "get",
        data,
    });
};
//详情Tabs 城市场馆单个价格查询
export const courseHallPrice = (data) => {
    return request({
        url: `${admin}/course-card-specs-price-level/detail`,
        method: "get",
        data,
    });
};
