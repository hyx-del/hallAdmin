<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 14:18:55
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 14:18:55
 * @Descripttion: 预售管理
-->
<template>
    <div>预售管理</div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
    setup() {
        const state = reactive({
            count: 0,
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
