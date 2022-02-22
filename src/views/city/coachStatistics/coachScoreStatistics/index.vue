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
    </div>
</template>

<script>
import formList from "@/components/FormList/index.vue";
import Table from "@/components/Table/index";
import { toRefs, ref, reactive, computed } from "vue";
import {
    updateCourseStatus,
    deleteCourse, courseList,
} from "@/api/school";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {deleteItem, operation} from "@/utils/tools";
import {courseTypeList, displayList, enableDisable, getListHtml, testList} from '@/utils/enum/select'
import popupForm from '@/components/FormList/popupForm'
import {tabelFormConfig} from '@/utils/config'
import {testApi} from '@/api/managerStaff'
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
            // -----------------------
            getList:testApi,
            column:[
                {
                    label: '姓名',
                    prop: 'aaa82843',
                },
                {
                    label: '性别',
                    prop: 'aaa3737',
                },
                {
                    label: '联系方式',
                    prop: 'aaa77562',
                },
                {
                    label: '教练组',
                    prop: 'aaa62377',
                },
                {
                    label: '评分总次数',
                    prop: 'aaa26611',
                },
                {
                    label: '5分',
                    prop: 'aaa21041',
                },
                {
                    label: '4分',
                    prop: 'aaa13879',
                },
                {
                    label: '3分',
                    prop: 'aaa21533',
                },
                {
                    label: '2分',
                    prop: 'aaa59509',
                },
                {
                    label: '1分',
                    prop: 'aaa49306',
                },
                {
                    label: '平均分',
                    prop: 'aaa55102',
                },
            ],
            formInitData: {},
            itemList:[
                {
                    label: '教练名称',
                    code: 'aaa67552',
                },
                {
                    label: '教练手机号',
                    code: 'aaa45080',
                },
                {
                    el:'select',
                    label: '评分',
                    code: 'aaa13658',
                    list:testList
                },
                {
                    el:'select',
                    label: '月份',
                    code: 'aaa66013',
                    list:testList
                },
            ],
            config : tabelFormConfig,
            buttons:[
                {
                    funType: "confirm",
                    type: "primary",
                    name: "搜索",
                    click:({value})=>{
                        TableList.value.update({...value})
                    }
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
</style>
