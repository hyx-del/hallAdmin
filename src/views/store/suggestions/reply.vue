<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-05 17:38:19
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-13 10:36:03
 * @Descripttion: 建议回复
-->
<template>
    <div class="comment_reply">
        <h2>建议回复</h2>
        <ul class="border_list">
            <li>会馆：{{ formDatas.hallName || "无" }}</li>
            <li>会员：{{ formDatas.memberName || "无" }}</li>
            <li>建议内容：{{ formDatas.content || "无" }}</li>
            <li>时间：{{ formDatas.commentAt || "无" }}</li>
        </ul>
        <ul class="border_list_bottom">
            <li>回复人：{{ formDatas.replierName || "无" }}</li>
            <li>回复时间：{{ formDatas.replyAt || "无" }}</li>
            <li>回复内容：{{ formDatas.replyContent || "无" }}</li>
        </ul>

        <ul>
            <li style="width: 500px">
                <el-input
                    v-model.trim="formDatas.newReplyContent"
                    :rows="4"
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    placeholder="回复内容"
                />
            </li>
            <li style="margin-top: 11px">
                <el-button
                    type="primary"
                    @click="replyContentClick"
                    size="small"
                    >{{
                        formDatas.replyContent ? "修改内容" : "回复"
                    }}</el-button
                >
                <el-button type="" @click="returnBeforePage" size="small"
                    >返回</el-button
                >
            </li>
        </ul>
    </div>
</template>
<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { suggestionsDetail, suggestionsReplier } from "@/api/suggestions";

export default defineComponent({
    components: {},
    setup(props, context) {
        const router = useRouter();
        const route = useRoute();
        const idObj = route.query;
        //逻辑层主体
        const state = reactive({
            formDatas: {},
            debounce: false,
        });
        onMounted(() => {
            initDataAPI();
        });
        const initDataAPI = () => {
            suggestionsDetail(idObj).then((res) => {
                if (res.code == 200) {
                    state.formDatas = res.data;
                }
            });
        };
        const replyContentClick = async () => {
            if (!state.debounce) {
                //防止多次点击
                state.debounce = true;
                await suggestionsReplier({
                    id: state.formDatas.id,
                    replyContent: state.formDatas.newReplyContent,
                }).then((res) => {
                    if (res.code == 200) {
                        state.formDatas.replyContent
                            ? ElMessage.success("修改成功")
                            : ElMessage.success("添加成功");
                        initDataAPI();
                        state.debounce = false;
                    } else {
                        ElMessage.error(res.msg);
                        state.debounce = false;
                    }
                });
                await router.go(-1);
            }
        };
        const returnBeforePage = () => {
            router.go(-1);
        };
        return {
            ...toRefs(state),
            replyContentClick,
            returnBeforePage,
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
    .border_list_bottom {
        padding-bottom: 17px;
        li {
            margin: 10px 0;
        }
    }
}
.border {
}
</style>
