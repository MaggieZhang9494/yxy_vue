<template>
    <div>
        <v-content-head :headTitle="title" :headTitlePath="{path:'/dayOrderStatus'}"></v-content-head>
        <div class="module-wrapper">
            <el-menu :default-active="activeIndex" class="el-menu-statistics" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                <el-menu-item index="1">{{$t('message.statistics.dayOrderStatus')}}</el-menu-item>
            </el-menu>
            <div style="padding:0px 0px 10px 0px;" v-show="activeIndex==1">
                <div style="border:solid 1px #f1f1f1;height:100%;margin:20px;">
                    <div style="padding:20px;">
						<div>
							<div class="search-item">
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
							</div>
							<div class="search-item">
								<span>{{$t('message.statistics.time')}}：</span>
								<el-date-picker style="width: 250px;" size="mini" v-model="currentDate" type="month" :placeholder="$t('message.common.chooseDate')" :picker-options="pickerOption" format="yyyy-MM" value-format="yyyy-MM" :default-value="`${Date()}`" @change="changeCurrentDate">
								</el-date-picker>
							</div>
						</div>
                        <div style="padding-top:10px;">
							<div class="search-item">
								<span>{{$t('message.businessSearch.searchMsg')}}：</span>
								<el-select v-model="filtrateKey" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
									<el-option v-if="isEN==false" v-for="item in filtrateMsgList" :key="item.value" :label="item.node" :value="item.value"></el-option>
									<el-option v-if="isEN" v-for="item in filtrateEnMsgList" :key="item.value" :label="item.node" :value="item.value"></el-option>
								</el-select>
								<el-input
									class="inputClass"
									size="mini"
									:placeholder="$t('message.common.input')"
									v-model="filtrateName"
									clearable>
								</el-input>
							</div>
							<el-button type="primary" @click="searchResult()" size="middle" style="display:inline-flex;float:right">{{$t('message.common.search')}}</el-button>
						</div>	
                    </div>
                    <div class="commonline" style="margin:0px 20px;width: calc(100% - 40px);"></div>
                    <div class="dayOrderchart-content" v-loading="loading">
                        <div class="chartBgClass">
                            <v-pie-chart :chartOption="orderStatistics" :selectTime="selectTime" :selectParam="selectParam"> </v-pie-chart>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import calendarPieChart from "./components/calendarPieChart";
