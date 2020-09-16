
<template>
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.menuName.statistics'" :headTitlePath="{path:'/statistics'}" :icon="true"></v-content-head>
        <div class="module-wrapper statisticsBg">
            <!-- <v-developing> </v-developing> -->
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                <el-menu-item index="1">{{$t('message.businessSearch.portImport')}}</el-menu-item>
                <el-menu-item v-show="isYuanChuAcc!='1' && !isNoExportBus" index="2">{{$t('message.businessSearch.portExit')}}</el-menu-item>
            </el-menu>
            <!-- 口岸进口 -->
            <div class="importStatistics" v-if="activeIndex == 1">
                <!-- 左侧第一个统计图 -->
                <div class="statisticsDiv1" v-loading="loading1">
                    <div class="titleDiv">
                        <span class="titleSpan">{{$t('message.statistics.recent7dayDone')}}</span>
                        <span v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true" class="lookMoreSpan" @click="lookMore(1)">{{this.$i18n.t('message.statistics.lookMore')}}</span>
                    </div>
                    <div class="commonline"></div>
                    <div class="e4" style="width:100%;height:auto;">
                        <div class="chartBgClass">
                            <v-bar-chart v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true" :defaultPeriod="defaultPeriod" :changePeriod="changePeriod1" :chartOption="orderStatistics1"> </v-bar-chart>
							<span v-else style="position: relative;top:30%;left:50%;color:#e5e5e5;font-size:18px;">{{$t('message.common.noPerssion')}}</span>
                        </div>
                    </div>
                </div>
                <!-- 左侧第二个统计图 -->
                <div class="statisticsDiv2" v-loading="loading2">
                    <div class="titleDiv">
                        <span class="titleSpan">{{$t('message.statistics.recent7dayTrans')}}</span>
                        <span v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == true" class="lookMoreSpan" @click="lookMore(2)">{{this.$i18n.t('message.statistics.lookMore')}}</span>
                    </div>
                    <div class="commonline"></div>
                    <div style="width:100%;height:auto;">
                        <div class="chartBgClass">
                            <v-bar-chart v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == true" :defaultPeriod="defaultPeriod" :changePeriod="changePeriod2" :chartOption="orderStatistics2"> </v-bar-chart>
							<span v-else style="position: relative;top:30%;left:50%;color:#e5e5e5;font-size:18px;">{{$t('message.common.noPerssion')}}</span>
                        </div>
                    </div>
                </div>
                <!-- 右侧统计图 -->
                <div class="statisticsDiv3" v-loading="loading3">
                    <div class="titleDiv">
                        <span class="titleSpan">{{$t('message.statistics.recent30dayDone')}}</span>
                        <span v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true" class="lookMoreSpan" @click="lookMore(3)">{{this.$i18n.t('message.statistics.lookMore')}}</span>
                    </div>
                    <div class="commonline"></div>
                    <div style="width:100%;height:auto;">
                        <div class="chartBg3Class">
                            <v-bar-chart v-if="perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true" :defaultPeriod="defaultPeriod" :changePeriod="changePeriod3" :chartOption="orderStatistics3"> </v-bar-chart>
							<span v-else style="position: relative;top:30%;left:50%;color:#e5e5e5;font-size:18px;">{{$t('message.common.noPerssion')}}</span>
                        </div>
                    </div>
                </div>
                <!-- 进入全部统计 -->
                <div class="allStatisticsDiv">
                    <span style="position: relative;line-height:50px;width:100px;height:50px;text-align:center;left: calc(50% - 50px);cursor:pointer;" @click="gotoAllStatistics()">{{this.$i18n.t('message.statistics.lookAllStatistics')}} >></span>
                </div>
            </div>
            <!-- 口岸出口 -->
            <div class="searchView"  v-if="activeIndex == 2">
                <v-developing> </v-developing>
            </div>
            
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import developing from "@/components/developing";
import { getBarChartStatistics } from "@/util/api";
import { format } from "@/util/util";
import router from "@/router";
import errcode from "@/util/errcode";
import BarChart from "./statistics/components/barChart";
import Bus from "@/bus"

