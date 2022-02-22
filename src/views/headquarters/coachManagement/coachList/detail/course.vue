<!--
 * @Author: 刘帝君
 * @Date: 2021-12-02 09:56:42
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-12-28 14:59:07
 * @Descripttion: 教练详情/可授课程
-->
<template>
    <div>
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
                <el-checkbox-group v-model="checkedCities">
                    <el-checkbox
                        v-for="city in item.courseAllListVOS"
                        :key="city.id"
                        :label="city"
                        >{{ city.name }}</el-checkbox
                    >
                </el-checkbox-group>
            </div>
        </el-card>
        <div style="text-align: center">
            <el-button type="primary" size="small" @click="save"
                >保存</el-button
            >
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { classLimitAPI, courseSaveAPI, courseCheckedAPI } from "@/api/coach";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
export default {
    setup() {
        const state = reactive({
            cities: [],
            checkedCities: [],
            data: [],
            id: useRoute().query.id,
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
            // 保存
            save: () => {
                let result = state.cities
                    .map((v) => ({
                        courseAllListVOS: v.courseAllListVOS.filter(
                            (v) => state.checkedCities.indexOf(v) > -1
                        ),
                    }))
                    .filter((v) => v.courseAllListVOS.length);

                let coachCourseListDTOS = [];
                result.forEach((e) => {
                    e.courseAllListVOS.forEach((val) => {
                        coachCourseListDTOS.push({
                            courseId: val.id,
                            courseType: val.type,
                            // name: val.name,
                        });
                    });
                });

                console.log(coachCourseListDTOS);

                // 保存
                courseSaveAPI({
                    coachId: state.id,
                    coachCourseListDTOS,
                }).then((res) => {
                    const { code } = res;
                    console.log(res);

                    if (code == 200) {
                        ElMessage.success("保存成功");
                    }
                });
            },
        });

        // 详情
        const courseChecked = () => {
            courseCheckedAPI({ coachId: state.id }).then((res) => {
                const { code } = res;
                if (code == 200) {
                    console.log(res, "可授课程详情");
                    let dataArr = [];
                    res.data.forEach((val) => {
                        dataArr.push({
                            id: val.courseId,
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
            });
        };

        onMounted(() => {
            classLimitAPI({ coachId: "" }).then((res) => {
                const { code } = res;
                if (code == 200) {
                    state.data = res.data.courseTypeVOS;
                    console.log(res.data.courseTypeVOS, "可授课程");
                    state.cities = res.data.courseTypeVOS.map((v) => ({
                        ...v,
                        checkAll: false,
                    }));
                    courseChecked();
                }
            });
        });

        return {
            ...toRefs(state),
            courseChecked,
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
