/*
 * @Author: 郑晶
 * @Date: 2021-09-02 09:42:30
 * @LastEditors: zx
 * @LastEditTime: 2021-11-22 13:04:26
 * @Descripttion:
 */
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { schoolSemesterDelete } from "@/api/semester";
import { toRefs, ref, reactive, computed } from "vue";

let router;
/*
 * tips:{title:'标题',success:'操作成功!',error:'操作失败'}
 * */
export const confirmBox = (api, params, table, tips, callBack) => {
    ElMessageBox.confirm(
        (tips && tips.title) || "确认删除吗?",
        tips.head || "确认提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            api(params).then(({ code, msg }) => {
                if (code == 200) {
                    ElMessage({
                        type: "success",
                        message: (tips && tips.success) || "操作成功!",
                    });
                    table && table.value.update();
                    callBack && callBack();
                } else {
                    ElMessage({
                        type: "success",
                        message: (tips && tips.error) || msg || "操作失败",
                    });
                }
            });
        })
        .catch(() => {});
};

// 确认弹窗
export const messageBox = (row = { id: null }, api, table, tips, callBack) => {
    let params = { id: row.id, ...tips.params };
    ElMessageBox.confirm((tips && tips.title) || "确认删除吗?", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            api(params).then(({ code, msg }) => {
                if (code == 200) {
                    ElMessage({
                        type: "success",
                        message: (tips && tips.success) || "操作成功!",
                    });
                    table && table.value.update();
                    callBack && callBack();
                } else {
                    ElMessage({
                        type: "success",
                        message: msg || "操作失败",
                    });
                }
            });
        })
        .catch(() => {});
};
export const deleteItem = (
    row,
    api,
    table,
    tips = { title: "", success: "" },
    callBack
) => {
    if (!tips) {
        tips = {
            title: "确认删除吗?",
            success: "删除成功!",
        };
    }
    if (tips) {
        tips.title = tips.title || "确认删除吗?";
        tips.success = tips.success || "删除成功!";
    }
    messageBox(row, api, table, tips, callBack);
};

// table操作根据状态显示和操作
export const tableStatues = (list, api, table, other = { key: "status" }) => {
    router = useRouter();
    let { key, edit, del } = other;
    let arr = [];
    arr = list.map((item) => {
        return {
            perCode: item.perCode,
            name: (val) => (val.status != item.value ? item.label : ""),
            method: (row) => {
                let tips = {
                    title: `确定把状态改为${item.label}?`,
                    success: "操作成功",
                    params: {
                        id: row.id,
                        [key]: item.value,
                    },
                };
                messageBox(row, api, table, tips);
            },
        };
    });
    edit &&
        arr.unshift({
            name: "编辑",
            perCode: edit.perCode,
            method: (val) => {
                router.push({ path: edit.path, query: { id: val.id } });
            },
        });
    del &&
        arr.push({
            perCode: del.perCode,
            name: "删除",
            method: (val) => {
                deleteItem(val, del.fun, table);
            },
        });
    return arr;
};

// 取两数组之间的差值,arrA小数组，arrB大数组，a相当于b的差值
export const differenceArray = (arrA, arrB) => {
    let setA = new Set([...arrA]);
    let setB = new Set([...arrB]);
    let diff = Array.from(new Set(arrB.filter((x) => !setA.has(x))));
    return diff || [];
};

// 跳转
export const jumps = (path, query) => {
    console.log("path,query", path, query);
    // const router=useRouter();
    console.log("router", router, useRouter);
    return router.push({ path });
};

// 运算
export const operation = (obj, str = "a*b", fix = 2) => {
    let fixNum = 10000;
    let opStr = str.match(/[a-z]{1,}[0-9]{0,}/gi);
    let sss = str.replace(/[a-z]{1,}[0-9]{0,}/gi, "aaa");
    let end = 0;
    opStr.forEach((v) => {
        sss = sss.replace("aaa", `obj.${v}`);
    });
    opStr.forEach((key) => {
        if (obj[key] == undefined || obj[key] == null) {
            obj[key] = 0;
        } else {
            obj[key] = parseInt(obj[key] * fixNum) / fixNum;
        }
    });
    try {
        let str = sss.split("=")[0];
        end = eval(str);
    } catch (err) {
        console.log(err);
    }
    return (parseInt(end * fixNum) / fixNum).toFixed(fix) * 1;
};

// 对象转url字符串
export const objToUrl = (obj) => {
    let str = "";
    for (let key in obj) {
        str += `&${key}=${obj[key]}`;
        console.log(key, obj[key]);
    }
    str = str.replace("&", "?");
    return str;
};
