<!--
 * @Author: aa
 * @Date: 2021-08-25 10:50:14
 * @LastEditors: 刘帝君
 * @LastEditTime: 2022-02-14 16:48:26
 * @Descripttion:
-->
<template>
    <div class="navbar">
        <div class="logo">
            <img src="../../assets/logo.png" alt="" />
        </div>
        <div class="choice">
            <div
                :class="{ active: ['h', 'm', 's'].includes(active) }"
                class="choice_itemF"
                v-if="isHeadquarters"
            >
                <div
                    :class="{ active: ['h', 'm', 's'].includes(active) }"
                    class="head_title noCup"
                >
                    <span
                        class="head_title_icon iconfont icon-icon-zongbu"
                    ></span>
                    <span>总部</span>
                </div>
                <div class="headquarter">
                    <div
                        @click="changeType('h')"
                        :class="{ active: active == 'h' }"
                        class="hall_btn"
                    >
                        <span>会馆</span>
                    </div>
                    <div
                        @click="changeType('s')"
                        :class="{ active: active == 's' }"
                        class="staff_btn"
                    >
                        <span>员工</span>
                    </div>
                    <div
                        @click="changeType('m')"
                        :class="{ active: active == 'm' }"
                        class="members_btn"
                    >
                        <span>会员</span>
                    </div>
                </div>
            </div>
            <!-- v-if="cityOptions.length" -->
            <div
                :class="{ active: active == 'c' }"
                class="choice_item"
                @click="changeType('c')"
            >
                <span class="iconfont icon-icon-xuexiao"></span>
                <span>城市</span>
                <el-select
                    :disabled="active != 'c'"
                    v-model="cityId"
                    placeholder="请选择"
                    @change="changeCity"
                >
                    <el-option
                        v-for="item in cityOptions"
                        :key="item.cityId"
                        :label="item.cityName"
                        :value="item.cityId"
                    >
                    </el-option>
                </el-select>
            </div>
            <!-- v-if="hallOptions.length != 0" -->
            <div
                :class="{ active: active == 'hl' }"
                class="choice_item"
                @click="changeType('hl')"
            >
                <span class="iconfont icon-icon-banji"></span>
                <span>门店</span>
                <el-select
                    v-model="hallId"
                    :disabled="active != 'hl'"
                    :class="{ active: active == 'hl' }"
                    placeholder="请选择"
                    @change="changeHall"
                >
                    <el-option
                        v-for="item in hallOptions"
                        :key="item.hallId"
                        :label="item.hallName"
                        :value="item.hallId"
                    >
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="operation">
            <span class="signIn" @click="signIn">签到 </span>
            <img class="portrait" src="../../assets/logo1.png" alt="" />
            <el-dropdown>
                <span class="el-dropdown-link work">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>{{ phone }}</el-dropdown-item>
                        <el-dropdown-item @click="openChange"
                            >修改密码</el-dropdown-item
                        >
                        <el-dropdown-item @click="loginOut"
                            >退出</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <!-- 二维码 -->
        <el-dialog
            width="370px"
            title="签到"
            :before-close="closeCode"
            v-model="innerVisible"
        >
            <div class="paycode">
                <div id="qrcode" ref="qrcode"></div>
            </div>
        </el-dialog>
        <popupForm
            v-model:show="dialogFormVisible"
            :formInitData="form"
            title="修改密码"
            :itemList="itemList"
            @confirm="confirm"
        />
    </div>
</template>

