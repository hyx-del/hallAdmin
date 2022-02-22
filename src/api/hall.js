/*
 * @Author: 郑晶
 * @Date: 2021-12-17 17:23:58
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-28 09:40:25
 * @Description:
 */
/*
 * 包含接口：新增数据(hallHallPost),修改数据(hallHallPut),删除数据(hallHallDelete),批量删除数据(hallBatchDelete),通过主键查询单条数据(hallDetail),分页查询(hallList),分页查询(hallListarea),状态 10：筹备中 20：运营 -20：暂停(hallStatusPut),
 */
// 场馆-Hall Controller
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增数据
export const hallHallPost = (data) => {
    return request({
        url: `/admin/hall/hall`,
        method: "POST",
        data,
    });
};

// 修改数据
export const hallHallPut = (data) => {
    return request({
        url: `/admin/hall/hall`,
        method: "PUT",
        data,
    });
};

// 删除数据
export const hallHallDelete = (data) => {
    return request({
        url: `/admin/hall/hall`,
        method: "DELETE",
        data,
    });
};

// 批量删除数据
export const hallBatchDelete = (data) => {
    return request({
        url: `/admin/hall/hall/batch`,
        method: "DELETE",
        data,
    });
};

// 通过主键查询单条数据
export const hallDetail = (data) => {
    return request({
        url: `/admin/hall/hall/detail`,
        method: "GET",
        data,
    });
};

// 分页查询
export const hallList = (data) => {
    return request({
        url: `/admin/hall/hall/list`,
        method: "GET",
        data,
    });
};

// 分页查询
export const hallListarea = (data) => {
    return request({
        url: `/admin/hall/hall/listarea`,
        method: "GET",
        data,
    });
};

// 状态 10：筹备中 20：运营 -20：暂停
export const hallStatusPut = (data) => {
    return request({
        url: `/admin/hall/hall/status`,
        method: "PUT",
        data,
    });
};
// 启用/禁用会馆会员
export const hallMemberStatusPut = (data) => {
    return request({
        url: `/admin/member/member/status`,
        method: "PUT",
        data,
    });
};
// 教练下拉
export const hallCoachList = (data) => {
    return request({
        url: `/admin/hall/initial/data/coach/group`,
        method: "GET",
        data,
    });
};
// 销售员下拉
export const hallSalesList = (data) => {
    return request({
        url: `/admin/staff/hall/sales/list`,
        method: "GET",
        data,
    });
};
// 会员课程卡
export const hallUserCourseList = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/list`,
        method: "GET",
        data,
    });
};
// 会员课程卡详情/操作
export const hallUserOperationList = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/detail-operate`,
        method: "GET",
        data,
    });
};
// 会员课程卡详情/销假
export const eliminateAPI = (data) => {
    return request({
        url: `/admin/hall/member-course-card-leave-orders/leave-off`,
        method: "post",
        data,
    });
};
// 会员课程卡详情/使用记录
export const usingRecordList = (data) => {
    return request({
        url: `/admin/hall/member-course-card-log/list`,
        method: "GET",
        data,
    });
};
// 会员详情-体测数据
export const hallIndicatorList = (data) => {
    return request({
        url: `/admin/hall/member/body/indicator/list`,
        method: "GET",
        data,
    });
};
// 会员详情-体测数据-表单模板
export const hallIndicatorForm = (data) => {
    return request({
        url: `/admin/hall/support/body/indicator/form`,
        method: "GET",
        data,
    });
};
// 会员详情-体测数据-增加
export const hallIndicatorAdd = (data) => {
    return request({
        url: `/admin/hall/member/body/indicator`,
        method: "POST",
        data,
    });
};
// 会员详情-课程卡
export const hallCourseCard = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/member/list`,
        method: "GET",
        data,
    });
};
// 会员详情-体测数据-单个详情
export const hallIndicatorDetails = (data) => {
    return request({
        url: `/admin/hall/member/body/indicator/detail`,
        method: "GET",
        data,
    });
};
// 课程卡-下拉
export const hallCourseCardBoxList = (data) => {
    return request({
        url: `/admin/hall/course-card/box-list`,
        method: "GET",
        data,
    });
};
// 会员详情-账户余额
export const hallBalanceList = (data) => {
    return request({
        url: `/admin/hall/member/account/log/list`,
        method: "GET",
        data,
    });
};
// 会员详情-跟进记录
export const hallMemberFollowLog = (data) => {
    return request({
        url: `/admin/hall/member/follow/log/list`,
        method: "GET",
        data,
    });
};
// 会员详情-添加跟进记录
export const addHallMemberFollowLog = (data) => {
    return request({
        url: `/admin/hall/member/follow/log`,
        method: "POST",
        data,
    });
};
// 会员详情-到访记录
export const hallMemberVisitLog = (data) => {
    return request({
        url: `/admin/hall/member/visit/log/list`,
        method: "GET",
        data,
    });
};
// 会员详情-账户余额-课程详情
export const hallCourseByOrder = (data) => {
    return request({
        url: `/admin/hall/course/by/order`,
        method: "GET",
        data,
    });
};
// 会员详情-到访记录-新增
export const addHallMemberVisitLog = (data) => {
    return request({
        url: `/admin/hall/member/visit/log`,
        method: "POST",
        data,
    });
};
// 会员详情-到访记录-修改
export const updateHallMemberVisitLog = (data) => {
    return request({
        url: `/admin/hall/member/visit/log/visited`,
        method: "PUT",
        data,
    });
};
// 会员详情-上课记录
export const hallMemberClassLog = (data) => {
    return request({
        url: `/admin/hall/member/attend-class/list`,
        method: "GET",
        data,
    });
};
// 会员详情-会籍更换记录
export const hallMemberSalesmanChangeLog = (data) => {
    return request({
        url: `/admin/hall/member/salesman/change/list`,
        method: "GET",
        data,
    });
};
// 新增会馆
export function addHall(data) {
    return request({
        url: "/admin/hall/hall",
        method: "post",
        data,
    });
}
// 会馆详情
export function hallDetails(data) {
    return request({
        url: "/admin/hall/hall/detail",
        method: "get",
        data,
    });
}
// 编辑会馆
export function updateHall(data) {
    return request({
        url: "/admin/hall/hall",
        method: "put",
        data,
    });
}
//
export function hallPushNodePoint(data) {
    return request({
        url: "/admin/hall/hall/push-node-point",
        method: "get",
        data,
    });
}
// 会馆列表
export function studentGraduationList(data) {
    return request({
        url: "/admin/hall/hall/list",
        method: "get",
        data,
    });
}
// 修改会馆状态
export function updateHallStatus(data) {
    return request({
        url: "/admin/hall/hall/status",
        method: "put",
        data,
    });
}
// 会员详情-充值
export function hallMemberAccountCharge(data) {
    return request({
        url: "/admin/hall/member/account/charge",
        method: "post",
        data,
    });
}

// 会员详情-会籍更改
export function membershipChangesAPI(data) {
    return request({
        url: "/admin/hall/member/salesman/change",
        method: "post",
        data,
    });
}
