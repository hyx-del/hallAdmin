<!--
 * @Author: 刘帝君
 * @Date: 2021-11-26 15:52:42
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-24 13:30:59
 * @Descripttion: 教练详情
-->
<template>
    <div>
        <h2>教练详情</h2>
        <div class="studentDetaile">
            <el-row>
                <el-col :span="4" class="border-right">
                    <div class="studentDetaileLeft">
                        <div>
                            <img :src="formInitData.avatar" alt="" />
                        </div>
                        <div>姓名:{{ formInitData.name }}</div>
                        <div>电话:{{ formInitData.mobile }}</div>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="studentDetaileRight">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="基本信息" name="first">
                                <basicInformation
                                    v-if="
                                        activeName == 'first' &&
                                        formInitData.name
                                    "
                                    :formInitData="formInitData"
                                ></basicInformation>
                            </el-tab-pane>
                            <el-tab-pane label="场馆" name="second">
                                <venues v-if="activeName == 'second'"></venues>
                            </el-tab-pane>
                            <el-tab-pane label="可授课程" name="third">
                                <course v-if="activeName == 'third'"></course>
                            </el-tab-pane>
                            <el-tab-pane label="课时限制" name="fourth">
                                <classLimit
                                    v-if="activeName == 'fourth'"
                                ></classLimit>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { basicInformationAPI } from "@/api/coach";
import basicInformation from "./basicInformation"; //基本信息
import venues from "./venues"; //场馆
import course from "./course"; //可授课程
import classLimit from "./classLimit"; //课时限制
export default {
    components: {
        basicInformation,
        venues,
        course,
        classLimit,
    },
    watch() {},
    setup() {
        const state = reactive({
            activeName: "first",
            formInitData: {},
        });

        onMounted(() => {
            if (useRoute().query.id) {
                basicInformationAPI({ id: useRoute().query.id }).then((res) => {
                    const { code, data } = res;
                    if (code == 200) {
                        const dataObj = { ...data, ...data.staffVO };
                        console.log(dataObj, "会馆教练详情");
                        state.formInitData = dataObj;
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

<style lang="scss" scoped>
.w90 {
    width: 90px;
}
.cf {
    cursor: pointer;
    color: #409eff;
}
.studentDetaile {
    padding-top: 10px;
    color: #333;
    border-top: 1px solid #ccc;
    .border-right {
        border-right: 1px solid #ccc;
    }
    .studentDetaileLeft {
        text-align: center;
        line-height: 30px;
        padding-top: 14px;
        div {
            margin-top: 10px;
        }
        img {
            max-width: 100px;
            max-height: 100px;
        }
    }
    .studentDetaileRight {
        padding-left: 10px;
    }
}
.findPhone {
    padding: 5px 0;
    line-height: 1;
    position: relative;
    .findBtn {
        position: absolute;
        right: 50px;
        top: -36px;
    }
}
</style>
