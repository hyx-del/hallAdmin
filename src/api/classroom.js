/*
 * @Author: wei.chen
 * @Date: 2021-10-18 09:23:40
 * @LastEditors: zx
 * @LastEditTime: 2021-12-15 17:56:58
 * @Descripttion:
 */

import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 批量删除数据
export const classroomBatchDelete = (data) => {
    return request({
        url: `/admin/school/classroom/batch`,
        method: "DELETE",
        data: mixinMenu(data),
    });
};

// 分页查询
export const classroomBoxlist = (data) => {
    return request({
        url: `/admin/school/classroom/boxlist`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 删除数据
export const delClassroomAPI = (data) => {
    return request({
        url: `/admin/hall/classroom/remove`,
        method: "DELETE",
        data: mixinMenu(data),
    });
};

// 通过主键查询单条数据
export const getClassroomDetailAPI = (data) => {
    return request({
        url: `/admin/hall/classroom/detail`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 分页查询
export const getClassroomListAPI = (data) => {
    return request({
        url: `/admin/hall/classroom/page`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 新增数据
export const addClassroomAPI = (data) => {
    return request({
        url: `/admin/hall/classroom/add`,
        method: "POST",
        data: mixinMenu(data),
    });
};

// 修改状态
export const classroomStatusPut = (data) => {
    return request({
        url: `/admin/hall/classroom/status`,
        method: "PUT",
        data
    });
};

// 修改数据
export const editClassroomAPI = (data) => {
    return request({
        url: `/admin/hall/classroom/update`,
        method: "PUT",
        data: mixinMenu(data),
    });
};
