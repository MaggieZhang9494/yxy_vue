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
    <div :class="langClass" style="overflow: hidden;width: 100%;height: 100%;background-color: #edf0f5;">
        <div id="shade" v-if="accountStatus === '1'"></div>
        <div id="reset-password" v-if="accountStatus === '1'">
            <div class="reset-password-title">
                {{$t('message.accountManagement.modifyPassword')}}
            </div>
            <div class="commonline"></div>
            <el-form :model="rulePasswordForm" status-icon :rules="rules2" ref="rulePasswordForm" :label-width="labelWidth" class="demo-ruleForm">
                <el-form-item style="margin-bottom:15px;" :label="$t('message.login.oldPassword')" prop="oldPass">
                    <el-input size="mini" type="password" v-model="rulePasswordForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:15px;" :label="$t('message.login.newPassword')" prop="pass">
                    <el-input size="mini" type="password" v-model="rulePasswordForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:15px;"  :label="$t('message.accountManagement.affirmPassword')" prop="checkPass">
                    <el-input size="mini" type="password" v-model="rulePasswordForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="commonline" style="text-align:right;margin-top:20px;"></div>
            <div>
                <div style="text-align:right;padding-top:15px;margin-right:20px;">
                    <el-button type="primary" @click="submitForm('rulePasswordForm')" :loading="loading">{{$t('message.common.submit')}}</el-button>
                    <el-button @click="resetForm('rulePasswordForm')">{{$t('message.common.reset')}}</el-button>
                </div>
            </div>
        </div>
        <el-container ref="homePage" style="overflow: hidden;height: 100%;">
            <el-header style="height: 70px;">
                <v-main-head style="position: fixed;z-index: 10;width:100%;height: 70px;background-color: #011e37"></v-main-head>
            </el-header>
            <el-container style="overflow: hidden;height: 100%;">
                <!-- 不可收缩菜单，非全屏 -->
                <!-- <el-aside width="200px" class="asideMenu">
                    <v-menu  :minMenu="show"></v-menu>
                </el-aside>
                <el-main class="mainContent">
                    <router-view class="bg-f7f7f7"></router-view>
                </el-main> -->

                <!-- 可收缩菜单 非全屏-->
                <el-aside :class="{'menu-show-nofull': $store.state.menuShow,'menu-hide-nofull': !$store.state.menuShow}">
                    <v-menu :minMenu="show" @sidebarChange="change($event)"></v-menu>
                </el-aside>
                <el-main :class="{'view-show-nofull': $store.state.menuShow,'view-hide-nofull': !$store.state.menuShow}">
                    <router-view class="bg-f7f7f7"></router-view>
					<set-front :show='frontShow' v-if='frontShow' @close='closeFront'></set-front>
                </el-main>

                <!-- 可收缩菜单 全屏-->
                <!-- <el-aside :class="{'menu-show': $store.state.menuShow,'menu-hide': !$store.state.menuShow}">
                    <v-menu :minMenu="show" @sidebarChange="change($event)"></v-menu>
                </el-aside>
                <el-main :class="{'view-show': $store.state.menuShow,'view-hide': !$store.state.menuShow}">
                    <router-view class="bg-f7f7f7"></router-view>
                </el-main> -->

				
            </el-container>
        </el-container>
        
        <!-- <div class="remarkNum">
            <span class="remarkNumSpan" @click="goRemarkUrl">{{$t('message.common.icpMsg')}}</span>  
        </div> -->
    </div>
</template>

