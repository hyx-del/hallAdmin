<template>
    <div ref="formListMadia" v-resize="resize" class="myFormList">
        <el-config-provider :locale="locale">
            <el-form
                :validate-on-rule-change="false"
                ref="ruleForm"
                :inline="inConfig.inline"
                :rules="rules"
                :model="inFormObj"
            >
                <div
                    v-for="item in inList"
                    class="formListItem"
                    :name="item.code"
                    :style="{
                        display: inConfig.inline ? 'inline-block' : 'block',
                        ...{
                            width:
                                item.itemWidth || itemWidth
                                    ? item.itemWidth || itemWidth
                                    : null,
                        },
                        ...item.style,
                    }"
                    :key="item.code || item.slotName"
                >
                    <div v-if="item.show">
                        <div class="formLine" v-if="item.el == 'line'"></div>
                        <!--前缀选择-->
                        <el-checkbox
                            v-if="item.preCheck"
                            class="formCheck"
                            @change="checkItemObjChange(item)"
                            v-model="inCheckItemObj[item.code]"
                        ></el-checkbox>
                        <!--整个元素作为插槽的插槽-->
                        <slot
                            v-if="item.el == 'itemSlot'"
                            :name="item.slotName"
                        ></slot>
                        <!--整个元素作为插槽的内部插槽-->
                        <template v-if="item.inItemSlot">
                            <inSlot
                                :item="item"
                                mode="inItemSlot"
                                :value="inFormObj[item.code]"
                            />
                        </template>
                        <el-form-item
                            v-if="!noEl.includes(item.el)"
                            :style="{ ...item.valueStyle }"
                            :class="{ 'is-required': item.required }"
                            :prop="item.code"
                            :label="item.inLabel"
                            :label-width="
                                item.labelWidth || inLabelWidth || 'auto'
                            "
                        >
                            <div
                                :style="{ ...inConfig.rightStyle }"
                                class="rightStyle"

                            >
                                <!--布局元素-->
                                <template v-if="layoutItems.includes(item.el)">
                                    <inSlot
                                        :item="item"
                                        mode="layout"
                                        :value="inFormObj[item.code]"
                                    />
                                </template>
                                <!--普通输入元素-->
                                <template v-else-if="isSimple(item.el)">
                                    <!--                                    :is="item.inEl"-->

                                    <component
                                        :is="getComponent(item)"
                                        v-bind="item.inherit"
                                        v-model="inFormObj[item.code]"
                                        @change="formChange(item.el, item.code)"
                                        :name="item.code"
                                    >
                                        <template
                                            v-for="slots in slotNames"
                                            v-slot:[dynamicslotname(item,slots)]
                                        >
                                            <inSlot
                                                :item="item"
                                                :mode="slots"
                                            />
                                        </template>
                                    </component>
                                </template>
                                <div
                                    v-if="item.refresh"
                                    class="refresh iconfont"
                                    :class="item.class || 'icon-update'"
                                    @click="refreshQuest(item)"
                                ></div>
                                <!--复杂输入元素-->
                                <template v-if="!isSimple(item.el)">
                                    <component
                                        :is="getComponent(item)"
                                        :item="item"
                                        :list="backList[item.code] || item.list"
                                        v-model="inFormObj[item.code]"
                                        @changValue="changValue"
                                        @upLoad="upLoad"
                                        :ref="item.code"
                                        :name="item.code"
                                    />
                                </template>
                                <!--内部插槽-->
                                <template v-if="item.inSlot">
                                    <inSlot
                                        :item="item"
                                        mode="inSlot"
                                        :value="inFormObj[item.code]"
                                    />
                                </template>
                                <!--外部插槽-->
                                <slot
                                    v-if="item.el == 'slot'"
                                    :name="item.slotName"
                                    :value="inFormObj[item.code]"
                                ></slot>
                                <slot
                                    v-if="item.afterSlot"
                                    :name="item.afterSlot"
                                    :value="inFormObj[item.code]"
                                ></slot>
                                <!--底部提示-->
                                <div v-if="item.tips" class="tips">
                                    {{ item.tips }}
                                </div>
                            </div>
                        </el-form-item>
                    </div>
                </div>
                <!--按钮-->
                <component
                    :is="getComponent(inConfig.button)"
                    v-bind="
                        getInherit(
                            inConfig.button,
                            (inConfig.button && inConfig.button.el) ||
                                'formItem'
                        )
                    "
                    v-if="inButtons && inButtons.length > 0"
                >
                    <el-button
                        v-for="(bts, index) in inButtons"
                        v-bind="getInherit(bts, 'button', { size: 'small' })"
                        v-show="showButtom(bts && bts.perCode)"
                        :key="index"
                        :loading="bts.funType == 'confirm' ? inLoading : false"
                        @click="buttonsClick(bts)"
                    >
                        {{ bts.name }}
                    </el-button>
                </component>
            </el-form>
        </el-config-provider>
    </div>
