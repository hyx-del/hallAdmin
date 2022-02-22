/*
 * @Author: wei.chen
 * @Date: 2021-10-13 13:56:42
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-10-21 09:42:43
 * @Descripttion:
 */
import store from "@/store";
// 角色所属
export const menuType = {
    s: {
        name: "员工",
        type: "hall",
        scope: "TEACHING_ADMIN",
    },

    h: {
        name: "会馆",
        type: "hall",
        scope: "TEACHING_ADMIN",
    },
    m: {
        name: "员工",
        type: "hall",
        scope: "TEACHING_ADMIN",
    },

    mh: {
        name: "会员",
        type: "hall",
        scope: "TEACHING_ADMIN",
    },

    c: {
        name: "城市",
        type: "city",
        scope: "TEACHING_ADMIN_SCHOOL",
    },
    hl: {
        name: "班级",
        type: "HALLING_HALL",
        scope: "TEACHING_ADMIN_CLASS",
    },
};
// 混入顶部的菜单参数
export const mixinMenu = (data, hasType = false) => {
    let parmat = {};
    // console.log("store.getters.menuType", store.getters.menuType);
    // console.log("store.getters", store.getters);
    let { activeCityId = "510100", activeHallId = 4 } = store.getters;
    let menuCut = store.getters.menuType;
    if (menuCut == "c") {
        parmat = { ...parmat, cityId: activeCityId || "510100" };
    }
    if (menuCut == "hl") {
        parmat = {
            ...parmat,
            cityId: activeCityId || "510100",
            hallId: activeHallId || 4,
        };
    }
    // if (hasType) {
    //     console.log("menuCut", menuCut);
    //     parmat.type = menuType[menuCut].type;
    //     // parmat.type = 1;
    // }
    // console.log('----------',data, parmat)
    return { ...data, ...parmat };
};