<script>
import mainHead from "@/components/mainHead";
import contentHead from "@/components/contentHead";
import sidebar from "./sidebar";
import setFront from "./dialog/setFront"
import { resetPassword, addnodes, getGroups,getGroupsPullList,getLoginUserAllGroups } from "@/util/api";
import { getHomeRouterPath } from "@/util/role/menuDataShowDeal";
import router from "@/router";
import Bus from "@/bus"
const sha256 = require("js-sha256").sha256;
export default {
    name: "mains",
    components: {
        "v-main-head": mainHead,
        "v-content-head": contentHead,
        "v-menu": sidebar,
        "set-front": setFront
    },
    data: function() {
        // if (sessionStorage.getItem("reload") == 1) {
        //     sessionStorage.setItem("reload", 2);
        //     router.go(0);
        // }
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
            langClass: localStorage.getItem('internationalization')||'zh-cn',
            frontShow: false,
            menuShow: true,
            menuHide: false,
            loading: false,
            accountStatus: 0,
            account: localStorage.getItem("user"),
            rulePasswordForm: {
                oldPass: "",
                pass: "",
                checkPass: ""
            },
            clientHeight:'',
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
            labelWidth:"100px",
        };
    },
    computed: {
        show: function() {
            return this.$store.state.menuShow;
        }
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
    mounted(){
        // 获取浏览器可视区域高度
        this.clientHeight =  document.documentElement.clientHeight;              
        //document.body.clientWidth;
        console.log("clientHeight....",this.clientHeight);
        window.onresize = function temp() {
            this.clientHeight = document.documentElement.clientHeight;
        };

        this.getGroupList();
    },
    watch:{
        // 如果 `clientHeight` 发生改变，这个函数就会运行
        clientHeight: function () {
            this.changeFixed(this.clientHeight)
        }
    },
    methods: {
        //跳转备案链接
        goRemarkUrl(){
            window.open('http://www.beian.miit.gov.cn', '_blank');
        },
        changeFixed(clientHeight){ //动态修改样式
            console.log(clientHeight);
            console.log(this.$refs.homePage.$el.style.height);
            this.$refs.homePage.$el.style.height = (clientHeight-20)+'px';

            console.log(this.$refs.homePage.$el.style.height);
        },
        change: function(val) {
            this.menuShow = !val;
            this.menuHide = val;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.loading = true;
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
                        this.accountStatus = "2";
                        sessionStorage.setItem(
                            "accountStatus",
                            this.accountStatus
                        );
                    } else {
                        console.log("res.data.message...",res.data.message);
                        let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                })
                .catch(err => {
                    this.loading = false;

                    console.log("err...",err);

                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                    // this.$message({
                    //     type: "error",
                    //     message: "密码修改失败"
                    // });
                    // this.$message.closeAll()
                });
        },
        getGroupList: function(){
			if (localStorage.getItem("isPublicUser")==='true') {
				console.log("main getGroupList....");
				getGroupsPullList({all:0}).then(res => {
					if (res.data.code === 0) {
						if (res.data.data && res.data.data.length>0) {
							let isChangeGroup = false;
							if(!localStorage.getItem("groupId")){
								localStorage.setItem("groupId",res.data.data[0].value)
								isChangeGroup = true;
							}
							if(!localStorage.getItem("groupName")){
								localStorage.setItem("groupName",res.data.data[0].node);
							}
							this.accountStatus = sessionStorage.getItem("accountStatus");
							console.log("this.$route.path....",this.$route.path);
							console.log("localStorage.getItem('groupId')....",localStorage.getItem("groupId"));
							if(this.$route.path && this.$route.path !== "/main"){
								router.push(this.$route.path)
							}else if(this.$route.path == "/main"){
								router.push('/publicQuery')
							}else{
								router.push('/publicQuery')
							}
							if (isChangeGroup) {
								Bus.$emit('changeGroup', localStorage.getItem("groupId"));
							}
						}
					} else {
						let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
						this.$message({
							type: "error",
							message: message || this.$i18n.t('message.login.searchGroupFail')
						});
					}
				}).catch(err => {
					let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
				});
				return;
			}
            //getGroups
            getLoginUserAllGroups().then(res => {
                if(res.data.code === 0){
                    if(res.data.data && res.data.data.length){
						let isChangeGroup = false;
                        if(!localStorage.getItem("groupId")){
							localStorage.setItem("groupId",res.data.data[0].groupId)
							isChangeGroup = true;
                        }
                        if(!localStorage.getItem("groupName")){
                            localStorage.setItem("groupName",res.data.data[0].groupName);
                        }
                        this.accountStatus = sessionStorage.getItem("accountStatus");
						console.log("this.$route.path....",this.$route.path);
						let homePath = getHomeRouterPath();
                        if(this.$route.path && this.$route.path !== "/main"){
                            router.push(this.$route.path)
                        }else if(this.$route.path == "/main"){
                            router.push(homePath)
                        }else{
                            router.push(homePath)
						}
						if (isChangeGroup) {
							Bus.$emit('changeGroup', localStorage.getItem("groupId"));
						}
                    }else{
                        this.frontShow = true
                    }
                }else{
                    this.frontShow = true
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message || this.$i18n.t('message.login.searchGroupFail')
                    });
                }
            }).catch(err => {
                let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
            })
        },
        closeFront: function(){
            this.frontShow = false;
            this.getGroupList()
        }
    }
};
</script>
<style scoped>
.bgClass{
    width: 100%;
    height: 100%;
    background-color: #edf0f5;
}
.header .el-menu {
    height: 100%;
}
.el-container.is-vertical{
    height: calc(100%) !important;
}
.main-wrapper {
    width: 100%;
    height: 100%;
}
.main-wrapper::after {
    display: block;
    content: "";
    clear: both;
}
.asideMenu{
    top: 20px;
    left: 8%;
    position: relative;
}
.mainContent{
    left: 8.2%;
    top:20px;
    width: 76.5%;
    position: relative;
}
.view-wrapper {
    height: 100%;
    /* padding-left: 200px; */
}
.menu-show {
    margin-top: 20px;
    width: 200px !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    overflow-x: hidden;
}
.menu-hide {
    margin-top: 20px;
    /* width: 56px; */
    width: 56px !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
    overflow-x: hidden;
}
.view-show {
    margin-top: 20px;
    /* padding-left: 200px; */
    width: 100% !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    overflow-x: hidden;
    background-color: #f7f7f7;
}
.view-hide {
    margin-top: 20px;
    /* padding-left: 56px !important; */
    width: 100% !important;
    /* width: calc(100% - 56px); */
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
    overflow-x: hidden;
    background-color: #f7f7f7;
}
#shade {
    position: absolute;
    top: 70px;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.3;
    /*兼容IE8及以下版本浏览器*/
    filter: alpha(opacity=30);
}

