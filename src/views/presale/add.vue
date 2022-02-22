<template>
    <emptyBox bottom="70">
        <formList
            ref="formListRef"
            :formInitData="formInitData"
            :itemList="itemList"
            :buttons="buttons"
            :config="config"
            @formChange="formChange"
        >
        </formList>
    </emptyBox>
</template>

<script>
/*
 * add组件说明
 * 新增编辑
 * */
import formList from "@/components/FormList/index";
import emptyBox from "@/components/emptyBox/index.vue";

import { toRefs, ref, reactive, computed } from "vue";
import { itemList } from "./itemList";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import { ElMessage, ElMessageBox } from "element-plus";
import {
    presellactivityDetail,
    presellPresellactivityPost,
    presellPresellactivityPut,
} from "@/api/presell";

export default {
    components: {
        formList,
        emptyBox,
    },
    porps: [],
    setup() {
        const router = useRouter();
        const formListRef = ref(null);
        const state = reactive({
            formInitData: {},
            config: { ...addFormBottom },
            itemList,
            // 手动隐藏
            hideList: [],
            // 手动显示
            showList: [],
            formState: [],
            id: "",
            // 表单变化
            formChange: (val) => {
                let { code, value } = val;
                state.formInitData[code] = value;
            },
            // 按钮
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.go(-1);
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        let data = value;
                        // 编辑
                        if (state.id) {
                            presellPresellactivityPut({ ...data }).then(
                                (res) => {
                                    ElMessage({
                                        message: "编辑成功，即将返回列表",
                                        grouping: true,
                                        type: "success",
                                        duration: 1000,
                                        onClose: () => {
                                            router.go(-1);
                                        },
                                    });
                                }
                            );
                        } else {
                            presellPresellactivityPost({ ...data }).then(
                                (res) => {
                                    ElMessage({
                                        message: "新加成功，即将返回列表",
                                        grouping: true,
                                        type: "success",
                                        duration: 1000,
                                        onClose: () => {
                                            router.go(-1);
                                        },
                                    });
                                }
                            );
                        }
                    },
                },
            ],
            // 初始化
            start: () => {
                if (useRoute().query && useRoute().query.id) {
                    state.id = useRoute().query.id;
                    // 查询详情
                    presellactivityDetail({ id: state.id }).then(({ data }) => {
                        state.formInitData = data;
                    });
                }
            },
        });
        state.start();
        return {
            formListRef,
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
