<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 14:00:48
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 14:00:49
 * @Descripttion: 门店营业订单
-->
<template>
    <div>门店营业订单</div>
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