#reset-password {
    position: absolute;
    z-index: 12;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 470px;
    height: 270px;
    margin: auto;
    background-color: #fff;
    padding-top: 15px;
    border-radius:5px;
    /* height:auto; */
    /* padding-right: 25px; */
}
.reset-password-title {
    margin-bottom: 15px;
    margin-left: 15px;
    text-align: left;
    font-size: 16px;
    font-weight: 600;
}
#add-nodes {
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 470px;
    height: 140px;
    margin: auto;
    background-color: #fff;
    padding-top: 15px;
}
.add-nodes-title {
    margin-bottom: 5px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
}
.demo-ruleForm {
    padding-top: 15px;
    padding-right: 25px;
}

/* 针对左侧菜单可收缩 非全屏模式 中文版本*/
.zh-cn .menu-show-nofull {
    margin-top: 20px;
    left: 4%;
    width: 200px !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    overflow-x: hidden;
    background-color: #fff;
}
.zh-cn .menu-hide-nofull {
    margin-top: 20px;
    left: 4%;
    position: relative;
    /* width: 56px; */
    width: 56px !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
    overflow-x: hidden;
    background-color: #fff;
}
.zh-cn .view-show-nofull {
    /* padding-left: 200px; */
    left: 4.2%;
    margin-top: 20px;
    width: 81.5% !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    overflow-y:scroll;    
    overflow-x: hidden;
    background-color: #f7f7f7;
    /* background-color: #fff; */
}
.zh-cn .view-hide-nofull {
    left: 4.2%;
    margin-top: 20px;
    position: relative;
    /* padding-left: 56px !important; */
    width: 89% !important;
    /* width: calc(100% - 56px); */
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
    overflow-y:scroll;    
    overflow-x: hidden;
    background-color: #f7f7f7;
    /* background-color: #fff; */
}

/* 针对左侧菜单可收缩 非全屏模式 英文版本*/
.en .menu-show-nofull {
    margin-top: 20px;
    left: 4%;
    width: 260px !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    overflow-x: hidden;
    background-color: #fff;
}
.en .menu-hide-nofull {
    margin-top: 20px;
    left: 4%;
    position: relative;
    /* width: 56px; */
    width: 56px !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
    overflow-x: hidden;
    background-color: #fff;
}
.en .view-show-nofull {
    /* padding-left: 200px; */
    left: 4.2%;
    margin-top: 20px;
    width: 78.5% !important;
    position: relative;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    overflow-y:scroll;    
    overflow-x: hidden;
    background-color: #f7f7f7;
    /* background-color: #fff; */
}
.en .view-hide-nofull {
    left: 4.2%;
    margin-top: 20px;
    position: relative;
    /* padding-left: 56px !important; */
    width: 89% !important;
    /* width: calc(100% - 56px); */
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 2s;
    overflow-y:scroll;    
    overflow-x: hidden;
    background-color: #f7f7f7;
    /* background-color: #fff; */
}
.el-header{
    height:70px !important;
}
/* .remarkNum{
    height:30px;
    width:100%;
    text-align:center;
}
.remarkNumSpan{
    font-size:12px;
    color: #1585FF;
    display: inline-block;
    line-height: 30px;
    cursor: pointer;
} */
</style>
