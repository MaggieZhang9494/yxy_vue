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
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.menuName.businessDetail'" :headTitlePath="{path:'/businessDetail'}" :icon="true"></v-content-head>
        <!-- v-show="isMoveTop == false" -->
        <div class="module-wrapper" style="margin-bottom:15px;">
            <v-order-show :showData="orderMsg" :showKeyDesc="businessDesc" :orderType="order_type" style="width:auto" :isAutoLineFeed='false'></v-order-show>
        </div>
        <!-- :style="{'margin-top': isMoveTop? '55px':'0px'}" style="margin-top:0px;"-->
        <div class="module-wrapper" id="businessDetail" :style="{'margin-top': isMoveTop? '60px':'0px'}" v-loading="loading">
            <div id="el-menu-title">
                <el-menu v-if="order_type!='FE'" :default-active="activeIndex" ref="elMenuTitle" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                    <!-- 所有事件 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_03'].isSee" index="1">{{$t('message.businessDetail.allIncident')}}</el-menu-item>
					<!-- 流程进程 -->
                    <el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_04'].isSee" index="2">{{$t('message.businessDetail.flowCourse')}}</el-menu-item>
					<!-- 复核纠错 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_09'].isSee" index="3">{{$t('message.businessDetail.reviewCorrention')}}</el-menu-item>
					<!-- 单证文件 -->
                    <el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_05'].isSee" index="4">{{$t('message.businessDetail.documentFile')}}</el-menu-item>
					<!-- 报关单详情 -->
                    <el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_06'].isSee && perssionData.dataMenu['DATA.FI.DECLARATION_LIST'].isSee" index="5">{{$t('message.businessDetail.customsDeclarationDetail')}}</el-menu-item>
					<!-- 完税信息 -->
                    <el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_07'].isSee" index="6">{{$t('message.businessDetail.paymentInformation')}}</el-menu-item>
					<!-- 交付时间 -->
                    <el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_08'].isSee" index="7">{{$t('message.businessDetail.deliveryTime')}}</el-menu-item>
                </el-menu>
                <el-menu v-else :default-active="activeIndex" ref="elMenuTitle" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                    <!-- 所有事件 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_03'].isSee" index="1">{{$t('message.businessDetail.allIncident')}}</el-menu-item>
                    <!-- 流程进程 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_04'].isSee" index="2">{{$t('message.businessDetail.flowCourse')}}</el-menu-item>
					<!-- 复核纠错 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_08'].isSee" index="3">{{$t('message.businessDetail.reviewCorrention')}}</el-menu-item>
                    <!-- 单证文件 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_05'].isSee" index="4">{{$t('message.businessDetail.documentFile')}}</el-menu-item>
                    <!-- 报关单详情 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_06'].isSee && perssionData.dataMenu['DATA.FE.DECLARATION_LIST'].isSee" index="5">{{$t('message.businessDetail.customsDeclarationDetail')}}</el-menu-item>
                    <!-- 交付时间 -->
					<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_07'].isSee" index="6">{{$t('message.businessDetail.deliveryTime')}}</el-menu-item>
                </el-menu>
            </div>
			<!-- 所有事件 -->
            <div v-if="activeIndex==1" id="allEvent" style="position: relative;padding-bottom: 1px;">
                <v-allevent v-if="businessDesc.ACCEPT_DATE" :nodeList="allEventList"></v-allevent>
            </div>
			<!-- 流程进程 -->
            <div v-if="activeIndex==2" id="flowCourse" style="position: relative;padding-bottom: 20px;">
                <v-flow-course v-if="businessDesc.ACCEPT_DATE && flowCourseList && flowCourseList.length>=1" :nodeList="flowCourseList" :businessDesc="businessDesc" :orderType="order_type" :orderMsg="orderMsg" :gotoCusNoDetail="goCusNoDetail"></v-flow-course>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
			<!-- 复核纠错 -->
            <div v-if="activeIndex==3" id="reviewCorrention">
                <v-review-corrention v-if="businessDesc.ACCEPT_DATE && orderMsg && orderMsg.ORDER_NO" :nodeList="flowCourseList" :businessDesc="businessDesc" :orderMsg="orderMsg" :orderType="order_type"></v-review-corrention>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
			<!-- 单证文件 -->
            <div v-if="activeIndex==4" id="documentFile">
                <!-- <v-developing> </v-developing> -->
				<v-document v-if="businessDesc.ACCEPT_DATE && orderMsg && orderMsg.ORDER_NO" :businessDesc="businessDesc" :orderMsg="orderMsg" :orderType="order_type"></v-document>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
			<!-- 报关单详情 -->
            <div v-if="activeIndex==5" id="customsDeclarationDetail">
                <v-customs-detail v-if="businessDesc.ACCEPT_DATE && orderMsg && orderMsg.ORDER_NO" :cus_no="cus_no" @change="changeCusNo" :businessDesc="businessDesc" :orderMsg="orderMsg" :orderType="order_type"></v-customs-detail>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
			<!-- 完税信息 -->
            <div v-show="order_type!='FE'" v-if="activeIndex==6" id="paymentInformation">
                <v-payment-information v-if="businessDesc.ACCEPT_DATE && orderMsg && orderMsg.ORDER_NO" :businessDesc="businessDesc" :orderMsg="orderMsg" :orderType="order_type" :gotoCusNoDetail="goCusNoDetail"></v-payment-information>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
			<!-- 出口交付时间 -->
            <div v-show="order_type=='FE'" v-if="activeIndex==6" id="deliveryTime">
                <v-delivery-time v-if="businessDesc.ACCEPT_DATE && orderMsg && orderMsg.ORDER_NO" :businessDesc="businessDesc" :orderMsg="orderMsg" :orderType="order_type"></v-delivery-time>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
			<!-- 进口交付时间 -->
            <div v-if="activeIndex==7" id="deliveryTime">
                <v-delivery-time v-if="businessDesc.ACCEPT_DATE && orderMsg && orderMsg.ORDER_NO" :businessDesc="businessDesc" :orderMsg="orderMsg" :orderType="order_type"></v-delivery-time>
                <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import orderMsgShow from "./components/orderMsgShow";
