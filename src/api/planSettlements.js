/*
 * 包含接口：根据课程id查询课程卡(settlementsCardList),根据排课id查询课程配置信息(planSettlementsDetail),保存排课配置信息(planSettlementsPreservePost),
 *课程计划卡结算规则-lzc Course Plan Settlements Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 根据课程id查询课程卡
export const settlementsCardList = (data) => {
    return request({
        url: `/admin/hall/course/plan/settlements/card/list`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 根据排课id查询课程配置信息
export const planSettlementsDetail = (data) => {
    return request({
        url: `/admin/hall/course/plan/settlements/detail`,
        method: "GET",
        data: mixinMenu(data),
    });
};

// 保存排课配置信息
export const planSettlementsPreservePost = (data) => {
    return request({
        url: `/admin/hall/course/plan/settlements/preserve`,
        method: "POST",
        data: mixinMenu(data),
    });
};
