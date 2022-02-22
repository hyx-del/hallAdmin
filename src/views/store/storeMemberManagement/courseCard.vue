<!--
 * @Author: 郑晶
 * @Date: 2021-12-24 15:06:15
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-20 13:29:51
 * @Description: 会员详情-课程卡
-->
<template>
    <div>
        <formList
            :config="searchConfig"
            :buttons="buttons"
            :itemList="searchList"
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
import { tabelFormConfig } from "@/utils/config";
import { memberSourcePost } from "@/api/memberSource";
import { hallCourseCard, hallCourseCardBoxList } from "@/api/hall";
import { courseCardStatus, getListHtml } from "@/utils/enum/select";
import { getSelectHallListAPI } from "@/api/common";
import { useStore } from "vuex";
// template
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const TableList = ref(null);
        // 会员id
        const { id } = useRoute().query;
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    label: "卡号",
                    code: "cardNo",
                },
                {
                    el: "select",
                    code: "hallId",
                    label: "场馆",
                    multiple: false, // 多选
                    filterable: true, // 可搜索
                    remote: true, // 可接收
                    reserveKeyword: true, //保留搜索关键词
                    remoteMethod: (keyword) => ({ name: keyword }),
                    fun: getSelectHallListAPI,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            value: v.id,
                            label: `${v.name}`,
                        })),
                    tips: "输入搜索，下拉选中",
                    required: false,
                },
                {
                    el: "select",
                    code: "courseCardId",
                    label: "课程卡",
                    multiple: false, // 多选
                    filterable: true, // 可搜索
                    remote: true, // 可接收
                    reserveKeyword: true, //保留搜索关键词
                    remoteMethod: (keyword) => ({ name: keyword }),
                    fun: hallCourseCardBoxList,
                    funMode: (res) =>
                        res.data.map((v) => ({
                            value: v.id,
                            label: `${v.name}`,
                        })),
                    tips: "输入搜索，下拉选中",
                    required: false,
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
            ],
            // 搜索表格--数据
            searchData: {
                memberId: id,
                hallId: store.getters.activeHallId,
            },
            // table表单
            getList: hallCourseCard,
            column: [
                {
                    label: "卡名",
                    prop: "courseCardName",
                },
                {
                    label: "卡号",
                    prop: "cardNo",
                },
                {
                    label: "场馆",
                    prop: "hallName",
                },
                {
                    label: "余额",
                    prop: "balance",
                },
                {
                    label: "生效日期",
                    prop: "startDate",
                },
                {
                    label: "失效日期",
                    prop: "endDate",
                },
                {
                    label: "状态",
                    prop: "status",
                    html: (row, val) => getListHtml(courseCardStatus, val),
                },
                {
                    prop: "action",
                    label: "操作",
                    actives: [
                        {
                            name: "详情",
                            method: (val) => {
                                router.push({
                                    path: "/courseCardManagementz/detail",
                                    query: { id: val.id },
                                });
                            },
                        },
                    ],
                },
            ],
            // 新加编辑弹窗
            popTitle: computed(() => state.showStateObj[state.showState].title),
            buttonConfirm: computed(
                () => state.showStateObj[state.showState].buttonConfirm
            ),
            popFormConfig: {
                default: {
                    disabled: computed(() =>
                        state.showState == 3 ? true : false
                    ),
                },
                buttons: [],
            },
            showState: 1,
            showStateObj: {
                1: {
                    title: "新加",
                    buttonConfirm: "确认",
                },
                2: {
                    title: "编辑",
                    buttonConfirm: "确认",
                },
                3: {
                    title: "查看",
                    buttonConfirm: "",
                },
            },
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
                        console.log("value", value);
                        return;

                        state.popShow = false;
                        if (state.showState == 1) {
                            memberSourcePost(value).then(({ code, data }) => {
                                if (code == 200) {
                                    TableList.value.update();
                                }
                            });
                        }
                    },
                },
            ],
            popItemList: [
                {
                    code: "name",
                    label: "来源名称",
                },
            ],
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
