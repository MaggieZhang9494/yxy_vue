
<template>
<!-- style="height: 800px;overflow:auto;overflow-x:hidden;" -->
    <div style="position: relative;width:auto; padding: 5px 10px 5px 10px;">
        <div id="deliveryTimeId" style="position: relative;width:100%; margin:0px;" v-if="deliveryTimeMsg && deliveryTimeMsg.timeNodeList && deliveryTimeMsg.timeNodeList.length>=1">
            <div class="timeNodeClass" v-for="(item,timeIndex) in deliveryTimeMsg.timeNodeList" :key="timeIndex"> 
                <!-- 每行节点显示数据 -->
                <div class="commonline" style="width: auto;position: relative; margin: 0px;" ></div>
                <div class="timeContentClass">
                    <!-- 节点左侧标题显示 -->
                    <div class="titleClass">
                        <el-tooltip effect="dark" placement="top-start">
                            <div slot="content">
                                <p v-for="(item, index) in item.nodeTips" :key="index">{{item+";"}}<br></p>
                                <!-- <p>合约版本规则：<br>(1) 12位以内数字小写字母以及“.”<br>(2) 数字或者小写字母开头，不能以“.”结尾<br>(3) 不能出现连续的“.”</p> -->
                            </div>
                            <i class="el-icon-info contract-icon font-10"></i>
                        </el-tooltip>
                        <span style="line-height:40px;">
                            <!-- <img style="position: relative;width:10px;height:10px;" src="../../../../../static/image/defaultHead.png"/> -->
                            
                            {{item.nodeTitle}}</span>
                    </div>
                    <!-- 右侧时间节点显示 -->
                    <el-popover
                        v-for="(showMsg,index) in deliveryTimeMsg.timeNodeList[timeIndex].showMsgList" :key="index"
                        placement="top-start"
                        width="250"
                        trigger="hover"
                        >
                        <!-- 'background-color':showMsg.backgroundColor, -->
                        <!-- <el-button slot="reference">hover 激活</el-button> -->
                        <div style="text-align:left;font-size:13px;">{{showMsg.startTimeDesc+"："+showMsg.startTime}}<br>{{showMsg.endTimeDesc+"："+showMsg.endTime}}</div>
                        <div slot="reference" class="rightTimeClass"
                            :style="{
                                'background-image': showMsg.backgroundImage,
                                'margin':showMsg.showStatus!=2?'0':'0 auto',
                                'width':showMsg.showStatus!=2?showMsg.width:'150px',
                                'left':showMsg.showStatus!=2?showMsg.left:showMsg.left}">
								<!-- 'calc(50% - 75px)' -->
                            <!-- <div v-if="showMsg.showStatus == 2" style="height:40px;line-height:40px;color:#fff;">
                                <span v-show="showMsg.showTitle || showMsg.showTitle!=''|| showMsg.showTitle!=' '" style="height:40px;line-height:40px;color:#fff;">{{showMsg.showTitle+"&nbsp;"}}</span>
                                <img style="position: absolute;top: 50%;margin-top: -10px;" src="../../../../../static/image/question.png"/>
                            </div>
                            <div v-else-if="showMsg.showStatus == 1" style="height:40px;line-height:40px;color:#fff;">
                                <span v-show="showMsg.showTitle || showMsg.showTitle!=''|| showMsg.showTitle!=' '" style="height:40px;line-height:40px;color:#fff;">{{showMsg.showTitle+"&nbsp;"}}</span>
                                <img style="position: absolute;top: 50%;margin-top: -10px;" src="../../../../../static/image/question.png"/>
                            </div> -->
                            
                            <span v-if="showMsg.showStatus == 2" style="height:40px;line-height:40px;color:#fff;">{{showMsg.showTitle?showMsg.showTitle+"&nbsp;":""}}<img style="position: relative;top: 5px;" src="../../../../../static/image/question.png"/></span>
                            <span v-else-if="showMsg.showStatus == 3" style="height:40px;line-height:40px;color:#fff;">{{showMsg.showTitle?showMsg.showTitle+"&nbsp;":""}}<img style="position: relative;top: 5px;" src="../../../../../static/image/question.png"/></span>
							<span v-else-if="showMsg.showStatus == 1" style="height:40px;line-height:40px;color:#fff;">{{showMsg.showTitle?showMsg.showTitle+"&nbsp;":""}}<img style="position: relative;top: 5px;" src="../../../../../static/image/question.png"/></span>
                            <span v-else style="height:40px;line-height:40px;color:#fff;">{{showMsg.showTitle}}</span>
                        </div>
                    </el-popover>
                    <!-- <div class="rightTimeClass" v-for="(showMsg,index) in deliveryTimeMsg.timeNodeList[timeIndex].showMsgList" :key="index"
                    :style="{
                        'background-color':showMsg.backgroundColor,
                        'margin':showMsg.showStatus!=2?'0':'0 auto',
                        'width':showMsg.showStatus!=2?showMsg.width:'150px',
                        'left':showMsg.showStatus!=2?showMsg.left:'calc(50% - 75px)'}">
                    
                        <span v-if="showMsg.showStatus == 2" style="line-height:40px;">{{showMsg.showTitle}}<img style="position: relative;width:10px;height:10px;" src="../../../../../static/image/defaultHead.png"/></span>
                        <span v-else-if="showMsg.showStatus == 1" style="line-height:40px;">{{showMsg.showTitle}}<img style="position: relative;width:10px;height:10px;" src="../../../../../static/image/defaultHead.png"/></span>
                        <span v-else style="line-height:40px;">{{showMsg.showTitle}}</span>
                    </div> -->
                </div>
                <div class="commonline" style="width: auto;position: relative; margin: 0px;" ></div>
            </div>
        </div>
        <div v-else style="position: relative;font-size:20px;top:150px;height:400px;color:#e5e5e5;text-align:center;">{{$t('message.common.noData')}}</div>
    </div>
