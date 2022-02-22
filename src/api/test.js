/*
 * @Author: jiu yin
 * @Date: 2021-12-15 17:56:37
 * @LastEditTime: 2021-12-23 15:40:50
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \hall-admin\src\api\test.js
 * jiu
 */
import request from './request';
// 列表
export const listTets = data => {
   return request({
     url: `/admin/hall/hall/list`,
     method: "get",
     data
   });
 };
 //下拉
 export const selectTest = data => {
   return request({
     url: `/admin/hall/course-card-spec-category/box-list`,
     method: "get",
     data
   });
 };