import flowCourse from "./businessDetail/flowCourse";
import reviewCorrention from "./businessDetail/reviewCorrention";
import allEvent from "./businessDetail/allEvent";
import documents from "./businessDetail/documents";
import customsDetail from "./businessDetail/customsDetail";
import deliveryTime from "./businessDetail/deliveryTime";
import paymentInformation from "./businessDetail/paymentInformation";
import { getBusinessOrderDetail, getBusinessDesc } from "@/util/api";
import { getRecentlyDataFromList, 
getTransDataList,getAllEventList,
getStepsShow,getExportStepsShow,
getStepsActive,getTotalStepsActive,
getTotalStepsTitle,getExportStepsActive,
getExportTotalStepsActive,getExportStepsTitle,
getPodPortNode,getPolPortNode } from "@/util/orderDataParse";
import router from "@/router";
import errcode from "@/util/errcode";
import developing from "@/components/developing";
import Bus from "@/bus"

export default {
    name: "businessDetail",
    components: {
        "v-content-head": contentHead,
        "v-order-show":orderMsgShow,
		"v-flow-course":flowCourse,
		"v-review-corrention":reviewCorrention,
        "v-allevent":allEvent,
        "v-delivery-time":deliveryTime,
        "v-customs-detail":customsDetail,
        "v-payment-information":paymentInformation,
		"v-developing":developing,
		"v-document":documents,
    },
    data: function() {
        return {
            loading:false,
            activeIndex: '1', //1：所有事件 2：流程进程 3：单证文件 4：报关单详情
            currentPage: 1,
            pageSize: 10,
            total: 0,
            //订单业务详情信息
            orderMsg:null,
            //订单hash,通过其查询订单详情
            order_no:"",
            //订单类型,通过其显示不同的内容
            order_type:"",//"FI"进口:"FE"出口

            //所有事件列表数据
            allEventList:[],
            //流程进程列表数据
            flowCourseList:[],

            //业务描述信息
            businessDesc:{},
            //全部进口业务流程节点名称数组
            allNodeList:[/*"主检",*/"运输",/*"辅检",*/"报关","换单","订单"],
            //全部出口业务流程节点名称数组
            allExportNodeList:["运输","报关","订舱","订单"],
            //是否是元初的客户
            isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),

            //flowCourse模块是否移动到顶部
            isMoveTop:false,

            //报关单号
			cus_no:"",
			
			perssionData:{},
        };
    },
    beforeDestroy: function () {
        console.log("beforeDestroy...");
        // localStorage.removeItem("reqTxhash");
		Bus.$off("changeGroup")
		
		Bus.$off("menuChange")

		//给页面绑定滑轮滚动事件 
        if (document.addEventListener) {//firefox 
		    document.removeEventListener('DOMMouseScroll', this.scrollFunc, false); 
        } 
        //滚动滑轮触发scrollFunc方法 //ie 谷歌 
        window.onmousewheel = document.onmousewheel = null;
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
		})
		Bus.$on("menuChange", data => {
			setTimeout(() => {
				this.scrollFunc()
			}, 0);
        })
        let _this = this;
        
        //给页面绑定滑轮滚动事件 
        if (document.addEventListener) {//firefox 
		    document.addEventListener('DOMMouseScroll', _this.scrollFunc, false); 
        } 
        //滚动滑轮触发scrollFunc方法 //ie 谷歌 
        window.onmousewheel = document.onmousewheel = _this.scrollFunc;
    },
    created(){
		let _this = this;
		
		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))
        //初始化列表查询参数
        _this.initSearchParams();

        /**
         * 获取业务描述详情
         */
        _this.getBusDesc();

        
    },
    methods: {
        changGroup(val){
			// this.$router.go(-2);//返回上一层
			console.log("订单详情....");
			this.$router.push("/businessSearch");//返回上一层
            // /**
            //  * 获取订单详情
            //  */
            // this.getOrderDetail();
        },
        scrollFunc(e) { 
			// console.log("scrollFunc.....");
            let _this = this;
            let businessDetailDiv = document.getElementById("businessDetail"); //_this.$refs.flowCourse;
            //获取切换菜单顶部距离document顶部高度,初始距离471，当距离140时则隐藏上面的内容视图
			let topY = businessDetailDiv.getBoundingClientRect().y
			
			// console.log("topY.....",topY);

            //获取对应菜单项视图显示宽度
            let menuItemDiv;
            if (this.order_type != 'FE') { //进口
                if(_this.activeIndex == 1){
                    menuItemDiv = document.getElementById("allEvent");
                }else if(_this.activeIndex == 2){
                    menuItemDiv = document.getElementById("flowCourse");
                }else if(_this.activeIndex == 3){
                    menuItemDiv = document.getElementById("reviewCorrention");
                }else if(_this.activeIndex == 4){
                    menuItemDiv = document.getElementById("documentFile");
                }else if(_this.activeIndex == 5){
                    menuItemDiv = document.getElementById("customsDeclarationDetail");
                }else if(_this.activeIndex == 6){
                    menuItemDiv = document.getElementById("paymentInformation");
                }else if(_this.activeIndex == 7){
                    menuItemDiv = document.getElementById("deliveryTime");
                }
            }else{
                if(_this.activeIndex == 1){
                    menuItemDiv = document.getElementById("allEvent");
                }else if(_this.activeIndex == 2){
                    menuItemDiv = document.getElementById("flowCourse");
                }else if(_this.activeIndex == 3){
                    menuItemDiv = document.getElementById("reviewCorrention");
                }else if(_this.activeIndex == 4){
                    menuItemDiv = document.getElementById("documentFile");
                }else if(_this.activeIndex == 5){
                    menuItemDiv = document.getElementById("customsDeclarationDetail");
                }else if(_this.activeIndex == 6){
                    menuItemDiv = document.getElementById("deliveryTime");
                }
            }
            
            if (menuItemDiv.clientWidth) {
				let menuItemWidth = menuItemDiv.clientWidth;
				if(topY <= 140){//菜单滑动到顶部时，更新切换菜单样式
						_this.isMoveTop = true;
						let elMenuTitle = document.getElementById("el-menu-title");
						elMenuTitle.style = "position:fixed;top:141px;z-index:10;transition: width 1s;-moz-transition: width 1s;-webkit-transition: width 1s;-o-transition: width 3s;"
						elMenuTitle.width = menuItemWidth+'px';
						_this.$refs.elMenuTitle.$el.style.width = menuItemWidth+'px';
				}else{//菜单从顶部下滑时，恢复样式
					_this.isMoveTop = false;
					let elMenuTitle = document.getElementById("el-menu-title");
					elMenuTitle.style = "position:relative;top:0px;transition: width 1s;-moz-transition: width 1s;-webkit-transition: width 1s;-o-transition: width 3s;"
				}
			}
            

        //     e = e || window.event; 
        //     if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件    
        //          if (e.wheelDelta > 0) { //当滑轮向上滚动时 
        //     //         console.log("滑轮向上滚动......",e.wheelDelta); 
        //          } 
        //          if (e.wheelDelta < 0) { //当滑轮向下滚动时 
        //     //         console.log("滑轮向下滚动......",e.wheelDelta); 
        //          } 
        //     } else if (e.detail) { //Firefox滑轮事件 
        //          if (e.detail> 0) { //当滑轮向上滚动时 
        //     //         console.log("滑轮向上滚动......",e.detail); 
        //          } 
        //          if (e.detail< 0) { //当滑轮向下滚动时 
        //     //         console.log("滑轮向下滚动......",e.detail); 
        //          } 
        //     } 
       },
        //初始化列表查询参数
        initSearchParams(){
            let _this = this;
            console.log("localStorage.getItem(reqTxhash)...", localStorage.getItem("reqTxhash"));
            // //在页面加载时读取localStorage里的状态信息
            let reqParamsStr = localStorage.getItem("reqTxhash");
            if (reqParamsStr) {
                _this.order_no = reqParamsStr;
            }else{
                _this.order_no = _this.$route.query.orderMsg.row_data.ORDER_NO;
            } 

            //在页面加载时读取localStorage里的状态信息
            let typeStr = localStorage.getItem("OrderType");
            if (typeStr) {
                _this.order_type = typeStr;
            }else{
                _this.order_type = _this.$route.query.orderType;
            } 

            //在页面刷新时将vuex里的信息保存到localStorage里
            // window.addEventListener("beforeunload",()=>{
            //     console.log("beforeunload。。。。。。");
            //     localStorage.setItem("reqTxhash",_this.order_no)
            // })
            localStorage.setItem("reqTxhash",_this.order_no)
            localStorage.setItem("OrderType",_this.order_type)

            // //获取业务描述信息
            // _this.businessDesc = JSON.parse(localStorage.getItem("BusinessDesc"));
        },
        /**
         * 根据详情内容解析获取流程数组
         */
        getFlowCourseList(orderRowData){
            let _this = this;

			let orderNewMsg = JSON.parse(JSON.stringify(orderRowData));
            if(_this.order_type!='FE'){ //订单进口类型
                let stepsActive = getTotalStepsActive(orderNewMsg);
                let nodeList = getTotalStepsTitle(orderNewMsg,false);
                nodeList.reverse();
                //根据进度数，得出显示流程进度节点名称数组
                let length = nodeList.length;
                nodeList.splice(0,length-stepsActive);

                let showNodeDataList = [];
                //根据动态节点名称数组，插入对应节点数据
                for (let index = 0; index < nodeList.length; index++) {
                    let element = nodeList[index];

                    let nodeObj = {};
                    //获取节点左侧显示内容（节点名、左侧节点名称下内容）
                    nodeObj.nodeName = getStepsShow(element);
                    nodeObj.nodeDetail = this.getNodeLeftDownData(element, orderNewMsg);
                    //获取节点右侧显示内容
                    nodeObj.nodeList = this.getNodeRightData(element, orderNewMsg);
    
                    showNodeDataList.push(nodeObj);
                }
				//插入固定节点名称抵运国、抵运港
				let diyunObj = getPodPortNode(_this.order_type,orderNewMsg,_this.businessDesc,_this.perssionData);
				if (diyunObj!=null) {
					showNodeDataList.push(diyunObj);
				}
                // let diyunObj = {};
                // let pod_country = orderNewMsg.POD_COUNTRY?orderNewMsg.POD_COUNTRY:this.businessDesc.POD_COUNTRY;
                // let pod_name = orderNewMsg.POD_NAME?orderNewMsg.POD_NAME:this.businessDesc.POD_NAME;
                // diyunObj.nodeName = pod_country+"/"+pod_name;
                // diyunObj.isHideColon = true;
                // diyunObj.nodeDetail = [{key:_this.businessDesc.ATA, value:orderNewMsg.ATA}];
                // diyunObj.nodeList = [[{
                //     dateDesc:_this.businessDesc.ETA,
                //     date:orderNewMsg.ETA,
                //     upTime:orderNewMsg.ETA_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ETA_CHAIN_TIME),
                // },{
                //     dateDesc:_this.businessDesc.ATA,
                //     date:orderNewMsg.ATA,
                //     upTime:orderNewMsg.ATA_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ATA_CHAIN_TIME),
                // }]];
                // showNodeDataList.push(diyunObj);

				//插入固定节点名称启运国、启运港
				let qiyunObj = getPolPortNode(_this.order_type,orderNewMsg,_this.businessDesc,_this.perssionData);
				if (qiyunObj!=null) {
					showNodeDataList.push(qiyunObj);
				}

                // let qiyunObj = {};
                // let pol_country = orderNewMsg.POL_COUNTRY?orderNewMsg.POL_COUNTRY:_this.businessDesc.POL_COUNTRY;
                // let pol_name = orderNewMsg.POL_NAME?orderNewMsg.POL_NAME:_this.businessDesc.POL_NAME;
                // qiyunObj.nodeName = pol_country+"/"+pol_name;
                // qiyunObj.isHideColon = true;
                // qiyunObj.nodeDetail = [{key:_this.businessDesc.ATD, value:orderNewMsg.ATD}];
                // qiyunObj.nodeList = [[{
                //     dateDesc:_this.businessDesc.ETD,
                //     date:orderNewMsg.ETD,
                //     upTime:orderNewMsg.ETD_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ETD_CHAIN_TIME),
                // },{
                //     dateDesc:_this.businessDesc.ATD,
                //     date:orderNewMsg.ATD,
                //     upTime:orderNewMsg.ATD_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ATD_CHAIN_TIME),
                // }]];
                // showNodeDataList.push(qiyunObj);

                return showNodeDataList;
            }else{
                let stepsActive = getExportTotalStepsActive(orderNewMsg);
                let nodeList = getExportStepsTitle(orderNewMsg);
                nodeList.reverse();
                //根据进度数，得出显示流程进度节点名称数组
                let length = nodeList.length;
				nodeList.splice(0,length-stepsActive);
				
                let showNodeDataList = [];
                //根据动态节点名称数组，插入对应节点数据
                for (let index = 0; index < nodeList.length; index++) {
                    let element = nodeList[index];
                    
                    let nodeObj = {};
                    //获取节点左侧显示内容（节点名、左侧节点名称下内容）
                    nodeObj.nodeName = getExportStepsShow(element);
                    nodeObj.nodeDetail = this.getNodeLeftDownData(element, orderNewMsg);
                    //获取节点右侧显示内容
                    nodeObj.nodeList = this.getNodeRightData(element, orderNewMsg);
            
                    showNodeDataList.push(nodeObj);
                }
				//插入固定节点名称抵运国、抵运港
				let diyunObj = getPodPortNode(_this.order_type,orderNewMsg,_this.businessDesc,_this.perssionData);
				if (diyunObj!=null) {
					showNodeDataList.push(diyunObj);
				}

                // let diyunObj = {};
                // let pod_country = orderNewMsg.POD_COUNTRY?orderNewMsg.POD_COUNTRY:this.businessDesc.POD_COUNTRY;
                // let pod_name = orderNewMsg.POD_NAME?orderNewMsg.POD_NAME:this.businessDesc.POD_NAME;
                // diyunObj.nodeName = pod_country+"/"+pod_name;
                // diyunObj.isHideColon = true;
                // diyunObj.nodeDetail = [{key:_this.businessDesc.ATA, value:orderNewMsg.ATA}];;
                // diyunObj.nodeList = [[{
                //     dateDesc:_this.businessDesc.ETA,
                //     date:orderNewMsg.ETA,
                //     upTime:orderNewMsg.ETA_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ETA_CHAIN_TIME),
                // },{
                //     dateDesc:_this.businessDesc.ATA,
                //     date:orderNewMsg.ATA,
                //     upTime:orderNewMsg.ATA_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ATA_CHAIN_TIME),
                // }]];
                // showNodeDataList.push(diyunObj);

				//插入固定节点名称启运国、启运港
				let qiyunObj = getPolPortNode(_this.order_type,orderNewMsg,_this.businessDesc,_this.perssionData);
				if (qiyunObj!=null) {
					showNodeDataList.push(qiyunObj);
				}

                // let qiyunObj = {};
                // let pol_country = orderNewMsg.POL_COUNTRY?orderNewMsg.POL_COUNTRY:_this.businessDesc.POL_COUNTRY;
                // let pol_name = orderNewMsg.POL_NAME?orderNewMsg.POL_NAME:_this.businessDesc.POL_NAME;
                // qiyunObj.nodeName = pol_country+"/"+pol_name;
                // qiyunObj.isHideColon = true;
                // qiyunObj.nodeDetail = [{key:_this.businessDesc.ATD, value:orderNewMsg.ATD}];
                // qiyunObj.nodeList = [[{
                //     dateDesc:_this.businessDesc.ETD,
                //     date:orderNewMsg.ETD,
                //     upTime:orderNewMsg.ETD_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ETD_CHAIN_TIME),
                // },{
                //     dateDesc:_this.businessDesc.ATD,
                //     date:orderNewMsg.ATD,
                //     upTime:orderNewMsg.ATD_CHAIN_TIME,
                //     timestamp:_this.timeStrToTimestamp(orderNewMsg.ATD_CHAIN_TIME),
                // }]];
                // showNodeDataList.push(qiyunObj);

                return showNodeDataList;
            }
        },
        /**
         * 根据节点名称、订单详情获取流程节点左侧显示数据
         */
        getNodeLeftDownData(nodeName, orderNewMsg){
            let nodeDetail = [];
            
            if(this.order_type != 'FE'){ //进口订单类型
                switch (nodeName) {
                    case this.$i18n.t('message.businessSearch.order'):{
						if (this.perssionData.dataMenu["DATA.FI.DZQQ_DATE"].isSee==true) {
							//单证齐全日期
                        	nodeDetail.push({key:this.businessDesc.DZQQ_DATE,value:orderNewMsg.DZQQ_DATE});
						}
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.changeOrder'):{
						if (this.perssionData.dataMenu["DATA.FI.FIN_SWITCH_BILL_DATE"].isSee==true) {
							//换单日期
                        	nodeDetail.push({key:this.businessDesc.FIN_SWITCH_BILL_DATE,value:orderNewMsg.FIN_SWITCH_BILL_DATE});
						}
						if (this.perssionData.dataMenu["DATA.FI.DELIVERY_ORDER_NO"].isSee==true) {
							//提货单号
                        	nodeDetail.push({key:this.businessDesc.DELIVERY_ORDER_NO,value:orderNewMsg.DELIVERY_ORDER_NO});
						}
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.customs'):{
                        //报关单列表中最晚日期
                        let bgOrder = getRecentlyDataFromList('FXDATE',orderNewMsg.DECLARATION_LIST);

						if (this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.FXDATE"].isSee==true) {
							//通关货物放行日期，取报关单列表中最晚日期
                        	nodeDetail.push({key:this.businessDesc["DECLARATION_LIST.FXDATE"],value:bgOrder.FXDATE});
						}
						if (this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CUS_NO"].isSee==true) {
							//报关单号，取报关单列表中最晚报关单
                        	nodeDetail.push({key:this.businessDesc["DECLARATION_LIST.CUS_NO"],value:bgOrder.CUS_NO});
						}
                        
                        console.log("bgOrder....",bgOrder);
                        //当“报关单口岸查验”或者“报关单目的地查验”的栏位显示“有”时，显示对应项
                        let isHGCY_STATUSHave = !this.isNullData(orderNewMsg.HGCY_STATUS);// && (orderNewMsg.HGCY_STATUS == '有' || orderNewMsg.HGCY_STATUS == 'have')
                        let isSJSTATUSHave = !this.isNullData(orderNewMsg.SJSTATUS);// && (orderNewMsg.SJSTATUS == '有' || orderNewMsg.SJSTATUS == 'have')

                        //报关单口岸查验 有 //报关单目的地查验 无
                        if(isHGCY_STATUSHave==true && isSJSTATUSHave==false){
							if (this.perssionData.dataMenu["DATA.FI.HGCY_STATUS"].isSee==true) {
								//报关单口岸查验，取报关单列表中最晚报关单
                            	nodeDetail.push({key:this.businessDesc["HGCY_STATUS"],value:orderNewMsg.HGCY_STATUS});
							}
                        }
                        //报关单口岸查验 无 //报关单目的地查验 有
                        else if(isHGCY_STATUSHave==false && isSJSTATUSHave==true){
							if (this.perssionData.dataMenu["DATA.FI.SJSTATUS"].isSee==true) {
								//报关单目的地查验，取报关单列表中最晚报关单
                            	nodeDetail.push({key:this.businessDesc["SJSTATUS"],value:orderNewMsg.SJSTATUS});
							}
                        }
                        //报关单口岸查验 有 //报关单目的地查验 有
                        else if(isHGCY_STATUSHave==true && isSJSTATUSHave==true){
							if (this.perssionData.dataMenu["DATA.FI.HGCY_STATUS"].isSee==true && this.perssionData.dataMenu["DATA.FI.SJSTATUS"].isSee==true) {
								//报关单口岸查验，取报关单列表中最晚报关单
								nodeDetail.push({
									key:this.businessDesc["HGCY_STATUS"]+"/"+this.businessDesc["SJSTATUS"],
									value:(orderNewMsg.HGCY_STATUS+"/"+orderNewMsg.SJSTATUS)
								});
							} else if(this.perssionData.dataMenu["DATA.FI.HGCY_STATUS"].isSee==true && this.perssionData.dataMenu["DATA.FI.SJSTATUS"].isSee==false){
								//报关单口岸查验，取报关单列表中最晚报关单
								nodeDetail.push({
									key:this.businessDesc["HGCY_STATUS"],
									value:orderNewMsg.HGCY_STATUS
								});
							} else if(this.perssionData.dataMenu["DATA.FI.HGCY_STATUS"].isSee==false && this.perssionData.dataMenu["DATA.FI.SJSTATUS"].isSee==true){
								//报关单口岸查验，取报关单列表中最晚报关单
								nodeDetail.push({
									key:this.businessDesc["SJSTATUS"],
									value:orderNewMsg.SJSTATUS
								});
							}
                        }
                        // //报关单目的地查验
                        // if(!this.isNullData(orderNewMsg.SJSTATUS)){
                        //     //报关单目的地查验，取报关单列表中最晚报关单
                        //     nodeDetail.push({key:this.businessDesc["SJSTATUS"],value:orderNewMsg.SJSTATUS});
                        // }

                        console.log("nodeDetail....",nodeDetail);
                    }
                        break;
                    // case "辅检":{
                    //     //辅检放行日期
                    //     nodeDetail.push({key:this.$i18n.t('message.businessSearch.releaseDateOfCIQ'),value:""});
                    //     //检验检疫联系单号
                    //     nodeDetail.push({key:this.businessDesc["DECLARATION_LIST.CIQ_NO"],value:getRecentlyDataFromList('辅检放行日期',orderMsg.DECLARATION_LIST).CIQ_NO});
                    // }
                    //     break;
                    case this.$i18n.t('message.businessSearch.trans'):{
						if (this.perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_COMP_CN"].isSee==true) {
							//提货点（取最晚货物提货点）
							nodeDetail.push({key:this.businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_COMP_CN"],
							value:getRecentlyDataFromList('TRANS_FIN_DATE',orderNewMsg.ORDER_SERVE_TRANSPORT_LIST).PICK_UP_COMP_CN});
						}
						if (this.perssionData.dataMenu["DATA.FI.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE"].isSee==true) {
							//货物送达完成日期（取最晚货物实际送达日期）
                        	nodeDetail.push({key:this.$i18n.t('message.businessSearch.transFinDate'),value:getRecentlyDataFromList('TRANS_FIN_DATE',orderNewMsg.ORDER_SERVE_TRANSPORT_LIST).TRANS_FIN_DATE});
						}
                    }
                        break;
                    // case "主检":{
                    //     //主检放行日期
                    //     if(!this.isNullData(orderNewMsg.SJ_DATE2)){
                    //         nodeDetail.push({key:this.businessDesc.SJ_DATE2,value:orderNewMsg.SJ_DATE2});
                    //     }
                    // }
                    //     break;
                    default:
                        break;
                }
            }else{//出口订单类型
                switch (nodeName) {
                    case this.$i18n.t('message.businessSearch.order'):{
						if (this.perssionData.dataMenu['DATA.FE.DZQQ_DATE'].isSee==true) {
							//单证齐全日期
                        	nodeDetail.push({key:this.businessDesc.DZQQ_DATE,value:orderNewMsg.DZQQ_DATE});
						}
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.booking'):{
						if (this.perssionData.dataMenu['DATA.FE.BL_CONFIRM_DATE'].isSee==true) {
							//提单确认日期
                        	nodeDetail.push({key:this.businessDesc.BL_CONFIRM_DATE,value:orderNewMsg.BL_CONFIRM_DATE});
						}
						if (this.perssionData.dataMenu['DATA.FE.MBL_NO'].isSee==true) {
							//承运人提单号
                        	nodeDetail.push({key:this.businessDesc.MBL_NO,value:orderNewMsg.MBL_NO});
						}
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.customs'):{
						if (this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.FXDATE'].isSee==true) {
							//通关货物放行日期，取报关单列表中最晚日期
                        	nodeDetail.push({key:this.businessDesc["DECLARATION_LIST.FXDATE"],value:getRecentlyDataFromList('FXDATE',orderNewMsg.DECLARATION_LIST).FXDATE});
						}
						if (this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CUS_NO'].isSee==true) {
							//报关单号，取报关单列表中最晚报关单
                        	nodeDetail.push({key:this.businessDesc["DECLARATION_LIST.CUS_NO"],value:getRecentlyDataFromList('FXDATE',orderNewMsg.DECLARATION_LIST).CUS_NO});
						}
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.trans'):{
						if (this.perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.PICK_UP_COMP_CN'].isSee==true) {
							//提货点（取最晚货物提货点）
							nodeDetail.push({key:this.businessDesc["ORDER_SERVE_TRANSPORT_LIST.PICK_UP_COMP_CN"],
							value:getRecentlyDataFromList('TRANS_FIN_DATE',orderNewMsg.ORDER_SERVE_TRANSPORT_LIST).PICK_UP_COMP_CN});
						}
						if (this.perssionData.dataMenu['DATA.FE.ORDER_SERVE_TRANSPORT_LIST.TRANS_FIN_DATE'].isSee==true) {
							//货物送达完成日期（取最晚货物实际送达日期）
                        	nodeDetail.push({key:this.$i18n.t('message.businessSearch.transFinDate'),value:getRecentlyDataFromList('TRANS_FIN_DATE',orderNewMsg.ORDER_SERVE_TRANSPORT_LIST).TRANS_FIN_DATE});
						}
                    }
                        break;
                    default:
                        break;
                }
            }
            return nodeDetail;
        },
        /**
         * 根据节点名称、订单详情获取流程节点右侧显示数据
         */
        getNodeRightData(nodeName, orderNewMsg){
            let _this = this;
            let nodeRightList = [];

            if(this.order_type != 'FE'){ //进口订单类型
                switch (nodeName) {
                    case this.$i18n.t('message.businessSearch.order'):{
						let nodeList = [];
						if (_this.perssionData.dataMenu["DATA.FI.DZQQ_DATE"].isSee==true) {
							//单证齐全日期
							nodeList.push({
								dateDesc:_this.businessDesc.DZQQ_DATE,
								date:orderNewMsg.DZQQ_DATE,
								upTime:orderNewMsg.DZQQ_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.DZQQ_DATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu["DATA.FI.RECE_DOC_DATE"].isSee==true) {
							//单证收到日期
							nodeList.push({
								dateDesc:_this.businessDesc.RECE_DOC_DATE,
								date:orderNewMsg.RECE_DOC_DATE,
								upTime:orderNewMsg.RECE_DOC_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.RECE_DOC_DATE_CHAIN_TIME),
							});
						}
                        
                        if(_this.isYuanChuAcc != '1'){
							if (_this.perssionData.dataMenu["DATA.FI.MODIFY_TIME"].isSee==true) {
								//修改时间
								nodeList.push({
									dateDesc:_this.businessDesc.MODIFY_TIME,
									date:orderNewMsg.MODIFY_TIME,
									upTime:orderNewMsg.MODIFY_TIME_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.MODIFY_TIME_CHAIN_TIME),
									detailData:[{key:_this.businessDesc.MODIFY_BY, value:orderNewMsg.MODIFY_BY}]
								});
							}
                            if (_this.perssionData.dataMenu["DATA.FI.CREATE_TIME"].isSee==true) {
								//创建时间
								nodeList.push({
									dateDesc:_this.businessDesc.CREATE_TIME,
									date:orderNewMsg.CREATE_TIME,
									upTime:orderNewMsg.CREATE_TIME_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.CREATE_TIME_CHAIN_TIME),
									detailData:[{key:_this.businessDesc.CREATE_BY, value:orderNewMsg.CREATE_BY}]
								});
							}
                            if (_this.perssionData.dataMenu["DATA.FI.ACCEPT_DATE"].isSee==true) {
								//客户委托日期
								nodeList.push({
									dateDesc:_this.businessDesc.ACCEPT_DATE,
									date:orderNewMsg.ACCEPT_DATE,
									upTime:orderNewMsg.ACCEPT_DATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.ACCEPT_DATE_CHAIN_TIME),
								});
							}
                        }
                        nodeRightList.push(nodeList);
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.changeOrder'):{
						let nodeList = [];
						if (_this.perssionData.dataMenu["DATA.FI.FIN_SWITCH_BILL_DATE"].isSee==true) {
							//换单日期
							nodeList.push({
								dateDesc:_this.businessDesc.FIN_SWITCH_BILL_DATE,
								date:orderNewMsg.FIN_SWITCH_BILL_DATE,
								upTime:orderNewMsg.FIN_SWITCH_BILL_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.FIN_SWITCH_BILL_DATE_CHAIN_TIME),
								detailData:[{key:_this.businessDesc.FIN_SWITCH_AGENCY_NAME, value:orderNewMsg.FIN_SWITCH_AGENCY_NAME}]
							});
						}
                        if (_this.perssionData.dataMenu["DATA.FI.FST_SWITCH_BILL_DATE"].isSee==true) {
							//头程换单日期
							nodeList.push({
								dateDesc:_this.businessDesc.FST_SWITCH_BILL_DATE,
								date:orderNewMsg.FST_SWITCH_BILL_DATE,
								upTime:orderNewMsg.FST_SWITCH_BILL_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.FST_SWITCH_BILL_DATE_CHAIN_TIME),
								detailData:[{key:_this.businessDesc.FST_SWITCH_AGENCY_NAME, value:orderNewMsg.FST_SWITCH_AGENCY_NAME}]
							});
						}
                        if (_this.perssionData.dataMenu["DATA.FI.SCD_SWITCH_BILL_DATE"].isSee==true) {
							//二程换单日期
							if(!_this.isNullData(orderNewMsg.SCD_SWITCH_BILL_DATE)){
								nodeList.push({
									dateDesc:_this.businessDesc.SCD_SWITCH_BILL_DATE,
									date:orderNewMsg.SCD_SWITCH_BILL_DATE,
									upTime:orderNewMsg.SCD_SWITCH_BILL_DATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.SCD_SWITCH_BILL_DATE_CHAIN_TIME),
									detailData:[{key:_this.businessDesc.SCD_SWITCH_AGENCY_NAME, value:orderNewMsg.SCD_SWITCH_AGENCY_NAME}]
								});
							}
						}
                        if (_this.perssionData.dataMenu["DATA.FI.TRD_SWITCH_BILL_DATE"].isSee==true) {
							//三程换单日期
							if(!_this.isNullData(orderNewMsg.TRD_SWITCH_BILL_DATE)){
								nodeList.push({
									dateDesc:_this.businessDesc.TRD_SWITCH_BILL_DATE,
									date:orderNewMsg.TRD_SWITCH_BILL_DATE,
									upTime:orderNewMsg.TRD_SWITCH_BILL_DATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.TRD_SWITCH_BILL_DATE_CHAIN_TIME),
									detailData:[{key:_this.businessDesc.TRD_SWITCH_AGENCY_NAME, value:orderNewMsg.TRD_SWITCH_AGENCY_NAME}]
								});
							}
						}
                        nodeRightList.push(nodeList);
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.customs'):{
                        let nodeList = [];
                        //取最晚一条报关记录
						let cusObj = getRecentlyDataFromList('FXDATE',orderNewMsg.DECLARATION_LIST);
						if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.FXDATE"].isSee==true) {
							//通关货物放行日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.FXDATE"],
								date:cusObj.FXDATE,
								upTime:cusObj.FXDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.FXDATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.KDATE"].isSee==true) {
							//担保放行日期
							if(!_this.isNullData(cusObj.KDATE)){
								nodeList.push({
									dateDesc:_this.businessDesc["DECLARATION_LIST.KDATE"],
									date:cusObj.KDATE,
									upTime:cusObj.KDATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(cusObj.KDATE_CHAIN_TIME),
								});
							}
						}
                        
                        //当“报关单口岸查验”或者“报关单目的地查验”的栏位显示“有”时，才显示“计划查验日期”和“实际查验日期”
                        let isHGCY_STATUSHave = !_this.isNullData(orderNewMsg.HGCY_STATUS);
                        let isSJSTATUSHave = !_this.isNullData(orderNewMsg.SJSTATUS);
                        if(isHGCY_STATUSHave==true || isSJSTATUSHave==true){
							if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.INSPECTION_DATE"].isSee==true) {
								//实际查验日期
								nodeList.push({
									dateDesc:_this.businessDesc["DECLARATION_LIST.INSPECTION_DATE"],
									date:cusObj.INSPECTION_DATE,
									upTime:cusObj.INSPECTION_DATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(cusObj.INSPECTION_DATE_CHAIN_TIME),
								});
							}
							if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.SCHEDULE_DATE"].isSee==true) {
								//计划查验日期
								nodeList.push({
									dateDesc:_this.businessDesc["DECLARATION_LIST.SCHEDULE_DATE"],
									date:cusObj.SCHEDULE_DATE,
									upTime:cusObj.SCHEDULE_DATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(cusObj.SCHEDULE_DATE_CHAIN_TIME),
								});
							}
                        }
						if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.BDATE"].isSee==true) {
							//海关查验通知日期
							if(!_this.isNullData(cusObj.BDATE)){
								nodeList.push({
									dateDesc:_this.businessDesc["DECLARATION_LIST.BDATE"],
									date:cusObj.BDATE,
									upTime:cusObj.BDATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(cusObj.BDATE_CHAIN_TIME),
								});
							}
						}
                        if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.TAXDATE"].isSee==true) {
							//付税放行日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.TAXDATE"],
								date:cusObj.TAXDATE,
								upTime:cusObj.TAXDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.TAXDATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.JDATE"].isSee==true) {
							//大通关放行日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.JDATE"],
								date:cusObj.JDATE,
								upTime:cusObj.JDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.JDATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.SBDATE"].isSee==true) {
							//申报日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.SBDATE"],
								date:cusObj.SBDATE,
								upTime:cusObj.SBDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.SBDATE_CHAIN_TIME),
							});
						}
                        
                        //和客户确认报关信息日期
                        // nodeList.push({
                        //     dateDesc:_this.$i18n.t('message.businessSearch.dateOfConfirmation'),//_this.businessDesc["DECLARATION_LIST.KDATE"],
                        //     date:"",//cusObj.KDATE,
                        //     upTime:"",
                        //     timestamp:"",
                        // });
                        nodeRightList.push(nodeList);
                    }
                        break;
                    // case "辅检":{
                    //     let nodeList = [];
                    //     //辅检放行日期
                    //     nodeList.push({
                    //         dateDesc:_this.$i18n.t('message.businessSearch.releaseDateOfCIQ'),
                    //         date:"",//_this.orderMsg.DZQQ_DATE,
                    //         upTime:"",
                    //         timestamp:"",
                    //     });
                    //     //检验检疫反馈日期
                    //     let obj = getRecentlyDataFromList('SDATE',orderMsg.DECLARATION_LIST);
                    //     nodeList.push({
                    //         dateDesc:_this.businessDesc["DECLARATION_LIST.SDATE"],
                    //         date:obj.SDATE,
                    //         upTime:obj.SDATE_CHAIN_TIME,
                    //         timestamp:_this.timeStrToTimestamp(obj.SDATE_CHAIN_TIME),
                    //     });
                    //     nodeRightList.push(nodeList);
                    // }
                    //     break;
                    case this.$i18n.t('message.businessSearch.trans'):{
                        nodeRightList = getTransDataList(_this.businessDesc, orderNewMsg,_this.isYuanChuAcc,_this.order_type,_this.perssionData);
                        return nodeRightList;
                    }
                        break;
                    // case "主检":{
                    //     let nodeList = [];
                    //     //主检放行日期
                    //     if(!this.isNullData(orderNewMsg.SJ_DATE2)){
                    //         nodeList.push({
                    //             dateDesc:_this.businessDesc.SJ_DATE2,
                    //             date:orderNewMsg.SJ_DATE2,
                    //             upTime:orderNewMsg.SJ_DATE2_CHAIN_TIME,
                    //             timestamp:_this.timeStrToTimestamp(orderNewMsg.SJ_DATE2_CHAIN_TIME),
                    //         });
                    //     }
                    //     nodeRightList.push(nodeList);
                    // }
                    //     break;
                    default:
                        break;
                }
            }else{
                switch (nodeName) {
                    case this.$i18n.t('message.businessSearch.order'):{
						let nodeList = [];
						if (_this.perssionData.dataMenu['DATA.FE.DZQQ_DATE'].isSee==true) {
							//单证齐全日期
							nodeList.push({
								dateDesc:_this.businessDesc.DZQQ_DATE,
								date:orderNewMsg.DZQQ_DATE,
								upTime:orderNewMsg.DZQQ_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.DZQQ_DATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu['DATA.FE.RECE_DOC_DATE'].isSee==true) {
							//单证收到日期
							nodeList.push({
								dateDesc:_this.businessDesc.RECE_DOC_DATE,
								date:orderNewMsg.RECE_DOC_DATE,
								upTime:orderNewMsg.RECE_DOC_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.RECE_DOC_DATE_CHAIN_TIME),
							});
						}
                        
                        if(_this.isYuanChuAcc != '1'){
							if (_this.perssionData.dataMenu['DATA.FE.MODIFY_TIME'].isSee==true) {
								//修改时间
								nodeList.push({
									dateDesc:_this.businessDesc.MODIFY_TIME,
									date:orderNewMsg.MODIFY_TIME,
									upTime:orderNewMsg.MODIFY_TIME_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.MODIFY_TIME_CHAIN_TIME),
									detailData:[{key:_this.businessDesc.MODIFY_BY, value:orderNewMsg.MODIFY_BY}]
								});
							}
                            if (_this.perssionData.dataMenu['DATA.FE.CREATE_TIME'].isSee==true) {
								//创建时间
								nodeList.push({
									dateDesc:_this.businessDesc.CREATE_TIME,
									date:orderNewMsg.CREATE_TIME,
									upTime:orderNewMsg.CREATE_TIME_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.CREATE_TIME_CHAIN_TIME),
									detailData:[{key:_this.businessDesc.CREATE_BY, value:orderNewMsg.CREATE_BY}]
								});
							}
                            if (_this.perssionData.dataMenu['DATA.FE.ACCEPT_DATE'].isSee==true) {
								//客户委托日期
								nodeList.push({
									dateDesc:_this.businessDesc.ACCEPT_DATE,
									date:orderNewMsg.ACCEPT_DATE,
									upTime:orderNewMsg.ACCEPT_DATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(orderNewMsg.ACCEPT_DATE_CHAIN_TIME),
								});
							}
                        }
                        nodeRightList.push(nodeList);
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.booking'):{
						let nodeList = [];
						if (_this.perssionData.dataMenu['DATA.FE.BL_CONFIRM_DATE'].isSee==true) {
							//提单确认日期
							nodeList.push({
								dateDesc:_this.businessDesc.BL_CONFIRM_DATE,
								date:orderNewMsg.BL_CONFIRM_DATE,
								upTime:orderNewMsg.BL_CONFIRM_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.BL_CONFIRM_DATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu['DATA.FE.BOOKING_DATE'].isSee==true) {
							//订舱日期
							nodeList.push({
								dateDesc:_this.businessDesc.BOOKING_DATE,
								date:orderNewMsg.BOOKING_DATE,
								upTime:orderNewMsg.BOOKING_DATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(orderNewMsg.BOOKING_DATE_CHAIN_TIME),
								detailData:[{key:_this.businessDesc.BOOKING_AGENCY_NAME, value:orderNewMsg.BOOKING_AGENCY_NAME}]
							});
						}
                        nodeRightList.push(nodeList);
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.customs'):{
                        let nodeList = [];
                        //取最晚一条报关记录
						let cusObj = getRecentlyDataFromList('FXDATE',orderNewMsg.DECLARATION_LIST);
						if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.FXDATE'].isSee==true) {
							//通关货物放行日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.FXDATE"],
								date:cusObj.FXDATE,
								upTime:cusObj.FXDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.FXDATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.BDATE'].isSee==true) {
							//海关查验通知日期
							if(!_this.isNullData(cusObj.BDATE)){
								nodeList.push({
									dateDesc:_this.businessDesc["DECLARATION_LIST.BDATE"],
									date:cusObj.BDATE,
									upTime:cusObj.BDATE_CHAIN_TIME,
									timestamp:_this.timeStrToTimestamp(cusObj.BDATE_CHAIN_TIME),
								});
							}
						}
                        if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.JDATE'].isSee==true) {
							//大通关放行日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.JDATE"],
								date:cusObj.JDATE,
								upTime:cusObj.JDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.JDATE_CHAIN_TIME),
							});
						}
                        if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.SBDATE'].isSee==true) {
							//申报日期
							nodeList.push({
								dateDesc:_this.businessDesc["DECLARATION_LIST.SBDATE"],
								date:cusObj.SBDATE,
								upTime:cusObj.SBDATE_CHAIN_TIME,
								timestamp:_this.timeStrToTimestamp(cusObj.SBDATE_CHAIN_TIME),
							});
						}
                        
                        //和客户确认报关信息日期
                        // nodeList.push({
                        //     dateDesc:_this.$i18n.t('message.businessSearch.dateOfConfirmation'),//_this.businessDesc["DECLARATION_LIST.KDATE"],
                        //     date:"",//cusObj.KDATE,
                        //     upTime:"",
                        //     timestamp:"",
                        // });
                        nodeRightList.push(nodeList);
                    }
                        break;
                    case this.$i18n.t('message.businessSearch.trans'):{
                        nodeRightList = getTransDataList(_this.businessDesc, orderNewMsg,_this.isYuanChuAcc,_this.order_type,_this.perssionData);
                        return nodeRightList;
                    }
                        break;
                    default:
                        break;
                }
            }
            
            return nodeRightList;
        },
        /**
         * 获取订单详情
         */
        getOrderDetail(){
            let _this = this;

            if(_this.isNullData(_this.order_no)){
                this.$message.error(_this.$i18n.t('message.businessSearch.orderNoNullAlert'));
                return;
            }

            let data = {
                order_no:_this.order_no
            }

            _this.loading = true;
            getBusinessOrderDetail(data,{}).then(res=>{
                _this.loading = false;
                if (res.data.code === 0) {
                    console.log("获取订单详情res...", res);
                    try {
                        if(!_this.isNullData(res.data.data.row_data) && !_this.isNullData(res.data.data.row_data.ORDER_NO)){
							let orderResultMsg = res.data.data.row_data;
							orderResultMsg.chain_time = res.data.data.chain_time;
							let timeStr = orderResultMsg.chain_time;  
							orderResultMsg.chain_timestamp = _this.timeStrToTimestamp(timeStr);
							
                         _this.orderMsg = JSON.parse(JSON.stringify(orderResultMsg));
							console.log("timeStr...", timeStr);
							console.log("_this.orderMsg...", _this.orderMsg);

							let orderNewMsg = JSON.parse(JSON.stringify(_this.orderMsg));

                            //获取流程进程列表数据
                            _this.flowCourseList = [];
                            _this.flowCourseList = _this.getFlowCourseList(orderNewMsg);

                            //获取所有事件列表数据
                            _this.allEventList = [];
							_this.allEventList = getAllEventList(_this.businessDesc, orderNewMsg, _this.isYuanChuAcc, _this.order_type,_this.perssionData);
							
							console.log("_this.flowCourseList...", _this.flowCourseList);
							console.log("_this.allEventList...", _this.allEventList);
                        }else{
                            _this.orderMsg = null;
                            _this.flowCourseList = [];
                            _this.allEventList = [];
                            // this.$message({
                            //     type: "error",
                            //     message: message
                            // });
                        }
                        
                    } catch (error) {
                        console.log("trycatch...", error);
                        _this.orderMsg = null;
                        _this.flowCourseList = [];
                        _this.allEventList = [];
                    }
                    
                } else {
					_this.orderMsg = null;
                    _this.flowCourseList = [];
                    _this.allEventList = [];
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).catch(err=>{
                this.loading = false;
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
        /**
         * 获取业务描述字段信息
         */
        getBusDesc(){
            let _this = this;
            let params = {
                ORDER_TYPE:_this.order_type
            };
            getBusinessDesc(params).then(res => {
                if (res.data.code === 0) {
                    let dataDesc = res.data.data;
                    //存储业务字段描述信息
                    _this.businessDesc = dataDesc;
					localStorage.setItem("BusinessDesc", JSON.stringify(_this.businessDesc));
					
					/**
					 * 获取订单详情
					 */
					_this.getOrderDetail();
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
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
        /**
         * 进入报关单详情
         */
        goCusNoDetail(billNum){
			this.cus_no = billNum;

			if (this.order_type != 'FE') {
				if (this.perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_06"].isSee) {
					this.handleSelect('5');
				}
			} else {
				if (this.perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_06"].isSee) {
					this.handleSelect('5');
				}
			}
			
        },
        handleSelect:function(val) {
            this.activeIndex = val;
            if(val == 2){
                
			}
			Bus.$emit("menuChange")
		},
		
		changeCusNo(billNum){
			this.cus_no = billNum;
		},
    }
};
</script>
<style scoped>
    .developing{
        width: 100%;
        height: 400px;
        /* background-color: rgb(250, 250, 250); */
        color:lightgray;
        text-align: center;
        display: inline-block;
        position: relative;
        /* align-items: center;
        justify-content: center; */
        
    }
    .el-menu.el-menu--horizontal{
        background-color: #fff;
    }
</style>

