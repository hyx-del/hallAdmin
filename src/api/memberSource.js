/*
 * @Author: 郑晶
 * @Date: 2021-12-17 17:23:58
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-26 13:59:45
 * @Description:
 */
/*
 * 包含接口：新增会员来源(memberSourcePost),更新会员来源(memberSourcePut),id查询会员来源(memberSource),删除会员来源(memberSourceDelete),查询会员来源分页数据(sourceList),
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增会员来源
export const memberSourcePost = (data) => {
    return request({
        url: `/admin/hall/member/source`,
        method: "POST",
        data,
    });
};

// 批量修改销售
export const bulkChangesSalesAPI = (data) => {
    return request({
        url: `/admin/hall/member/salesman`,
        method: "PUT",
        data,
    });
};

// 更新会员来源
export const memberSourcePut = (data) => {
    return request({
        url: `/admin/hall/member/source`,
        method: "PUT",
        data,
    });
};

// id查询会员来源 id
export const memberSource = (data) => {
    return request({
        url: `/admin/hall/member/source/${data.id}`,
        method: "GET",
        data,
    });
};

// 删除会员来源 id
export const memberSourceDelete = (data) => {
    return request({
        url: `/admin/hall/member/source?id=${data.id}`,
        method: "DELETE",
        data,
    });
};

// 查询会员来源分页数据
export const sourceList = (data) => {
    return request({
        url: `/admin/hall/member/source/list`,
        method: "GET",
        data,
    });
};
