<template>
    <div style="position: relative;height:100%;text-align:center;">
        <el-radio-group v-show="isHiddenPeriod==true" v-model="period" @change="periodChange" style="position: relative;width:100%;height:26px;top:30px;z-index:3;">
            <el-radio-button label="D">{{$t('message.statistics.day')}}</el-radio-button>
            <el-radio-button label="W">{{$t('message.statistics.week')}}</el-radio-button>
            <el-radio-button label="M">{{$t('message.statistics.month')}}</el-radio-button>
            <el-radio-button label="Q">{{$t('message.statistics.quarter')}}</el-radio-button>
            <el-radio-button label="Y">{{$t('message.statistics.year')}}</el-radio-button>
        </el-radio-group>
        <!-- <div :id="chartId" style="position: relative;height: calc(100% - 60px);margin: 0 auto;top:30px;"></div> -->
        <div ref="chartRef" style="position: relative;height: calc(100% - 60px);width:calc(100%);margin: 0 auto;top:30px;"></div>
        <!-- <div class="noData" style="color: #c23531" v-if="chartOption.data.lineDataList.valueList.length === 0 && chartOption.data.lineDataList.timestampList.length === 0 ">{{$t('message.common.noData')}}</div> -->
    </div>
</template>

<script>
/* 国际化 */
import i18n from '@/i18n/i18n'
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/calendar");
require("echarts/lib/component/grid");
require("echarts/lib/component/legend");
require("echarts/lib/component/dataZoom");
require("echarts/lib/component/toolbox");
import { format, numberFormat } from "@/util/util.js";
export default {
    name: "crosswiseBarChart",
    components: {},
    props: {
        chartOption: {
            type: Object
        },
        reload: {
            type: Number
        },
        defaultPeriod: {
            type: String,
            default:"M"
        },
        changePeriod:{
            type:Function
        },
        isShowStack:{
            type:Boolean,
            default:false
        },
        isHiddenPeriod:{
            type:Boolean,
            default:true
        }
    },
    watch: {
        reload: function() {
            this.getChartData();
        },
        chartOption: function() {
            this.getChartData();
        },
    },
    data() {
        return {
            chartId: "pieChart",
            chart: "",
            labelOption:{
                // show:true,
                // position:'right',
                formatter: '{c} {name|{a}}',
                fontSize: 16,
                rich: {
                    name: {
                        textBorderColor: '#fff'
                    }
                },
                // normal: {
                //     show: true,
                //     position: 'insideRight',
                //     formatter: '{c}'
                // }
            },
            period:this.defaultPeriod,

            testIndex:0,//测试柱状图显示多少条数据
        };
    },
    beforeDestroy: function() {
        window.onresize = null;
    },
    created(){
        
    },
    mounted() {
        this.$nextTick(() => {
            this.getChartData();
        });
    },
    methods: {
        periodChange(item){
            this.changePeriod(item);
        },
        getChartData() { console.log(i18n.t('message.statistics.restore'))
            let _this = this;
            // _this.chart = echarts.init(document.getElementById(_this.chartId));
            _this.chart = echarts.init(_this.$refs.chartRef);

            //获取底部legend数据显示
            let legendData = _this.getLegendData();
            //获取柱状图x轴数据title显示
            let xAxisData = _this.getXAxisData();
            //获取柱状图数据
            let seriesData = _this.getSeriesData();

            let option = {
                color: ['#f9a94f', '#5786b0'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    // formatter:'{c}%\n{name|{a}}'
                },
                legend: {
                    data: legendData,
                    bottom: 10
                    // top:20,
                },
                toolbox: {
                    show: true,
                    // orient: 'vertical',
                    left: 'center',
                    top: '10',
                    right:"10",
                    feature: {
                        // mark: {show: true},
                        // dataView: {show: false, readOnly: false,title:i18n.t('message.statistics.dataView')},
                        magicType: {
                            // show: true, 
                            type: [/*'line', 'bar',*/ 'stack', 'tiled'],
                            title:{
                                // line:i18n.t('message.statistics.line'),
                                // bar:i18n.t('message.statistics.bar'),
                                stack:i18n.t('message.statistics.stack'),
                                tiled:i18n.t('message.statistics.tiled'),
                            }
                        },
                        restore: {show: true,title:i18n.t('message.statistics.restore')},
                        saveAsImage: {show: true,title:i18n.t('message.statistics.saveImg')}
                    }
                },
                grid: {
                    // left: '3%',
                    // right: '4%',
                    // bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        data: xAxisData
                    }
                ],
                series: seriesData,
                // [
                //     {
                //         name: '结算中',
                //         type: 'bar',
                //         // barGap: 0,
                //         label: _this.labelOption,
                //         barWidth:35,
                //         data: [320, 332, 301, 334, 390]
                //     },
                //     {
                //         name: '归档',
                //         type: 'bar',
                //         barWidth:35,
                //         label: _this.labelOption,
                //         data: [220, 182, 191, 234, 290]
                //     },
                // ]
            };
            
            _this.chart.setOption(option, true);
            window.onresize = () => { 
                _this.chart.resize();
            };
        },
        //获取底部legend数据显示
        getLegendData() {
            let _this = this;
            let legendObj = _this.chartOption.legend;

            let legend = [];
            for (let key in legendObj) {
                legend.push(legendObj[key]);
            }

            return legend;
        },
        //获取柱状图x轴数据title显示
        getXAxisData() {
            let _this = this;
            let responseArr = _this.chartOption.response;
            // responseArr.sort((a,b)=>{return a.ORDER_TOTAL-b.ORDER_TOTAL});
            // responseArr.reverse();

            let newResArr = [];
            if(responseArr && responseArr.length>0){
                
                responseArr.forEach(element => {
                    let title =element.t;
                    newResArr.push(title);
                });
                //测试数据
                let testTitle = "123";
                for (let index = 0; index < _this.testIndex; index++) {
                    newResArr.push(testTitle);
                }

                newResArr.reverse();
            }

            return newResArr;
        },
        //获取柱状图数据
        getSeriesData(){
            let _this = this;
            let legendObj = _this.chartOption.legend;
            let responseArr = _this.chartOption.response;

            // responseArr.sort((a,b)=>{return a.ORDER_TOTAL-b.ORDER_TOTAL});
            // responseArr.reverse();

            console.log("_this.chartOption....",_this.chartOption);

            let seriesArr = [];
            
            if(legendObj){
                let keys = Object.keys(legendObj);
                for (let index = 0; index < keys.length; index++) {
                    const key = keys[index];
                    const valueName = legendObj[key];

                    let seriesData = {};
                    seriesData.name = valueName;
                    seriesData.type = "bar";
                    if(index != (keys.length-1)){
                        seriesData.barGap = 0;
                    }
                    if(_this.isShowStack == true){
                        seriesData.stack = "yes";
                    }
                    // seriesData.barWidth = 35;
                    seriesData.label = _this.labelOption;
                    seriesData.data = [];
                    if(responseArr && responseArr.length>0){
                        responseArr.forEach(element => {
                            let value = element[key];
                            seriesData.data.push(_this.isNullData(value)?0:value);
                        });

                        //测试数据
                        for (let index = 0; index < _this.testIndex; index++) {
                            seriesData.data.push(6);
                        }

                        seriesData.data.reverse();
                    }
                    seriesArr.push(seriesData);
                }
            }

            
            console.log("seriesArr....",seriesArr);
            return seriesArr;
        },
    }
};
</script>

<style scoped>
.noData {
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 46%;
}
.el-radio-button /deep/ .el-radio-button__inner{
    padding: 5px 20px !important;
    background:#fff !important;
    border-color: #DBDBDB !important;
    /* background-color: #1585FF !important; */
}
.el-radio-button /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #1585FF !important;
    border-color: #1585FF !important;
}
</style>
