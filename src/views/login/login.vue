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
    <div :class="langClass" :style="{backgroundImage: 'url(' + bgLogin +')'}">
        <!-- <div style="position: relative;left:10%;top:10%;min-width:400px;width:calc(50% - 174px);font-size:50px;color:#fff;font-weight:500;max-height:200px;">{{$t('message.login.loginDesc3')}}</div>
		<div style="position: relative;left:10%;top:calc(10% + 50px);min-width:450px;width:calc(50% - 174px);font-size:20px;color:#fff;font-weight:500;max-height:200px;">{{$t('message.login.loginDesc4')}}</div> -->
		<!-- <div style="position: relative;left:16%;top:calc(30% + 100px);min-width:400px;width:calc(50% - 174px);font-size:20px;color:#fff;font-weight:500;max-height:200px;">{{$t('message.login.loginDesc5')}}</div>
		<div style="position: relative;left:16%;top:calc(30% + 120px);min-width:400px;width:calc(50% - 174px);font-size:20px;color:#fff;font-weight:500;max-height:200px;">{{$t('message.login.loginDesc6')}}</div> -->
        <div style="position: relative;left:7%;top:10%;width:54%;">
            <el-image style="position: relative;width:100%;height:100%;" fit="fill" :src="isEN==false?'../../static/image/desc_cn.png':'../../static/image/desc_en.png'" ></el-image>
        </div>
        <div class="login-bg-child">
            <!-- <div class="login-bg-sub" :style="{'backgroundImage': 'url(' + bgSubLogin +')'}">
                <div style="position: relative;left:30px;top:30px;font-size:25px;color:#fff;font-weight:500;">{{$t('message.login.loginDesc1')}}</div>
                <div style="position: relative;left:30px;top:35px;font-size:20px;color:#fff;">{{$t('message.login.loginDesc2')}}</div>
            </div> -->
            <div class="login">
                <div class="loginLogo">
                    <el-image class="icon" :src="logoPng"></el-image>
                    <!-- <svg class="icon" aria-hidden="true">
                        <use xlink:href="#wbs-icon-WeBASE"></use>
                    </svg> -->
                    <!-- <p class="logo-content">{{$t('message.login.welcome')}}</p> -->
                    <!-- <i class="wbs-icon-WeBASE"></i> -->
                    <!-- <h2 class="login-title">WeBASE</h2> -->
                </div>
                <div class="login-content">
                    <template>
                        <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login-form">
                            <el-form-item class="newItem" :label="$t('message.login.account')" prop="user">
                                <el-input size="medium" v-model="loginForm.user" :placeholder="$t('message.login.accountInput')">
                                </el-input>
                            </el-form-item>
                            <el-form-item class="newItem" :label="$t('message.login.password')" prop="password">
                                <el-input size="medium" v-model="loginForm.password" :placeholder="$t('message.login.passwordInput')" type="password">
                                </el-input>
                            </el-form-item>
                            <el-form-item class="newItem" :label="verCodeStr" prop="vercode">
                                <div style="width: 100%;text-align:left;">
									<!-- style="width: 216px;" -->
                                    <el-input size="medium" class="verCodeInput"  v-model="loginForm.vercode" :placeholder="$t('message.login.verCodeInput')">
										<span slot="append" class="codeUrlImg">
											<img style="width: 100%;height: 30px;top:2px;position: relative;" :src="codeUrl" alt="" @click="changeCode()">
										</span>
									</el-input>
                                </div>
                            </el-form-item>
                        </el-form>
						<div class="msg-wrapper">
							<div class="msg-error" v-show="msgError || timeout">
								<i class="el-icon-remove"></i>
								<span v-if="msgError">{{msgErrorContent || $t('message.login.loginFail')}}</span>
								<span v-else-if="timeout">{{$t('message.login.overtime')}}</span>
							</div>
						</div>
						<div class="login-btn">
							<!-- <i class="wbs-icon-overview" ></i>
							<i class="wbs-icon-arrow-down" ></i>
							<i class="iconfont wbs-jiedianguanli" ></i>
							<el-avatar icon="wbs-icon-overview"></el-avatar> -->
							<el-button @click="submit('loginForm')" type="primary" class="login-submit" :loading="logining">{{$t('message.login.login')}}</el-button>
						</div>
                    </template>
                </div>
				<div class="login-bottom">
					<div class="switchLanguage">
						<el-popover placement="bottom" width="80px" trigger="click" v-model="visible">
							<ul class="group-item">
								<li class="group-item-list" v-for='item in localLanaugaeList' :key='item.key' @click='changeLocalLanuage(item)'>{{item.name}}</li>
							</ul>
							<div slot="reference" class="loginlanauageClass">
								<span class="contant-head-name" style="color: #666;margin-left:0px;font-size:14px;">{{localLanaugaeName}}</span>
								<el-image style="width:15px;height:15px;top:2px;" src="../../static/image/icon_down_666.png"> </el-image>
							</div>
						</el-popover>
					</div>
					<div class="commonline" style="top:15px;padding-right:88px;margin:0px -44px;"></div>
					<div class="otherLoginType" @click="jumpEerpWXQRCode()">
						<span class="contant-head-name" style="height:30px;line-height:30px;color: #666;margin-left:0px;font-size:14px;">{{$t('message.login.otherLoginTypeDesc')}}</span>
						<el-image style="width:20px;height:20px;top:5px;display: -webkit-inline-flex;" src="../../static/image/erpwxLogo.png"> </el-image>
					</div>
				</div>
            </div>
        </div>
        <div class="contactUs">
            <span class="contactUsContent">{{$t('message.common.contactUs')+"&nbsp;"}}</span>
        </div>
        <div class="email">
            <span class="emailContent">{{$t('message.common.email')+"&nbsp;"}}</span>
        </div>
        <div class="remarkNum">
            <span class="remarkNumSpanLeft">
                {{$t('message.common.webDesc')+"&nbsp;&nbsp;&nbsp;"+$t('message.common.webDesc1')+"&nbsp;&nbsp;&nbsp;&nbsp;"}}
                <span class="remarkNumSpan" >{{$t('message.common.icpMsg1')}}</span>
                <span class="remarkNumSpanTouch" @click="goRemarkUrl()">{{"&nbsp;"+$t('message.common.icpMsg2')}}</span> 
            </span>
             
            <!-- <div class="remarkNumSpanRight">
                <span class="remarkNumSpan" @click="goRemarkUrl">{{$t('message.common.icpMsg1')}}</span>
                <span class="remarkNumSpanTouch">{{"&nbsp;"+$t('message.common.icpMsg2')}}</span>  
            </div> -->
        </div>
		<div class="copyright">
            <span class="copyrightSpan">
                {{$t('message.login.loginDesc5')+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+$t('message.login.loginDesc6')}}
            </span>
             
            <!-- <div class="remarkNumSpanRight">
                <span class="remarkNumSpan" @click="goRemarkUrl">{{$t('message.common.icpMsg1')}}</span>
                <span class="remarkNumSpanTouch">{{"&nbsp;"+$t('message.common.icpMsg2')}}</span>  
            </div> -->
        </div>
    </div>
