import { funList, genderList, staffStateList } from "@/utils/enum/select";
import { roleList, staffGetStaffInfoByMobile } from "@/api/staff";
import { orCount } from "@/utils/util";

export const disabledArr = [
    {
        code: "name",
        required: true,
    },
    {
        code: "nameEn",
        required: false,
    },
    {
        code: "mobile",
        required: true,
    },
    {
        code: "password",
        required: true,
    },
    // {
    //   code: "avatar",
    //   required: false
    // },
    // {
    //   code: "displayPhotos",
    //   required: false
    // },
    {
        code: "gender",
        required: false,
    },
    {
        code: "staffType",
        required: false,
    },
    {
        code: "conversionDate",
        required: false,
    },
    {
        code: "type",
        required: false,
    },
    {
        code: "conversionDate",
        required: false,
    },
    {
        code: "conversionDate",
        required: false,
    },
    {
        code: "functions",
        required: false,
    },
    {
        code: "entryTime",
        required: true,
    },
    {
        code: "address",
        required: true,
    },
    {
        code: "profile",
        required: false,
    },
    {
        code: "description",
        required: false,
    },
];
let getInfo = async (val, obj) => {
    let formObj = await staffGetStaffInfoByMobile({ mobile: val });
    let list = [];
    if (formObj.data) {
        let strArr = ["functions", "gender", "type"];
        strArr.forEach((key) => {
            formObj.data[key] = formObj.data[key] + "";
        });
        list = disabledArr.map((item) => ({
            disabled: true,
            code: item.code,
            required: false,
        }));
        let { functions = "" } = formObj.data;
        formObj.data.functions = orCount(functions);
    }
    return {
        formObj: formObj.data || { mobile: val },
        reset: formObj.data ? false : { mobile: val },
        list,
    };
};

export const itemList = [
    {
        label: "?????????",
        code: "mobile",
        maxlength: 11,
        type: "phone",
        valueChange: getInfo,
        append: "??????",
        appendClick: getInfo,
        afterSlot: "cancelMobile",
    },
    {
        label: "??????",
        code: "password",
        minlength: 6,
        maxlength: 18,
        type: "password2",
        showPassword: true,
        placeholder: "?????????6???18????????????????????????,.*#@!~",
        showType: 1,
    },
    {
        label: "????????????",
        code: "name",
        maxlength: 32,
        // type: "zh"
    },
    {
        label: "???????????????",
        code: "nameEn",
        maxlength: 32,
        required: false,
        // type: "en"
    },

    {
        el: "img",
        label: "??????",
        code: "avatar",
        ratio: "200/200",
        required: false,
    },
    {
        el: "img",
        label: "????????????",
        code: "displayPhotos",
        backType: "ArrayString",
        limit: 9,
        required: false,
    },
    {
        el: "radio",
        label: "??????",
        code: "gender",
        list: genderList,
        required: false,
        defalt: "1",
    },
    {
        el: "radio",
        label: "????????????",
        code: "staffType",
        list: staffStateList,
        required: false,
        defaultValueSort: "type",
        defalt: "1",
        showType: 1,
        valueChange: (val) => [
            {
                code: "conversionDate",
                show: val == 2,
            },
        ],
    },
    {
        label: "????????????",
        code: "type",
        list: staffStateList,
        showType: 2,
        valueChange: (val) => [
            {
                code: "conversionDate",
                show: val == 2,
            },
        ],
    },
    {
        el: "date",
        label: "????????????",
        code: "conversionDate",
        maxDate: new Date(),
        type: "date",
        format: "YYYY-MM-DD",
        show: false,
    },
    {
        el: "slot",
        label: "??????",
        code: "resetPassword",
        show: false,
        slotName: "resetPassword",
        showType: 1,
    },
    {
        el: "select",
        label: "??????",
        code: "roleIds",
        // funMode: res=>res.data.records.map(v=>({label:v.roleName,value:v.id})),
        funMode: "res.data.records",
        otherBack: "select_label", // label????????????
        back: true, // ?????????????????????
        labelCode: "roleName", // ?????????label???
        valueCode: "id", // ?????????value???
        multiple: true,
        fun: roleList,
        query: { type: "HALLING", size: 1000 },
        // backType: "ArrayNumber",
        showType: 1,
    },
    {
        label: "??????",
        code: "roleNames",
        showType: 2,
    },
    {
        el: "select",
        label: "??????",
        code: "functions",
        list: funList,
        required: false,
        multiple: true,
    },
    {
        el: "date",
        label: "????????????",
        code: "entryTime",
        type: "date",
        maxDate: new Date(),
        format: "YYYY-MM-DD",
    },
    {
        el: "textArea",
        label: "??????",
        code: "address",
        maxlength: 255,
    },
    {
        el: "textArea",
        label: "????????????",
        code: "profile",
        maxlength: 255,
        required: false,
    },
    {
        el: "editer",
        label: "????????????",
        code: "description",
        required: false,
    },
];
