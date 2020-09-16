/*
 * Top10海关编号
 */
<template>
    <div>
        <v-content-head :headTitle="title" :headTitlePath="{path:'/topHSCode'}"></v-content-head>
        <div class="module-wrapper">
            <el-menu :default-active="activeIndex" class="el-menu-statistics" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                <el-menu-item index="1">{{$t('message.statistics.top10HSCode')}}</el-menu-item>
            </el-menu>
            <div style="padding:0px 0px 10px 0px;" v-show="activeIndex==1">
                <div style="border:solid 1px #f1f1f1;height:100%;margin:20px;">
                    <div style="padding:20px 20px 10px 20px;">
                        <div>
                            <!-- <div class="search-item">
								<span>{{$t('message.statistics.belongsToIndustry')}}：</span>
								<el-select v-model="selectIndustry" size="mini" @change="changeIndustrys" multiple filterable clearable :placeholder="$t('message.common.choose')">
									<el-option
									v-for="item in industryList"
									:key="item.value"
									:label="item.node"
									:value="item.value">
									<span style="position: relative;float:left;left:-10px;width:20px;height:20px;">
										<img style="position: relative;top:3px;width:15px;height:15px;" src="../../../../static/image/selected_true.png" v-if="item.isSelect === true">
										<img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../../static/image/selected_false.png" v-else>
									</span>
									<span :class="{'selectTrue': item.isSelect,'selectFalse': !item.isSelect}">{{ item.node }}</span>
									</el-option>
								</el-select>
							</div> -->
							<div class="search-item">
                                <span>{{$t('message.statistics.summaryWay')}}：</span>
                                <el-select v-model="summaryWay" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                                    <el-option v-for="item in summaryWayList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                                </el-select>
                            </div>
                            <div class="search-item">
                                <span>{{$t('message.statistics.timeRange')}}：</span>
                                <el-date-picker
                                    size="mini"
                                    class="timeRangeClass"
                                    v-model="dateSelect"
                                    type="datetimerange"
                                    unlink-panels
                                    :picker-options="pickerOptions"
                                    :range-separator="$t('message.common.to')"
                                    :start-placeholder="$t('message.common.startDate')"
                                    :end-placeholder="$t('message.common.endDate')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </div>
                            <el-button type="primary" @click="searchResult()" size="middle" style="display:inline-flex;float:right">{{$t('message.common.search')}}</el-button>
                        </div>
                    </div>
                    <div class="commonline" style="margin:0px 20px;width: calc(100% - 40px);"></div>
                    <div class="transOrderChart-content" v-loading="loading">
                        <div class="chartBgClass">
                            <v-bar-chart :defaultPeriod="defaultPeriod" :changePeriod="changePeriod" :chartOption="orderStatistics" :isHiddenPeriod="false"> </v-bar-chart>
                        </div>
                    </div>
                </div>
                
            </div>
            
        </div>

    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import CrosswiseBarChart from "./components/crosswiseBarChart";
