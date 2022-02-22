/*
 * @Author: 刘帝君
 * @Date: 2021-12-31 09:46:17
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-24 16:06:38
 * @Descripttion:
 */

import request from "./request";
import { mixinMenu } from "@/api/menuTop";
// ====================================合同管理======================================
// 合同管理列表
export function contractListAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate/list",
        method: "get",
        data,
    });
}

// 合同管理新增
export function contractAppAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate",
        method: "post",
        data,
    });
}

// 合同管理编辑
export function contractEditAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate",
        method: "put",
        data,
    });
}

// 合同管理查询
export function contractDetailAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate/detail",
        method: "get",
        data,
    });
}

// 合同管理删除
export function contractDeleteAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate",
        method: "delete",
        data,
    });
}

// 合同管理启用/禁用
export function contractStatusAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate/status",
        method: "put",
        data,
    });
}
