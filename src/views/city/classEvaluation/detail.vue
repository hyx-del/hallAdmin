<!--
 * @Author: jiu yin
 * @Date: 2021-12-15 15:50:50
 * @LastEditTime: 2021-12-31 13:54:04
 * @LastEditors: zx
 * @Description: 666
 * @FilePath: \hall-admin\src\views\store\storeClassEvaluation\detail.vue
 * jiu
-->
<template>
    <div class="comment_reply">
        <h2>评价回复</h2>
        <ul class="border_list">
            <li>会馆：{{ formDatas.hallName }}</li>
            <li>课程：{{ formDatas.courseName }}</li>
            <li>教练：{{ formDatas.coachName }}</li>
            <li>教练手机号：{{ formDatas.coachMobile }}</li>
            <li>时间：{{ formDatas.startAt + "- " + formDatas.endAt }}</li>
        </ul>
        <ul class="border_list">
            <li>教练评分：{{ formDatas.coachScore + "分" }}</li>
            <li>留言：{{ formDatas.content }}</li>
            <li>会员：{{ formDatas.memberName }}</li>
            <li>会员手机号：{{ formDatas.mobile }}</li>
            <li>时间：{{ formDatas.commentAt }}</li>
        </ul>
        <ul class="border_list" v-if="formDatas.replier">
            <li>回复人：{{ formDatas.replier }}</li>
            <li>回复时间：{{ formDatas.replyAt }}</li>
            <li>回复内容：{{ formDatas.replyContent }}</li>
        </ul>
        <ul>
            <li style="width: 500px">
                <el-input
                    v-model.trim="formDatas.newReplyContent"
                    :rows="4"
                    type="textarea"
                    placeholder="回复内容"
                />
            </li>
            <li style="margin-top: 11px">
                <el-button
                    type="primary"
                    @click="replyContentClick"
                    size="small"
                    >{{ formDatas.replier ? "修改内容" : "回复" }}</el-button
                >
            </li>
        </ul>
    </div>
</template>
<script>
import {
    computed,
    defineComponent,
    onMounted,
    reactive,
    ref,
    toRefs,
} from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { replierCourseCommentAPI, getCourseCommentInfoAPI } from "@/api/course";

export default defineComponent({
    components: {},
    setup(props, context) {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const idObj = route.query;
        //逻辑层主体
        const state = reactive({
            formDatas: {},
        });

        computed(() => {});
        onMounted(() => {
            initDataAPI();
        });
        const initDataAPI = () => {
            getCourseCommentInfoAPI(idObj).then((res) => {
                if (res.code == 200) {
                    state.formDatas = res.data;
                }
            });
        };
        const replyContentClick = () => {
            replierCourseCommentAPI({
                id: state.formDatas.id,
                replyContent: state.formDatas.newReplyContent,
            }).then((res) => {
                if (res.code == 200) {
                    ElMessage.success("添加成功");
                    initDataAPI();
                } else {
                    ElMessage.error(res.msg);
                }
            });
        };
        return {
            ...toRefs(state),
            replyContentClick,
        };
    },
});
</script>
<style lang="scss" scoped>
ul {
    list-style: none;
    font: 14px/33px;
    color: rgba(0, 0, 0, 0.65);
}
.comment_reply {
    .border_list {
        border-bottom: 1px solid #ccc;
        padding-bottom: 17px;
        li {
            margin: 10px 0;
        }
    }
}
.border {
}
</style>
