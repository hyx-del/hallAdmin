/*
 * 包含接口：添加课程计划(planAddPost),课程计划单个详情(planDetail),查询课程计划分页数据(planList),修改价格配置(priceAllocationPut),修改助教(replaceAssistantPut),修改助教(replaceCoachPut),修改状态(planStatusPut),修改课程计划(planUpdatePut),本周课程计划(planWeek),
 *课程计划-LZC Course Plan Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop"; // 添加课程计划
export const planAddPost = (data) => {
    return request({
        url: `/admin/hall/course/plan/add`,
        method: "POST",
        data: mixinMenu(data),
    });
};

// 排课（团课）
export const addLeaguePost = (data) => {
    return request({
        url: `/admin/hall/course/plan/add/league`,
        method: "POST",
        data: mixinMenu(data),
    });
};

// 课程计划单个详情
export const planDetail = (data) => {
    return request({
        url: `/admin/hall/course/plan/detail`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 查询课程计划分页数据
export const planList = (data) => {
    return request({
        url: `/admin/hall/course/plan/list`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 每月课程计划
export const planMonth = (data) => {
    return request({
        url: `/admin/hall/course/plan/month`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 修改价格配置
export const priceAllocationPut = (data) => {
    return request({
        url: `/admin/hall/course/plan/price/allocation`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 修改助教
export const replaceAssistantPut = (data) => {
    return request({
        url: `/admin/hall/course/plan/replace/assistant`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 修改助教
export const replaceCoachPut = (data) => {
    return request({
        url: `/admin/hall/course/plan/replace/coach`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 修改状态
export const planStatusPut = (data) => {
    return request({
        url: `/admin/hall/course/plan/status`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 修改课程计划
export const planUpdatePut = (data) => {
    return request({
        url: `/admin/hall/course/plan/update`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 每周课程计划
export const planWeek = (data) => {
    return request({
        url: `/admin/hall/course/plan/week`,
        method: "GET",
        data: mixinMenu(data),
    });
};


// 门店工作台-课程计划详情
export const planDetailWorkbench = data => {
    return request({
        url: `/admin/hall/course/plan/detail-workbench`,
        method: "get",
        data,
    });
};

// 教练签到
export const planStaffSignInPost = data => {
    return request({
        url: `/admin/hall/course/plan/staff-sign-in`,
        method: "POST",
        data,
    });
};

// 教练签出
export const planStaffSignOutPost = data => {
    return request({
        url: `/admin/hall/course/plan/staff-sign-out`,
        method: "POST",
        data,
    });
};

// 约课/排队
export const coursePlanOrderRegisterPost = data => {
    return request({
        url: `/admin/hall/course-plan-order/register`,
        method: "POST",
        data,
    });
};

// 上课/取消上课/爽约
export const coursePlanOrderStatusPost = data => {
    return request({
        url: `/admin/hall/course-plan-order/status`,
        method: "POST",
        data,
    });
};

// 上课确认
export const confirmedPut = data => {
    return request({
        url: `/admin/hall/course-plan-confirmed-records/confirmed`,
        method: "PUT",
        data,
    });
};

// 上课确认记录
export const confirmedRecord = data => {
    return request({
        url: `/admin/hall/course-plan-confirmed-records/confirmed-record`,
        method: "GET",
        data,
    });
};
