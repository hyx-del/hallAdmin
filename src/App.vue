<!--
 * @Author: admin
 * @Date: 2021-08-19 17:40:16
 * @LastEditors: 郑晶
 * @LastEditTime: 2021-12-15 11:50:20
 * @Descripttion: 
-->
<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import store from "@/store";
import { getAliOSSToken } from "@/api/common";
import { onMounted, onBeforeUnmount } from "vue";

export default {
    name: "App",
    setup() {
        let tokenTimer = null;
        const aliYunOSSToken = () => {
            if (window.sessionStorage.getItem("hall_Authorization")) {
                getAliOSSToken().then((res) => {
                    if (res.code === 200) {
                        store.dispatch("app/updateOSSToken", res.data);
                    } else {
                        message.error(res.msg);
                    }
                });
            }
        };
        const stopTimer = () => {
            if (tokenTimer) {
                clearInterval(tokenTimer);
                tokenTimer = null;
            }
        };

        // 每隔 50x60x1000 去刷新一次token   3600000
        //   TODO  以后这里需要优化 使用自己的refresh token 方式来刷新

        onMounted(() => {
            stopTimer();
            aliYunOSSToken();
            tokenTimer = setInterval(() => {
                aliYunOSSToken();
            }, 3000000);
        });

        onBeforeUnmount(() => {
            stopTimer();
        });
    },
};
</script>
<style lang="scss"></style>
