/*
 * @Author: aa
 * @Date: 2021-08-20 10:15:08
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-18 10:15:27
 * @Descripttion:
 */
import { login, logout, getUserInfo, getMenuInfo } from "@/api/user";
import { getTopHeaderCityList, headerHallListByCityId } from "@/api/common";

import { getToken, setToken, removeToken } from "@/utils/auth";
import { staffGetPermission } from "@/api/managerStaff";
import store from "@/store";
// import { resetRouter } from "@/router";
// import getRouterList from "@/router/router";

const getDefaultState = () => {
    return {
        token: "",
        threesSideToken: "", // 第三方token
        name: "",
        avatar: "",
        phone: null,
        menuType: "h", // h:会馆 s:员工 m:会员 c:城市 hl:会馆列表
        menuList: [],
        studentsPermissions: [], //学员管理按钮权限
        permMenu: {
            // 用户在切换城市或者切换会馆的时候，就切换这里的s,c 对应的菜单由这里来生成
            h: ["h01", "h02"], // 用户在会馆拥有的菜单code
            s: ["s01", "s02"], // 用户在员工拥有的菜单code
            m: ["m01", "m02"], // 用户在会员拥有的菜单code
            c: ["c01", "c02"], // 用户在城市拥有的菜单code
            hl: ["hl01", "hl02"], // 用户在会馆列表拥有的菜单code
        },
        permButtonList: {
            // 用户在切换城市或者切换会馆的时候，就切换这里的s,c 对应的按钮由这里来生成
            h: [], // 用户在总部拥有的按钮code
            s: [], // 用户在城市拥有的按钮code
            m: [], // 用户在会馆拥有的按钮code
            c: [], // 用户在会馆拥有的按钮code
            hl: [], // 用户在会馆拥有的按钮code
        },
        permButtons: [], // 当前用户总部 ,激活的城市 ,激活的会馆 按钮权限列表
        isHeadquarters: true,
        online: false, // 是否是线上城市
        cityList: [], // 拥有的城市列表
        hallList: [], // 拥有的会馆列表
        activeCityId: null, // 选中的城市id
        activeHallId: null, // 选中的场馆id
    };
};

const state = getDefaultState();

const mutations = {
    SET_ONLINE: (state, value) => {
        state.online = value;
    },
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_PHONE: (state, avatar) => {
        state.phone = avatar;
    },

    SET_headquarters: (state, status) => {
        state.isHeadquarters = status;
    },
    SET_menuType: (state, menuType) => {
        state.menuType = menuType;
    },
    SET_activeCityId: (state, activeCityId) => {
        state.activeCityId = activeCityId;
    },
    SET_activeHallId: (state, activeHallId) => {
        state.activeHallId = activeHallId;
    },

    setMenuList: (state, menuList) => {
        state.menuList = menuList;
    },
    setcityList: (state, cityList) => {
        state.cityList = [...cityList];
    },
    setHallList: (state, hallList) => {
        state.hallList.splice(0, state.hallList.length);
        state.hallList = [...hallList];
    },
    setStuPermissions: (state, stuList) => {
        state.studentsPermissions = [...stuList];
    },
    // 权限菜单
    setPermMenu: (state, permMenu) => {
        // debugger;
        state.permMenu = { ...state.permMenu, ...permMenu };
    },
    // 权限按钮
    setPermButtonList: (state, permButtonList) => {
        state.permButtonList = { ...state.permButtonList, ...permButtonList };
    },
};

