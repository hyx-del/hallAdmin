/*
 * 包含接口：新增员工(staffAddStaffPost),所有员工列表(总部员工列表使用)(staffAllStaffList),绑定会员(staffBindingMemberPost),员工启用/禁用(staffEnabledStaffPost),根据手机号获取员工信息(staffFindMemberByMobile),获取用户权限信息(staffGetPermission),获取PHP外包Token(staffGetPhpAdminTokenPost),获取教培销售列表(staffGetSaleStaffList),登录员工基本信息(staffGetStaffBaseInfo),员工详情(staffGetStaffInfo),员工详情(根据手机号查找)(staffGetStaffInfoByMobile),员工列表(staffGetStaffList),获取门店销售列表(salesList),员工移除(staffRemoveStaffDelete),重置密码(staffResetPasswordPost),员工转正(staffStaffConversionPost),员工修改密码(staffUpdatePasswordPost),员工修改(staffUpdateStaffPost),根据员工id获取员工详情(staffDetail),getStaffInfoByMember(staffGetstaffbymember),getStaffInfoByIds(staffGetstaffinfobyidsPost),loadUserByUsername(staffLoaduserbyusername),getStaffNameByIds(staffStaffNameByIdsPost),根据员工id获取员工详情(staffUpdatePost),
 * 后端员工 Staff Controller
 */
import request from "@/api/request";
import { mixinMenu } from "@/api/menuTop";
// 新增员工
export const staffAddStaffPost = (data) => {
    return request({
        url: `/admin/staff/addStaff`,
        method: "POST",
        data,
    });
};

// 所有员工列表(总部员工列表使用)
export const staffAllStaffList = (data) => {
    return request({
        url: `/admin/staff/staff/list`,
        method: "GET",
        data,
    });
};

// 绑定会员
export const staffBindingMemberPost = (data) => {
    return request({
        url: `/admin/staff/staff/bind-member`,
        method: "POST",
        data,
    });
};

// 员工启用/禁用
export const staffEnabledStaffPost = (data) => {
    return request({
        url: `/admin/staff/staff/status`,
        method: "PUT",
        data,
    });
};

// 根据手机号获取员工信息
export const staffFindMemberByMobile = (data) => {
    return request({
        url: `/admin/staff/staff/mobile`,
        method: "GET",
        data,
    });
};

// 获取用户权限信息
export const staffGetPermission = (data) => {
    return request({
        url: `/admin/staff/getPermission`,
        method: "GET",
        data,
    });
};

// 获取PHP外包Token
export const staffGetPhpAdminTokenPost = (data) => {
    return request({
        url: `/admin/staff/getPhpAdminToken`,
        method: "POST",
        data,
    });
};

// 获取教培销售列表
export const staffGetSaleStaffList = (data) => {
    return request({
        url: `/admin/staff/getSaleStaffList`,
        method: "GET",
        data,
    });
};

// 登录员工基本信息
export const staffGetStaffBaseInfo = (data) => {
    return request({
        url: `/admin/staff/getStaffBaseInfo`,
        method: "GET",
        data,
    });
};

// 员工详情
export const staffGetStaffInfo = (data) => {
    return request({
        url: `/admin/staff/staff/detail`,
        method: "GET",
        data,
    });
};

// 员工详情(根据手机号查找)
export const staffGetStaffInfoByMobile = (data) => {
    return request({
        url: `/admin/staff/staff/mobile`,
        method: "GET",
        data,
    });
};

// 员工列表
export const staffGetStaffList = (data) => {
    return request({
        url: `/admin/staff/staff/list`,
        method: "GET",
        data,
    });
};

// 获取门店销售列表
export const salesList = (data) => {
    return request({
        url: `/admin/staff/hall/sales/list`,
        method: "GET",
        data,
    });
};

// 员工移除
export const staffRemoveStaffDelete = (data) => {
    return request({
        url: `/admin/staff/staff`,
        method: "DELETE",
        data,
    });
};
// 员工移除（在门店和城市）
export const staffEmptyRoleDelete = (data) => {
    return request({
        url: `/admin/staff/staff/empty-role`,
        method: "DELETE",
        data,
    });
};

