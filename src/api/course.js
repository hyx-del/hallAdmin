/*
 * @Author: zx
 * @Date: 2021-12-24 13:07:52
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-05 16:54:55
 * @Descripttion:
 */
/*
 * 包含接口：删除课程(courseDeleteDelete),id查询课程(courseDetail),显示隐藏(courseDisplayPut),查询课程list(courseList),查询课程分页数据(coursePage),新增课程(courseSavePost),启用禁用(courseStatusPut),更新课程(courseUpdatePut),
 */
/*
 * 包含接口：上课评价相关接口
 */
// 课程管理-lzc Course Controller

import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 删除课程
export const courseDeleteDelete = (data) => {
    return request({
        url: `/admin/hall/course/delete?id=${data.id}`,
        method: "DELETE",
        data,
    });
};

// id查询课程
export const courseDetail = (data) => {
    return request({
        url: `/admin/hall/course/detail`,
        method: "GET",
        data,
    });
};

// 显示隐藏
export const courseDisplayPut = (data) => {
    return request({
        url: `/admin/hall/course/display`,
        method: "PUT",
        data,
    });
};

// 查询课程list
export const courseList = (data) => {
    return request({
        url: `/admin/hall/course/list`,
        method: "GET",
        data,
    });
};

// 查询课程分页数据
export const coursePage = (data) => {
    return request({
        url: `/admin/hall/course/page`,
        method: "GET",
        data,
    });
};

// 新增课程
export const courseSavePost = (data) => {
    return request({
        url: `/admin/hall/course/save`,
        method: "POST",
        data,
    });
};

// 启用禁用
export const courseStatusPut = (data) => {
    return request({
        url: `/admin/hall/course/status`,
        method: "PUT",
        data,
    });
};

// 更新课程
export const courseUpdatePut = (data) => {
    return request({
        url: `/admin/hall/course/update`,
        method: "PUT",
        data,
    });
};
// 上课后评价 begin============

// 上课评价分页查询
export const getCourseCommentListAPI = (data) => {
    return request({
        url: `/admin/hall/course-plan-comments/list`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 上课评价详情
export const getCourseCommentInfoAPI = (data) => {
    return request({
        url: `/admin/hall/course-plan-comments/info`,
        method: "GET",
        data,
    });
};

// 导出上课评价列表
export const exportCourseCommentListAPI = (data) => {
    return request({
        url: `/admin/hall/course-plan-comments/export`,
        method: "put",
        data: mixinMenu(data),
    });
};

// 回复上课评价
export const replierCourseCommentAPI = (data) => {
    return request({
        url: `/admin/hall/course-plan-comments/replier`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 上课后评价 end==============
