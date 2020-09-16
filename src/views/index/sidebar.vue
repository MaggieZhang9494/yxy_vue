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
        <div style="height: 100%;background-color: #ffffff" class="sidebar-content">
            <!-- <div class="image-flex justify-center center" style="height: 54px;position:relative;" v-if="menuShowC">
                <img :src="maxLog" alt="" style="width:120px">
                <span class="sidebar-contract-icon">
                    <i class="el-icon-caret-left font-color-aeb1b5" @click="hideMune(true)" style="font-size: 18px;"></i>
                </span>
            </div> -->
            <!-- <div class="mini-sidebar-contract-icon" v-if="!menuShowC" style="padding-bottom:40px">
                <i class="el-icon-caret-right font-color-aeb1b5" @click="hideMune(false)" style="font-size: 18px;"></i>
            </div> -->
            <el-menu default-active="999" router class="el-menu-vertical-demo" text-color="#000000" active-text-color="#1585FF" active-background-color="#eaf8ff" background-color="#ffffff" @select="select" :collapse="!menuShowC" @open="handleOpen" @close="handleClose">
                <template v-for="(item,index) in routesList" v-if="item.menuShow">
                    <el-submenu v-if="!item.leaf" :key=index :index="`${index}`" ref="ele" class="">
                        <template slot="title">
                            <div :style="{'padding-left':  menuShowC ? '33px':'20px','width':'100%','background-color': activeIndex == index && !menuShowC ? '#1585FF':''}">
                                <i :class="item.iconCls" :style="{'color': activeIndex == index ? (menuShowC?'#1585FF':'#fff'):''}"></i>
                                <span :class="{'font-color-1585FF': activeIndex == index}">{{item.name}}</span>
                            </div>
                        </template>

                        <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" style="padding-left: 58px;" :style="{'border-right':term.path == activeRoute ? '3px solid #1585FF': '',
                                    'padding-left':!menuShowC?'none':(term.path == activeRoute ? '58px': '58px'),
                                    'text-align':!menuShowC?'center':'left',
                                    'background-color':term.path == activeRoute ? '#eaf8ff': '#ffffff',}">
                            <span>{{term.name}}</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" :style="{'border-right':item.children[0].path == activeRoute ? '3px solid #1585FF': '',
                                'padding-left':item.children[0].path == activeRoute ? '33px': '33px',
                                'width':'100%',
                                'text-align':!menuShowC?'center':'left',
                                'background-color':item.children[0].path == activeRoute ? (menuShowC?'#eaf8ff':'#1585FF'): '#fff',}">
                        <i :class="item.iconCls" :style="{'color': item.children[0].path == activeRoute ? (menuShowC?'#1585FF':'#fff'):''}"></i>
                        <span slot="title">{{item.children[0].name}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
        </div>
    </div>
</template>

<script>
import maxLog from "@/../static/image/logo-2 copy@1.5x.png";
import router from "@/router";
import { mapState, mapActions } from 'vuex'
import { getMenuShowRouterList } from "@/util/role/menuDataShowDeal";
export default {
    name: "sidebar",
    props: ["minMenu"],
    data() {
        return {
            maxLog: maxLog,
            activeIndex: 0,
            activeRoute: "",
            userRole: localStorage.getItem("root"),
            routesList: [],
            currentUser:localStorage.getItem("user"),
        };
    },
    computed: {
        menuShowC() {
            if (this.minMenu) {
                return this.minMenu;
            } else {
                return false;
            }
        }
	},
	created(){
		console.log("sidebar created....");
		this.routesList = [];
		this.routesList = getMenuShowRouterList();
		console.log("this.routesList....",this.routesList);
    },
    mounted: function() {
        // this.$nextTick(function() {
        //     localStorage.setItem("sidebarHide", false);
        //     this.changeRouter();
        // });
    },
    methods: {
        ...mapActions([
            'setTitleArray'
            ]),
        changeRouter: function() {
            // let list = JSON.parse(JSON.stringify(this.$router.options.routes));
            // list = list.map(item => {
            //     console.log("item.menuShow...",item.menuShow);
            //     if(item.menuShow!=undefined){
			// 		let isPublicUser = localStorage.getItem("isPublicUser")==='true'?true:false;
			// 		if (isPublicUser) {
			// 			//公共查询页面
			// 			if(item.name === this.$i18n.t('message.menuName.publicQuery')){
			// 				item.menuShow = true;
			// 			}else{
			// 				item.menuShow = false;
			// 			}
			// 		}else{
			// 			//超级管理员：显示所有菜单
			// 			if(this.userRole == "admin" && this.currentUser == "admin"){
			// 				item.menuShow = true;
			// 			}
			// 			//普通管理员：显示
			// 			else if(this.userRole == "admin" && this.currentUser != "admin"){
			// 				// item.menuShow = true;
			// 				if (item.name === this.$i18n.t('message.menuName.accountManagement') || item.name === this.$i18n.t('message.menuName.businessManagement')) {
			// 					item.menuShow = true;
			// 				}else{
			// 					item.menuShow = false;
			// 				}
			// 			}
			// 			//普通成员：只显示业务管理模块
			// 			else{
			// 				if (item.name === this.$i18n.t('message.menuName.businessManagement')) {
			// 					item.menuShow = true;
			// 				}else{
			// 					item.menuShow = false;
			// 				}
			// 			}
			// 			//公共查询页面
			// 			if(item.name === this.$i18n.t('message.menuName.publicQuery')){
			// 				item.menuShow = false;
			// 			}
			// 		} 
            //         //调试代码
            //         // item.menuShow = true;
            //     }
            //     return item;
            // });
			// this.routesList = list;
			this.routesList = getMenuShowRouterList();
        },
        select: function(index, indexPath) {
            console.log("selectPath");
            localStorage.removeItem("orderSearchParams");
            this.setTitleArray([]);
            this.activeIndex = indexPath[0];
            this.activeRoute = index;
        },
        handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        },
        hideMune: function(val) {
            this.$emit("sidebarChange", val);
            if (this.menuShow) {
                this.menuShow = false;
            } else {
                this.menuShow = true;
            }
            if (this.$route.path === "contract" && val) {
                localStorage.setItem("sidebarHide", true);
            } else {
                localStorage.setItem("sidebarHide", false);
            }
        },
        getAdmin: function() {}
    }
};
</script>

