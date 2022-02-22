import { courseTypeList, testList } from "@/utils/enum/select";

export const itemList = [
    {
        el: "select",
        label: "类型",
        code: "type",
        list: courseTypeList,
    },
    {
        label: "课程名称",
        code: "name",
        maxlength: 30,
    },
    {
        label: "英文名称",
        code: "nameEn",
        required: false,
        maxlength: 100,
    },
    {
        el: "img",
        label: "照片",
        code: "picture",
        required: false,
    },
    {
        label: "时长",
        code: "duration",
        suffix: "分",
        type: "number",
        checkType: "number",
        maxlength: 3,
    },
    {
        label: "可约人数",
        code: "maxNumber",
        type: "number",
        checkType: "number",
        maxlength: 3,
        // maxCode: 50,
    },
    {
        label: "最少上课人数",
        code: "minNumber",
        type: "number",
        checkType: "number",
        maxlength: 3,
        default: 1,
    },
    {
        label: "权重",
        code: "weight",
        type: "number",
        checkType: "number",
        required: false,
        maxlength: 4,
    },
    {
        el: "textArea",
        label: "课程介绍",
        code: "introduction",
        maxlength: 255,
        rows:10,
        valueStyle:{
            width:'500px',
        },
    },
];
