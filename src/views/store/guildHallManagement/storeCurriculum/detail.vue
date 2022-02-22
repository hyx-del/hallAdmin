<!--
 * @Author: jiu yin
 * @Date: 2021-11-23 11:23:49
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-01-17 15:42:05
 * @Descripttion: 开卡申请订单
-->
<template>
    <div>
        <h3>课程详情</h3>
        <Form
            :formDatas="formDatas"
            :formList="formList"
            onSubmits="保存"
            @onSubmit="onSubmits"
            :formItemStyle="{ width: '300px' }"
            :iconSelect="false"
            labelWidth="138px"
            :isBut="false"
        >
            <template #img>
                <div class="image-slot" v-if="formDatas.picture">
                    <el-image
                        style="width: 162px; height: 100px,display:flex"
                        :src="formDatas.picture"
                        fit="cover"
                    >
                    </el-image>
                </div>
                <div class="null_img" v-else>暂无图片</div>
            </template>
        </Form>
    </div>
</template>
<script>
import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
    toRefs,
    watch,
} from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import Form from "@/components/Form";
import { courseDetail } from "@/api/city";

export default defineComponent({
    components: { Form },
    setup(props, context) {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        //逻辑层主体
        const idObj = route.query;
        const state = reactive({
            formDatas: {},
            formList: [
                {
                    el: "select",
                    label: "课程类型",
                    code: "type",
                    disabled: true,
                    options: [
                        { id: 1, name: "团课" },
                        { id: 2, name: "私教课" },
                        { id: 3, name: "企业课" },
                    ],
                },
                { label: "课程名称", code: "name", disabled: true },
                { label: "英文名称", code: "nameEn", disabled: true },
                { el: "blank", label: "附件", code: "a1", slotName: "img" },
                {
                    label: "时长",
                    code: "duration",
                    disabled: true,
                    suffix: "分钟",
                },
                { label: "可约人数", code: "maxNumber", disabled: true },
                { label: "最少上课人数", code: "minNumber", disabled: true },
                { label: "权重", code: "weight", disabled: true },
                {
                    el: "textarea",
                    label: "备注",
                    code: "introduction",
                    disabled: true,
                    width: "400px",
                },
            ],
        });
        //count或book.name改变了
        // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
        computed(() => {});
        onMounted(() => {
            courseDetail(idObj).then((res) => {
                if (res.code == 200) {
                    state.formDatas = res.data;
                }
            });
        });
        onBeforeUnmount(() => {});
        const onSubmits = (event) => {
            console.log(event, "搜索");
        };
        return {
            ...toRefs(state),
            onSubmits,
        };
    },
});
</script>
<style lang="scss" scoped>
#edit {
    font-size: 14px;
    color: red;
    margin-left: -27px;
}
.image-slot {
    display: inline-block;
    vertical-align: top;
    width: 60vh;
    height: auto;
    text-align: left;
    .el-image {
        margin-right: 5px;
        height: 150px;
    }
}
.null_img {
    vertical-align: top;
    line-height: 150px;
    text-align: center;
    width: 150px;
    height: 150px;
    display: inline-block;
    background: #f5f7fa;
    color: var(--el-text-color-placeholder);
}
</style>
<style lang="scss">
.clearColon {
    position: relative;
}
.clearColon::after {
    content: "";
    position: absolute;
    top: 0;
    left: -26px;
    width: 10px;
    height: 29px;
    background: white;
}
</style>