<script>
import {
    reactive,
    ref,
    toRefs,
    getCurrentInstance,
    watch,
    nextTick,
} from "vue";
import { ElLoading, ElMessage } from "element-plus";
import store from "@/store";
import { useRouter, useRoute } from "vue-router";
import { constantRoutes } from "@/router/index";
import { headerHallListByCityId } from "@/api/common";
import { staffGetPermission } from "@/api/managerStaff";
import { log } from "@/utils";
import popupForm from "@/components/FormList/popupForm";
import { encryption } from "@/utils/util";
import { staffUpdatePasswordPost, signInAPI } from "@/api/user";
import QRCode from "qrcodejs2";
export default {
    name: "Navbar",
    components: {
        popupForm,
    },
    setup() {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        // 请求权限的类型 (角色所属 HALLING (总部) HALLING_CITY(城市) HALLING_HALL(班级))
        const type = ["HALLING", "HALLING_CITY", "HALLING_HALL"];

        const state = reactive({
            openChange: () => {
                state.dialogFormVisible = true;
            },
            dialogFormVisible: false,
            form: {},
            itemList: [
                {
                    code: "newPassword",
                    label: "新密码",
                    showPassword: true,
                },
                {
                    code: "newPassword2",
                    label: "确认密码",
                    showPassword: true,
                },
            ],
            ruleForm: {
                username: "",
                password: "",
            },
            confirm: (value) => {
                console.log(value);
                if (value.newPassword != value.newPassword2) {
                    ElMessage.error("两次密码不一致");
                    return;
                }
                const data = encryption({
                    data: value,
                    key: "4d3247ec362343b5acd489c327af7ada",
                    iv: "acd489c327af7ade",
                    param: ["newPassword"],
                });
                staffUpdatePasswordPost(data).then((res) => {
                    ElMessage.success("修改成功！");
                    state.dialogFormVisible = false;
                    router.push({ path: "/login" });
                });
            },
            phone: store.getters.phone,
            cityOptions: store.getters.cityList,
            hallOptions: store.getters.hallList || [],
            isHeadquarters: store.getters.isHeadquarters,
            cityId: store.getters.activeCityId,
            hallId: store.getters.activeHallId,
            active: store.getters.menuType,
            // 切换学校
            changeCity: (val) => {
                // 设置是否是线上
                store.commit("user/SET_ONLINE", val == 820303);
                if (state.active == "c") {
                    // 后续逻辑实现
                    const loading = ElLoading.service({
                        lock: true,
                        text: "loading",
                        spinner: "el-icon-loading",
                        background: "rgba(0, 0, 0, 0.1)",
                    });
                    store.commit("app/setRefreshApp");
                    // 设置选中的学校id
                    store.commit("user/SET_activeCityId", val);
                    for (
                        let index = 0;
                        index < state.cityOptions.length;
                        index++
                    ) {
                        if (state.cityOptions[index].cityId == val) {
                            state.hallOptions.splice(
                                0,
                                state.hallOptions.length
                            );
                            state.hallOptions = state.cityOptions[index].halls;
                            state.hallId = state.cityOptions[index].halls[0].id;
                            //  默认显示第一个班级
                            store.commit(
                                "user/SET_activeHallId",
                                state.cityOptions[index].halls[0].id
                            );
                            store.commit("user/setHallList", [
                                ...state.cityOptions[index].halls,
                            ]);
                            break;
                        }
                    }

                    loading.close();
                    // ==============================

                    // staffGetPermission({
                    //     type: "HALLING_CITY",
                    //     cityId: val,
                    // }).then(({ code, data }) => {
                    //     if (code === 200 && data) {
                    //         const loading = ElLoading.service({
                    //             lock: true,
                    //             text: "loading",
                    //             spinner: "el-icon-loading",
                    //             background: "rgba(0, 0, 0, 0.1)",
                    //         });
                    //         // 设置路由权限
                    //         store.commit("user/setPermMenu", {
                    //             s: data.menus.map((e) => e.code),
                    //         });
                    //         // 设置按钮权限
                    //         store.commit("user/setPermButtonList", {
                    //             s: data.buttons.map((e) => e.code),
                    //         });

                    //         store.commit("app/setRefreshApp");
                    //         // 设置选中的学校id
                    //         store.commit("user/SET_activeCityId", val);
                    //         // 然后将班级 塞入到

                    //         // 修改班级列表的信息`
                    //         // 根据学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
                    //         // headerHallListByCityId({
                    //         //     cityId: val,
                    //         //     size: 100,
                    //         // })
                    //         //     .then((res2) => {
                    //         //         if (res2.code == 200) {
                    //         //             console.log("app/setRefreshApp");
                    //         //             if (res2.data.length) {
                    //         //                 let _data = [];
                    //         //                 res2.data.forEach((item, index) => {
                    //         //                     _data.push({
                    //         //                         id: item.id,
                    //         //                         name: item.name,
                    //         //                     });
                    //         //                 });

                    //         //             } else {
                    //         //                 // debugger
                    //         //                 state.hallOptions.splice(
                    //         //                     0,
                    //         //                     state.hallOptions.length
                    //         //                 );

                    //         //                 state.hallId = "";
                    //         //                 //  默认显示第一个班级
                    //         //                 store.commit(
                    //         //                     "user/SET_activeHallId",
                    //         //                     ""
                    //         //                 );
                    //         //                 store.commit(
                    //         //                     "user/setHallList",
                    //         //                     []
                    //         //                 );
                    //         //             }
                    //         //             loading.close();
                    //         //         }
                    //         //     })
                    //         //     .catch((err) => {
                    //         //         loading.close();
                    //         //     });
                    //     }
                    // });
                } else {
                    const loading = ElLoading.service({
                        lock: true,
                        text: "loading",
                        spinner: "el-icon-loading",
                        background: "rgba(0, 0, 0, 0.1)",
                    });
                    store.commit("app/setRefreshApp");
                    // 设置选中的学校id
                    store.commit("user/SET_activeCityId", val);
                    // 修改班级列表的信息`

                    // 根据学校id 去获取这个用户下面所有 对应这个学校下面的所有班级列表
                    headerHallListByCityId({ cityId: val, size: 100 })
                        .then((res2) => {
                            if (res2.code == 200) {
                                console.log("app/setRefreshApp");
                                if (res2.data.length) {
                                    let _data = [];
                                    res2.data.forEach((item, index) => {
                                        _data.push({
                                            id: item.id,
                                            name: item.name,
                                        });
                                    });
                                    // 然后将班级 塞入到
                                    state.hallOptions.splice(
                                        0,
                                        state.hallOptions.length
                                    );
                                    state.hallOptions = _data;
                                    state.hallId = _data[0].id;
                                    //  默认显示第一个班级
                                    store.commit(
                                        "user/SET_activeHallId",
                                        _data[0].id
                                    );
                                    store.commit("user/setClassList", [
                                        ..._data,
                                    ]);
                                } else {
                                    // debugger
                                    state.hallOptions.splice(
                                        0,
                                        state.hallOptions.length
                                    );

                                    state.hallId = "";
                                    //  默认显示第一个班级
                                    store.commit("user/SET_activeHallId", "");
                                    store.commit("user/setClassList", []);
                                }
                                loading.close();
                            }
                        })
                        .catch((err) => {
                            loading.close();
                        });
                }
            },
            // 切换班级
            changeHall: (val) => {
                if (state.active == 3) {
                    staffGetPermission({
                        type: "HALLING_HALL",
                        hallId: val,
                    }).then(({ code, data }) => {
                        if (code === 200 && data) {
                            console.log("============1");
                            // 设置路由权限
                            store.commit("user/setPermMenu", {
                                c: data.menus.map((e) => e.code),
                            });
                            // 设置按钮权限
                            store.commit("user/setPermButtonList", {
                                c: data.buttons.map((e) => e.code),
                            });

                            store.commit("app/setRefreshApp");
                            // 设置选中的班级id
                            store.commit("user/SET_activeHallId", val);
                        }
                    });
                } else {
                    store.commit("app/setRefreshApp");
                    // 设置选中的班级id
                    store.commit("user/SET_activeHallId", val);
                }
            },
            // 切换总部，学校，班级
            changeType: (val) => {
                state.active = val;
                store.commit("app/setRefreshApp");
                store.commit("user/SET_menuType", val);
            },
            // 退出登录
            loginOut: (val) => {
                // 删除用户本地的token 然后跳转到登录界面,路由重新处理
                store.dispatch("user/logout").then(() => {
                    //  跳转到login界面
                    // proxy.$router.options.routes = [constantRoutes];
                    router.push({ path: "/login" });
                    location.reload();
                });
            },
            // 签到
            signIn: () => {
                console.log("签到");
                state.innerVisible = true;
                state.signAPI();
                state.uuidTimer = setInterval(() => {
                    setTimeout(() => {
                        state.signAPI();
                    }, 0);
                }, 300000);
            },
            signAPI: () => {
                signInAPI({
                    hallId: state.hallId,
                }).then(({ data, code }) => {
                    if (code === 200 && data) {
                        console.log("s=sign&huuid=" + data.uuid, "data");
                        state.innerVisible = true;
                        // 使用$nextTick确保数据渲染
                        nextTick(() => {
                            let qrcodeId = document.querySelector("#qrcode");
                            qrcodeId.innerHTML = "";
                            let qrcode = new QRCode(qrcodeId, {
                                text: `s=sign&huuid=${data.uuid}`, //页面地址 ,如果页面需要参数传递请注意哈希模式#
                                width: 200,
                                height: 200,
                                correctLevel: QRCode.CorrectLevel.H,
                            });
                        });
                    }
                });
            },

            closeCode: () => {
                let qrcodeId = document.querySelector("#qrcode");
                qrcodeId.innerHTML = "";
                clearInterval(state.uuidTimer);
                state.innerVisible = false;
            },
            uuidTimer: null,
            innerVisible: false,
        });

        watch(
            () => store.getters.menuType,
            (newV) => {
                state.active = newV;
            },
            { immediate: true, deep: true }
        );

        watch(
            () => store.getters.cityList,
            (newV, oldV) => {
                state.cityOptions = newV;
            },
            { immediate: true, deep: true }
        );

        watch(
            () => store.getters.hallList,
            (newV, oldV) => {
                state.hallOptions = newV;
            },
            { immediate: true, deep: true }
        );
        // 选中学校
        // watch(
        //   () => store.getters.activecityId,
        //   newV => {
        //     state.active == 2 &&
        //       newV &&
        //       staffGetPermission({ type: "HALLING_CITY", cityId: newV }).then(
        //         ({ code, data }) => {
        //           if (code === 200 && data) {
        //             // 设置按钮权限
        //             store.commit("user/setPermButtonList", {
        //               s: data.buttons.map(e => e.code)
        //             });
        //             // 设置路由权限
        //             store.commit("user/setPermMenu", {
        //               s: data.menus.map(e => e.code)
        //             });
        //           }
        //         }
        //       );
        //   },
        //   { immediate: true, deep: true }
        // );
        //选中班级
        // watch(
        //   () => store.getters.activeClassId,
        //   newV => {
        //     state.active == 3 &&
        //       newV &&
        //       staffGetPermission({
        //         type: "HALLING_HALL",
        //         cityId: state.cityId,
        //         hallId: newV
        //       }).then(({ code, data }) => {
        //         if (code === 200 && data) {
        //           // 设置按钮权限
        //           store.commit("user/setPermButtonList", {
        //             c: data.buttons.map(e => e.code)
        //           });
        //           // 设置路由权限
        //           store.commit("user/setPermMenu", {
        //             c: data.menus.map(e => e.code)
        //           });
        //         }
        //       });
        //   },
        //   { immediate: true, deep: true }
        // );
        return {
            ...toRefs(state),
        };
    },
};
</script>

