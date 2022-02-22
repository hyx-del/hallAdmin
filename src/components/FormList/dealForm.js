// 处理表单的返回结果
import { backType, parseTime } from "./utils";
import { dataFormat, inConfig } from "./config";

export const dealForm = (state, formObj = {}) => {
    let inFormObj = { ...state.inFormObj, ...formObj };
    let arrayObj = Object.keys(state.arrayObj);
    let backObj = JSON.parse(JSON.stringify(inFormObj));
    // 数组处理
    arrayObj.forEach((key) => {
        let item = state.formListObj[key];
        if (item.el != "addItem") {
            if (backType(backObj[key], "Array") && item.backType != "Array") {
                backObj[key] = backObj[key].join(",");
            }
        }
    });

    // searchTags 的值的处理
    let refSeachObj = Object.keys(state.refSeachObj);
    refSeachObj.forEach((key) => {
        let item = state.formListObj[key];
        if (item.backType != "Array") {
            backObj[key] = inFormObj[key].map((val) => val.value).join(",");
        }
    });

    // refVideo 视频值的处理
    let refVideo = Object.keys(state.refVideo);
    refVideo.forEach((key) => {
        if (typeof backObj[key] == "object") {
            let item = state.formListObj[key];
            try {
                backObj[key] = inFormObj[key].url || "";
                backObj[item.timeCode || key + "_time"] =
                    inFormObj[key].len || "";
                backObj[item.nameCode || key + "_name"] =
                    inFormObj[key].oldName || "";
            } catch (err) {
                backObj[key] = "";
                backObj[item.timeCode || key + "_time"] = "";
                backObj[item.nameCode || key + "_name"] = "";
            }
        }
    });
    // 日期的处理
    let refDate = Object.keys(state.refDate);
    let timeArr = ["datetimerange", "daterange", "monthrange", "dates"];
    refDate.forEach((key) => {
        let item = state.formListObj[key];
        // 多日期兼容
        if (
            timeArr.includes(item.type) &&
            typeof inFormObj[key] == "object" &&
            inFormObj[key] != null
        ) {
            let midArr = inFormObj[key].map((v) =>
                parseTime(v, item.dataFormat || dataFormat[item.type])
            );
            backObj[key] = midArr.join(",");
            // 如果有日期接收组
            let otherCodeArr = item.otherCodeArr;
            if (otherCodeArr) {
                backObj[otherCodeArr[0]] = midArr[0];
                backObj[otherCodeArr[1]] = midArr[1];
            }
            if (item.backType == "Date") {
                backObj[otherCodeArr[0]] = new Date(midArr[0]);
                backObj[otherCodeArr[1]] = new Date(midArr[1]);
            }
        } else {
            backObj[key] = parseTime(
                inFormObj[key],
                item.dataFormat || dataFormat[item.type]
            );
        }
    });

    // 日期分割字符串处理
    let splitCodeObj = Object.keys(state.splitCodeObj);
    splitCodeObj.forEach((code) => {
        let item = state.formListObj[code];

        let value =
            typeof inFormObj[code] == "object" && inFormObj[code] != null
                ? inFormObj[code]
                : inFormObj[code]
                ? inFormObj[code].split(",")
                : [];
        value = value.filter((v) => v != "");
        let splitCode = item.splitCode.split(",");
        if (item.el == "date") {
            splitCode.forEach((key, i) => {
                backObj[key] = value[i]
                    ? parseTime(
                          value[i],
                          item.dataFormat || dataFormat[item.type]
                      )
                    : "";
            });
        }
    });

    // 时间处理
    let refTime = Object.keys(state.refTime);

    refTime.forEach((key) => {
        let item = state.formListObj[key];
        // 选择区间时间
        if (typeof inFormObj[key] == "object" && inFormObj[key] != null) {
            let midArr = inFormObj[key].map((v) => parseTime(v, "{h}:{i}:{s}"));
            let otherCodeArr = state.formListObj[key].otherCodeArr;

            if (otherCodeArr) {
                backObj[otherCodeArr[0]] = midArr[0];
                backObj[otherCodeArr[1]] = midArr[1];
            }
        } else {
            backObj[key] = parseTime(inFormObj[key], "{h}:{i}:{s}");
        }
    });
    let refCascader = Object.keys(state.refCascader);
    refCascader.forEach((code) => {
        let item = state.formListObj[code];
        if (item.cascaderValue == "end") {
            backObj[code] = inFormObj[code]
                .map((v) => v.value.split(",")[v.value.split(",").length - 1])
                .join(",");
            backObj[item.firstCode || "firstCode"] = inFormObj[code]
                .map((v) => v.value.split(",")[0])
                .join(",");
        } else {
            backObj[code] = inFormObj[code].map((v) => v.value).join("||");
        }
    });

    // 对于 结果的最终处理
    state.inList.map((item) => {
        let { el, code } = item;
        if (item.backType == "Array" && backType(backObj[code], "String")) {
            backObj[code] = backObj[code].split(",");
        }
        // 默认值处理
        if (item.default &&(inFormObj[code]===undefined||inFormObj[code]==='')) {
            backObj[code] = item.default;
        }

        if (inFormObj[code]) {
            // 对结果属性的处理 ArrayString对结果JSON.stringify处理，
            // ArrayStringNumber对结果处理number后再JSON.stringify处理
            if (
                item.backType == "ArrayString" ||
                item.backType == "ArrayStringNumber"
            ) {
                if (backType(backObj[code], "String")) {
                    try {
                        let mid = JSON.parse(backType(backObj[code]));
                        if (!backType(mid, "Array")) {
                            let turn = backObj[code].split(",");
                            if (item.backType == "ArrayStringNumber") {
                                turn = turn
                                    .map((i) => Number(i))
                                    .filter((v) => v);
                            }
                            backObj[code] = JSON.stringify(turn);
                        }
                    } catch (err) {
                        let turn = backObj[code].split(",");
                        if (item.backType == "ArrayStringNumber") {
                            turn = turn.map((i) => Number(i)).filter((v) => v);
                        }
                        backObj[code] = JSON.stringify(turn);
                    }
                }
                if (backType(backObj[code], "Array")) {
                    let turn = backObj[code];
                    if (item.backType == "ArrayStringNumber") {
                        turn = turn.map((i) => Number(i)).filter((v) => v);
                    }
                    backObj[code] = JSON.stringify(turn);
                }
            }
            // ArrayNumber 把结果的数组变成数字的数组
            if (item.backType == "ArrayNumber" && inFormObj[code]) {
                if (backType(inFormObj[code], "Array")) {
                    backObj[code] = inFormObj[code].map((v) => {
                        return parseFloat(v.replace(/[^\.0-9]/gi, "") || 0);
                    });
                }
                if (backType(inFormObj[code], "String")) {
                    backObj[code] = [parseInt(inFormObj[code])];
                }
            }
            if (item.backType == "Number") {
                if (backType(inFormObj[code], "String")) {
                    backObj[code] = parseFloat(
                        inFormObj[code].replace(/[^\.0-9]/gi, "") || 0
                    );
                }
                if (backType(inFormObj[code], ["Null", "Undefined"])) {
                    backObj[code] = 0;
                }
            }

            // 对时间不处理
            let noDel = ["date", "timePicker", "timeSelect", "addItem"];
            if (item.backType == "String" && !noDel.includes(el)) {
                if (backType(inFormObj[code], ["Null", "Undefined"])) {
                    backObj[code] = "";
                } else {
                    backObj[code] = inFormObj[code] + "";
                }
            }
        }
        // 自定义处理结果
        if (item.getValue) {
            let mix=item.getValue(inFormObj, inFormObj[code])
            backObj = {
                ...backObj,
                ...mix,
            };

        }
    });

    if (state.inConfig.pure) {
        for (let code in backObj) {
            if (state.inConfig.pureList.includes(backObj[code])) {
                delete backObj[code];
            }
        }
    }
    return backObj;
};
