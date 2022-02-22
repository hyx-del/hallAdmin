// 赋值解析初始值
import {
    backType,
    farmatDate,
    pushTime,
    testData,
} from "@/components/FormList/utils";
import { checkValueEl, confirmRefs } from "@/components/FormList/config";
let dethArr = ["Array", "ArrayString", "ArrayStringNumber", "ArrayNumber"];
export const pushValue = (state, item, el, code) => {
    if (confirmRefs.includes(el)) {
        state.hasConfirm = true;
        state.confirmRefObj[code] = {};
    }

    // otherCodeArr,时间和日期的区间赋值
    if (
        item.otherCodeArr &&
        (!state.inFormObj[code] ||
            (state.inFormObj[code] &&
                backType(state.inFormObj[code], "String")))
    ) {
        let midArr = [];
        if (el == "timePicker") {
            item.otherCodeArr.map((v) =>midArr.push(pushTime(state.inFormObj[v])));
            midArr=midArr.filter(v=>v)
        }
        if (el == "date") {
            if (
                backType(state.inFormObj[code], "String") &&
                state.inFormObj[code].includes(",")
            ) {
                midArr = [];
                let dateArr = state.inFormObj[code].split(",");
                midArr = dateArr.map((v) => new Date(v));
            } else {
                item.otherCodeArr.map((v) => {
                    midArr.push(state.inFormObj[v]);
                });
            }
        }
        midArr = midArr.filter((v) => v).map((v2) => new Date(v2));
        state.inFormObj[code] =
            midArr.length > 0 ? midArr : state.inFormObj[code];
    }
    if (el == "area" || el == "area2") {
        let arr = item.areaCode
            ? item.areaCode.split(",")
            : [
                  "province",
                  "provinceId",
                  "city",
                  "cityId",
                  "county",
                  "countyId",
              ];
        let midArr = [];
        if (el == "area") {

            midArr = [
                state.inFormObj[arr[1]],
                state.inFormObj[arr[3]],
                state.inFormObj[arr[5]],
            ];
        }
        if (el == "area2") {
            midArr = [state.inFormObj[arr[1]], state.inFormObj[arr[3]]];
        }
        midArr = midArr.map((v) => parseInt(v)).filter((v1) => v1);
        state.inFormObj[code] =
            midArr.length > 0 ? midArr : state.inFormObj[code];
    }

    // defaultValueSort 取值序列
    if (
        item.defaultValueSort &&
        (!state.inFormObj[code] || state.inFormObj[code].length == 0)
    ) {
        let spliteArr = backType(item.defaultValueSort, "String")
            ? item.defaultValueSort.split(",")
            : item.defaultValueSort;
        spliteArr.some((v) => {
            if (state.inFormObj[v]) {
                state.inFormObj[code] = state.inFormObj[v];
                return true;
            }
        });
    }

    // backType
    if (dethArr.includes(item.backType)) {
        // 对于空值的
        if (
            state.inFormObj[code] &&
            backType(state.inFormObj[code][0], "String")
        ) {
            try {
                state.inFormObj[code] = state.inFormObj[code]
                    .map((v) => v.replace(/\[|\]|\,/gi, "") + "")
                    .map((v) => v.replace(/\"{1,}/gi, ""))
                    .filter((v) => v);
            } catch (err) {
                state.inFormObj[code] = [];
            }
        }
        // 后端返回字符串时的处理
        if (backType(state.inFormObj[code], "String")) {
            try {
                state.inFormObj[code] = eval(state.inFormObj[code]);
                // 如果是数组的数字数组，且返回值是字符串的数组
                if (
                    item.backType == "ArrayNumber" &&
                    backType(state.inFormObj[code][0], "String")
                ) {
                    state.inFormObj[code] = state.inFormObj[code].map((v) =>
                        parseInt(v)
                    );
                }
            } catch (err) {
                // console.log(err);
            }
        }
        // 赋值的是数组，但数组的的元素是字符串的数组
        if (
            backType(state.inFormObj[code], "Array") &&
            item.backType == "ArrayNumber" &&
            backType(state.inFormObj[code][0], "Number")
        ) {
            state.inFormObj[code] = state.inFormObj[code].map(
                (v) => parseInt(v) + ""
            );
        }
    }

    // 下拉菜单，checkBox等后端返回数字，需要自动处理一下
    if (
        item.backType == "Number" &&
        backType(state.inFormObj[code], "Number") &&
        checkValueEl.includes(el)
    ) {
        state.inFormObj[code] += "";
    }
    // 如果有值但值对不上的时候
    if (item.list && state.inFormObj[code] && checkValueEl.includes(el)) {
        if (
            backType(state.inFormObj[code], "String") &&
            !item.list.some((v) => v.value == state.inFormObj[code])
        ) {

            state.inFormObj[code] = "";
        }
        let noEl=['area','area2']
        if (backType(state.inFormObj[code], "Array")&&!noEl.includes(el)) {
            let midList = item.list.filter((v) => {
                if (state.inFormObj[code].some((v2) => v2 == v.value)) {
                    return true;
                }
            });
            state.inFormObj[code] = midList.map((v) => v.value);
        }
    }
    // 沒有值的時候
    if (
        state.inFormObj[code] == undefined ||
        (state.inFormObj[code] && state.inFormObj[code].length == 0)
    ) {
        // default 没有特别的外部赋值的
        if (item.default) {
            state.inFormObj[code] = state.inFormObj[code] || item.default;
        }
    }
    if (item.setValue) {
        state.inFormObj[code] = item.setValue(
            state.inFormObj,
            state.inFormObj[code],
            state
        );
    }
};
