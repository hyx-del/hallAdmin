/*
 * @Author: 郑晶
 * @Date: 2021-12-17 17:23:58
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-11 14:29:24
 * @Description:
 */
/*
 * 包含接口：新增数据(hallMemberPost),修改数据(hallMemberPut),检测是否注册接口(memberContact),通过主键查询单条数据(memberDetail),分页查询(memberList),批量修改销售(memberSalesmanPut),
 */

import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增数据
export const hallMemberPost = (data) => {
    return request({
        url: `/admin/hall/member`,
        method: "POST",
        data,
    });
};

// 修改数据
export const hallMemberPut = (data) => {
    return request({
        url: `/admin/hall/member`,
        method: "PUT",
        data,
    });
};

// 检测是否注册接口
export const memberContact = (data) => {
    return request({
        url: `/admin/hall/member/contact`,
        method: "GET",
        data,
    });
};

// 通过主键查询单条数据
export const memberDetail = (data) => {
    return request({
        url: `/admin/hall/member/detail`,
        method: "GET",
        data,
    });
};

// 分页查询
export const memberList = (data) => {
    return request({
        url: `/admin/hall/member/list`,
        method: "GET",
        data,
    });
};

// 批量修改销售
export const memberSalesmanPut = (data) => {
    return request({
        url: `/admin/hall/member/salesman`,
        method: "PUT",
        data,
    });
};
// 会员单个详情
export const hallMemberDetail = (data) => {
    return request({
        url: `/admin/hall/member/detail`,
        method: "GET",
        data,
    });
};
// 余额调整
export const hallMemberAccountAdjust = (data) => {
    return request({
        url: `/admin/hall/member/account/adjust`,
        method: "POST",
        data,
    });
};
