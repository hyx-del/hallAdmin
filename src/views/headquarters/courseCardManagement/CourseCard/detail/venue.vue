<!--
 * @Author: 刘帝君
 * @Date: 2021-12-01 10:54:43
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-06 10:45:53
 * @Descripttion: 课程管理卡详情/城市、场馆
-->
<template>
    <div>
        <el-row>
            <el-col :span="4" class="cols">
                <div v-for="(val, index) in dataList" :key="index" class="city">
                    <div class="cityTitle" @click="clickStore(val, '1')">
                        {{ val.cityName }}
                    </div>
                    <div
                        v-for="(vals, i) in val.halls"
                        :key="i"
                        :class="
                            vals.hallId == cityShops.hallId ? 'bg' : 'cityShop'
                        "
                        @click="clickStore(vals, '2')"
                    >
                        {{ vals.hallName }}
                    </div>
                </div>
            </el-col>
            <el-col :span="18" style="margin-left: 30px">
                <div class="price">
                    设置规格价格
                    <el-button
                        type="primary"
                        size="small"
                        @click="submitForm(cityShops)"
                        style="margin-left: 30px"
                    >
                        保存
                    </el-button>
                </div>
                <div>
                    选择城市：<span>{{ cityShops.cityName }}</span>
                </div>
                <div v-if="cityShops.hallName">
                    选择场馆：<span>{{ cityShops.hallName }}</span>
                </div>
                <div
                    v-for="(v, i) in specifications"
                    :key="i"
                    style="margin-top: 20px"
                >
                    <div>
                        规格：<span
                            >{{ v.courseCardSpecs.amount }}次/{{
                                v.courseCardSpecs.price
                            }}元</span
                        >
                    </div>
                    <div>
                        当前价格：<el-input
                            v-model="v.price"
                            style="width: 260px"
                        />元
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import {
    venueListAreaAPI,
    venueDetailAPI,
    venueSaveAPI,
} from "@/api/courseCardManagement";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
export default {
    setup() {
        const state = reactive({
            id: useRoute().query.id,
            dataList: [],
            input: "",
            cityShops: {},
            isShowId: "",
            // 查询单个门店或城市的价格
            clickStore: (val, num) => {
                state.cityShops = val;
                state.isShowId = num;
                venueDetailAPI({
                    courseCardId: state.id,
                    hallId: num == "1" ? null : val.hallId,
                    cityId: num == "2" ? null : val.cityId,
                }).then((res) => {
                    const { code, data } = res;
                    console.log(data, "查询单个门店的价格");
                    state.specifications = data;
                });
            },
            specifications: [],
            // 点击保存
            submitForm: (val) => {
                console.log(val, "val");
                state.specifications.forEach((e) => {
                    e.cityId = state.isShowId == "2" ? null : val.cityId;
                    e.hallId = state.isShowId == "1" ? null : val.hallId;
                });
                // 保存
                venueSaveAPI({
                    courseCardSpecsPriceLevelList: state.specifications,
                }).then((res) => {
                    const { code, data } = res;
                    console.log(res, "保存");
                    if (code == 200) {
                        ElMessage.success("保存成功");
                    }
                });
            },
        });
        onMounted(() => {
            // 侧边栏
            venueListAreaAPI().then((res) => {
                const { code, data } = res;
                state.dataList = data;
                console.log(data, "侧边栏");
            });
        });

        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped>
.city {
    margin-left: 40px;
    .cityTitle {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 10px;
        cursor: pointer;
    }
    .cityShop {
        margin-bottom: 10px;
        text-align: center;
        cursor: pointer;
    }
    .bg {
        margin-bottom: 10px;
        text-align: center;
        cursor: pointer;
        background-color: #f3f3f3;
    }
}
.price {
    padding-bottom: 20px;
    font-size: 16px;
    font-weight: bold;
}
.cols {
    border-right: 1px solid #ccc;
    overflow-y: scroll;
    height: 700px;
}
</style>
