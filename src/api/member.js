/*
 * @Author: 郑晶
 * @Date: 2021-12-28 15:29:54
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-10 15:06:52
 * @Description:会员模块接口
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 优惠券列表
export const couponList = (data) => {
    return request({
        url: `/admin/member/coupon/list`,
        method: "get",
        data,
    });
};
// 优惠券-上线/下线
export const updateMemberCouponStatus = (data) => {
    return request({
        url: `/admin/member/coupon/status`,
        method: "put",
        data,
    });
};
// 删除优惠券
export const deleteMemberCoupon = (data) => {
    return request({
        url: `/admin/member/coupon`,
        method: "delete",
        data,
    });
};
// 添加优惠券
export const addMemberCoupon = (data) => {
    return request({
        url: `/admin/member/coupon`,
        method: "post",
        data,
    });
};
// 优惠券详情
export const MemberCouponDetail = (data) => {
    return request({
        url: `/admin/member/coupon/detail`,
        method: "get",
        data,
    });
};
// 修改优惠券
export const updateMemberCoupon = (data) => {
    return request({
        url: `/admin/member/coupon`,
        method: "put",
        data,
    });
};
// 口令码列表
export const commandCodeList = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/pass-code-list`,
        method: "get",
        data,
    });
};
// 兑换码列表
export const exchangeCodeList = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/redeem-code-list`,
        method: "get",
        data,
    });
};
// 生成兑换码
export const addExchangeCode = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/redeem-code`,
        method: "post",
        data,
    });
};
// 生成口令码
export const addCommandCode = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/pass-code`,
        method: "post",
        data,
    });
};
// 兑换码详情
export const exchangeCodeDetails = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/redeem-code-detail-list-page`,
        method: "get",
        data,
    });
};
// 会员列表分页
export const memberList = (data) => {
    return request({
        url: `/admin/member/member/list`,
        method: "get",
        data,
    });
};
// 会员详情
export const memberDetail = (data) => {
    return request({
        url: `/admin/member/member/detail`,
        method: "get",
        data,
    });
};
// 微信解绑
export const unbundlingWX = (data) => {
    return request({
        url: `/admin/member/member/wechat/unbind`,
        method: "PUT",
        data,
    });
};

//获取链接
export const obtainLinkAPI = (data) => {
    return request({
        url: `/admin/contract/get-custom-verify-url`,
        method: "POST",
        data,
    });
};

// 修改会员数据
export const updateMember = (data) => {
    return request({
        url: `/admin/member/member`,
        method: "put",
        data,
    });
};
