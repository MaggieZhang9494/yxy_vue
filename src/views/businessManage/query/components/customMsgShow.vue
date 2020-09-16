<template>
    <div class="customMsgShow" v-show="showData">
        <!-- <div class="span-noautoshow" id="noautoDiv" v-for="(item,index) in showArray" :key="index">
            <span v-if="item.key || item.value" style="color:black;font-weight:bold">{{item.key}}</span>
            <span v-if="item.key || item.value" >{{item.value}}</span> 
        </div> -->
		<!-- <div class="itemDiv">
            <div v-for="(item,index) in orderShowList" :key="index" class="itemautoshow" id="noautoDiv">
                <span class="leftSpan">{{item.name}}：</span>
                <span class="contentSpan">{{item.value}}</span>  
            </div>
        </div> -->

		<div :class="orderShowList.length<5?'itemOneLineDiv':'itemDiv'">
            <div v-for="(item,index) in orderShowList" :key="index" :class="orderShowList.length<5?'itemautoshowOneLine':'itemautoshow'" id="noautoDiv">
                <span class="leftSpan">{{item.name}}：</span>
                <span class="contentSpan">{{item.value}}</span>  
            </div>
        </div>

        <!-- 境内收货人/境内发货人 、进境关别/出境关别、进口日期/出口日期、申报日期、备案号 -->
        <!-- <div> -->
            <!-- 境内收货人/境内发货人 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRADE_NAME']}}：</span>
                <span class="contentSpan">{{declaration.TRADE_NAME}}</span> 
            </div> -->
            <!-- 进境关别/出境关别 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.IE_PORT_NAME']}}：</span>
                <span class="contentSpan">{{declaration.IE_PORT_NAME}}</span> 
            </div> -->
            <!-- 进口日期/出口日期 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.IE_DATE']}}：</span>
                <span class="contentSpan">{{declaration.IE_DATE.substr(0,10)}}</span> 
            </div> -->
            <!-- 申报日期 列表中SBDATE-->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.SBDATE']}}：</span>
                <span class="contentSpan">{{declaration.SBDATE.substr(0,10)}}</span>  
            </div> -->
            <!-- 备案号 列表中CASE_NO-->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CASE_NO']}}：</span>
                <span class="contentSpan">{{declaration.CASE_NO}}</span>  
            </div> -->
        <!-- </div> -->
        <!-- 境外发货人/境外收货人 、运输方式、运输工具名称及航次号、承运人提单号、货物存放地 -->
        <!-- <div> -->
            <!-- 境外发货人/境外收货人 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.OVERSEAS_CONSIGNOR_NAME']}}：</span>
                <span class="contentSpan">{{declaration.OVERSEAS_CONSIGNOR_NAME}}</span> 
            </div> -->
            <!-- 运输方式 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRAF_MODE_NAME']}}：</span>
                <span class="contentSpan">{{declaration.TRAF_MODE_NAME}}</span> 
            </div> -->
            <!-- 运输工具名称及航次号 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRAF_NAME']}}{{showKeyDesc['DECLARATION_LIST.VOYAGE_NO']?('/'+showKeyDesc['DECLARATION_LIST.VOYAGE_NO']):''}}：</span>
                <span class="contentSpan">{{declaration.TRAF_NAME}}{{declaration.VOYAGE_NO?('/'+declaration.VOYAGE_NO):''}}</span> 
            </div> -->
            <!-- 承运人提单号 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.BILL_NO']}}：</span>
                <span class="contentSpan">{{declaration.BILL_NO}}</span> 
            </div> -->
            <!-- 货物存放地 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.GOODS_PLACE']}}：</span>
                <span class="contentSpan">{{declaration.GOODS_PLACE}}</span> 
            </div> -->
        <!-- </div> -->
        <!-- 消费使用单位/生产销售单位、 监管方式、 征免性质、许可证号、启运港-->
        <!-- <div> -->
            <!-- 消费使用单位/生产销售单位 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.OWNER_NAME']}}：</span>
                <span class="contentSpan">{{declaration.OWNER_NAME}}</span> 
            </div> -->
            <!-- 监管方式 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRADE_MODE_NAME']}}：</span>
                <span class="contentSpan">{{declaration.TRADE_MODE_NAME}}</span> 
            </div> -->
            <!-- 征免性质 列表中CUT_NAME--> 
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CUT_NAME']}}：</span>
                <span class="contentSpan">{{declaration.CUT_NAME}}</span>  
            </div> -->
            <!-- 许可证号 列表中PASS_NO--> 
            <!-- <div v-if="orderType!='FE'" class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.PASS_NO']}}：</span>
                <span class="contentSpan">{{declaration.PASS_NO}}</span>  
            </div>
			<div v-else class="twoColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.PASS_NO']}}：</span>
                <span class="contentSpan">{{declaration.PASS_NO}}</span>  
            </div> -->
            <!-- 启运港 进口显示，出口隐藏 -->
            <!-- <div v-if="orderType!='FE'" class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.DESP_PORT_NAME']}}：</span>
                <span class="contentSpan">{{declaration.DESP_PORT_NAME}}</span> 
            </div>
        </div> -->
        <!-- 合同协议号、贸易国、启运国/抵运国、经停港/指运港、入境口岸/离境口岸 -->
        <!-- <div> -->
            <!-- 合同协议号 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CONTRACT_NO']?showKeyDesc['DECLARATION_LIST.CONTRACT_NO']:$t('message.businessSearch.contractNum')}}：</span>
                <span class="contentSpan">{{declaration.CONTRACT_NO}}</span> 
            </div> -->
            <!-- 贸易国 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRADE_AREA_NAME']}}：</span>
                <span class="contentSpan">{{declaration.TRADE_AREA_NAME}}</span> 
            </div> -->
            <!-- 启运国/抵运国 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRADE_COUNTRY_NAME']}}：</span>
                <span class="contentSpan">{{declaration.TRADE_COUNTRY_NAME}}</span> 
            </div> -->
            <!-- 经停港/指运港 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.POL_NAME']}}：</span>
                <span class="contentSpan">{{declaration.POL_NAME}}</span> 
            </div> -->
            <!-- 入境口岸/离境口岸 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.ENTY_PORT_NAME']}}：</span>
                <span class="contentSpan">{{declaration.ENTY_PORT_NAME}}</span> 
            </div>
        </div> -->
        <!-- 包装种类、件数、毛重、净重、成交方式 -->
        <!-- <div> -->
            <!-- 包装种类 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CARGO_PACKAGE']}}：</span>
                <span class="contentSpan">{{declaration.CARGO_PACKAGE}}</span> 
            </div> -->
            <!-- 件数 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CARGO_NUM']}}：</span>
                <span class="contentSpan">{{declaration.CARGO_NUM}}</span> 
            </div> -->
            <!-- 毛重 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CARGO_GROSS_WEIGHT']}}：</span>
                <span class="contentSpan">{{declaration.CARGO_GROSS_WEIGHT}}</span> 
            </div> -->
            <!-- 净重 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CARGO_NET_WEIGHT']}}：</span>
                <span class="contentSpan">{{declaration.CARGO_NET_WEIGHT}}</span> 
            </div> -->
            <!-- 成交方式 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TRANS_MODE_NAME']}}：</span>
                <span class="contentSpan">{{declaration.TRANS_MODE_NAME}}</span> 
            </div> -->
        <!-- </div> -->
        <!-- 运费、保费、杂费 -->
        <!-- <div> -->
            <!-- 运费 列表中FRT_FEE--> 
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.FRT_FEE']}}：</span>
                <span class="contentSpan">{{declaration.FRT_FEE}}</span> 
            </div> -->
            <!-- 保费 列表中INS_FEE--> 
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.INS_FEE']}}：</span>
                <span class="contentSpan">{{declaration.INS_FEE}}</span> 
            </div> -->
            <!-- 杂费 列表中OTHER_FEE--> 
            <!-- <div class="threeColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.OTHER_FEE']}}：</span>
                <span class="contentSpan">{{declaration.OTHER_FEE}}</span> 
            </div>
        </div> -->
        <!-- 随附单证 列表中CERT_MARK -->
        <!-- <div>
            <div class="fiveColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.CERT_MARK']}}：</span>
                <span class="contentSpan">{{declaration.CERT_MARK}}</span> 
            </div>
        </div> -->
        <!-- 标记唛码及备注 列表中MARKS -->
        <!-- <div>
            <div class="fiveColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.MARKS']}}：</span>
                <span class="contentSpan">{{declaration.MARKS}}</span> 
            </div>
        </div> -->
        <!-- 特殊关系确认、价格影响确认、支付特许权使用费确认、自报自缴 -->
        <!-- <div> -->
            <!-- 特殊关系确认 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.SPECIAL_CONFIRM']}}：</span>
                <span class="contentSpan">{{!isNullData(declaration.SPECIAL_CONFIRM)?((declaration.SPECIAL_CONFIRM==1 || declaration.SPECIAL_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):""}}</span> 
            </div> -->
            <!-- 价格影响确认 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.PRICE_CONFIRM']}}：</span>
                <span class="contentSpan">{{!isNullData(declaration.PRICE_CONFIRM)?((declaration.PRICE_CONFIRM==1 || declaration.PRICE_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):""}}</span> 
            </div> -->
            <!-- 支付特许权使用费确认 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.PAYMENT_CONFIRM']}}：</span>
                <span class="contentSpan">{{!isNullData(declaration.PAYMENT_CONFIRM)?((declaration.PAYMENT_CONFIRM==1 || declaration.PAYMENT_CONFIRM=="1")?(isCn?"是":"YES"):(isCn?"否":"NO")):""}}</span> 
            </div> -->
            <!-- 自报自缴 缺失字段-->
            <!-- <div class="twoColumnClass" id="noautoDiv">
                <span class="leftSpan">{{$t('message.businessDetail.selfReport')}}：</span>
                <span class="contentSpan">{{""}}</span> 
            </div>
        </div> -->
        <!-- 报关人员/申报人员、报关人员证号/申报人员证号、电话、申报单位 -->
        <!-- <div> -->
            <!-- 报关人员/申报人员 -->
            <!-- <div v-if="orderType!='FE'" class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.OP_NAME']}}：</span>
                <span class="contentSpan">{{declaration.OP_NAME}}</span> 
            </div>
            <div v-else class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.OP_NAME']}}：</span>
                <span class="contentSpan">{{declaration.OP_NAME}}</span> 
            </div> -->
            <!-- 报关人员证号/申报人员证号 -->
            <!-- <div v-if="orderType!='FE'" class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.IC_CODE']}}：</span>
                <span class="contentSpan">{{declaration.IC_CODE}}</span> 
            </div>
            <div v-else class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.IC_CODE']}}：</span>
                <span class="contentSpan">{{declaration.IC_CODE}}</span> 
            </div> -->
            <!-- 电话 -->
            <!-- <div class="oneColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.TEL']}}：</span>
                <span class="contentSpan">{{declaration.TEL}}</span> 
            </div> -->
            <!-- 申报单位 -->
            <!-- <div class="twoColumnClass" id="noautoDiv">
                <span class="leftSpan">{{showKeyDesc['DECLARATION_LIST.AGENT_NAME']}}：</span>
                <span class="contentSpan">{{declaration.AGENT_NAME}}</span> 
            </div>
        </div> -->
    </div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
import { getCustomDetailTopShowList } from '@/util/role/menuDataShowDeal'

export default {
    name: "customMsgShow",
    props: {
        //DECLARATION_LIST单条数据对象，key:value格式
        declaration:{
            type:Object,
        },
        //订单数据对象，key:value格式
        showData:{
            type:Object,
            // default:()=>{
            //     return {}
            // }    
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
			isCn: localStorage.getItem('internationalization')=="zh-cn"?true:false,
            //是否是元初客户
			isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),
			
			orderShowList:[],
        };
    },
    watch:{
		declaration:function(){
			console.log("this.declaration....",this.declaration);
			if (this.declaration) {
				let perssionData = this.isNullData(localStorage.getItem("MenuDataCode"))?null:JSON.parse(localStorage.getItem("MenuDataCode"));
		
        		this.orderShowList = getCustomDetailTopShowList(this.orderType,perssionData,this.showKeyDesc,this.declaration);
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

                    let countryTwoColumnDivs = document.getElementsByClassName("countryTwoColumnClass");
                    console.log("countryTwoColumnDivs....",countryTwoColumnDivs);
                    for (let index = 0; index < countryTwoColumnDivs.length; index++) {
                        const element = countryTwoColumnDivs[index];
                        element.style.height = countryHeight-11 +"px";
                    }
                },400)
            });
        }
    },
    created:function() {
        
    },
    mounted: function() {
        this.getShowArray();
    },
    methods: {
        getShowArray(){
            // let newArray = [];
            // for(let key in this.showData){
            //     newArray.push({key:key,value:this.showData[key]})
            // }

			// this.showArray = newArray;
			
			if (this.declaration) {
				let perssionData = this.isNullData(localStorage.getItem("MenuDataCode"))?null:JSON.parse(localStorage.getItem("MenuDataCode"));
		
        		this.orderShowList = getCustomDetailTopShowList(this.orderType,perssionData,this.showKeyDesc,this.declaration);
			}
        }
    }
};
</script>
<style scoped>
    .customMsgShow{
        position: relative;
        padding: 0px;
    }
    .leftSpan{
        position: relative;
        color:#333;
        font-weight:bold;
        font-size: 12px;
        margin-top: 2px;
    }
    .contentSpan{
        position: relative;
        display: block;
        color:#444;
        font-size: 12px;
		line-height: 25px;
    }
    .countryClass{
        display: block;
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
        width: calc(20% + 0.8px);
        min-height: 70px;
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
        width: calc(20% + 0.8px);
        min-height: 70px;
        vertical-align: top;
		height:auto;
        white-space:pre-wrap;
		padding-bottom: 9999px;
        margin-bottom: -9999px;
		/* text-overflow: ellipsis; */
	}
    /* .span-noautoshow{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px;
        padding: 8px 0px 8px 15px;
        text-align: left;
        width: calc(31%);
        height: 20px;
        vertical-align: top;
        white-space:nowrap;
    } */
    .fiveColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 5px 0px 4px 15px;
        text-align: left;
        width: calc(100% + 4px);
        min-height: 50px;
        vertical-align: top;
        white-space:nowrap;
    }
    .fourColumnClass{
        color:black;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        margin: -1px -2px 0px -3px;
        padding: 5px 0px 4px 15px;
        text-align: left;
        width: calc(80%);
        min-height: 50px;
        vertical-align: top;
        white-space:nowrap;
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
        padding: 5px 0px 4px 15px;
        text-align: left;
        width: calc(60% + 3px);
        min-height: 50px;
        vertical-align: top;
        white-space:nowrap;
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
        padding: 5px 0px 4px 15px;
        text-align: left;
        width: calc(40% + 3px);
        min-height: 50px;
        vertical-align: top;
        white-space:nowrap;
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
        padding: 5px 0px 4px 15px;
        text-align: left;
        width: calc(20% + 2px);
        min-height: 50px;
        vertical-align: top;
        white-space:nowrap;
    }
</style>
