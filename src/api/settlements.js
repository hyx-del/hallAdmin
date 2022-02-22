/*
 * @Author: 郑晶
 * @Date: 2021-12-21 17:52:14
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-05 16:57:21
 * @Description:
 */
/*
 * 包含接口：根据课程id查询课程卡(cardList),根据课程id查询课程配置信息(settlementsDetail),保存课程配置信息(settlementsPreservePost),
 *排课和课程是否有支付限制-lzcCourse Settlements Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 根据课程id查询课程卡
export const cardList = (data) => {
    return request({
        url: `/admin/hall/course/settlements/card/list`,
        method: "GET",
        data,
    });
};

// 根据课程id查询课程配置信息
export const settlementsDetail = (data) => {
    return request({
        url: `/admin/hall/course/settlements/detail`,
        method: "GET",
        data,
    });
};

// 保存课程配置信息
export const settlementsPreservePost = (data) => {
    return request({
        url: `/admin/hall/course/settlements/preserve`,
        method: "POST",
        data,
    });
};
