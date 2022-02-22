/*
 * @Author: zx
 * @Date: 2021-11-18 15:02:08
 * @LastEditors: zx
 * @LastEditTime: 2021-12-15 14:14:48
 * @Descripttion:
 * 赵鑫补充一下 ，正则表达式的 demo   已加
 */
// 新加编辑和详情共用数据
export const itemList = [
    {
        el: "radio",
        code: "paper",
        label: "合同类型",
        list: [
            {
                label: "纸质合同",
                value: "1",
            },
            {
                label: "电子合同",
                value: "2",
            },
        ],
    },
    {
        label: "手机号",
        code: "mobile",
        maxlength: 11,
        type: "phone",
        append: "查找",
        appendClick: (val, obj) => {
            console.log(val, obj);
        },
    },
    {
        label: "密码",
        code: "password",
        minlength: 6,
        maxlength: 18,
        type: "password2",
        showPassword: true,
        placeholder: "请输入6到18位的数字或字母或,.*#@!~",
        showType: 1,
    },
    {
        label: "员工名称",
        code: "name",
        colon: " ",
        maxlength: 32,
    },
    {
        label: "自定义验证",
        code: "name10",
        colon: " ",
        maxlength: 32,
        regular:/^[0-9]*$/,//自定义验证规则
        regularError:'',//自定义规则的报错
    },
    {
        label: "自定义函数验证",
        code: "name12",
        colon: "：",
        maxlength: 32,
        trigger:'blur',//触发方式 change （默认）||blur
        checkFun:(val)=>{
            if (val==20) {
                return '错误提示'
            }
        }
    },
    {
        label: "身份证验证",
        code: "name122",
        colon: "：",
        maxlength: 18,
        checkFun:'idCard'
    },
    {
        el: "select",
        label: "下拉",
        code: "name",
        list: [
            {
                value: "2",
                label: "测试1",
            },
            {
                value: "12",
                label: "测试2",
            },
        ],
    },
];
