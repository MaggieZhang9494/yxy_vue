
<template>
<!-- style="height: 800px;overflow:auto;overflow-x:hidden;" -->
    <div style="position: relative;width:100%">
        <div v-if="orderType=='FI'" class="customsStatistics">
            <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_NUM'].isSee==true" class="statistics-title">{{$t('message.businessDetail.customsNums')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_NUM'].isUse==true" class="title-content">{{perssionData.dataMenu['DATA.FI.DECLARATION_NUM'].isUse?(orderMsg.CALCULATE_DECLARATION_COUNT?orderMsg.CALCULATE_DECLARATION_COUNT:customsList.length):""}}</span>
			<span v-if="perssionData.dataMenu['DATA.FI.CARGO_NAME_NUM'].isSee==true" class="statistics-title">{{$t('message.businessDetail.totalNumOfGoods')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FI.CARGO_NAME_NUM'].isUse==true" class="title-content">{{perssionData.dataMenu['DATA.FI.CARGO_NAME_NUM'].isUse?(orderMsg.CARGO_NAME_NUM?orderMsg.CARGO_NAME_NUM:totalNumName):""}}</span>
            <span v-if="perssionData.dataMenu['DATA.FI.CARGO_NUM'].isSee==true" class="statistics-title">{{$t('message.businessDetail.orderTotalNums')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FI.CARGO_NUM'].isUse==true" class="title-content">{{orderMsg.CARGO_NUM}}</span>
            <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true" class="statistics-title">{{$t('message.businessDetail.number')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isUse==true" class="title-content">{{orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_QUANTITY?orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_QUANTITY:""}}</span>
            <span v-if="totalTitle != ''" class="statistics-title">{{totalTitle}}：</span>
            <span v-if="totalTitle != ''" class="title-content">{{totalPrice}}</span>
        </div>
		<div v-else class="customsStatistics">
            <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_NUM'].isSee==true" class="statistics-title">{{$t('message.businessDetail.customsNums')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_NUM'].isUse==true" class="title-content">{{orderMsg.CALCULATE_DECLARATION_COUNT?orderMsg.CALCULATE_DECLARATION_COUNT:customsList.length}}</span>
			<span v-if="perssionData.dataMenu['DATA.FE.CARGO_NAME_NUM'].isSee==true" class="statistics-title">{{$t('message.businessDetail.totalNumOfGoods')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FE.CARGO_NAME_NUM'].isUse==true" class="title-content">{{orderMsg.CARGO_NAME_NUM?orderMsg.CARGO_NAME_NUM:totalNumName}}</span>
            <span v-if="perssionData.dataMenu['DATA.FE.CARGO_NUM'].isSee==true" class="statistics-title">{{$t('message.businessDetail.orderTotalNums')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FE.CARGO_NUM'].isUse==true" class="title-content">{{orderMsg.CARGO_NUM}}</span>
            <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true" class="statistics-title">{{$t('message.businessDetail.number')}}：</span>
            <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isUse==true" class="title-content">{{orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_QUANTITY?orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_QUANTITY:""}}</span>
            <span v-if="totalTitle != ''" class="statistics-title">{{totalTitle}}：</span>
            <span v-if="totalTitle != ''" class="title-content">{{totalPrice}}</span>
        </div>
        <div class="commonline" style="display: flex;width: auto;position: relative; margin: 0px 10px 0px 10px;" ></div>
        <div v-if="isShowList==true" class="search-item" style="display: inline-block;margin-left: 10px;">
            <span>{{$t('message.businessDetail.cus_no')}}：</span>
            <el-input
                size="mini"
                class="inputStyle"
                v-model="searchKeyCusNo"
				@clear="clear"
                clearable>
            </el-input>
            <div style="display: inline-block;margin-left: 15px;">
                <el-button type="primary" size="small" @click="filtrate()">{{$t('message.common.filtrate')}}</el-button>
            </div>
        </div>
        <div v-if="isShowList==true" class="commonline" style="display: flex;width: auto;position: relative; margin: 0px 10px 0px 10px;" ></div>
        <div v-if="isShowList==true && orderType==='FI'" class="customs-table">
            <el-table :data="customsList" highlight-current-row @row-click="clickTable" ref="refTable" tooltip-effect="light" v-loading="loading">
                <el-table-column type="expand" width="1">
                    <template slot-scope="scope">
                        <v-customlist-detail :declaration="scope.row" :orderMsg="orderMsg" 
						:businessDesc="businessDesc" :orderType="orderType" :index="scope.$index"
						:isSpread="scope.row.isSpread" @touchSpread="touchSpread" 
						:isCargoSpread="scope.row.isCargoSpread" :perssionData="perssionData" @touchCargoSpread="touchCargoSpread" ></v-customlist-detail>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    :label="$t('message.businessSearch.number')"
                    :width="numberWidth">
                    <template slot-scope="scope">
                        <span>{{scope.row['number']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CUS_NO'].isSee==true"
                    align="left"
                    :label="$t('message.businessDetail.cus_no')"
                    >
                    <template slot-scope="scope">
                        <span style="color: #1585FF;cursor:pointer;">{{scope.row['CUS_NO']}}</span>
                    </template>
                </el-table-column>
				<el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee==true"
                    align="left"
                    :label="$t('message.businessDetail.numOfGoods')"
                    >
                    <template slot-scope="scope">
                        <span >{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isUse?scope.row['goodsNums']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CARGO_NUM'].isSee==true"
                    align="left"
                    :label="$t('message.businessSearch.cases')"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row['cases']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true"
                    align="left"
                    :label="$t('message.businessDetail.number')"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row['numbers']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true || perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true"
                    align="left"
                    :label="totalTitle">
                    <template slot-scope="scope">
                        <span>{{scope.row['totalPrice']}}</span>
                    </template>
                </el-table-column>
            </el-table>      
            <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>       -->
        </div>
		<div v-if="isShowList==true && orderType==='FE'" class="customs-table">
            <el-table :data="customsList" highlight-current-row @row-click="clickTable" ref="refTable" tooltip-effect="light" v-loading="loading">
                <el-table-column type="expand" width="1">
                    <template slot-scope="scope">
                        <v-customlist-detail :declaration="scope.row" :orderMsg="orderMsg" 
						:businessDesc="businessDesc" :orderType="orderType" :index="scope.$index"
						:isSpread="scope.row.isSpread" @touchSpread="touchSpread" 
						:isCargoSpread="scope.row.isCargoSpread" :perssionData="perssionData" @touchCargoSpread="touchCargoSpread" ></v-customlist-detail>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    :label="$t('message.businessSearch.number')"
                    :width="numberWidth">
                    <template slot-scope="scope">
                        <span>{{scope.row['number']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CUS_NO'].isSee==true"
                    align="left"
                    :label="$t('message.businessDetail.cus_no')"
                    >
                    <template slot-scope="scope">
                        <span style="color: #1585FF;cursor:pointer;">{{scope.row['CUS_NO']}}</span>
                    </template>
                </el-table-column>
				<el-table-column
					v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee==true"
                    align="left"
                    :label="$t('message.businessDetail.numOfGoods')"
                    >
                    <template slot-scope="scope">
                        <span >{{perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isUse?scope.row['goodsNums']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CARGO_NUM'].isSee==true"
                    align="left"
                    :label="$t('message.businessSearch.cases')"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row['cases']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true"
                    align="left"
                    :label="$t('message.businessDetail.number')"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row['numbers']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true || perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true"
                    align="left"
                    :label="totalTitle">
                    <template slot-scope="scope">
                        <span>{{scope.row['totalPrice']}}</span>
                    </template>
                </el-table-column>
            </el-table>      
            <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>       -->
        </div>
        <!-- <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div> -->
    </div>
</template>
<script>
import customStep from "../components/customStep";
import flowTimeLine from "../components/flow_timeline";
import customListDetail from "../components/customListDetail";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";
import Bus from "@/bus"
import { getCustomsListIsShow } from '@/util/role/menuDataShowDeal'

export default {
    name: "flowCourse",
    components: {
        "v-custom-step":customStep,
        "v-flow-timeline":flowTimeLine,
        "v-customlist-detail":customListDetail,
    },
    props:{
        orderMsg:{
            type:Object,
            default:()=>{
                return {};
            }
        },
        businessDesc:{
            type:Object,
            default:()=>{
                return {};
            }
        },
        orderType:{
            type:String,
            default:""
        },
        cus_no:{
            type:String,
            default:""
        }
    },
    data: function() {
        return {
            searchKeyCusNo:"",
            loading:false,
            currentPage: 1,
            pageSize: 10,
			total: 0,
			
			totalTitle:"",//总价/币制 左侧标题显示
			totalPrice:"",//总价/币制
			totalNumName:0,//品名总数
            
            customsList:[
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // },
                // {
                //     cus_no:"324523452354345354",
                //     cases:2344,
                //     numbers:3456,
                //     totalPrice:"1342434人民币、3456美元"
                // }
            ],//报关单列表

            //列表视图对应列的宽度
            numberWidth:50,//序号
            customsWidth:200,//报关单号
			nameWidth:150,//件数、数量
			
			perssionData:{},
			isShowList:false,//是否显示报关单列表
        };
    },
    created:function(){

		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))
		this.isShowList = getCustomsListIsShow(this.orderType,this.perssionData);

		console.log("this.orderType....", this.orderType);

        //如果外部传入报关单号，则进行筛选
        if (this.cus_no) {
            this.searchKeyCusNo = this.cus_no;
		}

		//处理总价币制显示
		if (this.orderType=='FI') {
			if(this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true && this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true){
				this.totalTitle = this.$i18n.t('message.businessDetail.totalPrice_Currency');
			}else if(this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true && this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==false){
				this.totalTitle = this.$i18n.t('message.businessDetail.totalPrice');
			}else if(this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==false && this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true){
				this.totalTitle = this.$i18n.t('message.businessDetail.currency');
			}else{
				this.totalTitle = "";
			}
			//总价/币制
			let priceArr = [];
			if (this.orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_DECL_AND_CURR_NAME) {
				this.orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_DECL_AND_CURR_NAME.forEach((element,index) => {
					let priceStr = "";
					if(this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
						priceStr = element.DECL_TOTAL+element.CURR_NAME;
					}else if(this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==false){
						priceStr = element.DECL_TOTAL;
					}else if(this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==false && this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
						priceStr = element.CURR_NAME;
					}else{
						priceStr = "";
					}
					if (priceStr != "") {
						priceArr.push(priceStr);
					}
				});
			}
			this.totalPrice = priceArr.join("、");
		} else {
			if(this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true && this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true){
				this.totalTitle = this.$i18n.t('message.businessDetail.totalPrice_Currency');
			}else if(this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true && this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==false){
				this.totalTitle = this.$i18n.t('message.businessDetail.totalPrice');
			}else if(this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==false && this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true){
				this.totalTitle = this.$i18n.t('message.businessDetail.currency');
			}else{
				this.totalTitle = "";
			}
			//总价/币制
			let priceArr = [];
			if (this.orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_DECL_AND_CURR_NAME) {
				this.orderMsg.CALCULATE_DECLARATION_ITEM_TOTAL_DECL_AND_CURR_NAME.forEach((element,index) => {
					let priceStr = "";
					if(this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
						priceStr = element.DECL_TOTAL+element.CURR_NAME;
					}else if(this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==false){
						priceStr = element.DECL_TOTAL;
					}else if(this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==false && this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
						priceStr = element.CURR_NAME;
					}else{
						priceStr = "";
					}
	
					if (priceStr != "") {
						priceArr.push(priceStr);
					}
				});
			}
			this.totalPrice = priceArr.join("、");
		}

		//品名总数
		let totalNum = 0;
		if (this.orderMsg.DECLARATION_LIST) {
			this.orderMsg.DECLARATION_LIST.forEach((element,index) => {
				if (element.DECLARATION_ITEM_LIST) {
					totalNum += element.DECLARATION_ITEM_LIST.length;
				}
			});
		}
		this.totalNumName = totalNum;
		console.log("this.orderMsg...",this.orderMsg);

		this.searchCustomMsg(this.searchKeyCusNo);
    },
    mounted: function() {
        this.dealZH_EN();
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){
            if(localStorage.getItem("internationalization") == 'zh-cn'){ /* 中文版本 */
                this.numberWidth=50;
                this.customsWidth=150;
                this.nameWidth=100;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;
                this.customsWidth=200;
                this.nameWidth=150;
            }else{
                this.numberWidth=50;
                this.customsWidth=150;
                this.nameWidth=100;
            }
        },
        /**
         * 根据搜索key获取报关单列表
         */
        searchCustomMsg:function(searchKey){
			let _this = this;
			_this.customsList = [];
			if (!_this.isShowList) {
				return;
			}
			let orderCopyMsg = JSON.parse(JSON.stringify(this.orderMsg));

            if (_this.isNullData(searchKey)) {
				if (orderCopyMsg.DECLARATION_LIST) {
					orderCopyMsg.DECLARATION_LIST.forEach((element,index) => {
						let newElement = JSON.parse(JSON.stringify(element));
						newElement.number = index+1;
						newElement.goodsNums = element.DECLARATION_ITEM_LIST?element.DECLARATION_ITEM_LIST.length:0; //品名个数
						newElement.cases = element.CARGO_NUM; //件数
						newElement.numbers = element.CALCULATE_TOTAL_QUANTITY; //数量，需要计算
						newElement.isSpread = false;
						newElement.isCargoSpread = true;
						//总价、币制，需要计算
						let priceArr = [];
						if (element.CALCULATE_TOTAL_DECL_AND_CURR_NAME) {
							element.CALCULATE_TOTAL_DECL_AND_CURR_NAME.forEach((element,index) => {
								let priceStr = "";
								if (_this.orderType=='FI') {
									if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.DECL_TOTAL+element.CURR_NAME;
									}else if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==false){
										priceStr = element.DECL_TOTAL;
									}else if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==false && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.CURR_NAME;
									}else{
										priceStr = "";
									}
								} else {
									if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.DECL_TOTAL+element.CURR_NAME;
									}else if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==false){
										priceStr = element.DECL_TOTAL;
									}else if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==false && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.CURR_NAME;
									}else{
										priceStr = "";
									}
								}
								if (priceStr != "") {
									priceArr.push(priceStr);
								}
							});
						}
						newElement.totalPrice = priceArr.join("、"); 

						this.customsList.push(newElement);
					});
					console.log("this.customsList...",this.customsList);
					return;
				}
				
            }

			let index = 0;
			if (orderCopyMsg.DECLARATION_LIST) {
				orderCopyMsg.DECLARATION_LIST.forEach(element => {
					if(element.CUS_NO.indexOf(searchKey) > -1){
						index++;
						let newElement = JSON.parse(JSON.stringify(element));
						newElement.number = index;
						newElement.cases = element.CARGO_NUM; //件数
						newElement.goodsNums = element.DECLARATION_ITEM_LIST?element.DECLARATION_ITEM_LIST.length:0; //品名个数
						newElement.numbers = element.CALCULATE_TOTAL_QUANTITY; //数量，需要计算
						newElement.isSpread = false;
						newElement.isCargoSpread = true;
						//总价、币制，需要计算
						let priceArr = [];
						if (element.CALCULATE_TOTAL_DECL_AND_CURR_NAME) {
							element.CALCULATE_TOTAL_DECL_AND_CURR_NAME.forEach((element,index) => {
								let priceStr = "";
								if (_this.orderType=='FI') {
									if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.DECL_TOTAL+element.CURR_NAME;
									}else if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==false){
										priceStr = element.DECL_TOTAL;
									}else if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==false && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.CURR_NAME;
									}else{
										priceStr = "";
									}
								} else {
									if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.DECL_TOTAL+element.CURR_NAME;
									}else if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==true && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==false){
										priceStr = element.DECL_TOTAL;
									}else if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isUse==false && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isUse==true){
										priceStr = element.CURR_NAME;
									}else{
										priceStr = "";
									}
								}
								if (priceStr != "") {
									priceArr.push(priceStr);
								}
							});
						}
						newElement.totalPrice = priceArr.join("、"); 
						this.customsList.push(newElement);
					}
				});
			}
            
        },
        /**
         * 筛选
         */
        filtrate:function(){
            this.customsList = [];
            this.searchCustomMsg(this.searchKeyCusNo);
		},
		/**
         * 表头点击展开或收缩
         */
		touchSpread:function(index) {
			let obj = this.customsList[index];
			obj.isSpread = !obj.isSpread;
		},
		/**
         * 货物信息点击展开或收缩
         */
		touchCargoSpread:function(index) {
			let obj = this.customsList[index];
			obj.isCargoSpread = !obj.isCargoSpread;
		},
        clickTable(row,index,e){
			   this.$refs.refTable.toggleRowExpansion(row)
			   Bus.$emit("menuChange")
        },

        handleSizeChange: function(val) {
            this.pageSize = val;
            this.currentPage = 1;
            // this.getAccList();
        },
        handleCurrentChange: function(val) {
            this.currentPage = val;
            // this.getAccList();
		},
		clear(){
			this.searchKeyCusNo = "";
			this.$emit('change', "");
		}
    }
};
</script>
<style scoped>
    .customsStatistics{
        position:relative;
        height: 40px;
        margin: 10px 10px;
        background-color: #eaf8ff;
        white-space: nowrap;
    }
    .statistics-title{
        position: relative;
        margin-left: 10px;
        line-height: 40px;
    }
    .title-content{
        position: relative;
        margin-right: 5px;
        color: orange;
        line-height: 40px;
    }

    .search-item {
        display: inline-block;
        margin: 10px;
        height: 30px;
    }
    .search-item > span {
        margin-right: 0px;
    }
    .inputStyle{
        position: relative;
        width:200px;
    }

    .customs-table{
        margin: 0px 10px 10px 10px;
        padding-bottom: 15px;
    }
    .el-table /deep/ .el-table__expand-icon>.el-icon{
        visibility:hidden;
    }
</style>

