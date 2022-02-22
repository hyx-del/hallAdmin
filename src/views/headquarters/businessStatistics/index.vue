<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:01:52
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-22 15:01:52
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
