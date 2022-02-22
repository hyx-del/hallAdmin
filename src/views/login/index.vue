<template>
    <div class="login-body">
        <div class="login_bg" style="background-image: url('https://file.jiayu.world/common/loginbg.png')"></div>
        <div class="login_main">
            <img class="login_logo" src="../../assets/login_logo.png"/>
            <el-form
                :rules="rules"
                :model="ruleForm"
                ref="loginForm"
                class="login_form"
            >
                <el-form-item label="" prop="username">
                    <div class="login_input">
                        <div class="login_input_icon iconfont icon-a-ziyuan13"></div>
                        <el-input
                            type="text"
                            :maxlength="11"
                            v-model.trim="ruleForm.username"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <div class="login_input mb0">
                        <div class="login_input_icon iconfont icon-a-ziyuan2"></div>
                        <el-input
                            type="password"
                            v-model.trim="ruleForm.password"
                            @keyup.enter.native="submitForm"
                        />
                    </div>
<!--                    <p class="changePass" >-->
<!--                        <span class="cup" @click="dialogFormVisible = true">修改密码</span>-->
<!--                    </p>-->
                </el-form-item>
                <el-form-item>
                    <el-button
                        style="width: 100%"
                        :loading="btnLoading"
                        class="loginBut"
                        @click="submitForm"
                    >
                        立即登录
                    </el-button>
                    <!-- <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox> -->
                </el-form-item>
            </el-form>
        </div>


        <popupForm
            v-model:show="dialogFormVisible"
            :formInitData="form"
            title="修改密码"
            :itemList="itemList"
            @confirm="confirm"
        />
    </div>
</template>

<script>
import { reactive, ref, toRefs, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
    getAliOSSToken,
    getPermissionOfSchoolQue,
    getAllCityAndHallList,
} from "@/api/common";
import { staffGetPermission } from "@/api/managerStaff";
import store from "@/store";
import { removeToken, getOtherToken, setOtherToken } from "@/utils/auth";
import popupForm from "@/components/FormList/popupForm.vue";
import getRouterList from "@/utils/router";
import md5 from "js-md5";
import { encryption } from "@/utils/util";
import { ElMessage } from "element-plus";
import { staffUpdatePasswordPost } from "@/api/user";
import { log } from "@/utils";