const actions = {
    // user login
    login({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            console.log(userInfo);
            login(userInfo)
                .then(({ code, data }) => {
                    if (code === 200 && data) {
                        const { access_token, user_info } = data;
                        commit("SET_TOKEN", access_token);
                        commit("SET_PHONE", user_info?.mobile);
                        setToken(access_token);
                        sessionStorage.setItem(
                            "hall_Authorization",
                            access_token
                        );
                        sessionStorage.setItem("userids", user_info?.id);

                        resolve();
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getUserInfo(state.token)
                .then((response) => {
                    const { data } = response;

                    if (!data) {
                        reject("校验失败，请重新登录");
                    }
                    const { name, avatar } = data.admin;
                    commit("SET_NAME", name);
                    commit("SET_AVATAR", avatar);

                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // 默认获取城市的权限 or 会馆的权限
    setCityOrHallPermission({ commit }, pid, type = "HALLING_CITY") {
        // debugger;
        let _par = {
            type: type,
        };
        if (type == "HALLING_CITY") {
            _par.cityId = pid;
        } else if (type == "HALLING_HALL") {
            _par.classId = pid;
        }
        staffGetPermission(_par)
            .then(({ code, data }) => {
                if (code === 200 && data) {
                    //TODO 调试权限的时候再放开这部分的代码 并做相应的调整
                    // if (type == "HALLING_CITY") {
                    //     // 设置路由权限
                    //     commit("setPermMenu", {
                    //         s: data.menus.map((e) => e.code),
                    //     });
                    //     // 设置按钮权限
                    //     commit("setPermButtonList", {
                    //         s: data.buttons.map((e) => e.code),
                    //     });
                    // } else if (type == "HALLING_HALL") {
                    //     // 设置路由权限
                    //     commit("setPermMenu", {
                    //         c: data.menus.map((e) => e.code),
                    //     });
                    //     // 设置按钮权限
                    //     commit("setPermButtonList", {
                    //         c: data.buttons.map((e) => e.code),
                    //     });
                    // }
                }
            })
            .catch((err) => {});
    },
    // 获取顶部，默认用户所有的城市权限列表
    getUserHaveCityList(context) {
        return new Promise((resolve, reject) => {
            debugger;
            getTopHeaderCityList({ size: 1000, current: 1, enable: 1 }).then(
                (res) => {
                    if (res.code == 200) {
                        context.commit("setcityList", res.data);
                        if (res.data.length) {
                            let _activeCityId = state.activeCityId
                                ? state.activeCityId
                                : res.data[0].id;

                            // 根据城市id 去获取这个用户下面所有 对应这个城市下面的所有会馆列表
                            headerHallListByCityId({
                                cityId: _activeCityId,
                            }).then((res2) => {
                                if (res2.code == 200) {
                                    if (res2.data.length) {
                                        // 然后将会馆 塞入到
                                        context.commit(
                                            "setHallList",
                                            res2.data
                                        );
                                        //  默认显示第一个会馆
                                        context.commit(
                                            "SET_activeHallId",
                                            res2.data[0].id
                                        );
                                        resolve();
                                    }
                                }
                            });
                        } else {
                            resolve();
                        }
                    } else {
                        reject();
                    }
                }
            );
        });
    },

    // 刷新顶部会馆的列表信息
    getUserHaveHallList(context, cityId) {
        console.log(cityId, "城市id");
        // 根据激活的城市id 去获取这个用户下面所有 对应这个城市下面的所有会馆列表
        headerHallListByHallId({
            cityId: cityId,
        }).then((res2) => {
            if (res2.code == 200) {
                if (res2.data.length) {
                    let _activeHallId = state.activeHallId
                        ? state.activeCityId
                        : res2.data[0].id;
                    // 然后将会馆 塞入到
                    // debugger;
                    context.commit("setHallList", res2.data);
                    //  默认显示第一个会馆
                    context.commit("SET_activeHallId", _activeHallId);

                    setCityOrHallPermission(
                        context,
                        _activeHallId,
                        "HALLING_HALL"
                    );
                }
            }
        });
    },

    // 获取顶部 默认第一所城市下面的所有的会馆列表

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            // logout(state.token)
            // 	.then(() => {
            removeToken(); // must remove  token  first
            //   resetRouter();
            commit("RESET_STATE");
            commit("SET_TOKEN", null);
            removeToken();
            // 清楚所有  sessionStorage 里面的数据
            sessionStorage.clear();
            resolve();
            // })
            // .catch(error => {
            // 	reject(error)
            // })
        });
    },
    getMenuInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getMenuInfo()
                .then((res) => {
                    if (res.code === 200) {
                        // 设置菜单权限
                        const _tempArray = [];
                        res.data.roles[0].menus.forEach((item) => {
                            _tempArray.push(item.code);
                        });
                        sessionStorage.setItem(
                            "role_router",
                            JSON.stringify(_tempArray)
                        );
                        resolve();
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            removeToken(); // must remove  token  first
            commit("RESET_STATE");
            resolve();
        });
    },
    // 获取总部权限code 并设置到 vuex 里面
    setHeadquarters({ commit }, hasTeaching) {
        commit("SET_headquarters", hasTeaching);
        if (hasTeaching) {
            // 有总部权限，请求相应code
            staffGetPermission({ type: "HALLING" }).then(({ code, data }) => {
                if (code === 200 && data) {
                    commit("setPermMenu", { a: data.menus.map((e) => e.code) });
                    commit("setPermButtonList", {
                        a: data.buttons.map((e) => e.code),
                    });
                }
            });
        } else {
            commit("SET_menuType", 2);
        }
    },
    // 设置顶部城市列表，并获取第一个城市下面 有权限的会馆列表
    // setAllCityList({ commit }, cityList) {
    //     return new Promise((resolve) => {
    //         commit("setcityList", cityList);
    //         if (cityList.length) {
    //             commit("SET_activeCityId", cityList[0].id);
    //             // 默认激活会馆的全安心会馆的权限
    //             actions.setCityOrHallPermission(
    //                 { commit },
    //                 cityList[0].id,
    //                 "HALLING_CITY"
    //             );
    //             // 根据城市id 去获取这个用户下面所有 对应这个城市下面的所有会馆列表
    //             headerHallListByHallId({
    //                 cityId: cityList[0].id,
    //             }).then((res2) => {
    //                 if (res2.code == 200) {
    //                     if (res2.data.length) {
    //                         // 然后将会馆 塞入到
    //                         commit("setHallList", res2.data);
    //                         //  默认显示第一个会馆
    //                         commit("SET_activeHallId", res2.data[0].id);
    //                         // 默认激活会馆的全安心会馆的权限
    //                         actions.setCityOrHallPermission(
    //                             { commit },
    //                             res2.data[0].id,
    //                             "HALLING_HALL"
    //                         );
    //                     }
    //                 }
    //             });
    //         }
    //         resolve();
    //     });
    // },
    // 设置顶部城市列表，并获取第一个城市下面 有权限的会馆列表
    setAllCityList2({ commit }, cityList) {
        return new Promise((resolve) => {
            commit("setcityList", cityList);
            if (cityList.length) {
                commit(
                    "SET_activeCityId",
                    cityList[0].id || cityList[0].cityId
                );

                // 根据城市id 去获取这个用户下面所有 对应这个城市下面的所有会馆列表
                // 然后将会馆 塞入到
                commit("setHallList", cityList[0].halls);
                //  默认显示第一个会馆
                commit(
                    "SET_activeHallId",
                    cityList[0].halls[0].id || cityList[0].halls[0].hallId
                );
            }
            resolve();
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
