<!--
 * @Author: jiu yin
 * @Date: 2021-11-16 11:44:39
 * @LastEditTime: 2022-02-18 15:52:49
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \hall-admin\src\components\Form\index.vue
 * jiu
-->
<template>
   <div class="box">
      <el-config-provider :locale="zhCn">
         <el-form ref="formDataInfo"
                  :size="size"
                  :inline="inline"
                  :validate-on-rule-change="false"
                  :label-width="labelWidth"
                  label-position="right"
                  :model="formData"
                  :rules="formRules">
            <el-form-item v-for="item in formList"
                          :label="item.label"
                          :prop="item.code"
                          :key="item.label"
                          class="formItemId"
                          size="mini"
                          :style="formItemStyle"
                          :label-width="item.labelWidth"
                          :class="[item.required||false ?'is-required':'',
                                   item.class?item.class:'']">
               <!-- 输入框 -->
               <el-input v-if="!item.el"
                         v-model="formData[item.code]"
                         @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                         :disabled="item.disabled?item.disabled || item.disabled(formData):false"
                         :maxlength="item.maxlength || null"
                         :minlength="item.minlength || null"
                         :placeholder="item.placeholder || null"
                         :style="{ width: item.width }"
                         :prefix-icon="item.prefix_icon||''"
                         :suffix-icon="item.suffix_icon||''"
                         :class="item.classInput"
                         clearable>
                  <template #suffix>
                     <span v-html="item.suffix"
                           class="span"></span>
                  </template>
               </el-input>
               <!-- 文本域 -->
               <el-input v-if="item.el == 'textarea'"
                         type="textarea"
                         :disabled="item.disabled?item.disabled || item.disabled(formData):false"
                         @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                         v-model="formData[item.code]"
                         show-word-limit
                         :maxlength="item.maxlength || null"
                         :autosize="{minRows: 6}"
                         :style="{ width: item.width }"></el-input>
               <!-- 下拉框  filterable本地搜索 &&remote远程搜索 :remote-method="remoteMethod" 异步执行函数 :loading="true"-->
               <template v-if="item.el == 'select'">
                  <div class="selectClass">
                     <el-select v-model="formData[item.code]"
                                :filterable="item.filterable"
                                :remote="item.remote"
                                :remote-method="item.remoteMethod"
                                :loading="item.loading"
                                @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                                style="width:100%"
                                :placeholder="item.placeholder || '请选择'"
                                :disabled="item.disabled?item.disabled || item.disabled(formData):false"
                                clearable
                                :multiple="item.multiple||false">
                        <el-option v-for="op in item.options"
                                   :label="op.name"
                                   :key="op.id"
                                   :value="op.id"
                                   :disabled="op.disabled?op.disabled || op.disabled(formData):false">{{op.name}}</el-option>
                     </el-select>
                     <!--  iconSelect组件传值整体不显示默认true
                     optionsFn 是否为函数  iconOff 关闭-->
                     <i v-if="iconSelect&& item.optionsFn&&!item.iconOff"
                        class="el-icon-refresh refresh"
                        @click="refresh(item,true)">
                     </i>
                  </div>
               </template>
               <!-- 单独来源下拉框 store获取-->
               <template v-if="item.el == 'selectSource'">
                  <el-select v-model="formData[item.code]"
                             @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                             :disabled="item.disabled?item.disabled || item.disabled(formData):false">
                     <el-option v-for="op in item.options"
                                :label="op.name"
                                :value="op.id"
                                :key="op.value"
                                :disabled="op.disabled?op.disabled || op.disabled(formData):false">{{op.name}}</el-option>
                  </el-select>
                  <i class="el-icon-refresh refresh"></i>
               </template>
               <!-- 单选 -->
               <el-radio-group v-if="item.el == 'radio'"
                               :label="item.label"
                               v-model="formData[item.code]"
                               @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                               :disabled="item.disabled?item.disabled || item.disabled(formData):false"
                               :style="{ width: item.width }">
                  <el-radio v-for="ra in item.radios"
                            :label="ra.id"
                            :key="ra.id"
                            :disabled="ra.disabled?ra.disabled || ra.disabled(formData):false">{{ ra.name }}</el-radio>
               </el-radio-group>
               <!-- 单选按钮 -->
               <el-radio-group v-if="item.el == 'radioButton'"
                               v-model="formData[item.code]"
                               @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                               :disabled="item.disabled?item.disabled || item.disabled(formData):false">
                  <el-radio-button v-for="ra in item.radios"
                                   :label="ra.id"
                                   :key="ra.id"
                                   :disabled="item.disabled?item.disabled || item.disabled(formData):false">{{ ra.name }}</el-radio-button>
               </el-radio-group>
               <!-- 复选框 数组没绑定code后端传的字符串 自己处理成数组 checkboxArr 选中数组[1,2] 对应值为 item.checkboxs的value-->
               <el-checkbox-group v-if="item.el == 'checkbox'"
                                  v-model="item.checkboxArr"
                                  @change="item.change?item.change(item.checkboxArr,item,formData,formList):null"
                                  :disabled="item.disabled?item.disabled || item.disabled(formData):false">
                  <el-checkbox v-for="che in item.checkboxs"
                               :label="che.value"
                               :key="che.value"
                               :disabled="che.disabled?che.disabled || che.disabled(formData):false">{{che.label }}
                  </el-checkbox>
               </el-checkbox-group>
               <!-- 日期 type daterange时间日期范围 datetime 时间点 datetimerange范围时间点 格式"YYYY-MM-DD HH-mm-ss"-->
               <el-date-picker v-if="item.el == 'date'"
                               :type="item.type||'date'"
                               placeholder="请选择时间"
                               v-model="formData[item.code]"
                               :style="{ width: item.width||'122px'}"
                               @change="item.change?item.change(value_format(item.type,formData[item.code],item.format?item.format:'YYYY-MM-DD',item),item,formData,formList):value_format(item.type,formData[item.code],item.format?item.format:'YYYY-MM-DD',item)"
                               range-separator="-"
                               start-placeholder="开始日期"
                               end-placeholder="结束日期"
                               :disabled="item.disabled?item.disabled || item.disabled(formData):false"></el-date-picker>
               <!-- 时间小时 is-range时间范围 -->
               <el-time-picker v-if="item.el == 'time'"
                               v-model="formData[item.code]"
                               :style="{ width: item.width||'122px'}"
                               :is-range="item.range||false"
                               range-separator="至"
                               :placeholder="item.placeholder||'请选择时间'"
                               :start-placeholder="item.start_placeholder||'开始时间'"
                               :end-placeholder="item.end_placeholder||'结束时间'"
                               :disabled="item.disabled?item.disabled || item.disabled(formData):false"
                               @change="item.change?item.change(value_format('datetime',formData[item.code],item.format||'HH:mm:ss',item),item,formData,formList):value_format('datetime',formData[item.code],item.format||'HH:mm:ss',item)"
                               :format="item.format||'HH:mm:ss'" />
               <!-- 滑块 -->
               <!-- <el-slider v-if="item.type=='Slider'" v-model="formData[item.code]"></el-slider> -->
               <!-- 开关 -->
               <el-switch v-if="item.el == 'switch'"
                          v-model="formData[item.code]"
                          :active-text="item.activeText"
                          :inactive-text="item.inactiveText"
                          :active-value="item.activeValue||1"
                          :inactive-value="item.inactiveValue||0"
                          inactive-color="#FF0000"
                          @change="item.change?item.change(formData[item.code],item,formData,formList):null"
                          :disabled="item.disabled?item.disabled || item.disabled(formData):false"></el-switch>
               <!--图片上传ImgType["png", "jpg", "jpeg"] limit张数 tips自定义提示 ratio尺寸-->
               <UploadImgDrag v-if="item.el == 'upImg'"
                              v-model="formData[item.code]"
                              :disabled="item.disabled?item.disabled || item.disabled(formData):false"
                              :size="item.size || 500"
                              :limit="item.limit || 1"
                              :ImgType="item.ImgType"
                              :tips="item.tips"
                              :ratio="item.ratio || ''" />
               <!-- 图片裁剪 -->
               <uploadCropperImg v-if="item.el == 'crImg'"
                                 @fileChange="item.change?item.change(formData[item.code],item,formData,formList):null"
                                 v-model:value="formData[item.code]"
                                 :size="item.size || 500"
                                 :limit="item.limit || 1"
                                 :ratio="item.ratio || ''" />

               <!-- 视频    TODO音视频组件oss暂时不能用-->
               <uploadVideo v-if="item.el == 'video'"
                            v-model:value="formData[item.code]"
                            :size="item.size || 1000"
                            :limit="item.limit || 1" />
               <!-- 音频  -->
               <uploadAudio v-if="item.el == 'audio'"
                            v-model:value="formData[item.code]"
                            :size="item.size || 1000"
                            :limit="item.limit || 1" />
               <!--富文本editer-->
               <editer v-if="item.el == 'editer'"
                       v-model:value="formData[item.code]"
                       code="editer"
                       :show="true"
                       :style="{width:'700px'}"
                       :disabled="item.disabled?item.disabled || item.disabled(formData):false" />
               <!-- 省市区   省市areaType:true  change 默认返回数组参数-->
               <el-cascader v-if="item.el == 'area'"
                            v-model="formData[item.code]"
                            :options="item.areaType?schoolAreaData2:schoolAreaData"
                            :props="{ expandTrigger: 'hover' }"
                            @change="item.change?item.change:null"></el-cascader>
               <slot :name="item.slotName"
                     v-if="item.slotName"
                     :data="slotData(formData[item.code],item,formData,formList)"></slot>
            </el-form-item>
            <el-form-item :style="butStyle"
                          v-if="isBut">
               <el-button @click="onSubmit"
                          v-if="isOnSubmits"
                          type="primary">{{onSubmits}}</el-button>
               <el-button @click="onInfo"
                          v-if="isOnInfos"
                          type="primary">{{onInfos}}</el-button>
               <el-button @click="onAdd"
                          v-if="isAdd"
                          type="primary">{{onAdds}}</el-button>
               <slot :name="butSlotName"
                     v-if="butSlotName"></slot>
            </el-form-item>
         </el-form>
      </el-config-provider>
   </div>
