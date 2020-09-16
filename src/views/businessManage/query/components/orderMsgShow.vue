/* 

*/
<template>
    <div class="orderMsgShow" v-if="showData!=null && showData!=undefined">
        <!-- <div class="span-noautoshow" id="noautoDiv" v-for="(item,index) in showArray" :key="index">
            <span v-if="item.key || item.value" style="color:black;font-weight:bold">{{item.key}}</span>
            <span v-if="item.key || item.value" >{{item.value}}</span> 
        </div> -->
		
		<div :class="orderShowList.length<3?'itemOneLineDiv':'itemDiv'">
            <div v-for="(item,index) in orderShowList" :key="index" :class="orderShowList.length<3?'itemautoshowOneLine':'itemautoshow'" id="noautoDiv">
                <span class="leftSpan">{{item.name}}：</span>
                <span class="contentSpan">{{item.value}}</span>  
            </div>
        </div>

        <!-- 工作号、行业种类、客户名称 -->
        <!-- <div class="itemDiv" v-show="isYuanChuAcc!='1'">
             <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.ORDER_NO}}：</span>
                <span class="contentSpan">{{showData?showData.ORDER_NO:""}}</span>  
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.BUSINESS_TYPE}}：</span>
                <span class="contentSpan">{{showData?showData.BUSINESS_TYPE:""}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.CUST_CN}}：</span>
                <span class="contentSpan">{{isEn?(showData.CUST_NAME_EN?showData.CUST_NAME_EN:showData.CUST_CN):showData.CUST_CN}}</span> 
            </div>
        </div> -->
        <!-- 合同协议号、承运人提单号/分拨号 -->
        <!-- <div class="itemDiv">
            <div v-if="orderType!='FE'" class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.CONTRACT_NO?showKeyDesc.CONTRACT_NO:$t('message.businessSearch.contractNum')}}：</span>
                <span class="contentSpan">{{showData.CONTRACT_NO}}</span> 
            </div>
            <div v-else class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.CONTRACT_NO?showKeyDesc.CONTRACT_NO:$t('message.businessSearch.contractNum')}}：</span>
                <span class="contentSpan">{{showData.CONTRACT_NO}}</span> 
            </div>
            <div class="twoColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.MBL_NO}}{{showKeyDesc.HBL_NO?('/'+showKeyDesc.HBL_NO):''}}：</span>
                <span class="contentSpan">{{showData.MBL_NO}}{{showData.HBL_NO?('/'+showData.HBL_NO):''}}</span> 
            </div>
        </div> -->
        <!-- 启运国/启运港、(经停港)、抵运国/抵运港 -->
        <!-- <div class="itemDiv" v-if="orderType!='FE'" ref="countryRef" id="countryDiv">
             <div class="countryThreeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.POL_COUNTRY}}{{showKeyDesc.POL_NAME?('/'+showKeyDesc.POL_NAME):''}}：</span>
                <span class="contentSpan">{{showData.POL_COUNTRY}}{{showData.POL_NAME?('/'+showData.POL_NAME):''}}</span> 
			</div>
            <div class="countryThreeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.POT_NAME}}：</span>
                <span class="contentSpan">{{showData.POT_NAME}}</span> 
            </div>
            <div class="countryThreeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.POD_COUNTRY}}{{showKeyDesc.POD_NAME?('/'+showKeyDesc.POD_NAME):''}}：</span>
                <span class="contentSpan">{{showData.POD_COUNTRY}}{{showData.POD_NAME?('/'+showData.POD_NAME):''}}</span> 
            </div>
        </div>
        <div class="itemDiv" v-else ref="countryRef"  id="countryDiv">
             <div class="countryThreeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.POL_COUNTRY}}{{showKeyDesc.POL_NAME?('/'+showKeyDesc.POL_NAME):''}}：</span>
                <span class="contentSpan">{{showData.POL_COUNTRY}}{{showData.POL_NAME?('/'+showData.POL_NAME):''}}</span> 
            </div>
            
            <div class="countryTwoColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.POD_COUNTRY}}{{showKeyDesc.POD_NAME?('/'+showKeyDesc.POD_NAME):''}}：</span>
                <span class="contentSpan">{{showData.POD_COUNTRY}}{{showData.POD_NAME?('/'+showData.POD_NAME):''}}</span> 
            </div>
        </div> -->
        <!-- 货物种类、承运人、运输方式 -->
        <!-- <div class="itemDiv">
             <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.CARGO_TYPE_NAME}}：</span>
                <span class="contentSpan">{{showData.CARGO_TYPE_NAME}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.CARRIER_NAME}}：</span>
                <span class="contentSpan">{{showData.CARRIER_NAME}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.TRADE_TOOL_TYPE_NAME}}：</span>
                <span class="contentSpan">{{showData.TRADE_TOOL_TYPE_NAME}}</span> 
            </div>
        </div> -->
        <!-- 运输工具名称及航次号、整拼类型、境外发货人/境内发货人 -->
        <!-- <div class="itemDiv">
             <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.TRANS_TOOL}}{{showKeyDesc.VOYAGE_NO?('/'+showKeyDesc.VOYAGE_NO):''}}：</span>
                <span class="contentSpan">{{showData.TRANS_TOOL}}{{showData.VOYAGE_NO?('/'+showData.VOYAGE_NO):''}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.TRADE_CONT_TYPE}}：</span>
                <span class="contentSpan">{{showData.TRADE_CONT_TYPE}}</span> 
            </div>
            <div v-if="orderType!='FE'" class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.OVERSEA}}：</span>
                <span class="contentSpan">{{showData.OVERSEA}}</span> 
            </div>
            <div v-else class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.JYDW}}：</span>
                <span class="contentSpan">{{showData.JYDW}}</span> 
            </div>
        </div> -->
        <!-- 消费使用单位/生产销售单位、贸易国、成交方式 -->
        <!-- <div class="itemDiv">
            <div v-if="orderType!='FE'" class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.PRD_NAME}}：</span>
                <span class="contentSpan">{{showData.PRD_NAME}}</span> 
            </div>
            <div v-else class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.PRD_NAME}}：</span>
                <span class="contentSpan">{{showData.PRD_NAME}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.TRADE_COUNTRY}}：</span>
                <span class="contentSpan">{{showData.TRADE_COUNTRY}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.TRANSACTION_MODE_NAME}}：</span>
                <span class="contentSpan">{{showData.TRANSACTION_MODE_NAME}}</span> 
            </div>
        </div> -->
        <!-- 进境关别/出境关别、入境口岸/离境口岸、监管方式 -->
        <!-- <div class="itemDiv">
             <div v-if="orderType!='FE'" class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.JJKA}}：</span>
                <span class="contentSpan">{{showData.JJKA}}</span> 
            </div>
            <div v-else class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.JJKA}}：</span>
                <span class="contentSpan">{{showData.JJKA}}</span> 
            </div>
            <div v-if="orderType!='FE'" class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.PORT_NAME}}：</span>
                <span class="contentSpan">{{showData.PORT_NAME}}</span> 
            </div>
            <div v-else class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.PORT_NAME}}：</span>
                <span class="contentSpan">{{showData.PORT_NAME}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.BRF_NAME}}：</span>
                <span class="contentSpan">{{showData.BRF_NAME}}</span> 
            </div>
        </div> -->
        <!-- 件数、毛重(kg)、体积(m³) -->
        <!-- <div class="itemDiv">
             <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.CARGO_NUM}}：</span>
                <span class="contentSpan">{{showData.CARGO_NUM}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.GROSS_WEIGHT}}：</span>
                <span class="contentSpan">{{showData.GROSS_WEIGHT}}</span> 
            </div>
            <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc.GROSS_VOLUME}}：</span>
                <span class="contentSpan">{{showData.GROSS_VOLUME}}</span> 
            </div>
        </div> -->
        <!-- 包装种类、箱量/箱型 -->
        <!-- <div class="itemDiv" v-if="showData.TRADE_CONT_TYPE == 'FCL' && showData.CONT_INFO!='' && showData.CONT_INFO!=' ' && showData.CONT_INFO!=undefined">
            <div class="threeColumnClass">
                <span class="leftSpan">{{showKeyDesc.PACKAGE_NAME}}：</span>
                <span class="contentSpan">{{showData.PACKAGE_NAME}}</span> 
            </div>
            <div class="twoColumnClass">
                <span class="leftSpan">{{showKeyDesc.CONT_INFO}}：</span>
                <span class="contentSpan">{{showData.CONT_INFO}}</span> 
            </div>
        </div>
        <div class="itemDiv" v-else>
             <div class="oneColumnClass">
                <span class="leftSpan">{{showKeyDesc.PACKAGE_NAME}}：</span>
                <span class="contentSpan">{{showData.PACKAGE_NAME}}</span>
            </div>
        </div> -->
    </div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