const router = useRouter();
export default {
    components: {
        popupForm,
    },
    name: "Login",
    setup() {
        const { proxy } = getCurrentInstance();
        const router = useRouter();
        const loginForm = ref(null);
        let clearTimeoutId = null;
        onMounted(() => {
            removeToken();
            const _tempQuery = useRoute().query;
            if (_tempQuery && _tempQuery.refreshPage) {
                clearTimeoutId = setTimeout(() => {
                    clearTimeout(clearTimeoutId);
                    clearTimeoutId = null;
                    router.push({ path: "/login" });
                }, 2000);
            }
        });
        const state = reactive({
            dialogFormVisible: false,
            btnLoading: false,
            form: {},
            itemList: [
                {
                    code: "username",
                    label: "手机号",
                },
                {
                    code: "password",
                    label: "原密码",
                    showPassword: true,
                },
                {
                    code: "newPassword",
                    label: "新密码",
                    showPassword: true,
                },
                {
                    code: "newPassword2",
                    label: "确认密码",
                    showPassword: true,
                },
            ],
            ruleForm: {
                username: "",
                password: "",
            },
            confirm: (value) => {
                console.log(value);
                if (value.newPassword != value.newPassword2) {
                    ElMessage.error("两次密码不一致");
                    return;
                }
                login(value, () => {
                    const data = encryption({
                        data: value,
                        key: "4d3247ec362343b5acd489c327af7ada",
                        iv: "acd489c327af7ade",
                        param: ["newPassword"],
                    });
                    staffUpdatePasswordPost(data).then((res) => {
                        ElMessage.success("修改成功！");
                        state.dialogFormVisible = false;
                        router.go(0);
                    });
                });
            },
            carouselUrls: "",
            checked: true,
            url: "",
            rules: {
                username: [
                    {
                        required: "true",
                        message: "账户不能为空",
                        trigger: "blur",
                    },
                ],
                password: [
                    {
                        required: "true",
                        message: "密码不能为空",
                        trigger: "blur",
                    },
                ],
            },
        });
        const submitForm = async () => {
            loginForm.value.validate((valid) => {
                if (valid) {
                    const _par = { ...state.ruleForm };
                    // _par.password=md5(_par.password);
                    _par.password = _par.password;
                    state.btnLoading = true;
                    login(_par);
                } else {
                    return false;
                }
            });
        };
        // 登录
        const login = (_par, fun) => {
            // 密码加密处理
            const user = encryption({
                data: _par,
                key: "4d3247ec362343b5acd489c327af7ada",
                iv: "acd489c327af7ade",
                param: ["password"],
            });
            store
                .dispatch("user/login", {
                    username: user.username,
                    password: user.password,
                    grant_type: "admin",
                    scope: "admin",
                })
                .then(() => {
                    state.btnLoading = false;
                    // 登录后默认获取第一次阿里的token
                    getAliOSSToken().then((res) => {
                        if (res.code === 200) {
                            store.dispatch("app/updateOSSToken", res.data);
                        } else {
                            Message.error(res.msg);
                        }
                    });
                    // TODO 临时去设置顶部的权限
                    // router.push({ path: "/" });
                    getAllCityAndHallList({}).then((res) => {
                        //
                        store
                            .dispatch("user/setAllCityList2", res.data)
                            .then(() => {
                                router.push({ path: "/" });
                            });
                    });
                    // 获取用户总部和 所有学校列表
                    // getPermissionOfCityQue({}).then((res2) => {
                    //     if (res2.code == 200) {
                    //         // 获取总部菜单相应权限
                    //         store.dispatch(
                    //             "user/setHeadquarters",
                    //             res2.data.hasTeaching
                    //         );
                    //         // 获取第一个学校下面的班级列表，并获取第一个班级的菜单与按钮权限
                    //         store.dispatch(
                    //             "user/setAllCityList",
                    //             res2.data.schools
                    //         );
                    //         if (fun) {
                    //             fun();
                    //         } else {
                    //             setTimeout(() => {
                    //                 router.push({ path: "/" });
                    //             }, 500);
                    //         }
                    //     }
                    // });
                })
                .catch((res) => {
                    state.btnLoading = false;
                });
        };
        const resetForm = () => {
            loginForm.value.resetFields();
        };
        return {
            ...toRefs(state),
            loginForm,
            submitForm,
            resetForm,
        };
    },
};
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}
$bg:#4159E1;
@mixin imgWh {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.login-body {
    position: relative;
    display: flex;
    width: 100%;
    background-color: #fff;
    height: 100vh;
    //overflow: hidden;
    .login_bg{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position:center center;
        background-attachment:fixed;
        //img{
        //    position: absolute;
        //    top: 50%;
        //    left: 50%;
        //    width: 100%;
        //    min-height:100%;
        //    transform: translate(-50%,-50%);
        //}
    }
    .login_main{
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 100;
        transform: translate(-50%,-50%);
        width: 400px;
        padding: 63px 30px;
        border-radius: 4px;
        background: #fff;
        .login_logo{
            position: absolute;
            top: -120px;
            left: 0;
            width: 100%;
        }

        .login_input{
            position: relative;
            display: flex;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
            &.mb0{
                margin-bottom: 0;
            }
            &:hover{
                .login_input_icon{
                    color: $bg;
                }
                /deep/ .el-input__inner{
                    color: $bg;
                }
            }

            .login_input_icon{
                position: absolute;
                top: 8px;
                z-index: 10;
                font-size: 22px;
                color: #999;
            }

           /deep/ .el-input__inner{
               padding-left: 40px;
               border:none;
                height: 60px;
            }
            /deep/ input:-internal-autofill-selected{
                background-color: #f00 !important;
            }

        }
        .changePass{
            margin-top: 15px;
            text-align: right;
            line-height: 1;
        }
        .loginBut {
            border: 0;
            height: 48px;
            font-family: "微软雅黑";
            font-weight: 500;
            margin-top: 36px;
            background: $bg;
            color: #fff;
        }
    }
}
.cup{
    cursor: pointer;
}
</style>
