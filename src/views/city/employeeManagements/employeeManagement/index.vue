<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 13:09:30
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 13:09:31
 * @Descripttion: 员工管理
-->
<template>
    <div>员工管理</div>
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
