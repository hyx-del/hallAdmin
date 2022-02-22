/*
 * @Author: wei.chen
 * @Date: 2020-06-20 18:55:32
 * @LastEditors: 郑晶
 * @LastEditTime: 2022-01-10 16:47:22
 * @Descripttion:
 */

const getters = {
    refreshApp: (state) => state.app.refreshApp,
    payChannel: (state) => state.app.payChannel,
    sidebar: (state) => state.app.sidebar,
    device: (state) => state.app.device,
    upLoadToken: (state) => state.app.upLoadToken,
    token: (state) => state.user.token,
    avatar: (state) => state.user.avatar,
    phone: (state) => state.user.phone,
    name: (state) => state.user.name,
    // menuList: state => state.user.menuList,
    isHeadquarters: (state) => state.user.isHeadquarters,
    menuType: (state) => state.user.menuType,
    cityList: (state) => state.user.cityList,
    hallList: (state) => state.user.hallList,

    activeCityId: (state) => state.user.activeCityId,
    // activeHallId: (state) => state.user.activeHallId,

    permButtons: (state) => state.user.permButtons,
    studentsPermissions: (state) => state.user.studentsPermissions,
    permMenu: (state) => state.user.permMenu,
    menuList: (state) => state.user.menuList,
    permButtonList: (state) => state.user.permButtonList,
    activeHallId: (state) => state.user.activeHallId,
    online: (state) => state.user.online,
};
export default getters;
