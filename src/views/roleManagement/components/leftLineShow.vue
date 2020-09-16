<template>
    <div class="leftLineShow">
        <span v-for="(item,index) in leftLineShowStatusArr" :key="index" :class="index==0?'firstLine':(item===false?'otherLine':'otherHideLine')"></span>
		<div v-if="!isLastCell" style="position: relative;display: inline-block;margin-left:7px;padding-left:20px;left:-3px;width:1px;border-left: 1px solid #e6e6e6;height: 40px;top: 0;">
			<div style="position: relative;width:20px;border-top: 1px solid #e6e6e6;height: 1px;top: 50%;margin-left:-20px;"></div>
		</div>
		<div v-else style="position: relative;display: inline-block;padding-left:20px;margin-left:7px;left:-3px;width:20px;border-left: 1px solid #e6e6e6;border-bottom: 1px solid #e6e6e6;height: 20px;vertical-align: top;">
		</div>
    </div>
</template>

<script>
import { networkList } from "@/util/api";
import router from "@/router";
export default {
    name: "leftLineShow",
    props: {
        //显示层级
        level:{
            type: Number,
            default:0
		},
		//是否是菜单组中最后一行显示
		isLastCell:{
			type: Boolean,
            default:false //默认不自动换行。为true时，columnNum无效
		},
		//左侧细线显示状态数组
		leftLineShowStatusArr:{
			type:Array,
			default:()=>{
                return []
            }  
		}
    },
    data: function() {
        return {
			showArray:[],
			isCn: localStorage.getItem('internationalization')=="zh-cn"?true:false,
            //是否是元初客户
            isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),
        };
    },
    watch:{
        
    },
    created:function() {
		console.log("leftLineShowStatusArr/...",this.leftLineShowStatusArr);
		// for (let index = 1; index <= this.level; index++) {
		// 	if (index < this.level) {
		// 		this.showArray.push("");
		// 	}
		// }
    },
    mounted: function() {
        
    },
    methods: {
        
    }
};
</script>
<style scoped>
	.leftLineShow {
		display: contents;
	}

	.firstLine{
		display: inline-block;
		padding-left:40px;
		width:1px;
		border-left: 1px solid #e6e6e6;
		height: 40px;
		top: 0;
		position: relative;
		left:4px;
	}
	.otherLine{
		display: inline-block;
		padding-left:40px;
		margin-left:7px;
		width:1px;
		border-left: 1px solid #e6e6e6;
		height: 40px;top: 0;
	}
	.otherHideLine{
		display: inline-block;
		padding-left:40px;
		margin-left:7px;
		width:1px;
		border-left: 0px solid #fff;
		height: 40px;
		top: 0;
	}
</style>