</template>

<script>
import {
    toRefs,
    ref,
    reactive,
    watch,
    onMounted,
    onBeforeUnmount,
    computed,
    provide,
    getCurrentInstance,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

import {
    backType,
    debounce,
    diffSame,
    getlabelWidth,
    showButtom,
} from "./utils";
import {
    defaultButtons,
    inConfig,
    inputArr,
    updateArr,
    inheritObj,
    highInherit2,
    highList,
    resetDefalt,
    numberArr,
    resetDefaltList,
    checkType,
    layoutItems,
} from "./config";
import uploadImg from "@/components/uploadImg";
import uploadCropperImg from "@/components/uploadCropperImg";
import uploadVideo from "@/components/uploadVideo";
import uploadAudio from "@/components/uploadAudio";
import uploadFile from "@/components/uploadFile";
import editer from "@/components/editer";
import provinces from "@/components/FormList/inComponents/provinces";
import provinces2 from "@/components/FormList/inComponents/provinces2";
import checkboxs from "@/components/FormList/inComponents/checkboxs";
import radios from "@/components/FormList/inComponents/radios";
import selects from "@/components/FormList/inComponents/selects";
import dates from "@/components/FormList/inComponents/dates";
import inSlot from "@/components/FormList/inComponents/inSlot";
import addItem from "@/components/FormList/inComponents/addItem";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { formCheck } from "@/components/FormList/formCheck";
import { dealForm } from "@/components/FormList/dealForm";
import { pushValue } from "@/components/FormList/pushValue";
import {
    byBackFunChange,
    changeObj,
    countFun,
    getFunData,
    getInherit,
    getPlaceholder,
    itemStart,
    setDefault,
    stateListChange,
    watchResize,
} from "@/components/FormList/selfTools";
export default {
    name: "formList",
    chang: null,
    value: null,
    upLoad: null,
    valid: null,
    formInitData: null,
    "update:value": null,
    "update:formInitData": null,
    components: {
        uploadImg,
        uploadCropperImg,
        uploadVideo,
        uploadFile,
        editer,
        provinces,
        provinces2,
        checkboxs,
        radios,
        inSlot,
        selects,
        dates,
        addItem,
        uploadAudio,
    },
    props: {
        // 对 preCheck 反显选中状态
        preCheck: {
            type: Object,
            required: false,
        },
        // 按钮配置
        buttons: {
            type: Array,
            required: false,
        },
        // 赋值默认值
        formInitData: {
            type: Object,
            required: false,
        },
        itemList: {
            type: Array,
            required: true,
        },
        config: {
            type: Object,
            default: () => {
                return {};
            },
        },
        // 隐藏元素
        hideList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // 显示元素
        showList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // 清空某些元素
        clearList: {
            type: Array,
            default: () => {
                return [];
            },
        },
        // 改变元素状态 例如[{code:xxx,show:false,disabld:true}]
        formState: {
            type: Array,
            default: () => {
                return [];
            },
        },
    },
    directives: {
        resize: watchResize,
    },
    setup(props, context) {
        const { emit, slots, attrs } = context;
        const state = reactive({
            layoutItems,
            hasConfirm: false,
            confirmRefObj: {},
            // 在input框的四个插槽
            slotNames: ["prepend", "append", "suffix", "prefix"],
            dynamicslotname: (item, slots) => {
                if (item[slots]) {
                    return slots;
                } else {
                    return null;
                }
            },
            // 插槽的点击
            slotClick: (item, fun) => {
                if (fun) {
                    let {code,el}=item
                    let formChange = {
                        el: item.el || el,
                        code,
                        checkValue:
                            state.inCheckItemObj[item.code] == undefined
                                ? false
                                : state.inCheckItemObj[item.code],
                        value: state.inFormObj[code],
                        allSelectCode: state.inFormObj[item.allSelectCode] || "",
                        otherBack:
                            state.inFormObj[item.otherBack || code + "_otherBack"] ||
                            "",
                    };
                    byBackFunChange(state, item, fun, () => start(), reset,ruleForm.value,formChange);
                }
            },
            // 刷新插槽
            refreshQuest: (item) => {
                getFunData(state, item, {}, true);
            },
            test: (val) => {},
            isSimple: (el) => {
                return !highList.includes(el);
            },
            getComponent: (val) => {
                let check = val.el || "span";
                if (val.el == "img") {
                    // 有剪切尺寸
                    if (val.ratio) {
                        check = "uploadCropperImg";
                    } else {
                        check = "uploadImg";
                    }
                }
                check = highInherit2[check] ? highInherit2[check] : check;
                let { el = null } = inheritObj[check];
                return el;
            },
            changValue: (change) => {
                let { code, formObj, allList = [] } = change;
                state.inFormObj = { ...state.inFormObj, ...formObj };
                formChange(null, code, { ...formObj, allList });
            },
            upLoad: (postObj) => {
                let { item, query } = postObj;
                getFunData(state, item, { ...query }, true, false);
            },
            countList: computed(() => {
                if (
                    props.config &&
                    props.config.countList &&
                    props.config.countList.length > 0
                ) {
                    return props.config.countList.map((c) => {
                        let obj = {
                            countStr: c,
                            codeArr: c.match(/[a-z]{1,}[1-9]{0,}/gi),
                            endCode: c.split("=")[1],
                        };
                        return obj;
                    });
                }
                return [];
            }),
            countCodeArr: computed(() => {
                let codeArr = state.countList.map((c) => c.codeArr);
                return Array.from(new Set(codeArr.flat() || []));
            }),
            inItemList: [],
            itemWidth: "",
            locale: zhCn,
            inLoading: false, //加载事件
            inLabelWidth: "",
            noEl: ["line", "itemSlot"],
            inList: [],
            inButtons: [],
            inFormObj: {},
            formListObj: {},
            inConfig,
            rules: {},
            inSearchVal: {},
            backList: {},
            backListRequst: {},
            refSeachObj: {},
            checkChangeObj: {},
            refDate: {},
            refTime: {},
            arrayObj: {}, //结果是数组的对象
            refCascader: {},
            deleteObj: {},
            refArea: {},
            refVideo: {},
            optionsList: schoolAreaData, //省市区数据
            optionsList2: schoolAreaData2, //省市数据
            splitCodeObj: {}, //需要分割的结果的对象
            inCheckItemObj: {}, // 选中的对象
            valueChangeArr: computed(() =>
                state.inItemList
                    .filter((v) => v.valueChange)
                    .map((val) => val.code)
            ),
            checkItemObjChange: (item) => {
                if (state.countCodeArr.includes(item.code)) {
                    countFun(state, true);
                }
                let list = [
                    {
                        code: item.code,
                        required: state.inCheckItemObj[item.code],
                    },
                ];
                if (item.preCheckLinkage) {
                    stateListChange(list, state);
                    start();
                }
                emit("checkItem", {
                    ...item,
                    checkValue: state.inCheckItemObj[item.code],
                    value: state.inFormObj[item.code],
                });
            },
            otherCount: {},
        });
        // 更新组件的state
        const upFormState = (key, obj = {}) => {
            state[key] = { ...state[key], obj };
        };
        provide("formState", state);
        provide("upFormState", upFormState);
        state.inButtons =
            props.buttons || props.config.buttons || defaultButtons;
        const ruleForm = ref(null);
        const formListRef = ref(null);
        const formListMadia = ref(null);
        const enter = () => {};
        const media = computed(() => {
            if (!props.config.media) return;
            let list = props.config.media.map((item, index) => {
                if (props.config.media.length == index + 1) {
                    return [item, 30000];
                } else {
                    return [item, props.config.media[index + 1]];
                }
            });
            return list;
        });
        const mediaObj = computed(() => {
            if (!media.value) return;
            let obj = {};
            media.value.forEach((item, index) => {
                let pei =
                    parseFloat(1 / props.config.column[index]).toFixed(4) *
                        100 +
                    "%";
                obj[item.join("_")] = {
                    column: props.config.column[index],
                    pei,
                };
            });
            return obj;
        });
        // 监听dom变化
        const formSize = () => {
            if (!media.value) return;
            if (formListMadia.value && media) {
                let { width } = formListMadia.value.getBoundingClientRect();
                let cur = media.value.filter(
                    (item) => item[0] <= width && item[1] > width
                );
                let keys = cur[0].join("_");
                state.itemWidth = mediaObj.value[keys].pei;
            }
        };
        // 获取元素变化
        const resize = (val) => {
            formSize();
        };
        onMounted(() => {
            formSize();
        });
        onBeforeUnmount(() => {});
        onMounted(() => {
            formListRef.value = getCurrentInstance().proxy;
        });
        // 初始化
        let start = (clearValid=false) => {
            state.inConfig = { ...inConfig, ...props.config }; //合并配置
            state.inConfig.default = {
                ...inConfig.default,
                ...props.config.default,
            };
            // 混入部分初始值
            state.inItemList = state.inItemList.map((item) => {
                let size =
                    item.size ||
                    (updateArr.includes(item.el)
                        ? 1024
                        : state.inConfig.default.size);
                if (
                    updateArr.includes(item.el) &&
                    !backType(item.size, "Number")
                ) {
                    size = 1024;
                }
                // 基本参数
                let defaultValue = {
                    disabled: state.inConfig.allDisabled,
                    required: state.inConfig.allRequired,
                    maxlength: item.el == "input" ? 60 : 255,
                    //后台加载数据时第一次是否请求
                    firstRequest:
                        item.firstRequest == undefined
                            ? true
                            : item.firstRequest,
                };
                item = {
                    ...defaultValue,
                    ...state.inConfig.default,
                    ...item,
                    valueStyle: {
                        ...state.inConfig.valueStyle,
                        ...item.valueStyle,
                    },
                    clearable: item.clearable || true,
                    size,
                };
                item.required =
                    item.disabled || !item.show ? false : item.required;
                item.show = item.showType != 2 && item.show ? true : false;
                item.label = item.label == undefined ? "" : item.label;
                item.inLabel = item.labelShow
                    ? item.label + (item.colon != undefined ? item.colon : "")
                    : "";
                // 未输入提示
                item.placeholder = getPlaceholder(item);
                state.formListObj[item.code] = item;
                return item;
            });
            // .filter((item) => item.show);
            state.inList = state.inItemList;
            // 最大label长度
            let maxLabelWidth = 0;
            let hasRequired = state.inList.some((item) => item.required); //是否有必选
            let hasCheckItem = state.inList.some((item) => item.preCheck); //是否选择的元素
            let rules = {}; //验证规则

            state.inList = state.inList.map((value) => {
                let { code, el = "input", label } = value;
                // 统计最长的label
                let long = getlabelWidth(value.label);
                maxLabelWidth = long > maxLabelWidth ? long : maxLabelWidth;
                if (state.noEl.includes(el) || el == "slot") {
                    return value;
                }
                if (value.showType == 2) return null;
                if (value.preCheck) {
                    state.inCheckItemObj[code] =
                        state.inCheckItemObj[code] == undefined
                            ? false
                            : state.inCheckItemObj[code];
                }
                // 从elementplus继承的属性
                value.inherit = getInherit(value, el);
                value.inEl = state.getComponent(value);
                setDefault(state, value, el, code);
                // 外部赋值区
                pushValue(state, value, el, code);

                itemStart(state, value, el, code);
                // 把list的value变成字符串
                if (value.list) {
                    let list = backType(value.list, "Array")
                        ? value.list
                        : value.list();
                    value.list = list.map((v) => {
                        if (backType(v.value, "Number")) {
                            v.value += "";
                        }
                        return v;
                    });
                }
                // 创建验证规则
                rules[code] = [];
                let midRule = formCheck(value, state, state.inFormObj);
                rules[code] = [...rules[code], ...midRule[code]];
                state.formListObj[code] = value;
                return value;
            });
            // 自动计算
            if (
                props.config &&
                props.config.countList &&
                props.config.countList.length > 0
            ) {
                countFun(state);
            }
            state.inList = state.inList.filter((v) => v);
            state.inLabelWidth =
                (props.config && props.config.labelWidth) || 0
                    ? state.config.labelWidth
                    : maxLabelWidth +
                      state.inConfig.colon.length +
                      (hasRequired || state.inConfig.allRequired ? 1 : 0) +
                      (hasCheckItem ? 1 : 0) +
                      1.5 +
                      "em";
            state.rules = rules;
            if (clearValid) {
                setTimeout(() => {
                    if (ruleForm && ruleForm.value) {
                        ruleForm.value.clearValidate();
                    }
                });
            }
        };
        let timeFun;

        //按钮事件
        const buttonsClick = (bts) => {
            if (bts.funType == "reset") {
                reset(bts);
            } else if (bts.funType == "confirm") {
                // confirm(bts)
                debounce(() => confirm(bts), 1000)();
            } else {
                let backAll = {
                    name: bts.funType || "",
                    node: ruleForm.value,
                    value: "",
                    valid: false,
                    text: bts.name,
                };
                if (bts && backType(bts.click, "Function")) {
                    try {
                        bts.click(backAll);
                    } catch (err) {
                        console.log(err);
                    }
                }
                emit("buttonClick", { ...backAll });
            }
        };
        // 重置表单
        const reset = (bts = { name: "reset" }, keep = {}) => {
            ruleForm.value.resetFields();
            let inFormObj = {};
            state.inList.forEach((item) => {
                if (item.default) {
                    inFormObj[item.code] = item.default;
                } else {
                    inFormObj[item.code] = resetDefaltList.includes(item.el)
                        ? resetDefalt[item.el]
                        : "";
                }
            });
            inFormObj = { ...inFormObj, ...state.defaultValue, ...keep };
            state.inFormObj = inFormObj;
            let backAll = {
                name: "reset",
                node: ruleForm.value,
                value: "",
                valid: false,
                text: bts.name || "",
            };
            bts && bts.click && bts.click({ ...backAll });
            emit("buttonClick", { ...backAll });
            start();
        };
        provide("resetForm", reset);
        // 确认事件
        const confirm = (bts = { name: "" }, callBack, par = {}) => {
            return new Promise((resolve, reject) => {
                ruleForm.value.validate((valid,checkFalse) => {
                    let backObj = {},
                        checkValue = {},
                        addCheck = true;
                    backObj = dealForm(state, backObj);
                    for (let code in state.inCheckItemObj) {
                        if (state.inCheckItemObj[code]) {
                            checkValue[code] = backObj[code];
                        }
                    }
                    if (state.inConfig.hasLoading) {
                        state.inLoading = true;
                        emit("update:loading", state.inLoading);
                    }
                    let backAll = {
                        node: ruleForm.value,
                        name: "confirm",
                        value: backObj,
                        checkValue,
                        checkItem: state.inCheckItemObj,
                        valid: true,
                        text: bts.name || "",
                        ...par,
                    };
                    // 拿到add item的结果
                    if (state.hasConfirm) {
                        let list = Object.keys(state.confirmRefObj);
                        list.forEach((code, index) => {
                            let addValue,
                                dom = formListRef.value.$refs[code],
                                item=state.formListObj[code]
                            ;
                            if (!item.required||!item.show) {

                            }
                            // 最后一个addItem，验证都通过

                            // 如果有dom就触发验证
                            if (dom) {
                                (async function () {
                                    if (backType(dom, "Array")) {
                                        dom = dom[0];
                                    }
                                    try {
                                        addValue = await dom.getValue();
                                        backObj[code] = addValue.value;
                                        if (addValue) {
                                            backObj[
                                                state.formListObj[code]
                                                    .otherBack ||
                                                    code + "_checkVlaue"
                                            ] = addValue.checkVlaue;
                                        }
                                        // 最后一个addItem，验证都通过
                                        if (
                                            list.length == index + 1 &&
                                            valid &&
                                            addCheck
                                        ) {
                                            backAll.value = { ...backObj };
                                            resolve({ ...backAll });
                                            callBack && callBack();
                                            bts &&
                                                bts.click &&
                                                bts.click({ ...backAll });
                                            emit("buttonClick", { ...backAll });
                                        }
                                    } catch (err) {
                                        // 只要有一个不对就不会通过
                                        addCheck = false;
                                    }
                                })();
                            }else if (
                                list.length == index + 1 &&
                                valid &&
                                addCheck
                            ) {
                                backAll.value = { ...backObj };
                                resolve({ ...backAll });
                                callBack && callBack();
                                bts &&
                                bts.click &&
                                bts.click({ ...backAll });
                                emit("buttonClick", { ...backAll });
                            }
                        });
                    } else if (valid) {
                        resolve({ ...backAll });
                        callBack && callBack();
                        bts && bts.click && bts.click({ ...backAll });
                        emit("buttonClick", { ...backAll });
                    }else{
                        let index,choseCode,keys=Object.keys(checkFalse);
                        state.inList.some((v,i)=>{
                            if (keys.includes(v.code)) {
                                index=i
                                choseCode=v.code
                                return true;
                            }
                        })
                        let labelNode = document.getElementsByName(choseCode)
                        labelNode[0].scrollIntoView(true)
                    }
                });
            });
        };
        //
        const outResults = () => {};
        // 抛出值的变化
        const formChange = (el, code, obj = {}) => {
            let item = state.formListObj[code];
            if (item.checkType && checkType[item.checkType].correctRegular) {
                let checkObj = checkType[item.checkType];
                let str = state.inFormObj[item.code] + "";
                state.inFormObj[item.code] = str.replace(
                    checkObj.correctRegular,
                    ""
                );
                if (numberArr.includes(item.checkType)) {
                    state.inFormObj[item.code] =
                        parseFloat(str.replace(checkObj.correctRegular, ""))||'';
                }
            }
            let formChange = {
                el: item.el || el,
                code,
                checkValue:
                    state.inCheckItemObj[item.code] == undefined
                        ? false
                        : state.inCheckItemObj[item.code],
                value: state.inFormObj[code],
                allSelectCode: state.inFormObj[item.allSelectCode] || "",
                otherBack:
                    state.inFormObj[item.otherBack || code + "_otherBack"] ||
                    "",
                ...obj,
                ref:ruleForm.value
            };
            // 单选，多选，下拉，下拉多选结果处理
            if (obj.allList && item.countFun) {
                state.otherCount[code] =
                    obj.allList.length > 0
                        ? item.countFun(obj.allList)
                        : item.default;
            }
            // 自动计算的值的监听
            if (state.countCodeArr.includes(code)) {
                countFun(state);
            }
            // 值变化监听执行改变dom
            if (item.valueChange) {
                byBackFunChange(
                    state,
                    item,
                    item.valueChange,
                    () => start(),
                    reset,
                    ruleForm.value,
                    formChange
                );
            }
            // 下拉联动
            if (item.seriesCode) {
                let seriesItem = state.formListObj[item.seriesCode];
                let par = (item.seriesFun &&
                    item.seriesFun(state.inFormObj[code], state.inFormObj)) || {
                    id: state.inFormObj[code],
                };
                getFunData(state, seriesItem, { ...par }, true);
            }
            emit("formChange", formChange);
            if (state.inConfig.twowayBinding) {
                emit("update:formInitData", state.inFormObj);
            }
        };
        // 改变某些元素的状态
        watch(
            () => props.formState,
            (newValue, oldValue) => {
                if (newValue != oldValue) {
                    stateListChange(newValue, state);
                    start();
                }
            },
            { deep: true, immediate: true }
        );
        // 隐藏
        watch(
            () => props.hideList,
            (newValue, oldValue) => {
                if (newValue != oldValue) {
                    let list = newValue.map((v) => ({ code: v, show: false }));
                    stateListChange(list, state);
                    start();
                }
            },
            { immediate: true }
        );
        // 对 显示某些元素
        watch(
            () => props.showList,
            (newValue, oldValue) => {
                if (newValue != oldValue) {
                    let list = newValue.map((v) => ({ code: v, show: true }));
                    stateListChange(list, state);
                    start();
                }
            },
            { immediate: true }
        );
        // 对 itemList 监听用于动态改变表单状态
        watch(
            () => props.itemList,
            (newValue, oldValue) => {
                if (!diffSame(newValue, oldValue)) {
                    state.inItemList = newValue;
                    start();
                }
            },
            { immediate: true }
        );
        // 对 preCheck 反显选中状态
        watch(
            () => props.preCheck,
            (newValue, oldValue) => {
                if (!diffSame(newValue, oldValue)) {
                    let list=[]
                    state.inCheckItemObj = {
                        ...state.inCheckItemObj,
                        ...newValue,
                    };
                    for (let key in state.inCheckItemObj) {
                        list.push({
                            code:key,
                            required:state.inCheckItemObj[key],
                        })
                    }
                    stateListChange(list,state)
                    start();
                }
            },
            { immediate: true }
        );
        // clearList 清空某些元素
        watch(
            () => props.clearList,
            (newValue, oldValue) => {
                if (newValue != oldValue && newValue.length > 0) {
                    newValue.forEach((code) => {
                        state.inFormObj[code] = "";
                        formChange(null, code);
                    });
                }
            },
            { immediate: true }
        );
        watch(
            () => props.formInitData,
            (newValue, oldValue) => {
                // 防止有些数字导致无限循环
                if (!diffSame(newValue, oldValue)) {
                    let newV = { ...newValue, ...props.formInitData };
                    newV = changeObj(newV, state);
                    state.inFormObj = { ...state.inFormObj, ...newV };
                    // 检查传入的值是否需要更新dom
                    for (let key in state.inFormObj) {
                        let item = state.formListObj[key];
                        // 如果可以是内部的对象且有返回valueChange且返回值是数组
                        if (
                            item &&
                            item.show &&
                            item.valueChange &&
                            backType(
                                item.valueChange(
                                    state.inFormObj[key],
                                    state.inFormObj
                                ),
                                "Array"
                            )
                        ) {
                            stateListChange(
                                item.valueChange(
                                    state.inFormObj[key],
                                    state.inFormObj
                                ),
                                state
                            );
                        }
                    }
                    // watchList监听
                    for (let key in state.formListObj) {
                        if (
                            state.inConfig.watchList.includes(key) &&
                            newValue[key] &&
                            oldValue[key] &&
                            newValue[key] != oldValue[key]
                        ) {
                            formChange(state.formListObj[key].el, key);
                        }
                    }
                    start(true);
                }
            },
            { immediate: true }
        );
        watch(
            () => state.inFormObj,
            (val, oldValue) => {
                if (!diffSame(val, oldValue)) {
                    let checkChangeArr = Object.keys(state.checkChangeObj);
                    // 对检查数组的监听
                    if (checkChangeArr && checkChangeArr.length > 0) {
                        checkChangeArr.forEach((key) => {
                            if (val[key] && val[key].length > 0) {
                                ruleForm.value &&
                                    ruleForm.value.validateField(key);
                            }
                            if (backType(val[key], "Object")) {
                                ruleForm.value &&
                                    ruleForm.value.validateField(key);
                            }
                        });
                    }
                }
            },
            { deep: true }
        );
        return {
            confirm,
            ruleForm,
            formListMadia,
            formListRef,
            enter,
            buttonsClick,
            formChange,
            resize,
            showButtom,
            reset,
            getInherit,
            backType,
            ...toRefs(state),
        };
    },
};
</script>
<style lang="scss" scoped>
@import "./index";
</style>
