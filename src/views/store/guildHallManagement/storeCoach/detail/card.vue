<!--
 * @Author: 刘帝君
 * @Date: 2021-12-02 14:58:53
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-01-19 09:25:35
 * @Descripttion: 卡片多选
-->
<template>
    <div>
        <el-card class="box-card" v-for="item in cities" :key="item.cityId">
            <template #header>
                <div class="card-header">
                    <span>{{ item.cityName }}</span>
                    <el-checkbox
                        @change="(val) => handleCheckAllChange(val, item)"
                        :indeterminate="itemIndeterminate(item)"
                        v-model="item.checkAll"
                        disabled
                        >全选</el-checkbox
                    >
                </div>
            </template>
            <div class="text item">
                <el-checkbox-group v-model="checkedCities">
                    <el-checkbox
                        v-for="city in item.hallAllListVOList"
                        :key="city.provinceId"
                        :label="city"
                        disabled
                        >{{ city.hallName }}</el-checkbox
                    >
                </el-checkbox-group>
            </div>
        </el-card>

        <el-button @click="save">保存</el-button>
    </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";

export default {
    props: {
        listData: {
            type: Array,
            default: [],
        },
        echoData: {
            type: Array,
            default: [],
        },
    },
    setup(props, context) {
        const { emit } = context;
        const state = reactive({
            cities: [],
            checkedCities: [],
            data: props.listData,
        });

        onMounted(() => {
            state.cities = state.data.map((v) => ({
                ...v,
                checkAll: false,
            }));

            if (props.echoData) {
                console.log(props.echoData, "回显的数据");
                // 回显
                let all = [];
                state.cities.forEach((v) => all.push(...v.hallAllListVOList));
                const values = props.echoData;
                state.checkedCities = all.filter((v) =>
                    values.find((item) => item.hallId == v.hallId)
                );
            }
        });

        //判断是否是不确定
        const itemIndeterminate = (item) => {
            return (
                item.hallAllListVOList.some(
                    (v) => state.checkedCities.indexOf(v) > -1
                ) &&
                !item.hallAllListVOList.every(
                    (v) => state.checkedCities.indexOf(v) > -1
                )
            );
        };
        const handleCheckAllChange = (val, item) => {
            const filterArr = state.checkedCities.filter(
                (v) => item.hallAllListVOList.indexOf(v) === -1
            );
            state.checkedCities = val
                ? filterArr.concat(item.hallAllListVOList)
                : filterArr;
        };
        const save = () => {
            let result = state.cities
                .map((v) => ({
                    // cityName: v.cityName,
                    // cityId: v.cityId,
                    hallAllListVOList: v.hallAllListVOList.filter(
                        (v) => state.checkedCities.indexOf(v) > -1
                    ),
                }))
                .filter((v) => v.hallAllListVOList.length);
            emit("comesBack", result);
        };
        return {
            ...toRefs(state),
            save,
            itemIndeterminate,
            handleCheckAllChange,
        };
    },
};
</script>

<style lang="scss" scoped>
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
