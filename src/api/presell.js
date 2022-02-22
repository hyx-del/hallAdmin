/*
 * 包含接口：新增数据(presellPresellactivityPost),修改数据(presellPresellactivityPut),删除数据(presellPresellactivityDelete),批量删除数据(presellactivityBatchDelete),通过主键查询单条数据(presellactivityDetail),活动下线(downStatus),分页查询(presellactivityList),活动上线(upStatus),新增数据(presellPresellorderPost),修改数据(presellPresellorderPut),删除数据(presellPresellorderDelete),批量删除数据(presellorderBatchDelete),通过主键查询单条数据(presellorderDetail),导出(presellorderExport),分页查询(presellorderList),
 *预售订单 Presell Order Admin Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增数据
export const presellPresellactivityPost = (data) => {
    return request({
        url: `/admin/presell/presellactivity`,
        method: "POST",
        data: mixinMenu(data),
    });
};

// 修改数据
export const presellPresellactivityPut = (data) => {
    return request({
        url: `/admin/presell/presellactivity`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 删除数据
export const presellPresellactivityDelete = (data) => {
    return request({
        url: `/admin/presell/presellactivity`,
        method: "DELETE",
        data: mixinMenu(data),
    });
};

// 批量删除数据
export const presellactivityBatchDelete = (data) => {
    return request({
        url: `/admin/presell/presellactivity/batch`,
        method: "DELETE",
        data: mixinMenu(data),
    });
};

// 通过主键查询单条数据
export const presellactivityDetail = (data) => {
    return request({
        url: `/admin/presell/presellactivity/detail`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 活动下线
export const downStatus = (data) => {
    return request({
        url: `/admin/presell/presellactivity/down/status`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 分页查询
export const presellactivityList = (data) => {
    return request({
        url: `/admin/presell/presellactivity/list`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 活动上线
export const upStatus = (data) => {
    return request({
        url: `/admin/presell/presellactivity/up/status`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 新增数据
export const presellPresellorderPost = (data) => {
    return request({
        url: `/admin/presell/presellorder`,
        method: "POST",
        data: mixinMenu(data),
    });
};

// 修改数据
export const presellPresellorderPut = (data) => {
    return request({
        url: `/admin/presell/presellorder`,
        method: "PUT",
        data: mixinMenu(data),
    });
};

// 删除数据
export const presellPresellorderDelete = (data) => {
    return request({
        url: `/admin/presell/presellorder`,
        method: "DELETE",
        data: mixinMenu(data),
    });
};

// 批量删除数据
export const presellorderBatchDelete = (data) => {
    return request({
        url: `/admin/presell/presellorder/batch`,
        method: "DELETE",
        data: mixinMenu(data),
    });
};

// 通过主键查询单条数据
export const presellorderDetail = (data) => {
    return request({
        url: `/admin/presell/presellorder/detail`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 导出
export const presellorderExport = (data) => {
    return request({
        url: `/admin/presell/presellorder/export`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 分页查询
export const presellorderList = (data) => {
    return request({
        url: `/admin/presell/presellorder/list`,
        method: "GET",
        data: mixinMenu(data),
    });
};
