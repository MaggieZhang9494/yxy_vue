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
        <v-content-head :headTitle="'message.menuName.IEBusiness'" :headTitlePath="{path:'/businessSearch'}" :icon="false"></v-content-head>
        <div class="module-wrapper">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#000" active-text-color="#1585FF">
                <el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01'].isSee==true" index="1">{{$t('message.businessSearch.portImport')}}</el-menu-item>
                <!-- v-show="isYuanChuAcc!='1' -->
				<el-menu-item v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02'].isSee==true && !isNoExportBus" index="2">{{$t('message.businessSearch.portExit')}}</el-menu-item>
            </el-menu>
            <!-- 口岸进口 -->
            <div class="searchView" v-if="activeIndex == 1">
                <div>
                    <div class="search-item">
                        <span>{{$t('message.common.chooseDate')}}：</span>
                        <el-date-picker
                            size="mini"
                            style="width: 250px;"
                            v-model="dateModelIn"
                            type="daterange"
                            unlink-panels
                            :picker-options="pickerOptions"
                            :range-separator="$t('message.common.to')"
                            :start-placeholder="$t('message.common.startDate')"
                            :end-placeholder="$t('message.common.endDate')"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                    <div v-show="isYuanChuAcc == '0'" class="search-item">
                        <span class="span1">{{$t('message.businessSearch.busKind')}}：</span>
                        <el-select v-model="industryIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in busKindList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="span1">{{$t('message.businessSearch.orderStatus')}}：</span>
                        <el-select v-model="orderStatusIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in orderStatusList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div>
                    <div class="search-item">
                        <span>{{$t('message.businessSearch.transportMode')}}：</span>
                        <el-select v-model="transportModeIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in transportModeList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="span1">{{$t('message.businessSearch.importCountry')}}：</span>
                        <el-select v-model="selectCountry" size="mini" @change="changeSelectCountrys" multiple filterable clearable :placeholder="$t('message.businessSearch.chooseCountryDesc')">
                            <el-option
                            v-for="item in importCountryList"
                            :key="item.value"
                            :label="item.node"
                            :value="item.value">
                            <span style="position: relative;float:left;left:-10px;width:20px;height:20px;">
                                <img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="item.isSelect === true">
                                <img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
                            </span>
                            <span :class="{'selectTrue': item.isSelect,'selectFalse': !item.isSelect}">{{ item.node }}</span>
                            </el-option>
                        </el-select>
                        <!-- <el-autocomplete
                            style="width: 250px;"
                            v-model="selectCountry"
                            :fetch-suggestions="countrySearch"
                            placeholder="请输入国家"
                            width="250"
                            @select="countrySelect">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                            </template>
                        </el-autocomplete> -->
                        <!-- <el-select v-model="nodeId" @change="changeNodes">
                            <el-option v-for="item in importCountryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
                    </div>
                    <div class="search-item">
                        <span class="span1">{{$t('message.businessSearch.importHarbor')}}：</span>
                        <el-select v-model="selectHarbor" size="mini" @change="changeSelectHarbors" multiple filterable clearable :placeholder="$t('message.businessSearch.chooseHarborDesc')">
                            <el-option
                            v-for="item in importHarborList"
                            :key="item.value"
                            :label="item.node"
                            :value="item.value">
                            <span style="position: relative;float:left;left:-10px;width:20px;height:20px;">
                                <img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="item.isSelect === true">
                                <img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
                            </span>
                            <span :class="{'selectTrue': item.isSelect,'selectFalse': !item.isSelect}">{{ item.node }}</span>
                            </el-option>
                        </el-select>
                        <!-- <el-autocomplete
                            style="width: 250px;"
                            v-model="selectHarbor"
                            :fetch-suggestions="harborSearch"
                            placeholder="请输入港口"
                            @select="harborSelect">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                            </template>
                        </el-autocomplete> -->

                        <!-- <el-select v-model="nodeId" @change="changeNodes">
                            <el-option v-for="item in importHarborList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
                    </div>
                </div>
                <div>
                    <div class="search-item">
                        <span>{{$t('message.businessSearch.searchMsg')}}：</span>
                        <el-select  v-model="screenSearchIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in searchMsgList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                        <el-input
                            size="mini"
                            :placeholder="$t('message.common.input')"
                            v-model="searchKeyIn"
                            clearable>
                        </el-input>
                    </div>
                    <el-button v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_01'].isSee==true" type="primary" @click="searchOrder()" size="small" style="display:inline-flex;float:right">{{$t('message.common.search')}}</el-button>
                </div>
            </div>
            <!-- 口岸出口 -->
            <div class="searchView"  v-if="activeIndex == 2">
                <div>
                    <div class="search-item">
                        <span>{{$t('message.common.chooseDate')}}：</span>
                        <el-date-picker
                        size="mini"
                            style="width: 250px;"
                            v-model="dateModelIn"
                            type="daterange"
                            unlink-panels
                            :picker-options="pickerOptions"
                            :range-separator="$t('message.common.to')"
                            :start-placeholder="$t('message.common.startDate')"
                            :end-placeholder="$t('message.common.endDate')"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            align="right">
                        </el-date-picker>
                    </div>
                    <div v-show="isYuanChuAcc == '0'" class="search-item">
                        <span class="span1">{{$t('message.businessSearch.busKind')}}：</span>
                        <el-select v-model="industryIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in busKindList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="span1">{{$t('message.businessSearch.orderStatus')}}：</span>
                        <el-select v-model="orderStatusIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in orderStatusList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div>
                    <div class="search-item">
                        <span>{{$t('message.businessSearch.transportMode')}}：</span>
                        <el-select v-model="transportModeIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in transportModeList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div class="search-item">
                        <span class="span1">{{$t('message.businessSearch.exportCountry')}}：</span>
                        <el-select v-model="selectCountry" size="mini" @change="changeSelectCountrys" multiple filterable clearable :placeholder="$t('message.businessSearch.chooseCountryDesc')">
                            <el-option
                            v-for="item in importCountryList"
                            :key="item.value"
                            :label="item.node"
                            :value="item.value">
                            <span style="position: relative;float:left;left:-10px;width:20px;height:20px;">
                                <img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="item.isSelect === true">
                                <img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
                            </span>
                            <span :class="{'selectTrue': item.isSelect,'selectFalse': !item.isSelect}">{{ item.node }}</span>
                            </el-option>
                        </el-select>
                        <!-- <el-autocomplete
                            style="width: 250px;"
                            v-model="selectCountry"
                            :fetch-suggestions="countrySearch"
                            placeholder="请输入国家"
                            width="250"
                            @select="countrySelect">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                            </template>
                        </el-autocomplete> -->
                        <!-- <el-select v-model="nodeId" @change="changeNodes">
                            <el-option v-for="item in importCountryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
                    </div>
                    <div class="search-item">
                        <span class="span1">{{$t('message.businessSearch.exportHarbor')}}：</span>
                        <el-select v-model="selectHarbor" size="mini" @change="changeSelectHarbors" multiple filterable clearable :placeholder="$t('message.businessSearch.chooseHarborDesc')">
                            <el-option
                            v-for="item in importHarborList"
                            :key="item.value"
                            :label="item.node"
                            :value="item.value">
                            <span style="position: relative;float:left;left:-10px;width:20px;height:20px;">
                                <img style="position: relative;top:3px;width:15px;height:15px;" src="../../../static/image/selected_true.png" v-if="item.isSelect === true">
                                <img style="position: relative;top:3px;width:15px;height:15px;border:1px solid lightgray;border-radius: 3px;" src="../../../static/image/selected_false.png" v-else>
                            </span>
                            <span :class="{'selectTrue': item.isSelect,'selectFalse': !item.isSelect}">{{ item.node }}</span>
                            </el-option>
                        </el-select>
                        <!-- <el-autocomplete
                            style="width: 250px;"
                            v-model="selectHarbor"
                            :fetch-suggestions="harborSearch"
                            placeholder="请输入港口"
                            @select="harborSelect">
                            <template slot-scope="{ item }">
                                <div class="name">{{ item.value }}</div>
                            </template>
                        </el-autocomplete> -->

                        <!-- <el-select v-model="nodeId" @change="changeNodes">
                            <el-option v-for="item in importHarborList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
                    </div>
                </div>
                <div>
                    <div class="search-item">
                        <span>{{$t('message.businessSearch.searchMsg')}}：</span>
                        <el-select v-model="screenSearchIn" size="mini" @change="changeNodes" :placeholder="$t('message.common.choose')">
                            <el-option v-for="item in searchMsgList" :key="item.value" :label="item.node" :value="item.value"></el-option>
                        </el-select>
                        <el-input
                            size="mini"
                            :placeholder="$t('message.common.input')"
                            v-model="searchKeyIn"
                            clearable>
                        </el-input>
                    </div>
                    <el-button v-if="perssionData.funcMenu['FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_01'].isSee==true" type="primary" @click="searchOrder()" size="small" style="display:inline-flex;float:right">{{$t('message.common.search')}}</el-button>
                </div>
            </div>
        </div>
        <v-load-dialog v-if="loading" :dialogVisible="loading" :isShowDeleteBtn="true" :cancel="loadCancel"> </v-load-dialog>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import loadDialog from "@/components/loadingDialog";
