/*
 * @Author: 刘帝君
 * @Date: 2022-01-05 17:21:04
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-09 14:33:10
 * @Descripttion:
 */
import request from "./request";
import { mixinMenu } from "@/api/menuTop";
// ====================================课程卡管理======================================
// 课程卡管理列表
export function courseCardManagementList(data) {
    return request({
        url: "/admin/hall/course-card/list",
        method: "get",
        data,
    });
}
// 新增课程卡管理
export function addCourseCardManagement(data) {
    return request({
        url: "/admin/hall/course-card",
        method: "post",
        data,
    });
}

// 合同管理下拉
export function contractDropDownAPI(data) {
    return request({
        url: "/admin/contract/contractTemplate/get-list",
        method: "get",
        data,
    });
}

// 编辑课程卡管理
export function contractEditorAPI(data) {
    return request({
        url: "/admin/hall/course-card",
        method: "put",
        data,
    });
}

// 详情课程卡管理
export function contractDetailAPI(data) {
    return request({
        url: "/admin/hall/course-card/detail",
        method: "get",
        data,
    });
}
// 删除课程卡管理
export function deleteCourseCardManagement(data) {
    return request({
        url: "/admin/hall/course-card",
        method: "delete",
        data,
    });
}
// 课程卡管理状态
export function statusCourseCardManagement(data) {
    return request({
        url: "/admin/hall/course-card/status",
        method: "put",
        data,
    });
}

// 课程卡管理/规格
export function specificationsAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs/list",
        method: "get",
        data,
    });
}

// 课程卡管理/规格新增
export function specificationsAddAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs",
        method: "post",
        data,
    });
}

// 课程卡管理/规格编辑
export function specificationsDetailAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs",
        method: "put",
        data,
    });
}

// 课程卡管理/规格删除
export function specificationsDeleteAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs",
        method: "delete",
        data,
    });
}

// 课程卡管理/规格启用禁用
export function specificationsStateAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs/status",
        method: "put",
        data,
    });
}

// 课程卡管理-城市/场馆
export function venueListAreaAPI(data) {
    return request({
        url: "/admin/hall/hall/list-area",
        method: "get",
        data,
    });
}

// 课程卡管理-城市/场馆 查询单个门店的价格
export function venueDetailAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs-price-level/detail",
        method: "get",
        data,
    });
}

// 课程卡管理-城市/场馆 保存
export function venueSaveAPI(data) {
    return request({
        url: "/admin/hall/course-card-specs-price-level",
        method: "post",
        data,
    });
}

//课程卡保存场馆
export function courseCardAPI(data) {
    return request({
        url: "/admin/hall/course-card-apply-range",
        method: "post",
        data,
    });
}

// 查询课程卡场馆
export function courseQueryAPI(data) {
    return request({
        url: "/admin/hall/course-card-apply-range",
        method: "get",
        data,
    });
}
