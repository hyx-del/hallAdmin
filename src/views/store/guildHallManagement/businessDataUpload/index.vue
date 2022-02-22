<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 14:10:27
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-23 14:10:28
 * @Descripttion: 营业数据上传
-->
<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="上传失败" name="1">
            <Table
                v-if="activeName==1"
                ref="TableFail"
                :loadData="getListFail"
                :column="columnFail"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </el-tab-pane>
        <el-tab-pane label="上传中" name="2">
            <Table
                v-if="activeName==2"
                ref="TableFail"
                :loadData="getListIng"
                :column="columnIng"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </el-tab-pane>
        <el-tab-pane label="订单上传记录" name="3">
            <formList
                :config="searchConfig"
                :buttons="buttons"
                :itemList="searchList"
                :formInitData="searchData"
            />
            <Table
                v-if="activeName==3"
                ref="TableUp"
                :loadData="getListUp"
                :column="columnUp"
                :showSortIndex="{ show: true, lable: '序号' }"
            />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { reactive, toRefs,ref } from "vue";
import popupForm from '@/components/FormList/popupForm'
import formList from '@/components/FormList'
import Table from '@/components/Table'
import emptyBox from "@/components/emptyBox/index.vue";
import {testApi} from '@/api/managerStaff'
import {booleanList, enableDisable, genderList, testList} from '@/utils/enum/select'
import {tabelFormConfig} from '@/utils/config'

export default {
    components: {
        popupForm,
        formList,
        Table,
        emptyBox,
    },
    setup() {
        const TableFail = ref(null);
        const TableIng = ref(null);
        const TableUp = ref(null);
        const state = reactive({
            activeName:'1',
            getListFail:testApi,
            columnFail:[
                {
                    label: 'ID',
                    prop: 'aaa65435',
                },
                {
                    label: '订单ID',
                    prop: 'aaa42719',
                },
                {
                    label: '错误',
                    prop: 'aaa34646',
                },
                {
                    label: '重试次数',
                    prop: 'aaa96611',
                },
                {
                    label: '执行时间',
                    prop: 'aaa95903',
                },
            ],
            getListIng:testApi,
            columnIng:[
                {
                    label: 'ID',
                    prop: 'aaa38080',
                },
                {
                    label: '订单ID',
                    prop: 'aaa38429',
                },
                {
                    label: '重试次数',
                    prop: 'aaa97759',
                },
                {
                    label: '上传时间',
                    prop: 'aaa31668',
                },

            ],
            getListUp:testApi,
            columnUp:[
                {
                    label: '序号',
                    prop: 'aaa26212',
                },
                {
                    label: '订单ID',
                    prop: 'aaa24420',
                },
                {
                    label: '交易单号',
                    prop: 'aaa6520',
                },
                {
                    label: '订单类型',
                    prop: 'aaa22361',
                },
                {
                    label: '推送服务',
                    prop: 'aaa50569',
                },
                {
                    label: '推送状态',
                    prop: 'aaa91952',
                },
                {
                    label: '创业时间',
                    prop: 'aaa13510',
                },
                {
                    label: '推送成功时间',
                    prop: 'aaa60083',
                },
            ],
            // 搜索表格--配置
            searchConfig: {
                ...tabelFormConfig,
            },
            // 搜索表格--按钮
            buttons: [],
            // 搜索表格--数据
            searchData: {},
            // 搜索表单--搜索项
            searchList: [
                {
                    el:'select',
                    label: '名称',
                    code: 'aaa78104',
                    list:testList
                },
                {
                    el:'select',
                    label: '推送状态',
                    code: 'aaa92970',
                    list:testList
                },
                {
                    el:'select',
                    label: '推送服务',
                    code: 'aaa95141',
                    list:testList
                },
                {
                    el:'select',
                    label: '订单类型',
                    code: 'aaa86072',
                    list:testList
                },
            ],
        });

        return {
            ...toRefs(state),
            TableFail,
            TableIng,
            TableUp,
        };
    },
};
</script>

<style lang="scss" scoped></style>
