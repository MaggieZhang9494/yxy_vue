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
        <el-image class="mainicon" src="../../static/image/logo-2 copy@1.5x.png"></el-image>
        <div class="content-head-network">
            <el-popover placement="bottom" width="80px" trigger="click" v-model="visible">
                <ul class="group-item">
                    <li class="group-item-list" v-for='item in localLanaugaeList' :key='item.key' @click='changeLocalLanuage(item)'>{{item.name}}</li>
                </ul>
                <div slot="reference" class="lanauageClass">
                    <el-avatar :size="23" src="../../static/image/yuyan.png" style="background-color: inherit;"></el-avatar>
                    <span class="contant-head-name" style="color: #fff;margin-left:10px;font-size:16px;" >{{localLanaugaeName}}</span>
                </div>
            </el-popover>
            <!-- //空格 -->
            <span style="position:relative; margin:0px 10px; padding-right:2px;backgroundColor: #fff"></span>

            <!-- <a target="_blank" href="https://webasedoc.readthedocs.io/zh_CN/latest/">帮助文档</a> -->
            <!-- 群组显示 -->
            <el-popover placement="bottom" width="80" trigger="click" v-model="groupVisible">
                <ul v-if="isPublicUser==false" class="group-item">
                    <li class="group-item-list" v-for='item in groupList' :key='item.groupId' @click='changeGroup(item)'>{{item.groupName}}</li>
				</ul>
				<ul v-else class="group-item">
                    <li class="group-item-list" v-for='item in groupList' :key='item.value' @click='changeGroup({groupId:item.value,groupName:item.node})'>{{item.node}}</li>
				</ul>
                <div slot="reference" class="lanauageClass"  @click='checkGroup'>
                    <el-avatar :size="20" src="../../static/image/accountbook.png" shape="square" style="background-color: inherit;"></el-avatar>
                    <span class="contant-head-name"  style="color: #fff;margin-left:5px;font-size:16px;">{{groupName || ' - '}}</span>
                </div>
            </el-popover>
            <!-- //空格 -->
            <!-- <span style="position:relative; margin:0px 10px; padding-right:2px;backgroundColor: #fff"></span> -->
            <!-- 群组切换 -->
            <!-- <span @click="checkNetwork" class="select-network">切换群组 -->
            <!-- <i :class="[dialogShow?'el-icon-arrow-up':'el-icon-arrow-down','select-network']" style="color: #fff;font-size:19px;margin-left:5px;top:2px;"></i> -->
            <!-- </span> -->
            <!-- <span style="padding-right:10px;color: #fff"></span> -->
            <!-- //空格 -->
            <span style="position:relative; margin:0px 10px; padding-right:2px;backgroundColor: #fff"></span>

            <el-popover placement="bottom" width="80px" trigger="click" v-model="userVisible">
            <div class="sign-out-wrapper">
                    <div v-if="isPublicUser==false" class="divShow"><span class="account-msg" @click="accountMsg">{{$t('message.accountManagement.accountMsg')}}</span></div>
                    <div v-show="accountStatus==='2'" class="divShow"><span class="change-password" @click="changePassword">{{$t('message.accountManagement.modifyPassword')}}</span></div>
                    <div class="divShow"><span class="sign-out" @click="signOut">{{$t('message.login.logout')}}</span></div>
                </div>
                <div slot="reference" class="userClass">
                    <!-- style="border:3px solid gray" -->
                    <el-avatar :src="$store.state.headShowUrl" @error="errorHandler" style="border:3px solid gray" >
                        <img :src="defaultHeadImg"/>
                    </el-avatar>
                    <span class="contant-head-name" style="color: #fff;margin-left:10px;margin-right:10px;font-size:16px;top:-1px;" >{{accountName}}</span>
                    <el-image style="width:15px;height:8px;top:0px;" src="../../static/image/icon_down.png"> </el-image>
                </div>
                <!-- <a class="browse-user" slot="reference">
                    <i class="wbs-icon-user-icon"></i>
                    <i>{{accountName}}</i>
                </a> -->
            </el-popover>
        </div>
        <el-dialog :visible.sync="changePasswordDialogVisible" :title="$t('message.accountManagement.modifyPassword')" width="430px" :append-to-body="true" :center="true" v-if="changePasswordDialogVisible">
            <change-password-dialog @success="success"></change-password-dialog>
        </el-dialog>

        <!-- <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="30%" style="text-align: center;" :visible="changePasswordDialogVisible">
            <change-password-dialog @success="success"></change-password-dialog>
        </el-dialog> -->
        <!-- <v-dialog v-if="dialogShow" :show="dialogShow" @success="changeNetwork" @close='close' @changGroupSucess="changGroupSucess"></v-dialog> -->

    </div>
