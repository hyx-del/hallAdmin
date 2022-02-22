/*
 * @Author: c.k
 * @Date: 2021-12-28 15:23:58
 * @LastEditors: zx
 * @LastEditTime: 2022-01-05 17:41:55
 * @Description: 所有导出的URL 地址
 */

import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
import { objToUrl } from "@/utils/tools";
import { format } from "@/utils/formaData";
import { url } from "@/config";
import { ElLoading, ElMessage } from "element-plus";

/**
 * @name: downLoadFileByBlob
 * @description: 文件下载
 * @param {*} content  后端返回的流数据
 * @param {*} filename 文件名称，非必传，如果不传递默认是当前的时间 2021-12-12:121212
 * @return {*}
 */
function downLoadFileByBlob(content, filename) {
    let aEle = document.createElement("a"); // 创建a标签
    let blob = new Blob([content], {
        type: "application/octet-stream",
    });
    aEle.download = `${format(new Date(), "YYYY-MM-DD_HH_mm_ss")}.xls`; // 设置下载文件的文件名
    aEle.href = window.URL.createObjectURL(blob);
    aEle.target = "_blank";
    aEle.click(); // 设置点击事件
    window.URL.revokeObjectURL(blob);
    aEle.remove();
}

/**
 * @name:
 * @description:
 * @param {*} url  访问url
 * @param {*} data  参数  对象形式 {}
 * @param {*} method 默认 get 请求，也可以是post 请求
 * @return {*}
 */
function downLoadFileAPI(url, data, method = "get") {
    const fullScreenLoading = ElLoading.service({
        lock: true,
        text: "正在导出...",
        background: "rgba(0, 0, 0, 0.6)",
    });
    request({
        url,
        method,
        responseType: "blob",
        data,
    })
        .then((content) => {
            downLoadFileByBlob(content);
            fullScreenLoading.close();
        })
        .catch((error) => {
            console.log("error", error);
            fullScreenLoading.close();
            ElMessage.error("导出失败,请稍后尝试");
        });
}

/**
 * @name: exportCourseEvaluationAPI
 * @description:  课程评价导出
 * @param {*} 参数
 * @return {*}
 * demo  => staffManagement 文件  里面的  exportCourseEvaluationAPI 方法
 */
export const exportCourseEvaluationAPI = (data) => {
    downLoadFileAPI("/admin/hall/course-plan-comments/export", mixinMenu(data));
};
/**
 * @name: suggestionsExport
 * @description:  投诉建议
 * @param {*} 参数
 * @return {*}
 * demo  => staffManagement 文件  里面的  suggestionsExport 方法
 */
export const suggestionsExport = (data) => {
    downLoadFileAPI("/admin/hall/suggestions/export", mixinMenu(data));
};
