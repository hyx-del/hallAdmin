/*
 * @Author: zx
 * @Date: 2021-09-01 15:51:58
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-25 13:50:31
 * @Descripttion:
 */
import store from "@/store";

const blue = "#2e8de6";
const red = "#f00";

// 数组转换成对象
const listToObj = (list, key = "value") => {
    let obj = {};
    list.forEach((item) => {
        obj[item[key]] = {
            ...item,
        };
    });
    return obj;
};

/**
 * @name:
 * @description:  传入下面的list，返回结果，建议list很少时使用
 * @param {*}
 * @return {*}
 */
export const getListObj = (list, value, key) => {
    let backArr = list.filter((item) => item.value == value);
    if (backArr.length > 0) {
        return key ? backArr[0][key] : { value: "", label: "" };
    } else {
        return key ? "" : { value: "", label: "" };
    }
};
/**
 * @name:
 * @description: 传入下面的list，返回结果，建议list很少时使用
 * @param {*}
 * @return {*}
 */

export const getListHtml = (list, value = "", color = "#333") => {
    value += "";
    if (value == "" || value == null || value == undefined) return "";
    let midArr = value.split(",");
    if (midArr.length > 1) {
        let mid = midArr
            .map((item) => getListObj(list, item, "label"))
            .join(",");
        return `<span style="color:${
            getListObj(list, midArr[0], "color") || color
        } ">${mid}</span>`;
    } else {
        return `<span style="color:${
            getListObj(list, value, "color") || color
        } ">${getListObj(list, value, "label") || "-"}</span>`;
    }
};

/**
 * @name:
 * @description: 是否存在某个状态
 * @param {*}
 * @return {*}
 */
export const hasStatus = (list, arr) => {
    return list.some((v) => arr.includes(v.value + ""));
};
// 布尔值
export const booleans = [
    { value: true, label: "是" },
    { value: false, label: "否" },
];

// 是否
export const isNot = [
    { value: "0", label: "否" },
    { value: "1", label: "是" },
];

// 测试数据
export const testList = [
    { value: "1", label: "测试1" },
    { value: "2", label: "测试2" },
    { value: "3", label: "测试3" },
];

// 课程类型 1:团课 2:私教课 3:企业课
export const courseTypeList = [
    { value: "1", label: "团课" },
    { value: "2", label: "私教课" },
    { value: "3", label: "企业课" },
];

// 是否显示 1显示 0不显示
export const displayList = [
    { value: "0", label: "不显示" },
    { value: "1", label: "显示" },
];

// 学期类别
export const categoryList = [
    { value: "1", label: "常规任务" },
    { value: "2", label: "工作坊" },
    { value: "3", label: "名师培训" },
];
// 学期类别
export const categoryList2 = [
    { value: "1", label: "常规课程" },
    { value: "2", label: "工作坊" },
    { value: "3", label: "名师培训" },
];
// 报名方式
export const signUpList = [
    { value: "1", label: "全款" },
    { value: "2", label: "定金" },
];
export const signUpObj = listToObj(signUpList);

// 状态1
export const stateList = [
    { value: "10", label: "筹备中" },
    { value: "20", label: "运营中" },
    { value: "-20", label: "暂停中" },
];

// 课程状态
export const courseStateList = [
    { value: "1", label: "正常" },
    { value: "-1", label: "禁用" },
];

// 课程状态
export const examineList = [
    { value: "1", label: "考核" },
    { value: "0", label: "不考核" },
];

// 状态 上下线
export const onlineList = [
    { value: "1", label: "上线" },
    { value: "-1", label: "下线", color: red },
    { value: "0", label: "未发布", color: blue },
    // { value: "", label: "未上线", color: blue }
];
export const onlineObj = listToObj(onlineList);

// 状态
export const enableList = [
    { value: "1", label: "正常" },
    { value: "0", label: "禁用", color: red },
];
// enableDisable 1启用，0禁用
export const enableDisable = [
    { value: "1", label: "启用" },
    { value: "0", label: "禁用", color: red },
];
export const enableStatus = listToObj(enableDisable);

// courseDisable 1启用，2禁用
export const courseDisable = [
    { value: "1", label: "启用" },
    { value: "2", label: "禁用", color: red },
];
export const courseStatus = listToObj(courseDisable);

// 员工状态
export const staffEnableList = [
    { value: "1", label: "正常" },
    { value: "0", label: "禁用", color: red },
];
export const staffEnableStatus = listToObj(enableList);
// 员工状态
export const staffEnableList2 = [
    { value: "1", label: "正常" },
    { value: "-1", label: "禁用", color: red },
];

