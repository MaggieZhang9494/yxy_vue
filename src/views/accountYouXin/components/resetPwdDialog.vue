<template>
    <div>
        <div class="commonline"></div>
        <div class="formContent">
            <el-form :model="accountForm" :rules="rules" ref="accountForm" :label-width="labelWidth" class="demo-ruleForm">
                <el-form-item :label="$t('message.accountManagement.password')" prop="password" style="width: 250px;" v-if="accountForm['dShow']">
                    <el-input size="mini" v-model="accountForm.password" :placeholder="$t('message.accountManagement.passwordInput')" minlength="6" maxlength="12" :type="inputType">
                        <i slot="suffix" style="color: #ccc;" :class="[inputType === 'password' ? 'iconfont wbs-xianshi': 'iconfont wbs-yincang']"  @click.stop.prevent="showPassword"></i>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('message.accountManagement.affirmPassword')" prop="password_confirmation" style="width: 250px;" v-if="accountForm['dShow']">
                    <el-input size="mini" v-model="accountForm.password_confirmation" :placeholder="$t('message.accountManagement.affirmPasswordInput')" minlength="6" maxlength="12" :type="inputType">
                        <i slot="suffix" style="color: #ccc;" :class="[inputType === 'password' ? 'iconfont wbs-xianshi': 'iconfont wbs-yincang']"  @click.stop.prevent="showPassword"></i>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="commonline"></div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit('accountForm')" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
import {
    resetAccountPwd
} from "@/util/api";
// import { isNullData, isJSONStr} from './util/util'

const sha256 = require("js-sha256").sha256;
export default {
    name: "resetPwdDialog",
    props: {
        accountDialogOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading: false,
            accountForm: {
                account: "",
                password:"",
                password_confirmation: "",
                disabled: false,
                mDisabled: false,
                dShow: true,
                mShow: true
            },
            roleList: [],
            inputType: "password",
            rules: {
                password: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.passwordInput'),
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
                password_confirmation: [
                    {
                        required: true,
                        message: this.$i18n.t('message.accountManagement.affirmPasswordInput'),
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
                ]
            },
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
    mounted() {
        this.accountForm.account = this.accountDialogOptions.data.account;
    },
    methods: {
        isVerifyPass(params){
            if(!params){
                this.$message.error(this.$i18n.t('message.common.noParamsAlert'))
                return false;
            };

            if(this.isNullData(params.account)){
                this.$message.error(this.$i18n.t('message.accountManagement.noneAccount'))
                return false;
            }

            if(this.isNullData(params.password)){
                this.$message.error(this.$i18n.t('message.accountManagement.nullPwd'))
                return false;
            }

            if(this.isNullData(params.password_confirmation)){
                this.$message.error(this.$i18n.t('message.accountManagement.nullAffirmPwd'))
                return false;
            }

            if(params.password != params.password_confirmation){
                this.$message.error(this.$i18n.t('message.login.pwdInconformity'))
                return false;
            }

            return true;
        },
        modelClose: function() {
            this.$emit("close", false);
        },
        submit: function(formName) {
			let _this = this;
            if(!this.isVerifyPass(this.accountForm)){
                return;
            }

            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm(this.$i18n.t('message.common.affirmSubmit'),this.$i18n.t('message.common.submit'), {
                        confirmButtonText: this.$i18n.t('message.common.affirm'),
                        cancelButtonText: this.$i18n.t('message.common.cancel'),
                    })
                    .then(() => {
                        this.loading = true;
                        let reqData = {
                            password:this.accountForm.password,
                            password_confirmation: this.accountForm.password_confirmation,
                        };
                        let reqQuery = {};
                        let urlData = {
                            account: this.accountForm.account,
                        };
                        resetAccountPwd(reqData,reqQuery,urlData).then(res => {
							console.log("res...",res);
                            this.loading = false;
                            if (res.data.code === 0) {
                                _this.$message({
                                    type: "success",
                                    message: this.$i18n.t('message.accountManagement.resetPwdSuc')
                                });
                                this.modelClose();
                            } else {
                                let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                                _this.$message({
                                    type: "error",
                                    message: message
                                });
                            }
                        })
                        .catch(err => {
							console.log("err...",_this);
                            this.loading = false;
                            let message = this.$i18n.t('message.common.systemError');
                            if(err && err.data && err.data.code){
                                message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                            }
                            _this.$message({
                                type: "error",
                                message: message
                            });
                        });
                    })
                    .catch(() => {
                        
                    });
                } else {
                    return false;
                }
            });
        },
        showPassword() {
            if(this.inputType === 'password'){
                this.inputType = 'text'
            }else {
                this.inputType = 'password'
            }
        }
    }
};
</script>

<style scoped>
.formContent{
    padding: 20px;
}
.dialog-footer {
    text-align: center;
    margin-right: 20px;
    padding-bottom: 0px;
    padding-top: 10px;
}
.isNone {
    display: none;
}
.isShow {
    display: block;
}
.demo-ruleForm >>> .el-form-item__error {
    padding-top: 0
}
.el-input{
    width: 240px;
    height: 25px;
    line-height: 25px;
}
.el-input /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
}
.el-input /deep/ .el-input__icon {
    line-height: 30px;
}
.el-input /deep/ .el-input__suffix{
    top:2px;
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