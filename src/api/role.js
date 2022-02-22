import request from '@/api/request';


// 新增角色
export const staffRolePost = data => {
    return request({
        url: `/admin/staff/role`,
        method: "POST",
        data
    });
};

// 编辑角色
export const staffRolePut = data => {
    return request({
        url: `/admin/staff/role`,
        method: "PUT",
        data
    });
};

// 角色删除
export const staffRoleDelete = data => {
    return request({
        url: `/admin/staff/role`,
        method: "DELETE",
        data
    });
};

// 角色详情
export const roleDetail = data => {
    return request({
        url: `/admin/staff/role/detail`,
        method: "GET",
        data
    });
};

// 角色列表
export const roleList = data => {
    return request({
        url: `/admin/staff/role/list`,
        method: "GET",
        data
    });
};

// 查询角色权限树
export const roleRoleListTree = data => {
    return request({
        url: `/admin/staff/role/roleListTree`,
        method: "GET",
        data
    });
};

// 角色详情列表
export const roleRolesInfo = data => {
    return request({
        url: `/admin/staff/role/rolesInfo`,
        method: "GET",
        data
    });
};
