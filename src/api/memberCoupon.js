/*
 * @Author: 郑晶
 * @Date: 2021-12-28 15:25:46
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-05 16:55:45
 * @Description:
 */
/*
 * 包含接口：新增数据(schoolMemberCouponPost),修改数据(schoolMemberCouponPut),删除数据(schoolMemberCouponDelete),批量删除数据(memberCouponBatchDelete),下拉查询 可使用的优惠券(memberCouponBoxList),通过主键查询单条数据(memberCouponDetail),作废(memberCouponInvalidPut),发券(memberCouponIssueCouponPost),分页查询(memberCouponList),核销(memberCouponWriteOffPut),
 *会员的优惠券 Member Coupon Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增数据
export const schoolMemberCouponPost = (data) => {
    return request({
        url: `/admin/member/member-coupon`,
        method: "POST",
        data,
    });
};

// 修改数据
export const schoolMemberCouponPut = (data) => {
    return request({
        url: `/admin/member/member-coupon`,
        method: "PUT",
        data,
    });
};

// 删除数据
export const schoolMemberCouponDelete = (data) => {
    return request({
        url: `/admin/member/member-coupon`,
        method: "DELETE",
        data,
    });
};

// 批量删除数据
export const memberCouponBatchDelete = (data) => {
    return request({
        url: `/admin/member/member-coupon/batch`,
        method: "DELETE",
        data,
    });
};

// 下拉查询 可使用的优惠券
export const memberCouponBoxList = (data) => {
    return request({
        url: `/admin/member/member-coupon/boxList`,
        method: "GET",
        data,
    });
};

// 通过主键查询单条数据
export const memberCouponDetail = (data) => {
    return request({
        url: `/admin/member/member-coupon/detail`,
        method: "GET",
        data,
    });
};

// 作废
export const memberCouponInvalidPut = (data) => {
    return request({
        url: `/admin/member/member-coupon/invalid`,
        method: "PUT",
        data,
    });
};

// 发券
export const memberCouponIssueCouponPost = (data) => {
    return request({
        url: `/admin/member/member-coupon/issue-coupon`,
        method: "POST",
        data,
    });
};

// 分页查询
export const memberCouponList = (data) => {
    return request({
        url: `/admin/member/member-coupon/list`,
        method: "GET",
        data,
    });
};

// 核销
export const memberCouponWriteOffPut = (data) => {
    return request({
        url: `/admin/member/member-coupon/write-off`,
        method: "PUT",
        data,
    });
};