</template>

<script>
import dialog from "./groupdialog";
import changePasswordDialog from "./changePasswordDialog";
import router from "@/router";
import logo from "@/../static/image/logo-2 copy@1.5x.png";
import defaultHeadImg from "@/../static/image/defaultHead.png";
import { loginOut,loginOutYX, getGroupsPullList, setLanguage,getLoginUserAllGroups } from "@/util/api";
import { delCookie } from '@/util/util'
import Bus from "@/bus"
import { mapState, mapActions } from 'vuex'
export default {
    name: "main-head",
    props: {
        headTitle: {
            type: String
        },
        icon: {
            type: Boolean
        },
        route: {
            type: String
        },
        headSubTitle: {
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
        }
    },
    data: function () {
        return {
            defaultHeadImg:defaultHeadImg,
            headUrl:"",
            title: this.headTitle,
            groupName: "-",
            accountName: "-",
            dialogShow: false,
            path: "",
            headIcon: this.icon || false,
            way: this.route || "",
            changePasswordDialogVisible: false,
            groupList: [],
            visible: false,
            userVisible:false,
            groupVisible:false,
            localLanaugaeName:'中文简体',
            localLanaugaeList:[{
                key:'zh-cn',
                name:"中文简体"
            },{
                key:'en',
                name:"English"
            }],
			accountStatus:'1',
			isPublicUser:localStorage.getItem("isPublicUser")==='true'?true:false,
        };
    },
    beforeDestroy: function () {
        Bus.$off("deleteFront")
    },
    created(){
        this.accountStatus = sessionStorage.getItem("accountStatus");

        this.headUrl = localStorage.getItem("headImgUrl");
        console.log("this.headUrl...",this.headUrl);
        this.setHeadShowUrl(this.headUrl);

        let language = localStorage.getItem("internationalization")
        if (this.isNullData(language)) {
            this.localLanaugaeName = '中文简体';
        }else{
            this.localLanaugaeName = (language == 'zh-cn')?'中文简体':"English";
        }
        // localStorage.setItem("headImgUrl"
    },
    // computed: {
    //     ...mapState([
    //         'headShowUrl'
    //         ])
    // },
    mounted: function () {
        if (localStorage.getItem("groupName")) {
            this.groupName = localStorage.getItem("groupName");
        }
        if (localStorage.getItem("user")) {
            this.accountName = localStorage.getItem("user");
        }
        if (localStorage.getItem("internationalization")) {
            let key = localStorage.getItem("internationalization");
            this.localLanaugaeList.forEach(item=>{
                if(item.key == key){
                    this.localLanaugaeName = item.name;
                }
            })
        }else{
            localStorage.setItem("internationalization", "zh-cn");
		}
		this.getGroupList();
		Bus.$on("deleteFront", () => {
			this.groupName = "";
			this.getGroupList('delete');
		})
		Bus.$on("editGroupName", (newName) => {
			this.groupName = newName;
		})
		Bus.$on("addFront", () => {
			this.getGroupList();
		})
    },
    methods: {
        ...mapActions([
            'setTitleArray',
            'setHeadShowUrl'
            ]),
        getGroupList: function (type) {
			if (this.isPublicUser==true) {
				console.log("this.isPublicUser....", this.isPublicUser);
				getGroupsPullList({all:0}).then(res => {
					if (res.data.code === 0) {
						if (res.data.data && res.data.data.length>0) {
							// this.dialogShow = true;
							this.groupList = res.data.data || []
							console.log("res.data.data.....", res.data.data);
						} else {
							this.groupList = [];
							localStorage.setItem("groupName", "")
							localStorage.setItem("groupId", "")
						}
						if (res.data.data && res.data.data.length) {
							this.groupName = res.data.data[0].node;
							this.groupList.forEach(element => {
							if (element.value === localStorage.getItem("groupId")) {
								this.groupName = element.node;
							}
						});
						}
						console.log("this.groupId.....", localStorage.getItem("groupId"));
						console.log("this.groupName.....", this.groupName);
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
				});
				return;
			}
            //getGroups
            getLoginUserAllGroups().then(res => {
                if (res.data.code === 0) {
                    if (res.data.data && res.data.data.length) {
                        // this.dialogShow = true;
                        this.groupList = res.data.data || []
                    } else {
                        this.groupList = [];
                        localStorage.setItem("groupName", "")
                        localStorage.setItem("groupId", "")
                    }
                    if (res.data.data && res.data.data.length) {
						this.groupName = res.data.data[0].groupName;
						this.groupList.forEach(element => {
							if (element.groupId === localStorage.getItem("groupId")) {
								this.groupName = element.groupName;
							}
						});
                    }
                    console.log("this.groupId.....", localStorage.getItem("groupId"));
                    console.log("this.groupName.....", this.groupName);
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
            });
        },
        checkGroup: function () {
            if (this.dialogShow) {
                this.dialogShow = false;
            } else {
                this.dialogShow = true;
            }
            console.log("this.checkGroup.....", this.$route.path);
            this.path = this.$route.path;
        },
        changeGroup: function (val) {
            let oldGroupId = localStorage.getItem("groupId");
            if(val.groupId !== oldGroupId){
                this.groupName = val.groupName
                localStorage.setItem("groupName", val.groupName);
                localStorage.setItem("groupId", val.groupId);
                Bus.$emit('changeGroup', val.groupId);
            }
            this.dialogShow = true;
            this.groupVisible = false;
        },

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
					
					localStorage.setItem("internationalization", val.key);
                    location.reload();

                    setTimeout(()=>{
                        _this.$message({
                        type: "success",
                        message: "设置成功"
                    });
                    },1000)

                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).catch(err=>{
                let message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                message = message?message:this.$i18n.t('message.common.systemError');
                this.$message({
                    type: "error",
                    message: message
                });
            })
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
            localStorage.removeItem("orderSearchParams");
            loginOutYX()
                .then()
                .catch();
            delCookie("JSESSIONID");
            delCookie("NODE_MGR_ACCOUNT_C");
            localStorage.removeItem("headImgUrl");
            localStorage.removeItem("root");
            localStorage.removeItem("accountStatus");
			localStorage.removeItem("token");
			localStorage.removeItem("isPublicUser");
			localStorage.removeItem("IsSuperAdmin");
			localStorage.removeItem("MenuDataCode");
            this.setTitleArray([]);

            this.$router.push("/login");
        },
        changePassword: function () {
            this.userVisible = false;
            this.changePasswordDialogVisible = true;
        },
        success: function (val) {
            this.accountStatus = "2";
            this.changePasswordDialogVisible = false;
        },
        accountMsg:function() {
            this.userVisible = false;
            this.setTitleArray([]);
            router.push({path:"/accountMsg"});
        },
        errorHandler() {
            return true
        }
    }
};
</script>
<style>
.mainicon {
    width: 123px;
    height: 47px;
    left: 4%;
    padding-top:9px;
    position: relative;
}

.content-head-network {
    display: inline-flex;
    float: right;
    padding-top: 15px;
    right: 4%;
    position: relative;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.lanauageClass{
    display: inline-flex;
    float: left;
    position: relative;
    background: initial;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
}
.userClass{
    display: inline-flex;
    float: left;
    position: relative;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
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
.divShow {
    background-color: #fff;
    cursor: pointer;
}
.divShow:hover {
    background-color: #E1F7FE;
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
    padding-right: 0px;
    border-right: 0px solid #657d95;
    margin-right: 0px;
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
.group-item-list {
    cursor: pointer;
    line-height: 32px;
    text-align: center;
    background-color: #fff;
}
.group-item-list:hover {
    line-height: 32px;
    text-align: center;
    background-color: #E1F7FE;
}

.el-popover{
    min-width:80px !important;
}

</style>
