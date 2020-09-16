<template>
	<div >
		<div class="titleClass"><span style="line-height:40px;left:20px;position: relative;">{{$t('message.accountManagement.affiliatedCompany')}}</span></div>
		<div class="commonline" style="display: flex;width: 100%;position: relative; margin: 0px 0px 0px 0px;" ></div>
		<div class="companyShow">
			<div v-for="(item,index) in companyList" :key="index" class="columnClass">
				<span class="contentSpan">{{item.company_name}}</span> 
			</div>
		</div>
	</div>
</template>

<script>
import {  } from "@/util/api";
import router from "@/router";
export default {
    name: "companyMsg",
    props: {
        //公司列表
        companyList:{
            type:Array,
        },
    },
    data: function() {
        return {
			isEn:localStorage.getItem("internationalization")=="en"?true:false,
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
	.companyShow{
		position: relative;
		/* position:fixed; */
        background-color: rgb(250, 250, 250);
        padding: 10px 20px;
        text-align: left;
        width: calc(50% - 10px);;
        min-height: 20px;
        vertical-align: top;
	}
	.columnClass{
        color:#737a86;
        position: relative;
        display: inline-block;
        background-color: rgb(250, 250, 250);
        padding: 5px 10px;
        text-align: left;
        width: calc(50% - 10px);;
        min-height: 20px;
        vertical-align: top;
		height:auto;
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
