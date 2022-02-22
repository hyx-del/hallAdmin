/*
 * @Author: aa
 * @Date: 2021-08-20 09:41:42
 * @LastEditors: zx
 * @LastEditTime: 2021-12-29 15:11:18
 * @Descripttion:
 */

/**
 * 格式化
 * @param { Date } day
 * @param { String } fmt
 * @returns { String } time
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0 || !time) {
        return null;
    }
    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        if (typeof time === "string") {
            if (/^[0-9]+$/.test(time)) {
                // support "1548221490638"
                time = parseInt(time);
            } else {
                time = time.replace(new RegExp(/-/gm), "/");
            }
        }

        if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
            return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
    });
    return time_str;
}

export const format = (day = new Date(), fmt = "YYYY-MM-DD HH:mm:ss") => {
    let o = {
        "M+": day.getMonth() + 1, // 月份
        "D+": day.getDate(), // 日
        "H+": day.getHours(), // 小时
        "m+": day.getMinutes(), // 分
        "s+": day.getSeconds(), // 秒
        "q+": Math.floor((day.getMonth() + 3) / 3), // 季度
        S: day.getMilliseconds(), // 毫秒
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (day.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};
// 距离当前月几个月，仅月份
export const distanceMonth = (day = new Date(), dayT = new Date()) => {
    let dataA = new Date(day),
        dataB = new Date(dayT),
        monthA = dataA.getMonth(),
        monthB = dataB.getMonth(),
        yearA = dataA.getFullYear(),
        yearB = dataB.getFullYear();
    return monthA - monthB + (yearA - yearB) * 12;
};

// 输入时间或时间戳返回当前日期，年月日或者周几
export const farmatDate = (time, seperator1 = "-", end) => {
    let endTimes = end ? new Date(end) : new Date();
    let newTimes = time ? new Date(time) : new Date();
    let year = newTimes.getFullYear(),
        endYear = endTimes.getFullYear(),
        diffYear = endYear - year;
    let week = newTimes.getDay(),
        endWeek = endTimes.getDay(),
        diffWeek = parseInt(
            (newTimes.getTime() - endTimes.getTime()) /
                1000 /
                60 /
                60 /
                24 /
                7 +
                ""
        );
    let a =
        (new Date().getTime() - new Date("2022-1-20").getTime()) /
        1000 /
        60 /
        60 /
        24 /
        7;
    let month = newTimes.getMonth() + 1;
    let strDate = newTimes.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    let date = year + seperator1 + month + seperator1 + strDate;
    let dateStr = `${year}年${month}月${strDate}日`;
    let weekStr = "周" + "日一二三四五六".charAt(week);
    return {
        year,
        diffWeek,
        diffYear,
        yearMonth: `${month}月${strDate}日`,
        month,
        day: strDate,
        week: weekStr,
        date,
        dateStr,
        monthWeek: `${month}月${strDate}日${weekStr}`,
    };
};
// 获取当前周
export const getFormatDateWeek = (time) => {
    let nowTime = time ? new Date(time).getTime() : new Date().getTime();
    let week = new Date().getDay();
    let start = week ? week - 1 : 6;
    let startDay = nowTime - start * 24 * 60 * 60 * 1000;
    let arr = [];
    for (let i = 0; i < 7; i++) {
        arr.push(farmatDate(startDay + i * 24 * 60 * 60 * 1000));
    }
    console.log("++++10", arr);
    return arr;
};

// 检查日期是否有效
export const isDateValid = (...val) =>
    !Number.isNaN(new Date(...val).valueOf());
// 计算两个日期之间的间隔
export const dayDif = (date1, date2) =>
    Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000);

// 查找日期位于一年中的第几天
export const dayOfYear = (date) =>
    Math.floor(
        (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
    );

// 最近几天
export const nearDay = (num = 0, fmt = null) => {
    return fmt
        ? format(
              new Date(new Date().getTime() + num * 24 * 60 * 60 * 1000),
              fmt
          )
        : new Date(new Date().getTime() + num * 24 * 60 * 60 * 1000);
};