<style scoped>
.el-menu-vertical-demo {
    padding-top: 0px;
    border: none;
}
.el-menu-vertical-demo>>>.el-menu-item {
    font-size: 14px;
    color: #ffffff;
    text-align: left;
}
.el-menu-item:hover {
    background-color: #eaf8ff !important;
}
.el-menu-item:focus {
    background-color: #eaf8ff !important;
}
.el-menu-vertical-demo>>>.el-submenu__title {
    padding: 0px !important;
    /* padding-left: 33px; */
    /* background-color: #1878ff !important; */
}
.el-menu-vertical-demo>>>.el-submenu .is-active .el-submenu__title {
    background-color: #1878ff !important;
}
.el-menu-vertical-demo>>>.el-submenu__title:hover {
    background-color: #eaf8ff !important;
} 
/* .el-menu-item:hover {
    background-color: #eaf8ff !important;
    width: 200px;
} */

.el-menu-item.is-active {
   background-color: #eaf8ff !important;
}

.el-menu-item-group > ul > .el-menu-item {
    font-size: 14px;
    color: #9da2ab;
    text-align: left;
    padding-left: 57px !important;
    height: 46px;
    line-height: 46px;
}

.sidebar-content>>>.el-menu--collapse {
    width: 56px;
}
.sidebar-content>>>.el-menu--collapse .is-active .el-tooltip {
    padding-left: 20px !important;
    background-color: #1585FF;
}
.mini-sidebar-contract-icon {
    position: relative;
    text-align: center;
}
.mini-sidebar-contract-icon i {
    position: absolute;
    top: 20px;
    right: 10px;
    z-index: 9999;
    cursor: pointer;
}

.image-flex {
    display: -webkit-box !important;
    display: -webkit-flex !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
/* .image-flex,
.image-flex *,
.image-flex :after,
.image-flex :before {
} */
.image-flex.justify-center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
}
.image-flex.center {
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}
.sidebar-icon {
    font-size: 15px;
    padding-right: 5px;
}
.sidebar-contract-icon {
    position: absolute;
    display: inline-block;
    left: 180px;
    top: 18px;
    font-size: 12px;
    letter-spacing: 0;
    text-align: right;
    cursor: pointer;
    z-index: 6666;
}
.sidebar-contract-icon i {
    cursor: pointer;
}

</style>
