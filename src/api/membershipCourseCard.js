/*
 * 包含接口：分页查询(memberCourseCardsList),课程卡详情(memberCourseCardsDetail),修改销售(memberChangeSale)
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 分页查询
export const memberCourseCardsList = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/list`,
        method: "get",
        data,
    });
};
//课程卡详情-基本信息
export const memberCourseCardsDetail = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/detail-base`,
        method: "get",
        data,
    });
};
//修改销售
export const memberChangeSale = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/sale-man-change-batch`,
        method: "post",
        data,
    });
};
//请假
export const memberCourseCardLeave = (data) => {
    return request({
        url: `/admin/hall/member-course-card-leave-orders/leave`,
        method: "post",
        data,
    });
};
//转换记录详情
export const conversionRecordDetails = (data) => {
    return request({
        url: `/admin/hall/member-course-card-transform-orders/detail`,
        method: "get",
        data,
    });
};
//新增转卡记录
export const AddConversionRecord = (data) => {
    return request({
        url: `/admin/hall/member-course-card-transform-orders`,
        method: "post",
        data:mixinMenu(data),
    });
};
//销假
export const memberCourseCardLeaveOff = (data) => {
    return request({
        url: `/admin/hall/member-course-card-leave-orders/leave-off`,
        method: "post",
        data,
    });
};
//新增剩余价值调整记录
export const addResidualValueAdjustmentRecord = (data) => {
    return request({
        url: `/admin/hall/member-course-card-surplus-value-adjust-log`,
        method: "post",
        data,
    });
};
//有效期调整

export const ValidityPeriodAdjustment = (data) => {
    return request({
        url: `/admin/hall/member-course-card-validate-adjust/adjust`,
        method: "post",
        data,
    });
};
//卡类下拉 member-course-cards/member-hall-box-list
export const CardCropCown = (data) => {
    return request({
        url: `/admin/hall/member-course-card-transform-orders/detail`,
        method: "get",
        data,
    });
};
//支付
export const transferCardPayment = (data) => {
    return request({
        url: `/admin/hall/member-course-card-transform-orders/pay`,
        method: "post",
        data,
    });
};
//课程卡余额调整
export const addBalanceAdjustment = (data) => {
    return request({
        url: `/admin/hall/member-course-card-adjust-orders/adjust`,
        method: "post",
        data,
    });
};
//课程卡余额调整详情
export const addBalanceAdjustmentDetails = (data) => {
    return request({
        url: `/admin/hall/member-course-card-adjust-orders/detail`,
        method: "get",
        data,
    });
};
//新增退卡
export const addCheckUpCard = (data) => {
    return request({
        url: `/admin/hall/member-course-card-refund-orders`,
        method: "post",
        data,
    });
};
//退卡详情
export const CheckUpCardDetails = (data) => {
    return request({
        url: `/admin/hall/member-course-card-refund-orders/detail`,
        method: "get",
        data,
    });
};
//退卡支付
export const payCheckUpCard = (data) => {
    return request({
        url: `/admin/hall/member-course-card-refund-orders/pay`,
        method: "post",
        data,
    });
};
//取消退卡
export const courseCardCancelRefund = (data) => {
    return request({
        url: `/admin/hall/member-course-card-refund-orders/status`,
        method: "put",
        data,
    });
};
//转卡取消  （改变状态）
export const cardTransferCancellation = (data) => {
    return request({
        url: `/admin/hall/member-course-card-transform-orders/status`,
        method: "put",
        data
    });
};
//剩余价值取消
export const cancellationResidualValue = (data) => {
    return request({
        url: `/admin/hall/member-course-card-surplus-value-adjust-log/status`,
        method: "put",
        data
    });
};
//课程卡使用记录 分页
export const courseCardUsageRecordList = (data) => {
    return request({
        url: `/admin/hall/member-course-card-log/list`,
        method: "get",
        data
    });
};
//课程卡转会记录
export const transferHistoryList = (data) => {
    return request({
        url: `/admin/hall/member-course-card-salesman-changes/list`,
        method: "get",
        data
    });
};
//会员分页查询
export const courseMemberPageList = (data) => {
    return request({
        url: `/admin/hall/member/list`,
        method: "get",
        data
    });
};
//课程卡绑定会员
export const courseCardBindMember = (data) => {
    return request({
        url: `/admin/hall/member-course-card-relation`,
        method: "post",
        data
    });
};
//次数分配
export const updateFrequencyAllocation = (data) => {
    return request({
        url: `/admin/hall/member-course-card-relation/set-allocations-times`,
        method: "put",
        data
    });
};
//设为主卡人
export const setAsPrimaryCardholder = (data) => {
    return request({
        url: `/admin/hall/member-course-card-relation/set-master`,
        method: "put",
        data
    });
};
//解除绑定
export const unbindCardholder = (data) => {
    return request({
        url: `/admin/hall/member-course-card-relation/unbind`,
        method: "put",
        data
    });
};
//联卡设置查询
export const couplingSettingsList = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/redeem-code-list`,
        method: "get",
        data
    });
};
//课程卡兑换码详情分页查询
export const redemptionCodeList = (data) => {
    return request({
        url: `/admin/member/coupon-redeem-code/redeem-code-detail-list-page`,
        method: "get",
        data
    });
};
//课程卡启用
export const courseCardEnabled = (data) => {
    return request({
        url: `/admin/hall/member-course-cards/enable`,
        method: "put",
        data
    });
};
//获取默认得课程卡规格
export const CourseCardSpecifications = (data) => {
    return request({
        url: `/admin/hall/course-card-specs/one`,
        method: "get",
        data
    });
};
//课程卡批量调整有效期
export const batchAdjustmentValidityPeriod = (data) => {
    return request({
        url: `/admin/hall/member-course-card-validate-adjust/adjust-batch`,
        method: "post",
        data
    });
};
//预览合同 /inner/get-signed-view-url

export const previewContract = (data) => {
    return request({
        url: `/admin/contract/get-signed-view-url`,
        method: "get",
        data
    });
};
