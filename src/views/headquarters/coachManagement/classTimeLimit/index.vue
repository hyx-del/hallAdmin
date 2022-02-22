<!--
 * @Author: 刘帝君
 * @Date: 2021-11-23 10:56:15
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-09 10:42:31
 * @Descripttion: 课时限制设置
-->
<template>
    <div>
        <div class="monthTotal">
            月总课时限制：
            <el-input-number
                v-model="timeLimit"
                :min="0"
                style="width: 260px; margin-right: 10px"
            />
            <el-button type="primary" size="small" @click="save"
                >保存</el-button
            >
            <el-button type="danger" size="small" @click="expurgate"
                >删除设置</el-button
            >
        </div>
        <el-card class="box-card" v-for="item in cities" :key="item.type">
            <template #header>
                <div class="card-header">
                    <span>{{ item.typeName }}</span>
                    <el-checkbox
                        @change="(val) => handleCheckAllChange(val, item)"
                        :indeterminate="itemIndeterminate(item)"
                        v-model="item.checkAll"
                        >全选</el-checkbox
                    >
                </div>
            </template>
            <div class="text item">
                <el-checkbox-group
                    v-model="checkedCities"
                    @change="handleCheckedCitiesChange"
                >
                    <el-checkbox
                        v-for="city in item.courseAllListVOS"
                        :key="city.id"
                        :label="city"
                        >{{ city.name }}</el-checkbox
                    >
                </el-checkbox-group>
            </div>
        </el-card>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { classLimitAPI, classDetailAPI, classSaveAPI } from "@/api/coach";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
export default {
    setup() {
        const state = reactive({
            cities: [],
            checkedCities: [],
            data: [],
            timeLimit: "",
            itemIndeterminate: (item) => {
                return (
                    item.courseAllListVOS.some(
                        (v) => state.checkedCities.indexOf(v) > -1
                    ) &&
                    !item.courseAllListVOS.every(
                        (v) => state.checkedCities.indexOf(v) > -1
                    )
                );
            },
            handleCheckAllChange: (val, item) => {
                const filterArr = state.checkedCities.filter(
                    (v) => item.courseAllListVOS.indexOf(v) === -1
                );
                state.checkedCities = val
                    ? filterArr.concat(item.courseAllListVOS)
                    : filterArr;
            },
            handleCheckedCitiesChange: (value) => {
                console.log(value, "value");
                console.log(state.cities, "这是cities");
                console.log(state.checkedCities, "这是checkedCities");
                // const checkedCount = value.length;
                // checkAll.value = checkedCount === cities.length;
                // isIndeterminate.value =
                //     checkedCount > 0 && checkedCount < cities.length;
            },
            // 保存
            save: () => {
                const reg = /^[0-9,]*$/;
                if (reg.test(state.timeLimit)) {
                    state.timeLimit = state.timeLimit + "";
                    if (state.timeLimit.length > 4) {
                        ElMessage.warning("课时限制长度不能超过4");
                    } else {
                        let result = state.cities
                            .map((v) => ({
                                courseAllListVOS: v.courseAllListVOS.filter(
                                    (v) => state.checkedCities.indexOf(v) > -1
                                ),
                            }))
                            .filter((v) => v.courseAllListVOS.length);

                        let limitCourses = [];
                        result.forEach((e) => {
                            e.courseAllListVOS.forEach((val) => {
                                limitCourses.push(val.id);
                            });
                        });
                        console.log(limitCourses);
                        // 保存
                        classSaveAPI({
                            timeLimit: state.timeLimit,
                            coachId: 0,
                            limitCourses,
                        }).then((res) => {
                            const { code } = res;
                            console.log(res);
                            if (code == 200) {
                                ElMessage.success("保存成功");
                            }
                        });
                    }
                } else {
                    ElMessage.warning("课时限制请输入正整数!");
                }
            },
            // 删除
            expurgate: () => {
                state.checkedCities = [];
            },
        });

        // 详情
        const classDetail = () => {
            classDetailAPI({ coachId: 0 }).then((res) => {
                const { code } = res;
                if (code == 200) {
                    state.timeLimit = res.data.timeLimit;
                    if (res.data.limitCoursesArr) {
                        console.log(res, "课时限制详情");
                        let dataArr = [];
                        res.data.limitCoursesArr.forEach((val) => {
                            dataArr.push({
                                id: val,
                            });
                        });
                        // 回显
                        let all = [];
                        state.cities.forEach((v) =>
                            all.push(...v.courseAllListVOS)
                        );
                        const values = dataArr;
                        state.checkedCities = all.filter((v) =>
                            values.find((item) => item.id == v.id)
                        );
                    }
                }
            });
        };

        onMounted(() => {
            // 查询多选数据
            classLimitAPI().then((res) => {
                const { code } = res;
                if (code == 200) {
                    state.data = res.data.courseTypeVOS;
                    console.log(res.data.courseTypeVOS, "课时限制");
                    state.cities = res.data.courseTypeVOS.map((v) => ({
                        ...v,
                        checkAll: false,
                    }));
                    classDetail();
                }
            });
        });

        return {
            ...toRefs(state),
            classDetail,
        };
    },
};
</script>

<style lang="scss" scoped>
.monthTotal {
    margin: 10px 0;
}
.box-card {
    margin-bottom: 20px;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
}
.el-checkbox {
    width: 184px;
    margin-bottom: 6px;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}
</style>
