<!--
 * @Author: zx
 * @Date: 2021-11-18 15:28:43
 * @LastEditors: zx
 * @LastEditTime: 2021-11-19 09:20:10
 * @Descripttion:
-->
<template>
    <emptyBox bottom="40">
        <detailShow :formInitData="formInitData" :itemList="itemList" />
    </emptyBox>
</template>

<script>
/*
 * 详情
 * */
import detailShow from "@/components/FormList/detailShow";
import { toRefs, ref, reactive, computed } from "vue";
import { itemList } from "./itemList";
import { useRoute } from "vue-router";
import emptyBox from "@/components/emptyBox";
import { presellactivityDetail } from "@/api/presell";

export default {
    components: {
        detailShow,
        emptyBox,
    },
    setup() {
        const state = reactive({
            formInitData: {},
            itemList,
        });
        const id = useRoute().query.id;
        presellactivityDetail({ id }).then(({ code, data }) => {
            if (code == 200) {
                state.formInitData = data;
            }
        });
        return {
            ...toRefs(state),
        };
    },
};
</script>

<style scoped></style>
