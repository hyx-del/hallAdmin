<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 13:15:37
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 13:15:37
 * @Descripttion: 工资条
-->
<template>
    <div>工资条</div>
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