</template>
<script>
import { login,loginYX, networkList, haveNode, getYXPictureCheckCode,getPictureCheckCode,getAccountDetail, setLanguage,erp_wxLogin } from "@/util/api";
import url from "@/util/url"
import router from "@/router";
import bg from "@/../static/image/banner.png";
// import bgsub from "@/../static/image/bg_sub.png";
import logo from "@/../static/image/login-icon.png";
import { delCookie } from '@/util/util'
import errcode from "@/util/errcode";
import permissionsData from "@/assets/data/jurisdictionData";
import { getHomeRouterPath } from "@/util/role/menuDataShowDeal";
import { mapState, mapActions } from 'vuex';
const sha256 = require("js-sha256").sha256;
export default {
    name: "login",
    data: function () {
        return {
            langClass: (localStorage.getItem('internationalization')||'zh-cn')+"-login",
			verCodeStr:this.$i18n.t('message.login.verCode')+"\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
			isEN:(localStorage.getItem("internationalization")=='en')?true:false,
            bgLogin: bg,
            logoPng: logo,
            // bgSubLogin:bgsub,
            logining: false,
            msgError: false,
            msgErrorContent: "",
            timeout: false,
            codeUrl: url.codeUrl,
            loginForm: {
                user: "",
                password: "",
                vercode: "",
            },
            rules: {
                user: [{ required: true, message: this.$i18n.t('message.login.accountInput'), trigger: "blur" }],
                password: [
                    { required: true, message: this.$i18n.t('message.login.passwordInput'), trigger: "blur" }
                ],
                vercode: [
                    { required: true, message: this.$i18n.t('message.login.verCodeInput'), trigger: "blur" }
                ]
            },
            authToken: null,
            newUserRules: {
                user: [
                    { required: true, message: this.$i18n.t('message.login.accountInput'), trigger: "blur" },
                    {
                        min: 1,
                        max: 32,
                        message: this.$i18n.t('message.login.accountAlert'),
                        trigger: "blur"
                    }
                ],
                password: [
                    { required: true, message: this.$i18n.t('message.login.passwordInput'), trigger: "blur" },
                    {
                        min: 5,
                        max: 5,
                        message: this.$i18n.t('message.login.errorPwdAlert'),
                        trigger: "blur"
                    },
                    {
                        pattern: /admin/,
                        message: this.$i18n.t('message.login.correctPwdAlert'),
                        trigger: "blur"
                    }
                ]
            },
            visible: false,
            localLanaugaeName:'中文简体',
            localLanaugaeList:[{
                key:'zh-cn',
                name:"中文简体"
            },{
                key:'en',
                name:"English"
            }]
        };
    },
    mounted: function () {
        this.changeCode()

        console.log("params..",this.$route.query);
        console.log("params.redirect..",this.$route.query.redirect);
        if(this.$route.query && !this.isNullData(this.$route.query.auth_code)){
            //获取企业微信授权成功auth_code
            let authCode = this.$route.query.auth_code;
            if (authCode.indexOf("=") != -1) {
                let array = authCode.split("="); //字符分割
                if(array.length == 2){
                    authCode = array[1];
                }
            }
            this.erpWXAuthLogin(authCode);
        }
    },
    created(){
        let language = localStorage.getItem("internationalization");
        console.log("language..",language);
        if (this.isNullData(language)) {
            this.localLanaugaeName = '中文简体';
        }else{
            this.localLanaugaeName = (language == 'zh-cn')?'中文简体':"English";
        }
    	this.keyupSubmit();
    },
    methods: {
		...mapActions([
            'setTitleArray',
            ]),
		keyupSubmit(){
			let _this = this;
			document.onkeydown=e=>{
				let _key=window.event.keyCode;
				console.log("e.target...",e.target.baseURI);
				if(_key===13 && e.target.baseURI.match(/login/)){
					_this.submit('loginForm')
				}
			}
		},
        //切换语言
        changeLocalLanuage: function (val) {
            let _this = this;

            this.visible = false;
            this.localLanaugaeName = val.name

            if (localStorage.getItem("internationalization")) {
                let key = localStorage.getItem("internationalization");
                if(val.key == key){
                    return;
                }
            }

            let params = {
                language:val.key
            }
            setLanguage(params).then(res=>{
                if (res.data.code === 0) {

                    location.reload();
                    localStorage.setItem("internationalization", val.key);

                    setTimeout(()=>{
                        _this.$message({
                        type: "success",
                        message: "设置成功"
                    });
                    },1000)

                } else {
                    let message = res.data.message?res.data.message:errcode.errCode.isCN?errcode.errCode[res.data.code].cn:errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).catch(err=>{
                let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
            })
        },
        //跳转备案链接
        goRemarkUrl(){
            window.open('http://www.beian.miit.gov.cn', '_blank');
        },
        submit: function (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.logining = true;
                    this.userLogin();
                } else {
                    return false;
                }
            });
        },
        //企业微信登录按钮
        jumpEerpWXQRCode: function () {
			console.log("window.location...",window.location);
			let redUri = window.location.origin + "/#/login";
            window.location.href="https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=ww3dbc8b96acd45ad6&redirect_uri="+encodeURIComponent(redUri)+"&state=STATE&usertype=member";
        },
        //企业微信授权登录接口操作
        erpWXAuthLogin: function (authCode) {
            if(this.isNullData(authCode)){
                alert("企业微信授权失败");
                return;
            }
            this.logining = true;
            let params = {
                authCode:authCode
            }
            erp_wxLogin(params).then(res => {
                if (res.data.code === 0) {
                    localStorage.setItem("groupName", "");
                    localStorage.setItem("groupId", "");
                    localStorage.setItem("folderList", "")
                    localStorage.setItem("user", res.data.data.account);
                    localStorage.setItem("root", res.data.data.roleName);
					localStorage.setItem("token", res.data.data.token);
					//存储菜单权限信息
					localStorage.setItem("MenuDataCode", JSON.stringify({funcMenu:res.data.data.funcMenu, dataMenu:res.data.data.dataMenu}));
					if (res.data.data.isPublicUser!=undefined && res.data.data.isPublicUser!=null && res.data.data.isPublicUser == 1) {
						localStorage.setItem("isPublicUser", "true");
					}else{
						localStorage.setItem("isPublicUser", "false");
					}
					localStorage.setItem("IsYuanChuAcc", "0");
                    // if(res.data.data.roleName == "admin"){
                    //     //不是元初的客户或供应商
                    //     localStorage.setItem("IsYuanChuAcc", "0");
                    // }else{
                    //     //是元初的客户或供应商
                    //     localStorage.setItem("IsYuanChuAcc", "1");
                    // }
                    sessionStorage.setItem("accountStatus", res.data.data.accountStatus);
                    sessionStorage.setItem("reload", 1);

					localStorage.removeItem("orderSearchParams");
					
					let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;
					if (isPublicUser) {
						router.push("/main");
					}else{
						this.getUserDetail(res.data.data);
					}
                } else {
                    this.changeCode()
                    this.msgErrorContent = errcode.errCode[res.data.code].cn || ""
                    this.msgError = true;
                    this.loginForm.password = "";
                    this.logining = false;
                }
            })
            .catch(err => {
                this.changeCode()
                this.timeout = true;
                this.loginForm.password = "";
                this.logining = false;
            });
        },

        changeCode: function () {
            this.codeUrl = "";
            this.authToken = ""
            getYXPictureCheckCode().then(res => {
                if (res.data.code === 0) {
                    this.codeUrl = `data:image/png;base64,${res.data.data.base64Image}`
                    this.authToken = res.data.data.token
                } else {
                    this.codeUrl = "";
                    this.authToken = ""
                    this.$message({
                        message: errcode.errCode[res.data.code].cn,
                        type: "error",
                        duration: 2000
                    });
                }
            }).catch(err => {
                this.codeUrl = "";
                this.authToken = ""
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            })
        },
        userLogin: function (callback) {
            delCookie('JSESSIONID')
            delCookie('NODE_MGR_ACCOUNT_C')
            let reqData = {
                account: this.loginForm.user,
				accountPwd: this.loginForm.password,//sha256(this.loginForm.password)
				language:localStorage.getItem("internationalization")
            };
            let checkCode = this.loginForm.vercode
            loginYX(reqData, checkCode, this.authToken)
                .then(res => {
                    if (res.data.code === 0) {
						this.setTitleArray([]);
                        localStorage.setItem("groupName", "");
                        localStorage.setItem("groupId", "");
                        localStorage.setItem("folderList", "")
                        localStorage.setItem("user", res.data.data.account);
                        localStorage.setItem("root", res.data.data.roleName);
						localStorage.setItem("token", res.data.data.token);
						//存储菜单权限信息
						localStorage.setItem("MenuDataCode", JSON.stringify({funcMenu:res.data.data.funcMenu, dataMenu:res.data.data.dataMenu}));

						if (res.data.data.isPublicUser!=undefined && res.data.data.isPublicUser!=null && res.data.data.isPublicUser == 1) {
							localStorage.setItem("isPublicUser", "true");
						}else{
							localStorage.setItem("isPublicUser", "false");
						}
						localStorage.setItem("IsYuanChuAcc", "0");
						// if(res.data.data.roleName == "admin"){
                        //     //不是元初的客户或供应商
                        //     localStorage.setItem("IsYuanChuAcc", "0");
                        // }else{
                        //     //是元初的客户或供应商
                        //     localStorage.setItem("IsYuanChuAcc", "1");
                        // }
                        sessionStorage.setItem("accountStatus", res.data.data.accountStatus);
                        sessionStorage.setItem("reload", 1);

                        localStorage.removeItem("orderSearchParams");
						
						let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;
						if (isPublicUser) {
							router.push("/main");
						}else{
							this.getUserDetail(res.data.data);
						}
                        
                        // router.push("/main")
                    } else {
                        this.changeCode()
                        let message = res.data.message?res.data.message:errcode.errCode.isCN?errcode.errCode[res.data.code].cn:errcode.errCode[res.data.code].en;
                        this.msgErrorContent = message;
                        this.msgError = true;
                        this.loginForm.password = "";
                        this.logining = false;
                    }
                })
                .catch(err => {
                    this.changeCode()
                    this.timeout = true;
                    this.loginForm.password = "";
                    this.logining = false;
                });
        },
        getUserDetail(loginData){
            let reqData = {
                account:loginData.account,
            };
            let reqQuery = {};
            getAccountDetail(reqData,reqQuery).then(res => {
                this.logining = false;
                if (res.data.code === 0) {
					//存储头像信息
					localStorage.setItem("headImgUrl", res.data.data.avatar_show);
					//存储是否是超级管理员
					localStorage.setItem("IsSuperAdmin", (loginData.roleName == "admin" && loginData.account == "admin")?"true":"false");
					let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;

					// let homePath = getHomeRouterPath();
					// console.log("homePath....", homePath);
					// router.push(homePath);
					router.push("/main");
					
					// if (isPublicUser) {
					// 	router.push("/publicQuery");
					// } else {
					// 	//超级管理员：显示所有菜单
					// 	if(loginData.roleName == "admin" && loginData.account == "admin"){
					// 		router.push("/main")
					// 	}
					// 	//普通管理员：显示
					// 	else if(loginData.roleName == "admin" && loginData.account != "admin"){
					// 		router.push("/accountList")
					// 	}
					// 	//普通成员：只显示业务管理模块
					// 	else{
					// 		router.push("/businessSearch")
					// 	}
					// }
                    
                    
                } else {
                    let message = res.data.message?res.data.message:errcode.errCode.isCN?errcode.errCode[res.data.code].cn:errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                this.logining = false;
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
        },
        // getGroupList: function(){
        //     //getGroups
        //     getLoginUserAllGroups().then(res => {
        //         if(res.data.code === 0){
        //             if(res.data.data && res.data.data.length){
        //                 if(this.isNullData(localStorage.getItem("groupId"))){
        //                     localStorage.setItem("groupId",res.data.data[0].groupId)
        //                 }
        //                 if(this.isNullData(localStorage.getItem("groupName"))){
        //                     localStorage.setItem("groupName",res.data.data[0].groupName);
        //                 }
        //                 this.accountStatus = sessionStorage.getItem("accountStatus");
        //                 console.log("this.$route.path....",this.$route.path);
        //                 if(this.$route.path && this.$route.path !== "/main"){
        //                     router.push(this.$route.path)
        //                 }else if(this.$route.path == "/main"){
        //                     router.push("/home")
        //                 }else{
        //                     router.push("/home")
        //                 }
        //             }else{
        //                 this.frontShow = true
        //             }
        //         }else{
        //             this.frontShow = true
        //             let message = res.data.message?res.data.message:errcode.errCode.isCN?errcode.errCode[res.data.code].cn:errcode.errCode[res.data.code].en;
        //             this.$message({
        //                 type: "error",
        //                 message: message || this.$i18n.t('message.login.searchGroupFail')
        //             });
        //         }
        //     }).catch(err => {
                
        //         this.$message({
        //                 type: "error",
        //                 message: this.$i18n.t('message.common.systemError')
        //             });
        //         this.$message.closeAll()
        //     })
        // },
    }
};
</script>
<style>
.login-label.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "" !important;
}
.zh-cn-login {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    overflow-x: hidden;
}
.en-login {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    overflow-x: hidden;
}
.login-bg-child{
    position: absolute;
    min-width: 350px;
    max-width: 23%;
    width: 23%;
    max-height:54%;
    min-height:550px;
    height: 54%;
    top: 10%;
    right: 7%;
    background-color: #fff;
    border-radius: 8px;
    box-sizing: border-box;
    z-index: 3;
}

.login {
    position: relative;
    width: 100%;
	/* min-width: 400px; */
    height: 100%;
	/* max-height: 550px;
	min-height:550px; */
    /* top: calc(50% - 275px); */
    /* left: calc(50% - 200px); */
	top: 0%;
    left: 0%;
    padding: 0 44px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    box-sizing: border-box;
}
.loginLogo{
    width: 100%;
    height: 25%;
    position: relative;
}
.icon {
    top: 33%;
    width: 132px;
    height: 50px;
    /* vertical-align: -0.15em; */
    fill: currentColor;
    overflow: hidden;
}
.logo-content {
    position: absolute;
    width: 100%;
    top: calc(20% + 57px);
    left: 0;
    text-align: center;
    font-size: 20px;
    color: #979faa;
    letter-spacing: 0.02px;
}
.msg-wrapper {
    min-height: 20px;
    height: auto;
    position: relative;
    top:0px;
    /* margin: 5px 0; */
}
.msg-error {
    color: #e4393c;
}
.codeUrlImg {
    display: inline-block;
    height: 34px;
    width: 60px;
    line-height: 34px;
    /* padding-left: 16px; */
    /* border: 1px solid #dcdfe6;
    border-radius: 2px;
    vertical-align: middle; */
    cursor: pointer;
    /* background-color: #e4393c */
}
.login-content /deep/ .el-input-group__append, .el-input-group__prepend{
	padding: 0 0px;
}

.login-content /deep/ .el-form-item__error {
	padding-top: 3px !important;
}
/* .logo {
    width: 120px;
    padding-top: 80px;
} */
/* 中文版本 */
.zh-cn-login .login-content {
    position: relative;
    top: 0px;
    /* height: 50%; */
}
/* 英文版本 */
.en-login .login-content {
    position: relative;
    top: 0px;
    /* height: 50%; */
}

.login-btn {
    position: relative;
    padding-top: 0px;
    /* height: 42%; */
}

.login-title {
    padding: 16px 0 0px 0;
    font-size: 20px;
    color: #2e2e2e;
    letter-spacing: 0.04px;
}

/* .login-label {
    position: relative;
    padding: 0 60px;
}
.login-label input {
    height: 54px;
    padding-left: 60px;
} */

/* .login-content .login-label .el-form-item__label {
    position: absolute !important;
    left: 52px !important;
    top: 12px !important;
    z-index: 999 !important;
    border-right: 1px solid #cfdae9 !important;
    height: 30px !important;
    line-height: 30px !important;
} */
/* 中文版本 */
.zh-cn-login .login-submit {
    position: relative;
    width: 100%;
    height: 40px;
    top: 0px;
    font-size: 14px;
}

/* 英文版本 */
.en-login .login-submit {
    position: relative;
    width: 100%;
    height: 40px;
    top: 0px;
    font-size: 14px;
}

.login-bottom{
	position: relative;
    height: 25%;
}

/* 中文版本 */
.zh-cn-login .switchLanguage {
    position: relative;
    top: 13px;
    height:30px;
    text-align:center;
}

/* 英文版本 */
.en-login .switchLanguage {
    position: relative;
    top: 13px;
    height:30px;
    text-align:center;
}

.otherLoginType {
    position: relative;
    top: 30px;;
    /* bottom: calc(0.5% - 40px); */
    height:30px;
    text-align:center;
}

.login-form /deep/ .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: "";
}
.login-content /deep/ .el-form-item__label {
    display: block;
    line-height: 30px !important;
    float: none;
    margin-left: -5px;
    text-align: left;
    width: 200px !important;
}
/* .newItem /deep/ .el-form-item__error{
    color: #F56C6C;
    font-size: 12px !important;
    line-height: 1;
    position: absolute;
    top: 100%;
    left: 0px;
    padding-top: 5px;
} */
/* .newItem{
    margin-bottom:22px !important;
} */
.contactUs{
    position: absolute;
    height:30px;
    min-width: 350px;
    max-width: 23%;
    width: 23%;
    text-align:center;
    top:calc(64% + 20px);
    right: 7%;
    color:#fff;
}