<style lang="scss" scoped>
$bg: #2e8de6;
.navbar {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #3d55e1;
    .logo {
        width: 208px;
        min-width: 208px;
        height: 100%;
        background: $bg;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .choice {
        flex: 1;
        display: flex;
        padding: 0 40px;
        .head_title {
            width: 64px;
            color: #fff;
            &.active {
                //color: $bg;
                //background: #e4f2ff;
            }
            .head_title_icon {
                margin-right: 5px;
            }
            &.noCup {
                cursor: not-allowed;
            }
        }
        .hall_btn,
        .staff_btn,
        .members_btn {
            position: relative;
            text-align: center;
            width: 74px;
            height: 24px;
            font-size: 16px;
            color: #fff;
            &:before {
                content: "";
                position: absolute;
                right: 0;
                top: 4px;
                display: block;
                width: 1px;
                height: 16px;
                background: #fff;
            }
            &.active {
                color: #2e8de6;
            }
        }
        .members_btn {
            &:before {
                display: none;
            }
        }
        .choice_itemF {
            height: 48px;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #fff;
            padding: 0 20px;
            margin-right: 16px;
            cursor: pointer;
            > span {
                margin-right: 8px;
            }
            .headquarter {
                display: flex;
                padding: 10px 0;
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }
            &.active {
                //background: #fff;
                color: #2e8de6;

                .head_title {
                    color: #fff;
                }
                .headquarter {
                    background: #fff;
                    color: #333;
                }

                .hall_btn,
                .staff_btn,
                .members_btn {
                    &:before {
                        background: #333;
                    }

                    color: #333;

                    &.active {
                        color: #2e8de6;
                    }
                }
            }
        }

        .choice_item {
            height: 48px;
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            font-size: 14px;
            color: #fff;
            padding: 0 20px;
            margin-right: 16px;
            cursor: pointer;
            > span {
                margin-right: 8px;
            }

            &.active {
                background: #fff;
                color: #2e8de6;
                .head_title {
                    color: #4159e1;
                }
            }
        }
    }
    .operation {
        padding-right: 24px;
        display: flex;
        align-items: center;
        .portrait {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .work {
            color: #fff;
            border: none;
            outline: none;
        }
        .work.focusing {
            border: none;
            outline: none;
        }
    }
}
.signIn {
    color: #fff;
    margin-right: 20px;
    cursor: pointer;
}
.paycode {
    padding-left: 70px;
    margin-bottom: 10px;
}
</style>
