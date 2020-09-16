/*
 * Copyright 2014-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div>
        <div class="commonline"></div>
        <div style="padding:20px 20px 20px 20px;text-align: center;">
            <el-form :model="rulePasswordForm" status-icon :rules="rules2" ref="rulePasswordForm" :label-width="labelWidth" class="demo-ruleForm">
                <el-form-item :label="$t('message.login.oldPassword')" prop="oldPass" style="width: 330px;" required>
                    <el-input size="mini" type="password" v-model="rulePasswordForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.login.newPassword')" prop="pass" style="width: 330px;" required>
                    <el-input size="mini" type="password" v-model="rulePasswordForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.accountManagement.affirmPassword')" prop="checkPass" style="width: 330px;" required>
                    <el-input size="mini" type="password" v-model="rulePasswordForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="commonline"></div>
        <div style="text-align:center;padding:10px 20px 0px 0px">
            <el-button type="primary" @click="submitForm('rulePasswordForm')">{{$t('message.common.submit')}}</el-button>
            <el-button @click="resetForm('rulePasswordForm')">{{$t('message.common.reset')}}</el-button>
        </div>
        
    </div>
</template>

<script>
const sha256 = require("js-sha256").sha256;
import { resetPassword } from "@/util/api";
export default {
    name: "changePasswordDialog",
    props: {},
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$i18n.t('message.login.passwordInput')));
            } else {
                if (this.rulePasswordForm.checkPass !== "") {
                    this.$refs.rulePasswordForm.validateField("checkPass");
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error(this.$i18n.t('message.login.passwordInputAgain')));
            } else if (value !== this.rulePasswordForm.pass) {
                callback(new Error(this.$i18n.t('message.login.pwdInconformity')));
            } else {
                callback();
            }
        };
        return {
            rulePasswordForm: {
                oldPass: "",
                pass: "",
                checkPass: ""
            },
            rules2: {
                oldPass: [
                    {
                        required: true,
                        message: this.$i18n.t('message.login.oldPasswordInput'),
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$i18n.t('message.login.char6_12Alert'),
                        trigger: "blur"
                    }
                ],
                pass: [
                    {
                        required: true,
                        validator: validatePass,
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$i18n.t('message.login.char6_12Alert'),
                        trigger: "blur"
                    },
                    {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,12}$/,
                        message: this.$i18n.t('message.login.passwordAlert'),
                        trigger: "blur"
                    }
                ],
                checkPass: [
                    {
                        required: true,
                        validator: validatePass2,
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        max: 12,
                        message: this.$i18n.t('message.login.char6_12Alert'),
                        trigger: "blur"
                    }
                ]
            },
            account: localStorage.getItem("user"),
            labelWidth:"100px",
        };
    },
    created(){
        if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            this.labelWidth = "100px";
        }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            this.labelWidth = "150px";
        }else{
            this.labelWidth = "100px";
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.getResetPassword();
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getResetPassword() {
            let reqData = {
                oldAccountPwd: sha256(this.rulePasswordForm.oldPass),
                newAccountPwd: sha256(this.rulePasswordForm.pass)
            };
            resetPassword(reqData, {})
                .then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.$message({
                            type: "success",
                            message: this.$i18n.t('message.common.modifySucc')
                        });
                        this.rulePasswordForm =  {
                            oldPass: "",
                            pass: "",
                            checkPass: ""
                        }
                        this.$emit('success',true)
                        this.accountStatus = "2";
                        sessionStorage.setItem("accountStatus", "2");
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                    }
                })
                .catch(err => {
                    this.$message({
                        type: "error",
                        message: this.$i18n.t('message.login.pwdChangeFail')
                    });
                });
        }
    }
};
</script>

<style>
 .www{
     text-align: center
 }
 .el-form-item.is-error.is-required{
    margin-bottom: 25px;
    margin-top: 0px;
}
.el-form-item.is-required{
    margin-bottom: 0px;
    margin-top: 0px;
}
.el-form-item{
    margin-bottom: 0px;
    margin-top: 0px;
}
</style>