// 学员状态
export const studentStatusList = [
    {
        value: 10,
        label: "潜在学员",
    },
    {
        value: 20,
        label: "正式学员",
    },
    {
        value: 30,
        label: "毕业学员",
    },
];

export const studentStatus = listToObj(studentStatusList);

// 性别
export const genderList = [
    { value: "1", label: "男" },
    { value: "2", label: "女" },
];

export const showGender = listToObj(genderList);

// 是否提供住宿
export const ContainList = [
    { value: "0", label: "不提供" },
    { value: "1", label: "提供" },
];

export const Contain = listToObj(ContainList);

// 是否供餐:1供餐 -1不供餐
export const mealStatusList = [
    { value: "-1", label: "不提供" },
    { value: "1", label: "提供" },
];

export const mealStatus = listToObj(mealStatusList);

// 报名方式:10定金 20全款
export const registerModeList = [
    { value: "10", label: "定金" },
    { value: "20", label: "全款" },
];
// 报名方式:10 实付 20转结
export const payModeList = [
    { value: "10", label: "实付" },
    { value: "20", label: "转结" },
];
// 支付方式: 1线上支付，2线下支付
export const payOnlineList = [
    { value: "1", label: "线上支付" },
    { value: "2", label: "线下支付" },
];

// 支付方式2: 1 线下支付，2 线上支付
export const payOnlineList2 = [
    { value: "10", label: "单一支付" },
    { value: "20", label: "组合支付" },
];

// 费用类型
export const costType = [
    { value: "10", label: "定金" },
    { value: "20", label: "学费" },
    { value: "30", label: "住宿费" },
    { value: "40", label: "押金" },
    { value: "50", label: "餐费" },
];
export const costTypeObj = listToObj(costType);

export const registerMode = listToObj(registerModeList);

// // 岗位状态
export const jobsStateList = [
    { value: "0", label: "岗位状态" },
    { value: "1", label: "正式员工" },
];

export const jobsState = listToObj(jobsStateList);

// // 员工岗位状态
export const staffStateList = [
    { value: "1", label: "试用期" },
    { value: "2", label: "正式员工" },
];

export const staffState = listToObj(staffStateList);

// 注册等级 0 无 、10普通、20高级
export const degreesList = [
    {
        value: 0,
        label: "无",
    },
    {
        value: 10,
        label: "普通",
    },
    {
        value: 20,
        label: "高级",
    },
];

export const degrees = listToObj(degreesList);
//  练习基础
export const practiceBaseList = [
    {
        value: "1",
        label: "从事瑜伽行业",
    },
    {
        value: "2",
        label: "自我提升、精进",
    },
    {
        value: "3",
        label: "休闲度假、放松解压",
    },
    {
        value: "4",
        label: "其他",
    },
];
export const practiceBase = listToObj(practiceBaseList);
//  学习意向
export const studyIntentionList = [
    {
        value: "1",
        label: "很强",
    },
    {
        value: "2",
        label: "中等",
    },
    {
        value: "3",
        label: "一般",
    },
    {
        value: "4",
        label: "弱",
    },
    {
        value: "5",
        label: "暂无",
    },
];
export const studyIntention = listToObj(studyIntentionList);

// 职能
export const funList = [
    {
        value: "1",
        label: "管理员",
    },
    {
        value: "2",
        label: "教练",
    },
    {
        value: "4",
        label: "销售员",
    },
    {
        value: "8",
        label: "教培教练",
    },
    {
        value: "16",
        label: "店长",
    },
];

// 角色状态
export const roleStatusList = [
    {
        value: "2",
        label: "基础",
    },
    {
        value: "8",
        label: "可读",
    },
    {
        value: "16",
        label: "可写",
    },
    {
        value: "32",
        label: "可继承",
    },
];

// 报到状态 报到状态 10未报到 20已报到 30延期 40已结业 50 取消 60 转校审核[取消] 70 转校审核完
export const reportStatusList = [
    {
        value: "10",
        label: "未报到",
    },
    {
        value: "20",
        label: "已报到",
    },
    {
        value: "30",
        label: "延期",
    },
    {
        value: "40",
        label: "已结业",
    },
    {
        value: "50",
        label: "取消",
    },
    // {
    //   value: "60",
    //   label: "转校审核[取消] "
    // },
    {
        value: "70",
        label: "转校成功",
    },
];
// 下单类型
export const orderChannel = [
    { value: 10, label: "后台" },
    { value: 20, label: "小程序" },
    { value: 30, label: "公众号" },
];

