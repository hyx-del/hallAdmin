<!--
 * @Author: 吴欣欣
 * @Date: 2022-01-14 16:45:12
 * @LastEditors: 吴欣欣
 * @LastEditTime: 2022-01-14 16:45:12
 * @Descripttion:会员列表
-->
<template>
    <div>
        <formList
            :config="searchConfig"
            :itemList="searchList"
            :formInitData="searchData"
            :buttons="buttons"
        />
        <Table
            ref="TableList"
            :loadData="getList"
            :column="column"
            :params="searchData"
            :showSortIndex="{ show: true, lable: '序号' }"
        >
        </Table>
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive,  } from "vue";
import { useRoute } from "vue-router";
import { tabelFormConfig } from "@/utils/config";
import { courseCardBindMember, courseMemberPageList } from "@/api/membershipCourseCard";
import { ElMessage } from "element-plus";

// template
export default {
    components: {
        formList,
        Table,
    },
    emits:["onSubmits"],
    setup(props,{emit}) {
        const {id}=useRoute().query
        const TableList = ref(null);
        const state = reactive({
            // 搜索表单--搜索项
            searchList: [
                {
                    code: "contact",
                    label: "手机号",
                },

            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--数据
            searchData: {
                memberCourseCardId:id
            },
            // 搜索表格--按钮
            buttons: [
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click: ({ value }) => {
                        TableList.value.update({...value,memberCourseCardId: id});
                    },
                }
            ],
            // table表单
            getList: courseMemberPageList,
            column: [
                { prop: "name", label: "会员姓名" },
                {
                    prop: "contact",
                    label: "手机号",
                },
                {
                    prop: "action",
                    label: "操作",
                    width: 120,
                    actives: [
                        {
                            name: "绑定",
                            method: (val) => {
                                let data={
                                    memberCourseCardId:id,
                                    memberId:val.id
                                }
                                courseCardBindMember(data).then(()=>{
                                    ElMessage.success("绑定成功")
                                    emit("onSubmits")
                                })
                            },
                        },
                    ],
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

<style lang="scss" scoped></style>
