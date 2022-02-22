/*
 * @Author: 郑晶
 * @Date: 2021-12-28 15:25:46
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-05 16:54:13
 * @Description:
 */
/*
 * 包含接口：新增数据(memberCouponPost),修改数据(memberCouponPut),删除数据(memberCouponDelete),批量删除数据(couponBatchDelete),下拉查询(couponBoxList),通过主键查询单条数据(couponDetail),分页查询(couponList),上线/下线 响应中data如果为false 表示仍有会员持有券(couponStatusPut),
 *优惠券 Coupon Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增数据
export const memberCouponPost = (data) => {
    return request({
        url: `/admin/member/coupon`,
        method: "POST",
        data,
    });
};

// 修改数据
export const memberCouponPut = (data) => {
    return request({
        url: `/admin/member/coupon`,
        method: "PUT",
        data,
    });
};

// 删除数据
export const memberCouponDelete = (data) => {
    return request({
        url: `/admin/member/coupon`,
        method: "DELETE",
        data,
    });
};

// 批量删除数据
export const couponBatchDelete = (data) => {
    return request({
        url: `/admin/member/coupon/batch`,
        method: "DELETE",
        data,
    });
};

// 下拉查询
export const couponBoxList = (data) => {
    return request({
        url: `/admin/member/coupon/box-list`,
        method: "GET",
        data,
    });
};

// 通过主键查询单条数据
export const couponDetail = (data) => {
    return request({
        url: `/admin/member/coupon/detail`,
        method: "GET",
        data,
    });
};

// 分页查询
export const couponList = (data) => {
    return request({
        url: `/admin/member/coupon/list`,
        method: "GET",
        data,
    });
};

// 上线/下线 响应中data如果为false 表示仍有会员持有券
export const couponStatusPut = (data) => {
    return request({
        url: `/admin/member/coupon/status`,
        method: "PUT",
        data,
    });
};