.contactUsContent{
    font-size:18px;
    color: #fff;
    line-height: 30px;
    /* float: right; */
    /* position: absolute; */
    /* left: calc(90% - 235px); */
}

.email{
    height:30px;
    min-width: 350px;
    max-width: 23%;
    width: 23%;
    text-align:center;
    text-align:center;
    position: absolute;
    top:calc(64% + 50px);
    right: 7%;
    color:#fff;
}

.emailContent{
    font-size:18px;
    color: #fff;
    line-height: 30px;
    /* float: right; */
    /* position: absolute; */
    /* left: calc(90% - 290px); */
}

@media screen and (max-height: 1020px) {
	.email{
		height:30px;
		min-width: 350px;
		max-width: 23%;
		width: 23%;
		text-align:center;
		text-align:center;
		position: absolute;
		top:calc(10% + 590px);
		right: 7%;
		color:#fff;
	}
	.contactUs{
		position: absolute;
		height:30px;
		min-width: 350px;
		max-width: 23%;
		width: 23%;
		text-align:center;
		top:calc(10% + 560px);
		right: 7%;
		color:#fff;
	}
}

.copyright {
	height:30px;
    width:100%;
	font-size: 16px;
    text-align:center;
    position: absolute;
    top:calc(100% - 90px);
    color:#fff;
}

