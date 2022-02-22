/*
 * @Author: aa
 * @Date: 2021-08-26 15:29:14
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 14:01:36
 * @Descripttion:
 */
/**
 * @name:   动态权限路由菜单
 * @description:
 * @param {*}
 * @return {*}
 */
import Layout from "@/layout";
const dynamicRouters = [
    // 工作台列表
    {
        path: "/workbenchListm",
        name: "workbenchListm",
        redirect: "/workbenchListm",
        meta: {
            code: ["hl01"],
            title: "工作台列表",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "workbenchList",
                name: "workbenchListName",
                component: () => import("@/views/store/workbenchList/index"),
                meta: {
                    title: "工作台列表",
                    code: ["hl02"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "workbenchList/confirm",
                name: "workbenchListmconfirm",
                hidden: true,
                component: () => import("@/views/store/workbenchList/confirm"),
                meta: {
                    title: "上课确认",
                    code: ["hl03"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "workbenchList/edit",
                name: "workbenchListedit",
                hidden: true,
                component: () => import("@/views/store/workbenchList/edit"),
                meta: {
                    title: "课程编辑",
                    code: ["hl03"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "workbenchList/details",
                name: "workbenchListdetails",
                hidden: true,
                component: () => import("@/views/store/workbenchList/details"),
                meta: {
                    title: "课程详情",
                    code: ["hl03"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 营业分析
    {
        path: "/businessAnalysisz",
        name: "businessAnalysisz",
        redirect: "/businessAnalysisz/businessAnalysis",
        meta: {
            code: ["hl01"],
            title: "营业分析",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "businessAnalysis",
                name: "businessAnalysisName",
                component: () =>
                  import("@/views/headquarters/businessAnalysis/index"),
                meta: {
                    title: "会员消费统计",
                    code: ["hl02"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "businessAnalysis/sales",
                name: "businessAnalysisName/sales",
                component: () =>
                  import("@/views/headquarters/businessAnalysis/sales"),
                meta: {
                    title: "销售业绩统计",
                    code: ["hl02"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "businessAnalysis/shops",
                name: "businessAnalysisName/shops",
                component: () =>
                  import("@/views/headquarters/businessAnalysis/shops"),
                meta: {
                    title: "店长提成统计",
                    code: ["hl02"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // -------------------------- 会馆 ------------------------------
    // 会馆管理
    {
        path: "/hallManagementz",
        name: "hallManagementz",
        redirect: "/hallManagementz/hallManagement",
        meta: {
            code: ["h01"],
            title: "会馆管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "hallManagement",
                name: "hallManagementName",
                component: () =>
                    import("@/views/headquarters/hallManagement/index"),
                meta: {
                    title: "会馆管理",
                    code: ["h01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 会馆管理新增
            {
                path: "add",
                name: "hallManagementNameAdd",
                hidden: true,
                component: () =>
                    import("@/views/headquarters/hallManagement/add"),
                meta: {
                    title: "会馆管理新增",
                    code: ["h01"],
                },
            },
        ],
    },
    // 营业统计
    {
        path: "/businessStatisticsz",
        name: "businessStatisticsz",
        redirect: "/businessStatisticsz/businessStatistics",
        meta: {
            code: ["h01"],
            title: "营业统计",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "businessStatistics",
                name: "businessStatisticsName",
                component: () =>
                    import("@/views/headquarters/businessStatistics/index"),
                meta: {
                    title: "营业统计",
                    code: ["h01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 营业订单
    {
        path: "/businessOrderz",
        name: "businessOrderz",
        redirect: "/businessOrderz/businessOrder",
        meta: {
            code: ["h01"],
            title: "营业订单",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "businessOrder",
                name: "businessOrderName",
                component: () =>
                    import("@/views/headquarters/businessOrder/index"),
                meta: {
                    title: "营业订单",
                    code: ["h01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },

    // 会员管理
    {
        path: "/memberManagementz",
        name: "memberManagementz",
        redirect: "memberManagementz",
        meta: {
            code: ["h01"],
            title: "会员管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "memberManagements",
                name: "memberManagementsName",
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/memberManagements/index"
                    ),
                meta: {
                    title: "会员管理",
                    code: ["h02"],
                },
            },
            // 会馆管理新增
            {
                path: "add",
                name: "memberManagementsNameAdd",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/memberManagements/add"
                    ),
                meta: {
                    title: "会员管理新增",
                    code: ["h01"],
                },
            },
            // 会馆管理详情
            {
                path: "details",
                name: "memberManagementsNameDetails",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/memberManagements/details"
                    ),
                meta: {
                    title: "会员管理详情",
                    code: ["h01"],
                },
            },
            // 会员来源
            {
                path: "memberSource",
                name: "memberSourceName",
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/memberSource/index"
                    ),
                meta: {
                    title: "会员来源",
                    code: ["h02"],
                },
            },
            // 大众点评
            // {
            //     path: "publicComments",
            //     name: "publicCommentsName",
            //     component: () =>
            //         import(
            //             "@/views/headquarters/memberManagement/publicComments/index"
            //         ),
            //     meta: {
            //         title: "大众点评",
            //         code: ["h02"],
            //     },
            // },
            // 总部客服
            // {
            //     path: "headquartersCustomer",
            //     name: "headquartersCustomerName",
            //     component: () =>
            //         import(
            //             "@/views/headquarters/memberManagement/headquartersCustomer/index"
            //         ),
            //     meta: {
            //         title: "总部客服",
            //         code: ["h02"],
            //     },
            // },
            // 充值规格
            {
                path: "topUpSpecifications",
                name: "topUpSpecificationsName",
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/topUpSpecifications/index"
                    ),
                meta: {
                    title: "充值规格",
                    code: ["h02"],
                },
            },
            // 会员管理卡
            {
                path: "memberManagementCard",
                name: "memberManagementCardName",
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/memberManagementCard/index"
                    ),
                meta: {
                    title: "会员课程卡",
                    code: ["h02"],
                },
            },
            // 课程卡管理详情
            {
                path: "memberManagementCardDetail",
                name: "memberManagementCardDetail",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/memberManagement/memberManagementCard/detail/index"
                    ),
                meta: {
                    title: "会员课程卡详情",
                    code: ["h02"],
                },
            },
        ],
    },
    // 课程管理
    {
        path: "/courseManagementz",
        name: "courseManagementz",
        redirect: "/courseManagementz/courseManagement",
        meta: {
            code: ["h01"],
            title: "课程管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "courseManagement",
                name: "courseManagementName",
                component: () =>
                    import("@/views/headquarters/courseManagement/index"),
                meta: {
                    title: "课程管理",
                    code: ["h01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "courseManagement/detail",
                name: "courseManagementDetail",
                component: () =>
                    import("@/views/headquarters/courseManagement/detail"),
                meta: {
                    title: "课程管理",
                    code: ["h01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 课程卡管理
    {
        path: "/courseCardManagementz",
        name: "courseCardManagementz",
        redirect: "/courseCardManagementz/courseCardManagement",
        meta: {
            code: ["h01"],
            title: "课程卡管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "CourseCard",
                name: "CourseCardName",
                component: () =>
                    import(
                        "@/views/headquarters/courseCardManagement/CourseCard/index"
                    ),
                meta: {
                    title: "课程卡管理",
                    code: ["h02"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 课程卡管理新增/编辑
            {
                path: "add",
                name: "CourseCardAdd",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/courseCardManagement/CourseCard/add"
                    ),
                meta: {
                    title: "课程卡管理新增",
                    code: ["h01"],
                },
            },
            // 课程卡管理详情
            {
                path: "detail",
                name: "CourseCardDetail",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/courseCardManagement/CourseCard/detail/index"
                    ),
                meta: {
                    title: "课程卡管理详情",
                    code: ["h02"],
                },
            },
            // 合同管理
            {
                path: "ContractManagement",
                name: "ContractManagementName",
                component: () =>
                    import(
                        "@/views/headquarters/courseCardManagement/ContractManagement/index"
                    ),
                meta: {
                    title: "合同管理",
                    code: ["h02"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 合同管理新增/编辑
            {
                path: "ContractManagementAdd",
                name: "ContractManagementAdd",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/courseCardManagement/ContractManagement/add"
                    ),
                meta: {
                    title: "合同管理新增",
                    code: ["h01"],
                },
            },
            // 合同管理详情
            {
                path: "ContractManagementDetail",
                name: "ContractManagementDetail",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/courseCardManagement/ContractManagement/detail"
                    ),
                meta: {
                    title: "合同管理详情",
                    code: ["h02"],
                },
            },
        ],
    },
    // 教练管理
    {
        path: "/coachManagementz",
        name: "coachManagementz",
        redirect: "coachManagementz",
        meta: {
            code: ["h01"],
            title: "教练管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            // 教练列表
            {
                path: "coachList",
                name: "coachListName",
                component: () =>
                    import(
                        "@/views/headquarters/coachManagement/coachList/index"
                    ),
                meta: {
                    title: "教练列表",
                    code: ["h02"],
                },
            },
            // 教练详情
            {
                path: "detail",
                name: "coachDetailName",
                hidden: true,
                component: () =>
                    import(
                        "@/views/headquarters/coachManagement/coachList/detail/index"
                    ),
                meta: {
                    title: "教练详情",
                    code: ["h02"],
                },
            },
            // 课时限制设置
            {
                path: "classTimeLimit",
                name: "classTimeLimitName",
                component: () =>
                    import(
                        "@/views/headquarters/coachManagement/classTimeLimit/index"
                    ),
                meta: {
                    title: "课时限制设置",
                    code: ["h02"],
                },
            },
        ],
    },
    // 课表
    {
        path: "/schedulez",
        name: "schedulez",
        redirect: "/schedulez/schedule",
        meta: {
            code: ["h01"],
            title: "课表",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "schedule",
                name: "scheduleName",
                component: () => import("@/views/headquarters/schedule/index"),
                meta: {
                    title: "课表",
                    code: ["h01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 辅助资料
    {
        path: "/secondaryDataz",
        name: "secondaryDataz",
        redirect: "secondaryDataz",
        meta: {
            code: ["h01"],
            title: "辅助资料",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            // 教练组
            {
                path: "coachingStaff",
                name: "coachingStaffName",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/coachingStaff/index"
                    ),
                meta: {
                    title: "教练组",
                    code: ["h02"],
                },
            },
            // 体测项目
            {
                path: "sideProject",
                name: "sideProjectName",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/sideProject/index"
                    ),
                meta: {
                    title: "体测项目",
                    code: ["h02"],
                },
            },
            // 支付方式
            {
                path: "payManner",
                name: "payMannerName",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/payManner/index"
                    ),
                meta: {
                    title: "支付方式",
                    code: ["h02"],
                },
            },
            // 课程标签管理
            {
                path: "courseLabelManagement",
                name: "courseLabelManagementName",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/courseLabelManagement/index"
                    ),
                meta: {
                    title: "课程标签管理",
                    code: ["h02"],
                },
            },
            // 评价标签
            {
                path: "evaluationLabel",
                name: "evaluationLabelName",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/evaluationLabel/index"
                    ),
                meta: {
                    title: "评价标签",
                    code: ["h02"],
                },
            },
            // 规格类别
            {
                path: "specificationsCategories",
                name: "specificationsCategoriesName",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/specificationsCategories/index"
                    ),
                meta: {
                    title: "规格类别",
                    code: ["h02"],
                },
            },
             // 规格类别
             {
                path: "gift",
                name: "gift",
                component: () =>
                    import(
                        "@/views/headquarters/secondaryData/gift/index"
                    ),
                meta: {
                    title: "赠品",
                    code: ["h02"],
                },
            },
        ],
    },
    // -------------------------- 员工 ------------------------------
    // 员工管理
    {
        path: "/employeesy",
        name: "employeesy",
        redirect: "employeesy",
        meta: {
            code: ["s01", "c01", "hl01"],
            title: "员工管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "staffManagement",
                name: "staffManagementName",
                component: () =>
                    import("@/views/employees/staffManagement/index"),
                meta: {
                    title: "员工管理",
                    code: ["s02", "c02", "hl02"],
                },
            },
            {
                path: "staffManagement/add",
                name: "staffManagementName/add",
                hidden: true,
                component: () =>
                    import("@/views/employees/staffManagement/add"),
                meta: {
                    title: "新加",
                    code: ["s02", "c02", "hl02"],
                },
            },
            {
                path: "staffManagement/detail",
                name: "staffManagementName/detail",
                hidden: true,
                component: () =>
                    import("@/views/employees/staffManagement/detail"),
                meta: {
                    title: "详情",
                    code: ["s02", "c02", "hl02"],
                },
            },
            {
                path: "managementRole",
                name: "managementRoleName",
                component: () =>
                    import("@/views/employees/managementRole/index"),
                meta: {
                    title: "角色管理",
                    code: ["s02", "c02", "hl02"],
                },
            },
        ],
    },
    // -------------------------- 会员 ------------------------------
    // 会员管理
    {
        path: "/membersViph",
        name: "membersViph",
        redirect: "/membersViph/membersVip",
        meta: {
            code: ["m01"],
            title: "会员管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            // 会员管理
            {
                path: "membersVip",
                name: "membersVipName",
                component: () => import("@/views/member/membersVip/index"),
                meta: {
                    title: "会员管理",
                    code: ["m01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 编辑/详情
            {
                path: "operation",
                name: "operation",
                hidden: true,
                component: () => import("@/views/member/membersVip/operation"),
                meta: {
                    title: "会员管理操作",
                    code: ["h01"],
                },
            },
        ],
    },
    // 优惠券管理
    {
        path: "/couponManagementh",
        name: "couponManagementh",
        redirect: "/couponManagementh/couponManagement",
        meta: {
            code: ["m01"],
            title: "优惠券管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "couponManagement",
                name: "couponManagementName",
                component: () =>
                    import("@/views/member/couponManagement/index"),
                meta: {
                    title: "优惠券管理",
                    code: ["m01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 新增优惠券
            {
                path: "add",
                name: "couponManagementNameAdd",
                hidden: true,
                component: () => import("@/views/member/couponManagement/add"),
                meta: {
                    title: "优惠券管理新增",
                    code: ["h01"],
                },
            },
        ],
    },
    // 会员优惠券
    {
        path: "/membershipCouponh",
        name: "membershipCouponh",
        redirect: "/membershipCouponh/membershipCoupon",
        meta: {
            code: ["m01"],
            title: "会员优惠券",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "membershipCoupon",
                name: "membershipCouponName",
                component: () =>
                    import("@/views/member/membershipCoupon/index"),
                meta: {
                    title: "会员优惠券",
                    code: ["m01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // -------------------------- 城市 ------------------------------
    // 课表
    {
        path: "/citySchedulec",
        name: "citySchedulec",
        redirect: "/citySchedulec/citySchedule",
        meta: {
            code: ["c01"],
            title: "课表",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "citySchedule",
                name: "cityScheduleName",
                component: () => import("@/views/city/citySchedule/index"),
                meta: {
                    title: "课表",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 课程结算设置
    {
        path: "/courseSettlementSetupc",
        name: "courseSettlementSetupc",
        redirect: "/courseSettlementSetupc/courseSettlementSetup",
        meta: {
            code: ["c01"],
            title: "课程结算设置",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "courseSettlementSetup",
                name: "courseSettlementSetupName",
                component: () =>
                    import("@/views/city/courseSettlementSetup/index"),
                meta: {
                    title: "课程结算设置",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 开卡申请订单
    {
        path: "/activateCardApplyc",
        name: "activateCardApplyc",
        redirect: "/activateCardApplyc/activateCardApply",
        meta: {
            code: ["c01"],
            title: "开卡申请订单",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "activateCardApply",
                name: "activateCardApplyName",
                component: () => import("@/views/city/activateCardApply/index"),
                meta: {
                    title: "开卡申请订单",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "activateCardApplyDetail",
                name: "activateCardApplyDetail",
                component: () =>
                    import("@/views/city/activateCardApply/detail"),
                hidden: true,
                meta: {
                    title: "开卡申请订单详情",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 转卡申请
    {
        path: "/transferCardApplyc",
        name: "transferCardApplyc",
        redirect: "/transferCardApplyc/transferCardApply",
        meta: {
            code: ["c01"],
            title: "转卡申请",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "transferCardApply",
                name: "transferCardApplyName",
                component: () => import("@/views/city/transferCardApply/index"),
                meta: {
                    title: "转卡申请",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "transferCardApplyDetail",
                name: "transferCardApplyDetail",
                component: () =>
                    import("@/views/city/transferCardApply/detail"),
                hidden: true,
                meta: {
                    title: "转卡申请订单详情",
                    code: ["s01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 退卡申请
    {
        path: "/returnCardApplpc",
        name: "returnCardApplpc",
        redirect: "/returnCardApplpc/returnCardApplp",
        meta: {
            code: ["c01"],
            title: "退卡申请",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "returnCardApplp",
                name: "returnCardApplpName",
                component: () => import("@/views/city/returnCardApplp/index"),
                meta: {
                    title: "退卡申请",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "returnCardApplpDetail",
                name: "returnCardApplpDetail",
                component: () => import("@/views/city/returnCardApplp/detail"),
                hidden: true,
                meta: {
                    title: "退卡详情",
                    code: ["s01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 剩余价值调整申请
    {
        path: "/adjustmentSurplusValuec",
        name: "adjustmentSurplusValuec",
        redirect: "/adjustmentSurplusValuec/adjustmentSurplusValue",
        meta: {
            code: ["c01"],
            title: "剩余价值调整申请",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "adjustmentSurplusValue",
                name: "adjustmentSurplusValueName",
                component: () =>
                    import("@/views/city/adjustmentSurplusValue/index"),
                meta: {
                    title: "剩余价值调整申请",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 教练管理
    {
        path: "/cityCoachManagementc",
        name: "cityCoachManagementc",
        redirect: "/cityCoachManagementc/cityCoachManagement",
        meta: {
            code: ["c01"],
            title: "教练管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "cityCoachManagement",
                name: "cityCoachManagementName",
                component: () =>
                    import("@/views/city/cityCoachManagement/index"),
                meta: {
                    title: "教练管理",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 教练详情
            {
                path: "detail",
                name: "cityCoachDetailName",
                hidden: true,
                component: () =>
                    import("@/views/city/cityCoachManagement/detail/index"),
                meta: {
                    title: "教练详情",
                    code: ["c01"],
                },
            },
        ],
    },
    // 上课评价
    {
        path: "/classEvaluationc",
        name: "classEvaluationc",
        redirect: "/classEvaluationc/classEvaluation",
        meta: {
            code: ["c01"],
            title: "上课评价",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "classEvaluation",
                name: "classEvaluationName",
                component: () => import("@/views/city/classEvaluation/index"),
                meta: {
                    title: "上课评价",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "classEvaluation/details",
                name: "classEvaluationDetails",
                component: () => import("@/views/city/classEvaluation/detail"),
                hidden: true,
                meta: {
                    title: "上课评价回复",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 营业统计
    {
        path: "/cityBusinessStatisticsc",
        name: "cityBusinessStatisticsc",
        redirect: "/cityBusinessStatisticsc/cityBusinessStatistics",
        meta: {
            code: ["c01"],
            title: "营业统计",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "cityBusinessStatistics",
                name: "cityBusinessStatisticsName",
                component: () =>
                    import("@/views/city/cityBusinessStatistics/index"),
                meta: {
                    title: "营业统计",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 营业分析
    {
        path: "/cityBusinessAnalysisc",
        name: "cityBusinessAnalysisc",
        redirect: "/cityBusinessAnalysisc/cityBusinessAnalysis",
        meta: {
            code: ["c01"],
            title: "营业分析",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "cityBusinessAnalysis",
                name: "cityBusinessAnalysisName",
                component: () =>
                    import("@/views/city/cityBusinessAnalysis/index"),
                meta: {
                    title: "营业分析",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 教练统计
    {
        path: "/coachStatisticsc",
        name: "coachStatisticsc",
        redirect: "coachStatisticsc",
        meta: {
            code: ["c01"],
            title: "教练统计",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            // 教练评分统计
            {
                path: "coachScoreStatistics",
                name: "coachScoreStatisticsName",
                component: () =>
                    import(
                        "@/views/city/coachStatistics/coachScoreStatistics/index"
                    ),
                meta: {
                    title: "教练评分统计",
                    code: ["c02"],
                },
            },
            // 课时费统计
            {
                path: "classFeeStatistics",
                name: "classFeeStatisticsName",
                component: () =>
                    import(
                        "@/views/city/coachStatistics/classFeeStatistics/index"
                    ),
                meta: {
                    title: "课时费统计",
                    code: ["c02"],
                },
            },
        ],
    },
    // // 财务管理
    // {
    //     path: "/financialManagementc",
    //     name: "financialManagementc",
    //     redirect: "financialManagementc",
    //     meta: {
    //         code: ["c01"],
    //         title: "财务管理",
    //         icon: "iconfont icon-a-ziyuan3",
    //     },
    //     component: Layout,
    //     children: [
    //         // 员工档案
    //         {
    //             path: "employeeFile",
    //             name: "employeeFileName",
    //             component: () =>
    //                 import(
    //                     "@/views/city/financialManagement/employeeFile/index"
    //                 ),
    //             meta: {
    //                 title: "员工档案",
    //                 code: ["c02"],
    //             },
    //         },
    //         // 工资条
    //         {
    //             path: "paySlip",
    //             name: "paySlipName",
    //             component: () =>
    //                 import("@/views/city/financialManagement/paySlip/index"),
    //             meta: {
    //                 title: "工资条",
    //                 code: ["c02"],
    //             },
    //         },
    //     ],
    // },
    // -------------------------- 门店 ------------------------------

    // 排课
    {
        path: "/workOutATeachingSchedulem",
        name: "workOutATeachingSchedulem",
        redirect: "/workOutATeachingSchedulem/workOutATeachingSchedule",
        meta: {
            code: ["hl01"],
            title: "排课",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "workOutATeachingSchedule",
                name: "workOutATeachingScheduleName",
                component: () =>
                    import("@/views/store/workOutATeachingSchedule/index"),
                meta: {
                    title: "排课",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "workOutATeachingSchedule/addGroup",
                name: "workOutATeachingScheduleName/addGroup",
                hidden: true,
                component: () =>
                    import("@/views/store/workOutATeachingSchedule/addGroup"),
                meta: {
                    title: "新加团课程",
                    code: ["hl01"],
                },
            },
            {
                path: "workOutATeachingSchedule/editGroup",
                name: "workOutATeachingScheduleName/editGroup",
                hidden: true,
                component: () =>
                    import("@/views/store/workOutATeachingSchedule/editGroup"),
                meta: {
                    title: "编辑团课程",
                    code: ["hl01"],
                },
            },
            {
                path: "workOutATeachingSchedule/addPrivate",
                name: "workOutATeachingScheduleName/addPrivate",
                hidden: true,
                component: () =>
                    import("@/views/store/workOutATeachingSchedule/addPrivate"),
                meta: {
                    title: "新加私人课程",
                    code: ["hl01"],
                },
            },
            {
                path: "workOutATeachingSchedule/addEnterprise",
                name: "workOutATeachingScheduleName/addEnterprise",
                hidden: true,
                component: () =>
                    import(
                        "@/views/store/workOutATeachingSchedule/addEnterprise"
                    ),
                meta: {
                    title: "新加企业课程",
                    code: ["hl01"],
                },
            },
        ],
    },
    // 营业统计
    {
        path: "/storeBusinessStatisticsm",
        name: "storeBusinessStatisticsm",
        redirect: "/storeBusinessStatisticsm/storeBusinessStatistics",
        meta: {
            code: ["hl01"],
            title: "营业统计",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "storeBusinessStatistics",
                name: "storeBusinessStatisticsName",
                component: () =>
                    import("@/views/store/storeBusinessStatistics/index"),
                meta: {
                    title: "营业统计",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 营业订单
    {
        path: "/storeBusinessOrderm",
        name: "storeBusinessOrderm",
        redirect: "/storeBusinessOrderm/storeBusinessOrder",
        meta: {
            code: ["hl01"],
            title: "营业订单",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "storeBusinessOrder",
                name: "storeBusinessOrderName",
                component: () =>
                    import("@/views/store/storeBusinessOrder/index"),
                meta: {
                    title: "营业订单",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 会员管理
    {
        path: "/storeMemberManagementm",
        name: "storeMemberManagementm",
        redirect: "/storeMemberManagementm/storeMemberManagement",
        meta: {
            code: ["hl01"],
            title: "会员管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "storeMemberManagement",
                name: "storeMemberManagementName",
                component: () =>
                    import("@/views/store/storeMemberManagement/index"),
                meta: {
                    title: "会员管理",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "details",
                name: "storeAccountDetails",
                component: () =>
                    import("@/views/store/storeMemberManagement/details"),
                meta: {
                    title: "会员详情",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 会员课程卡
    {
        path: "/membershipCourseCardm",
        name: "membershipCourseCardm",
        redirect: "/membershipCourseCardm/membershipCourseCard",
        meta: {
            code: ["hl01"],
            title: "会员课程卡",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "membershipCourseCard",
                name: "membershipCourseCardName",
                component: () =>
                    import("@/views/store/membershipCourseCard/index"),
                meta: {
                    title: "会员课程卡",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            // 会员课程卡详情
            {
                path: "details",
                name: "membershipCourseCardNameDetails",
                hidden: true,
                component: () =>
                    import("@/views/store/membershipCourseCard/detail"),
                meta: {
                    title: "会员课程卡详情",
                    code: ["h01"],
                },
            },
            // 会员课程卡转卡
            {
                path: "transferCard",
                name: "transferCard",
                hidden: true,
                component: () =>
                    import("@/views/store/membershipCourseCard/transferCard"),
                meta: {
                    title: "转卡",
                    code: ["h01"],
                },
            },
            // 余额调整
            {
                path: "balanceAdjustment",
                name: "balanceAdjustment",
                hidden: true,
                component: () =>
                    import("@/views/store/membershipCourseCard/balance"),
                meta: {
                    title: "余额调整",
                    code: ["h01"],
                },
            },
            // 退卡
            {
                path: "checkCard",
                name: "checkCard",
                hidden: true,
                component: () =>
                    import("@/views/store/membershipCourseCard/checkUp"),
                meta: {
                    title: "退卡",
                    code: ["h01"],
                },
            },
        ],
    },
    // 开卡订单
    {
        path: "/cardOpeningOrderm",
        name: "cardOpeningOrderm",
        redirect: "/cardOpeningOrderm/cardOpeningOrder",
        meta: {
            code: ["hl01"],
            title: "开卡订单",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "cardOpeningOrder",
                name: "cardOpeningOrderName",
                component: () => import("@/views/store/cardOpeningOrder/index"),
                meta: {
                    title: "开卡订单",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "cardOpeningOrderAdd",
                name: "cardOpeningOrderAdd",
                component: () => import("@/views/store/cardOpeningOrder/add"),
                meta: {
                    title: "添加开卡",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "cardOpeningOrderDetail",
                name: "cardOpeningOrderDetail",
                component: () =>
                    import("@/views/store/cardOpeningOrder/detail"),
                meta: {
                    title: "开卡详情",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "cardOpeningOrderEdit",
                name: "cardOpeningOrderEdit",
                component: () => import("@/views/store/cardOpeningOrder/edit"),
                meta: {
                    title: "开卡编辑",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 上课评价
    {
        path: "/storeClassEvaluationm",
        name: "storeClassEvaluationm",
        redirect: "/storeClassEvaluationm/storeClassEvaluation",
        meta: {
            code: ["hl01"],
            title: "上课评价",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "storeClassEvaluation",
                name: "storeClassEvaluationName",
                component: () =>
                    import("@/views/store/storeClassEvaluation/index"),
                meta: {
                    title: "上课评价",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "storeClassEvaluation/details",
                name: "storeClassEvaluationDetails",
                component: () =>
                    import("@/views/store/storeClassEvaluation/detail"),
                hidden: true,
                meta: {
                    title: "上课评价回复",
                    code: ["hl03"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 投诉建议
    {
        path: "/suggestions",
        name: "suggestions",
        redirect: "/suggestions/suggestions",
        meta: {
            code: ["hl01"],
            title: "投诉建议",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "suggestions",
                name: "suggestions",
                component: () => import("@/views/store/suggestions/index"),
                meta: {
                    title: "投诉建议",
                    code: ["hl01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
            {
                path: "details",
                name: "suggestionsDetails",
                component: () => import("@/views/store/suggestions/reply"),
                hidden: true,
                meta: {
                    title: "建议回复",
                    code: ["c01"],
                    icon: "iconfont icon-icon-banji",
                },
            },
        ],
    },
    // 会馆管理
    {
        path: "/guildHallManagementm",
        name: "guildHallManagementm",
        redirect: "guildHallManagementm",
        meta: {
            code: ["hl01"],
            title: "会馆管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            // 教练
            {
                path: "storeCoach",
                name: "storeCoachName",
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/storeCoach/index"
                    ),
                meta: {
                    title: "教练",
                    code: ["hl02"],
                },
            },
            // 教练详情
            {
                path: "detail",
                name: "detailName",
                hidden: true,
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/storeCoach/detail/index"
                    ),
                meta: {
                    title: "教练详情",
                    code: ["hl02"],
                },
            },
            // 课程
            {
                path: "storeCurriculum",
                name: "storeCurriculumName",
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/storeCurriculum/index"
                    ),
                meta: {
                    title: "课程",
                    code: ["hl02"],
                },
            },
            {
                path: "storeCurriculumDetail",
                name: "storeCurriculumDetail",
                hidden: true,
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/storeCurriculum/detail"
                    ),
                meta: {
                    title: "课程详情",
                    code: ["hl02"],
                },
            },
            // 课程卡
            {
                path: "storeCourseCard",
                name: "storeCourseCardName",
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/storeCourseCard/index"
                    ),
                meta: {
                    title: "课程卡",
                    code: ["hl02"],
                },
            },
            {
                path: "storeCourseCardDetail",
                name: "storeCourseCardDetail",
                hidden: true,
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/storeCourseCard/detail"
                    ),
                meta: {
                    title: "课程卡详情",
                    code: ["hl02"],
                },
            },
            // 场馆信息
            {
                path: "venueInformation",
                name: "venueInformationName",
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/venueInformation/index"
                    ),
                meta: {
                    title: "场馆信息",
                    code: ["hl02"],
                },
            },
            // 教室管理
            {
                path: "classroomManagement",
                name: "classroomManagementName",
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/classroomManagement/index"
                    ),
                meta: {
                    title: "教室管理",
                    code: ["hl02"],
                },
            },
            // 营业数据上传
            {
                path: "businessDataUpload",
                name: "businessDataUploadName",
                component: () =>
                    import(
                        "@/views/store/guildHallManagement/businessDataUpload/index"
                    ),
                meta: {
                    title: "营业数据上传",
                    code: ["hl02"],
                },
            },
        ],
    },
    // 预售管理
    {
        path: "/presale",
        name: "presale",
        redirect: "presale",
        meta: {
            code: ["hl01"],
            title: "预售管理",
            icon: "iconfont icon-a-ziyuan3",
        },
        component: Layout,
        children: [
            {
                path: "index",
                name: "presaleName",
                component: () => import("@/views/presale/index"),
                meta: {
                    title: "活动",
                    code: ["hl02"],
                },
            },
            // 活动添加
            {
                path: "add",
                name: "presaleAdd",
                hidden: true,
                component: () => import("@/views/presale/add"),
                meta: {
                    title: "活动添加",
                    code: ["hl02"],
                },
            },
            // 活动添加
            {
                path: "detail",
                name: "detail",
                hidden: true,
                component: () => import("@/views/presale/detail"),
                meta: {
                    title: "活动详情",
                    code: ["hl02"],
                },
            },
            {
                path: "order",
                name: "presaleOrder",
                component: () => import("@/views/presale/order"),
                meta: {
                    title: "订单",
                    code: ["hl02"],
                },
            },
        ],
    },
];

export default dynamicRouters;
