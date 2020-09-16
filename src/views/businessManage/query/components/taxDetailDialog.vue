<template>
    <div style="po">
        <div class="commonline"></div>
        <div v-if="taxData && headShowList.length>0" class="taxMsgShow">
			<div class="itemDiv">
				<div v-for="(item,index) in headShowList" :key="index" class="itemautoshow">
					<span class="leftSpan">{{item.name}}：</span>
					<span class="contentSpan">{{item.value}}</span>  
				</div>
			</div>
			<!-- 报关单号、税单序号、税种 -->
			<!-- <div> -->
				<!-- 报关单号 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.cus_no')}}：</span>
					<span class="contentSpan">{{taxDetailDialogOptions.CUS_NO}}</span> 
				</div> -->
				<!-- 税单序号 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.seqOfTaxBill')}}：</span>
					<span class="contentSpan">{{taxData.DUTY_NO}}</span> 
				</div> -->
				<!-- 税种 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.taxType')}}：</span>
					<span class="contentSpan">{{taxData.DUTY_TYPE}}</span>
				</div>
			</div> -->
			<!-- 税款金额、监管方式、征免性质 -->
			<!-- <div> -->
				<!-- 税款金额 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.taxAmount')}}：</span>
					<span class="contentSpan">{{taxData.DUTY_AMOUNT}}</span> 
				</div> -->
				<!-- 监管方式 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.customsSupervisionMode')}}：</span>
					<span class="contentSpan">{{taxDetailDialogOptions.TRADE_MODE_NAME}}</span> 
				</div> -->
				<!-- 征免性质 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.dutyLevyExemption')}}：</span>
					<span class="contentSpan">{{taxDetailDialogOptions.CUT_NAME}}</span> 
				</div>
			</div> -->
			<!-- 退补税标志、滞报滞纳标志 -->
			<!-- <div> -->
				<!-- 退补税标志 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.indicatorOfRefundOverdue')}}：</span>
					<span class="contentSpan">{{taxData.B_DUTY_FLAG}}</span> 
				</div> -->
				<!-- 滞报滞纳标志 -->
				<!-- <div class="twoColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.indicatorOfDeclLate')}}：</span>
					<span class="contentSpan">{{taxData.Z_DUTY_FLAG}}</span> 
				</div>
			</div> -->
			<!-- 申报口岸、进出口岸 -->
			<!-- <div> -->
				<!-- 申报口岸 -->
				<!-- <div class="threeColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.portOfDeclare')}}：</span>
					<span class="contentSpan">{{taxDetailDialogOptions.CUSTOMS_NAME}}</span> 
				</div> -->
				<!-- 进出口岸 -->
				<!-- <div class="twoColumnClass" id="noautoDiv">
					<span class="leftSpan">{{$t('message.businessDetail.portOfIm_Export')}}：</span>
					<span class="contentSpan">{{taxDetailDialogOptions.ENTY_PORT_NAME}}</span> 
				</div>
			</div> -->
		</div>
		<div v-if="taxData && headShowList.length>0" class="dottedLine">
			<hr style="border-width: 0px 0px 1px 0px;border-style: dashed;
			border-color: #e5e5e5;height: 0px; height:0px;">
		</div>
		
		<div v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST'].isSee==true && cargoHeader.length>0" class="cargoDeatilTitle">{{$t('message.businessDetail.taxBillCargoInfo')}}</div>
        <div v-if="perssionData.dataMenu['DATA.FI.DECLARATION_LIST.DECLARATION_DUTY.DECLARATION_DUTY_ITEM_LIST'].isSee==true && cargoHeader.length>0" class="cargo-table">
            <el-table :data="cargoList" max-height="500px" row-key="id" tooltip-effect="light" v-loading="loading">
                <el-table-column
                    :label="$t('message.businessSearch.number')"
                    type="index"
                    align="center"
                    width="50">
                    <template slot-scope="scope">
                        <span>{{scope.row["number"]}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column fixed="left" label="工作号" show-overflow-tooltip align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row['workNum']}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column v-for="head in cargoHeader" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row[head.enName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { getExportPreviewData } from "@/util/api";
import router from "@/router";
import { getPayDetailTopShowList, getCargoHeaderList } from '@/util/role/menuDataShowDeal'

export default {
    name: "taxDetailDialog",
    props: {
        // orderMsg:{
        //     type:Object,
        //     default:()=>{
        //         return {};
        //     }
        // },
        //显示业务字段对应的中英文描述，key:value格式
        showKeyDesc:{
            type:Object,
            default:()=>{
                return {}
            }    
        },
        taxDetailDialogOptions: {
            type: Object
		},
		perssionData:{
            type:Object,
            default:()=>{
                return {}
            }    
        },  
    },
    data() {
        return {
			loading:false,
			//某一税种对应的详情数据对象，key:value格式
			taxData:{},
			
            cargoHeader:[],
			//货物列表
			cargoList: [],
			
			//顶部平铺数据显示列表
			headShowList:[],
        };
    },
    created(){
		let _this = this;
		// this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))
		// _this.taxData = _this.taxDetailDialogOptions;

		console.log("_this.perssionData...", _this.perssionData);

		//根据税种过滤，获取对应税种详细信息
		let dutyType = _this.taxDetailDialogOptions.taxType;
		if (_this.taxDetailDialogOptions.DECLARATION_DUTY) {
			console.log("_this.taxDetailDialogOptions...", _this.taxDetailDialogOptions);
			console.log("_this.taxDetailDialogOptions.DECLARATION_DUTY...", _this.taxDetailDialogOptions.DECLARATION_DUTY);
			_this.taxDetailDialogOptions.DECLARATION_DUTY.forEach(element => {
				if (element.DUTY_TYPE === dutyType) {
					_this.taxData = JSON.parse(JSON.stringify(element));
				}
			});
			if (_this.taxData.DECLARATION_DUTY_ITEM_LIST) {
				//获取税费单货物信息
				_this.cargoList = _this.taxData.DECLARATION_DUTY_ITEM_LIST.map((item,index)=>{
                    item.number = index+1;
                    return item;
                });
			}
		}

		_this.headShowList = getPayDetailTopShowList(_this.perssionData,_this.taxDetailDialogOptions,_this.taxData);
		_this.cargoHeader = getCargoHeaderList(_this.perssionData);
    },
    mounted() {
        // let params = _this.previewDialogOptions.searchParams;
        // let export_item = _this.previewDialogOptions.export_item;

        // params.export_item = export_item;
        // params.limit = _this.limitNum;

        // _this.getExportPreData(params);
    },
    methods: {
        // getExportPreData(params){
        //     let _this = this;
        //     _this.loading = true;
        //     getExportPreviewData(params).then(res => {
        //         if (res.data.code === 0) {
        //             let resData = res.data.data;
                    
        //             _this.dealTableShowData(resData).then(res=>{
        //                 _this.loading = false;
        //             }).catch(err => {
        //                 _this.loading = false;
        //             })
        //         } else {
        //             _this.loading = false;
        //             let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
        //             this.$message({
        //                 type: "error",
        //                 message: message
        //             });
        //         }
        //     })
        //     .catch(err => {
        //         this.loading = false;
        //         let message = this.$i18n.t('message.common.systemError');
        //         if(err && err.data && err.data.code){
        //             message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
        //         }
        //         this.$message({
        //             type: "error",
        //             message: message
        //         });
        //     });
        // },

        // /**
        //  * 处理预览数据
        //  * */
        // dealTableShowData(resData){
        //     let _this = this;
        //     return new Promise((resolve, reject) => {
        //         if(!resData || resData.length<1){
        //             reject(_this.$i18n.t('message.common.noData'));
        //         }else{
        //             //获取table头部显示数据
        //             let heads = resData[0];
        //             heads.forEach((element,index) => {
        //                 if(index>0){
        //                     let key = "keyHead"+index;
        //                     let value = element;
        //                     _this.orderHeader.push({enName:key,name:value});
        //                 }
                        
        //             });
        //             //获取table内容显示数据
        //             let msgList = resData.slice(1,resData.length);
        //             msgList.forEach(element => {
        //                 let msgObj = {};
        //                 element.forEach((item,index) => {
        //                     let key = "keyHead"+index;
        //                     let value = item;
        //                     msgObj[key] = item;
        //                 });
        //                 _this.orderList.push(msgObj);
        //             });

        //             resolve();
        //         }
        //     })
        // }
    }
};
</script>
<style scoped>
	.taxMsgShow{
        position: relative;
        padding: 20px;
    }
	.itemDiv {
		border: solid;
        border-width: 0px 0px 1px 0px;
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
	.leftSpan{
        color:#333;
        font-weight:500;
        font-size: 14px;
		font-family: "webfont",Arial,sans-serif;
		font-style: normal;
    }
    .contentSpan{
        display: inline-block;
        color:#444;
        font-size: 14px;
		font-family: "webfont",Arial,sans-serif;
		font-style: normal;
    }
	.threeColumnClass{
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
        height: 25px;
        vertical-align: top;
        white-space:nowrap;
    }
    .twoColumnClass{
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
        height: 25px;
        vertical-align: top;
        white-space:nowrap;
    }
    .oneColumnClass{
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
        height: 25px;
        vertical-align: top;
        white-space:nowrap;
    }

	.dottedLine{
		margin: 0px 18px;
		background-color: white;
	}
	.cargoDeatilTitle{
		margin: 10px 18px 0px;
		height: 35px;
		color: #333;
		font-weight:500;
        font-size: 15px;
		font-family: "webfont",Arial,sans-serif;
		font-style: normal;
		/* background-color: rgb(250, 250, 250); */
	}

    .cargo-table{
        position: relative;
        margin: 0px 16px 10px 16px;
        /* height: 700px; */
    }
    .cargo-table /deep/ .el-table th>.cell{
        padding: 5px 12px;
        line-height: 25px;
    }
</style>