// 下单类型
export const orderType = [
    { value: 10, label: "支付" },
    { value: -10, label: "退款", color: red },
];

export const orderStatus = [
    { value: 0, label: "待付款" },
    { value: 10, label: "已完成" },
    { value: -10, label: "已取消", color: red },
    { value: 8, label: "支付中" },
];

export const payChannel = () => store.getters.payChannel;

export const reportStatus = listToObj(funList);

// ：0未审核、1已审核、-1已取消
export const statusList = [
    {
        value: "1",
        label: "已审核",
    },
    {
        value: "0",
        label: "未审核",
        color: red,
    },
    {
        value: "-1",
        label: "已取消",
    },
];
export const auditStatus = listToObj(funList);

// 排课方式
export const arrangingList = [
    {
        value: "1",
        label: "单日",
    },
    {
        value: "2",
        label: "周期",
    },
];
export const arrangingStatus = listToObj(arrangingList);

// 课表类型 1：团课 2：企业团课 3：私教课 4：小班
export const coursePlanList = [
    {
        value: "1",
        label: "团课",
    },
    {
        value: "2",
        label: "企业团课",
    },
    {
        value: "3",
        label: "私教课",
    },
    {
        value: "4",
        label: "小班",
    },
];

export const weekList = [
    {
        value: "1",
        label: "星期日",
    },
    {
        value: "2",
        label: "星期一",
    },
    {
        value: "3",
        label: "星期二",
    },
    {
        value: "4",
        label: "星期三",
    },
    {
        value: "5",
        label: "星期四",
    },
    {
        value: "6",
        label: "星期五",
    },
    {
        value: "7",
        label: "星期六",
    },
];

// 可上团课 1：是 0：否
export const groupLessons = [
    {
        value: "0",
        label: "否",
    },
    {
        value: "1",
        label: "是",
    },
];

// 可上私课 1：是 0：否
export const privateState = [
    {
        value: "0",
        label: "否",
    },
    {
        value: "1",
        label: "是",
    },
];

//  学习意向
export const booleanList = [
    {
        value: "0",
        label: "否",
    },
    {
        value: "1",
        label: "是",
    },
];
export const booleanStatus = listToObj(booleanList);

//
export const birthdayTypeList = [
    {
        value: "1",
        label: "1月",
    },
    {
        value: "2",
        label: "2月",
    },
    {
        value: "3",
        label: "3月",
    },
    {
        value: "4",
        label: "4月",
    },
    {
        value: "5",
        label: "5月",
    },
    {
        value: "6",
        label: "6月",
    },
    {
        value: "7",
        label: "7月",
    },
    {
        value: "8",
        label: "8月",
    },
    {
        value: "9",
        label: "9月",
    },
    {
        value: "10",
        label: "10月",
    },
    {
        value: "11",
        label: "11月",
    },
    {
        value: "12",
        label: "12月",
    },
    {
        value: "13",
        label: "今日",
    },
    {
        value: "14",
        label: "本周",
    },
];

//  会员状态
export const hallStateList = [
    {
        value: "1",
        label: "正常",
    },
    {
        value: "2",
        label: "临时会员",
    },
    {
        value: "-1",
        label: "禁用会员",
    },
];

//  会员类型
export const hallTypeList = [
    {
        value: "1",
        label: "个人",
    },
    {
        value: "2",
        label: "企业",
    },
];
// 出行习惯
export const travelList = [
    {
        value: "1",
        label: "步行",
    },
    {
        value: "2",
        label: "驾车",
    },
    {
        value: "3",
        label: "公交",
    },
    {
        value: "4",
        label: "地铁",
    },
    {
        value: "5",
        label: "骑行",
    },
    {
        value: "6",
        label: "其他",
    },
];
// 课程需求
export const courseDemandList = [
    {
        value: "1",
        label: "减脂",
    },
    {
        value: "2",
        label: "减压",
    },
    {
        value: "3",
        label: "备孕",
    },
    {
        value: "4",
        label: "产前",
    },
    {
        value: "5",
        label: "产后",
    },
    {
        value: "6",
        label: "塑形",
    },
    {
        value: "7",
        label: "体式",
    },
    {
        value: "8",
        label: "理疗",
    },
    {
        value: "9",
        label: "其他",
    },
];
// 婚姻状况
export const maritalStatusList = [
    { value: "0", label: "未婚" },
    { value: "1", label: "已婚" },
    { value: "2", label: "离异" },
];
// 课程卡状态
export const courseCardStatus = [
    { label: "正常", value: "10" },
    { label: "停卡", value: "-10" },
    { label: "关卡", value: "-20" },
    { label: "转卡", value: "30" },
    { label: "请假", value: "-30" },
    { label: "已过期", value: "-40" },
    { label: "已退卡", value: "-50" },
];

