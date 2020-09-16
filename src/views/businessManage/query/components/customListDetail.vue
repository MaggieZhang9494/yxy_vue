
<template>
<!-- style="height: 800px;overflow:auto;overflow-x:hidden;" -->
    <div style="position: relative;width:100%;">
        <div class="customContent">
            <div v-if="orderType=='FI'" class="customTitle">
                <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.PRE_NO'].isSee==true" class="statistics-title">{{$t('message.businessDetail.pre_entryNumber')}}：</span>
                <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.PRE_NO'].isSee==true" class="title-content">{{declaration.PRE_NO}}</span>
                <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CUS_NO'].isSee==true" class="statistics-title">{{$t('message.businessDetail.customsSerialNumber')}}：</span>
				<!-- 海关编号就是报关单号 -->
                <span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CUS_NO'].isSee==true" class="title-content">{{declaration.CUS_NO}}</span> 
				<el-button class="title-spread" size="small" type="text" @click="touchSpread()">{{isSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
            </div>
			<div v-else class="customTitle">
                <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.PRE_NO'].isSee==true" class="statistics-title">{{$t('message.businessDetail.pre_entryNumber')}}：</span>
                <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.PRE_NO'].isSee==true" class="title-content">{{declaration.PRE_NO}}</span>
                <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CUS_NO'].isSee==true" class="statistics-title">{{$t('message.businessDetail.customsSerialNumber')}}：</span>
				<!-- 海关编号就是报关单号 -->
                <span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.CUS_NO'].isSee==true" class="title-content">{{declaration.CUS_NO}}</span> 
				<el-button class="title-spread" size="small" type="text" @click="touchSpread()">{{isSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
            </div>
			<div >
				<div class="commonline" v-show="!isSpread"></div>
				<div class="customSingleDetail" :style="{'padding-bottom': (perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee==false || isShowGoodList==false)?'15px':''}" v-show="isSpread">
					<v-custom-msgshow :declaration="declaration" :showData="orderMsg" :showKeyDesc="businessDesc" :orderType="orderType"></v-custom-msgshow>
				</div>
				<div v-if="orderType=='FI' && perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee==true && isShowGoodList==true">
					<div class="customTitle">
						<span class="statistics-title">{{$t('message.businessDetail.cargoInfo')}}</span>
						<el-button class="title-spread" size="small" type="text" @click="touchCargoSpread()">{{isCargoSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isCargoSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
					</div>
					<div class="goods-table" v-show="isCargoSpread">
						<el-table :data="goodsList" 
						:row-style="{height:0+'px'}" 
						:cell-style="{'padding-top':10+'px','padding-bottom':10+'px',}" stripe tooltip-effect="light" v-loading="loading">
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SEQ_NO'].isSee==true"
								align="left"
								:label="$t('message.businessSearch.number')"
								:width="numberWidth">
								<template slot-scope="scope">
									<span>{{scope.row['SEQ_NO']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.HS_CODE'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.goodsSerialNumber')"
								:width="goodsSerialNumWidth">
								<template slot-scope="scope">
									<span>{{scope.row['HS_CODE']}}</span>
									</template>
							</el-table-column>
							<el-table-column
								v-if="goodsNameTitle!=''"
								align="left"
								:label="goodsNameTitle"
								:width="nameWidth">
								<template slot-scope="scope">
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true">{{scope.row['GOODS_NAME']}}</span><br v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true">
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==true">{{scope.row['ELEMENT']}}</span>
									<!-- <span class="leftCell" v-for="(item, index) in scope.row['goodsModel']" :key="index" >{{item}}</span> -->
								</template>
							</el-table-column>
							<el-table-column
								v-if="numUnitTitle!=''"
								align="left"
								:label="numUnitTitle"
								:width="goodNumWidth">
								<template slot-scope="scope">
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true">{{scope.row['QUANTITY']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee==true">{{scope.row['UNIT_NAME']}}</span><br v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee==true">
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_QUANTITY'].isSee==true">{{scope.row['FIRST_QUANTITY']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee==true">{{scope.row['FIRST_UM_NAME']}}</span><br v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee==true">
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_QUANTITY'].isSee==true">{{scope.row['SECOND_QUANTITY']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_UM_NAME'].isSee==true">{{scope.row['SECOND_UM_NAME']}}</span>
									<!-- <span class="leftCell" v-for="(item, index) in scope.row['prices']" :key="index" >{{item}}</span> -->
								</template>
							</el-table-column>
							<el-table-column
								v-if="priceCurrencyTitle!=''"
								align="right"
								:label="priceCurrencyTitle"
								:width="goodsPriceWidth">
								<template slot-scope="scope">
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_PRICE'].isSee==true" class="rightCell">{{scope.row['DECL_PRICE']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true" class="rightCell">{{scope.row['DECL_TOTAL']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true" class="rightCell">{{scope.row['CURR_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ORIGIN_COUNTRY_NAME'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.originCountry')"
								:width="originCountryWidth">
								<template slot-scope="scope">
									<span>{{scope.row['ORIGIN_COUNTRY_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DEST_COUNTRY_NAME'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.destCountry')"
								:width="destCountryWidth">
								<template slot-scope="scope">
									<span>{{scope.row['DEST_COUNTRY_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DISTRICT_NAME'].isSee==true"
								align="left"
								:label="orderType!='FE'?$t('message.businessDetail.domesticDestination'):$t('message.businessDetail.domesticSource')"
								:width="omesticDestWidth">
								<template slot-scope="scope">
									<span>{{scope.row['DISTRICT_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.TAX_OPTION_NAME'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.shallBe')"
								:width="shallBeWidth">
								<template slot-scope="scope">
									<span>{{scope.row['TAX_OPTION_NAME']}}</span>
								</template>
							</el-table-column>
						</el-table>         
					</div>
				</div>
				<div v-if="orderType=='FE' && perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST'].isSee==true && isShowGoodList==true">
					<div class="customTitle">
						<span class="statistics-title">{{$t('message.businessDetail.cargoInfo')}}</span>
						<el-button class="title-spread" size="small" type="text" @click="touchCargoSpread()">{{isCargoSpread?$t('message.businessDetail.packup'):$t('message.businessDetail.spread')}}<i :class="[isCargoSpread?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></el-button>
					</div>
					<div class="goods-table" v-show="isCargoSpread">
						<el-table :data="goodsList" 
						:row-style="{height:0+'px'}" 
						:cell-style="{'padding-top':10+'px','padding-bottom':10+'px',}" stripe tooltip-effect="light" v-loading="loading">
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SEQ_NO'].isSee==true"
								align="left"
								:label="$t('message.businessSearch.number')"
								:width="numberWidth">
								<template slot-scope="scope">
									<span>{{scope.row['SEQ_NO']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.HS_CODE'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.goodsSerialNumber')"
								:width="goodsSerialNumWidth">
								<template slot-scope="scope">
									<span>{{scope.row['HS_CODE']}}</span>
									</template>
							</el-table-column>
							<el-table-column
								v-if="goodsNameTitle!=''"
								align="left"
								:label="goodsNameTitle"
								:width="nameWidth">
								<template slot-scope="scope">
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true">{{scope.row['GOODS_NAME']}}</span><br v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true">
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==true">{{scope.row['ELEMENT']}}</span>
									<!-- <span class="leftCell" v-for="(item, index) in scope.row['goodsModel']" :key="index" >{{item}}</span> -->
								</template>
							</el-table-column>
							<el-table-column
								v-if="numUnitTitle!=''"
								align="left"
								:label="numUnitTitle"
								:width="goodNumWidth">
								<template slot-scope="scope">
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true">{{scope.row['QUANTITY']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee==true">{{scope.row['UNIT_NAME']}}</span><br v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee==true">
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_QUANTITY'].isSee==true">{{scope.row['FIRST_QUANTITY']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee==true">{{scope.row['FIRST_UM_NAME']}}</span><br v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee==true">
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_QUANTITY'].isSee==true">{{scope.row['SECOND_QUANTITY']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_UM_NAME'].isSee==true">{{scope.row['SECOND_UM_NAME']}}</span>
									<!-- <span class="leftCell" v-for="(item, index) in scope.row['prices']" :key="index" >{{item}}</span> -->
								</template>
							</el-table-column>
							<el-table-column
								v-if="priceCurrencyTitle!=''"
								align="right"
								:label="priceCurrencyTitle"
								:width="goodsPriceWidth">
								<template slot-scope="scope">
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_PRICE'].isSee==true" class="rightCell">{{scope.row['DECL_PRICE']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee==true" class="rightCell">{{scope.row['DECL_TOTAL']}}</span>
									<span v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee==true" class="rightCell">{{scope.row['CURR_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ORIGIN_COUNTRY_NAME'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.originCountry')"
								:width="originCountryWidth">
								<template slot-scope="scope">
									<span>{{scope.row['ORIGIN_COUNTRY_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DEST_COUNTRY_NAME'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.destCountry')"
								:width="destCountryWidth">
								<template slot-scope="scope">
									<span>{{scope.row['DEST_COUNTRY_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DISTRICT_NAME'].isSee==true"
								align="left"
								:label="orderType!='FE'?$t('message.businessDetail.domesticDestination'):$t('message.businessDetail.domesticSource')"
								:width="omesticDestWidth">
								<template slot-scope="scope">
									<span>{{scope.row['DISTRICT_NAME']}}</span>
								</template>
							</el-table-column>
							<el-table-column
								v-if="perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.TAX_OPTION_NAME'].isSee==true"
								align="left"
								:label="$t('message.businessDetail.shallBe')"
								:width="shallBeWidth">
								<template slot-scope="scope">
									<span>{{scope.row['TAX_OPTION_NAME']}}</span>
								</template>
							</el-table-column>
						</el-table>         
					</div>
				</div>
			</div>
            
        </div>
        
        <!-- <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div> -->
    </div>
</template>
<script>
import customStep from "../components/customStep";
import flowTimeLine from "../components/flow_timeline";
import customMsgShow from "../components/customMsgShow";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";
import Bus from "@/bus"
import { getCustomsGoodListIsShow } from '@/util/role/menuDataShowDeal'

export default {
    name: "flowCourse",
    components: {
        "v-custom-step":customStep,
        "v-flow-timeline":flowTimeLine,
        "v-custom-msgshow":customMsgShow,
    },
    props:{
        //DECLARATION_LIST单条数据对象，key:value格式
        declaration:{
            type:Object,
        },
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
		//表头是否展开
		isSpread:{
			type:Boolean,
			default:false,
		},
		//货物信息是否展开
		isCargoSpread:{
			type:Boolean,
			default:true,
		},
		index:{
			type:Number,
			default:0
		},
		perssionData:{
            type:Object,
            default:()=>{
                return {};
            }
        },

    },
    data: function() {
        return {
            searchKeyCusNo:"",
            loading:false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            
            goodsList:[],//报关单列表

            //列表视图对应列的宽度
            numberWidth:50,//序号
            goodsSerialNumWidth:100,//商品编号
            nameWidth:250,//商品名称
            goodNumWidth:150,//商品数量
            goodsPriceWidth:100,//价格
            originCountryWidth:"",//原产国
            destCountryWidth:"",//最终目的国
            omesticDestWidth:"",//境内目的地
			shallBeWidth:"",//征免
			
			//商品名称及规格型号 显示标题
			goodsNameTitle:"",
			//数量及单位 显示标题
			numUnitTitle:"",
			//单价、总价、币制 显示标题
			priceCurrencyTitle:"",

			isShowGoodList:false,
            
        };
    },
    created:function(){
		console.log("declaration....",this.declaration);
		console.log("this.declaration.DECLARATION_ITEM_LIST....",this.declaration.DECLARATION_ITEM_LIST);
		if (!this.isNullData(this.declaration.DECLARATION_ITEM_LIST)) {
			this.goodsList = JSON.parse(JSON.stringify(this.declaration.DECLARATION_ITEM_LIST));
		}

		console.log("perssionData......", this.perssionData);

		this.isShowGoodList = getCustomsGoodListIsShow(this.orderType,JSON.parse(JSON.stringify(this.perssionData)));

		this.dealGoodListHeadTitle();
		
		console.log("goodsList....",this.goodsList);
		// this.declaration.DECLARATION_ITEM_LIST.map((item,index)=>{
		// 	// item.number = (this.currentPage-1)*this.pageSize+index+1;
		// 	item = JSON.parse(JSON.stringify(item));
		// 	console.log("item....",item);
        //     return item;
        // })
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
                this.numberWidth=50;//序号
                this.goodsSerialNumWidth=100;//商品编号
                this.nameWidth=250;//商品名称
                this.goodNumWidth=150;//商品数量
                this.goodsPriceWidth=100;//价格
                this.originCountryWidth='';//原产国
                this.destCountryWidth='';//最终目的国
                this.omesticDestWidth='';//境内目的地
                this.shallBeWidth='';//征免
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;//序号
                this.goodsSerialNumWidth=100;//商品编号
                this.nameWidth=270;//商品名称
                this.goodNumWidth=130;//商品数量
                this.goodsPriceWidth=220;//价格
                this.originCountryWidth=160;//原产国
                this.destCountryWidth=200;//最终目的国
                this.omesticDestWidth=150;//境内目的地
                this.shallBeWidth=150;//征免
            }else{
                this.numberWidth=50;//序号
                this.goodsSerialNumWidth=100;//商品编号
                this.nameWidth=250;//商品名称
                this.goodNumWidth=150;//商品数量
                this.goodsPriceWidth=100;//价格
                this.originCountryWidth='';//原产国
                this.destCountryWidth='';//最终目的国
                this.omesticDestWidth='';//境内目的地
                this.shallBeWidth='';//征免
            }
		},
		/**
		 * 处理商品列表显示标题
		 */
		dealGoodListHeadTitle (){
			let _this = this;
			if (_this.orderType=='FI') {
				//商品名称及规格型号
				if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==true){
					_this.goodsNameTitle = this.$i18n.t('message.businessDetail.goodsName');
				}else if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==false){
					_this.goodsNameTitle = this.$i18n.t('message.businessDetail.goodName');
				}else if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==false && _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==true){
					_this.goodsNameTitle = this.$i18n.t('message.businessDetail.specification');
				}else{
					_this.goodsNameTitle = "";
				}

				//数量及单位
				let isHaveNum = false;
				if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true || _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_QUANTITY'].isSee==true || _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_QUANTITY'].isSee==true){
					isHaveNum = true;
				}
				let isHaveUnit = false;
				if(_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee==true || _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee==true || _this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_UM_NAME'].isSee==true){
					isHaveUnit = true;
				}
				if(isHaveNum==true && isHaveUnit==true){
					_this.numUnitTitle = this.$i18n.t('message.businessDetail.goodsNum');
				}else if(isHaveNum && isHaveUnit==false){
					_this.numUnitTitle = this.$i18n.t('message.businessDetail.number');
				}else if(isHaveNum==false && isHaveUnit==true){
					_this.numUnitTitle = this.$i18n.t('message.businessDetail.unit');
				}else{
					_this.numUnitTitle = "";
				}

				//单价、总价、币制
				let pcArray = [];
				if (_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_PRICE'].isSee) {
					pcArray.push(_this.$i18n.t('message.businessDetail.unitPrice'));
				}
				if (_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee) {
					pcArray.push(_this.$i18n.t('message.businessDetail.totalPrice'));
				}
				if (_this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee) {
					pcArray.push(_this.$i18n.t('message.businessDetail.currency'));
				}
				if (pcArray.length>0) {
					_this.priceCurrencyTitle = pcArray.join("/");
				}

			} else {
				//商品名称及规格型号
				if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==true){
					_this.goodsNameTitle = this.$i18n.t('message.businessDetail.goodsName');
				}else if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==true && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==false){
					_this.goodsNameTitle = this.$i18n.t('message.businessDetail.goodName');
				}else if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.GOODS_NAME'].isSee==false && _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.ELEMENT'].isSee==true){
					_this.goodsNameTitle = this.$i18n.t('message.businessDetail.specification');
				}else{
					_this.goodsNameTitle = "";
				}

				//数量及单位
				let isHaveNum = false;
				if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.QUANTITY'].isSee==true || _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_QUANTITY'].isSee==true || _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_QUANTITY'].isSee==true){
					isHaveNum = true;
				}
				let isHaveUnit = false;
				if(_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.UNIT_NAME'].isSee==true || _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.FIRST_UM_NAME'].isSee==true || _this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.SECOND_UM_NAME'].isSee==true){
					isHaveUnit = true;
				}
				if(isHaveNum==true && isHaveUnit==true){
					_this.numUnitTitle = this.$i18n.t('message.businessDetail.goodsNum');
				}else if(isHaveNum && isHaveUnit==false){
					_this.numUnitTitle = this.$i18n.t('message.businessDetail.number');
				}else if(isHaveNum==false && isHaveUnit==true){
					_this.numUnitTitle = this.$i18n.t('message.businessDetail.unit');
				}else{
					_this.numUnitTitle = "";
				}

				//单价、总价、币制
				let pcArray = [];
				if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_PRICE'].isSee) {
					pcArray.push(_this.$i18n.t('message.businessDetail.unitPrice'));
				}
				if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.DECL_TOTAL'].isSee) {
					pcArray.push(_this.$i18n.t('message.businessDetail.totalPrice'));
				}
				if (_this.perssionData.dataMenu['DATA.FE.DECLARATION_LIST.DECLARATION_ITEM_LIST.CURR_NAME'].isSee) {
					pcArray.push(_this.$i18n.t('message.businessDetail.currency'));
				}
				if (pcArray.length>0) {
					_this.priceCurrencyTitle = pcArray.join("/");
				}
			}
		},
        /**
         * 筛选
         */
        filtrate:function(){

		},
		/**
         * 表头点击展开或收缩
         */
		touchSpread:function(){
			this.$emit("touchSpread", this.index);
			Bus.$emit("menuChange")
		},

		/**
         * 货物信息点击展开或收缩
         */
		touchCargoSpread:function(){
			this.$emit("touchCargoSpread", this.index);
			Bus.$emit("menuChange")
		},

        clickTable(row,index,e){
           this.$refs.refTable.toggleRowExpansion(row)
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
    }
};
</script>
<style scoped>
    .customContent{
        position:relative;
        /* margin: 0px;
        background-color: #fff; */
        margin: 10px;background-color: #fff;
    }
    .customTitle{
        position:relative;
        height: 40px;
        margin: 0px 10px 0px 10px;
        /* background-color: #eaf8ff; */
        white-space: nowrap;
    }
    .statistics-title{
        position: relative;
        margin-left: 5px;
        line-height: 40px;
		color: #333;
    }
    .title-content{
        position: relative;
        margin-right: 5px;
        /* color: orange; */
        line-height: 40px;
    }
	.title-spread{
		position: relative;
        float: right;
		top:3px;
	}
    .customSingleDetail{
        padding: 0px 15px 0px 15px;
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

    .goods-table{
        padding: 0px 0px 10px 0px;
        margin: 0px 15px 10px 15px;
    }
    .goods-table /deep/ .el-table td, .el-table th.is-leaf{
        padding: 0px 0px 0px 0px;
        height: 80px !important;
    }
    .leftCell{
        display: block;
        white-space: nowrap;
        text-align: left;
    }
    .rightCell{
        display: block;
        white-space: nowrap;
        text-align: right;
    }
</style>

