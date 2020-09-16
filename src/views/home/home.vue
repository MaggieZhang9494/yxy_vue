/*
 * Copyright 2014-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
<template>
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.menuName.controlPanel'" :headTitlePath="{path:'/home'}" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_03'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_03'].isSee" style="margin:10px 10px 0px 10px;">
                <el-row>
                    <el-col :xs='24' :sm="24" :md="24" :lg="24" :xl="24" v-loading="loadingNumber">
						<!-- @click="goDetailRouter(item)" -->
                        <div class="overview-item" style="font-size:0" v-for="(item, index) in detailsList" :key="index"  :class="item.bg">
                            <div class="overview-item-content">
                                <div v-if="index == 1" class="overview2-item-title">{{item.label}}</div>
                                <div v-else class="overview-item-title">{{item.label}}</div>
                                <div class="overview-item-number">{{item.value}}<span style="font-size:12px">{{item.unit}}</span></div>
                                
                            </div>
                            <div class="overview-item-img">
                                <svg class="overview-item-svg" aria-hidden="true" v-if='item.icon == "#wbs-icon-node1"'>
                                    <use id="svgNode" xlink:href="#wbs-icon-node1"></use>
                                </svg>
                                <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-transation"'>
                                    <use id="svgBlock" xlink:href="#wbs-icon-transation"></use>
                                </svg>
                                <svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-block"'>
                                    <use id="svgTransation" xlink:href="#wbs-icon-block"></use>
                                </svg>
								<svg class="overview-item-svg" aria-hidden="true" v-else-if='item.icon == "#wbs-icon-contract"'>
                                    <use id="svgContract" xlink:href="#wbs-icon-contract"></use>
                                </svg>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
			<div v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_04'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_04'].isSee" class="module-box-shadow" style="margin:0px 15px 10px 15px;">
				<!-- 搜索条件 -->
				<div class="searchClass">
					<el-input :placeholder="$t('message.publicQuery.inputAlert')" v-model="searchKeyName">
						<el-button slot="append" icon="el-icon-search" @click="searchCer()">{{$t('message.common.search')}}</el-button>
					</el-input>
					<div style="text-align:left;width:600px;left: calc(50% - 300px);position: relative;">
						<span style="color:#C9CACB;font-size:12px;">{{$t('message.publicQuery.alert')}}</span>
					</div>
				</div>
				<!-- list -->
				<div class="tableClass">
					<el-table style="padding:0px 15px 10px 15px;" ref="refTable" :data="saveCerShowList" tooltip-effect="light" v-loading="loadingCer">
						<el-table-column type="expand" width="1">
							<template slot-scope="scope">
								<v-savecer-detail :showData="scope.row"></v-savecer-detail>
							</template>
						</el-table-column>
						<el-table-column v-for="head in saveCerHeader" :label="head.name" :key="head.enName" show-overflow-tooltip align="left">
							<template slot-scope="scope">
								<span v-if="head.enName === 'cerContent'" style="cursor:pointer;" @click="clickTable(scope.row, scope.$index)"><i class="iconfont wbs-chakanxiangqing" style="color:#1585ff;font-size:12px;position: relative;margin-right: 3px;"></i>{{$t('message.publicQuery.dataSummary')}}</span>
								<span v-else>{{scope.row[head.enName]}}</span>
							</template>
						</el-table-column>
					</el-table>
					<!-- 查看全部 -->
					<div v-if="saveCerList.length>saveCerShowList.length" class="allDiv">
						<span style="position: relative;font-size:13px;line-height:40px;width:100px;height:50px;cursor:pointer;" @click="gotoAll()">{{$t('message.publicQuery.lookAll')}}<i :class="['iconfont wbs-zhankai']" style="color:#1585FF;font-size:12px;"></i></span>
					</div>
					<div v-if="saveCerList.length>saveCerShowList.length" class="commonline"></div>
				</div>
			</div>

            <div v-show="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_05'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_05'].isSee">
                <el-row>
                    <el-col :xs='24' :sm="24" :md="24" :lg="24" :xl="24">
                        <div style="margin: 0px 15px 15px 15px;" class="module-box-shadow bg-fff">
                            <div class="part2-title">
                                <span class="part2-title-left">{{$t('message.dataOverview.keyMonitorIndex')}}</span>
                                <span class="part2-title-right">{{$t('message.dataOverview.recentlyTransactionNum')}}</span>
                            </div>
                            <div class="chart" ref="chart">
                                <v-chart ref="linechart" :id="'homeId'" v-if="chartStatistics.show" :data="chartStatistics.date" :transactionDataArr="chartStatistics.dataArr" :size="chartStatistics.chartSize" v-loading="loadingCharts"></v-chart>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_06'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_06'].isSee" class="module-wrapper-small" style="padding: 30px 31px 26px 32px;">
                <el-table :data="nodeData" class="search-table-content" v-loading="loadingNodes">
                    <el-table-column v-for="head in nodeHead" :label="head.name" :key="head.enName" show-overflow-tooltip align="left" :width='head.width'>
                        <template slot-scope="scope">
                            <!-- <template> -->
                                <span v-if="head.enName ==='nodeActive'">
                                    <i :style="{'color': textColor(scope.row[head.enName])}" class="wbs-icon-radio font-6"></i> {{nodesStatus(scope.row[head.enName])}}
                                </span>
                                <span v-else-if="head.enName === 'nodeId'">
                                    <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(scope.row[head.enName])" :title="$t('message.common.copy')"></i>
                                    {{scope.row[head.enName]}}
                                </span>
                                <span v-else>{{scope.row[head.enName]}}</span>
                            <!-- </template> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="min-width: 540px;margin: 8px 15px 0px 15px;">
                <el-row :gutter="16">
                    <el-col v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01'].isSee" :xs='blockWidth' :sm="blockWidth" :md="blockWidth" :lg="blockWidth" :xl="blockWidth">
                        <div class="overview-wrapper" v-loading="loadingBlock">
                            <p>
                                <span class="overview-title">{{$t('message.blockInfo.block')}}</span>
                                <span v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01.CODE_01'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01.CODE_01'].isSee" class="overview-more cursor-pointer" @click="goRouter('blocks')">{{$t('message.common.more')}}</span>
                            </p>
                            <div class="overview-item-base">
                                <div class="block-item font-color-2e384d" v-for="item in blockData" :key='item.blockNumber'>
                                    <div class="block-amount" style="padding-bottom: 7px;">
                                        <span @click="linkRouter('blocks',item.blockNumber)" class="node-ip" v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01.CODE_02'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01.CODE_02'].isSee">
											{{$t('message.blockInfo.blockHeight')}} {{item.blockNumber}}
                                            <!-- <router-link :to="{'path': 'blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip">{{$t('message.blockInfo.blockHeight')}} {{item.blockNumber}}</router-link> -->
                                        </span>
										<span v-else style="width:200px;max-width: 500px;height:22px;"></span>
                                        <span class="color-8798AD">{{item.blockTimestamp}}</span>
                                    </div>
                                    <div>
                                        <div class="block-miner">
                                            <span>{{$t('message.blockInfo.outBlocker')}}</span>
                                            <p :title="`${item.sealer}`">{{item.sealer}}</p>
                                        </div>
                                        <div class="text-right">
                                            <span class="block-trans" @click="linkRouter('blocks',item.blockNumber)" v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01.CODE_02'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01.CODE_02'].isSee">
                                                <!-- <router-link :to="{'path': 'blockInfo', 'query': {blockNumber: item.blockNumber}}" class="node-ip"> -->
                                                <span>{{item.transCount}}</span>
                                                <span>txns</span>
                                                <!-- </router-link> -->
                                            </span>

                                        </div>
                                    </div>
                                </div>
                                <div v-if="blockData.length<=0" style="width:100%;height:50px;text-align:center;">{{$t('message.common.noData')}}</div>
                            </div>
                        </div>
                    </el-col>
					<!-- v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee" -->
                    <el-col  v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee" :xs='txWidth' :sm="txWidth" :md="txWidth" :lg="txWidth" :xl="txWidth">
                        <div class="overview-wrapper" v-loading="loadingTransaction">
                            <p>
                                <span class="overview-title">{{$t('message.transactionInfo.transaction')}}</span>
                                <span v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02.CODE_01'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02.CODE_01'].isSee" class="overview-more cursor-pointer" @click="goRouter('transactions')">{{$t('message.common.more')}}</span>
                            </p>
                            <div class="overview-item-base">
                                <div class="block-item font-color-2e384d" v-for="item in transactionList" :key='item.transHash'>
                                    <div class="block-amount">
                                        <p v-if="perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02.CODE_02'] && perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02.CODE_02'].isSee" class="trans-hash" :title="`${item.transHash}`">
                                            <i  class="wbs-icon-copy font-12" @click="copyNodeIdKey(item.transHash)" :title="$t('message.common.copy')"></i>
											<span  class="node-ip" @click="linkRouter('transactions',item.transHash)">
												{{item.transHash}}
											</span>
											
                                            <!-- <router-link :to="{'path': 'transactionInfo', 'query': {blockNumber: item.transHash}}" class="node-ip">
                                                {{item.transHash}}
                                            </router-link> -->
                                        </p>
										<span v-else style="width:200px;max-width: 500px;height:22px;"></span>
                                        <p class="trans-address color-8798AD">
                                            <span>
                                                <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(item.transFrom)" :title="$t('message.common.copy')"></i>
                                                {{splitAddress(item.transFrom)}}
                                            </span>
                                            <img :src="sRight" alt="箭头">
                                            <span>
                                                <i class="wbs-icon-copy font-12" @click="copyNodeIdKey(item.transTo)" :title="$t('message.common.copy')"></i>
                                                {{splitAddress(item.transTo)}}
                                            </span>
                                        </p>

                                    </div>
                                    <p class="color-8798AD text-right" style="min-width:150px;">{{item.blockTimestamp}}</p>
                                </div>
                                <div v-if="transactionList.length<=0" style="width:100%;height:50px;text-align:center;">$t('message.common.noData')</div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import charts from "./components/chart";
import {
    getChartData,
    getNetworkStatistics,
    getNodeList,
    getBlockPage,
    getTransactionList,
    getConsensusNodeId,
	loginOut,
	getBlockchainStatisticsMsg,
	getBlockchainCerList
} from "@/util/api";
import { changWeek, numberFormat, unique,delCookie } from "@/util/util";
import router from "@/router";
import errcode from "@/util/errcode";
import sRight from "@/../static/image/s-right.png";
import artboard from "@/../static/image/artboard.png";
import saveCerDetail from "../publicQuery/saveCerDetail";
import Bus from "@/bus"
export default {
    name: "home",
    components: {
        "v-content-head": contentHead,
		"v-chart": charts,
		"v-savecer-detail":saveCerDetail,
    },
    data: function () {
        return {
            sRight: sRight,
            loadingNumber: false,
            loadingCharts: false,
            loadingNodes: false,
            loadingBlock: false,
			loadingTransaction: false,
			loadingCer:false,
            numberFormat: numberFormat,
            artboard: artboard,
            detailsList: [
                {
                    label: this.$i18n.t('message.dataOverview.nodeNumber'),//"节点个数",
                    name: "nodeCount",
                    value: 0,
                    icon: "#wbs-icon-node1",
                    bg: 'node-bg',
                    unit:this.$i18n.t('message.dataOverview.nodes')
                },
                // {
                //     label: this.$i18n.t('message.dataOverview.smartContractNumber'),//"已部署的智能合约",
                //     name: "contractCount",
                //     value: 0,
                //     icon: "#wbs-icon-contract",
                //     bg: 'contract-bg',
                //     unit:this.$i18n.t('message.dataOverview.contracts')
                // },
                {
                    label: this.$i18n.t('message.dataOverview.blockNumber'),//"区块数量",
                    name: "latestBlockNumber",//latestBlock
                    value: 0,
                    icon: "#wbs-icon-transation",
                    bg: "block-bg",
                    unit:this.$i18n.t('message.dataOverview.blocks')
                },
                {
                    label: this.$i18n.t('message.dataOverview.transactionNumber'),//"交易数量",
                    name: "txTotalCount",//transactionCount
                    value: 0,
                    icon: "#wbs-icon-block",
                    bg: 'transation-bg',
                    unit:this.$i18n.t('message.dataOverview.transactions')
				},
				{
                    label: this.$i18n.t('message.publicQuery.projectNumber'),//"项目数量",
                    name: "projectCount",
                    value: 0,
                    icon: "#wbs-icon-contract",
                    bg: 'contract-bg',
                    unit:this.$i18n.t('message.dataOverview.projects')
                },
            ],
            networkDetails: null,
            chartStatistics: {
                show: false,
                date: [],
                dataArr: [],
                chartSize: {
                    width: 0,
                    height: 0
                }
            },
            reloadNumber: true,
            groupId: localStorage.getItem("groupId"),
            nodeHead: [
                {
                    enName: "nodeId",
                    name: this.$i18n.t('message.nodeManagement.nodeId'),//"节点Id",
                    width: ""
                },
                {
                    enName: "blockNumber",
                    name: this.$i18n.t('message.blockInfo.blockHeight'),//"块高",
                    width: 180
                },
                {
                    enName: "pbftView",
                    name: this.$i18n.t('message.nodeManagement.pbftView'),//"pbftView",
                    width: 180
                },
                {
                    enName: "nodeActive",
                    name: this.$i18n.t('message.nodeManagement.status'),//"状态",
                    width: 150
                }
            ],
            nodeData: [],
            blockData: [],
			transactionList: [],
			
			//权限数据
			perssionData:{},

			//搜索条件
            searchKeyName:"",
			//存证显示在列表上的数据
			saveCerShowList:[],
			//存证所有数据
			saveCerList:[],
			saveCerHeader:[
				{
                    enName: "blockNumber",
                    name: this.$i18n.t('message.publicQuery.blockHeight')
                },
                {
                    enName: "certName",
                    name: this.$i18n.t('message.publicQuery.cerName')
				},
                {
                    enName: "cerContent",
                    name: this.$i18n.t('message.publicQuery.cerContent')
				},
                {
                    enName: "userCompany",
                    name: this.$i18n.t('message.publicQuery.cerUser')
				},
				{
                    enName: "created",
                    name: this.$i18n.t('message.publicQuery.time')
                },
			],

			blockWidth:12,
			txWidth:12,
        };
	},
	created(){
		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"));

		if (this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01'].isSee && this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee) {
			this.blockWidth = 12;
			this.txWidth = 12;
		}else if(!this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01'].isSee && this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee) {
			this.blockWidth = 0;
			this.txWidth = 24;
		}else if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01'].isSee && !this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee) {
			this.blockWidth = 24;
			this.txWidth = 0;
		}
	},
    beforeCreate(){
        // //超级管理员：显示所有菜单
        // if(localStorage.getItem("root") == "admin" && localStorage.getItem("user") == "admin"){
            
        // }
        // //普通管理员：显示
        // else if(localStorage.getItem("root")== "admin" && localStorage.getItem("user") != "admin"){
        //     router.push("/accountList")
        // }
        // //普通成员：只显示业务管理模块
        // else{
        //     router.push("/businessSearch")
        // }
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        this.groupId = localStorage.getItem("groupId");

        if(!localStorage.getItem("user")){
            localStorage.removeItem("user");
            loginOut().then().catch();
            delCookie("JSESSIONID");
            delCookie("NODE_MGR_ACCOUNT_C");
            this.$router.push("/login");
            return;
        }
        

		// this.getNetworkDetails();
		
		if (this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_03'].isSee) {
			//获取统计数据
			this.getPublicNums();
		}
		
		if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_06'].isSee) {
			//获取节点列表
        	this.getNodeTable();
		}
		
		if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01'].isSee) {
			//获取区块信息
			this.getBlockList();
		}
		
		if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee) {
			//获取交易信息
			this.getTransaction();
		}
		if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_05'].isSee) {
			//获取监控指标
			this.$nextTick(function () {
				this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
				this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
				this.getChart();
			});
		}
    },
    destroyed() { },
    methods: {
        changGroup(val) {
			console.log("changGroup..........", val);
			this.saveCerShowList=[];
			this.saveCerList=[];

            this.groupId = val
			// this.getNetworkDetails();
			if (this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_03'].isSee) {
				//获取统计数据
				this.getPublicNums();
			}
			
			if(!this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_06'].isSee) {
				//获取节点列表
				this.getNodeTable();
			}
			
			if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_01'].isSee) {
				//获取区块信息
				this.getBlockList();
			}
			
			if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_02'].isSee) {
				//获取交易信息
				this.getTransaction();
			}
			if(this.perssionData.funcMenu['FUNC.FUNC.CODE_04.CODE_05'].isSee) {
				//获取监控指标
				this.$nextTick(function () {
					this.chartStatistics.chartSize.width = this.$refs.chart.offsetWidth;
					this.chartStatistics.chartSize.height = this.$refs.chart.offsetHeight;
					this.getChart();
				});
			}
        },
		//获取统计数据
		getPublicNums(){
			let _this = this;
			this.loadingNumber = true;
            getBlockchainStatisticsMsg({}).then(res => {
                this.loadingNumber = false;
                if (res.data.code === 0) {
					this.isChain = res.data.data.nodeStatus==1?true:false;
                    this.detailsList.forEach(function (value, index) {
                        for (let i in res.data.data) {
                            if (value.name === i) {
                                value.value = res.data.data[i];
                            }
                        }
                    });
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
					this.$message({
						type: "error",
						message: message
					});
                }
            })
            .catch(err => {
				let message = _this.$i18n.t('message.common.systemError');
				if(err && err.data && err.data.code){
					message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
				}
				this.$message({
					type: "error",
					message: message
				});
            });
		},
        getNetworkDetails: function () {
            this.loadingNumber = true;
            let groupId = this.groupId;
            getNetworkStatistics(groupId)
                .then(res => {
                    this.loadingNumber = false;
                    if (res.data.code === 0) {
                        this.detailsList.forEach(function (value, index) {
                            for (let i in res.data.data) {
                                if (value.name === i) {
                                    value.value = res.data.data[i];
                                }
                            }
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {

                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        getChart: function () {
            this.loadingCharts = true;
            this.chartStatistics.show = false;
            this.chartStatistics.date = [];
            this.chartStatistics.dataArr = [];
            let groupId = localStorage.getItem("groupId");
            getChartData(groupId)
                .then(res => {
                    this.loadingCharts = false;
                    if (res.data.code === 0) {
                        let resData = changWeek(res.data.data);
                        for (let i = 0; i < resData.length; i++) {
                            this.chartStatistics.date.push(resData[i].day);
                            this.chartStatistics.dataArr.push(
                                resData[i].transCount
                            );
                        }
                        this.$set(this.chartStatistics, "show", true);
                    } else {
                        this.$message({
                            type: "error",
                            message: errcode.errCode[res.data.code].cn
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {

                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        getNodeTable: function () {
            this.loadingNodes = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: 1,
                pageSize: 100
            },
                reqQuery = {},

                reqParam = {
                    groupId: groupId,
                    pageNumber: 1,
                    pageSize: 100
                };
            this.$axios.all([getNodeList(reqData, reqQuery), getConsensusNodeId(reqParam)])
                .then(this.$axios.spread((acct, perms) => {
					console.log("acct....", acct);
					console.log("perms....", perms);
                    this.loadingNodes = false;
                    if (perms && acct &&  perms.data && acct.data && acct.data.code === 0 && perms.data.code === 0) {
                        var nodesStatusList = acct.data.data, nodesAuthorList = perms.data.data;
                        var nodesStatusIdList = nodesStatusList.map(item => {
                            return item.nodeId
                        })
                        this.nodeData = [];
                        nodesAuthorList.forEach((item, index) => {
                            if (item.nodeType != 'remove') {
                                nodesStatusList.forEach(it => {
                                    if (nodesStatusIdList.includes(item.nodeId)) {
                                        if (item.nodeId === it.nodeId) {
                                            this.nodeData.push(Object.assign({}, item, it))
                                        }
                                    } else {
                                        this.nodeData.push(item)
                                    }
                                })
                            }

                        })
                        this.nodeData.forEach(item => {
                            if (item.nodeType === "observer") {
                                item.pbftView = '--';
                            }
                        });
                        this.nodeData = unique(this.nodeData, 'nodeId')
                    } else {
                        this.nodeData = [];
                    }
                })).catch(err => {
					let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
				})
        },
        getBlockList: function () {
            this.loadingBlock = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: 1,
                pageSize: 6
            },
                reqQuery = {};
            getBlockPage(reqData, reqQuery)
                .then(res => {
                    this.loadingBlock = false;
                    if (res.data.code === 0) {
                        this.blockData = res.data.data;
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {

                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        getTransaction: function () {
            this.loadingTransaction = true;
            let groupId = localStorage.getItem("groupId");
            let reqData = {
                groupId: groupId,
                pageNumber: 1,
                pageSize: 6
            },
                reqQuery = {};
            getTransactionList(reqData, reqQuery)
                .then(res => {
                    this.loadingTransaction = false;
                    if (res.data.code === 0) {
                        this.transactionList = res.data.data;
                    } else {
                        this.$message({
                            message: errcode.errCode[res.data.code].cn,
                            type: "error",
                            duration: 2000
                        });
                        this.$message.closeAll()
                    }
                })
                .catch(err => {
                    let message = this.$i18n.t('message.common.systemError');
					if(err && err.data && err.data.code){
						message = errcode.errCode.isCN?errcode.errCode[err.data.code].cn:errcode.errCode[err.data.code].en;
					}
					this.$message({
						type: "error",
						message: message
					});
                });
        },
        goDetailRouter(item) {
            let name = item.name;
            switch (name) {
                case "latestBlockNumber":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_01.CODE_01"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_01.CODE_01"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push("blockInfo");
				}
                    
                    break;
                case "txTotalCount":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_02.CODE_01"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_02.CODE_01"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push("transactionInfo");
				}
                    
                    break;
                case "nodeCount":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_06"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_06"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push({ path: "front", query: { from: "home" } });
				}
                    break;
                case "contractCount":{
					// if (!this.perssionData.funcMenu["FUNC.FUNC.CODE_07"].isUse) {
					// 	this.$message({
					// 		type: "warning",
					// 		message: this.$i18n.t('message.common.noPerssion')
					// 	});
					// 	return;
					// }
					router.push({ path: "contractList", query: { from: "home" } });
				}
                    
                    break;
            }
        },
        bindSvg(item) {
            var str = "";
            switch (item.name) {
                case "orgCount":
                    str = "#wbs-icon-h-group";
                    break;

                case "nodeCount":
                    str = "#wbs-icon-h-nodes";
                    break;
                case "contractCount":
                    str = "#wbs-icon-h-deploy";
                    break;
                case "latestBlockNumber":
                    str = "#wbs-icon-h-block";
                    break;
                case "txTotalCount":
                    str = "#wbs-icon-transaction";
                    break;
            }
            return str;
        },
        textColor: function (val) {
            let colorString = "";
            switch (val) {
                case 1:
                    colorString = "#58cb7d";
                    break;
                case 2:
                    colorString = "#ed5454";
                    break;
            }
            return colorString;
        },
        nodesStatus: function (val) {
            let transString = "";
            switch (val) {
                case 1:
                    transString = this.$i18n.t('message.nodeManagement.run');//"运行";
                    break;
                case 2:
                    transString = this.$i18n.t('message.nodeManagement.unusual');//"异常";
                    break;
            }
            return transString;
        },
        goRouter: function (val) {
            switch (val) {
                case "blocks":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_01.CODE_01"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_01.CODE_01"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push("blockInfo");
				}
                    break;

                case "transactions":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_02.CODE_01"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_02.CODE_01"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push("transactionInfo");
				}
                    break;
            }
        },
        copyNodeIdKey: function (val) {
            if (!val) {
                this.$message({
                    type: "fail",
                    showClose: true,
                    message: this.$i18n.t('message.common.noCopyAlert'),
                    duration: 2000
                });
            } else {
                this.$copyText(val).then(e => {
                    this.$message({
                        type: "success",
                        showClose: true,
                        message: this.$i18n.t('message.common.copySuc'),
                        duration: 2000
                    });
                });
            }
        },
        splitAddress(val) {
            if (!val) return;
            var startStr = '', endStr = '', str = '';
            startStr = val.substring(0, 8);
            endStr = val.substring(val.length - 4);
            str = `${startStr}...${endStr}`;
            return str;
		},
		linkRouter(type,value){
			switch (type) {
                case "blocks":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_01.CODE_02"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_01.CODE_02"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push({path:'/blockInfo', query:{blockNumber:value}});
				}
                    break;

                case "transactions":{
					if (this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_02.CODE_02"] && !this.perssionData.funcMenu["FUNC.FUNC.CODE_04.CODE_02.CODE_02"].isUse) {
						this.$message({
							type: "warning",
							message: this.$i18n.t('message.common.noPerssion')
						});
						return;
					}
					router.push({path:'/transactionInfo', query:{blockNumber:value}});
				}
                    break;
            }
		},
		
		//获取搜索条件，输出查询参数
        getSearchParams(){
            let param = {};
            if(!this.isNullData(this.searchKeyName)){
                param.txHash = this.searchKeyName;
            }
            return param;
		},
		//获取存证信息
		getCerList(){
			let _this = this;

			let params = _this.getSearchParams();
			if (_this.isNullData(params.txHash)) {
				_this.$message.error(_this.$i18n.t('message.publicQuery.hashInput'));
				return;
			}
			_this.loadingCer=true;
            getBlockchainCerList(params).then(res => {
				_this.loadingCer=false;
                if (res.data.code === 0) {
					_this.saveCerList = res.data.data;
                    if (_this.saveCerList.length>5) {
						_this.saveCerShowList = _this.saveCerList.slice(0,5);
					}else{
						_this.saveCerShowList = _this.saveCerList.slice();
					}
					console.log("this.saveCerList...", this.saveCerList);
					console.log("this.saveCerShowList...", this.saveCerShowList);
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            }).catch(err => {
				_this.loadingCer=false;
                let message = _this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
		},
		//查看全部
		gotoAll(){
			this.saveCerShowList = [];
			this.saveCerShowList = this.saveCerList.slice();
		},
		searchCer(){
			//获取存证信息列表
        	this.getCerList();
		},
		clickTable(row,index,e){
			this.$refs.refTable.toggleRowExpansion(row)
        },
    }
};
</script>
<style scoped>
.node-bg {
    background: linear-gradient(to top right, #47befa, #37eef2);
	/* cursor: pointer; */
}
.contract-bg {
    background: linear-gradient(to top right, #466dff, #30a7ff);
}
.block-bg {
    background: linear-gradient(to top right, #736aff, #b287ff);
	/* cursor: pointer; */
}
.transation-bg {
    background: linear-gradient(to top right, #ff6e9a, #ffa895);
	/* cursor: pointer; */
}
/* .over-view-wrapper {
    background: #f7f7f7;
}
.amount-wrapper {
    margin: 30px 30px 0 31px;
} */
.font-12 {
    font-size: 12px;
    color: #9da2ab;
}
.part1-content {
    display: flex;
    background: #f7f7f7;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}
.split-line {
    margin-left: 22px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-right: 20px;
    opacity: 0.25;
}
.overview-number {
    margin-top: 20px;
    margin-left: 20px;
    padding: 20px;
}
.part1-content-amount {
    overflow: auto;
    min-width: 112px;
}
.part2-title {
    padding: 22px 31px 26px 32px;
}
.part2-title::after {
    display: block;
    content: "";
    clear: both;
}
.part2-title-left {
    float: left;
    font-size: 16px;
    color: #000e1f;
    font-weight: bold;
}
.part2-title-right {
    float: right;
    font-size: 12px;
    color: #727476;
    padding: 2px 12px;
    border-radius: 20px;
    background: #f6f6f6;
}
.part3-title {
    padding: 40px 60px 40px 40px;
}
.part3-title::after {
    display: block;
    content: "";
    clear: both;
}
.more-content {
    font-size: 14px;
    color: #0db1c1;
    cursor: pointer;
}
.part3-table-content {
    width: 100%;
    padding: 0 39px 48px 40px;
    font-size: 12px;
}
.part3-table-content >>> th,
.part3-table-content >>> td {
    padding: 8px 0;
}
.part1-details-bottom {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}
.part1-details-arrow-right {
    position: relative;
    top: 4px;
}
.search-table-content {
    width: 100%;
}
.search-table-content >>> th {
    background: #fafafa;
    color: #2e384d;
}
.search-table-content >>> th,
.search-table-content >>> td {
    font-size: 14px;
}
.overview-wrapper {
    background: #fff;
    font-size: 15px;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
}
.overview-wrapper > p {
    padding: 26px 18px 0px 22px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
}
.overview-title {
    font-size: 15px;
    color: #2e384d;
    padding-bottom: 22px;
    border-bottom: 2px solid #2e384d;
}
.overview-more {
    font-size: 14px;
    color: #1585FF;
}
.block-item {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    padding-bottom: 10px;
}
.block-amount {
    display: flex;
    flex-flow: column;
}
.overview-item-base {
    margin: 26px 18px 30px 22px;
}
.block-miner {
    display: flex;
    flex-flow: row wrap;
}
.block-miner > p {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
}
.trans-hash {
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.node-ip {
	color: #1585FF;
	cursor: pointer;
}

.block-trans {
    display: inline-block;
    padding: 0 2px;
    background-color: #f6f7f8;
    color: #1585FF;
    cursor: pointer;
}
.trans-address span {
    display: inline-block;
    max-width: 150px;
}
.trans-address img {
    vertical-align: middle;
}
.overview-item {
    display: inline-block;
    width: calc(25% - 10px);
    max-width: 600px;
    height: 120px;
    padding: 10px 5px 10px 5px;
    margin: 8px 5px 10px 5px;
    background-color: #fff;
    box-shadow: 0 4px 12px 0 #dfe2e9;
    border-radius: 2px;
    box-sizing: border-box;
}
.overview-item-img {
    display: inline-block;
    padding-top: 10px;
    width: 80px;
}
.overview-item-content {
    position: relative;
    top:-28px;
    font-size: 12px;
    display: inline-block;
    padding-left: 10px;
    padding-top: 0px;
    width: calc(100% - 100px);
}
.overview-item-number {
    font-size: 30px;
    margin-top: 10px;
    color: #fff;
}
/* 中文版本 */
.zh-cn .overview2-item-title {
    width: 100%;
    color: #fff;
}
/* 英文版本 */
.en .overview2-item-title {
    /* position: relative;
    top:10px; */
    width: 100%;
    color: #fff;
}
.overview-item-title {
    top:10px;
    width: 100%;
    color: #fff;
}
.overview-item-svg {
    width: 80px;
    height: 80px;
}
@media screen and (max-width: 1142px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 12px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 40px;
    }
    .overview-item-svg {
        width: 40px;
        height: 40px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 45px);
    }
}
@media screen and (max-width: 1042px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 15px);
        max-width: 300px;
        height: 120px;
        padding: 28px 6px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 35px;
    }
    .overview-item-svg {
        width: 35px;
        height: 35px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 5px;
        width: calc(100% - 40px);
    }
}
@media screen and (max-width: 991px) {
    .overview-item {
        display: inline-block;
        width: calc(49% - 8px);
        max-width: 385px;
        height: 120px;
        padding: 28px 16px;
        margin: 8px 15px 16px 0;
        background-color: #fff;
        box-shadow: 0 4px 12px 0 #dfe2e9;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .overview-item-img {
        display: inline-block;
        width: 50px;
    }
    .overview-item-svg {
        width: 50px;
        height: 50px;
    }
    .overview-item-content {
        font-size: 12px;
        display: inline-block;
        padding-left: 10px;
        width: calc(100% - 60px);
    }
    /* .el-col:nth-child(2){
        margin: 8px 16px 16px 0;
    } */
    .overview-item:nth-child(2) {
        margin: 8px 15px 16px 0;
    }
}

#svgNode{
	fill: #48C4F8 !important;  
}
#svgBlock{
	fill: #8170FF !important;  
}
#svgTransation{
	fill: #FF8098 !important;  
}
#svgContract{
	fill: #4376FF !important;  
}

.searchClass{
	padding: 20px 0px 15px 0px;
	background-color: white;
	text-align: center;
}
.searchClass /deep/ .el-input {
	width: 600px;
}
.searchClass /deep/ .el-input-group__append{
	background-color: #1585FF;
}
.searchClass /deep/ .el-input-group__append button.el-button {
	color:white;
}

.tableClass{
	padding: 0px 0px 0px 0px;
	/* margin: 10px 15px 10px 15px; */
	background-color: white;
	text-align: center;
}

.allDiv{
    position: relative;
    width: 100%;
    height: 40px;
    color: #1585FF;
    background-color: #fff;
	text-align: center;
}

.tableClass /deep/ .el-table__expand-icon>.el-icon{
    visibility:hidden;
}

.searchClass /deep/ .el-input .el-input-group__append {
	border: 1px solid #1585FF;
}

</style>