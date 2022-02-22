/*
 * @Author: wei.chen
 * @Date: 2020-06-11 11:46:00
 * @LastEditTime: 2022-01-19 11:15:18
 * @LastEditors: 郑晶
 * @Description:
 */

import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
import store from "@/store";
import { getToken, getOtherToken } from "@/utils/auth";
import { useRouter } from "vue-router";

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 30000, // request timeout
});
// 组装参数
const getJoinParams = (params) => {
    let obj = {};
    switch (store.getters.menuType) {
        case "c":
            obj = {
                group: "city",
                cityId: store.getters.activeCityId,
            };
            break;
        case "hl":
            obj = {
                group: "hall",
                hallId: store.getters.activeHallId,
            };
            break;
        default:
            break;
    }
    return { ...params, ...obj };
};
// request interceptor
service.interceptors.request.use(
    (config) => {
        // 内部token
        const token = getToken();
        config.headers["sAuthorization"] = token
            ? `Bearer ${token}`
            : "Basic c3RvcmUtc3lzdGVtOllYQndPbUZ3Y0E=";

        if (config.ContentType) {
            config.headers["Content-Type"] =
                "application/x-www-form-urlencoded";
        }
        config.headers["Platform"] = "Admin";
        if (config.responseType == "blob") {
            config.headers["responseType"] = "blob";
        }
        config.params = getJoinParams(config.params);

        // switch (config.method) {
        //     case "get":
        //         config.params = getJoinParams(config.params);
        //         break;
        //     case "post":
        //     case "put":
        //     case "delete":
        //         config.data = getJoinParams(config.data);
        //         break;
        //
        //     default:
        //         break;
        // }
        // console.log("config",menuType);
        // TODO
        //  方便调试
        // if (config.url.indexOf('/admin/score') != -1) {
        // 	config.headers['instance_ip'] = '192.168.110.13';
        // } else {
        // 	config.headers['instance_ip'] = '192.168.110.48';
        // }
        // config.headers['instance_ip'] = '192.168.110.17';
        return config;
    },
    (error) => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// response interceptor
service.interceptors.response.use(
    (response) => {
        // debugger;
        const res = response.data;
        // debugger;
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200 && res.code !== undefined) {
            const router = useRouter();
            if (res.access_token) {
                return res;
            }

            // TODO 暂时注释，功能开发完成后放开

            // if (res.code === 401 || res.code === 400) {
            //     // token 过期了
            //     // 1、重置用户的状态
            //     // 2、用户跳转到 登录界面
            //     ElMessage({
            //         message: "登录认证失败，请重新登录!",
            //         type: "error",
            //         duration: 5 * 1000,
            //     });

            //     store.dispatch("user/resetToken").then(() => {
            //         // if(loc)
            //         //如果是登录界面就不做刷新
            //         if (!location.href.includes("/#/login")) {
            //             if (router) {
            //                 router.push({
            //                     path: "/login",
            //                     query: { refreshPage: 1 },
            //                 });
            //             }
            //         }
            //     });
            // } else if (
            //     res.code === 50008 ||
            //     res.code === 50012 ||
            //     res.code === 50014
            // ) {
            //     // to re-login
            //     ElMessageBox.confirm("登录认证失败，请重新登录!", "退出", {
            //         confirmButtonText: "重新登录",
            //         cancelButtonText: "取消",
            //         type: "warning",
            //     }).then(() => {
            //         store.dispatch("user/resetToken").then(() => {
            //             if (router) {
            //                 router.push({
            //                     path: "/login",
            //                     query: { refreshPage: 1 },
            //                 });
            //             }
            //         });
            //     });
            // } else {
            //     switch (res.code) {
            //         case 10005:
            //             res.msg = "值不可以重复！";
            //             break;
            //         case 9999:
            //             res.msg = "响应异常，请稍后尝试";
            //             break;
            //     }
            //     ElMessage({
            //         message: res.msg || "错误",
            //         type: "error",
            //         duration: 5 * 1000,
            //     });
            //     if (typeof res === "string") {
            //         return Promise.reject(new Error(res || "Error"));
            //     } else {
            //         return Promise.reject(res);
            //     }
            // }

            // todo 后续不需要这段代码
            switch (res.code) {
                case 10005:
                    res.msg = "值不可以重复！";
                    break;
                case 9999:
                    res.msg = "响应异常，请稍后尝试";
                    break;
            }
            ElMessage({
                message: res.msg || "错误",
                type: "error",
                duration: 5 * 1000,
            });
            if (typeof res === "string") {
                return Promise.reject(new Error(res || "Error"));
            } else {
                return Promise.reject(res);
            }
        } else {
            return res;
        }
    },
    (error) => {
        // debugger;
        if (error.response.status === 401 || error.response.status === 400) {
            const router = useRouter();
            // token 过期了
            // 1、重置用户的状态
            // 2、用户跳转到 登录界面
            ElMessage({
                message: error.response.data.msg,
                type: "error",
                grouping: true,
                duration: 3 * 1000,
            });

            store.dispatch("user/resetToken").then(() => {
                //如果是登录界面就不做刷新
                if (!location.href.includes("/#/login")) {
                    if (router) {
                        router.push({
                            path: "/login",
                            query: { refreshPage: 1 },
                        });
                    }
                }
            });
        } else {
            ElMessage({
                message: "服务异常,请稍后重试",
                type: "error",
                grouping: true,
                duration: 3 * 1000,
            });
        }
        return Promise.reject(new Error(error || "Error"));
    }
);
// get请求封装
// console.log(axios.defaults, "默认啊");
const request = (val) => {
    let { data, url, method, ContentType, responseType, type, hasToken } = val;

    if (method == "get" || method == "GET") {
        return service({
            url,
            method,
            params: data,
            ContentType,
            responseType,
        });
    } else {
        return service({
            url,
            method,
            data,
            ContentType,
            hasToken,
            responseType,
        });
    }
};

export default request;
