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
    <div>
        <v-content-head :headTitle="`${nodesQuery.nodeIp}`" :headTitlePath="{path:'/hostDetail'}" :icon="true" @changGroup="changGroup"></v-content-head>
        <div class="module-wrapper">
            <div class="more-search-table">
                <div class="search-item">
                    <span>{{$t('message.common.showDate')}}</span>
                    <el-date-picker v-model="currentDate" type="date" :placeholder="$t('message.common.chooseDate')" :picker-options="pickerOption" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :default-value="`${Date()}`" class=" select-32" @change="changeCurrentDate">
                    </el-date-picker>
                </div>
                <div class="search-item">
                    <span>{{$t('message.common.comparisonDate')}}</span>
                    <el-date-picker v-model="contrastDate" type="date" :placeholder="$t('message.common.chooseDate')" :picker-options="pickerOption" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class=" select-32" @change="changeContrastDate">
                    </el-date-picker>
                </div>
                <div class="search-item">
                    <span>{{$t('message.common.startStopTime')}}</span>
                    <el-time-picker is-range v-model="startEndTime" :range-separator="$t('message.common.to')" :start-placeholder="$t('message.common.startTime')" :end-placeholder="$t('message.common.endTime')" :placeholder="$t('message.common.chooseTimeHorizon')" class="time-select-32">
                    </el-time-picker>
                </div>
                <div class="search-item">
                    <span>{{$t('message.common.dataFineness')}}</span>
                    <el-radio-group v-model="timeGranularity">
                        <el-radio :label="60">{{$t('message.common.min5')}}</el-radio>
                        <el-radio :label="12">{{$t('message.common.min1')}}</el-radio>
                        <el-radio :label="1">{{$t('message.common.sec5')}}</el-radio>
                    </el-radio-group>
                    <el-button type="primary" @click="confirmParam(tab)" size="small" style="margin-left: 12px;" :loading="sureing">{{$t('message.common.affirm')}}</el-button>
                </div>
            </div>
            <div class="metric-content">
                <el-button-group class="tab-list">
                    <el-button :class="tab==='hostInfo'?'active':''" @click="changeTab('hostInfo')">{{$t('message.nodeManagement.mainMsg')}}</el-button>
                    <el-button :class="tab==='chainInfo'?'active':''" @click="changeTab('chainInfo')">{{$t('message.nodeManagement.nodeMsg')}}</el-button>
                </el-button-group>
                <div class="tab-metric">
                    <el-row v-show="tab==='hostInfo'" v-loading="loadingInit">
                        <template v-for="item in metricData">
                            <el-col :xs='24' :sm="24" :md="24" :lg="12" :xl="12">
                                <v-metric-chart :chartOption="item" :reload="reloadNum" v-loading="loading"></v-metric-chart>
                            </el-col>
                        </template>
                    </el-row>
                    <el-row v-show="tab==='chainInfo'">
                        <template v-for="item in nodesHealthData">
                            <el-col :xs='24' :sm="24" :md="24" :lg="12" :xl="12">
                                <v-metric-chart :chartOption="item" :reload="nodesReloadNum" v-loading="loading" :metricName="'nodes'"></v-metric-chart>
                            </el-col>
                        </template>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import metricChart from "@/components/metricChart";
