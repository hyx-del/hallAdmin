<!--
 * @Author: 刘帝君
 * @Date: 2021-11-30 17:05:36
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-09 11:09:39
 * @Descripttion: 课程卡管理详情
-->
<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
                <basicInformation
                    v-if="activeName == 'first'"
                ></basicInformation>
            </el-tab-pane>
            <el-tab-pane label="规格" name="second">
                <specifications
                    v-if="activeName == 'second' && type == '1'"
                ></specifications>
                <specificationsCard
                    v-if="activeName == 'second' && type == '2'"
                ></specificationsCard>
            </el-tab-pane>
            <el-tab-pane label="城市/场馆" name="third">
                <venue
                    v-if="activeName == 'third' && generalType !== '4'"
                ></venue>
                <venueCard
                    v-if="activeName == 'third' && generalType == '4'"
                ></venueCard>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import specifications from "./specifications"; //规格
import specificationsCard from "./specificationsCard"; //规格/期限卡
import basicInformation from "./basicInformation"; //基本信息
import venue from "./venue"; //城市/场馆
import venueCard from "./venueCard"; //城市/场馆
import { useRouter, useRoute } from "vue-router";
export default {
    components: {
        specifications,
        specificationsCard,
        basicInformation,
        venue,
        venueCard,
    },
    setup() {
        const state = reactive({
            activeName: "first",
            type: useRoute().query.type,
            generalType: useRoute().query.generalType,
            handleClick(tab, event) {},
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
