<!--
 * @Author: 刘帝君
 * @Date: 2021-12-20 13:26:41
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-15 16:15:38
 * @Descripttion: 合同管理/详情
-->
<template>
    <div>
        <!-- <formShow
            ref="formShow"
            :formInitData="formInitData"
            :itemList="itemList"
        /> -->
        <formList
            ref="formListRef"
            :formInitData="formInitData"
            :itemList="itemList"
            :buttons="buttons"
            :config="config"
        >
        </formList>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
// import formShow from "@/components/FormList/detailShow";
import formList from "@/components/FormList/index";
import { useRoute, useRouter } from "vue-router";
import { contractDetailAPI } from "@/api/contractManagement";
import { ElMessage } from "element-plus";
import { addFormBottom } from "@/utils/config";
export default {
    components: { formList },
    setup() {
        const router = useRouter();
        const state = reactive({
            itemList: [
                {
                    label: "合同名称",
                    code: "title",
                    disabled: true,
                    required: false,
                },
                {
                    el: "radio",
                    code: "paper",
                    label: "合同类型",
                    disabled: true,
                    required: false,
                    list: [
                        {
                            label: "纸质合同",
                            value: 1,
                        },
                        {
                            label: "电子合同",
                            value: 2,
                        },
                    ],
                },
                {
                    el: "file",
                    code: "filepath",
                    label: "合同附件",
                    disabled: true,
                    required: false,
                },
                {
                    label: "备注",
                    code: "remark",
                    required: false,
                    disabled: true,
                },
            ],
            config: {
                ...addFormBottom,
                valueStyle: {
                    width: "600px",
                },
            },
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.back();
                    },
                },
            ],
            formInitData: {},
        });

        onMounted(() => {
            const id = useRoute().query.id;
            contractDetailAPI({ id: useRoute().query.id }).then((res) => {
                const { code } = res;
                console.log(res, "res");
                if (code == 200) {
                    ElMessage.success("操作成功");
                    state.formInitData = res.data;
                }
            });
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
