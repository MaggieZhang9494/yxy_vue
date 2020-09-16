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
    <div :class="{'content-head-wrapper': $store.state.menuShow,'content-head-wrapper-hidden': !$store.state.menuShow}">
        <div class="content-head-title">
            <el-image :src="menuIcon" style="width:16px;height:16px;margin-right:10px" @click="menuShowHide"> </el-image>
            <div class="breadcrumb" v-for="(item, index) in titleArray" :key="index" @click="headTitleTouch(item,index)">
                <span v-show="index != selectTitleNum" style="position: relative;margin-right: 1px;color:#666;font-size:14px;cursor:pointer;">{{$t(item.title)}}</span>
                <span v-show="index == selectTitleNum" style="position: relative;margin-right: 1px;color:#333;font-size:14px;">{{$t(item.title)}}</span>
                <!-- <span v-show="index != selectTitleNum" style="position: relative;margin-right: 1px;color:#666;font-size:14px;cursor:pointer;">{{item.title}}</span>
                <span v-show="index == selectTitleNum" style="position: relative;margin-right: 1px;color:#333;font-size:14px;">{{item.title}}</span> -->
                <span style="position: relative;margin-right: 1px;color:#666;font-size:16px;" v-show="index != (titleArray.length-1)">/</span>
            </div>
            <!-- <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item, index) in titleArray" :key="index" v-show="index != (titleArray.length-1)" :to="item.titlePath">{{item.title}}</el-breadcrumb-item>
                <el-breadcrumb-item v-show="titleArray.length>0" >{{titleArray[titleArray.length-1].title}}</el-breadcrumb-item>
            </el-breadcrumb> -->

            <!-- <span class="content-head-icon" v-if="false" @click="skip">
                <i class="wbs-icon-back"></i>
            </span>
            <span :class="{ 'font-color-333': headSubTitle}">{{title}}</span>
            <span v-show="headSubTitle" class="font-color-333">/</span>
            <span>{{headSubTitle}}</span>
            <span v-show="headSub2Title" class="font-color-333">/</span>
            <span>{{headSub2Title}}</span>-->
            <el-tooltip effect="dark" :content="headTooltip" placement="bottom-start" v-if="headTooltip">
                <i class="el-icon-info contract-icon font-15" ></i>
            </el-tooltip>
            <!-- <a v-if="headHref" target="_blank" :href="headHref.href" class="font-color-333 font-12">{{headHref.content}}</a>  -->
        </div>
        <!-- <div class="content-head-network">
            <a target="_blank" href="https://webasedoc.readthedocs.io/zh_CN/latest/">帮助文档</a>
            <el-popover placement="bottom" width="120" min-width="50px" trigger="click">
                <ul class="group-item">
                    <li class="group-item-list" v-for='item in groupList' :key='item.groupId' @click='changeGroup(item)'>{{item.groupName}}</li>
                </ul>
                <span slot="reference" class="contant-head-name" style="color: #fff" @click='checkGroup'>群组: {{groupName || '-'}}</span>
            </el-popover> -->

            <!-- <span @click="checkNetwork" class="select-network">切换群组 -->
            <!-- <i :class="[dialogShow?'el-icon-arrow-up':'el-icon-arrow-down','select-network']"></i> -->
            <!-- </span> -->
            <!-- <span style="padding-right:10px"></span>
            <el-popover placement="bottom" width="0" min-width="50px" trigger="click">
                <div class="sign-out-wrapper">
                    <span class="change-password" @click="changePassword">修改密码</span><br>
                    <span class="sign-out" @click="signOut">退出</span>
                </div>
                <a class="browse-user" slot="reference">
                    <i class="wbs-icon-user-icon"></i>
                    <i>{{accountName}}</i>
                </a>
            </el-popover>
        </div> -->
        <!-- <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="30%" style="text-align: center;">
            <change-password-dialog @success="success"></change-password-dialog>
        </el-dialog> -->
        <!-- <v-dialog v-if="dialogShow" :show="dialogShow" @success="changeNetwork" @close='close' @changGroupSucess="changGroupSucess"></v-dialog> -->

    </div>
