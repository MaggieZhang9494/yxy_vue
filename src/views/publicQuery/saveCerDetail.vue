<template>
	<div style="overflow: hidden;margin-bottom: 10px;">
		<div class="titleClass"><span style="line-height:40px;left:10px;position: relative;">{{$t('message.publicQuery.saveCerInfo')}}</span></div>
		<div class="commonline" style="display: flex;width: auto;position: relative; margin: 0px 10px 0px 10px;" ></div>
		<div class="orderMsgShow" v-if="showData!=null && showData!=undefined">
			<div class="columnClass" v-for="(item,index) in showData.certInfo.frontPageArr" :key="index">
				<span class="leftSpan">{{item}}</span>
			</div>
		</div>
		<div class="lineVerParent" style="" v-if="(showData.certInfo.secPageArr && showData.certInfo.secPageArr.length)>0"></div>
		<div class="fileShow" v-if="(showData.certInfo.secPageArr && showData.certInfo.secPageArr.length)>0">
			<div class="fileTitle">
				<span class="leftSpan">{{$t('message.publicQuery.follower')}}</span>
			</div>
			<div class="fileContent">
				<span class="leftSpan" style="vertical-align: top;">{{(showData.certInfo.secPageArr && showData.certInfo.secPageArr.length)>0?showData.certInfo.secPageArr[0]:($t('message.businessDetail.cus_no')+':')}}</span>
				<div style="display:inline-block;" v-if="(showData.certInfo.secPageArr && showData.certInfo.secPageArr.length)>1">
					<div style="min-height: 20px;position: relative;padding:0px;" v-for="(item,index) in showData.certInfo.secPageArr[1]">
						<span class="contentSpan">{{index+1+". "+item}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
export default {
    name: "saveCerDetail",
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
        //订单进出口类型： "FI"进口:"FE"出口
        orderType:{
            type:String
        }
    },
    data: function() {
        return {
			isEn:localStorage.getItem("internationalization")=="en"?true:false,

			customNumList:[]
        };
    },
    created:function() {
        
    },
    mounted: function() {
		let _this = this;

    },
    methods: {

    }
};
</script>
<style scoped>
	.titleClass{
		position: relative;
		height: 40px;
		width: 100%;
		color:#333;
        font-weight:bold;
        font-size: 12px;
	}
	.orderMsgShow{
		position: relative;
		display: inline-block;
		vertical-align: top;
		width: calc(50% - 10px);
		padding: 10px 10px 10px 10px;
	}
	/* 细线样式 */
	.lineVerParent {
		position: relative;
		display: inline-block;
		vertical-align: top;
		width: 1px;
		background-color: #e5e5e5;
		margin-top: 10px;
		margin-bottom: -99999px;
		padding-bottom: 99999px;
	}
	.lineVer{
		/* position: relative;
		display: inline-block;
		vertical-align: top;
		width: 1px;
		background-color: #e5e5e5;
		margin-top: 10px; */
		/* margin-bottom: -99999px;
		padding-bottom: 99999px; */
	}
	.fileShow{
		position: relative;
		display: inline-block;
		vertical-align: top;
		width: calc(50% - 10px);
		padding: 10px 10px 10px 10px;
	}
	.columnClass{
        color:#737a86;
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        padding: 2px 0px;
        text-align: left;
        width: 100%;
        min-height: 20px;
        vertical-align: top;
		height:auto;
		word-wrap: break-word;
		/* text-overflow: ellipsis; */
    }
    .leftSpan{
        color:#737a86;
        font-weight:normal;
        font-size: 12px;
    }
    .contentSpan{
		display: inline-block;
		font-weight:normal;
        color:#737a86;
        font-size: 12px;
	}
</style>