import { orderList, countryPortList, getFiltrateList, getTransModeList, getBusinessKindList,getOrderStatusList } from "@/util/api";
import { format, numberFormat,formatData } from "@/util/util.js";
import router from "@/router";
import errcode from "@/util/errcode";
import { mapState, mapActions } from 'vuex'
import Bus from "@/bus"

export default {
    name: "businessSearch",
    components: {
        "v-content-head": contentHead,
        "v-load-dialog":loadDialog,
    },
    data: function() {
        return {
            loading:false,
            activeIndex: '1', //1：口岸进口 2：口岸出口
            interval:null,//订单查询定时器
            headSubTitle:"",
            pickerOptions: {
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
            /* 口岸进口订单查询条件数据 */
            dateModelIn:[],//进口选择日期
            industryIn:"",//进口行业种类
            orderStatusIn:"",//进口订单状态
            transportModeIn:"",//进口运输方式
            screenSearchIn:"",//进口筛选查询条件
            searchKeyIn:"",//进口筛选条件输入内容

            oldScreenSearchIn:"",//旧的进口筛选查询条件

            //***********暂时不使用，进口出口查询分开后扩展***********//
            /* 口岸出口订单查询条件数据 */
            dateModelOut:[],//出口选择日期
            industryOut:"",//出口行业种类
            orderStatusOut:"",//出口订单状态
            transportModeOut:"",//出口运输方式
            screenSearchOut:"",//出口筛选查询条件
            searchKeyOut:"",//出口筛选条件输入内容

            /* 下拉列表项 */
            busKindList:[
                // {node:"服装",value:"服装"},
                // {node:"食品",value:"食品"},
                // {node:"整车",value:"整车"},
                // {node:"平行车",value:"平行车"},
                // {node:"零配件",value:"零配件"},
                // {node:"其他",value:"其他"},
            ],//行业种类
            orderStatusList:[],//订单状态列表
            transportModeList:[
                // {node:"水路运输",value:"水路运输"},
                // {node:"航空运输",value:"航空运输"},
                // {node:"铁路运输",value:"铁路运输"},
                // {node:"公路运输",value:"公路运输"},
                // {node:"邮件运输",value:"邮件运输"},
            ],//运输方式
            importCountryList:[],//进口启运国
            importHarborList:[],//进口启运港
            searchMsgList:[
                // {node:"工作号",value:"工作号"},
                // {node:"合同协议号",value:"合同协议号"},
                // {node:"报关单号",value:"报关单号"},
                // {node:"承运人提单号",value:"承运人提单号"},
                // {node:"分单号",value:"分单号"},
                // {node:"集装箱号",value:"集装箱号"},
                // {node:"客户名称",value:"客户名称"},
                // {node:"客户统一社会信用代码",value:"客户统一社会信用代码"},
                // {node:"消费使用单位",value:"消费使用单位"},
            ],//筛选条件

            /* 选中国家和港口信息 */
            selectCountry:[],
            selectHarbor:[],

            /* 搜索条件对象参数 */
            searchParams:{
                account:localStorage.getItem("user"),
                pageNumber: 1,
                pageSize: 5,
                start_at:"",//开始日期
                end_at:"",//结束日期
                ORDER_TYPE:"FI",//订单类型 FI:进口/FE:出口
                // taskId:"",//业务id
                BUSINESS_TYPE:"",//进口行业种类
                TRADE_TOOL_TYPE_NAME:"",//进口运输方式
                POL_NAME:"",//港口
                POL_COUNTRY:"",//国家
                ORDER_STATUS:"",//订单状态
                // screenSearchIn:"",//进口筛选查询条件
                // searchKeyIn:"",//进口筛选条件输入内容
            },

            //取消请求
            source:null,
            //请求是否返回
            isRequestReturn:false,
            //是否是元初客户
            isYuanChuAcc:localStorage.getItem("IsYuanChuAcc"),
            //是否没有口岸出口业务
			isNoExportBus:false,
			
			//权限数据
			perssionData:{},
        };
    },
    created(){
        if (this.isNullData(localStorage.getItem("groupId"))) {
            return;
		}

		this.perssionData = JSON.parse(localStorage.getItem("MenuDataCode"));
		
		if (this.$route.query && !this.isNullData(this.$route.query.params)) { //别的页面进入带的参数，进行自动查询
			let reqParams = this.$route.query.params;
			this.activeIndex = reqParams.activeIndex+"";
			this.dateModelIn = reqParams.dateModel;
			this.dateModelOut = reqParams.dateModel;
			this.orderStatusIn = reqParams.orderStatus;
			this.orderStatusOut = reqParams.orderStatus;
			if (!this.isNullData(reqParams.filtrateKey)) {
				this.screenSearchIn = reqParams.filtrateKey;
				this.searchKeyIn = reqParams.filtrateValue;
			}
			this.searchOrder();

			delete this.$route.query.params
		}else{
			//默认选择最近三天时间
			//当前设定的日期时间
			let currentDay = new Date;
			let endYear = currentDay.getFullYear();
			let endMonth = currentDay.getMonth()+1;
			let endDay = currentDay.getDate();
			endMonth = endMonth.toString().padStart(2, '0')
			endDay = endDay.toString().padStart(2, '0')
			let endDate = endYear+"-"+endMonth+"-"+endDay;
			this.dateModelIn.push(endDate)
			this.dateModelOut.push(endDate)
			//前三天设定的日期时间
			currentDay.setTime(currentDay.getTime()-3*24*60*60*1000);
			let startYear = currentDay.getFullYear();
			let startMonth = currentDay.getMonth()+1;
			let startDay = currentDay.getDate();
			startMonth = startMonth.toString().padStart(2, '0')
			startDay = startDay.toString().padStart(2, '0')
			let startDate = startYear+"-"+startMonth+"-"+startDay;
			this.dateModelIn.unshift(startDate)
			this.dateModelOut.unshift(startDate)
		}
		
        //获取国家/港口列表信息
        this.loadAllCountryData();

        //获取行业种类
        this.loadBusinessKind();
        //获取运输方式
        this.loadTransportMode();
        //获取筛选查询条件
        this.loadSearchMsg();
        //获取订单状态列表
        this.loadOrderStatus();
        console.log("this.perssionData...", this.perssionData);
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted: function() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        // this.importCountryList = this.loadAllCountryData();
        // this.importHarborList = this.loadAllHarborData();
    },
    methods: {
        ...mapActions([
            'setOrderSearchParams',
            'setOrderCurrentPage',
        ]),
        changGroup(val){
            //获取国家/港口列表信息
            this.loadAllCountryData();

            //获取行业种类
            this.loadBusinessKind();
            //获取运输方式
            this.loadTransportMode();
            //获取筛选查询条件
            this.loadSearchMsg();
            //获取订单状态列表
            this.loadOrderStatus();
        },
        changeCurrentDate($event) {
            this.startEndTime = [
                new Date(formatData()),
                new Date()
            ];
        },
        //停止定时器
        stopInterval(){
            let _this = this;
            if(_this.interval!=null){//判断计时器是否为空
				clearInterval(_this.interval);
				_this.interval=null;
			}
        },
        //处理搜索条件参数
        dealSearchParams(){

            let _this = this;
            _this.searchParams.ORDER_TYPE =  _this.activeIndex == 1?"FI":"FE";

            //选择日期处理
            if(!_this.isNullData(_this.dateModelIn)){
                _this.searchParams.start_at = _this.dateModelIn[0];
                _this.searchParams.end_at = _this.dateModelIn[1];
            }else{
                delete _this.searchParams.start_at
                delete _this.searchParams.end_at
            }
            //行业种类处理
            if(!_this.isNullData(_this.industryIn)){
                _this.searchParams.BUSINESS_TYPE = _this.industryIn;
            }else{
                delete _this.searchParams.BUSINESS_TYPE
            }
            //订单状态处理
            if(!_this.isNullData(_this.orderStatusIn)){
                _this.searchParams.ORDER_STATUS = _this.orderStatusIn;
            }else{
                delete _this.searchParams.ORDER_STATUS
            }
            //运输方式处理
            if(!_this.isNullData(_this.transportModeIn)){
                _this.searchParams.TRADE_TOOL_TYPE_NAME = _this.transportModeIn;
            }else{
                delete _this.searchParams.TRADE_TOOL_TYPE_NAME
            }
            //国家处理
            if(!_this.isNullData(_this.selectCountry) && _this.selectCountry.length>0){
                _this.searchParams.POL_COUNTRY = _this.selectCountry.join(",");
            }else{
                delete _this.searchParams.POL_COUNTRY
            }
            //港口处理
            if(!_this.isNullData(_this.selectHarbor && _this.selectHarbor.length>0)){
                _this.searchParams.POL_NAME = _this.selectHarbor.join(",");
            }else{
                delete _this.searchParams.POL_NAME
            }
            //筛选查询条件处理
            if(!_this.isNullData(_this.screenSearchIn) && !_this.isNullData(_this.searchKeyIn)){
                //先清空旧的筛选条件
                if(!_this.isNullData(_this.oldScreenSearchIn)){
                    delete _this.searchParams[_this.oldScreenSearchIn]
                }
				_this.searchParams[_this.screenSearchIn] = _this.searchKeyIn;
				_this.oldScreenSearchIn = _this.screenSearchIn;
            }

            console.log("searchParams...", this.searchParams);
        },
        //根据参数获取订单列表
        getOrderList(params){
            let _this = this;
            orderList(params,this).then(res => {
                _this.isRequestReturn = true;
                if (res.data.code === 0) {
                    let taskId = res.data.data.taskId;
                    if(_this.isNullData(taskId)){
                        _this.stopInterval();
                        _this.loading = false;
                        let orderList = res.data.data.data;
                        _this.total = res.data.data.total;

                        let queryData = {
                            listTitle:this.activeIndex == 1?'message.businessSearch.portImport':'message.businessSearch.portExit',
                            params:params,
                            orderList:orderList,
                            total:_this.total,
                            statistics:res.data.data.statistics
                        }

                        console.log("queryData...", queryData);
                        localStorage.removeItem("orderSearchParams");
                        console.log("缓存数据orderSearchParams....", JSON.parse(localStorage.getItem("orderSearchParams")));
                        localStorage.setItem("orderSearchParams",JSON.stringify(queryData));
                        _this.setOrderSearchParams(queryData);
                        router.push({
                            path: '/businessList',
                            query:queryData,
                        });
                    }else{
                        params.taskId = taskId;
                        _this.searchParams = params;
                        //启动定时器轮询
                        _this.stopInterval();
                        _this.interval = setInterval(()=>{
                            if(_this.isRequestReturn == true){
                                _this.isRequestReturn = false;
                                _this.getOrderList(_this.searchParams);
                            }
                        },5000);//启动计时器
                    }
                } else {
                    _this.stopInterval();
                    _this.loading = false;
                    let message = res.data.message?res.data.message:this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en;
                    this.$message({
                        type: "error",
                        message: message
                    });
                }
            })
            .catch(err => {
                _this.isRequestReturn = true;
                _this.stopInterval();
                _this.loading = false;
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
        //搜索订单事件
        searchOrder:function() {
			let _this = this;
			let ordertype = _this.activeIndex == 1?"FI":"FE";
			if (ordertype == "FI") {
				if (_this.perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_01.CODE_01"].isUse==false) {
					this.$message({
						type: "warning",
						message: this.$i18n.t('message.common.noPerssion')
					});
					return;
				}
			} else {
				if (_this.perssionData.funcMenu["FUNC.FUNC.CODE_03.CODE_01.CODE_02.CODE_01"].isUse==false) {
					this.$message({
						type: "warning",
						message: this.$i18n.t('message.common.noPerssion')
					});
					return;
				}
			}
			

            //清除详情页查询hash
            localStorage.removeItem("reqTxhash");
            localStorage.removeItem("OrderType");
            //更新查询
            this.setOrderCurrentPage(1);

            _this.dealSearchParams();

            _this.loading = true;
            _this.getOrderList(_this.searchParams);
            // router.push({path: '/businessList', query:{listTitle:this.activeIndex == 1?this.$i18n.t('message.businessSearch.portImport'):this.$i18n.t('message.businessSearch.portExit')}});
        },
        cancelQuest() {
            console.log('this.source。。。。', this.source);
            this.source.cancel('取消请求'); //取消请求
            this.loading = false;
            // if (typeof this.source == 'function') {
            //     this.source("取消请求。。。。。。。。。。。。。。"); //取消请求
            // }
        },
        loadCancel:function() {
            let _this = this;
            _this.$confirm( this.$i18n.t('message.common.loadCancel'), {
                confirmButtonText: _this.$i18n.t('message.common.affirm'),
                cancelButtonText: _this.$i18n.t('message.common.cancel'),
                type: 'warning'
            }).then(() => {
                console.log('done')
                _this.cancelQuest();
            }).catch(() => {
                console.log('close')
            });
        },
        changeNodes:function(params) {

        },
        handleSelect:function(val) {
            this.activeIndex = val;

            this.loadAllCountryData();
            this.selectCountry=[];
            this.selectHarbor=[];

            //获取行业种类
            this.loadBusinessKind();
            //获取运输方式
            this.loadTransportMode();
            //获取筛选查询条件
            this.loadSearchMsg();
            //获取订单状态列表
            this.loadOrderStatus();
        },

        /************************ 国家、港口数据处理 ************************/
        //加载所有国家信息
        loadAllCountryData(){
            // this.loading = true;
            let reqData = {};
            let reqQuery = {};
            countryPortList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    let countryList = res.data.data;
                    //设置国家被选中状态，默认无国家被选中
                    this.importCountryList = countryList.map(item=>{
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
            // [
            //     { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
            //     { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
            //     { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
            //     { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
            //     { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
            //     { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
            //     { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
            //     { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
            //     { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
            //     { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
            //     { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" }
            // ];
        },
        //国家搜索
        countrySearch(queryString, cb) {
            let importCountrys = this.importCountryList;
            var results = queryString ? importCountrys.filter(this.createFilter(queryString)) : importCountrys;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        //选中国家更新事件
        changeSelectCountrys(val){
            let _this = this;
            console.log("changeSelectCountrys...",val);
            //处理选中国家数据，更新选中状态
            _this.importCountryList = _this.importCountryList.map(element=>{
                let isSame = val.some(item=>{
                    return element.value == item;
                });
                element.isSelect = isSame;
                return element;
            })

            //处理选中国家数据，作为港口搜索参数
            let countryStr = val.join(",");
            console.log("countryStr...",countryStr);
            _this.importHarborList = [];
            _this.selectHarbor = [];
            if(!_this.isNullData(countryStr)){
                //加载港口对应列表信息
                _this.loadAllHarborData(countryStr);
            }

        },
        //加载所有港口信息
        loadAllHarborData(portId){
            let reqData = {
                portId:portId
            };
            let reqQuery = {};
            countryPortList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    let harborList = res.data.data;
                    //设置国家被选中状态，默认无国家被选中
                    this.importHarborList = harborList.map(item=>{
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
            // return [
            //     { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
            //     { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
            //     { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
            //     { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
            //     { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
            //     { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
            //     { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
            //     { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
            //     { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
            //     { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
            //     { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" }
            // ];
        },
        //港口搜索
        harborSearch(queryString, cb) {
            let importHarbors = this.importHarborList;
            var results = queryString ? importHarbors.filter(this.createFilter(queryString)) : importHarbors;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        changeSelectHarbors(val){
            let _this = this;
            console.log("changeSelectHarbors...",val);
            //处理选中港口数据，更新选中状态
            _this.importHarborList = _this.importHarborList.map(element=>{
                let isSame = val.some(item=>{
                    return element.value == item;
                });
                element.isSelect = isSame;
                return element;
            })

            //处理选中港口数据，生成港口查询参数

        },
        createFilter(queryString) {
            return (data) => {
                return (data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },

        //获取行业种类
        loadBusinessKind(){
            let reqData = {
                ORDER_TYPE:this.activeIndex == 1?"FI":"FE"
            };
            let reqQuery = {};
            getBusinessKindList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    this.busKindList = res.data.data;
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
        //加载订单状态列表
        loadOrderStatus(){
            let reqData = {
                ORDER_TYPE:this.activeIndex == 1?"FI":"FE"
            };
            let reqQuery = {};
            getOrderStatusList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    this.orderStatusList = res.data.data;
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
        //获取运输方式
        loadTransportMode(){
            let reqData = {
                ORDER_TYPE:this.activeIndex == 1?"FI":"FE"
            };
            let reqQuery = {};
            getTransModeList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    this.transportModeList = res.data.data;
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
        //获取筛选查询条件
        loadSearchMsg(){
            let reqData = {
                ORDER_TYPE:this.activeIndex == 1?"FI":"FE"
            };
            let reqQuery = {};
            getFiltrateList(reqData).then(res => {
                // this.loading = false;
                if (res.data.code === 0) {
                    this.searchMsgList = res.data.data;
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
    .searchView{
        margin: 20px;
    }
    .search-item {
        display: inline-block;
        margin-bottom: 15px;
        margin-right: 12px;
        vertical-align: top;
    }
    .search-item > span {
        margin-right: 0px;
    }
    /* .search-item /deep/ .el-input__inner {
        height: 32px;
        line-height: 32px;
    }
    .search-item /deep/ .el-input__icon {
        line-height: 32px;
    } */
    .el-select{
        width: 250px;
    }
    /* 中文版本 */
    .zh-cn span{
        position: relative;
        display: inline-block;
        width: 90px;
        text-align: right;
    }
    .zh-cn .span1{
        position: relative;
        display: inline-block;
        width: 90px;
        text-align: right;
    }
    /* 英文版本 */
    .en span{
        position: relative;
        display: inline-block;
        width: 160px;
        text-align: right;
    }
    .en .span1{
        position: relative;
        display: inline-block;
        width: 160px;
        text-align: right;
    }

    /* 中文版本 */
    .zh-cn .el-input{
        width: 338px;
        left: 18px;
    }

    /* 英文版本 */
    .en .el-input{
        width: 408px;
        left: 18px;
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
    .search-item /deep/ .el-range-editor--mini .el-range-separator{
        line-height: 25px !important;
    }
</style>