import { metricInfo, nodesHealth } from "@/util/api";
import { format, numberFormat,formatData } from "@/util/util.js";
import Bus from "@/bus"
export default {
    name: "hostDetail",
    components: {
        "v-content-head": contentHead,
        "v-metric-chart": metricChart
    },
    watch: {
        nodeIp: function() {
            this.getNodeIpDetail();
        },
        $route: function() {
            this.nodesQuery = this.$root.$route.query;
        }
    },
    data() {
        return {
            loadingInit: false,
            loading: false,
            sureing: false,
            currentDate: format(new Date().getTime(),'yyyy-MM-dd'),
            contrastDate: null,
            startEndTime: [new Date(formatData()), new Date()],
            beginDate: "",
            endDate: "",
            contrastBeginDate: "",
            contrastEndDate: "",
            timeGranularity: 60,
            chartType: "",
            reloadNum: 1,
            nodesReloadNum: 1,
            colNum: 12,
            tab: "hostInfo",
            chartParam: {
                gap: 60,
                beginDate: `${format(new Date().getTime(),'yyyy-MM-dd')}T${format(new Date(formatData()).getTime(),'HH:mm:ss')}`,
                endDate: `${format(new Date().getTime(),'yyyy-MM-dd')}T${format(new Date().getTime(),'HH:mm:ss')}`,
                contrastBeginDate: "",
                contrastEndDate: "",
                groupId: localStorage.getItem('groupId') ? localStorage.getItem('groupId') : '1'
            },
            chartTypeList: [
                {
                    type: "cpu",
                    name: "cpu"
                },
                {
                    type: "ram",
                    name: "ram"
                },
                {
                    type: "hd",
                    name: this.$i18n.t('message.common.hardDisk')
                }
            ],
            pickerOption: {
                disabledDate(time) {
                    return time.getTime() > Date.now() - 8.64e6;
                }
            },
            metricData: [],
            nodesHealthData: [],
            nodesQuery: this.$root.$route.query
        };
    },
    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
        this.getChartData();
    },
    methods: {
        changGroup(val){
            this.chartParam.groupId = val
            if(this.tab=='chainInfo') {
                this.getHealthData()
            }else{
                this.getChartData()
            }
        },
        getChartData() {
            if(this.reloadNum===1){
                this.loadingInit = true
            }
            this.loading = true;
            this.sureing = true;
            var reqData = {
                    nodeId: this.nodesQuery.nodeId
                },
                reqQurey = {};
            reqQurey = this.chartParam;
            metricInfo(reqData, reqQurey)
                .then(res => {
                    this.loadingInit = false;
                    this.loading = false;
                    this.sureing = false;
                    if (res.data.code === 0) {
                        var data = res.data.data;
                        if (
                            data[0]["data"]["lineDataList"]["timestampList"]
                                .length > 0
                        ) {
                            var timestampList =
                                data[0]["data"]["lineDataList"][
                                    "timestampList"
                                ] || [];
                        } else {
                            var timestampList =
                                data[0]["data"]["contrastDataList"][
                                    "timestampList"
                                ] || [];
                        }
                        this.metricData = data;
                        this.metricData.forEach(item => {
                            item.gap = this.timeGranularity;
                            if (item.metricType === "cpu") {
                                item.metricName = "cpu";
                                item.metricUint = this.$i18n.t('message.common.useRatio');
                                item.metricU = "%";
                            } else if (item.metricType === "memory") {
                                item.metricName = this.$i18n.t('message.common.memory');
                                item.metricUint = this.$i18n.t('message.common.useRatio');
                                item.metricU = "%";
                            } else if (item.metricType === "disk") {
                                item.metricName = this.$i18n.t('message.common.hardDisk');
                                item.metricUint = this.$i18n.t('message.common.useRatio');
                                item.metricU = "%";
                            } else if (item.metricType === "txbps") {
                                item.metricName = this.$i18n.t('message.common.upgoing');
                                item.metricUint = this.$i18n.t('message.common.bandwidth');
                                item.metricU = "KB/s";
                            } else if (item.metricType === "rxbps") {
                                item.metricName = this.$i18n.t('message.common.downgoing');
                                item.metricUint = this.$i18n.t('message.common.bandwidth');
                                item.metricU = "KB/s";
                            }
                            if(this.chartParam.contrastBeginDate){
                                item.data.contrastDataList.contractDataShow = true
                            }else{
                                item.data.contrastDataList.contractDataShow = false
                            }
                            item.data.contrastDataList.timestampList = timestampList;
                            item.data.lineDataList.timestampList = timestampList;
                        });
                        this.reloadNum++;
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                    }
                })
                .catch(err => {
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
        getHealthData() {
            this.loading = true;
            this.sureing = true;
            var reqData = {
                    nodeId: this.nodesQuery.nodeId
                },
                reqQurey = {};
            reqQurey = this.chartParam;
            nodesHealth(reqData, reqQurey)
                .then(res => {
                    this.loading = false;
                    this.sureing = false;
                    if (res.data.code === 0) {
                        var data = res.data.data;
                        if (
                            data[0]["data"]["lineDataList"]["timestampList"]
                                .length > 0
                        ) {
                            var timestampList =
                                data[0]["data"]["lineDataList"][
                                    "timestampList"
                                ] || [];
                        } else {
                            var timestampList =
                                data[0]["data"]["contrastDataList"][
                                    "timestampList"
                                ] || [];
                        }
                        this.nodesHealthData = data;
                        this.nodesHealthData.forEach(item => {
                            if (item.metricType === "blockHeight") {
                                item.metricName = this.$i18n.t('message.blockInfo.blockHeightOther');
                            } else if (item.metricType === "pbftView") {
                                item.metricName = this.$i18n.t('message.nodeManagement.pbftView');
                            }else if (item.metricType === 'pendingCount'){
                                item.metricName = this.$i18n.t('message.nodeManagement.packageTranNum');
                            }
                            item.data.contrastDataList.timestampList = timestampList;
                            item.data.lineDataList.timestampList = timestampList;
                        });
                        this.nodesReloadNum++;
                    } else {
                        this.$message({
                            type: "error",
                            message: this.errcode.errCode.isCN?this.errcode.errCode[res.data.code].cn:this.errcode.errCode[res.data.code].en
                        });
                    }
                })
                .catch(err => {
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
        changeCurrentDate($event) {
            this.startEndTime = [new Date(formatData()), new Date()];
        },
        changeContrastDate($event) {},
        confirmParam(val) {
            this.timeParam();
            switch (val) {
                case "hostInfo":
                    this.getChartData();
                    break;
                case "chainInfo":
                    this.getHealthData();
                    break;
            }
        },
        changeTab(tab) {
            if (!this.startEndTime || !this.currentDate) {
                this.$message({
                    type: "error",
                    message: this.$i18n.t('message.nodeManagement.chooseShowDateTime')
                });
                return;
            }
            if (!this.contrastDate && !this.startEndTime) {
                this.$message({
                    type: "error",
                    message: this.$i18n.t('message.nodeManagement.chooseShowDateTime')
                });
                return;
            }
            this.timeParam();
            this.tab = tab;
            switch (tab) {
                case "hostInfo":
                    this.confirmParam(tab);
                    break;
                case "chainInfo":
                    this.confirmParam(tab);
                    break;
            }
        },
        timeParam() {
            let initStartTime = format(new Date(this.startEndTime[0]).getTime(),'HH:mm:ss') ,
                initEndTime = format(new Date(this.startEndTime[1]).getTime(),'HH:mm:ss');
            if (this.currentDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
            }
            if (this.currentDate && this.contrastDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
                this.contrastBeginDate = `${this
                    .contrastDate}T${initStartTime}`;
                this.contrastEndDate = `${this.contrastDate}T${initEndTime}`;
            }
            if (!this.contrastDate) {
                this.beginDate = `${this.currentDate}T${initStartTime}`;
                this.endDate = `${this.currentDate}T${initEndTime}`;
                this.contrastBeginDate = "";
                this.contrastEndDate = "";
            }
            this.chartParam.beginDate = this.beginDate;
            this.chartParam.endDate = this.endDate;
            this.chartParam.contrastBeginDate = this.contrastBeginDate;
            this.chartParam.contrastEndDate = this.contrastEndDate;
            this.chartParam.gap = this.timeGranularity;
            this.chartParam.groupId = localStorage.getItem('groupId') ? localStorage.getItem('groupId') : '1';
        }
    }
};
</script>

<style scoped>
.search-item {
    display: inline-block;
    margin-bottom: 8px;
    margin-right: 12px;
}
.search-item > span {
    margin-right: 5px;
}
.more-search-table>>>.el-radio + .el-radio {
    margin-left: 10px;
}
.metric-content {
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom: 10px;
    padding-bottom: 15px;
}
.tab-metric {
    border: 1px solid #ddd;
    margin-top: -1px;
    min-height: 700px;
}
.tab-list>>>.el-button {
    border: none;
    background: transparent;
    padding: 10px 12px;
    color: #666666;
    border-radius: 0;
}
.tab-list>>>.el-button:hover {
    color: #1e1e1e;
}
.tab-list .active {
    color: #1a4ea1;
    background: #ffffff;
    border: 1px solid #ddd;
    border-bottom-color: #fff;
}

.tab-list .active:focus {
    color: #1a4ea1;
}
</style>
