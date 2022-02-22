/*
 * @Author: wei.chen
 * @Date: 2021-08-31 13:14:44
 * @LastEditTime: 2022-02-18 15:07:26
 * @LastEditors: jiu yin zhen jing
 * @Description:基础设置
 */

import request from "./request";

let _tempUrl = "/admin/school/dict/item";
// 1  reg_clique  注册派别
// 2  study_goal  学习目的
// 3  resource_type  资源类型
// 4  student_position  学员身份
// 5  consulting_course  咨询课程
// 6  communication  沟通方式
// 7  pay_type  支付方式

// ========================充值规格========================
// 列表查询充值规格
export function getRegCliqueListAPI(data) {
    return request({
        url: "/admin/hall/charge/specification/list",
        method: "get",
        data,
    });
}
// 添加充值规格
export function addRegCliqueAPI(data) {
    return request({
        url: "/admin/hall/charge/specification",
        method: "post",
        data,
    });
}
// 编辑充值规格
export function editRegCliqueAPI(data) {
    return request({
        url: "/admin/hall/charge/specification",
        method: "put",
        data,
    });
}
// 删除充值规格
export function deleteItemAPI(data) {
    return request({
        url: `/admin/hall/charge/specification?id=${data}`,
        method: "delete",
    });
}
// ============================ 教练组=========================
// 列表查询教练组
export function getStudyGoalListAPI(data) {
    return request({
        url: "/admin/hall/coach/group/list",
        method: "get",
        data,
    });
}
// 添加教练组
export function addStudyGoalAPI(data) {
    return request({
        url: "/admin/hall/coach/group/add",
        method: "post",
        data,
    });
}
// 编辑教练组
export function editStudyGoalAPI(data) {
    return request({
        url: "/admin/hall/coach/group/update",
        method: "put",
        data,
    });
}
// 删除教练组
export function deleteCoachingStaffAPI(data) {
    return request({
        url: `/admin/hall/coach/group/delete?id=${data}`,
        method: "DELETE",
    });
}
// ============================ 体测项目 =========================
// 列表查询体测项目
export function sideProjectListAPI(data) {
    return request({
        url: "/admin/hall/support/body/indicator/list",
        method: "get",
        data,
    });
}
// 添加体测项目
export function addSideProjectAPI(data) {
    return request({
        url: "/admin/hall/support/body/indicator",
        method: "post",
        data,
    });
}
// 编辑体测项目
export function editSideProjectAPI(data) {
    return request({
        url: "/admin/hall/support/body/indicator",
        method: "put",
        data,
    });
}
// 删除教练组
export function deleteSideProjectAPI(data) {
    return request({
        url: "/admin/hall/support/body/indicator",
        method: "delete",
        data,
    });
}
// 启用/禁用教练组
export function statusSideProjectAPI(data) {
    return request({
        url: "/admin/hall/support/body/indicator/status",
        method: "put",
        data,
    });
}
// ============================ 支付方式 =========================
// 列表查询支付方式
export function payMannerListAPI(data) {
    return request({
        url: "/admin/hall/support/payment/mode/list",
        method: "get",
        data,
    });
}
// 添加支付方式
export function addPayMannerAPI(data) {
    return request({
        url: "/admin/hall/support/payment/mode",
        method: "post",
        data,
    });
}
// 编辑支付方式
export function editPayMannerAPI(data) {
    return request({
        url: "/admin/hall/support/payment/mode",
        method: "put",
        data,
    });
}
// 删除支付方式
export function deletePayMannerAPI(data) {
    return request({
        url: "/admin/hall/support/payment/mode",
        method: "delete",
        data,
    });
}
// 启用/禁用支付方式
export function statusPayMannerAPI(data) {
    return request({
        url: "/admin/hall/support/payment/mode/status",
        method: "put",
        data,
    });
}
// ============================ 咨询课程 =consulting_course========================
// 列表查询 咨询课程
export function getConsultingCourseListAPI(data) {
    return request({
        url: _tempUrl + "/list",
        method: "get",
        data: { ...data, type: "consulting_course" },
    });
}
// 添加 咨询课程
export function addConsultingCourseAPI(data) {
    return request({
        url: _tempUrl,
        method: "post",
        data: { ...data, type: "consulting_course" },
    });
}
// 编辑 咨询课程
export function editConsultingCourseAPI(data) {
    return request({
        url: _tempUrl,
        method: "put",
        data: { ...data, type: "consulting_course" },
    });
}
// ============================ 沟通方式 =communication========================
// 列表查询 沟通方式
export function getCommunicationListAPI(data) {
    return request({
        url: _tempUrl + "/list",
        method: "get",
        data: { ...data, type: "communication" },
    });
}
// 添加 沟通方式
export function addCommunicationAPI(data) {
    return request({
        url: _tempUrl,
        method: "post",
        data: { ...data, type: "communication" },
    });
}
// 编辑 沟通方式
export function editCommunicationAPI(data) {
    return request({
        url: _tempUrl,
        method: "put",
        data: { ...data, type: "communication" },
    });
}
// ============================ 支付方式 =pay_type========================
// 列表查询 支付方式
export function getPayTypeListAPI(data) {
    return request({
        url: _tempUrl + "/list",
        method: "get",
        data: { ...data, type: "pay_type" },
    });
}
// 添加 支付方式
export function addPayTypeAPI(data) {
    return request({
        url: _tempUrl,
        method: "post",
        data: { ...data, type: "pay_type" },
    });
}
// 编辑 支付方式
export function editPayTypeAPI(data) {
    return request({
        url: _tempUrl,
        method: "put",
        data: { ...data, type: "pay_type" },
    });
}

