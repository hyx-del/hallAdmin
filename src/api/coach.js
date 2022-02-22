/*
 * @Author: wei.chen
 * @Date: 2021-09-02 15:04:47
 * @LastEditTime: 2022-01-05 16:53:36
 * @LastEditors: 郑晶
 * @Description:教练模块
 */

import request from "./request";
import { mixinMenu } from "@/api/menuTop";

// 创建  教练等级===========
// export function addCoachLevel(data) {
// 	return request({
// 		url: '/admin/coach-level/add',
// 		method: 'POST',
// 		data,
// 	});
// }
// 获取分类列表
export function getCoachLevelListAPI(data) {
    return request({
        url: `/admin/hall/coach/list`,
        method: "get",
        data: mixinMenu(data),
    });
}

// 是否显示在官网
export function isShowWebsiteAPI(data) {
    return request({
        url: `/admin/hall/coach/show`,
        method: "put",
        data,
    });
}

// 是否显示在小程序
export function displayWebsiteAPI(data) {
    return request({
        url: `/admin/hall/coach/display`,
        method: "put",
        data,
    });
}

// 教练编辑保存
export function detailSaveAPI(data) {
    return request({
        url: `/admin/hall/coach/save`,
        method: "post",
        data,
    });
}

// 教练详情
export function basicInformationAPI(data) {
    return request({
        url: `/admin/hall/coach/detail`,
        method: "get",
        data,
    });
}

// 场馆列表
export function venuesAPI(data) {
    return request({
        url: `/admin/hall/coach/halls/all`,
        method: "get",
        data,
    });
}

// 场馆回显数据
export function venuesDataAPI(data) {
    return request({
        url: `/admin/hall/coach/halls/checked`,
        method: "get",
        data,
    });
}

// 场馆保存
export function venuesListAPI(data) {
    return request({
        url: `/admin/hall/coach/halls/save`,
        method: "post",
        data,
    });
}

// 可授课程保存
export function courseSaveAPI(data) {
    return request({
        url: `/admin/hall/coach/courses/save`,
        method: "post",
        data,
    });
}
// 可授课程查询
export function courseCheckedAPI(data) {
    return request({
        url: `/admin/hall/coach/courses/checked`,
        method: "get",
        data,
    });
}

// 课时限制
export function classLimitAPI(data) {
    return request({
        url: `/admin/hall/coach/class/time/all/course`,
        method: "get",
        data,
    });
}

// 课时限制详情
export function classDetailAPI(data) {
    return request({
        url: `/admin/hall/coach/class/time/detail`,
        method: "get",
        data,
    });
}

// 课时限制保存
export function classSaveAPI(data) {
    return request({
        url: `/admin/hall/coach/class/time/save`,
        method: "post",
        data,
    });
}

// 获取单个
export function getCoachDetailAPI(data) {
    return request({
        url: `/admin/school/coach/detail`,
        method: "GET",
        data,
    });
}

// 删除
// export function delCoachLevel(data) {
// 	return request({
// 		url: `/admin/coach-level/delete/${data.id}`,
// 		method: 'delete',
// 		data,
// 	});
// }
// 编辑
// export function editCoachLevel(data) {
// 	return request({
// 		url: `/admin/coach-level/update/${data.id}`,
// 		method: 'put',
// 		data,
// 	});
// }
//  ==========教练等级end =============

// 获取单个
export function getCoach(data) {
    return request({
        url: `/admin/coaches/${data.id}`,
        method: "GET",
    });
}

// 教练下拉框查询
export const coachBoxlist = (data) => {
    return request({
        url: `/admin/school/coach/boxlist`,
        method: "GET",
        data,
    });
};

// 教练-lzc
// Coach Controller

// id查询教练
export const coachDetail = (data) => {
    return request({
        url: `/admin/hall/coach/detail`,
        method: "GET",
        data,
    });
};

// 显示隐藏
export const coachDisplayPut = (data) => {
    return request({
        url: `/admin/hall/coach/display`,
        method: "PUT",
        data,
    });
};

// 查询教练分页数据
export const coachList = (data) => {
    return request({
        url: `/admin/hall/coach/list`,
        method: "GET",
        data,
    });
};

// 保存教练信息
export const coachSavePost = (data) => {
    return request({
        url: `/admin/hall/coach/save`,
        method: "POST",
        data,
    });
};

// 是否显示在官网
export const coachShowPut = (data) => {
    return request({
        url: `/admin/hall/coach/show`,
        method: "PUT",
        data,
    });
};