import { getBusinessKindList, getFilterDateList, getSummaryModeList,getBarChartStatistics,executeMultiReqest,getTransModeList } from "@/util/api";
import { format, numberFormat,formatData } from "@/util/util.js";
import errcode from "@/util/errcode";
import Bus from "@/bus"
export default {
    name: "topHSCode",
    components: {
        "v-content-head": contentHead,
        "v-bar-chart": CrosswiseBarChart
    },
    watch: {
        $route: function() {
            this.nodeId = this.$root.$route.query.nodeId;
        }
    },
    data() {
        return {
            loading: false,
            title:"",
            activeIndex:"1",
            currentDate: format(new Date().getTime(), "yyyy-MM-dd HH:mm:ss"),
            startEndTime: [
                new Date(formatData()),
                new Date()
            ],
            // pickerOptions: {
            //     disabledDate(time) {
            //         //选择最多最近六个月的时间  || (time.getTime() <= (Date.now() - 3600 * 1000 * 24 * 181))
            //         return (time.getTime() > Date.now() - 8.64e6);
            //     },
            // },

            yearValue:format(new Date().getTime(), "yyyy"),
            monthValue:"",
            dayValue:"",

            defaultPeriod:"Y",

            //查询参数
            searchParams:{
                // appoint_y:"",//指定年份，当` period=Y` 时，字段必填
                // appoint_y_m:"",//指定月份，当` period=M `时，字段必填
                // appoint_y_m_d:"",//指定日期，当` period=D `时，字段必填
                filter_date:"ACCEPT_DATE",//过滤日期 DZQQ_DATE 单证齐全日期，ACCEPT_DATE客户委托日期 必传
                ORDER_TYPE:"",//订单类型 FI:进口/FE:出口，必传
                summary_mode:"",//汇总方式，必传
                /*
                  D/W/M/Q/Y为单选项可选。
                  D: 每日daily （当日0点-24点）；
                  W: 每周Weekly （星期一0点-星期日24点），W01-W52；
                  M: 每月Monthly （每月1号0点-当月月末30或31号24点）；
                  Q: 每季Quarterly （1-3月为Q1, 4-6月为Q2，7-9月为Q3, 10-12为Q4) 每季第一个月的1号0点-当季度第3个月末30或31号24点）；
                  Y: 每年Yearly （每年1月1号0点-当年12月31号24点）。
                */
                period:"", // 必传
                SEQ:"5.2",
            },

            //统计结果
            orderStatistics:{},
            //所属行业
            selectIndustry:[],
			industryList:[],
			//是否全选行业
			isSelectIndustyAll:false,

			//汇总方式
            summaryWay:"",
			summaryWayList:[],

            // 时间范围选择器
            dateSelect:[],
            pickerOptions: {
                disabledDate(time) {
                    //选择最多最近六个月的时间  || (time.getTime() <= (Date.now() - 3600 * 1000 * 24 * 181))
                    return (time.getTime() > Date.now() - 8.64e6);
                },
                shortcuts: [{
                    text: this.$i18n.t('message.common.latelyWeek'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: this.$i18n.t('message.common.latelyMonth1'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: this.$i18n.t('message.common.latelyMonth3'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: this.$i18n.t('message.common.latelyMonth6'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
        };
    },
    created(){
        let _this = this;
        //处理中英文版本数据
        _this.dealZH_EN();
        //初始化列表查询参数
		_this.initSearchParams();
		// //获取行业列表
		// _this.loadBusinessKind();
		
		//获取汇总方式
        _this.loadSummaryModeList();
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
            //获取Top 10 海关编号统计数据
            this.getTransModeStatisticsData();
        },
        //初始化列表查询参数
        initSearchParams(){
            let _this = this;

            _this.title = _this.$route.query.title;

            _this.searchParams.ORDER_TYPE = localStorage.getItem("OrderIEType");
            // _this.searchParams.appoint_y_m_d = _this.dayValue;
            _this.searchParams.period = _this.defaultPeriod;
        },
        //处理搜索条件参数
        dealSearchParams(){

            let _this = this;

            //订单业务类型
            if(_this.isNullData(_this.searchParams.ORDER_TYPE)){
                this.$message.error(this.$i18n.t('message.statistics.orderTypeAlert'))
                return false;
            }

            // //选择年处理
            // if(!_this.isNullData(_this.yearValue)){
            //     _this.searchParams.appoint_y = _this.yearValue;
            //     _this.searchParams.period = "Y";
            // }else{
            //     delete _this.searchParams.appoint_y
            // }

            // //选择月处理
            // if(!_this.isNullData(_this.monthValue)){
            //     _this.searchParams.appoint_y_m = _this.monthValue;
            //     _this.searchParams.period = "M";
            // }else{
            //     delete _this.searchParams.appoint_y_m
            // }

            // //选择日处理
            // if(!_this.isNullData(_this.dayValue)){
            //     _this.searchParams.appoint_y_m_d = _this.dayValue;
            //     _this.searchParams.period = "D";
            // }else{
            //     delete _this.searchParams.appoint_y_m_d
            // }

            if(_this.isNullData(_this.yearValue) && _this.isNullData(_this.monthValue)  && _this.isNullData(_this.dayValue) ){
               delete _this.searchParams.period
            }
            if(_this.isNullData(_this.searchParams.period)){
                this.$message.error(this.$i18n.t('message.statistics.topNumTimeAlert'))
                return false;
            }
            //选择日期处理
            if(!_this.isNullData(_this.dateSelect)){
                _this.searchParams.appoint_time_l = _this.dateSelect[0];
                _this.searchParams.appoint_time_r = _this.dateSelect[1];
            }else{
                delete _this.searchParams.appoint_time_l
                delete _this.searchParams.appoint_time_r
			}
			
			//汇总方式处理
            if(!_this.isNullData(_this.summaryWay)){
                _this.searchParams.summary_mode = _this.summaryWay;
            }else{
                this.$message.error(this.$i18n.t('message.statistics.summaryWayAlert'))
                return false;
			}

            //行业种类处理
            if(!_this.isNullData(_this.selectIndustry) && _this.selectIndustry.length>0){
				if (!_this.isSelectIndustyAll) {
					_this.searchParams.BUSINESS_TYPE = _this.selectIndustry.join(",");
				} else {
					delete _this.searchParams.BUSINESS_TYPE
				}
            }else{
                delete _this.searchParams.BUSINESS_TYPE
			}

            return true;

            console.log("searchParams...", this.searchParams);
        },
        //获取Top 10 海关编号统计数据
        getTransModeStatisticsData(){
            let _this = this;
            if(!_this.dealSearchParams()){
                _this.loading = false;
                return;
            }
            getBarChartStatistics(_this.searchParams).then(res => {
                _this.loading = false;
                if (res.data.code === 0) {
                    _this.orderStatistics = res.data.data;
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                _this.loading = false;
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
        searchResult(){
            this.loading = true;
            //获取Top 10 海关编号统计数据
            this.getTransModeStatisticsData();
        },
        changeCurrentDate($event) {
            this.startEndTime = [
                new Date(formatData()),
                new Date()
            ];
		},
		//处理已选中行业
		dealSelectIndusty(){
			if(this.selectIndustry.length <= 0){
				return;
			}

			//如果已经选中了全部
			if (this.isSelectIndustyAll) {
				let isHaveAll = this.selectIndustry.some(value => value === "");
				if (isHaveAll) {
					// 如果之前选中了全部，则变化后肯定不包含全部了，去除全部
					let indexAll = 0;
					for (let index = 0; index < this.selectIndustry.length; index++) {
						const element = this.selectIndustry[index];
						if(element === ""){
							indexAll = index;
							break;
						}
					}
					this.selectIndustry.splice(indexAll,1);

					this.isSelectIndustyAll = false;
				} else {
					//本次取消全部
					this.selectIndustry = [];
					this.isSelectIndustyAll = false;
				}
			}else{
				let lastSelectValue = this.selectIndustry[this.selectIndustry.length-1];
				//如果最后选择是全部，则默认全选
				if(lastSelectValue === ""){
					this.selectIndustry = [];
					this.industryList.forEach(element => {
						this.selectIndustry.push(element.value);
					});
					this.isSelectIndustyAll = true;
				}else{
					// 如果当前不包含全部，则判断是否其他的七个日期全选了
					if (this.selectIndustry.length === this.industryList.length - 1) {
						// 如果其他员工全选了，则也将当前置为全部
						this.selectIndustry.push("");
						this.isSelectIndustyAll = true
					}
				}
			}
		},
		changeIndustrys(val){
			let _this = this;
			
			this.dealSelectIndusty();

            //处理选中国家数据，更新选中状态
            _this.industryList = _this.industryList.map(element=>{
                let isSame = _this.selectIndustry.some(item=>{
                    return element.value == item;
                });
                element.isSelect = isSame;
                return element;
			})
			console.log("changeIndustrys...",_this.selectIndustry);
		},
        changeNodes() {
            this.confirmParam();
        },
        confirmParam() {
            
        },
        handleSelect:function(val) {
            this.activeIndex = val;
        },
        //柱状图日期切换事件
        changePeriod(item){
            console.log("item....",item);
            let _this = this;
            _this.searchParams.period = item;

            //获取Top 10 海关编号统计数据
            _this.getTransModeStatisticsData();
        },
        //获取行业种类
        loadBusinessKind(){
            let reqData = {
                ORDER_TYPE:this.searchParams.ORDER_TYPE
            };
            let reqQuery = {};
            getBusinessKindList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    // this.industryList = res.data.data;
					
					//设置行业被选中状态，默认无行业被选中
                    this.industryList = res.data.data.map(item=>{
                        item.isSelect = false;
                        return item;
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
                // this.loading = false;
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
		//获取汇总方式
        loadSummaryModeList(){
            let reqData = {
                ORDER_TYPE:this.searchParams.ORDER_TYPE,
				SEQ:this.searchParams.SEQ
            };
            let reqQuery = {};
            getSummaryModeList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
					this.summaryWayList = res.data.data;
					
					if(this.summaryWayList && this.summaryWayList.length>0){
                        this.summaryWay = this.summaryWayList[0].value;
					}
					
					//获取Top 10 海关编号统计数据
            		this.getTransModeStatisticsData();
                } else {
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                // this.loading = false;
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

    .el-menu-statistics /deep/ .el-menu-item{
        height: 40px !important;
        line-height: 40px !important;
        font-size: 14px;
    }
    .search-item {
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 12px;
        vertical-align: top;
    }
    .search-item > span {
        margin-right: 0px;
    }
    .el-select{
        width: 200px;
    }
    .metric-content {
        min-height: 500px;
        padding-bottom:15px;
    }

    /* 中文版本 */
    .zh-cn span{
        position: relative;
        display: inline-block;
        width: 80px;
        text-align: right;
    }

    /* 英文版本 */
    .en span{
        position: relative;
        display: inline-block;
        width: 120px;
        text-align: right;
    }

    .search-item /deep/ .el-range-editor--mini .el-range-separator{
        line-height: 25px !important;
    }

    .transOrderChart-content {
        min-height: 700px;
    }
    .chartBgClass{
        margin:20px 50px;
        background-color:#f1f1f1;
        width:calc(100% - 100px);
        height:680px;
    }

    /* 中文版本 */
    .zh-cn .timeRangeClass{
        width: 490px;
    }

    /* 英文版本 */
    .en .timeRangeClass{
        width: 540px;
    }

	.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
        content: none;
    }
    .selectFalse{
        float: left;
        text-align:left;
        left:0px;
        color: #333;
        font-size: 13px;
    }
    .selectTrue{
        float: left;
        text-align:left;
        left:0px;
        color: #1585FF;
        font-size: 13px;
    }

	/* 中文版本 */
    .zh-cn .inputClass{
        width: 286px;
        left: 10px;
    }

    /* 英文版本 */
    .en .inputClass{
        width: 290px;
        left: 10px;
    }


</style>