// 编辑状态注册派别
export function changeStateItemAPI(data) {
    return request({
        url: _tempUrl + "/status",
        method: "put",
        data,
    });
}

// ============================ 课程派别 =========================
// 列表查询 课程派别
export function semesterFactionListAPI(data) {
    return request({
        url: "/admin/school/semester/category/list",
        method: "get",
        data,
    });
}

// 学期课程派别下拉
export function semesterFactionListAPIs(data) {
    return request({
        url: "/admin/school/semester/category/list/dropdown",
        method: "get",
        data,
    });
}

// 修改状态 课程派别
export function semesterFactionEnable(data) {
    return request({
        url: "/admin/school/semester/category/enable",
        method: "put",
        data,
    });
}

// 新增课程派别
export function semesterFactionAdd(data) {
    return request({
        url: "/admin/school/semester/category",
        method: "post",
        data,
    });
}

// 编辑课程派别
export function semesterFactionEditor(data) {
    return request({
        url: "/admin/school/semester/category",
        method: "put",
        data,
    });
}

// 详情课程派别
export function semesterFactionDetails(data) {
    return request({
        url: "/admin/school/semester/category/detail",
        method: "get",
        data,
    });
}

// 删除课程派别
export function semesterFactionDelete(data) {
    return request({
        url: "/admin/school/semester/category",
        method: "delete",
        data,
    });
}

// ========================课程标签管理接口========================
// 列表查询课程标签管理
export function getCourseLabelListAPI(data) {
    return request({
        url: "/admin/hall/course/label/list",
        method: "get",
        data,
    });
}
// 查询课程标签分页数据
export const labelList = (data) => {
    return request({
        url: `/admin/hall/course/label/list`,
        method: "GET",
        data,
    });
};
// 添加课程标签管理
export function addCourseLabelAPI(data) {
    return request({
        url: "/admin/hall/course/label",
        method: "post",
        data,
    });
}
// 删除课程标签管理
export function delCourseLabelAPI(data) {
    return request({
        url: `/admin/hall/course/label/${data.id}`,
        method: "delete",
        data,
    });
}
// 编辑注册派别状态
export function editStatusCourseLabelAPI(data) {
    return request({
        url: "/admin/hall/course/label/status",
        method: "put",
        data: data,
    });
}
// 编辑注册派别信息
export function editCourseLabelAPI(data) {
    return request({
        url: "/admin/hall/course/label",
        method: "put",
        data: data,
    });
}

// ========================规格类别管理接口========================
// 列表查询课程标签管理
export function getCardSpecificationsCategListAPI(data) {
    return request({
        url: "/admin/hall/course-card-spec-category/list",
        method: "get",
        data,
    });
}
// 添加课程标签管理
export function addCardSpecificationsCategAPI(data) {
    return request({
        url: "/admin/hall/course-card-spec-category",
        method: "post",
        data,
    });
}
// 删除课程标签管理
export function delCardSpecificationsCategAPI(data) {
    return request({
        url: `/admin/hall/course-card-spec-category`,
        method: "delete",
        data,
    });
}
// // 编辑注册派别状态
// export function editStatusCardSpecificationsCategAPI(data) {
//     return request({
//         url: "/admin/hall/course/label/status",
//         method: "put",
//         data: data,
//     });
// }
// 编辑注册派别信息
export function editCardSpecificationsCategAPI(data) {
    return request({
        url: "/admin/hall/course-card-spec-category",
        method: "put",
        data: data,
    });
}



// ========================赠品接口========================
// 列表查询课程标签管理
export function getGiftList(data) {
    return request({
        url: "/admin/hall/gift/list",
        method: "get",
        data,
    });
}
// 修改状态
export function getGiftStatus(data) {
    return request({
        url: "/admin/hall/gift/status",
        method: "put",
        data,
    });
}
// 删除赠品
export function getGiftDelete(data) {
    return request({
        url: `/admin/hall/gift`,
        method: "delete",
        data,
    });
}
// 编辑赠品
export function getGiftEdit(data) {
    return request({
        url: "/admin/hall/gift",
        method: "put",
        data: data,
    });
}
// 编辑赠品
export function getGiftAdd(data) {
    return request({
        url: "/admin/hall/gift",
        method: "POST",
        data: data,
    });
}

// ========================教练评价标签管理接口========================
// 列表查询课评价标签管理
export function getCommentTagListAPI(data) {
    return request({
        url: "/admin/hall/comment/tag/list",
        method: "get",
        data,
    });
}
// 添加评价标签管理
export function addCommentTagAPI(data) {
    return request({
        url: "/admin/hall/comment/tag/add",
        method: "post",
        data,
    });
}
// // 删除评价标签管理
// export function delCommentTagAPI(data) {
//     return request({
//         url: `/admin/hall/course-card-spec-category`,
//         method: "delete",
//         data,
//     });
// }
// 编辑评价标签管理
export function editStatusCommentTagAPI(data) {
    return request({
        url: "/admin/hall/comment/tag/status",
        method: "put",
        data: data,
    });
}
// 编辑评价标签管理
export function editCommentTagAPI(data) {
    return request({
        url: "/admin/hall/comment/tag/update",
        method: "put",
        data: data,
    });
}