</template>

<script>
import dialog from "./groupdialog";
import changePasswordDialog from "./changePasswordDialog";
import router from "@/router";
import { loginOut, getGroups } from "@/util/api";
import { delCookie } from '@/util/util'
import menuShowIcon from "@/../static/image/menu_show.png";
import menuHiddenIcon from "@/../static/image/menu_hidden.png";
import logo from "@/../static/image/logo-2 copy@1.5x.png";
import Bus from "@/bus"
import { mapState, mapActions } from 'vuex'
/* 国际化 */
import i18n from '@/i18n/i18n'
export default {
    name: "conetnt-head",
    props: {
        headTitle: {
            type: String
        },
        headSubTitle: {
            type: String
        },
        headSub2Title: {
            type: String
        },
        headTitlePath: {
            type: Object
        },
        headSubTitlePath: {
            type: Object
        },
        headSub2TitlePath: {
            type: Object
        },
        icon: {
            type: Boolean
        },
        route: {
            type: String
        },
        headTooltip: {
            type: String
        },
        headHref: {
            type: Object
        }
    },
    components: {
        "v-dialog": dialog,
        changePasswordDialog
    },
    watch: {
        headTitle: function (val) {
            this.title = val;
        },
    },
    data: function () {
        return {
            title: this.headTitle,
            groupName: "-",
            accountName: "-",
            dialogShow: false,
            path: "",
            headIcon: this.icon || false,
            way: this.route || "",
            changePasswordDialogVisible: false,
            groupList: [],
            menuIcon:menuHiddenIcon,
            titleArray:[],
            selectTitleNum:0,
        };
    },
    computed: {
        ...mapState([
            'headTitleArray',
            ])
    },
    beforeDestroy: function () {
        Bus.$off("deleteFront")
    },
    created: function () {
        let _this = this;
        _this.titleArray = _this.headTitleArray.map(item=>{
            return item;
        });
        let isHave = false;
        let selectIndex = 0;
        console.log("_this.this.headTitle...",_this.headTitle);
        for (let index = 0; index < _this.headTitleArray.length; index++) {
            const element = _this.headTitleArray[index];
            if(element.title == _this.headTitle){
                isHave = true;
                selectIndex = index;
                break;
            }
        }
        if(!isHave){
            let list = _this.$router.options.routes;
            let isPath = false;
            list.forEach(element => {
                if(element.children){
                    isPath = element.children.some(item=>{
                        if((_this.headTitlePath.path == item.path) && (item.menuShow==true)){
                            return true;
                        }
                    })
                    if(isPath==true){//如果存在子菜单中的路由路径，则清空标题
                        _this.titleArray = [];
                    }
                }
            });
            console.log("isPath...",isPath);
            _this.titleArray.push({title:_this.headTitle,titlePath:_this.headTitlePath});
            this.setTitleArray(this.titleArray);
            _this.selectTitleNum = _this.titleArray.length -1;
        }else{
            let length = _this.headTitleArray.length;
            _this.titleArray.splice(selectIndex+1,length-selectIndex-1);
            _this.setTitleArray(_this.titleArray);
            _this.selectTitleNum = selectIndex;
        }

        console.log("_this.this.selectTitleNum...",_this.selectTitleNum);

        if(this.$store.state.menuShow){
            this.menuIcon = menuHiddenIcon;
        }else{
            this.menuIcon = menuShowIcon;
        }
        // window.addEventListener("popstate", function(e) {
        //     if(_this.selectTitleNum == 0){
        //         return;
        //     }
        //     let newNum = _this.selectTitleNum - 1;
        //     console.log("this.headTitleArray...",_this.headTitleArray);
        //     console.log("this.titleArray...",_this.titleArray);
        //     console.log("this.selectTitleNum...",_this.selectTitleNum);
        //     console.log("newNum...",newNum);
        //     _this.titleArray = [];
        //     _this.titleArray = _this.headTitleArray.map(item=>{
        //         return item;
        //     });
            

        //     let length = _this.titleArray.length;
        //     _this.titleArray.splice(newNum+1,length-newNum-1);

        //     console.log("_this.titleArray...",_this.titleArray);

        //     _this.setTitleArray(JSON.parse(JSON.stringify(_this.titleArray)));
            
        //     _this.selectTitleNum = newNum;
        //     //根据自己的需求实现自己的功能
        //     //window.location.href = 'https://www.baidu.com'
        // }, false);

    },
    mounted: function () {
        if (localStorage.getItem("groupName")) {
            this.groupName = localStorage.getItem("groupName");
        }
        if (localStorage.getItem("user")) {
            this.accountName = localStorage.getItem("user");
        }
        // this.getGroupList();
        // Bus.$on("deleteFront", () => {
        //     this.groupName = "";
        //     this.getGroupList('delete');
        // })
        // Bus.$on("addFront", () => {
        //     this.getGroupList();
        // })
    },
    methods: {
        ...mapActions([
            'setTitleArray',
            ]),
        headTitleTouch:function (item,index) {
            if(this.selectTitleNum == index){
                return;
            }
            this.selectTitleNum = index;

            let length = this.titleArray.length;
            this.titleArray.splice(index+1,length-index-1);

            this.setTitleArray(JSON.parse(JSON.stringify(this.titleArray)));
            

            // router.go(index-length+1);

            // // console.log("this.titleArray...",this.titleArray);
            // // console.log("this.headTitleArray...",this.headTitleArray);

            router.push(item.titlePath);
        },
        getGroupList: function (type) {
            getGroups().then(res => {
                if (res.data.code === 0) {
                    if (res.data.data && res.data.data.length) {
                        // this.dialogShow = true;
                        this.groupList = res.data.data || []
                    } else {
                        this.groupList = [];
                        localStorage.setItem("groupName", "")
                        localStorage.setItem("groupId", "")
                    }
                    if (type && res.data.data && res.data.data.length) {
                        this.groupName = res.data.data[0].groupName;
                        localStorage.setItem("groupName", res.data.data[0].groupName)
                        localStorage.setItem("groupId", res.data.data[0].groupId)
                    } else if (res.data.data && res.data.data.length && !localStorage.getItem("groupName")) {
                        this.groupName = res.data.data[0].groupName;
                        localStorage.setItem("groupName", res.data.data[0].groupName)
                        localStorage.setItem("groupId", res.data.data[0].groupId)
                    } else if (res.data.data && res.data.data.length && localStorage.getItem("groupName")) {
                        this.groupName = localStorage.getItem("groupName");
                    }
                } else {
                    this.groupList = [];
                    localStorage.setItem("groupName", "")
                    localStorage.setItem("groupId", "")
                }
            }).catch(err => {
                this.groupList = [];
                localStorage.setItem("groupName", "")
                localStorage.setItem("groupId", "")
                let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
            })
                ;
        },
        checkGroup: function () {
            if (this.dialogShow) {
                this.dialogShow = false;
            } else {
                this.dialogShow = true;
            }

            this.path = this.$route.path;
        },
        changeGroup: function (val) {
            this.groupName = val.groupName
            localStorage.setItem("groupName", val.groupName);
            localStorage.setItem("groupId", val.groupId);
            this.$emit('changGroup', val.groupId);
            this.dialogShow = true;
        },
        // changGroupSucess(val){

        // },
        // changeNetwork: function() {
        //     this.groupName = localStorage.getItem("groupName");
        //     this.dialogShow = false;
        // },
        // close: function() {
        //     this.dialogShow = false;
        // },
        skip: function () {
            if (this.route) {
                this.$router.push(this.way);
            } else {
                this.$router.go(-1);
            }
        },
        signOut: function () {
            localStorage.removeItem("user");
            loginOut()
                .then()
                .catch();
            delCookie("JSESSIONID");
            delCookie("NODE_MGR_ACCOUNT_C");
            this.$router.push("/login");
        },
        changePassword: function () {
            this.changePasswordDialogVisible = true;
        },
        success: function (val) {
            this.changePasswordDialogVisible = false;
        },
        menuShowHide(){
            this.$store.dispatch('setMenuShow');
            if(this.$store.state.menuShow){
                this.menuIcon = menuHiddenIcon;
            }else{
                this.menuIcon = menuShowIcon;
            }
        },
    }
};
</script>
<style scoped>
/* 中文版本*/
.zh-cn .content-head-wrapper {
    width: calc(100%);
    background-color: #fff;
    text-align: left;
    /* line-height: 54px; */
    height: 50px;
    /* position: relative; */
    display: inline-flex;
    position:fixed;
    top:90px;
    z-index:10;
    width:81.5%;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    box-shadow:0px 1px 3px 0px #ccc;
}
.zh-cn .content-head-wrapper-hidden {
    width: calc(100%);
    background-color: #fff;
    text-align: left;
    /* line-height: 54px; */
    height: 50px;
    /* position: relative; */
    display: inline-flex;
    position:fixed;
    top:90px;
    z-index:10;
    width:89%;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    box-shadow:0px 1px 3px 0px #ccc;
}
/* 英文版本*/
.en .content-head-wrapper {
    width: calc(100%);
    background-color: #fff;
    text-align: left;
    /* line-height: 54px; */
    height: 50px;
    /* position: relative; */
    display: inline-flex;
    position:fixed;
    top:90px;
    z-index:10;
    width:78.5%;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    box-shadow:0px 1px 3px 0px #ccc;
}
.en .content-head-wrapper-hidden {
    width: calc(100%);
    background-color: #fff;
    text-align: left;
    /* line-height: 54px; */
    height: 50px;
    /* position: relative; */
    display: inline-flex;
    position:fixed;
    top:90px;
    z-index:10;
    width:89%;
    transition: width 0.5s;
    -moz-transition: width 0.5s;
    -webkit-transition: width 0.5s;
    -o-transition: width 0.5s;
    box-shadow:0px 1px 3px 0px #ccc;
}
.content-head-wrapper::after {
    display: block;
    content: "";
    clear: both;
}
.content-head-icon {
    color: #fff;
    font-weight: bold;
    cursor: pointer;
}
.breadcrumb{
    display: inline-flex;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    float: left;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.content-head-title {
    margin-left: 20px;
    display: inline-flex;
    font-size: 16px;
    color: #333;
    font-weight: bold;
    float: left;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.content-head-network {
    float: right;
    padding-right: 10px;
    position: relative;
}
.browse-user {
    text-align: center;
    text-decoration: none;
    font-size: 12px;
    cursor: pointer;
    color: #cfd7db;
}
.sign-out-wrapper {
    line-height: 32px;
    text-align: center;
}
.sign-out {
    cursor: pointer;
    color: #ed5454;
}
.sign-out:hover {
    color: #1585FF;
}
.change-password {
    color: #0db1c1;
    cursor: pointer;
}
.change-password:hover {
    color: #1585FF;
}
.network-name {
    font-size: 12px;
    color: #9da2ab;
    padding: 3px 0px;
    /* border-right: 2px solid #e7ebf0; */
    margin-right: 16px;
}
.select-network {
    color: #2d5f9e;
    cursor: default;
}
.content-head-network a:nth-child(1) {
    text-decoration: none;
    outline: none;
    color: #cfd7db;
    padding-right: 15px;
    border-right: 1px solid #657d95;
    margin-right: 15px;
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
    height: 32px;
    line-height: 32px;
    cursor: pointer;
}
.group-item {
    line-height: 32px;
    text-align: center;
}
.group-item-list {
    cursor: pointer;
}
.group-item-list:hover {
    color: #1585FF;
}
</style>
