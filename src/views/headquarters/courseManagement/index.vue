<template>
    <div>
        <formList
            :config="config"
            :itemList="itemList"
            :formInitData="formInitData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="formInitData"
            :showSortIndex="{ show: true, lable: '序号' }"
        />
        <popupForm
            v-model:show="popShow"
            v-model:formInitData="popFormInitData"
            title="新加课程"
            :itemList="popItemList"
            :buttons="buttonsPop"
        />
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    courseListClass,
    updateCourseStatus,
    deleteCourse,
    courseList,
} from "@/api/school";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { deleteItem } from "@/utils/tools";
import {
    courseDeleteDelete,
    courseDisplayPut,
    coursePage, courseSavePost,
    courseStatusPut,
} from "@/api/course";
import {
    booleans,
    courseTypeList,
    displayList,
    enableDisable,
    getListHtml,
    testList,
} from "@/utils/enum/select";
import popupForm from "@/components/FormList/popupForm";
import { itemList } from "./itemList";
export default {
    components: {
        popupForm,
        formList,
        Table,
    },
    setup() {
        const router = useRouter();
        const TableList = ref(null);
        const state = reactive({
            popShow: false,
            popFormInitData: {},
            buttonsPop: [
                {
                    text: "取消",
                    click: () => (state.popShow = false),
                },
                {
                    funType: "confirm",
                    text: "保存",
                    type: "primary",
                    click: ({ value }) => {
                        console.log(value);
                        courseSavePost(value).
                        then(({code, data}) => {
                            ElMessage.success('添加成功')
                        }).finally(()=>{
                            state.popShow=false
                        })
                    },
                },
            ],
            popItemList: itemList,
            getList: coursePage,
            column: [
                {
                    prop: "id",
                    label: "ID",
                },
                {
                    prop: "name",
                    label: "名称",
                },
                {
                    prop: "nameEn",
                    label: "英文名称",
                },
                {
                    prop: "typeName",
                    label: "课程种类",
                },
                {
                    prop: "duration",
                    label: "时长（分钟）",
                },
                {
                    prop: "maxNumber",
                    label: "单节课可约人数",
                },
                {
                    prop: "minNumber",
                    label: "最少上课人数",
                },
                // {
                //     prop: "display",
                //     label: "是否显示在小程序",
                //     html: (row, value) => getListHtml(booleans, value),
                // },
                {
                    prop: "status",
                    label: "状态",
                    html: (row, value) => getListHtml(enableDisable, value),
                },

                {
                    prop: "action",
                    label: "操作",
                    width: 200,
                    actives: [
                        {
                            name: "编辑",
                            method: (val) => {
                                router.push({
                                    path: "/courseManagementz/courseManagement/detail",
                                    query: { id: val.id },
                                });
                            },
                        },
                        {
                            show: () => {},
                            name: (e) => (e.status === 1 ? "禁用" : "启用"),
                            method: (val) =>
                                courseStatusPut({
                                    id: val.id,
                                    status: val.status,
                                }).then(({ code }) => {
                                    if (code === 200) {
                                        ElMessage.success("操作成功");
                                        TableList.value.update();
                                    }
                                }),
                        },
                        {
                            name: "删除",
                            method: (val) =>
                                deleteItem(val, courseDeleteDelete, TableList),
                        },
                        {
                            name: ({display})=>display?"隐藏":'显示',
                            method: (val) =>
                                deleteItem(val, courseDisplayPut, TableList, {
                                    title: `确认在小程序${val.display?'隐藏':'显示'}吗?`,
                                    success: `${val.display?'隐藏':'显示'}成功!`,
                                }),
                        },
                    ],
                },
            ],
            formInitData: {},
            itemList: [
                {
                    lableShow: false,
                    code: "name",
                    label: "名称",
                },
                {
                    el: "select",
                    code: "type",
                    label: "课程种类",
                    list: courseTypeList,
                },
                {
                    el: "select",
                    code: "display",
                    label: "是否显示在小程序",
                    list: displayList,
                },
                {
                    el: "select",
                    code: "status",
                    label: "状态",
                    list: enableDisable,
                },
            ],
            config: {
                allRequired: false, // 是否全部必填
                inline: true, //行内
                colon: "",
                inputStyle: {
                    width: "200px",
                },
            },
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update(value);
                    },
                },
                {
                    name: "新 增",
                    click: (value) => {
                        state.popShow = true;
                    },
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
</style>