.remarkNum{
    height:30px;
    width:100%;
    text-align:center;
    position: absolute;
    top:calc(100% - 65px);
    color:#fff;
}

.remarkNumSpanLeft{
    font-size:14px;
    color: #fff;
    display: block;
    line-height: 50px;
    /* position: absolute;
    float: left; */
    text-align: center;
    /* left: 150px; */
}
.remarkNumSpanRight{
    font-size:14px;
    color: #fff;
    line-height: 50px;
    float: right;
    position: absolute;
    left: calc(100% - 168px - 150px);
}
.remarkNumSpan{
    font-size:14px;
    color: #fff;
    display: inline-block;
    line-height: 50px;
}
.remarkNumSpanTouch{
    font-size:14px;
    color: #fff;
    display: inline-block;
    line-height: 50px;
    cursor: pointer;
    /* margin-right: 30px; */
}

.contant-head-name {
    position: relative;
    cursor: pointer;
}
.contant-head-name ul {
    position: absolute;
    width: 150%;
    left: -10px;
    top: 35px;
    background-color: #fff;
    color: #666;
    text-align: center;
    z-index: 9999999;
    box-shadow: 1px 4px 4px;
}
.contant-head-name ul li {
    width: 100%;
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
}
.group-item-list {
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    background-color: #fff;
}
.group-item-list:hover {
    line-height: 30px;
    text-align: center;
    background-color: #E1F7FE;
}

.loginlanauageClass{
    text-align: center;
    position: relative;
    background: initial;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.login-content /deep/ .el-form-item__content{
    text-align: left !important;
    line-height: 30px !important;
    display: block;
    /* position: relative; */
}

/* .login-content /deep/.el-input__inner {
    height: 30px !important;
} */
.en-login .logo-content{
    font-size: 22px;
    font-family: Arial Narrow;
}

.el-form-item.is-error.is-required{
    margin-bottom: 15px;
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