// 会员上完课对课程的评分选项
// 婚姻状况
export const coachScoreList = [
    { value: "1", label: "1分" },
    { value: "2", label: "2分" },
    { value: "3", label: "3分" },
    { value: "4", label: "4分" },
    { value: "5", label: "5分" },
];
// 教室类型 0.线下场馆（默认线下场馆课） 1.临时视频课
export const classroomTypeList = [
    { label: "线下场馆", value: "0" },
    { label: "临时视频课", value: "1" },
];
// 交易类型
export const TransactionType = [
    // { label: "开卡", value: "10" },
    { label: "充值", value: "50" },
    { label: "提现", value: "-50" },
    // { label: "转卡", value: "30" },
    // { label: "权益调整", value: "40" },
    { label: "约课", value: "80" },
    { label: "取消约课", value: "-80" },
    { label: "排队", value: "90" },
    { label: "取消排队", value: "-90" },
    { label: "余额调整", value: "20" },
];
// 到访状态
export const accessStatus = [
    { label: "未到访", value: "0" },
    { label: "已到访", value: "1" },
    { label: "已取消", value: "2" },
];
// 获取渠道 1 注册 2邀请用户 2兑换 4 预售定金支付 5后台发放 6购买 7口令码兑换
export const accessChannelList = [
    { label: "注册", value: "1" },
    { label: "邀请用户", value: "2" },
    { label: "兑换", value: "3" },
    { label: "预售定金支付", value: "4" },
    { label: "后台发放", value: "5" },
    { label: "购买", value: "6" },
    { label: "口令码兑换", value: "7" },
];
// 获取渠道 1 注册 2邀请用户 2兑换 4 预售定金支付 6购买
export const accessChannelLists = [
    { label: "注册", value: "1" },
    { label: "邀请用户", value: "2" },
    { label: "兑换", value: "3" },
    { label: "预售定金支付", value: "4" },
    { label: "购买", value: "6" },
];
// 优惠券状态 1：上线 0：下线
export const couponStatusList = [
    { label: "下线", value: "0" },
    { label: "上线", value: "1" },
];
// 使用状态，2：未使用，3：已使用
export const usedList = [
    { label: "未使用", value: "2" },
    { label: "已使用", value: "3" },
];
// 优惠券使用限制 1：团课 2：私教课 3：购卡 4： 教培学费 5：购买商品
export const couponsLimit = [
    { label: "团课", value: "1" },
    { label: "私教课", value: "2" },
    { label: "购卡", value: "3" },
    { label: "教培学费", value: "4" },
    { label: "购买商品", value: "5" },
];

// 预售活动状态 1：上线 0：下线
export const presaleStatusList = [
    { label: "下线", value: "0" },
    { label: "上线", value: "1" },
];
// 订单类型，1付款订单 2退款订单
export const presaleOrderList = [
    { label: "付款订单", value: "1" },
    { label: "退款订单", value: "2" },
];
// 回复状态
export const replyStatusList = [
    { label: "回复", value: 1 },
    { label: "未回复", value: 0 },
];
// 预约状态 10排队中 20 已预约 -10 取消排队 -20 取消预约 40 已上课 -40 已爽约
export const volumeStatusList = [
    {
        value:1,
        label:'排队等待支付',
    },
    {
        value:2,
        label:'预约等待支付',
    },
    {
        value:3,
        label:'私教预约申请等待',
    },
    {
        value:5,
        label:'私教预约申请中',
    },
    {
        value:10,
        label:'排队中',
    },
    {
        value:20,
        label:'已预约',
    },
    {
        value:-10,
        label:'排队取消',
    },
    {
        value:-20,
        label:'预约取消',
    },
    {
        value:40,
        label:'已签到，已上课',
    },
    {
        value:-40,
        label:'未签到，爽约',
    },
    {
        value:8,
        label:'排队取消等待退款',
    },
    {
        value:9,
        label:'预约取消等待退款',
    },
    {
        value:7,
        label:'申请取消等待退款',
    },
];
