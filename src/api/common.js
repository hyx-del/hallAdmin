/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2022-01-18 16:30:11
 * @LastEditors: jiu yin zhen jing
 * @Description:瑜伽模块
 */
import request from "./request";
import { mixinMenu } from "@/api/menuTop";

let admin = "/admin/hall";

// 获取阿里oss 上传token
export function getAliOSSToken(data) {
    return request({
        url: `${admin}/open/file/oss/sts`,
        method: "post",
        data,
    });
}
// 当前用户 否有总部的权限和  对应哪些学校列表的权限

export function getPermissionOfSchoolQue(data) {
    return request({
        url: `/admin/school/staff/getSchool`,
        method: "get",
        data,
    });
}

// 获取拥有场馆的城市列表
export function getTopHeaderCityList(data) {
    return request({
        url: `/api/hall/open/index/get-cities`,
        method: "get",
        data,
    });
}

// 根据城市id 获取这个城市的场馆列表
export function headerHallListByCityId(data) {
    return request({
        url: `/api/hall/open/index/get-city-halls`,
        method: "get",
        data,
    });
}

// 根据城市id 获取这个城市的场馆列表
export function getAllCityAndHallList(data) {
    return request({
        url: `${admin}/hall/list-area`,
        method: "get",
        data,
    });
}

// 公共下拉接口 begin===============

/**
 * @name:salesList
 * @description: 销售员
 * @param {*} hallId 场馆id
 * @return {*}
 */
export const salesList = (data) => {
    return request({
        url: `/admin/staff/hall/sales/list`,
        method: "get",
        data,
    });
};

/**
 * @name:boxList
 * @description: 通过课程卡id查规格
 * @param {*} courseCardId 课程id必传
 * @return {*}
 */
export const boxList = (data) => {
    return request({
        url: `${admin}/course-card-specs/box-list`,
        method: "get",
        data,
    });
};

/**
 * @name:boxListType
 * @description: 通过课程卡id查规格类别
 * @param {*} courseCardId 课程id必传
 * @return {*}
 */
export const boxListType = (data) => {
    return request({
        url: `${admin}/course-card-spec-category/list`,
        method: "get",
        data,
    });
};

/**
 * @name:boxListAll
 * @description: 全查课程卡规格
 * @param {*} name 规格类别名称
 * @return {*}
 */
export const boxListAll = (data) => {
    return request({
        url: `${admin}/course-card-spec-category/box-list`,
        method: "get",
        data,
    });
};

// 优惠券 混和
export const couponListMixin = (data) => {
    return request({
        url: `/admin/number/coupon/list`,
        method: "get",
        data: mixinMenu(data),
    });
};

/**
 * @name:courseCard
 * @description: 全查课程卡
 * @param {*} hallId 门店id
 * @return {*}
 */
export const courseCard = (data) => {
    return request({
        url: `${admin}/course-card/box-list`,
        method: "get",
        data: mixinMenu(data),
    });
};

/**
 * @name:memberCoupon
 * @description: 会员优惠券
 * @param {*} hallId 门店id | memberId 会员id |
 *  useLimit 使用限制，1：团课 2：私教课 3：购卡 4： 教培学费 5：购买商品
 * @return {*}
 */
export const memberCoupon = (data) => {
    return request({
        url: `/admin/member/member-coupon/box-list`,
        method: "get",
        data,
    });
};

/**
 * @name:memberList
 * @description: 会员
 * @param {*} keyword 模糊查询 | size
 * @return {*}
 */
export const memberList = (data) => {
    return request({
        url: `/admin/member/member/options`,
        method: "get",
        data,
    });
};

/**
 * @name:payment
 * @description: 支付方式
 * @param {*} status ———0禁用 1启用
 * @return {*}
 */
export const payment = (data) => {
    return request({
        url: `${admin}/support/payment/mode/options`,
        method: "get",
        data,
    });
};

/**
 * @name:giftBoxListFn
 * @description: 赠品
 * @param
 */
export const giftBoxListFn = (data) => {
    return request({
        url: `${admin}/gift/box-list`,
        method: "get",
        data,
    });
};

/**
 * @name:memberCourse
 * @description: 会员的课程卡
 * @param * id(会员id)
 */
export const memberCourse = (data) => {
    return request({
        url: `${admin}/member-course-cards/member-box-list`,
        method: "get",
        data,
    });
};

// 获取城市列表  可以通过名字查询
export const getSelectCityListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/city`,
        method: "get",
        data,
    });
};

// 获取教室列表  场馆id hallId 必传 可以通过名字查询
export const getSelectClassroomListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/classroom`,
        method: "get",
        data: mixinMenu(data),
    });
};

/**
 * @name:  getSelectCoachListAPI
 * @description:  获取教练列表
 * @param {*}  cityId  城市id | hallId 场馆id | name  name
 * @return {*}
 */
export const getSelectCoachListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/coach`,
        method: "get",
        data: mixinMenu(data),
    });
};

/**
 * @name:  getSelectCoachAllListAPI
 * @description:  获取所有教练列表
 * @return {*}
 */
export const getSelectCoachAllListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/coach`,
        method: "get",
        data,
    });
};

/**
 * @name:  getSelectCoachGroupListAPI
 * @description:  获取教练分组下拉
 * @param {*}   name  name
 * @return {*}
 */
export const getSelectCoachGroupListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/coach/group`,
        method: "get",
        data: mixinMenu(data),
    });
};

/**
 * @name:  getSelectCourseListAPI
 * @description:  查询课程list
 * @param {*}   name  name  | type :1:团课 2:私教课 3:企业课
 * @return {*}
 */
export const getSelectCourseListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/course`,
        method: "get",
        data,
    });
};

/**
 * @name:  getSelectCourseLableListAPI
 * @description:  查询课程标签list
 * @param {*}   name  name
 * @return {*}
 */
export const getSelectCourseLableListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/course/lable`,
        method: "get",
        data,
    });
};

//
/**
 * @name:  getSelectHallListAPI
 * @description:  获取场馆list下拉
 * @param {*}   name  name
 * @return {*}
 */
export const getSelectHallListAPI = (data) => {
    return request({
        url: `/admin/hall/initial/data/hall`,
        method: "get",
        data: mixinMenu(data),
    });
};

// 所有会员下拉 keyword：关键词
export const memberOptions = (data) => {
    return request({
        url: `/admin/hall/initial/data/member/page`,
        method: 'GET',
        data
    });
};

// 排课--查询课程list（type: 1,只用于排课）
export const planCourse = (data) => {
    return request({
        url: `/admin/hall/initial/data/plan/course`,
        method: "GET",
        data,
    });
};

// 公共下拉接口  end================

// 门店列表
export const hallHallList = (data) => {
    return request({
        url: `/admin/hall/hall/hall-list`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 支付方式下拉
export const hallPaymentList = (data) => {
    return request({
        url: `/admin/hall/support/payment/mode/options?status=1`,
        method: "GET",
        data,
    });
};

//根据会员id获取会员在会馆的卡
export const membeCourseCards = (data) => {
    return request({
        url: `/admin/hall/initial/data/member/course/cards`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 下拉查询会员的可用课程卡
export const memberHallBoxList = data => {
    return request({
        url: `/admin/hall/member-course-cards/member-hall-box-list`,
        method: "GET",
        data,
    });
};