import { getBusinessKindList, getDayOrderStatistics} from "@/util/api";
import { format, numberFormat,formatData } from "@/util/util.js";
import errcode from "@/util/errcode";
import Bus from "@/bus"
export default {
    name: "dayOrderStatus",
    components: {
        "v-content-head": contentHead,
        "v-pie-chart": calendarPieChart
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
            currentDate: format(new Date().getTime(), "yyyy-MM"),
            startEndTime: [
                new Date(formatData()),
                new Date()
            ],
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
			},
			
            //行业
            selectIndustry:[],
			industryList:[],
			//是否全选行业
			isSelectIndustyAll:false,

			//筛选条件
			filtrateKey:"",//进口筛选查询条件
			filtrateName:"",//进口筛选条件输入内容
			filtrateMsgList:[
				{node: "客户名称", value: "CUST_CN"},
				{node: "客户统一社会信用代码", value: "CREDIT_CODE"},
				{node: "消费使用单位", value: "PRD_NAME"},
			],
			filtrateEnMsgList:[
				{node: "Customer Name", value: "CUST_CN"},
				{node: "Customer USCC", value: "CREDIT_CODE"},
				{node: "Buyer", value: "PRD_NAME"},
			],
			isEN:(localStorage.getItem("internationalization")=='en')?true:false,
			//筛选列表
			oldFiltrateKey:"",//旧的筛选条件
			
			
            //查询参数
            searchParams:{
                appoint_y_m:"",//指定月份，不能为空
                BUSINESS_TYPE:"",//指定行业，可为空
				ORDER_TYPE:"FI",//订单类型 FI:进口/FE:出口，不能为空
            },

            //统计结果
            orderStatistics:{},
			selectTime:"",
			selectParam:{
				BUSINESS_TYPE:"",//选择行业
				filtrateKey:"",
				filtrateValue:""
			},
        };
    },
    created(){
        let _this = this;
        //处理中英文版本数据
        _this.dealZH_EN();
        //初始化列表查询参数
        _this.initSearchParams();

        //获取行业种类
        _this.loadBusinessKind();

        //获取每日订单状态情况统计数据
        _this.getDayOrderStatisticsData();
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
            //获取每日订单状态情况统计数据
            this.getDayOrderStatisticsData();
        },
        //初始化列表查询参数
        initSearchParams(){
            let _this = this;

            _this.title = _this.$route.query.title;

            _this.searchParams.ORDER_TYPE = localStorage.getItem("OrderIEType");
            _this.searchParams.appoint_y_m = _this.currentDate;
        },

        //处理搜索条件参数
        dealSearchParams(){

            let _this = this;

            //订单业务类型
            if(_this.isNullData(_this.searchParams.ORDER_TYPE)){
                this.$message.error(this.$i18n.t('message.statistics.orderTypeAlert'))
                return false;
            }
            //时间参数处理
            if(_this.isNullData(_this.currentDate)){
                this.$message.error(this.$i18n.t('message.statistics.searchTimeAlert'))
                return false;
            }else{ 
                _this.searchParams.appoint_y_m = _this.currentDate;
			}
			
			//行业种类处理
            if(!_this.isNullData(_this.selectIndustry) && _this.selectIndustry.length>0){
				if (!_this.isSelectIndustyAll) {
					_this.searchParams.BUSINESS_TYPE = _this.selectIndustry.join(",");
					_this.selectParam.BUSINESS_TYPE = _this.searchParams.BUSINESS_TYPE;
				} else {
					delete _this.searchParams.BUSINESS_TYPE
				}
            }else{
                delete _this.searchParams.BUSINESS_TYPE
			}
			
			//筛选查询条件处理
            if(!_this.isNullData(_this.filtrateKey) && !_this.isNullData(_this.filtrateName)){
				//先清空旧的筛选条件
                if(!_this.isNullData(_this.oldFiltrateKey)){
					delete _this.searchParams[_this.oldFiltrateKey]
                }
				_this.searchParams[_this.filtrateKey] = _this.filtrateName;
				_this.selectParam.filtrateKey = _this.filtrateKey;
				_this.selectParam.filtrateValue = _this.filtrateName;

				_this.oldFiltrateKey = _this.filtrateKey;
            }

			console.log("searchParams...", this.searchParams);
            return true;
        },

        //获取行业种类
        loadBusinessKind(){
            let reqData = {
                ORDER_TYPE:this.searchParams.ORDER_TYPE
            };
            getBusinessKindList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
					// this.industryList = res.data.data;
					
					//设置行业被选中状态，默认无行业被选中
                    this.industryList = res.data.data.map(item=>{
                        item.isSelect = false;
                        return item;
					});
					
					console.log("this.industryList...", this.industryList);
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
        //获取每日订单状态情况统计数据
        getDayOrderStatisticsData(){
            let _this = this;
            if(!_this.dealSearchParams()){
                return;
            }
            _this.loading = true;
            getDayOrderStatistics(_this.searchParams).then(res => {
                _this.loading = false;
                if (res.data.code === 0) {
                    _this.orderStatistics = res.data.data;

                    _this.selectTime = _this.currentDate;
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
            //获取每日订单状态情况统计数据
            this.getDayOrderStatisticsData();
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
        margin-bottom: 0px;
        margin-right: 12px;
        vertical-align: top;
    }
    .search-item > span {
        margin-right: 0px;
    }
    .el-select{
        width: 250px;
    }
    .dayOrderchart-content {
        min-height: 800px;

    }
    .chartBgClass{
        margin:20px 50px;
        background-color:#f1f1f1;
        width:calc(100% - 100px);
        height:800px;
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
        width: 298px;
        left: 10px;
    }

    /* 英文版本 */
    .en .inputClass{
        width: 301px;
        left: 10px;
    }
</style>
