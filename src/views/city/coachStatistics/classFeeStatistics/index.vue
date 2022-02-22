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
                    label: '教练',
                    prop: 'aaa35768',
                },
                {
                    label: '团课节数',
                    prop: 'aaa69112',
                },
                {
                    label: '私教课节数',
                    prop: 'aaa80147',
                },
                {
                    label: '企业课节数',
                    prop: 'aaa66749',
                },
                {
                    label: '迟到次数',
                    prop: 'aaa95234',
                },
                {
                    label: '课时费',
                    prop: 'aaa82617',
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