import { getOrderDetailTopShowList } from '@/util/role/menuDataShowDeal'

export default {
    name: "orderMsgShow",
    props: {
        //显示数据对象，key:value格式
        showData:{
            type:Object,
            default:()=>{
                return null
            }    
        },
        //显示业务字段对应的中英文描述，key:value格式
        showKeyDesc:{
            type:Object,
            default:()=>{
                return {}
            }    
        },
        //是否自动换行，不设定特定列数
        isAutoLineFeed:{
            type: Boolean,
            default:false //默认不自动换行。为true时，columnNum无效
        },
        //订单进出口类型： "FI"进口:"FE"出口
        orderType:{
            type:String
        }
    },
    data: function() {
        return {
            showArray:[],
            //是否是元初客户
			isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),
			isEn:localStorage.getItem("internationalization")=="en"?true:false,

			orderShowList:[],
        };
    },
    watch:{
		showData:function(){
			if (this.showData) {
				let perssionData = this.isNullData(localStorage.getItem("MenuDataCode"))?null:JSON.parse(localStorage.getItem("MenuDataCode"));
		
        		this.orderShowList = getOrderDetailTopShowList(this.orderType,perssionData,this.showKeyDesc,this.showData);
			}
		},
        showArray:function(){
            console.log("watchshowArray....");
            this.$nextTick(function(){
                console.log("this.$nextTick....");
                setTimeout(()=>{
                    //启运抵运国行内容高度
                    let countryDiv = document.getElementById("countryDiv");
                    console.log("countryDiv....",countryDiv.clientHeight);
                    let countryHeight =  countryDiv.clientHeight;// window.getComputedStyle(this.$refs.countryRef).height;
                    if( typeof countryHeight == 'string'){
                        countryHeight = Number(countryHeight.replace(/px/, ""));
                    }
                    let countryThreeColumnDivs = document.getElementsByClassName("countryThreeColumnClass");
                    console.log("countryHeight....",countryHeight);
                    for (let index = 0; index < countryThreeColumnDivs.length; index++) {
                        const element = countryThreeColumnDivs[index];
                        element.style.height = countryHeight-11+"px";
                    }

                    // let countryTwoColumnDivs = document.getElementsByClassName("countryTwoColumnClass");
                    // console.log("countryTwoColumnDivs....",countryTwoColumnDivs);
                    // for (let index = 0; index < countryTwoColumnDivs.length; index++) {
                    //     const element = countryTwoColumnDivs[index];
                    //     element.style.minHeight = countryHeight-11 +"px";
                    // }
                },400)
            });
        }
    },
    created:function() {
		
    },
    mounted: function() {
		let _this = this;
		this.getShowArray();
		
		// window.onresize = (val) => {
		// 	console.log("this.$forceUpdate()...", val);
		// 	// _this.$forceUpdate()
		// 	//启运抵运国行内容高度
        //     let countryDiv = document.getElementById("countryDiv");
        //     console.log("countryDiv....",countryDiv.clientHeight);
        //     let countryHeight =  countryDiv.clientHeight;// window.getComputedStyle(this.$refs.countryRef).height;
        //     if( typeof countryHeight == 'string'){
        //         countryHeight = Number(countryHeight.replace(/px/, ""));
        //     }
        //     let countryThreeColumnDivs = document.getElementsByClassName("countryThreeColumnClass");
        //     console.log("countryHeight....",countryHeight);
        //     for (let index = 0; index < countryThreeColumnDivs.length; index++) {
        //         const element = countryThreeColumnDivs[index];
        //         element.style.minHeight = countryHeight-11+"px";
        //     }
        // };
        // this.$nextTick(()=>{

            

        // });

        // setTimeout(()=>{
        //     //启运抵运国行内容高度
        //     let countryDiv = document.getElementById("countryDiv");
        //     console.log("countryDiv....",countryDiv.clientHeight);
        //     let countryHeight =  countryDiv.clientHeight;// window.getComputedStyle(this.$refs.countryRef).height;
        //     if( typeof countryHeight == 'string'){
        //         countryHeight = Number(countryHeight.replace(/px/, ""));
        //     }
        //     let countryThreeColumnDivs = document.getElementsByClassName("countryThreeColumnClass");
        //     console.log("countryHeight....",countryHeight);
        //     for (let index = 0; index < countryThreeColumnDivs.length; index++) {
        //         const element = countryThreeColumnDivs[index];
        //         element.style.height = countryHeight-11+"px";
        //     }

        //     let countryTwoColumnDivs = document.getElementsByClassName("countryTwoColumnClass");
        //     console.log("countryTwoColumnDivs....",countryTwoColumnDivs);
        //     for (let index = 0; index < countryTwoColumnDivs.length; index++) {
        //         const element = countryTwoColumnDivs[index];
        //         element.style.height = countryHeight-11 +"px";
        //     }
        // },400)

        // let showNum = this.showArray.length;
        // if(showNum%3 != 0){
        //     let remainder = showNum%3;
        //     for (let index = 0; index < 3-remainder; index++) {
        //         this.showArray.push({key:"", value:""})
                
        //     }
        // }
    },
    methods: {
        getShowArray(){
            // let newArray = [];
            // for(let key in this.showData){
			// 	let value = JSON.parse(JSON.stringify(this.showData[key]));
            //     newArray.push({key:key,value:value})
            // }
			// this.showArray = [];
			// this.showArray = JSON.parse(JSON.stringify(newArray));
			if (this.showData) {
				let perssionData = this.isNullData(localStorage.getItem("MenuDataCode"))?null:JSON.parse(localStorage.getItem("MenuDataCode"));
		
        	this.orderShowList = getOrderDetailTopShowList(this.orderType,perssionData,this.showKeyDesc,this.showData);
			}
			
        }
    }
};
</script>
<style scoped>
    .orderMsgShow{
        position: relative;
        padding: 20px;
    }
    .leftSpan{
        color:#333;
        font-weight:bold;
        font-size: 14px;
		line-height: 25px;
    }
    .contentSpan{
        display: inline-block;
        color:#444;
        font-size: 14px;
		white-space:pre-wrap;
		line-height: 25px;
    }
	.itemDiv {
		border: solid;
        border-width: 0px 0px 1px 0px;
        border-color: rgb(231, 231, 231);
        background-color: rgb(250, 250, 250);
		overflow: hidden;
		position: relative;
	}
	.itemOneLineDiv {
		border: solid;
        border-width: 1px 1px 1px 0px;
        border-color: rgb(231, 231, 231);
        background-color: rgb(250, 250, 250);
		overflow: hidden;
		position: relative;
	}
	.itemautoshow{
        color:black;
        border: solid;
        border-width: 1px 1px 0px 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: 0px -1px 0px 0px;
        padding: 4px 0px 4px 15px;
        text-align: left;
        width: calc(33.33% - 16.5px);
        min-height: 28px;
        vertical-align: top;
		height:auto;
        white-space:pre-wrap;
		padding-bottom: 9999px;
        margin-bottom: -9999px;
		/* text-overflow: ellipsis; */
    }
	.itemautoshowOneLine{
		color:black;
        border: solid;
        border-width: 0px 1px 0px 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: 0px -1px 0px 0px;
        padding: 4px 0px 4px 15px;
        text-align: left;
        width: calc(33.33% - 16.5px);
        min-height: 28px;
        vertical-align: top;
		height:auto;
        white-space:pre-wrap;
		padding-bottom: 9999px;
        margin-bottom: -9999px;
		/* text-overflow: ellipsis; */
	}

    .countryClass{
        display: block;
    }
    .countryThreeColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 5px 0px 5px 15px;
        text-align: left;
        width: calc(33.33% - 15px);
        vertical-align: top;
        /* height: auto; */
		min-height: 23px;
        /* white-space:nowrap; */
    }
    .countryTwoColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 4px 0px 4px 15px;
        text-align: left;
        width: calc(66.67% - 14.5px);
		min-height: 23px;
        /* height: auto; */
        vertical-align: top;
        /* white-space:nowrap; */
    }
    
    .threeColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 4px 0px 4px 15px;
        text-align: left;
        width: calc(33.33% - 15px);
        min-height: 20px;
        vertical-align: top;
		height:auto;
        white-space:nowrap;
		overflow: hidden;
		
		/* text-overflow: ellipsis; */
    }
    .twoColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 4px 0px 4px 15px;
        text-align: left;
        width: calc(66.67% - 14.5px);
        min-height: 20px;
        vertical-align: top;
		height:auto;
        white-space:nowrap;
		overflow: hidden;
		/* text-overflow: ellipsis; */
    }
    .oneColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 4px 0px 4px 15px;
        text-align: left;
        width: calc(100% - 13px);
        min-height: 20px;
        vertical-align: top;
		height:auto;
        white-space:nowrap;
		overflow: hidden;
		/* text-overflow: ellipsis; */
    }
</style>
