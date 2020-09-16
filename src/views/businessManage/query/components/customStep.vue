<template>
    <div class="steptitle">
        <div class="firstStep">
            <span style="position: relative;color:#333;font-weight:bold;left:30px;">{{$t('message.businessSearch.status')}}</span>
        </div>
        <div v-if="orderType=='FE'&& perssionData.dataMenu['DATA.FE.ORDER_STATUS'].isSee==true" class="otherStep">
            <el-divider direction="vertical"></el-divider>
            <span style="color:#333;"><span style="color:#333;font-weight:bold">{{$t('message.businessSearch.order')}}</span>：{{orderMsg.ORDER_STATUS}}</span>
        </div>
        <div v-if="orderType=='FE'&& perssionData.dataMenu['DATA.FE.INSPECTION_STATUS'].isSee==true" class="secondStep">
            <el-divider direction="vertical"></el-divider>
            <span style="color:#333;"><span style="color:#333;font-weight:bold">{{$t('message.businessSearch.customsClearance')}}</span>：{{orderMsg.INSPECTION_STATUS}}</span>
        </div>
        <div v-if="orderType=='FE'&& perssionData.dataMenu['DATA.FE.CARGO_STATUS'].isSee==true" class="otherStep">
            <el-divider direction="vertical"></el-divider>
            <span style="color:#333;"><span style="color:#333;font-weight:bold">{{$t('message.businessSearch.trans')}}</span>：{{orderMsg.CARGO_STATUS}}</span>
        </div>

		<div v-if="orderType=='FI'&& perssionData.dataMenu['DATA.FI.ORDER_STATUS'].isSee==true" class="otherStep">
            <el-divider direction="vertical"></el-divider>
            <span style="color:#333;"><span style="color:#333;font-weight:bold">{{$t('message.businessSearch.order')}}</span>：{{orderMsg.ORDER_STATUS}}</span>
        </div>
        <div v-if="orderType=='FI'&& perssionData.dataMenu['DATA.FI.INSPECTION_STATUS'].isSee==true" class="secondStep">
            <el-divider direction="vertical"></el-divider>
            <span style="color:#333;"><span style="color:#333;font-weight:bold">{{$t('message.businessSearch.customsClearance')}}</span>：{{orderMsg.INSPECTION_STATUS}}</span>
        </div>
        <div v-if="orderType=='FI'&& perssionData.dataMenu['DATA.FI.CARGO_STATUS'].isSee==true" class="otherStep">
            <el-divider direction="vertical"></el-divider>
            <span style="color:#333;"><span style="color:#333;font-weight:bold">{{$t('message.businessSearch.trans')}}</span>：{{orderMsg.CARGO_STATUS}}</span>
        </div>
    </div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
export default {
    name: "customStep",
    props: {
        orderMsg:{
            type:Object,
            default:()=>{
                return {};
            }
		},
		orderType:{
			type:String
		},
		perssionData:{
			type:Object,
            default:()=>{
                return {};
            }
		}
        //显示数据对象，key:value格式
        // showData:{
        //     type:Object,
        //     default:{
                
        //     }
        // },
    },
    data: function() {
        return {
            showArray:[],
        };
    },
    created:function() {

    },
    mounted: function() {
        let stepItems = document.getElementsByClassName('otherStep');
        let steptitle = document.getElementsByClassName('steptitle');
        let columnNum = stepItems.length+1;
        let firstStep = document.getElementsByClassName('firstStep');
        firstStep[0].style.width = (steptitle[0].clientWidth-40)/columnNum +'px';
        for (let index = 0; index < stepItems.length; index++) {
            const element = stepItems[index];
            element.style.width = (steptitle[0].clientWidth-40)/columnNum +'px';//100/columnNum+'%';
        }
    },
    methods: {

    }
};
</script>
<style scoped>
    .steptitle{
        display: flex;
        align-items: center; /*定义body的元素垂直居中*/
        /* justify-content: center; */
        position: relative; 
        margin: 10px 20px 10px 20px; 
        border: 1px solid;
        border-color: rgb(231, 231, 231);
        background-color: rgb(250, 250, 250);
        height: 35px;
        text-align: left;
    }
    /* 中文版本 */
    .zh-cn .firstStep{
        display: inline-block;
        position: relative;
        min-width: 100px !important;
        width: 210px !important;
        /* text-align: left; */
        /* left: -20px; */
        /* height: 35px; */
    }
    .zh-cn .secondStep{
        display: inline-block;
        position: relative;
        text-align: left;
        min-width: 200px !important;
        width: calc(33.33% - 70px) !important;
    }
    .zh-cn .otherStep{
        display: inline-block;
        position: relative;
        text-align: left;
        min-width: 200px !important;
        width: calc(33.33% - 70px) !important;
    }
    /* 英文版本 */
    .en .firstStep{
        display: inline-block;
        position: relative;
        min-width: 100px !important;
        width: 150px !important;
        /* text-align: left; */
        /* left: 0px; */
        /* height: 35px; */
    }
    .en .secondStep{
        display: inline-block;
        position: relative;
        min-width: 500px !important;
        /* text-align: left; */
        /* left: -20px; */
        /* height: 35px; */
    }
    .en .otherStep{
        display: inline-block;
        position: relative;
        text-align: left;
        min-width: 200px !important;
        width: calc(50% - 325px) !important;
        /* left:20px; */
        /* height: 35px; */
    }
</style>
