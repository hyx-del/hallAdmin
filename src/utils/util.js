/*
 * @Author: 刘帝君
 * @Date: 2021-11-12 13:20:48
 * @LastEditors: 刘帝君
 * @LastEditTime: 2021-11-16 14:36:55
 * @Descripttion:
 */
import * as CryptoJS from "crypto-js";

// 传入位运算数字获取数组
export const orCount = (num,type='String',n=10) => {
    let list=[]
    for (let i = 0; i < n; i++) {
        list.push(2**i)
    }
    let back=[]
    if (typeof num=='string') {
        num=Number(+num)
    }
    list.map(n=>{
        if ((num|n)===num) {
            back.push(n)
        }
    })
    if (type=='String') {
        back=back.map(v=>v+'')
    }
    return back
};
// 传入位运算数字获取数组
export const orCountAdd = (list=[]) => {
    if (typeof list =='string') {
        list=list.split(',')
    }
    let back=0
    list.map((num=>{
        back=back|num
    }))
    return back
};



/**
 *加密处理
 */
export const encryption = params => {
  let { data, param, key, iv } = params;
  const result = JSON.parse(JSON.stringify(data));

  param.forEach(ele => {
    var data = result[ele];
    key = CryptoJS.enc.Latin1.parse(key);
    iv = CryptoJS.enc.Latin1.parse(iv);
    // 加密
    var encrypted = CryptoJS.AES.encrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    result[ele] = encrypted.toString();
  });
  return result;
};


// 属性返回值有 Undefined Null
export function backType(cc, string) {
    var typeName = Object.prototype.toString.call(cc);
    if (typeName == "[object Object]") {
        typeName = "[object " + cc.constructor.name;
    }
    typeName = typeName.replace("]", "").slice(8);
    if (typeof string == "string") {
        return typeName == string;
    } else if (string) {
        return string.some(key => key == typeName);
    }
    return typeName;
}
// 检查连个对象是否
export const diffSame = (list1, list2) => {
    let back = list1==list2;
    if (backType(list1, "Object") || backType(list1, "Array")) {
        back = JSON.stringify(list1) == JSON.stringify(list2);
    }
    return back;
};
