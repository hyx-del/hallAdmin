/*
 * @Author: admin
 * @Date: 2021-08-19 17:49:17
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-02-18 15:27:37
 * @Descripttion: vue 打包等配置文件
 */
// console.log(process.env.VUE_APP_title)
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    lintOnSave: false, // 取消 eslint 验证
    devServer: {
        disableHostCheck: true,
        port: 80, // 端口
        proxy: {
            "/admin": {
                // 以/ajax开头的请求
                target: "http://api.dev.jiayu.gold", //  dev环境
                // target: "http://api.test.jiayu.gold", //  test环境
                // target: "http://192.168.110.172:8080", //吴伟
                // target: "http://192.168.110.48:8080", //刘中超
                // target: "http://192.168.110.21:8080", //谢毅伦
                // target: "http://192.168.110.17:8080", //代金池
                // target: 'http://192.168.110.112:8080/', // 蔡壮
                // target: "http://192.168.110.102:8094", //杨炜
                changeOrigin: true,
            },
            "/auth": {
                // 以/ajax开头的请求
                target: "http://api.dev.jiayu.gold", //  dev环境
                // target: "http://api.test.jiayu.gold", //  test环境
                // target: "http://192.168.110.172:8080", //吴伟
                // target: "http://192.168.110.48:8080", //刘中超
                // target: "http://192.168.110.21:8080", //谢毅伦
                // target: "http://192.168.110.17:8080/", //代金池
                // target: 'http://192.168.110.112:8080/', // 蔡壮
                changeOrigin: true,
            },
        },
    },
    configureWebpack: {
        name: "name",
        externals: {
            wangeditor: "wangeditor",
        },
        resolve: {
            alias: {
                "@": resolve("src"),
            },
        },
    },
};
