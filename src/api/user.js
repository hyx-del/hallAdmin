/*
 * @Author: aa
 * @Date: 2021-08-23 10:31:43
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-11 10:05:49
 * @Descripttion:
 */

import request from "./request";

// 登录
export function login(data) {
    return request({
        url: "/auth/oauth/token",
        method: "POST",
        data,
    });
}

// 获取用户基本信息
export function getUserInfo(data) {
    return request({
        url: "/admin/oauth/token",
        method: "POST",
        data,
        ContentType: "form",
    });
}

// 获取用户菜单列表
export function getMenuInfo(data) {
    return request({
        url: "/admin/oauth/token",
        method: "POST",
        data,
        ContentType: "form",
    });
}
// 员工修改密码
export const staffUpdatePasswordPost = (data) => {
    return request({
        url: `/admin/school/staff/updatePassword`,
        method: "POST",
        data,
    });
};

// 签到
export const signInAPI = (data) => {
    return request({
        url: `/admin/hall/hall/qrcode`,
        method: "POST",
        data,
    });
};
