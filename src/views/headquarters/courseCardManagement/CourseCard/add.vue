<!--
 * @Author: 刘帝君
 * @Date: 2021-11-30 09:37:03
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-15 16:10:13
 * @Descripttion: 课程卡管理新增
-->
<template>
    <div class="courseCard">
        <el-form
            ref="ruleForm"
            :model="form"
            label-width="150px"
            class="demo-ruleForm"
        >
            <el-form-item
                label="名称："
                prop="name"
                :rules="[
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur',
                    },
                    {
                        min: 0,
                        max: 30,
                        message: '长度不能超过30个字符',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item
                label="类型："
                prop="type"
                :rules="[
                    {
                        required: true,
                        message: '请输入类型',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-radio-group v-model="form.type">
                    <el-radio :label="1">次卡</el-radio>
                    <el-radio :label="2">期限卡</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="可上课类型："
                prop="courseType"
                :rules="[
                    {
                        required: true,
                        message: '请输入可上课类型',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-radio-group v-model="form.courseType">
                    <el-radio :label="1">团课</el-radio>
                    <el-radio :label="2">私教课</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="体验卡："
                prop="isExperienceCard"
                :rules="[
                    {
                        required: true,
                        message: '请输入可体验卡',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-radio-group v-model="form.isExperienceCard">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="通用类型：">
                <el-select v-model="form.generalType" placeholder="" clearable>
                    <el-option label="全国通" :value="1"></el-option>
                    <el-option label="城市通" :value="2"></el-option>
                    <el-option label="单店" :value="3"></el-option>
                    <el-option label="通店" :value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="开卡电子合同模板："
                prop="contractTemplateId.electronic_id"
                :rules="[
                    {
                        required: true,
                        message: '请输入开卡电子合同模板',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-select
                    v-model="form.contractTemplateId.electronic_id"
                    placeholder=""
                    clearable
                >
                    <el-option
                        v-for="(val, i) in electronic"
                        :key="i"
                        :label="val.title"
                        :value="val.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="开卡纸质合同模板："
                prop="contractTemplateId.paper_id"
                :rules="[
                    {
                        required: true,
                        message: '请输入开卡纸质合同模板',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-select
                    v-model="form.contractTemplateId.paper_id"
                    placeholder=""
                    clearable
                >
                    <el-option
                        v-for="(val, i) in paper"
                        :key="i"
                        :label="val.title"
                        :value="val.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="最大绑定会员数："
                prop="maxBind"
                :rules="[
                    { required: true, message: '最大绑定会员数不能为空' },
                    { type: 'number', message: '最大绑定会员数必须为数字值' },
                    {
                        pattern: /(^[0-9]{1,7}$)/,
                        message: '长度不能超过7位数',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model.number="form.maxBind" clearable></el-input>
            </el-form-item>
            <el-form-item
                label="顺序："
                prop="weight"
                :rules="[
                    { type: 'number', message: '顺序必须为数字值' },
                    {
                        pattern: /^[0-9]{1,10}$/,
                        message: '长度不能超过10位数',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model.number="form.weight" clearable></el-input>
            </el-form-item>
            <el-form-item
                label="简介"
                prop="introduction"
                :rules="[
                    {
                        min: 0,
                        max: 255,
                        message: '长度不能超过255个字符',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input
                    v-model="form.introduction"
                    type="textarea"
                ></el-input>
            </el-form-item>
            <div class="title">使用限制</div>
            <el-form-item
                label="最大同行人数："
                prop="maxCompanion"
                :rules="[
                    { type: 'number', message: '最大同行人数必须为数字值' },
                    {
                        pattern: /^0$|^[1-9][0-9]{0,2}$|^999$/,
                        message: '最大同行人数不能超过999',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input
                    v-model.number="form.maxCompanion"
                    clearable
                    placeholder="请输入最大同行人数"
                ></el-input>
                <span>人</span>
            </el-form-item>
            <el-form-item
                label="可提前预约："
                prop="maxOrder"
                :rules="[
                    { type: 'number', message: '可提前预约必须为数字值' },
                    {
                        pattern: /^[0-9]{1,3}$/,
                        message: '长度不能超过3位数',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model.number="form.maxOrder" clearable></el-input
                >节课
            </el-form-item>
            <div class="selectCourse">
                <el-select
                    v-model="form.classLimit.cycle_type"
                    clearable
                    style="width: 90px"
                >
                    <el-option label="每天" value="day"></el-option>
                    <el-option label="每周" value="week"></el-option>
                    <el-option label="每月" value="month"></el-option>
                </el-select>
                <span>共计可上</span>
                <el-input-number
                    style="width: 394px"
                    v-model="form.classLimit.count"
                    :min="1"
                    :max="999"
                />节课
            </div>
            <el-form-item
                label="每个会员限购："
                prop="maxPurchase"
                :rules="[
                    { type: 'number', message: '每个会员限购必须为数字值' },
                    {
                        pattern: /^\+?[1-9]\d{0,3}(\.\d*)?$/,
                        message: '每个会员限购10000张',
                        trigger: 'blur',
                    },
                ]"
            >
                <el-input v-model.number="form.maxPurchase" clearable></el-input
                >张
            </el-form-item>
            <div class="selectCourse">
                <span>限制：</span>
                <el-select
                    v-model="form.timeLimit.cycle_type"
                    clearable
                    style="width: 108px; margin-right: 20px"
                >
                    <el-option label="每天" value="day"></el-option>
                    <el-option label="每周" value="week"></el-option>
                    <el-option label="每月" value="month"></el-option>
                </el-select>

                <el-date-picker
                    v-model="form.timeLimit.month_day"
                    type="month"
                    placeholder="选择月"
                    style="width: 130px; margin-right: 10px"
                    v-if="form.timeLimit.cycle_type == 'month'"
                    format="YYYY-MM"
                    value-format="M"
                >
                </el-date-picker>

                <el-select
                    v-model="form.timeLimit.week_day"
                    clearable
                    style="width: 130px; margin-right: 10px"
                    v-if="form.timeLimit.cycle_type == 'week'"
                >
                    <el-option label="星期一" :value="1"></el-option>
                    <el-option label="星期二" :value="2"></el-option>
                    <el-option label="星期三" :value="3"></el-option>
                    <el-option label="星期四" :value="4"></el-option>
                    <el-option label="星期五" :value="5"></el-option>
                    <el-option label="星期六" :value="6"></el-option>
                    <el-option label="星期天" :value="7"></el-option>
                </el-select>

                <el-time-picker
                    v-model="form.timeLimit.time_all"
                    is-range
                    range-separator="-"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    style="width: 230px"
                    format="HH:mm"
                    value-format="HH:mm"
                >
                </el-time-picker>

                使用
            </div>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">
                    确定
                </el-button>
                <el-button @click="cancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import {
    addCourseCardManagement,
    contractDropDownAPI,
    contractDetailAPI,
    contractEditorAPI,
} from "@/api/courseCardManagement";
export default {
    setup() {
        const ruleForm = ref(null);
        const router = useRouter();
        const state = reactive({
            // 电子合同
            electronic: [],
            // 纸质合同
            paper: [],
            id: useRoute().query.id,
            form: {
                name: "", //名称
                type: "", //类型
                courseType: "", //可上课类型
                isExperienceCard: 0, //体验卡
                generalType: "", //通用类型
                contractTemplateId: {
                    electronic_id: "", //开卡电子合同模板
                    paper_id: "", //开卡纸质合同模板
                },
                maxBind: "", //最大绑定会员数
                weight: "", //权重
                introduction: "", //简介
                maxCompanion: "", //最大同行人数
                maxOrder: "", //可提前预约
                classLimit: {
                    cycle_type: "", //周期
                    count: "", //可上几节课
                },
                maxPurchase: "", //每个会员限购
                timeLimit: {
                    cycle_type: "", //限制周期
                    time_all: null, //时间
                },
            },
            submitForm: () => {
                ruleForm.value.validate((valid) => {
                    if (valid) {
                        // 开始时间
                        state.form.timeLimit.start_time = state.form.timeLimit
                            .time_all
                            ? state.form.timeLimit.time_all[0]
                            : "00:00";
                        // 结束时间
                        state.form.timeLimit.end_time = state.form.timeLimit
                            .time_all
                            ? state.form.timeLimit.time_all[1]
                            : "00:00";

                        let forData = { ...state.form };
                        forData.classLimit = JSON.stringify(forData.classLimit);
                        forData.timeLimit = JSON.stringify(forData.timeLimit);
                        forData.contractTemplateId = JSON.stringify(
                            forData.contractTemplateId
                        );
                        console.log(forData, "forData");
                        if (state.id) {
                            // 编辑
                            contractEditorAPI({ ...forData }).then((res) => {
                                const { code } = res;
                                if (code == 200) {
                                    ElMessage.success("操作成功");
                                    router.back();
                                }
                            });
                        } else {
                            // 新增
                            addCourseCardManagement({ ...forData }).then(
                                (res) => {
                                    const { code } = res;
                                    if (code == 200) {
                                        ElMessage.success("操作成功");
                                        router.back();
                                    }
                                }
                            );
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            cancel() {
                router.back();
            },
        });

        onMounted(() => {
            // 电子合同
            contractDropDownAPI({ paper: "2" }).then(({ code, data }) => {
                state.electronic = data;
                console.log("电子合同", data);
            });

            // 纸质合同
            contractDropDownAPI({ paper: "1" }).then(({ code, data }) => {
                state.paper = data;
                console.log("纸质合同", data);
            });

            if (useRoute().query.id) {
                // 回显数据
                contractDetailAPI({ id: useRoute().query.id }).then((res) => {
                    const { code, data } = res;
                    if (code == 200) {
                        console.log(res.data, "回显数据");
                        data.classLimit = data.classLimit
                            ? JSON.parse(data.classLimit)
                            : {
                                  cycle_type: "", //周期
                                  count: "", //可上几节课
                              };
                        if (data.timeLimit) {
                            data.timeLimit = JSON.parse(data.timeLimit);
                            if (data.timeLimit.month_day) {
                                data.timeLimit.month_day =
                                    data.timeLimit.month_day + "";
                            }
                            if (data.timeLimit.start_time) {
                                data.timeLimit.time_all = [
                                    data.timeLimit.start_time,
                                    data.timeLimit.end_time,
                                ];
                            } else {
                                data.timeLimit.time_all = ["00:00", "00:00"];
                            }
                        } else {
                            data.timeLimit = {
                                cycle_type: "", //限制周期
                                time_all: null, //时间
                            };
                        }
                        data.contractTemplateId = data.contractTemplateId
                            ? JSON.parse(data.contractTemplateId)
                            : {
                                  electronic_id: "", //开卡电子合同模板
                                  paper_id: "", //开卡纸质合同模板
                              };
                        state.form = data;
                    }
                });
            }
        });

        return {
            ...toRefs(state),
            ruleForm,
        };
    },
};
</script>

<style lang="scss" scoped>
.courseCard {
    .title {
        font-size: 16px;
        font-weight: bold;
        padding-left: 20px;
        margin: 20px 0;
    }
    .selectCourse {
        margin: 10px 0 20px 40px;
        span {
            margin: 0 10px;
        }
    }
    .el-input {
        width: 450px;
    }
    .el-select {
        width: 450px;
    }
    .el-textarea {
        width: 450px;
    }
}
</style>
