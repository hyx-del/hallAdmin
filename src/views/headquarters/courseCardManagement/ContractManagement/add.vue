<!--
 * @Author: 刘帝君
 * @Date: 2021-12-20 13:26:17
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-15 16:15:02
 * @Descripttion: 合同管理/新增
-->
<template>
    <div>
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
import formList from "@/components/FormList/index";
import { reactive, toRefs, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addFormBottom } from "@/utils/config";
import {
    contractAppAPI,
    contractDetailAPI,
    contractEditAPI,
} from "@/api/contractManagement";
import { ElMessage } from "element-plus";
import { url } from "@/config/index";
export default {
    components: {
        formList,
    },
    setup() {
        const router = useRouter();
        const state = reactive({
            formInitData: {},
            config: {
                ...addFormBottom,
                pure: false,
                valueStyle: {
                    width: "600px",
                },
            },
            itemList: [
                {
                    label: "合同名称",
                    code: "title",
                    maxlength: 50,
                },
                {
                    el: "radio",
                    code: "paper",
                    label: "合同类型",
                    list: [
                        {
                            label: "纸质合同",
                            value: "1",
                        },
                        {
                            label: "电子合同",
                            value: "2",
                        },
                    ],
                },
                {
                    el: "file",
                    code: "filepath",
                    label: "合同附件",
                },
                {
                    label: "备注",
                    code: "remark",
                    required: false,
                },
            ],
            id: useRoute().query.id,
            // 按钮
            buttons: [
                {
                    name: "取消",
                    click: () => {
                        router.back();
                    },
                },
                {
                    funType: "confirm",
                    type: "primary",
                    name: "确认",
                    click: ({ value }) => {
                        if (value.filepath) {
                            value.file =
                                url.OSSUrl + "/admin/" + value.filepath;

                            if (state.id) {
                                // 编辑
                                contractEditAPI({ ...value }).then((res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        router.back();
                                    }
                                });
                            } else {
                                let date = parseInt(+new Date() / 1000);
                                value.id = date;
                                // 新增
                                contractAppAPI({ ...value }).then((res) => {
                                    const { code } = res;
                                    console.log(res, "新增");
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        router.back();
                                    }
                                });
                            }
                        } else {
                            ElMessage.warning("请上传附件！");
                        }
                    },
                },
            ],
        });
        onMounted(() => {
            if (useRoute().query.id) {
                contractDetailAPI({ id: useRoute().query.id }).then((res) => {
                    const { code } = res;
                    console.log(res, "res");
                    if (code == 200) {
                        ElMessage.success("操作成功");
                        state.formInitData = res.data;
                    }
                });
            }
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped></style>
