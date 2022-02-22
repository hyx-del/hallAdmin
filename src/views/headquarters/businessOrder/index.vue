<!--
 * @Author: 刘帝君
 * @Date: 2021-11-22 15:04:06
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-22 15:04:06
 * @Descripttion: 营业订单
-->
<template>
    <div>营业订单</div>
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