</template>
<script>
import customStep from "../components/customStep";
import flowTimeLine from "../components/flow_timeline";
import {  } from "@/util/api";
import { getDeliveryTimeMsg } from "@/util/deliveryTimeParse";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "flowCourse",
    components: {
        "v-custom-step":customStep,
        "v-flow-timeline":flowTimeLine,
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
    },
    data: function() {
        return {
            // oneDayWidth:
            deliveryTimeMsg:{},
        }
    },
    created:function(){
        // this.deliveryTimeMsg = {
        //     orderType:"FE",//订单类型（出口订单）
        //     totalDayTime:24,//总的有效时间(天)
        //     validStartTime:"",//有效开始时间
        //     validEndTime:"",//有效结束时间
        //     timeNodeList:[{
        //         nodeTitle:"出货时间总览",
        //         showMsgList:[
        //             {
        //                 showStatus:0, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"启运港操作5D",
        //                 showTotalTime:5,
        //                 startTimeDesc:"实际到港日期",
        //                 startTime:"2017-02-03",
        //                 startDayTime:4, //开始显示天数
        //                 endTimeDesc:"货物送达完成日期",
        //                 endTime:"2017-02-09",
        //                 endDayTime:9, //结束显示天数
        //                 backgroundColor:"#444444",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //             {
        //                 showStatus:0, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"在港区1D",
        //                 showTotalTime:1,
        //                 startTimeDesc:"开始时间",
        //                 startTime:"2017-02-10",
        //                 startDayTime:12, //开始显示天数
        //                 endTimeDesc:"结束时间",
        //                 endTime:"2017-02-11",
        //                 endDayTime:13, //结束显示天数
        //                 backgroundColor:"#eeeeee",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //             {
        //                 showStatus:1, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"航程9D",
        //                 showTotalTime:6,
        //                 startTimeDesc:"实际离港日期",
        //                 startTime:"2017-02-11",
        //                 startDayTime:17, //开始显示天数
        //                 endTimeDesc:"实际到港日期",
        //                 endTime:"2017-02-20",
        //                 endDayTime:24, //结束显示天数
        //                 backgroundColor:"#111111",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //         ],
        //     },
        //     {
        //         nodeTitle:"航程",
        //         showMsgList:[
        //             {
        //                 showStatus:0, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"9D",
        //                 showTotalTime:6,
        //                 startTimeDesc:"实际离港日期",
        //                 startTime:"2017-02-11",
        //                 startDayTime:17, //开始显示天数
        //                 endTimeDesc:"实际到港日期",
        //                 endTime:"2017-02-20",
        //                 endDayTime:24, //结束显示天数
        //                 backgroundColor:"#111111",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //         ],
        //     },
        //     {
        //         nodeTitle:"订单",
        //         showMsgList:[
        //             {
        //                 showStatus:0, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"1D",
        //                 showTotalTime:24,
        //                 startTimeDesc:"客户委托日期",
        //                 startTime:"2017-02-11",
        //                 startDayTime:0, //开始显示天数
        //                 endTimeDesc:"单证齐全日期",
        //                 endTime:"2017-02-12",
        //                 endDayTime:24, //结束显示天数
        //                 backgroundColor:"#111111",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //         ],
        //     },
        //     {
        //         nodeTitle:"通关",
        //         showMsgList:[
        //             {
        //                 showStatus:0, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"4D",
        //                 showTotalTime:4,
        //                 startTimeDesc:"单证齐全日期",
        //                 startTime:"2017-02-11",
        //                 startDayTime:2, //开始显示天数
        //                 endTimeDesc:"通关货物放行日期",
        //                 endTime:"2017-02-20",
        //                 endDayTime:6, //结束显示天数
        //                 backgroundColor:"#111111",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //         ],
        //     },
        //     {
        //         nodeTitle:"运输",
        //         showMsgList:[
        //             {
        //                 showStatus:2, //显示状态 0：正常 1：只有开始日期没有结束日期 2：开始日期、结束日期都没有
        //                 showTitle:"",
        //                 showTotalTime:9,
        //                 startTimeDesc:"实际离港日期",
        //                 startTime:"2017-02-11",
        //                 startDayTime:"17", //开始显示天数
        //                 endTimeDesc:"实际到港日期",
        //                 endTime:"2017-02-20",
        //                 endDayTime:"24", //结束显示天数
        //                 backgroundColor:"#111111",
        //                 left:"", //组件显示left坐标
        //                 width:"" //内容显示宽度
        //             },
        //         ],
        //     }],
        // };
		//根据orderMsg获取节点时间显示列表
		let orderCopyMsg = JSON.parse(JSON.stringify(this.orderMsg));
        this.deliveryTimeMsg = getDeliveryTimeMsg(orderCopyMsg,this.businessDesc,this.orderType);
        console.log("this.deliveryTimeMsg.....",this.deliveryTimeMsg);
    },
    mounted: function() {
        //交付时间组件显示内容宽度
        let deliveryTimeDiv = document.getElementById("deliveryTimeId");
        if(!deliveryTimeDiv){
            return;
        }
        console.log("deliveryTimeDiv....",deliveryTimeDiv.clientWidth);
        let deliveryTimeDivWidth =  deliveryTimeDiv.clientWidth;// window.getComputedStyle(this.$refs.countryRef).height;
        //交付时间有效总时长（天）
		let totalDayTime = this.deliveryTimeMsg.totalDayTime;
		
		//获取显示状态异常(1、2、3)个数
		let nErrorStatus = 0;
		this.deliveryTimeMsg.timeNodeList.forEach(node => {
			let nNum = 0;
            node.showMsgList.forEach((item,index)=>{
				if(item.showStatus == 1 || item.showStatus == 2 || item.showStatus == 3){
					nNum++;
				}
			})
			if (nErrorStatus < nNum) {
				nErrorStatus = nNum;
			}
		});
		
        //一天时间，在页面上显示的宽度
		let oneDayWidth = (deliveryTimeDivWidth-300-nErrorStatus*150)/totalDayTime;

		//计算交付时间中显示每个节点的div显示的left与width
        this.deliveryTimeMsg.timeNodeList = this.deliveryTimeMsg.timeNodeList.map(node => {
			//记录是否存在状态为3的节点（开始时间没有，结束时间有），有的话后续节点顺序显示
			node.isHaveStatus3 = false;
            node.showMsgList = node.showMsgList.map((item,index)=>{
				item.left = 150+item.startDayTime * oneDayWidth + 'px';
				if(index==0){
					if(item.showStatus == 0){
						if((item.showTotalTime * oneDayWidth) < 20){
							item.width = 20 + 'px'; //当显示宽度小于20px时，默认显示20px
						}else{
							item.width = item.showTotalTime * oneDayWidth + 'px';
						}
						item.right = 150+item.startDayTime * oneDayWidth + item.showTotalTime * oneDayWidth + 'px';
					}else if(item.showStatus == 1){
						item.width = 150 + 'px';
						item.endTime = "?";
						item.right = 150+item.startDayTime * oneDayWidth + 150 + 'px';
					}else if(item.showStatus == 3){
						item.width = 150 + 'px';
						item.startTime = "?";
						item.right = 150+item.startDayTime * oneDayWidth + 150 + 'px';
						node.isHaveStatus3 = true;
					}else{
						item.width = 150 + 'px';
						item.startTime = "?";
						item.endTime = "?";
						item.left = 150+ parseInt((totalDayTime/2) * oneDayWidth) - 75 + 'px';
						item.right = parseInt(item.left.replace(/px/, "")) + 150 + 'px';
						node.isHaveStatus3 = true;
						console.log("item.left....",  item.left);
					}
				}else{
					if(item.showStatus == 0){
						if (node.isHaveStatus3 == true) {
							item.left = node.showMsgList[index-1].right;
						}
						if((item.showTotalTime * oneDayWidth) < 20){
							item.width = 20 + 'px'; //当显示宽度小于20px时，默认显示20px
						}else{
							item.width = item.showTotalTime * oneDayWidth + 'px';
						}
						item.right = parseInt(item.left.replace(/px/, "")) + item.showTotalTime * oneDayWidth + 'px';
					}else if(item.showStatus == 1){
						if (node.isHaveStatus3 == true) {
							item.left = node.showMsgList[index-1].right;
							console.log("item.left1....",  item.left);
						}
						item.width = 150 + 'px';
						item.endTime = "?";
						item.right = parseInt(item.left.replace(/px/, "")) + 150 + 'px';
					}else if(item.showStatus == 3){
						item.width = 150 + 'px';
						item.startTime = "?";
						if (node.isHaveStatus3 == true) {
							item.left = node.showMsgList[index-1].right;
						}
						node.isHaveStatus3 = true;
						item.right = parseInt(item.left.replace(/px/, "")) + 150 + 'px';
					}else{
						item.width = 150 + 'px';
						item.startTime = "?";
						item.endTime = "?";
						item.left = node.showMsgList[index-1].right;
						item.right = parseInt(item.left.replace(/px/, "")) + 150 + 'px';
					}
				}
                
                return item;
			})
			
			//处理特使场景，如果存在状态为3的节点，如果最后一个节点的结束时间有值，也就是状态为0、3，则将节点所有页面元素整体移动
			if(node.isHaveStatus3 == true){
				//获取最后节点
				let endNode = undefined;//node.showMsgList[node.showMsgList.length-1]
				let nIndex = node.showMsgList.length-1;
				for (let index = nIndex; index >= 0; index--) {
					let element = node.showMsgList[index];
					if (element.showStatus && (element.showStatus == 0 || element.showStatus == 3)) {
						endNode = JSON.parse(JSON.stringify(element));
						break;
					}
				}
				if (endNode != undefined) {
					//获取endNode节点真实结束时间显示到页面的y坐标
					let trueY = 150+endNode.endDayTime * oneDayWidth;
					//计算endNode节点真实结束时间显示到页面的y坐标，与endNode.right之间的差值
					let diffValue = parseInt(endNode.right.replace(/px/, "")) - trueY;

					console.log("trueY...",trueY);
					console.log("falseY...",parseInt(endNode.right.replace(/px/, "")));
					console.log("diffValue...",diffValue);

					node.showMsgList = node.showMsgList.map((item,index)=>{
						if (item.showStatus != 0) {
							//差值大于150，则进行差值计算
							if((parseInt(item.left.replace(/px/, "")) - diffValue) > 150){
								item.left = parseInt(item.left.replace(/px/, "")) - diffValue + 'px';
								item.right = parseInt(item.right.replace(/px/, "")) - diffValue + 'px';
							}else{
								//差值小于=150，则
								if (item.showStatus == 3) {
									item.left = 150+item.startDayTime * oneDayWidth + 'px';
									item.right = 150+item.endDayTime * oneDayWidth + 'px';
									if (item.endDayTime * oneDayWidth - item.startDayTime * oneDayWidth<=0) {
										item.width = 150+'px';
									}else{
										item.width = item.endDayTime * oneDayWidth - item.startDayTime * oneDayWidth + 'px'
									}
								}
							}
							
						}else{
							item.left = 150+item.startDayTime * oneDayWidth + 'px';
							if((item.showTotalTime * oneDayWidth) < 20){
								item.width = 20 + 'px'; //当显示宽度小于20px时，默认显示20px
							}else{
								item.width = item.showTotalTime * oneDayWidth + 'px';
							}
							item.right = 150+item.startDayTime * oneDayWidth + item.showTotalTime * oneDayWidth + 'px';
						}
						
						return item;
					})

				}
			}

            return node;
        });
        
    },
    methods: {
        /**
         * 展开隐藏
         */
        packupBtn:function (item,index) {
            item.isPackup = !item.isPackup;
            this.nodeList.splice(index,1,item);
        },
        /**
         * 更多单号
         */
        moreOddNum:function (item) {
            this.moreOddDialogVisible = true;
        }
    }
};
</script>
<style scoped>
    .timeNodeClass{
        position: relative; 
        padding: 5px 0px 5px 0px;
        text-align:left;
        white-space:nowrap;
    }
    .timeContentClass{
        position: relative;
        width:100%;
        text-align:left;
        height:40px;
    }
    .titleClass{
        display: inline-block;
        vertical-align: top;
        position: relative;
        text-align:center;
        width:150px;
        height:100%;
        background-color: rgb(250, 250, 250);
    }
    .rightTimeClass{
        display: inline-block;
        position: absolute;
        vertical-align: top;
        text-align:center;
        height:100%;
    }
    
</style>