// 重置密码
export const staffResetPasswordPost = (data) => {
    return request({
        url: `/admin/staff/resetPassword`,
        method: "POST",
        data,
    });
};

// 员工转正
export const staffStaffConversionPost = (data) => {
    return request({
        url: `/admin/staff/staff/conversion`,
        method: "POST",
        data,
    });
};

// 员工修改密码
export const staffUpdatePasswordPost = (data) => {
    return request({
        url: `/admin/staff/updatePassword`,
        method: "POST",
        data,
    });
};

// 员工修改
export const staffUpdateStaffPost = (data) => {
    return request({
        url: `/admin/staff/staff`,
        method: "PUT",
        data,
    });
};

// 根据员工id获取员工详情
export const staffDetail = (data) => {
    return request({
        url: `inner/staff/detail`,
        method: "GET",
        data,
    });
};

// getStaffInfoByMember
export const staffGetstaffbymember = (data) => {
    return request({
        url: `inner/staff/getstaffbymember`,
        method: "GET",
        data,
    });
};

// getStaffInfoByIds
export const staffGetstaffinfobyidsPost = (data) => {
    return request({
        url: `inner/staff/getstaffinfobyids`,
        method: "POST",
        data,
    });
};

// loadUserByUsername
export const staffLoaduserbyusername = (data) => {
    return request({
        url: `inner/staff/loaduserbyusername`,
        method: "GET",
        data,
    });
};

// getStaffNameByIds
export const staffStaffNameByIdsPost = (data) => {
    return request({
        url: `inner/staff/staff-name-by-ids`,
        method: "POST",
        data,
    });
};

// 根据员工id获取员工详情
export const staffUpdatePost = (data) => {
    return request({
        url: `inner/staff/update`,
        method: "POST",
        data,
    });
};

// 后端权限
// Permission Controller

// 新增权限
export const permissionAddPost = (data) => {
    return request({
        url: `/admin/staff/permission/add`,
        method: "POST",
        data,
    });
};

// 编辑权限
export const permissionEditPost = (data) => {
    return request({
        url: `/admin/staff/permission/edit`,
        method: "POST",
        data,
    });
};

// 查询权限列表
export const permissionList = (data) => {
    return request({
        url: `/admin/staff/permission/list`,
        method: "GET",
        data,
    });
};

// 查询权限树
export const permissionListTree = (data) => {
    return request({
        url: `/admin/staff/permission/listTree`,
        method: "GET",
        data,
    });
};

// 删除权限
export const permissionRemoveDelete = (data) => {
    return request({
        url: `/admin/staff/permission/remove`,
        method: "DELETE",
        data,
    });
};

//-----------
// 后端角色
// Roles Controller
// 新增角色
export const roleAddPost = (data) => {
    return request({
        url: `/admin/staff/role/add`,
        method: "POST",
        data,
    });
};

// 角色删除
export const roleDeleteDelete = (data) => {
    return request({
        url: `/admin/staff/role/delete`,
        method: "DELETE",
        data,
    });
};

// 编辑角色
export const roleEditPost = (data) => {
    return request({
        url: `/admin/staff/role/edit`,
        method: "POST",
        data,
    });
};

// 角色列表
export const roleList = (data) => {
    return request({
        url: `/admin/staff/role/list`,
        method: "GET",
        data,
    });
};

// 角色详情
export const roleRoleInfo = (data) => {
    return request({
        url: `/admin/staff/role/roleInfo`,
        method: "GET",
        data,
    });
};

// 查询角色权限树
export const roleRoleListTree = (data) => {
    return request({
        url: `/admin/staff/role/roleListTree`,
        method: "GET",
        data,
    });
};

// 角色详情列表
export const roleRolesInfo = (data) => {
    return request({
        url: `/admin/staff/role/rolesInfo`,
        method: "GET",
        data,
    });
};

//  获取会员用户详情 (员工里绑定用户)
export const memberMemberContact = (data) => {
    return request({
        url: `/admin/member/member/contact`,
        method: "GET",
        data,
    });
};
