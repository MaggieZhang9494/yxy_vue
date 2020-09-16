
<template>
<!-- style="height: 800px;overflow:auto;overflow-x:hidden;" -->
    <div style="position: relative; width:100%;">
        <v-custom-step :orderMsg="orderMsg" :orderType="orderType" :perssionData="perssionData"></v-custom-step>
        <div class="commonline" style="display: flex;width: auto;position: relative; margin: 10px 20px 0px 20px;" ></div>
        <!-- overflow-y:scroll;    overflow-x: hidden; -->
        <div style="height: 100%;margin: 0px 20px 0px 20px;padding-right: 21px;padding-bottom: 20px;">
			<!-- 被记录报 进口 -->
			<div v-if="orderType=='FI' && orderMsg && orderMsg.ORDER_ERROR_LIST && orderMsg.ORDER_ERROR_LIST.length>0 && perssionData.dataMenu['DATA.FI.ORDER_ERROR_LIST'].isSee==true" class="nodeClass">
				<div  class="leftNodeClass">
                    <div>
                        <span style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{$t('message.businessDetail.customRecord')}}: </span>
                    </div>
                </div>
				<div class="rightNodeListClass">
					<div class="packupBtn" v-if="orderMsg.ORDER_ERROR_LIST.length>1" @click="packupErrorBtn(item,index)">
                        <i :class="[!isErrorPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <div class="packupBtn" style="width:17px;" v-else></div>
                    <!-- 被记录报信息 -->
					<div class="tableDiv">
						<el-table class="dataTable" tooltip-effect="light" :data="errorShowList">
							<el-table-column v-for="(head,index) in errorHeader" :width="index==0?'360':''" :label="head.name" :key="head.enName" align="left" show-overflow-tooltip>
								<template  slot-scope="scope">
									<div v-if="index === 0" style="">
										<div class="leftLineClass">
											<div class="dotClass"></div>
											<div class="verticalLineClass"></div>
										</div>
										<div class="nodeMsgClass">
											<div>
												<span>{{scope.row[head.enName]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.businessSearch.cochainTime')}}：</span>
												<span class="chainTimestamp">{{scope.row["ERRORDATE_CHAIN_TIME"]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.common.timestamp')}}：</span>
												<span class="chainTimestamp">{{timeStrToTimestamp(scope.row["ERRORDATE_CHAIN_TIME"])}}</span>
											</div>
										</div>
									</div>
									<span v-else>{{scope.row[head.enName]}}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
                </div>
			</div>
			<!-- 被记录报 出口 -->
			<div v-if="orderType=='FE' && orderMsg && orderMsg.ORDER_ERROR_LIST && orderMsg.ORDER_ERROR_LIST.length>0 && perssionData.dataMenu['DATA.FE.ORDER_ERROR_LIST'].isSee==true" class="nodeClass">
				<div  class="leftNodeClass">
                    <div>
                        <span style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{$t('message.businessDetail.customRecord')}}: </span>
                    </div>
                </div>
				<div class="rightNodeListClass">
					<div class="packupBtn" v-if="orderMsg.ORDER_ERROR_LIST.length>1" @click="packupErrorBtn(item,index)">
                        <i :class="[!isErrorPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <div class="packupBtn" style="width:17px;" v-else></div>
                    <!-- 被记录报信息 -->
					<div class="tableDiv">
						<el-table class="dataTable" tooltip-effect="light" :data="errorShowList">
							<el-table-column v-for="(head,index) in errorHeader" :width="index==0?'360':''" :label="head.name" :key="head.enName" align="left" show-overflow-tooltip>
								<template  slot-scope="scope">
									<div v-if="index === 0" style="">
										<div class="leftLineClass">
											<div class="dotClass"></div>
											<div class="verticalLineClass"></div>
										</div>
										<div class="nodeMsgClass">
											<div>
												<span>{{scope.row[head.enName]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.businessSearch.cochainTime')}}：</span>
												<span class="chainTimestamp">{{scope.row["ERRORDATE_CHAIN_TIME"]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.common.timestamp')}}：</span>
												<span class="chainTimestamp">{{timeStrToTimestamp(scope.row["ERRORDATE_CHAIN_TIME"])}}</span>
											</div>
										</div>
									</div>
									<span v-else>{{scope.row[head.enName]}}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
                </div>
			</div>
			<!-- 退改单记录 进口 -->
			<div v-if="orderType=='FI' && orderMsg && orderMsg.ORDER_PROBLEM_REMARK && orderMsg.ORDER_PROBLEM_REMARK.length>0 && perssionData.dataMenu['DATA.FI.ORDER_PROBLEM_REMARK'].isSee==true" class="nodeClass">
				<div  class="leftNodeClass">
                    <div>
                        <span style="position: relative;left: 0px;color:#333;font-size:14px;font-weight:600">{{$t('message.businessDetail.returnCorrRecord')}}: </span>
                    </div>
                </div>
				<div class="rightNodeListClass">
					<div class="packupBtn" v-if="orderMsg.ORDER_PROBLEM_REMARK.length>1" @click="packupProblemBtn(item,index)">
                        <i :class="[!isProblemPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <div class="packupBtn" style="width:17px;" v-else></div>
                    <!-- 退改单信息 -->
					<div class="tableDiv">
						<el-table class="dataTable" tooltip-effect="light" :data="problemShowList">
							<el-table-column v-for="(head,index) in problemHeader" :width="index==0?'360':''" :label="head.name" :key="head.enName" align="left" show-overflow-tooltip>
								<template  slot-scope="scope">
									<div v-if="index === 0" style="">
										<div class="leftLineClass">
											<div class="dotClass"></div>
											<div class="verticalLineClass"></div>
										</div>
										<div class="nodeMsgClass">
											<div>
												<span>{{scope.row[head.enName]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.businessSearch.cochainTime')}}：</span>
												<span class="chainTimestamp">{{scope.row["CREATE_DATE_CHAIN_TIME"]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.common.timestamp')}}：</span>
												<span class="chainTimestamp">{{timeStrToTimestamp(scope.row["CREATE_DATE_CHAIN_TIME"])}}</span>
											</div>
										</div>
									</div>
									<span v-else>{{scope.row[head.enName]}}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
                </div>
			</div>
			<!-- 退改单记录 出口 -->
			<div v-if="orderType=='FE' && orderMsg && orderMsg.ORDER_PROBLEM_REMARK && orderMsg.ORDER_PROBLEM_REMARK.length>0 && perssionData.dataMenu['DATA.FE.ORDER_PROBLEM_REMARK'].isSee==true" class="nodeClass">
				<div  class="leftNodeClass">
                    <div>
                        <span style="position: relative;left: 0px;color:#333;font-size:14px;font-weight:600">{{$t('message.businessDetail.returnCorrRecord')}}: </span>
                    </div>
                </div>
				<div class="rightNodeListClass">
					<div class="packupBtn" v-if="orderMsg.ORDER_PROBLEM_REMARK.length>1" @click="packupProblemBtn(item,index)">
                        <i :class="[!isProblemPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <div class="packupBtn" style="width:17px;" v-else></div>
                    <!-- 退改单信息 -->
					<div class="tableDiv">
						<el-table class="dataTable" tooltip-effect="light" :data="problemShowList">
							<el-table-column v-for="(head,index) in problemHeader" :width="index==0?'360':''" :label="head.name" :key="head.enName" align="left" show-overflow-tooltip>
								<template  slot-scope="scope">
									<div v-if="index === 0" style="">
										<div class="leftLineClass">
											<div class="dotClass"></div>
											<div class="verticalLineClass"></div>
										</div>
										<div class="nodeMsgClass">
											<div>
												<span>{{scope.row[head.enName]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.businessSearch.cochainTime')}}：</span>
												<span class="chainTimestamp">{{scope.row["CREATE_DATE_CHAIN_TIME"]}}</span>
											</div>
											<div>
												<span class="chainTime">{{$t('message.common.timestamp')}}：</span>
												<span class="chainTimestamp">{{timeStrToTimestamp(scope.row["CREATE_DATE_CHAIN_TIME"])}}</span>
											</div>
										</div>
									</div>
									<span v-else>{{scope.row[head.enName]}}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
                </div>
			</div>
			<!-- 审单过程 进口-->
			<div v-if="orderType=='FI' && orderMsg && orderMsg.ORDER_AUDIT_LIST && perssionData.dataMenu['DATA.FI.ORDER_AUDIT_LIST'].isSee==true" class="nodeClass">
				<div  class="leftNodeClass">
                    <div>
                        <span style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{$t('message.businessDetail.review')}}: </span>
                    </div>
					<!-- 报关单数 进口-->
					<div v-if="orderType=='FI' && perssionData.dataMenu['DATA.FI.DECLARATION_NUM'].isSee==true" class="rightDetailItem">
                        <span style="position: relative;display: inline-block;word-wrap: break-word;color:#333;font-size:14px;">{{$t('message.businessDetail.customNum')}}: </span>
						<span style="position: relative;display: inline-block;word-wrap: break-word;color:#868686;font-size:14px;">{{orderMsg.CALCULATE_DECLARATION_COUNT?orderMsg.CALCULATE_DECLARATION_COUNT:orderMsg.DECLARATION_NUM}}</span>
                    </div>
					<!-- 品名个数 进口-->
					<div v-if="orderType=='FI' && perssionData.dataMenu['DATA.FI.CARGO_NAME_NUM'].isSee==true" class="rightDetailItem">
                        <span style="position: relative;display: inline-block;word-wrap: break-word;color:#333;font-size:14px;">{{$t('message.businessDetail.numOfGoods')}}: </span>
						<span style="position: relative;display: inline-block;word-wrap: break-word;color:#868686;font-size:14px;">{{orderMsg.CARGO_NAME_NUM?orderMsg.CARGO_NAME_NUM:totalNumName}}</span>
                    </div>
                </div>
				<div class="rightNodeListClass">
					<div class="packupBtn" @click="packupAuditBtn()">
                        <i :class="[!isAuditPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <!-- 节点数据 -->
                    <v-flow-timeline :isHidden="isAuditPackup" v-show="auditRightNodeList.length>0" :nodeData="auditRightNodeList"></v-flow-timeline>
                </div>
			</div>
			<!-- 审单过程 出口-->
			<div v-if="orderType=='FE' && orderMsg && orderMsg.ORDER_AUDIT_LIST  && perssionData.dataMenu['DATA.FE.ORDER_AUDIT_LIST'].isSee==true" class="nodeClass">
				<div  class="leftNodeClass">
                    <div>
                        <span style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{$t('message.businessDetail.review')}}: </span>
                    </div>
					<!-- 报关单数 出口-->
					<div v-if="orderType=='FE' && perssionData.dataMenu['DATA.FE.DECLARATION_NUM'].isSee==true" class="rightDetailItem">
                        <span style="position: relative;display: inline-block;word-wrap: break-word;color:#333;font-size:14px;">{{$t('message.businessDetail.customNum')}}: </span>
						<span style="position: relative;display: inline-block;word-wrap: break-word;color:#868686;font-size:14px;">{{orderMsg.CALCULATE_DECLARATION_COUNT?orderMsg.CALCULATE_DECLARATION_COUNT:orderMsg.DECLARATION_NUM}}</span>
                    </div>
					<!-- 品名个数 出口-->
					<div v-if="orderType=='FE' && perssionData.dataMenu['DATA.FE.CARGO_NAME_NUM'].isSee==true" class="rightDetailItem">
                        <span style="position: relative;display: inline-block;word-wrap: break-word;color:#333;font-size:14px;">{{$t('message.businessDetail.numOfGoods')}}: </span>
						<span style="position: relative;display: inline-block;word-wrap: break-word;color:#868686;font-size:14px;">{{orderMsg.CARGO_NAME_NUM?orderMsg.CARGO_NAME_NUM:totalNumName}}</span>
                    </div>
                </div>
				<div class="rightNodeListClass">
					<div class="packupBtn" @click="packupAuditBtn()">
                        <i :class="[!isAuditPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <!-- 节点数据 -->
                    <v-flow-timeline :isHidden="isAuditPackup" v-show="auditRightNodeList.length>0" :nodeData="auditRightNodeList"></v-flow-timeline>
                </div>
			</div>
            <!-- <div class="nodeClass"  v-for="(item, index) in nodeList" :key="index">
                <div class="leftNodeClass">
                    <div class="nodeMsgClass">
                        <span v-if="item.isHideColon==true" style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{item.nodeName}}</span>
                        <span v-else style="position: relative;left: 0px;display: inline-block;color:#333;font-size:14px;font-weight:600">{{item.nodeName}}:</span>
                    </div>
                    <div class="rightDetailItem" v-for="(detail,index) in item.nodeDetail" :key="index">
                        <span style="position: relative;display: inline-block;word-wrap: break-word;color:#333;font-size:14px;">{{detail.key}}: </span>

                        <span v-if="detail.key == businessDesc['DECLARATION_LIST.CUS_NO']" style="position: relative;display: inline-block;word-wrap: break-word;color:#1585FF;font-size:14px;cursor:pointer;" @click="touchBillNum(detail.value)">{{detail.value}}</span>
                        <span v-else style="position: relative;display: inline-block;word-wrap: break-word;color:#868686;font-size:14px;">{{detail.value}}</span>
                    </div>
                    <el-button v-show="item.nodeName == $t('message.businessSearch.customs')" type="text" v-if="orderMsg.DECLARATION_LIST && orderMsg.DECLARATION_LIST.length>1" style="font-size:12px;" @click="moreOddNum(item)">{{$t('message.businessSearch.moreOrderNum')}}</el-button>
                </div>
                <div class="rightNodeListClass">
                    <div class="packupBtn" v-if="item.isShowPackupBtn==true" @click="packupBtn(item,index)">
                        <i :class="[!item.isPackup?'iconfont wbs-shouqi':'iconfont wbs-zhankai']" style="color:#1585FF;" ></i>
                    </div>
                    <div class="packupBtn" style="width:17px;" v-else></div>
                    <v-flow-timeline :isHidden="item.isPackup" v-show="item.nodeList" :nodeData="item.nodeList"></v-flow-timeline>
                </div>

                <el-dialog :title="$t('message.businessSearch.moreOrderNum')" :visible.sync="moreBillNumDialogVisible" width="40%" :append-to-body="false" :center="true" class="dialog-wrapper" v-if="moreBillNumDialogVisible">
                    <div class="commonline"></div>
                    <div style="padding:20px;height:400px;overflow-x:hidden;overflow:auto;">
                        <div style="text-align:center;" v-for="(billnum,index) in billNumArr" :key="index">
                            <span style="position: relative;display: inline-block;width:100%;word-wrap: break-word;color:#1b7aff;font-size:14px;">
                                <span style="color:#333;">{{'报关单号'}}</span> :<span style="cursor:pointer;" @click="touchBillNum(billnum)">{{billnum}}</span>
                            </span>
                        </div>
                    </div>
                </el-dialog>
                <el-dialog title="报关单" :visible.sync="billNumDetailDialogVisible" width="50%" :append-to-body="false" :center="true" class="dialog-wrapper" v-if="billNumDetailDialogVisible">
                    <div class="commonline"></div>
                    <div style="text-align:left;padding:10px 20px;">
                        <span style="position: relative;display: inline-block;width:100%;word-wrap: break-word;color:#333;font-size:14px;">
                            <span style="color:#333;">{{'报关单号'}}</span> :{{selectBillNum}}
                        </span>
                    </div>
                    <div class="commonline"></div>
                    <div style="padding:10px;height:800px;text-align:center;overflow-x:hidden;overflow:auto;">
                        <el-image src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575865559006&di=2557f6bbf6adaf43e28de56a94a69f50&imgtype=0&src=http%3A%2F%2Fimg.yzcdn.cn%2Fupload_files%2F2015%2F12%2F05%2FFurEs2sHD808zxN5NM5COi1Bl9BP.jpg%2521730x0.jpg"> </el-image>
                    </div>
                </el-dialog>
            </div> -->
        </div>
        <!-- <div class="commonline" style="display: flex;width: auto;position: relative; margin: 0px 20px 20px 20px;" ></div> -->

    </div>
</template>
<script>
import customStep from "../components/customStep";
import flowTimeLine from "../components/flow_timeline";
import developing from "@/components/developing";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";
import { timeStrToTimestamp} from '@/util/util'
import { getRecordHeadShowList, getReturnNoHeadShowList,getAuditRightNodeList } from '@/util/role/menuDataShowDeal'

export default {
    name: "reviewCorrention",
    components: {
        "v-custom-step":customStep,
		"v-flow-timeline":flowTimeLine,
		"v-developing":developing,
    },
    props:{
        nodeList:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        orderMsg:{
            type:Object,
            default:()=>{
                return {};
            }
		},
		orderType:{
			type:String
		},
        gotoCusNoDetail:{
            type:Function
        },
        businessDesc:{
            type:Object,
            default:()=>{
                return {};
            }
        }

    },
    data: function() {
        return {
			//是否收起被记录报
			isErrorPackup:false,
			errorShowList:[],
			errorHeader:[],

			//是否收起退改单记录
			isProblemPackup:false,
			problemShowList:[],
			problemHeader:[],

			//是否收起审单过程
			isAuditPackup:false,
			auditRightNodeList:[],

			totalNumName:0,//品名总数

			perssionData:{},
        };
    },
    created(){
		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"))

		this.dealShowListMsg();

		//品名总数
		let totalNum = 0;
		if (this.orderMsg.DECLARATION_LIST) {
			this.orderMsg.DECLARATION_LIST.forEach((element,index) => {
				if (element.DECLARATION_ITEM_LIST) {
					totalNum += element.DECLARATION_ITEM_LIST.length;
				}
			});
		}
		this.totalNumName = totalNum;
        console.log("this.nodeList...",this.nodeList);
    },
    mounted: function() {

    },
    methods: {
		/**
         * 根据详情内容解析获取被记录报、退改单记录、审单过程显示数组
         */
		dealShowListMsg(){
			let _this = this;

			console.log("_this.orderType......", _this.orderType);
			console.log("_this.perssionData......", _this.perssionData);
			console.log("_this.businessDesc......", _this.businessDesc);

			_this.errorHeader = getRecordHeadShowList(_this.orderType, _this.perssionData, _this.businessDesc);
			_this.problemHeader = getReturnNoHeadShowList(_this.orderType, _this.perssionData, _this.businessDesc);

			let orderNewMsg = JSON.parse(JSON.stringify(_this.orderMsg));

			console.log("orderNewMsg......", orderNewMsg);

			//获取被记录报显示数组
			if (orderNewMsg.ORDER_ERROR_LIST) {
				_this.errorShowList = orderNewMsg.ORDER_ERROR_LIST.slice();
			}
			
			//获取退改单记录显示数组
			if (orderNewMsg.ORDER_PROBLEM_REMARK) {
				_this.problemShowList = orderNewMsg.ORDER_PROBLEM_REMARK.slice();
			}

			_this.auditRightNodeList = getAuditRightNodeList(_this.orderType,_this.perssionData,_this.businessDesc,orderNewMsg);

			console.log("_this.auditRightNodeList......", _this.auditRightNodeList);
			
			
		},
        /**
         * 展开隐藏
         */
        packupBtn:function (item,index) {
            item.isPackup = !item.isPackup;
            this.nodeList.splice(index,1,item);
		},
		/**
         * 被记录报展开隐藏
         */
		packupErrorBtn(){
			this.isErrorPackup = !this.isErrorPackup;
			if (this.isProblemPackup) {
				this.errorShowList = this.orderMsg.ORDER_ERROR_LIST.slice(0,1);
			}else{
				this.errorShowList = this.orderMsg.ORDER_ERROR_LIST.slice();
			}
		},
		/**
         * 退改单记录展开隐藏
         */
		packupProblemBtn(){
			this.isProblemPackup = !this.isProblemPackup;
			if (this.isProblemPackup) {
				this.problemShowList = this.orderMsg.ORDER_PROBLEM_REMARK.slice(0,1);
			}else{
				this.problemShowList = this.orderMsg.ORDER_PROBLEM_REMARK.slice();
			}
		},
		/**
         * 审单过程展开隐藏
         */
		packupAuditBtn(){
			this.isAuditPackup = !this.isAuditPackup;
		},
        /**
         * 更多单号
         */
        moreOddNum:function (item) {
            this.moreBillNumDialogVisible = true;

            this.orderMsg.DECLARATION_LIST.forEach(element => {
                this.billNumArr.push(element.CUS_NO);
            });

        },
        /**
         * 点击报关单号
         */
        touchBillNum:function (billNum) {
            // this.selectBillNum = billNum;
            // this.billNumDetailDialogVisible = true;
            console.log("billNum...",billNum);
            this.gotoCusNoDetail(billNum);
        }
    }
};
</script>
<style scoped>
    .nodeClass{
        display: flex;
        border: solid;
        border-width: 1px;
        border-color: rgb(231, 231, 231);
        border-top: none;
        /* border-right: none; */
        position: relative;
        /* display: inline-block; */
        margin: 0px 0px 0px 0px;
        padding: 0px 20px 0px 0px;
        width: 100%;
    }
    .leftNodeClass{
        display: inline-block;
        position: relative;
        min-width: 200px;
		width:280px;
        vertical-align: top;
        padding: 20px 0px 20px 20px;
    }
    .rightDetailItem{
        display: inline-block;
        position: relative;
        width: 150px;
    }
    .rightNodeListClass{
        position:relative;
        display: inline-flex;
        width: calc(100%);
    }
    .packupBtn{
		position: relative;
        /* margin: 0px 0px;  */
        padding: 20px 3px 20px 0px;
        height: 20px;
    }

	.tableDiv{
		position: relative;
		width: calc(100%);
		padding: 13px 0px 15px;
		/* display: inline-grid; */
	}
	.dataTable{
		width: calc(100% - 5px);
	}
	.tableDiv /deep/ .el-table th>.cell{
		background-color: #fff;
	}
	/* .tableDiv /deep/ .el-table .cell {
		padding-left: 0px;
	} */
	/* 去掉table的线条 */
	.tableDiv /deep/ .el-table__row>td{
		border: none;
	}
	/* 去掉最下面的那一条线 */
	.tableDiv /deep/ .el-table::before {
		height: 0px;
	}
	/* 去掉header那一条线 */
	.tableDiv /deep/ .el-table th.is-leaf{
		padding: 0px 0px 0px 0px;
		height: 20px;
		border-bottom: none !important;
	}
	/* 去掉水表悬停背景色 */
	.tableDiv /deep/ .el-table tbody tr:hover>td { 
		background-color:unset !important;
	}
    /* .dialog-wrapper /deep/ .el-dialog__body{
        height: 50vh !important;
        overflow: auto !important;
    } */

	.leftLineClass{
        display: inline-block;
        position:absolute;
        width: 11px;
        height: 100%;
        text-align: center;
    }
    .dotClass{
        display: inline-block;
        position: relative;
        width: 10px;
        height: 10px;
        left: -10.5px;
        background-color: #1585FF;
        border-radius: 10px;
        z-index: 9;
    }
    .verticalLineClass{
        display: flex;
        position: relative;
        top: -5px;
        left: -5.5px;
        width: 1px;
        height: calc(100% - 15px);
        background-color: rgb(231, 231, 231);
    }
	.nodeMsgClass{
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: 0px;
        left: 10px;
        /* background-color: red; */
    }
	/* 中文版本 */
    .zh-cn .chainTime{
        position: relative;
        display: inline-block;
        width: 80px;
        text-align:right;
        font-size:12px;
        color:#666;
    }
    /* 英文版本 */
    .en .chainTime{
        position: relative;
        display: inline-block;
        width: 100px;
        text-align:right;
        font-size:12px;
        color:#666;
    }

    .chainTimestamp{
        position: relative;
        text-align:left;
        font-size:12px;
        color:#666;
    }
</style>

