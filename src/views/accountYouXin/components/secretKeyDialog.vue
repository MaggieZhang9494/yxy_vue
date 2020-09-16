<template>
    <div>
        <div class="commonline"></div>
        <div class="formContent" :loading="loading">
            <el-form :label-position="labelPosition" :label-width="labelWidth">
                <el-form-item :label="$t('message.accountManagement.accessKey')+' :'">
                    <span>{{secretkeyDetail.key}}</span>
                </el-form-item>
                <el-form-item :label="$t('message.accountManagement.accessSecret')+' :'">
                    <span>{{showType === 'password'?secretKeyStr:secretkeyDetail.secret}}</span>
                    <i style="color: #1585FF;position: relative;top:1px;" :class="[showType === 'text' ? 'iconfont wbs-xianshi': 'iconfont wbs-yincang']"  @click.stop.prevent="showSecret"></i>
                    <el-button type="text" size="small" style="color:#1585FF" @click="resetSecret()">{{$t('message.common.reset')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div class="commonline"></div>
        <div class="dialog-footer">
            <el-button @click="modelClose">{{$t('message.common.cancel')}}</el-button>
            <el-button type="primary" @click="submit('accountForm')" :loading="loading">{{$t('message.common.confirm')}}</el-button>
        </div> -->
    </div>
</template>

<script>
import {
    resetAccessSecret,
    getAPIAccessKey
} from "@/util/api";
import { strToSecret } from '../../../util/util'

export default {
    name: "secretKeyDialog",
    props: {
        secretKeyDialogOptions: {
            type: Object
        }
    },
    watch: {
        
    },
    data() {
        return {
            loading: false,
            labelPosition:"right",
            labelWidth:"110px",
            showType: "password",
            secretKeyStr:"",
            //API密钥信息
            secretkeyDetail:{
                key:"",
                secret:"",
            },
        };
    },
    created(){
        if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
            this.labelWidth = "110px";
        }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
            this.labelWidth = "110px";
        }else{
            this.labelWidth = "110px";
        }

        //获取AI密钥信息
        this.getAccessKeyMsg();
    },
    mounted() {

    },
    methods: {
        //显示密钥
        showSecret() {
            if(this.showType === 'password'){
                this.showType = 'text'
            }else {
                this.showType = 'password'
            }
        },
        //获取AI密钥信息
        getAccessKeyMsg(){
            let _this = this;
            _this.loading = true;
            getAPIAccessKey(this.secretKeyDialogOptions.data.account).then(res => {
                this.loading = false;
                if (res.data.code === 0) {
                    _this.secretkeyDetail.key = res.data.data.access_key;
                    _this.secretkeyDetail.secret = res.data.data.access_secret;

                    _this.secretKeyStr = strToSecret(_this.secretkeyDetail.secret);
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                this.loading = false;
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
        },
        //重置密钥
        resetSecret(){
            let _this = this;
            this.$confirm(this.$i18n.t('message.accountManagement.resetSecretAlert'),this.$i18n.t('message.common.reset'), {
                confirmButtonText: this.$i18n.t('message.common.affirm'),
                cancelButtonText: this.$i18n.t('message.common.cancel'),
            })
            .then(() => {
                this.loading = true;
                resetAccessSecret(this.secretKeyDialogOptions.data.account).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        _this.secretkeyDetail.secret = res.data.data.access_secret;
                        _this.secretKeyStr = strToSecret(_this.secretkeyDetail.secret);
                        this.$message({
                            type: "success",
                            message: this.$i18n.t('message.accountManagement.resetAccessKeySuc')
                        });
                    } else {
                        let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;
                    let message = this.$i18n.t('message.common.systemError');
                    if(err && err.data && err.data.code){
                        message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                    }
                    this.$message({
                        type: "error",
                        message: message
                    });
                });
            })
            .catch(() => {
                
            });
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

</style>