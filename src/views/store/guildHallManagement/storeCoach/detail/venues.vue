<!--
 * @Author: 刘帝君
 * @Date: 2021-12-02 09:56:04
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-30 09:22:38
 * @Descripttion: 教练详情/场馆
-->
<template>
    <div>
        <card
            v-if="listData && echoData"
            :listData="listData"
            :echoData="echoData"
            @comesBack="comesBack"
        ></card>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { venuesAPI, venuesDataAPI, venuesListAPI } from "@/api/coach";
import card from "./card";
import { useRoute } from "vue-router";
import { mapState } from "vuex";
import { ElMessage } from "element-plus";
export default {
    components: {
        card,
    },
    setup() {
        const state = reactive({
            count: 0,
            listData: null,
            echoData: null,
            id: useRoute().query.id,
        });

        const comesBack = (val) => {
            let coachCheckedHallsDTOS = [];
            val.map((e) => {
                coachCheckedHallsDTOS.push(...e.hallAllListVOList);
            });
            venuesListAPI({
                coachId: state.id,
                coachCheckedHallsDTOS,
            }).then((res) => {
                const { code } = res;
                if (code == 200) {
                    ElMessage.success("保存成功");
                }
            });
        };

        onMounted(() => {
            venuesAPI().then((res) => {
                const { code } = res;
                console.log(res, "场馆");
                if (code == 200) {
                    state.listData = res.data;
                }
            });
            venuesDataAPI({ coachId: useRoute().query.id }).then((res) => {
                const { code } = res;
                console.log(res, "场馆回显数据");
                if (code == 200) {
                    state.echoData = res.data;
                }
            });
        });

        return {
            ...toRefs(state),
            comesBack,
        };
    },
};
</script>

<style lang="scss" scoped></style>
