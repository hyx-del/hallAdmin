<!--
 * @Author: 郑晶
 * @Date: 2021-12-24 11:04:56
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-10 15:50:24
 * @Description: 会馆-会员详情-体测数据
-->
<template>
    <div>
        <formList
            :itemList="[]"
            :buttons="buttons"
            :formInitData="searchData"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="searchData"
            :showSortIndex="{ show: true, lable: '序号' }"
        >
        </Table>
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            :title="popTitle"
            :itemList="popItemList"
            :formConfig="popFormConfig"
            :buttons="popButtons"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import popupForm from "@/components/FormList/popupForm.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
    hallIndicatorAdd,
    hallIndicatorList,
    hallIndicatorForm,
    hallIndicatorDetails,
} from "@/api/hall";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 搜索表格--数据
            searchData: {
                memberId: id,
            },
            // table表单
            getList: hallIndicatorList,
            buttons: [
                // {
                //     funType: "confirm",
                //     type: "primary",
                //     name: "添加体测数据",
                //     click: () => {
                //         state.showState = 1;
                //         // 获取表单模板
                //         hallIndicatorForm().then(({ code, data }) => {
                //             if (code === 200 && data && data.length) {
                //                 state.formData = data;
                //                 // 动态加载表单
                //                 state.popItemList = [
                //                     {
                //                         el: "date",
                //                         code: "indicatorDate",
                //                         type: "date",
                //                         label: "体测时间",
                //                         minDate: new Date("1900-01-01"),
                //                         maxDate: new Date(),
                //                     },
                //                     ...data.map((item) => ({
                //                         label: item.name,
                //                         code: item.nameEn,
                //                         suffix: item.unit,
                //                         required: false,
                //                     })),
                //                 ];
                //                 state.popShow = true;
                //             }
                //         });
                //     },
                // },
            ],
            column: [
                {
                    label: "体测日期",
                    prop: "indicatorDate",
                },
                {
                    label: "创建人",
                    prop: "createdName",
                },
                {
                    label: "最后修改人",
                    prop: "updatedName",
                },
                {
                    label: "创建时间",
                    prop: "createdAt",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 160,
                    actives: [
                        {
                            name: "详情",
                            method: ({ id }) => {
                                state.showState = 3;
                                state.popShow = true;
                                // 获取单个体测数据详情
                                hallIndicatorDetails({ id }).then(
                                    ({ code, data }) => {
                                        if (code === 200 && data) {
                                            const {
                                                indicatorData,
                                                indicatorDate,
                                            } = data;
                                            let newArr = [
                                                {
                                                    el: "date",
                                                    code: "indicatorDate",
                                                    type: "date",
                                                    label: "体测时间",
                                                    minDate: new Date(
                                                        "1900-01-01"
                                                    ),
                                                    maxDate: new Date(),
                                                    default: indicatorDate,
                                                },
                                                ...JSON.parse(
                                                    indicatorData
                                                ).map((item) => ({
                                                    label: item.name,
                                                    code: item.nameEn,
                                                    suffix: item.unit,
                                                    default: item.value,
                                                    required: false,
                                                    disabled: true,
                                                })),
                                            ];
                                            state.popItemList = newArr;
                                            // 动态加载表单
                                        }
                                    }
                                );
                            },
                        },
                    ],
                },
            ],
            // 新加编辑弹窗
            popTitle: computed(() => {
                let text = "";
                switch (+state.showState) {
                    case 1:
                        text = "新增体测数据";
                        break;
                    case 2:
                        text = "编辑体测数据";
                        break;
                    case 3:
                        text = "体测数据详情";
                        break;
                    default:
                        break;
                }
                return text;
            }),
            popFormConfig: {
                default: {
                    disabled: computed(() =>
                        state.showState == 3 ? true : false
                    ),
                },
                buttons: [],
            },
            showState: 1,
            popShow: false,
            popFormInitData: {},
            popButtons: [
                {
                    name: "取消",
                    click: () => {
                        state.popShow = false;
                    },
                },
                {
                    show: computed(() => (state.showState != 3 ? true : false)),
                    funType: "confirm",
                    type: "primary",
                    name: "确定",
                    click: ({ value }) => {
                        let newArr = state.formData.map((item) =>
                            Object.assign({}, item, {
                                value: value[item.nameEn] || "",
                            })
                        );
                        hallIndicatorAdd({
                            hallId: 32,
                            memberId: id,
                            indicatorDate: value.indicatorDate,
                            indicatorData: JSON.stringify(newArr),
                        }).then(({ code, msg }) => {
                            if (code === 200) {
                                ElMessage.success({
                                    message: msg || "操作成功",
                                    duration: 500,
                                    onClose: () => {
                                        TableList.value.update();
                                        state.popShow = false;
                                    },
                                });
                            } else {
                                ElMessage.error({
                                    message: msg || "操作失败",
                                });
                            }
                        });
                    },
                },
            ],
            popItemList: [],
            formData: [],
        });
        return {
            ...toRefs(state),
            TableList,
        };
    },
};
</script>

<style lang="scss" scoped>
.name {
    cursor: pointer;
    color: #2e8de6;
}
.find {
    margin-left: 10px;
    cursor: pointer;
    color: #2e8de6;
}
</style>