</template>
<script>
import {
   computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref,
   toRefs, watch, watchEffect, nextTick
} from 'vue';
import { ElMessage } from 'element-plus';
//el-puls 中文包裹
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import UploadImgDrag from "@/components/uploadImg";
import uploadCropperImg from "@/components/uploadCropperImg";
import uploadVideo from "@/components/uploadVideo";
import uploadAudio from "@/components/uploadAudio";
import editer from "@/components/editer";

//校验表
import { regCheck } from "./utils";
import { log } from '@/utils';
/*
==================formList:类型Array

属性 el:表单类型 label：名字  /code：formData绑定 /disabled：禁用 可Boolean
可function() /@change(当前值，当前项，绑定对象，数组对象) /required：是否必填
rules：String 在utils里对应验证正则 不写则提示不能为空 /selectSource 来源类型的下拉
自动store获取 /select： options为Array || 接口function 刷新图标为function显示

==================自定义插槽
    <template #插槽名字="data">
    {val, item, formData, formList} ={data}
    </template>
  formList数组当前项 slotName:"插槽名字"
*/
export default defineComponent({
   components: {
      UploadImgDrag,
      uploadCropperImg,
      uploadVideo,
      uploadAudio,
      editer
   },
   props: {
      //表单总长度
      formItemStyle: {
         type: Object,
         default: { width: '400px' },
      },
      //表单前面label
      labelWidth: {
         type: String,
         default: "110px",
      },
      size: {
         type: String,
         default: "mini",
      },
      //是否行内
      inline: {
         type: Boolean,
         default: false,
      },
      //表格头不显示刷新图标
      iconSelect: {
         type: Boolean,
         default: true
      },
      //按钮名字
      onInfos: {
         type: String,
         default: "查询",
      },
      //隐藏其中一个按钮
      isOnInfos: {
         type: Boolean,
         default: false,
      },
      //按钮名字
      onSubmits: {
         type: String,
         default: "确定",
      },
      //不显示确定按钮
      isOnSubmits: {
         type: Boolean,
         default: true,
      },
      //第三个add名字
      onAdds: {
         type: String,
         default: "添加",
      },
      //不显示确定按钮
      isAdd: {
         type: Boolean,
         default: false,
      },
      //不显示全部按钮
      isBut: {
         type: Boolean,
         default: true,
      },
      //按钮样式
      butStyle: {
         type: Object,
         default: {},
      },
      butSlotName: {
         type: String,
      },
      formList: {
         type: Array,
         default: () => [],
      },
      formDatas: {
         type: Object,
         default: () => { },
      },
   },
   emits: ["onSubmit", "onInfo", "onAdd"],
   setup(props, context) {
      const store = useStore();
      const router = useRouter();
      const route = useRoute();
      const formDataInfo = ref(null);
      //逻辑层主体
      const state = reactive({
         formData: {},
         formRules: {},
         //时间组件值需拷贝
         timePicker: {}
      });
      watchEffect(() => {
         state.formData = { ...props.formDatas };
      });

      computed(() => { });
      onMounted(() => {
         regValidator();
         selectSource();
      });
      //规则校验添加rules
      const regValidator = () => {
         props.formList.forEach((item, index) => {
            if (item.required || item.rules||item.rulesFn) {
               //表单全局校验会走validator这个api 所以必须callback();
               const validator = (rule, value, callback) => {
                  let reg = false;
                  if (item.rules) { reg = regCheck[item.rules].regular.test(value); };
                  //身份证特殊算法验证
                  let fnReg = true;
                  if (item.rulesFn) {
                     fnReg = regCheck[item.rulesFn].fn(value).valid;
                  }
                  switch (true) {
                     case !value && value !== 0 && item.required:
                        return callback(new Error(item.placeholder || `请输入${item.label}`));
                     case (value && item.rules && !reg):
                        return callback(new Error(regCheck[item.rules].error));           
                     case (!fnReg):
                        return callback(new Error(regCheck[item.rules].error));
                     default:
                        callback();
                        break;
                  }
               };
               state.formRules[item.code] = [{ validator, trigger: item.trigger || 'blur' }];
            }
         });
      };
      //提交验证erro滚动到指定节点
      const scrollIntoViewFn = (pass, callbacks) => {
         formDataInfo.value.validate(valid => {
            //处理后的值不影响原值
            let formDate = { ...state.formData, ...state.timePicker };
            if (valid)
               context.emit(pass, formDate, formDataInfo.value),
                  callbacks && callbacks(formDate);
            if (!valid) {
               nextTick(() => {
                  let isError = document.getElementsByClassName('is-error');
                  return isError[0].scrollIntoView({
                     // 滚动到指定节点值有start,center,end，nearest显示在视图区域
                     block: 'start',
                     // 值有auto、instant,smooth，缓动动画（当前是慢速的）
                     behavior: 'smooth',
                  });
               });
            }
         });
      };
      //初始化数据处理
      const selectSource = () => {
         props.formList.forEach((item) => {
            //'来源'单独store获取
            if (item.el == "selectSource") {
               item.options = sessionStorage.get("selectSource") || [];
            }
            //下拉框接口拉取
            if (item.el == "select" && typeof item.optionsFn == "function") {
               refresh(item);
            }
            //复选框的坑 需拿到数组给本地数组赋值
            if (item.el == "checkbox") {
               state.formData[item.code] = item.checkboxArr;
               if (typeof item.checkboxArrs == "function") {
                  item.checkboxArrs().then((res) => {
                     res.code == 200 ? item.checkboxArrs = res.data : item.checkboxArrs = [];
                  }).catch(() => ElMessage.error(`${item.label}复选框数据获取失败`));
               }
            }
         });
      };
      //下拉框刷新
      const refresh = (item, msg = false) => {
         item.optionsFn(item.params || {}).then((res) => {
            if (res.code == 200) {
               item.options = res.data;
               msg ? ElMessage.success(`${item.label}数据刷新成功`) : null;
            }
         }).catch(() => ElMessage.error(`${item.label}下拉框数据获取失败`));
      };

      //slot插槽返回数据
      const slotData = (val, item, formData, formList) => {
         return { val, item, formData, formList };
      };
      //时间格式替换
      const value_format = (type, time, format, item) => {
         //时间组
         if (type && type != "data" && type != "datetime") {
            let [start, end] = time;
            let format1 = format;
            let format2 = format;
            let timeObjStart = timeObj(start);
            for (let key in timeObjStart) {
               format1 = format1.replace(key, timeObjStart[key]);
            }
            let timeObjEnd = timeObj(end);
            for (let key in timeObjEnd) {
               format2 = format2.replace(key, timeObjEnd[key]);
            }
            return state.timePicker[item.code] = [format1, format2];
         } else {
            //单个时间
            let timeObjs = timeObj(time);
            for (let key in timeObjs) {
               format = format.replace(key, timeObjs[key]);
            }
            console.log(format);
            return state.timePicker[item.code] = format;
         }
      };
      //时间计算
      const timeObj = (dates) => {
         let date = new Date(dates);
         let objTime = {
            YYYY: date.getFullYear(),
            MM: toString((date.getMonth() + 1)),
            DD: toString(date.getDate()),
            HH: toString(date.getHours()),
            mm: toString(date.getMinutes()),
            ss: toString(date.getSeconds()),
         };
         return objTime;
      };
      //时间个位数填充0
      const toString = (num) => {
         if (num || num == 0) {
            num = num.toString().padStart(2, "0"); return num;
         };
      };
      //确定
      const onSubmit = () => {
         debounce(() => { return scrollIntoViewFn('onSubmit'); }, 300);
      };
      //查询
      const onInfo = () => {
         debounce(() => { return scrollIntoViewFn('onInfo'); }, 300);
      };
      //添加
      const onAdd = () => {
         debounce(() => { return scrollIntoViewFn('onAdd'); }, 300);
      };

      //防抖
      let timeOut;
      const debounce = (fn, delay) => {
         clearTimeout(timeOut);
         timeOut = setTimeout(() => {
            fn();
         }, delay);
      };

      //节流
      let is = true;
      const throttle = (fn, delay) => {
         if (!is) return;
         is = false;
         setTimeout(() => {
            fn(); is = true;
         }, delay);
      };

      onBeforeUnmount(() => { clearTimeout(timeOut); });

      //count或book.name改变了
      // watch([() => book.name, count], ([name, count], [preName, preCount]) => {},)
      return {
         ...toRefs(state),
         onSubmit,
         formDataInfo,
         onInfo,
         refresh,
         slotData,
         zhCn,
         value_format,
         schoolAreaData,
         schoolAreaData2,
         onAdd,
         regValidator,
         scrollIntoViewFn
      };
   },
});
</script>
<style lang='scss' scoped>
.box {
   height: 100%;
   .selectClass {
      position: relative;
      .refresh {
         position: absolute;
         top: 0;
         right: -30px;
         transform: translateY(25%);
         display: inline-block;
         font-size: 20px;
         vertical-align: middle;
         padding-left: 10px;
         cursor: pointer;
         &:hover {
            color: #409eff;
         }
      }
   }
   .span {
      display: inline-block;
      padding: 0 5px;
   }
}
</style>
<style lang='scss'>
// el-item
.formItemId {
   .el-form-item__label {
      &:after {
         content: "：";
      }
   }
}
</style>
