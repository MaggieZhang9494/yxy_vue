
<template>
    <div style="position: relative;width:100%">
        <div v-if="isShowTotalData" class="paymentDeatil">
            <el-table
            	class="paymentTable"
                :data="paymentMsg"
                border
                style="width: 100%">
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DUTY_PAY_DATE'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.paymentFinishDate')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DUTY_PAY_DATE'].isUse?scope.row['paymentFinishDate']:""}}</span>
                    </template>
                </el-table-column>
				<el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.dutiableTotalValue')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isUse?scope.row['dutiableTotalValue']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.IMPORT_DUTY'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.tariffs')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.IMPORT_DUTY'].isUse?scope.row['tariffs']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.VALUE_ADDED_TAX'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.addedValueTax')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.VALUE_ADDED_TAX'].isUse?scope.row['addedValueTax']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CONSUMPTION_TAX'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.consumptionTax')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CONSUMPTION_TAX'].isUse?scope.row['consumptionTax']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.ANTI_DUMPING_TAX'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.anti_dumpingDuties')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.ANTI_DUMPING_TAX'].isUse?scope.row['anti_dumpingDuties']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.LATE_PAYMENT_FEE'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.ddf')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span>{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.LATE_PAYMENT_FEE'].isUse?scope.row['ddf']:""}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="isShowTotalData" class="commonline" style="display: flex;width: auto;position: relative; margin: 0px 10px 0px 10px;" ></div>
        <div v-if="isShowPaymentList" class="search-item" style="display: inline-block;margin-left: 10px;">
            <span>{{$t('message.businessDetail.cus_no')}}：</span>
            <el-input
                size="mini"
                class="inputStyle"
                v-model="searchKeyCusNo"
                clearable>
            </el-input>
            <div style="display: inline-block;margin-left: 15px;">
                <el-button type="primary" size="small" @click="filtrate()">{{$t('message.common.filtrate')}}</el-button>
            </div>
        </div>
        <div v-if="isShowPaymentList" class="commonline" style="display: flex;width: auto;position: relative; margin: 0px 10px 0px 10px;" ></div>
        <div v-if="isShowPaymentList" class="customs-table">
            <el-table :data="customsList" highlight-current-row tooltip-effect="light" v-loading="loading">
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
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
                        <span style="color: #1585FF;cursor:pointer;" @click="touchBillNum(scope.row['CUS_NO'])">{{scope.row['CUS_NO']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DUTY_PAY_DATE'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.paymentFinishDate')"
                    :min-width="160">
                    <template slot-scope="scope">
						<span>{{scope.row['paymentFinishDate']}}</span>
                    </template>
                </el-table-column>
				<el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.dutiableTotalValue')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
						<span >{{perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isUse?scope.row['dutiableTotalValue']:""}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.IMPORT_DUTY'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.tariffs')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
						<span v-if="parseFloat(scope.row.tariffs)>0" style="color: #1585FF;cursor:pointer;" @click="touchTariffs(scope.row)">{{scope.row['tariffs']}}</span>
                        <span v-else>{{scope.row['tariffs']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.VALUE_ADDED_TAX'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.addedValueTax')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
						<span v-if="parseFloat(scope.row.addedValueTax)>0" style="color: #1585FF;cursor:pointer;" @click="touchAddedValueTax(scope.row)">{{scope.row['addedValueTax']}}</span>
                        <span v-else>{{scope.row['addedValueTax']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CONSUMPTION_TAX'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.consumptionTax')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
						<span v-if="parseFloat(scope.row.consumptionTax)>0" style="color: #1585FF;cursor:pointer;" @click="touchConsumptionTax(scope.row)">{{scope.row['consumptionTax']}}</span>
                        <span v-else>{{scope.row['consumptionTax']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.ANTI_DUMPING_TAX'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.anti_dumpingDuties')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
						<span v-if="parseFloat(scope.row.anti_dumpingDuties)>0" style="color: #1585FF;cursor:pointer;" @click="touchAnti_dumpingDuties(scope.row)">{{scope.row['anti_dumpingDuties']}}</span>
                        <span v-else>{{scope.row['anti_dumpingDuties']}}</span>
                    </template>
                </el-table-column>
                <el-table-column
					v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.LATE_PAYMENT_FEE'].isSee==true"
                    align="center"
                    :label="$t('message.businessDetail.ddf')"
					:min-width="minWidth"
                    >
                    <template slot-scope="scope">
						<span v-if="parseFloat(scope.row.ddf)>0" style="color: #1585FF;cursor:pointer;" @click="touchDdf(scope.row)">{{scope.row['ddf']}}</span>
                        <span v-else>{{scope.row['ddf']}}</span>
                    </template>
                </el-table-column>
            </el-table>      
            <!-- <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>       -->

			<el-dialog :visible.sync="taxDetailDialogVisible" :title="taxDetailDialogTitle" width="80%" :append-to-body="true" :center="true" class="dialog-wrapper" v-if="taxDetailDialogVisible">
                <v-taxdetail-dialog :taxDetailDialogOptions="taxDetailDialogOptions" :showKeyDesc="businessDesc" :perssionData="perssionData" @success="success" @close="close"></v-taxdetail-dialog>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import customStep from "../components/customStep";
import flowTimeLine from "../components/flow_timeline";
import customListDetail from "../components/customListDetail";
import taxDetailDialog from "../components/taxDetailDialog";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";
import { getRecentlyDataFromList } from "@/util/orderDataParse"

export default {
    name: "flowCourse",
    components: {
        "v-custom-step":customStep,
        "v-flow-timeline":flowTimeLine,
		"v-customlist-detail":customListDetail,
		"v-taxdetail-dialog":taxDetailDialog,
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
        },
        gotoCusNoDetail:{
            type:Function
        },
    },
    data: function() {
        return {
            searchKeyCusNo:"",
            loading:false,
            currentPage: 1,
            pageSize: 10,
            total: 0,
			
			//税款信息对话框
			taxDetailDialogVisible:false,
			taxDetailDialogTitle:this.$i18n.t("message.businessDetail.taxDetail"),
			taxDetailDialogOptions:{},

            //完税总信息
            paymentMsg:[
			// 	{
            //     paymentFinishDate:"付税完成日",
            //     tariffs:"关税",
            //     addedValueTax:"增值税",
            //     consumptionTax:"消费税",
            //     anti_dumpingDuties:"反倾销税",
            //     ddf:"滞报金",
			// }
			],
            //对应报关单完税信息列表
            customsList:[
                
            ],//报关单列表

            //列表视图对应列的宽度
            numberWidth:50,//序号
            customsWidth:150,//报关单号
            finishDateWidth:160,//付税完成日期
			commonWidth:150,
			
			minWidth:100,

			perssionData:{},

			isShowTotalData:false,//是否显示完税总统计数据
			isShowPaymentList:false,//是否显示完税列表
        };
    },
    created:function(){

		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))

		if (this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DUTY_PAY_DATE'].isSee == true ||
			this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.IMPORT_DUTY'].isSee == true ||
			this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.VALUE_ADDED_TAX'].isSee == true ||
			this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.CONSUMPTION_TAX'].isSee == true ||
			this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.ANTI_DUMPING_TAX'].isSee == true ||
			this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.LATE_PAYMENT_FEE'].isSee == true ||
			this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isSee == true ) {
			this.isShowTotalData = true;
		}

		if (this.perssionData.dataMenu["DATA.FI.DECLARATION_LIST.CUS_NO"].isSee == true ||
			this.isShowTotalData == true ) {
			this.isShowPaymentList = true;
		}
		
        //如果外部传入报关单号，则进行筛选
        if (this.cus_no) {
            this.searchKeyCusNo = this.cus_no;
        }

		//计算完税汇总信息
		this.getTotalPayMsg();

		//处理报关完税列表信息
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
                this.customsWidth=160;
				this.commonWidth='';
				this.minWidth = 100;
            }else if(localStorage.getItem("internationalization") == 'en'){ /* 英文版本 */
                this.numberWidth=50;
                this.customsWidth=180;
				this.commonWidth='';
				this.minWidth = 150;
            }else{
                this.numberWidth=50;
                this.customsWidth=150;
				this.commonWidth='';
				this.minWidth = 100;
            }
		},
		//保留两位小数   
        //功能：将浮点数四舍五入，取小数点后2位  
        toDecimal(x) {  
            var f = parseFloat(x);  
            if (isNaN(f)) {  
                return;  
            }  
            f = Math.round(x*100)/100;  
            return f;  
        },
		/**
		 * 计算完税汇总信息
		 */
		getTotalPayMsg(){
			let payMsg = {
				paymentFinishDate:"",//付税完成日
				dutiableTotalValue:"",//完税价格
                tariffs:"",//关税
                addedValueTax:"",//增值税
                consumptionTax:"",//消费税
                anti_dumpingDuties:"",//反倾销税
                ddf:"",//滞报金
			};

			let orderNewMsg = JSON.parse(JSON.stringify(this.orderMsg));

			// let date = "2020-02-23 10:20:";
			// orderNewMsg.DECLARATION_LIST = orderNewMsg.DECLARATION_LIST.map((item,index)=>{
            //     item.DUTY_PAY_DATE = date+index+1;//item.DUTY_PAY_DATE; //付税完成日期
            //     return item;
			// })
				
			//获取最近付税完成日期
			let recentMsg = getRecentlyDataFromList("DUTY_PAY_DATE",orderNewMsg.DECLARATION_LIST);
			payMsg.paymentFinishDate = !this.isNullData(recentMsg.DUTY_PAY_DATE)?recentMsg.DUTY_PAY_DATE:"";

			let dutiableTotalValue = 0;
			let tariffs = 0;
			let addedValueTax = 0;
			let consumptionTax = 0;
			let anti_dumpingDuties = 0;
			let ddf = 0;

			if (orderNewMsg.DECLARATION_LIST) {
				orderNewMsg.DECLARATION_LIST.forEach(element => {
					//获取总完税价格
					let dutyItemPrice = 0;
					if (element.DECLARATION_DUTY && element.DECLARATION_DUTY.length>0) {
						let itemObj = element.DECLARATION_DUTY[0];
						element.DECLARATION_DUTY.forEach(obj=>{
							if (obj.DECLARATION_DUTY_ITEM_LIST && obj.DECLARATION_DUTY_ITEM_LIST.length>0) {
								itemObj = obj;
							}
						});
						if (itemObj.DECLARATION_DUTY_ITEM_LIST) {
							itemObj.DECLARATION_DUTY_ITEM_LIST.forEach(dutyItem => {
								dutyItemPrice += parseFloat(dutyItem.DUTIABLE_VALUE);
							});
						}
					}
					dutiableTotalValue += dutyItemPrice;

					//获取总关税
					tariffs += parseFloat(element.IMPORT_DUTY);
					//获取总增值税
					addedValueTax += parseFloat(element.VALUE_ADDED_TAX);
					//获取总消费税
					consumptionTax += parseFloat(element.CONSUMPTION_TAX);
					//获取总反倾销税
					anti_dumpingDuties += parseFloat(element.ANTI_DUMPING_TAX);
					//获取总滞报金
					ddf += parseFloat(element.LATE_PAYMENT_FEE); 
				});
			}

			payMsg.tariffs = isNaN(tariffs)?'':tariffs.toFixed(2);
			payMsg.addedValueTax = isNaN(addedValueTax)?'':addedValueTax.toFixed(2);
			payMsg.consumptionTax = isNaN(consumptionTax)?'':consumptionTax.toFixed(2);
			payMsg.anti_dumpingDuties = isNaN(anti_dumpingDuties)?'':anti_dumpingDuties.toFixed(2);
			payMsg.ddf = isNaN(ddf)?'':ddf.toFixed(2);
			payMsg.dutiableTotalValue = isNaN(tariffs)?"":(isNaN(dutiableTotalValue)?'':dutiableTotalValue.toFixed(2));
			console.log("payMsg...",payMsg);
			this.paymentMsg.push(payMsg);
		},
        /**
         * 根据搜索key获取报关单列表
         */
        searchCustomMsg:function(searchKey){
			let _this = this;
			let orderNewMsg = JSON.parse(JSON.stringify(_this.orderMsg));
			
            if (_this.isNullData(searchKey)) {
				if (orderNewMsg.DECLARATION_LIST) {
					this.customsList = orderNewMsg.DECLARATION_LIST.map((item,index)=>{
						item.number = (this.currentPage-1)*this.pageSize+index+1;
						item.paymentFinishDate = item.DUTY_PAY_DATE; //付税完成日期
						item.tariffs = item.IMPORT_DUTY; //关税;
						item.addedValueTax = item.VALUE_ADDED_TAX; //增值税;
						item.consumptionTax = item.CONSUMPTION_TAX; //消费税
						item.anti_dumpingDuties = item.ANTI_DUMPING_TAX; //反倾销税
						item.ddf = item.LATE_PAYMENT_FEE;//滞报金
						
						//获取完税价格
						if (item.DECLARATION_DUTY && item.DECLARATION_DUTY.length>0) {
							let dutyItemPrice = 0;
							let itemObj = item.DECLARATION_DUTY[0];
							item.DECLARATION_DUTY.forEach(obj=>{
								if (obj.DECLARATION_DUTY_ITEM_LIST && obj.DECLARATION_DUTY_ITEM_LIST.length>0) {
									itemObj = obj;
								}
							});
							if (itemObj.DECLARATION_DUTY_ITEM_LIST) {
								itemObj.DECLARATION_DUTY_ITEM_LIST.forEach(dutyItem => {
									dutyItemPrice += parseFloat(dutyItem.DUTIABLE_VALUE);
								});
							}
							item.dutiableTotalValue = isNaN(item.tariffs)?"":(isNaN(dutyItemPrice)?'':dutyItemPrice.toFixed(2));
						}else{
							if (!_this.isNullData(item.IMPORT_DUTY) || 
							!_this.isNullData(item.VALUE_ADDED_TAX) || 
							!_this.isNullData(item.CONSUMPTION_TAX) || 
							!_this.isNullData(item.ANTI_DUMPING_TAX) || 
							!_this.isNullData(item.LATE_PAYMENT_FEE)) {
								item.dutiableTotalValue = "0.00";
							} else {
								item.dutiableTotalValue = "";
							}
						}
		
						return item;
					})

					return;
				}            
            }

			let index = 0;
			if (orderNewMsg.DECLARATION_LIST) {
				orderNewMsg.DECLARATION_LIST.forEach(element => {
					if(element.CUS_NO.indexOf(searchKey) > -1){
						let newElement = JSON.parse(JSON.stringify(element));
						index++;
						newElement.number = index;
						newElement.paymentFinishDate = element.DUTY_PAY_DATE; //付税完成日期
						newElement.tariffs = element.IMPORT_DUTY; //关税;
						newElement.addedValueTax = element.VALUE_ADDED_TAX; //增值税;
						newElement.consumptionTax = element.CONSUMPTION_TAX; //消费税
						newElement.anti_dumpingDuties = element.ANTI_DUMPING_TAX; //反倾销税
						newElement.ddf = element.LATE_PAYMENT_FEE;//滞报金
						//获取完税价格
						let dutyItemPrice = 0;
						if (element.DECLARATION_DUTY && element.DECLARATION_DUTY.length>0) {
							let itemObj = element.DECLARATION_DUTY[0];
							element.DECLARATION_DUTY.forEach(obj=>{
								if (obj.DECLARATION_DUTY_ITEM_LIST && obj.DECLARATION_DUTY_ITEM_LIST.length>0) {
									itemObj = obj;
								}
							});
							if (itemObj.DECLARATION_DUTY_ITEM_LIST) {
								itemObj.DECLARATION_DUTY_ITEM_LIST.forEach(dutyItem => {
									dutyItemPrice += parseFloat(dutyItem.DUTIABLE_VALUE);
								});
							}
							newElement.dutiableTotalValue = isNaN(item.tariffs)?"":(isNaN(dutyItemPrice)?'':dutyItemPrice.toFixed(2));;
						}else{
							if ( !_this.isNullData(newElement.IMPORT_DUTY) || 
							!_this.isNullData(newElement.VALUE_ADDED_TAX) || 
							!_this.isNullData(newElement.CONSUMPTION_TAX) || 
							!_this.isNullData(newElement.ANTI_DUMPING_TAX) || 
							!_this.isNullData(newElement.LATE_PAYMENT_FEE)) {
								newElement.dutiableTotalValue = "0.00";
							} else {
								newElement.dutiableTotalValue = "";
							}
						}
						
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

        // clickTable(row,index,e){
        //    this.$refs.refTable.toggleRowExpansion(row)
        // },

        /**
         * 点击报关单号
         */
        touchBillNum:function (billNum) {
            // this.selectBillNum = billNum;
            // this.billNumDetailDialogVisible = true;
            console.log("billNum...",billNum);
            this.gotoCusNoDetail(billNum);
		},
		/**
         * 点击关税金额
         */
		touchTariffs(val){

			if (this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isUse == false ) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}

			let newVal = JSON.parse(JSON.stringify(val));
			newVal.taxType = "关税";
			newVal.taxMoney = val.IMPORT_DUTY;
			console.log("newVal.......", newVal);
			this.taxDetailDialogOptions = newVal;

			this.taxDetailDialogVisible = true;
		},
		/**
         * 点击增值税金额
         */
		touchAddedValueTax(val){

			if (this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isUse == false ) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}

			this.taxDetailDialogVisible = true;

			let newVal = JSON.parse(JSON.stringify(val));
			newVal.taxType = "增值税";
			newVal.taxMoney = val.VALUE_ADDED_TAX;
			this.taxDetailDialogOptions = newVal;
		},
		/**
         * 点击消费税金额
         */
		touchConsumptionTax(val){
			this.taxDetailDialogVisible = true;

			let newVal = JSON.parse(JSON.stringify(val));
			newVal.taxType = "消费税";
			newVal.taxMoney = val.CONSUMPTION_TAX;
			this.taxDetailDialogOptions = newVal;
		},
		/**
         * 点击反倾销税金额
         */
		touchAnti_dumpingDuties(val){

			if (this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isUse == false ) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}

			this.taxDetailDialogVisible = true;

			let newVal = JSON.parse(JSON.stringify(val));
			newVal.taxType = "反倾销税";
			newVal.taxMoney = val.ANTI_DUMPING_TAX;
			this.taxDetailDialogOptions = newVal;
		},
		/**
         * 点击滞报金
         */
		touchDdf(val){

			if (this.perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY'].isUse == false ) {
				this.$message({
					type: "warning",
					message: this.$i18n.t('message.common.noPerssion')
				});
				return;
			}

			this.taxDetailDialogVisible = true;

			let newVal = JSON.parse(JSON.stringify(val));
			newVal.taxType = "滞报金";
			newVal.taxMoney = val.LATE_PAYMENT_FEE;
			this.taxDetailDialogOptions = newVal;
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
		success(){

        },
        close(val){
            this.taxDetailDialogVisible = val
        },
    }
};
</script>
<style scoped>
    .paymentDeatil{
        position:relative;
        height: 80px;
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

    .paymentDeatil /deep/ .el-table td, .el-table th.is-leaf{
        padding: 0px 0px 0px 0px;
        height: 40px !important;
        background-color: rgb(250, 250, 250) !important;
    }
</style>

