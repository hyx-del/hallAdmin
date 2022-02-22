<!--
 * @Author: 刘帝君
 * @Date: 2022-01-13 14:02:20
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-14 09:59:06
 * @Descripttion: 会员课程卡详情
-->
<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <basicInformation
                    v-if="activeName == 'first'"
                ></basicInformation>
            </el-tab-pane>
            <el-tab-pane label="操作" name="second">
                <operation v-if="activeName == 'second'"></operation>
            </el-tab-pane>
            <el-tab-pane label="使用记录" name="third">
                <usingRecord v-if="activeName == 'third'"></usingRecord>
            </el-tab-pane>
            <el-tab-pane label="转会记录" name="four">
                <transferRecord v-if="activeName == 'four'"></transferRecord>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import operation from "./operation"; //操作
import basicInformation from "./basicInformation"; //基本信息
import usingRecord from "./usingRecord"; //使用记录
import transferRecord from "./transferRecord"; //转会记录

export default {
    components: {
        operation,
        basicInformation,
        usingRecord,
        transferRecord,
    },
    setup() {
        const state = reactive({
            activeName: "first",
            handleClick(tab, event) {},
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
