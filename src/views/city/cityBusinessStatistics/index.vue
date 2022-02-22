<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 11:37:36
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 11:37:37
 * @Descripttion: 营业统计
-->
<template>
    <div>营业统计</div>
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
