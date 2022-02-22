import request from "./request";
import { mixinMenu } from "@/api/menuTop";

// 投诉建议
/*
* 包含接口：分页查询(suggestionsList),导出(suggestionsExport),回复(suggestionsReplier),回复详情(suggestionsDetail)
* 后端员工 Staff Controller
*/

//分页查询
export function suggestionsList(data) {
    return request({
        url: "/admin/hall/suggestions/list",
        method: "get",
        data:data,
    });
}
//导出
export function suggestionsExport(data) {
    return request({
        url: "/admin/hall/suggestions/export",
        method: "get",
        data:mixinMenu(data),
    });
}
//回复详情
export function suggestionsDetail(data) {
    return request({
        url: "/admin/hall/suggestions/detail",
        method: "get",
        data:data,
    });
}
//回复
export function suggestionsReplier(data) {
    return request({
        url: "/admin/hall/suggestions/replier",
        method: "put",
        data:data,
    });
}