export default {
    name: "statistics",
    components: {
        "v-content-head":contentHead,
        "v-developing":developing,
        "v-bar-chart": BarChart
    },
    data: function() {
        return {
            activeIndex: '1', //1：口岸进口 2：口岸出口
            //是否是元初客户
            isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),
            //是否没有口岸出口业务
            isNoExportBus:false,

            defaultPeriod:"D",
            //左侧第一个统计图统计结果
            orderStatistics1:{},
            loading1:false,
            //左侧第二个统计图统计结果
            orderStatistics2:{},
            loading2:false,
            //右侧统计图统计结果
            orderStatistics3:{},
            loading3:false,

            //左侧第一个统计图查询参数(已完成订单统计)
            searchParams1:{
                appoint_time_l:"",//指定开始时间，可为空
                appoint_time_r:"",//指定结束时间，可为空
                filter_date:"ACCEPT_DATE",//过滤日期 DZQQ_DATE 单证齐全日期，ACCEPT_DATE客户委托日期 必传
                BUSINESS_TYPE:"",//指定行业，可为空
                ORDER_TYPE:"FI",//订单类型 FI:进口/FE:出口，必传
                summary_mode:"ORDER",//汇总方式，固定
                TRADE_TOOL_TYPE_NAME:"", //运输方式
                /*
                  D/W/M/Q/Y为单选项可选。
                  D: 每日daily （当日0点-24点）；
                  W: 每周Weekly （星期一0点-星期日24点），W01-W52；
                  M: 每月Monthly （每月1号0点-当月月末30或31号24点）；
                  Q: 每季Quarterly （1-3月为Q1, 4-6月为Q2，7-9月为Q3, 10-12为Q4) 每季第一个月的1号0点-当季度第3个月末30或31号24点）；
                  Y: 每年Yearly （每年1月1号0点-当年12月31号24点）。
                */
                period:"", // 必传
                SEQ:"1",//固定
            },
            //左侧第二个统计图查询参数(不同运输方式订单统计)
            searchParams2:{
                appoint_time_l:"",//指定开始时间，可为空
                appoint_time_r:"",//指定结束时间，可为空
                filter_date:"ACCEPT_DATE",//过滤日期 DZQQ_DATE 单证齐全日期，ACCEPT_DATE客户委托日期 必传
                BUSINESS_TYPE:"",//指定行业，可为空
                ORDER_TYPE:"FI",//订单类型 FI:进口/FE:出口，必传
                summary_mode:"ORDER",//汇总方式，必传
                TRADE_TOOL_TYPE_NAME:"",//运输方式，可为空
                /*
                  D/W/M/Q/Y为单选项可选。
                  D: 每日daily （当日0点-24点）；
                  W: 每周Weekly （星期一0点-星期日24点），W01-W52；
                  M: 每月Monthly （每月1号0点-当月月末30或31号24点）；
                  Q: 每季Quarterly （1-3月为Q1, 4-6月为Q2，7-9月为Q3, 10-12为Q4) 每季第一个月的1号0点-当季度第3个月末30或31号24点）；
                  Y: 每年Yearly （每年1月1号0点-当年12月31号24点）。
                */
                period:"", // 必传
                SEQ:"1",
            },
            //右侧统计图查询参数
            searchParams3:{
                appoint_time_l:"",//指定开始时间，可为空
                appoint_time_r:"",//指定结束时间，可为空
                filter_date:"ACCEPT_DATE",//过滤日期 DZQQ_DATE 单证齐全日期，ACCEPT_DATE客户委托日期 必传
                BUSINESS_TYPE:"",//指定行业，可为空
                ORDER_TYPE:"FI",//订单类型 FI:进口/FE:出口，必传
                summary_mode:"ORDER",//汇总方式，固定
                TRADE_TOOL_TYPE_NAME:"", //运输方式
                /*
                  D/W/M/Q/Y为单选项可选。
                  D: 每日daily （当日0点-24点）；
                  W: 每周Weekly （星期一0点-星期日24点），W01-W52；
                  M: 每月Monthly （每月1号0点-当月月末30或31号24点）；
                  Q: 每季Quarterly （1-3月为Q1, 4-6月为Q2，7-9月为Q3, 10-12为Q4) 每季第一个月的1号0点-当季度第3个月末30或31号24点）；
                  Y: 每年Yearly （每年1月1号0点-当年12月31号24点）。
                */
                period:"", // 必传
                SEQ:"1",//固定
			},
			
			//权限数据
			perssionData:{},
        };
    },
    created(){
		let _this = this;
		
		_this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"));

        //处理中英文版本数据
        _this.dealZH_EN();
        //初始化列表查询参数
        _this.initSearchParams();

		if (_this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true || _this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == true) {
			if (_this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true) {
				/**
				 * 执行多个请求
				 * 1、获取最近7天已完成订单统计
				 * 2、获取最近30天已完成订单统计
				 */
				this.exeCloseMutilReq();
			} 
			
			if (_this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == true) {
				/**
				 * 执行多个请求
				 * 1、获取最近7天不同运输方式订单统计
				 */
				this.exeTransMutilReq();
			} 
		} else {
			// this.$message({
            //     type: "warning",
            //     message: this.$i18n.t('message.common.noPerssion')
            // });
		}
        
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
    },
    methods: {
        /**
         * 处理中英文数据
         */
        dealZH_EN(){

        },
        changGroup(val){
            // /**
            //  * 执行多个请求
            //  * 1、获取最近7天已完成订单统计
            //  * 2、获取最近7天不同运输方式订单统计
            //  * 3、获取最近30天已完成订单统计
            //  */
			// this.exeMutilReq();
			if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true || this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == true) {
				if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_02'].isUse == true) {
					/**
					 * 执行多个请求
					 * 1、获取最近7天已完成订单统计
					 * 2、获取最近30天已完成订单统计
					 */
					this.exeCloseMutilReq();
				} 
				
				if (this.perssionData.funcMenu['FUNC.DASHBOARD.CODE_03'].isUse == true) {
					/**
					 * 执行多个请求
					 * 1、获取最近7天不同运输方式订单统计
					 */
					this.exeTransMutilReq();
				} 
			} else {
				// this.$message({
				// 	type: "warning",
				// 	message: this.$i18n.t('message.common.noPerssion')
				// });
			}
        },

        //初始化列表查询参数
        initSearchParams(){
            let _this = this;

            const currentDate = new Date();

            let currentTimeStr =  format(currentDate.getTime(),"yyyy-MM-dd HH:mm:ss");
            
            let last7DayTimeStr = format((currentDate.getTime() - 3600 * 1000 * 24 * 7),"yyyy-MM-dd HH:mm:ss");
            let last30DayTimeStr = format((currentDate.getTime() - 3600 * 1000 * 24 * 30),"yyyy-MM-dd HH:mm:ss");
            // let last7DayTimeStr = format((currentDate.getTime() - 3600 * 1000 * 24 * 180),"yyyy-MM-dd HH:mm:ss");
            // let last30DayTimeStr = format((currentDate.getTime() - 3600 * 1000 * 24 * 180),"yyyy-MM-dd HH:mm:ss");

            //初始化左侧第一统计图参数
            _this.searchParams1.period = _this.defaultPeriod;
            _this.searchParams1.appoint_time_l = last7DayTimeStr;
            _this.searchParams1.appoint_time_r = currentTimeStr;

            //初始化左侧第二统计图参数
            _this.searchParams2.period = _this.defaultPeriod;
            _this.searchParams2.appoint_time_l = last7DayTimeStr;
            _this.searchParams2.appoint_time_r = currentTimeStr;

            //初始化右侧统计图参数
            _this.searchParams3.period = _this.defaultPeriod;
            _this.searchParams3.appoint_time_l = last30DayTimeStr;
            _this.searchParams3.appoint_time_r = currentTimeStr;
        },

        /**
         * 执行多个请求
         * 1、获取最近7天已完成订单统计
         * 2、获取最近7天不同运输方式订单统计
         * 3、获取最近30天已完成订单统计
         */
        exeMutilReq(){
            let _this = this;

            _this.loading1 = true;
            _this.loading2 = true;
            _this.loading3 = true;
            Promise.all([getBarChartStatistics(_this.searchParams1), getBarChartStatistics(_this.searchParams2), getBarChartStatistics(_this.searchParams3)]).then(res=>{
                console.log("多个统计请求。。。。", res);
                _this.loading1 = false;
                _this.loading2 = false;
                _this.loading3 = false;
                if(res && res.length==3){
                    if (res[0].data.code === 0) {
                        _this.orderStatistics1 = res[0].data.data;
                    } else {
                        _this.loading = false;
                        let message = res[0].data.message?res[0].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[0].data.code].cn:this.errcode.errCode[res[0].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }

                    if (res[1].data.code === 0) {
                        _this.orderStatistics2 = res[1].data.data;
                    } else {
                        _this.loading = false;
                        let message = res[1].data.message?res[1].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[1].data.code].cn:this.errcode.errCode[res[1].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }

                    if (res[2].data.code === 0) {
                        _this.orderStatistics3 = res[2].data.data;
                    } else {
                        _this.loading = false;
                        let message = res[2].data.message?res[2].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[2].data.code].cn:this.errcode.errCode[res[2].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                }
            }).catch(err => {
                console.log("多个统计请求错误。。。。", err);
                _this.loading1 = false;
                _this.loading2 = false;
                _this.loading3 = false;
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
		},
		/**
         * 执行多个请求
         * 2、获取最近7天不同运输方式订单统计
         */
        exeTransMutilReq(){
            let _this = this;

            _this.loading2 = true;
            Promise.all([getBarChartStatistics(_this.searchParams2)]).then(res=>{
                console.log("多个统计请求。。。。", res);
                _this.loading2 = false;
                if(res && res.length==1){
                    if (res[0].data.code === 0) {
                        _this.orderStatistics2 = res[0].data.data;
                    } else {
                        _this.loading = false;
                        let message = res[0].data.message?res[0].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[0].data.code].cn:this.errcode.errCode[res[0].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                }
            }).catch(err => {
                _this.loading2 = false;
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
		},
		
		/**
         * 执行多个请求
         * 1、获取最近7天已完成订单统计
         * 2、获取最近30天已完成订单统计
         */
        exeCloseMutilReq(){
            let _this = this;

            _this.loading1 = true;
            _this.loading3 = true;
            Promise.all([getBarChartStatistics(_this.searchParams1), getBarChartStatistics(_this.searchParams3)]).then(res=>{
                console.log("多个统计请求。。。。", res);
                _this.loading1 = false;
                _this.loading3 = false;
                if(res && res.length==2){
                    if (res[0].data.code === 0) {
                        _this.orderStatistics1 = res[0].data.data;
                    } else {
                        _this.loading = false;
                        let message = res[0].data.message?res[0].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[0].data.code].cn:this.errcode.errCode[res[0].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }

                    if (res[1].data.code === 0) {
                        _this.orderStatistics3 = res[1].data.data;
                    } else {
                        _this.loading = false;
                        let message = res[1].data.message?res[1].data.message:this.errcode.errCode.isCN?this.errcode.errCode[res[1].data.code].cn:this.errcode.errCode[res[1].data.code].en;
                        this.$message({
                            type: "error",
                            message: message
                        });
                    }
                }
            }).catch(err => {
                console.log("多个统计请求错误。。。。", err);
                _this.loading1 = false;
                _this.loading3 = false;
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
		},

        handleSelect:function(val) {
            let _this = this;

            _this.activeIndex = val;

            _this.searchParams1.ORDER_TYPE = _this.activeIndex == 1?'FI':'FE';
            _this.searchParams2.ORDER_TYPE = _this.activeIndex == 1?'FI':'FE';
            _this.searchParams3.ORDER_TYPE = _this.activeIndex == 1?'FI':'FE';
        },
        /**
         * 查看更多页面
         * statisticsPlace 1:左侧第一个统计图 2:左侧第二个统计图 3:左侧第三个统计图
         */
        lookMore(statisticsPlace){
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');

            switch (statisticsPlace) {
                case 1:{ //最近7天已完成订单统计
                    let queryData = {
                        title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                        statisticsType:"",
                        orderType:this.activeIndex == 1?'FI':'FE',
                    }
                    router.push({
                        path: '/closedOrder',
                        query:queryData,
                    });
                }
                    break;
                case 2:{ //最近7天不同运输方式订单统计
                    let queryData = {
                        title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                        statisticsType:"",
                        orderType:this.activeIndex == 1?'FI':'FE',
                    }
                    router.push({
                        path: '/transOrder',
                        query:queryData,
                    });
                }
                    break;
                case 3:{//最近30天已完成订单统计
                    let queryData = {
                        title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                        statisticsType:"",
                        orderType:this.activeIndex == 1?'FI':'FE',
                    }
                    router.push({
                        path: '/closedOrder',
                        query:queryData,
                    });
                }
                    break;
            
                default:
                    break;
            }
        },
        /**
         * 进入全部统计页面
         */
        gotoAllStatistics(){
            localStorage.removeItem("OrderIEType");
            localStorage.setItem("OrderIEType",this.activeIndex == 1?'FI':'FE');
            let queryData = {
                title:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                statisticsType:"",
                orderType:this.activeIndex == 1?'FI':'FE',
            }
            router.push({
                path: '/allStatistics',
                query:queryData,
            });
        },

        //左侧第一个统计图柱状图日期切换事件
        changePeriod1(item){
            let _this = this;
            _this.searchParams1.period = item;

            //获取操作已完成的订单量统计数据
            _this.getBarChartStatisticsData(_this.searchParams1,1);
        },
        //左侧第二个统计图柱状图日期切换事件
        changePeriod2(item){
            let _this = this;
            _this.searchParams2.period = item;

            //获取操作已完成的订单量统计数据
            _this.getBarChartStatisticsData(_this.searchParams2,2);
        },
        //右侧统计图柱状图日期切换事件
        changePeriod3(item){
            let _this = this;
            _this.searchParams3.period = item;

            //获取操作已完成的订单量统计数据
            _this.getBarChartStatisticsData(_this.searchParams3,3);
        },

        /**
         * 获取操作已完成的订单量统计数据
         * statisticsPlace 1:左侧第一个统计图 2:左侧第二个统计图 3:左侧第三个统计图
         */
        getBarChartStatisticsData(params,statisticsPlace){
            let _this = this;
            if(statisticsPlace == 1){
                _this.loading1 = true;
            }else if(statisticsPlace == 2){
                _this.loading2 = true;
            }else if(statisticsPlace == 3){
                _this.loading3 = true;
            }
            getBarChartStatistics(params).then(res => {
                if(statisticsPlace == 1){
                    _this.loading1 = false;
                }else if(statisticsPlace == 2){
                    _this.loading2 = false;
                }else if(statisticsPlace == 3){
                    _this.loading3 = false;
                }
                if (res.data.code === 0) {
                    if(statisticsPlace == 1){
                        _this.orderStatistics1 = res.data.data;
                    }else if(statisticsPlace == 2){
                        _this.orderStatistics2 = res.data.data;
                    }else if(statisticsPlace == 3){
                        _this.orderStatistics3 = res.data.data;
                    }
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                if(statisticsPlace == 1){
                    _this.loading1 = false;
                }else if(statisticsPlace == 2){
                    _this.loading2 = false;
                }else if(statisticsPlace == 3){
                    _this.loading3 = false;
                }
                let message = this.$i18n.t('message.common.systemError');
                if(err && err.data && err.data.code){
                    message = this.errcode.errCode.isCN?this.errcode.errCode[err.data.code].cn:this.errcode.errCode[err.data.code].en;
                }
                this.$message({
                    type: "error",
                    message: message
                });
            });
        },
    }
};
</script>
<style scoped>
    .statisticsBg{
        background-color:#f7f7f7 !important;
        height:835px !important;
    }
    .importStatistics{
        margin-top: 10px;
        height: 765px;
    }
    .statisticsDiv1{
        display: inline-block;
        position: relative;
        width: 50%;
        left: 0px;
        top: 0px;
        height: 350px;
        background-color:#fff;
    }
    .statisticsDiv2{
        display: inline-block;
        position: relative;
        width: 50%;
        left: 0px;
        top: 10px;
        height: 350px;
        background-color:#fff;
    }
    .statisticsDiv3{
        position: relative;
        display: inline-block;
        width: calc(50% - 10px);
        height: 711px;
        right: -5px;
        top: -350px;
        background-color:#fff;
    }
    .allStatisticsDiv{
        position: relative;
        width: 100%;
        height: 50px;
        color: #1585FF;
        background-color: #fff;
        margin-top: 10px;
        top: -350px;
    }

    .chartBgClass{
        /* margin:10px 10px; */
        background-color:#fff;
        /* width:calc(100% - 20px); */
        height:310px;
    }
    .chartBg3Class{
        /* margin:10px 10px; */
        background-color:#fff;
        /* width:calc(100% - 20px); */
        height:665px;
    }

    .titleDiv{
        height: 40px;
        width: 100%;
        background-color: #fff;
    }
    .titleSpan{
        line-height: 40px;
        margin-left: 20px;
        color: #333;
    }
    .lookMoreSpan{
        line-height: 40px;
        width: 70px;
        color: #1585FF;
        float: right;
        text-align:right;
        display: inline-flex;
        cursor:pointer;
    }
</style>

